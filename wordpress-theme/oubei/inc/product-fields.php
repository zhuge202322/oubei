<?php
if (!defined('ABSPATH')) { exit; }

function oubei_sanitize_text_list(mixed $value): array {
    if (is_string($value)) {
        $value = preg_split('/\r\n|\r|\n/', $value) ?: [];
    }
    if (!is_array($value)) {
        return [];
    }

    $items = [];
    foreach ($value as $item) {
        if (!is_scalar($item)) {
            continue;
        }
        $item = sanitize_text_field((string) $item);
        if ($item !== '') {
            $items[] = $item;
        }
    }
    return array_values(array_unique($items));
}

function oubei_sanitize_gallery_ids(mixed $value): array {
    if (is_string($value)) {
        $value = explode(',', $value);
    }
    if (!is_array($value)) {
        return [];
    }

    $ids = array_map('absint', $value);
    return array_values(array_unique(array_filter($ids)));
}

function oubei_register_product_meta(): void {
    $text_meta = ['_oubei_code', '_oubei_material', '_oubei_short_description'];
    foreach ($text_meta as $meta_key) {
        register_post_meta('oubei_product', $meta_key, [
            'type' => 'string',
            'single' => true,
            'show_in_rest' => true,
            'sanitize_callback' => $meta_key === '_oubei_short_description' ? 'sanitize_textarea_field' : 'sanitize_text_field',
            'auth_callback' => static fn(bool $allowed, string $key, int $post_id): bool => current_user_can('edit_post', $post_id),
        ]);
    }

    foreach (['_oubei_applications', '_oubei_specs'] as $meta_key) {
        register_post_meta('oubei_product', $meta_key, [
            'type' => 'array',
            'single' => true,
            'default' => [],
            'show_in_rest' => ['schema' => ['type' => 'array', 'items' => ['type' => 'string']]],
            'sanitize_callback' => 'oubei_sanitize_text_list',
            'auth_callback' => static fn(bool $allowed, string $key, int $post_id): bool => current_user_can('edit_post', $post_id),
        ]);
    }

    register_post_meta('oubei_product', '_oubei_gallery_ids', [
        'type' => 'array',
        'single' => true,
        'default' => [],
        'show_in_rest' => ['schema' => ['type' => 'array', 'items' => ['type' => 'integer']]],
        'sanitize_callback' => 'oubei_sanitize_gallery_ids',
        'auth_callback' => static fn(bool $allowed, string $key, int $post_id): bool => current_user_can('edit_post', $post_id),
    ]);
}
add_action('init', 'oubei_register_product_meta', 11);

function oubei_add_product_meta_box(): void {
    add_meta_box('oubei-product-details', __('Product details', 'oubei'), 'oubei_render_product_meta_box', 'oubei_product', 'normal', 'high');
}
add_action('add_meta_boxes_oubei_product', 'oubei_add_product_meta_box');

