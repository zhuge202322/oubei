<?php
oubei_ensure_core_pages();
flush_rewrite_rules(false);
foreach (['/materials','/about','/custom','/resources','/faq','/privacy','/terms'] as $path) {
    $response = wp_remote_get(home_url($path));
    oubei_assert(wp_remote_retrieve_response_code($response) === 200, "$path must return 200");
}
