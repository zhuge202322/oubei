<?php
if (!defined('ABSPATH')) { exit; }

function oubei_site_settings_defaults(): array {
    return [
        'site_name' => get_bloginfo('name'),
        'contact_name' => 'Xingtai Oubei Rubber Products Co., Ltd.',
        'contact_short_name' => 'Xingtai Oubei',
        'contact_email' => 'htobsealjason@outlook.com',
        'contact_phone' => '+86 18803390651',
        'contact_address' => 'Xingtai, Hebei, China',
        'contact_hours' => 'Mon-Fri, 08:30-17:30 (CST)',
        'inquiry_email' => 'htobsealjason@outlook.com',
        'logo_path' => '/logo.webp',
        'social_facebook' => '', 'social_instagram' => '', 'social_linkedin' => '',
        'social_tiktok' => '', 'social_whatsapp' => '', 'social_youtube' => '',
    ];
}

function oubei_get_setting(string $key, string $fallback = ''): string {
    $settings = get_option('oubei_site_settings', []);
    if (!is_array($settings)) { $settings = []; }
    $defaults = oubei_site_settings_defaults();
    $value = $settings[$key] ?? ($defaults[$key] ?? $fallback);
    return is_scalar($value) ? (string) $value : $fallback;
}

function oubei_media_slot_registry(): array {
    static $registry;
    if (is_array($registry)) { return $registry; }
    $registry = [];
    $path = get_theme_file_path('import/production-content.json');
    $payload = is_readable($path) ? json_decode((string) file_get_contents($path), true) : null;
    foreach (is_array($payload['mediaSlots'] ?? null) ? $payload['mediaSlots'] : [] as $slot) {
        $key = sanitize_key(str_replace('.', '_', (string) ($slot['slotKey'] ?? '')));
        if ($key === '') { continue; }
        $registry[$key] = [
            'slot_key' => (string) ($slot['slotKey'] ?? $key),
            'page_key' => sanitize_key((string) ($slot['pageKey'] ?? 'general')),
            'label' => sanitize_text_field((string) ($slot['label'] ?? $key)),
            'alt' => sanitize_text_field((string) ($slot['alt'] ?? '')),
            'default_path' => (string) ($slot['defaultPath'] ?? ''),
        ];
    }
    return $registry;
}

function oubei_get_media_slot(string $key): array {
    $registry = oubei_media_slot_registry();
    $normalized = sanitize_key(str_replace('.', '_', $key));
    $definition = $registry[$normalized] ?? null;
    if (!$definition) {
        return ['url' => '', 'alt' => '', 'is_default' => true];
    }
    $overrides = get_option('oubei_media_slots', []);
    $override = is_array($overrides) && isset($overrides[$normalized]) && is_array($overrides[$normalized]) ? $overrides[$normalized] : [];
    $attachment_id = absint($override['attachment_id'] ?? 0);
    $url = $attachment_id ? wp_get_attachment_image_url($attachment_id, 'full') : false;
    $alt = $attachment_id ? (string) get_post_meta($attachment_id, '_wp_attachment_image_alt', true) : '';
    if (!$url) {
        $default_path = ltrim($definition['default_path'], '/');
        $theme_default = get_theme_file_path('assets/defaults/' . $default_path);
        $url = file_exists($theme_default) ? oubei_asset_uri('assets/defaults/' . $default_path) : home_url($definition['default_path']);
        $alt = $definition['alt'];
    }
    return ['url' => (string) $url, 'alt' => $alt !== '' ? $alt : $definition['alt'], 'is_default' => !$attachment_id, 'slot_key' => $definition['slot_key']];
}

function oubei_settings_media_admin_menu(): void {
    add_menu_page(__('Oubei settings', 'oubei'), __('Oubei settings', 'oubei'), 'manage_options', 'oubei-settings', 'oubei_render_settings_page', 'dashicons-admin-customizer', 30);
    add_submenu_page('oubei-settings', __('Media slots', 'oubei'), __('Media slots', 'oubei'), 'manage_options', 'oubei-media-slots', 'oubei_render_media_slots_page');
}
add_action('admin_menu', 'oubei_settings_media_admin_menu');

