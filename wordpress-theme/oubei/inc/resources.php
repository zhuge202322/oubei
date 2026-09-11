<?php
if (!defined('ABSPATH')) { exit; }

function oubei_register_resource_content(): void {
    register_post_type('oubei_resource', [
        'labels' => [
            'name' => __('Resources', 'oubei'),
            'singular_name' => __('Resource', 'oubei'),
            'add_new_item' => __('Add new resource', 'oubei'),
            'edit_item' => __('Edit resource', 'oubei'),
            'view_item' => __('View resource', 'oubei'),
            'search_items' => __('Search resources', 'oubei'),
            'not_found' => __('No resources found', 'oubei'),
        ],
        'public' => true,
        'show_in_rest' => true,
        'menu_icon' => 'dashicons-media-document',
        'supports' => ['title', 'editor', 'excerpt', 'thumbnail', 'page-attributes'],
        'has_archive' => 'resources',
        'rewrite' => ['slug' => 'resources', 'with_front' => false],
        'menu_position' => 21,
    ]);
}
add_action('init', 'oubei_register_resource_content');

