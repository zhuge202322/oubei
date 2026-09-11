<?php
if (!defined('ABSPATH')) { exit; }
add_action('template_redirect', static function (): void { $path = trim(parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/', '/'); $redirects = ['contact' => 'quote', 'oem-odm' => 'custom']; if (isset($redirects[$path])) { wp_safe_redirect(home_url('/' . $redirects[$path]), 301); exit; } });
