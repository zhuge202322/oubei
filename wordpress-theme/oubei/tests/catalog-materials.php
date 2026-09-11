<?php
$products_html = wp_remote_retrieve_body(wp_remote_get(home_url('/products')));
foreach (['Precision O-Rings', 'Filters', 'Material', 'Hardness (Shore A)', 'Color', 'ISO Certified', 'Sort by:', 'Inquire Now'] as $copy) {
    oubei_assert(str_contains($products_html, $copy), "products copy missing: {$copy}");
}
oubei_assert(str_contains($products_html, 'catalog-filters'), 'catalog filters missing');
$materials_html = wp_remote_retrieve_body(wp_remote_get(home_url('/materials')));
foreach (['Choose the right compound for every seal.', 'All materials', 'Oil &amp; fuel', 'High temperature', 'Food &amp; medical', 'Water &amp; weather', 'Material categories', 'Performance at a glance', 'Talk to an engineer'] as $copy) {
    oubei_assert(str_contains($materials_html, $copy) || str_contains($materials_html, html_entity_decode($copy)), "materials copy missing: {$copy}");
}
oubei_assert(substr_count($materials_html, 'data-material-family') === 4, 'four material families required');
