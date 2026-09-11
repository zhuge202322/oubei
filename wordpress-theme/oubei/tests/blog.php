<?php
$id = wp_insert_post(['post_type' => 'post', 'post_title' => 'WordPress Editing Test', 'post_name' => 'wordpress-editing-test', 'post_status' => 'publish', 'post_excerpt' => 'Editorial excerpt', 'post_content' => 'Article body']);
try {
    $list = wp_remote_retrieve_body(wp_remote_get(home_url('/blog')));
    $detail = wp_remote_get(home_url('/blog/wordpress-editing-test'));
    oubei_assert(str_contains($list, 'WordPress Editing Test'), 'post missing from blog list');
    oubei_assert(wp_remote_retrieve_response_code($detail) === 200, 'post detail missing');
} finally { wp_delete_post($id, true); }
