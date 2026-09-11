<?php
if (!defined('ABSPATH')) { exit; }
function oubei_get_canonical_url(): string { return esc_url_raw(is_singular() ? get_permalink() : home_url(add_query_arg([], $GLOBALS['wp']->request ?? ''))); }
remove_action('wp_head', 'rel_canonical');
add_action('wp_head', static function (): void { if (is_front_page()) return; $canonical = oubei_get_canonical_url(); if ($canonical) echo '<link rel="canonical" href="' . esc_url($canonical) . '">' . "\n"; if (is_singular(['oubei_product', 'post'])) echo '<script type="application/ld+json">' . wp_json_encode(['@context' => 'https://schema.org', '@type' => is_singular('oubei_product') ? 'Product' : 'Article', 'name' => get_the_title(), 'url' => $canonical]) . '</script>' . "\n"; });
