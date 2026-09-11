<?php
$payload = json_decode(file_get_contents(get_theme_file_path('import/production-content.json')), true);
oubei_assert(is_array($payload), 'production payload missing');
$import = oubei_import_production_content($payload);
oubei_assert(($import['errors'] ?? []) === [], 'resource import returned errors');
flush_rewrite_rules(false);

$expected = [
    'choosing-o-ring-hardness' => ['How to choose the right O-ring hardness for high-pressure systems', 'Match hardness to the pressure window'],
    'sealing-renewable-energy' => ['Specialized sealing for renewable energy infrastructure', 'Engineering context'],
    'global-shipping-update' => ['Expanded direct shipping routes to North America and the EU', 'What to validate'],
];

$home_html = wp_remote_retrieve_body(wp_remote_get(home_url('/')));
$archive_html = wp_remote_retrieve_body(wp_remote_get(home_url('/resources/')));
foreach ($expected as $slug => [$title, $body_copy]) {
    $resource = get_page_by_path($slug, OBJECT, 'oubei_resource');
    oubei_assert($resource instanceof WP_Post, "resource not imported: {$slug}");
    $permalink = get_permalink($resource);
    oubei_assert(str_contains($home_html, $title), "home missing resource: {$title}");
    oubei_assert(str_contains($home_html, $permalink), "home resource link missing: {$slug}");
    oubei_assert(str_contains($archive_html, $title), "resource archive missing: {$title}");

    $detail = wp_remote_get($permalink);
    oubei_assert(wp_remote_retrieve_response_code($detail) === 200, "resource detail must return 200: {$slug}");
    $detail_html = wp_remote_retrieve_body($detail);
    oubei_assert(str_contains($detail_html, $body_copy), "resource detail missing body copy: {$slug}");
    oubei_assert(str_contains($detail_html, (string) get_post_meta($resource->ID, '_oubei_reading_time', true)), "resource detail missing reading time: {$slug}");
}

$dynamic_id = wp_insert_post([
    'post_type' => 'oubei_resource',
    'post_status' => 'publish',
    'post_title' => 'Future dynamic engineering article',
    'post_name' => 'future-dynamic-engineering-article',
    'post_excerpt' => 'Created from the WordPress editor.',
    'post_content' => '<h2>Dynamic article body</h2><p>This content was created in WordPress.</p>',
    'post_date' => '2026-08-01 09:00:00',
]);
oubei_assert(!is_wp_error($dynamic_id) && $dynamic_id > 0, 'temporary resource could not be created');
try {
    $dynamic_home = wp_remote_retrieve_body(wp_remote_get(home_url('/')));
    $dynamic_archive = wp_remote_retrieve_body(wp_remote_get(home_url('/resources/')));
    oubei_assert(str_contains($dynamic_home, 'Future dynamic engineering article'), 'new resource must appear on home');
    oubei_assert(str_contains($dynamic_archive, 'Future dynamic engineering article'), 'new resource must appear in resource list');
    $dynamic_detail = wp_remote_get(get_permalink($dynamic_id));
    oubei_assert(wp_remote_retrieve_response_code($dynamic_detail) === 200, 'new resource detail must return 200');
    oubei_assert(str_contains(wp_remote_retrieve_body($dynamic_detail), 'Dynamic article body'), 'new resource body must render');
} finally {
    wp_delete_post($dynamic_id, true);
}
