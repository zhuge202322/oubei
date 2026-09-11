<?php
if (!defined('ABSPATH')) { exit; }
$nav = [
    ['label' => __('Products', 'oubei'), 'path' => '/products'],
    ['label' => __('Solutions', 'oubei'), 'path' => '/materials'],
    ['label' => __('OEM / ODM', 'oubei'), 'path' => '/custom'],
    ['label' => __('About us', 'oubei'), 'path' => '/about'],
    ['label' => __('Resources', 'oubei'), 'path' => '/resources'],
    ['label' => __('Blog', 'oubei'), 'path' => '/blog'],
    ['label' => __('FAQ', 'oubei'), 'path' => '/faq'],
    ['label' => __('Contact', 'oubei'), 'path' => '/quote'],
];
?><!doctype html>
<html <?php language_attributes(); ?>>
<head><meta charset="<?php bloginfo('charset'); ?>"><meta name="viewport" content="width=device-width, initial-scale=1"><?php wp_head(); ?></head>
<body <?php body_class(); ?>><?php wp_body_open(); ?>
<header class="site-header">
    <div class="oubei-container site-header__inner">
        <a class="site-brand" href="<?php echo esc_url(home_url('/')); ?>" aria-label="<?php echo esc_attr(get_bloginfo('name')); ?>">
            <?php if (has_custom_logo()) { the_custom_logo(); } else { ?><span class="site-brand__mark">OB</span><span><?php echo esc_html(get_bloginfo('name')); ?></span><?php } ?>
        </a>
        <button class="site-menu-toggle" type="button" aria-expanded="false" aria-controls="site-navigation"><span></span><span></span><span></span><span class="screen-reader-text"><?php esc_html_e('Open navigation', 'oubei'); ?></span></button>
        <nav id="site-navigation" class="site-nav" aria-label="<?php esc_attr_e('Primary navigation', 'oubei'); ?>">
            <?php foreach ($nav as $item) : ?><a href="<?php echo esc_url(home_url($item['path'])); ?>"><?php echo esc_html($item['label']); ?></a><?php endforeach; ?>
        </nav>
        <a class="button button--accent site-header__cta" href="<?php echo esc_url(home_url('/quote')); ?>"><?php esc_html_e('Inquiry now', 'oubei'); ?></a>
    </div>
</header>
