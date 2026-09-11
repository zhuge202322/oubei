<?php
$product = get_page_by_path('o-rings', OBJECT, 'oubei_product');
oubei_assert($product instanceof WP_Post, 'seed product missing');
$html = wp_remote_retrieve_body(wp_remote_get(get_permalink($product)));
oubei_assert(substr_count($html, 'rel="canonical"') === 1, 'exactly one canonical required');
oubei_assert(str_contains($html, 'application/ld+json'), 'product structured data missing');
$sitemap = wp_remote_retrieve_body(wp_remote_get(home_url('/wp-sitemap.xml')));
oubei_assert(str_contains($sitemap, 'oubei_product'), 'product sitemap missing');
