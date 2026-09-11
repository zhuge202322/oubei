<?php
$id = wp_insert_post(['post_type' => 'oubei_product', 'post_title' => 'Future Dynamic Seal', 'post_name' => 'future-dynamic-seal', 'post_status' => 'publish']);
try {
    flush_rewrite_rules(false);
    $archive = wp_remote_retrieve_body(wp_remote_get(home_url('/products')));
    $detail = wp_remote_get(home_url('/products/future-dynamic-seal'));
    oubei_assert(str_contains($archive, 'Future Dynamic Seal'), 'new product missing from archive');
    oubei_assert(wp_remote_retrieve_response_code($detail) === 200, 'dynamic detail route missing');
} finally { wp_delete_post($id, true); }
