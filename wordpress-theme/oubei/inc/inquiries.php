<?php
if (!defined('ABSPATH')) { exit; }

function oubei_register_inquiry_content(): void { register_post_type('oubei_inquiry', ['labels' => ['name' => __('Inquiries', 'oubei'), 'singular_name' => __('Inquiry', 'oubei')], 'public' => false, 'show_ui' => true, 'show_in_menu' => true, 'menu_icon' => 'dashicons-email-alt', 'supports' => ['title'], 'capability_type' => 'post', 'map_meta_cap' => true]); }
add_action('init', 'oubei_register_inquiry_content');

function oubei_handle_inquiry(array $input, array $context = []): array {
    $name = sanitize_text_field((string) ($input['name'] ?? '')); $company = sanitize_text_field((string) ($input['company'] ?? '')); $email = sanitize_email((string) ($input['email'] ?? '')); $phone = sanitize_text_field((string) ($input['phone'] ?? '')); $country = sanitize_text_field((string) ($input['country'] ?? '')); $message = sanitize_textarea_field((string) ($input['message'] ?? '')); $product_id = absint($input['product_id'] ?? 0);
    if (!empty($input['website'])) return ['success' => false, 'inquiry_id' => 0, 'error' => 'Invalid submission', 'mail_sent' => false];
    if ($name === '' || $company === '' || !is_email($email) || $message === '') return ['success' => false, 'inquiry_id' => 0, 'error' => 'Please complete the required fields.', 'mail_sent' => false];
    $post_id = wp_insert_post(['post_type' => 'oubei_inquiry', 'post_status' => 'private', 'post_title' => $company . ' — ' . $name, 'post_content' => $message], true);
    if (is_wp_error($post_id)) return ['success' => false, 'inquiry_id' => 0, 'error' => 'Unable to save inquiry.', 'mail_sent' => false];
    foreach (['_oubei_name' => $name, '_oubei_company' => $company, '_oubei_email' => $email, '_oubei_phone' => $phone, '_oubei_country' => $country, '_oubei_product_id' => $product_id, '_oubei_message' => $message, '_oubei_status' => 'new'] as $key => $value) update_post_meta($post_id, $key, $value);
    $to = oubei_get_setting('inquiry_email', oubei_get_setting('contact_email', get_option('admin_email'))); $sent = wp_mail($to, 'New Oubei inquiry: ' . $company, "Name: {$name}\nEmail: {$email}\nPhone: {$phone}\nCountry: {$country}\n\n{$message}", ['Reply-To: ' . $email]);
    update_post_meta($post_id, '_oubei_mail_status', $sent ? 'sent' : 'failed'); if (!$sent) update_post_meta($post_id, '_oubei_mail_error', 'wp_mail returned false');
    return ['success' => true, 'inquiry_id' => (int) $post_id, 'error' => '', 'mail_sent' => (bool) $sent];
}

add_filter('manage_oubei_inquiry_posts_columns', static fn(array $columns): array => array_merge(['cb' => '<input type="checkbox">', 'title' => 'Inquiry', 'email' => 'Email', 'status' => 'Status'], $columns));
add_action('manage_oubei_inquiry_posts_custom_column', static function (string $column, int $post_id): void { if ($column === 'email') echo esc_html((string) get_post_meta($post_id, '_oubei_email', true)); if ($column === 'status') echo esc_html((string) get_post_meta($post_id, '_oubei_status', true)); }, 10, 2);
