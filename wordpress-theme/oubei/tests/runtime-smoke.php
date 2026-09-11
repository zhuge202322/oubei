<?php
if (!function_exists('oubei_assert')) {
    function oubei_assert(bool $condition, string $message): void {
        if (!$condition) {
            throw new RuntimeException($message);
        }
    }
}

oubei_assert(get_stylesheet() === 'oubei', 'Oubei theme must be active');
oubei_assert(home_url('/') === 'http://localhost:6911/', 'Local URL must use port 6911');
oubei_assert(get_option('permalink_structure') === '/blog/%postname%/', 'Post permalinks must use /blog');
