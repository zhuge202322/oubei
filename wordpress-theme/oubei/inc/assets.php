<?php
if (!defined('ABSPATH')) { exit; }

function oubei_asset_uri(string $path): string {
    return trailingslashit(get_theme_file_uri()) . ltrim($path, '/');
}

add_action('wp_enqueue_scripts', static function (): void {
    wp_enqueue_style('oubei-theme', get_stylesheet_uri(), [], '1.0.0');
});
