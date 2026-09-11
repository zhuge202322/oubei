<?php
oubei_ensure_core_pages();
flush_rewrite_rules(false);
foreach (['/','/products','/products/o-rings','/materials','/about','/custom','/resources','/faq','/quote','/privacy','/terms','/blog'] as $path) {
    $response = wp_remote_get(home_url($path));
    oubei_assert(wp_remote_retrieve_response_code($response) === 200, "$path failed");
}
oubei_assert(count(get_posts(['post_type' => 'oubei_product', 'post_status' => 'publish', 'numberposts' => -1])) >= 4, 'catalog import missing');
