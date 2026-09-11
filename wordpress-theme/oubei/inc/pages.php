<?php
if (!defined('ABSPATH')) { exit; }

function oubei_ensure_core_pages(): void {
    $pages = [
        'materials' => 'Materials', 'about' => 'About us', 'custom' => 'OEM / ODM', 'resources' => 'Resources',
        'faq' => 'FAQ', 'privacy' => 'Privacy', 'terms' => 'Terms', 'quote' => 'Request a quote', 'blog' => 'Blog',
    ];
    foreach ($pages as $slug => $title) {
        if (!get_page_by_path($slug, OBJECT, 'page')) { wp_insert_post(['post_type' => 'page', 'post_status' => 'publish', 'post_name' => $slug, 'post_title' => $title]); }
    }
}
add_action('after_switch_theme', 'oubei_ensure_core_pages');

function oubei_register_page_templates(): void {
    add_rewrite_rule('^resources/?$', 'index.php?pagename=resources', 'top');
    add_rewrite_rule('^blog/?$', 'index.php?pagename=blog', 'top');
}
add_action('init', 'oubei_register_page_templates');
