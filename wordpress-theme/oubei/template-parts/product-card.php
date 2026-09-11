<?php
if (!defined('ABSPATH')) { exit; }
$product = oubei_get_product_data(get_the_ID());
$image_id = (int) ($product['featured_image_id'] ?? 0);
?>
<article class="oubei-product-card">
    <a href="<?php the_permalink(); ?>">
        <div class="oubei-product-card__image">
            <?php if ($image_id) { echo wp_kses_post(wp_get_attachment_image($image_id, 'medium_large', false, ['loading' => 'lazy'])); } else { $slot = oubei_get_media_slot('products.' . ($product['slug'] ?? '')); ?><img src="<?php echo esc_url($slot['url']); ?>" alt="<?php echo esc_attr($slot['alt']); ?>" loading="lazy"><?php } ?>
        </div>
        <div class="oubei-product-card__body"><p class="eyebrow"><?php echo esc_html($product['code'] ?? ''); ?></p><h3><?php echo esc_html($product['name'] ?? get_the_title()); ?></h3><p><?php echo esc_html($product['short_description'] ?? get_the_excerpt()); ?></p><span>View product →</span></div>
    </a>
</article>
