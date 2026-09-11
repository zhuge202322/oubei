<?php
if (!defined('ABSPATH')) { exit; }

require_once get_theme_file_path('inc/setup.php');
require_once get_theme_file_path('inc/assets.php');
require_once get_theme_file_path('inc/product-fields.php');
require_once get_theme_file_path('inc/products.php');
require_once get_theme_file_path('inc/resources.php');
require_once get_theme_file_path('inc/importer.php');
require_once get_theme_file_path('inc/settings-media.php');
require_once get_theme_file_path('inc/pages.php');

function oubei_assert(bool $condition, string $message): void {
    if (!$condition) { throw new RuntimeException($message); }
}
