<?php
oubei_assert(current_theme_supports('title-tag'), 'title-tag support missing');
oubei_assert(current_theme_supports('post-thumbnails'), 'post thumbnails missing');
oubei_assert(array_key_exists('primary', get_registered_nav_menus()), 'primary menu missing');
do_action('wp_enqueue_scripts');
oubei_assert(wp_style_is('oubei-theme', 'enqueued'), 'compiled theme stylesheet missing');
$styles = wp_styles();
oubei_assert(str_contains((string) $styles->registered['oubei-theme']->src, 'assets/dist/theme.css'), 'theme must enqueue compiled CSS');
oubei_assert(wp_script_is('oubei-site', 'enqueued'), 'site JavaScript missing');
