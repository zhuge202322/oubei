<?php
if (!defined('ABSPATH')) { exit; }

require_once get_theme_file_path('inc/setup.php');
require_once get_theme_file_path('inc/assets.php');

function oubei_assert(bool $condition, string $message): void {
    if (!$condition) { throw new RuntimeException($message); }
}
