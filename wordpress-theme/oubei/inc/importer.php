<?php
if (!defined('ABSPATH')) { exit; }

function oubei_import_production_content(array $payload): array {
    $result = ['created' => 0, 'updated' => 0, 'skipped' => 0, 'errors' => []];
    if (($payload['version'] ?? null) !== 1) { $result['errors'][] = 'Unsupported import version'; return $result; }
    foreach (($payload['settings'] ?? []) as $key => $value) {
        if (is_string($key) && is_scalar($value)) { $settings = (array) get_option('oubei_site_settings', []); $settings[sanitize_key($key)] = sanitize_textarea_field((string) $value); update_option('oubei_site_settings', $settings); }
    }
    $term_ids = [];
    foreach (($payload['categories'] ?? []) as $category) {
        $slug = sanitize_title($category['slug'] ?? ''); if ($slug === '') { $result['skipped']++; continue; }
        $term = get_term_by('slug', $slug, 'oubei_product_category');
        $args = ['description' => sanitize_textarea_field((string) ($category['description'] ?? '')), 'slug' => $slug];
        if (!$term) { $created = wp_insert_term(sanitize_text_field((string) ($category['name'] ?? $slug)), 'oubei_product_category', $args); if (is_wp_error($created)) { $result['errors'][] = $created->get_error_message(); continue; } $term_id = (int) $created['term_id']; $result['created']++; }
        else { wp_update_term($term->term_id, 'oubei_product_category', ['name' => sanitize_text_field((string) ($category['name'] ?? $term->name)), 'description' => $args['description']]); $term_id = (int) $term->term_id; $result['updated']++; }
        $term_ids[$slug] = $term_id;
    }
    foreach (($payload['products'] ?? []) as $product) {
        $slug = sanitize_title($product['slug'] ?? ''); if ($slug === '') { $result['skipped']++; continue; }
        $existing = get_page_by_path($slug, OBJECT, 'oubei_product');
        $postarr = ['post_type' => 'oubei_product', 'post_status' => 'publish', 'post_name' => $slug, 'post_title' => sanitize_text_field((string) ($product['name'] ?? $slug)), 'post_content' => wp_kses_post((string) ($product['description'] ?? '')), 'post_excerpt' => sanitize_textarea_field((string) ($product['shortDescription'] ?? ''))];
        if ($existing) { $postarr['ID'] = $existing->ID; $post_id = wp_update_post($postarr, true); $result['updated']++; } else { $post_id = wp_insert_post($postarr, true); $result['created']++; }
        if (is_wp_error($post_id)) { $result['errors'][] = $post_id->get_error_message(); continue; }
        $post_id = (int) $post_id;
        if (!empty($product['categorySlug']) && isset($term_ids[$product['categorySlug']])) { wp_set_post_terms($post_id, [$term_ids[$product['categorySlug']]], 'oubei_product_category', false); }
        update_post_meta($post_id, '_oubei_code', sanitize_text_field((string) ($product['code'] ?? '')));
        update_post_meta($post_id, '_oubei_material', sanitize_text_field((string) ($product['material'] ?? '')));
        update_post_meta($post_id, '_oubei_short_description', sanitize_textarea_field((string) ($product['shortDescription'] ?? '')));
        update_post_meta($post_id, '_oubei_applications', oubei_sanitize_text_list($product['applications'] ?? []));
        update_post_meta($post_id, '_oubei_specs', oubei_sanitize_text_list($product['specs'] ?? []));
    }
    return $result;
}