function oubei_render_product_meta_box(WP_Post $post): void {
    wp_nonce_field('oubei_save_product_meta', 'oubei_product_meta_nonce');
    $data = oubei_get_product_data($post->ID);
    $gallery_ids = $data['gallery_ids'] ?? [];
    ?>
    <div class="oubei-product-fields">
        <p><label for="oubei-code"><strong><?php esc_html_e('Product code', 'oubei'); ?></strong></label><br>
            <input class="widefat" id="oubei-code" name="oubei_code" type="text" value="<?php echo esc_attr($data['code'] ?? ''); ?>"></p>
        <p><label for="oubei-material"><strong><?php esc_html_e('Material', 'oubei'); ?></strong></label><br>
            <input class="widefat" id="oubei-material" name="oubei_material" type="text" value="<?php echo esc_attr($data['material'] ?? ''); ?>"></p>
        <p><label for="oubei-short-description"><strong><?php esc_html_e('Short description', 'oubei'); ?></strong></label><br>
            <textarea class="widefat" id="oubei-short-description" name="oubei_short_description" rows="3"><?php echo esc_textarea($data['short_description'] ?? ''); ?></textarea></p>
        <p><label for="oubei-applications"><strong><?php esc_html_e('Applications', 'oubei'); ?></strong></label><br>
            <textarea class="widefat" id="oubei-applications" name="oubei_applications" rows="5" placeholder="<?php esc_attr_e('One item per line', 'oubei'); ?>"><?php echo esc_textarea(implode("\n", $data['applications'] ?? [])); ?></textarea></p>
        <p><label for="oubei-specs"><strong><?php esc_html_e('Specifications', 'oubei'); ?></strong></label><br>
            <textarea class="widefat" id="oubei-specs" name="oubei_specs" rows="5" placeholder="<?php esc_attr_e('One item per line', 'oubei'); ?>"><?php echo esc_textarea(implode("\n", $data['specs'] ?? [])); ?></textarea></p>
        <div>
            <strong><?php esc_html_e('Gallery', 'oubei'); ?></strong>
            <input id="oubei-gallery-ids" name="oubei_gallery_ids" type="hidden" value="<?php echo esc_attr(implode(',', $gallery_ids)); ?>">
            <ul id="oubei-gallery-preview" style="display:flex;flex-wrap:wrap;gap:8px">
                <?php foreach ($gallery_ids as $attachment_id) : ?>
                    <li data-attachment-id="<?php echo esc_attr((string) $attachment_id); ?>"><?php echo wp_kses_post(wp_get_attachment_image($attachment_id, 'thumbnail')); ?></li>
                <?php endforeach; ?>
            </ul>
            <button class="button" id="oubei-select-gallery" type="button"><?php esc_html_e('Select gallery images', 'oubei'); ?></button>
            <button class="button-link-delete" id="oubei-clear-gallery" type="button"><?php esc_html_e('Clear gallery', 'oubei'); ?></button>
        </div>
    </div>
    <?php
}

function oubei_save_product_meta(int $post_id): void {
    if (!isset($_POST['oubei_product_meta_nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['oubei_product_meta_nonce'])), 'oubei_save_product_meta')) {
        return;
    }
    if ((defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) || !current_user_can('edit_post', $post_id)) {
        return;
    }

    $text_fields = [
        '_oubei_code' => ['input' => 'oubei_code', 'sanitize' => 'sanitize_text_field'],
        '_oubei_material' => ['input' => 'oubei_material', 'sanitize' => 'sanitize_text_field'],
        '_oubei_short_description' => ['input' => 'oubei_short_description', 'sanitize' => 'sanitize_textarea_field'],
    ];
    foreach ($text_fields as $meta_key => $field) {
        $raw = isset($_POST[$field['input']]) ? wp_unslash($_POST[$field['input']]) : '';
        update_post_meta($post_id, $meta_key, call_user_func($field['sanitize'], $raw));
    }

    update_post_meta($post_id, '_oubei_applications', oubei_sanitize_text_list(isset($_POST['oubei_applications']) ? wp_unslash($_POST['oubei_applications']) : []));
    update_post_meta($post_id, '_oubei_specs', oubei_sanitize_text_list(isset($_POST['oubei_specs']) ? wp_unslash($_POST['oubei_specs']) : []));
    update_post_meta($post_id, '_oubei_gallery_ids', oubei_sanitize_gallery_ids(isset($_POST['oubei_gallery_ids']) ? wp_unslash($_POST['oubei_gallery_ids']) : []));
}
add_action('save_post_oubei_product', 'oubei_save_product_meta');

add_action('admin_enqueue_scripts', static function (string $hook): void {
    if (!in_array($hook, ['post.php', 'post-new.php'], true) || get_current_screen()?->post_type !== 'oubei_product') {
        return;
    }
    wp_enqueue_media();
    wp_add_inline_script('jquery-core', <<<'JS'
jQuery(function ($) {
  const ids = $('#oubei-gallery-ids');
  const preview = $('#oubei-gallery-preview');
  $('#oubei-select-gallery').on('click', function () {
    const frame = wp.media({ title: 'Select product gallery', button: { text: 'Use selected images' }, multiple: true });
    frame.on('select', function () {
      const selected = frame.state().get('selection').toJSON();
      ids.val(selected.map((item) => item.id).join(','));
      preview.empty();
      selected.forEach(function (item) {
        const url = item.sizes?.thumbnail?.url || item.url;
        $('<li>').attr('data-attachment-id', item.id).append($('<img>').attr({ src: url, alt: item.alt || '' })).appendTo(preview);
      });
    });
    frame.open();
  });
  $('#oubei-clear-gallery').on('click', function () { ids.val(''); preview.empty(); });
});
JS
    );
});

