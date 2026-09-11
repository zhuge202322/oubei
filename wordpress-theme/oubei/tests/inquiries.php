<?php
add_filter('pre_wp_mail', static fn() => false);
$result = oubei_handle_inquiry(['name' => 'Test Buyer', 'company' => 'Buyer Co', 'email' => 'buyer@example.com', 'phone' => '+1 555 0100', 'country' => 'US', 'product_id' => 0, 'message' => 'Need a quotation', 'website' => ''], ['ip' => '127.0.0.50', 'nonce_valid' => true]);
oubei_assert($result['inquiry_id'] > 0, 'inquiry must persist');
oubei_assert($result['mail_sent'] === false, 'forced mail failure expected');
oubei_assert(get_post_status($result['inquiry_id']) === 'private', 'inquiry must remain private');
wp_delete_post($result['inquiry_id'], true);
remove_all_filters('pre_wp_mail');
