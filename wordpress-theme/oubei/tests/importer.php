<?php
$payload = json_decode(file_get_contents(get_theme_file_path('import/production-content.json')), true);
oubei_assert(is_array($payload) && ($payload['version'] ?? 0) === 1, 'production payload missing');
$first = oubei_import_production_content($payload);
$second = oubei_import_production_content($payload);
oubei_assert(($first['errors'] ?? []) === [] && ($second['errors'] ?? []) === [], 'import returned errors');
oubei_assert(count(get_posts(['post_type' => 'oubei_product', 'numberposts' => -1, 'post_status' => 'any'])) === count($payload['products']), 'product count mismatch');
oubei_assert(count(get_terms(['taxonomy' => 'oubei_product_category', 'hide_empty' => false])) === count($payload['categories']), 'category count mismatch');
oubei_assert(($second['created'] ?? 0) === 0, 'second import must not create duplicates');
