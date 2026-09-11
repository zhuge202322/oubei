<?php
if (!defined('ABSPATH')) { exit; }

function oubei_register_product_content(): void {
    register_post_type('oubei_product', [
        'labels' => [
            'name' => __('Products', 'oubei'),
            'singular_name' => __('Product', 'oubei'),
            'add_new_item' => __('Add new product', 'oubei'),
            'edit_item' => __('Edit product', 'oubei'),
            'new_item' => __('New product', 'oubei'),
            'view_item' => __('View product', 'oubei'),
            'search_items' => __('Search products', 'oubei'),
            'not_found' => __('No products found', 'oubei'),
            'menu_name' => __('Products', 'oubei'),
        ],
        'public' => true,
        'show_in_rest' => true,
        'menu_icon' => 'dashicons-products',
        'supports' => ['title', 'editor', 'excerpt', 'thumbnail', 'page-attributes'],
        'has_archive' => 'products',
        'rewrite' => ['slug' => 'products', 'with_front' => false],
        'menu_position' => 20,
    ]);

    register_taxonomy('oubei_product_category', ['oubei_product'], [
        'labels' => [
            'name' => __('Product categories', 'oubei'),
            'singular_name' => __('Product category', 'oubei'),
            'search_items' => __('Search product categories', 'oubei'),
            'all_items' => __('All product categories', 'oubei'),
            'edit_item' => __('Edit product category', 'oubei'),
            'update_item' => __('Update product category', 'oubei'),
            'add_new_item' => __('Add new product category', 'oubei'),
            'new_item_name' => __('New product category name', 'oubei'),
            'menu_name' => __('Categories', 'oubei'),
        ],
        'public' => true,
        'hierarchical' => true,
        'show_admin_column' => true,
        'show_in_rest' => true,
        'rewrite' => false,
    ]);
}
add_action('init', 'oubei_register_product_content');

add_action('pre_get_posts', static function (WP_Query $query): void {
    if (is_admin() || !$query->is_main_query() || !$query->is_post_type_archive('oubei_product')) { return; }
    $meta_query = [];
    $material = sanitize_text_field(wp_unslash($_GET['material'] ?? ''));
    if ($material !== '') { $meta_query[] = ['key' => '_oubei_material', 'value' => $material, 'compare' => 'LIKE']; }
    if ($meta_query) { $query->set('meta_query', $meta_query); }
    $query->set('posts_per_page', 12);
});

function oubei_get_product_data(int $post_id): array {
    $post = get_post($post_id);
    if (!$post instanceof WP_Post || $post->post_type !== 'oubei_product') {
        return [];
    }

    $applications = get_post_meta($post_id, '_oubei_applications', true);
    $specs = get_post_meta($post_id, '_oubei_specs', true);
    $gallery_ids = get_post_meta($post_id, '_oubei_gallery_ids', true);
    $categories = wp_get_post_terms($post_id, 'oubei_product_category');

    return [
        'id' => $post_id,
        'name' => get_the_title($post),
        'slug' => $post->post_name,
        'code' => (string) get_post_meta($post_id, '_oubei_code', true),
        'material' => (string) get_post_meta($post_id, '_oubei_material', true),
        'short_description' => (string) get_post_meta($post_id, '_oubei_short_description', true),
        'description' => $post->post_content,
        'applications' => oubei_sanitize_text_list($applications),
        'specs' => oubei_sanitize_text_list($specs),
        'gallery_ids' => oubei_sanitize_gallery_ids($gallery_ids),
        'categories' => is_wp_error($categories) ? [] : array_map(
            static fn(WP_Term $term): array => ['id' => $term->term_id, 'name' => $term->name, 'slug' => $term->slug],
            $categories
        ),
        'featured_image_id' => get_post_thumbnail_id($post_id),
        'permalink' => get_permalink($post),
    ];
}
