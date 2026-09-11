<?php
if (!defined('ABSPATH')) { exit; }
get_header();
$rings = [
    ['tone' => '#c79a3b', 'size' => 'large', 'speed' => '0.003'],
    ['tone' => '#7d5bc6', 'size' => 'large', 'speed' => '-0.002'],
    ['tone' => '#d9b866', 'size' => 'medium', 'speed' => '0.0025'],
    ['tone' => '#9b7be1', 'size' => 'medium', 'speed' => '-0.0018'],
    ['tone' => '#ead69a', 'size' => 'small', 'speed' => '0.0015'],
];
?>
<main>
    <section class="oubei-hero">
        <div class="oubei-container oubei-hero__inner">
            <div class="oubei-hero__copy">
                <p class="eyebrow">Xingtai Oubei · Industrial sealing partner</p>
                <h1>Precision sealing components for demanding industries.</h1>
                <p class="lede">Advanced rubber and plastic components for global automotive, aerospace, and industrial applications.</p>
                <div class="oubei-hero__actions"><a class="button button--accent" href="<?php echo esc_url(home_url('/products')); ?>">Explore products</a><a class="button button--outline" href="<?php echo esc_url(home_url('/quote')); ?>">Request a quote</a></div>
            </div>
            <div class="oubei-hero__visual" data-oubei-hero>
                <?php foreach ($rings as $ring) : ?><span class="oubei-ring-descriptor" data-oubei-ring data-tone="<?php echo esc_attr($ring['tone']); ?>" data-size="<?php echo esc_attr($ring['size']); ?>" data-speed="<?php echo esc_attr($ring['speed']); ?>"></span><?php endforeach; ?>
                <noscript><div class="oubei-hero__fallback">Engineered rubber rings for reliable sealing.</div></noscript>
            </div>
        </div>
    </section>
    <section class="oubei-section"><div class="oubei-container"><p class="eyebrow">Featured catalog</p><h2>Built around your application.</h2><div class="oubei-card-grid">
        <?php $products = new WP_Query(['post_type' => 'oubei_product', 'post_status' => 'publish', 'posts_per_page' => 4]); if ($products->have_posts()) : while ($products->have_posts()) : $products->the_post(); get_template_part('template-parts/product-card'); endwhile; wp_reset_postdata(); else : ?><p><?php esc_html_e('Product catalog coming soon.', 'oubei'); ?></p><?php endif; ?>
    </div></div></section>
    <section class="oubei-section oubei-section--navy"><div class="oubei-container oubei-split"><div><p class="eyebrow">Engineering support</p><h2>From compound selection to repeat production.</h2><p>Share your drawing, media, or operating conditions. Our team will help you move from prototype to dependable supply.</p><a class="button button--accent" href="<?php echo esc_url(home_url('/custom')); ?>">Discuss a custom solution</a></div><div class="oubei-feature-image"><img src="<?php echo esc_url(oubei_get_media_slot('home.factory.workshop')['url']); ?>" alt="<?php echo esc_attr(oubei_get_media_slot('home.factory.workshop')['alt']); ?>"></div></div></section>
</main>
<?php get_footer();
