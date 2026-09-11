<?php
if (!defined('ABSPATH')) { exit; }

function oubei_asset_uri(string $path): string {
    return trailingslashit(get_theme_file_uri()) . ltrim($path, '/');
}

add_action('wp_enqueue_scripts', static function (): void {
    $css = get_theme_file_path('assets/dist/theme.css');
    $js = get_theme_file_path('assets/dist/site.js');
    wp_enqueue_style('oubei-theme', oubei_asset_uri('assets/dist/theme.css'), [], file_exists($css) ? (string) filemtime($css) : '1.0.0');
    wp_enqueue_script('oubei-site', oubei_asset_uri('assets/dist/site.js'), [], file_exists($js) ? (string) filemtime($js) : '1.0.0', true);
});
