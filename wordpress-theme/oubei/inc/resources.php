<?php
if (!defined('ABSPATH')) { exit; }

function oubei_register_resource_content(): void {
    register_post_type('oubei_resource', [
        'labels' => [
            'name' => __('Resources', 'oubei'),
            'singular_name' => __('Resource', 'oubei'),
            'add_new_item' => __('Add new resource', 'oubei'),
            'edit_item' => __('Edit resource', 'oubei'),
            'view_item' => __('View resource', 'oubei'),
            'search_items' => __('Search resources', 'oubei'),
            'not_found' => __('No resources found', 'oubei'),
        ],
        'public' => true,
        'show_in_rest' => true,
        'menu_icon' => 'dashicons-media-document',
        'supports' => ['title', 'editor', 'excerpt', 'thumbnail', 'page-attributes'],
        'has_archive' => 'resources',
        'rewrite' => ['slug' => 'resources', 'with_front' => false],
        'menu_position' => 21,
    ]);
    register_taxonomy('oubei_resource_category', ['oubei_resource'], [
        'labels' => [
            'name' => __('Resource categories', 'oubei'),
            'singular_name' => __('Resource category', 'oubei'),
        ],
        'public' => true,
        'hierarchical' => true,
        'show_in_rest' => true,
        'show_admin_column' => true,
        'rewrite' => false,
    ]);
    register_post_meta('oubei_resource', '_oubei_reading_time', [
        'type' => 'string', 'single' => true, 'show_in_rest' => true,
        'sanitize_callback' => 'sanitize_text_field',
        'auth_callback' => static fn(bool $allowed, string $meta_key, int $post_id): bool => current_user_can('edit_post', $post_id),
    ]);
    register_post_meta('oubei_resource', '_oubei_media_slot', [
        'type' => 'string', 'single' => true, 'show_in_rest' => true,
        'sanitize_callback' => 'sanitize_text_field',
        'auth_callback' => static fn(bool $allowed, string $meta_key, int $post_id): bool => current_user_can('edit_post', $post_id),
    ]);
}
add_action('init', 'oubei_register_resource_content');

function oubei_get_resource_category(int $post_id): string {
    $terms = get_the_terms($post_id, 'oubei_resource_category');
    return is_array($terms) && isset($terms[0]) ? $terms[0]->name : __('Technical resource', 'oubei');
}

function oubei_get_resource_image(int $post_id): array {
    $thumbnail_id = get_post_thumbnail_id($post_id);
    if ($thumbnail_id) {
        $url = wp_get_attachment_image_url($thumbnail_id, 'full');
        if ($url) {
            $alt = (string) get_post_meta($thumbnail_id, '_wp_attachment_image_alt', true);
            return ['url' => $url, 'alt' => $alt !== '' ? $alt : get_the_title($post_id)];
        }
    }
    $slot = (string) get_post_meta($post_id, '_oubei_media_slot', true);
    return oubei_get_media_slot($slot !== '' ? $slot : 'resources.article.hero');
}

add_action('add_meta_boxes_oubei_resource', static function (): void {
    add_meta_box('oubei-resource-details', __('Resource details', 'oubei'), static function (WP_Post $post): void {
        wp_nonce_field('oubei_save_resource_details', 'oubei_resource_details_nonce');
        ?><p><label for="oubei-reading-time"><?php esc_html_e('Reading time', 'oubei'); ?></label><input class="widefat" id="oubei-reading-time" name="oubei_reading_time" value="<?php echo esc_attr((string) get_post_meta($post->ID, '_oubei_reading_time', true)); ?>" placeholder="6 min read"></p><?php
    }, 'oubei_resource', 'side', 'default');
});

add_action('save_post_oubei_resource', static function (int $post_id): void {
    if (!isset($_POST['oubei_resource_details_nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['oubei_resource_details_nonce'])), 'oubei_save_resource_details') || !current_user_can('edit_post', $post_id)) { return; }
    update_post_meta($post_id, '_oubei_reading_time', sanitize_text_field(wp_unslash($_POST['oubei_reading_time'] ?? '')));
});