function oubei_render_settings_page(): void {
    if (!current_user_can('manage_options')) { return; }
    if (isset($_POST['oubei_settings_nonce']) && wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['oubei_settings_nonce'])), 'oubei_save_settings')) {
        $keys = array_keys(oubei_site_settings_defaults()); $settings = [];
        foreach ($keys as $key) { $raw = isset($_POST[$key]) ? wp_unslash($_POST[$key]) : ''; $settings[$key] = str_contains($key, 'social_') || str_contains($key, 'email') ? esc_url_raw((string) $raw) : sanitize_text_field((string) $raw); }
        update_option('oubei_site_settings', $settings); echo '<div class="notice notice-success"><p>' . esc_html__('Settings saved.', 'oubei') . '</p></div>';
    }
    $fields = ['site_name' => 'Website name', 'contact_name' => 'Company name', 'contact_short_name' => 'Short name', 'contact_email' => 'Contact email', 'inquiry_email' => 'Inquiry notification email', 'contact_phone' => 'Phone', 'contact_address' => 'Address', 'contact_hours' => 'Business hours', 'logo_path' => 'Logo path'];
    $social = ['social_facebook' => 'Facebook', 'social_instagram' => 'Instagram', 'social_linkedin' => 'LinkedIn', 'social_tiktok' => 'TikTok', 'social_whatsapp' => 'WhatsApp', 'social_youtube' => 'YouTube'];
    echo '<div class="wrap"><h1>' . esc_html__('Oubei settings', 'oubei') . '</h1><form method="post">'; wp_nonce_field('oubei_save_settings', 'oubei_settings_nonce');
    foreach ([$fields, $social] as $group) { echo '<table class="form-table"><tbody>'; foreach ($group as $key => $label) { printf('<tr><th><label for="%1$s">%2$s</label></th><td><input class="regular-text" id="%1$s" name="%1$s" value="%3$s" type="text"></td></tr>', esc_attr($key), esc_html__($label, 'oubei'), esc_attr(oubei_get_setting($key))); } echo '</tbody></table>'; }
    submit_button(); echo '</form></div>';
}

function oubei_render_media_slots_page(): void {
    if (!current_user_can('manage_options')) { return; }
    if (isset($_POST['oubei_media_nonce']) && wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['oubei_media_nonce'])), 'oubei_save_media_slots')) {
        $overrides = [];
        foreach (oubei_media_slot_registry() as $normalized => $definition) { $id = absint($_POST['slot_' . $normalized] ?? 0); if ($id) { $overrides[$normalized] = ['attachment_id' => $id]; } }
        update_option('oubei_media_slots', $overrides); echo '<div class="notice notice-success"><p>' . esc_html__('Media slots saved.', 'oubei') . '</p></div>';
    }
    echo '<div class="wrap"><h1>' . esc_html__('Oubei media slots', 'oubei') . '</h1><p>' . esc_html__('Exactly 48 page image slots are available. Use the Media Library to override any default.', 'oubei') . '</p><form method="post">'; wp_nonce_field('oubei_save_media_slots', 'oubei_media_nonce');
    echo '<table class="widefat striped"><thead><tr><th>Slot</th><th>Default</th><th>Override attachment ID</th></tr></thead><tbody>';
    $overrides = get_option('oubei_media_slots', []);
    foreach (oubei_media_slot_registry() as $normalized => $definition) { $current = absint($overrides[$normalized]['attachment_id'] ?? 0); printf('<tr><td><code>%s</code><br>%s</td><td>%s</td><td><input type="number" min="0" name="slot_%s" value="%d"></td></tr>', esc_html($definition['slot_key']), esc_html($definition['label']), esc_html($definition['default_path']), esc_attr($normalized), $current); }
    echo '</tbody></table>'; submit_button(__('Save media slots', 'oubei')); echo '</form></div>';
}

