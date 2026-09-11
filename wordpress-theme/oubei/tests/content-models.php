<?php
oubei_assert(post_type_exists('oubei_product'), 'product post type missing');
oubei_assert(taxonomy_exists('oubei_product_category'), 'product taxonomy missing');
oubei_assert(post_type_exists('oubei_resource'), 'resource post type missing');

$product_meta = get_registered_meta_keys('post', 'oubei_product');
foreach (['_oubei_code', '_oubei_material', '_oubei_short_description', '_oubei_applications', '_oubei_specs', '_oubei_gallery_ids'] as $meta_key) {
    oubei_assert(isset($product_meta[$meta_key]), "product meta missing: {$meta_key}");
}

$product_id = wp_insert_post([
    'post_type' => 'oubei_product',
    'post_title' => 'Dynamic Test Seal',
    'post_status' => 'publish',
]);

oubei_assert(!is_wp_error($product_id) && $product_id > 0, 'temporary product could not be created');

try {
    update_post_meta($product_id, '_oubei_applications', [' Pumps ', '', 'Valves']);
    update_post_meta($product_id, '_oubei_specs', ['ISO 3601', ' 70 Shore A ']);
    update_post_meta($product_id, '_oubei_gallery_ids', [9, '12', 0, 'not-an-id']);
    $data = oubei_get_product_data($product_id);
    oubei_assert(
        $data['applications'] === ['Pumps', 'Valves'],
        'product lists not preserved'
    );
    oubei_assert($data['specs'] === ['ISO 3601', '70 Shore A'], 'specification list not normalized');
    oubei_assert($data['gallery_ids'] === [9, 12], 'gallery IDs not normalized');
} finally {
    wp_delete_post($product_id, true);
}
