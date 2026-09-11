<?php
if (!defined('ABSPATH')) { exit; }
get_header();
while (have_posts()) : the_post();
    $resource_id = get_the_ID();
    $category = oubei_get_resource_category($resource_id);
    $reading_time = (string) get_post_meta($resource_id, '_oubei_reading_time', true);
    $image = oubei_get_resource_image($resource_id);
?>
<main class="oubei-resource-detail"><article>
<header class="oubei-resource-detail-header"><div class="oubei-container"><nav class="oubei-breadcrumbs"><a href="<?php echo esc_url(home_url('/')); ?>">Home</a><span>›</span><a href="<?php echo esc_url(home_url('/resources/')); ?>">Resources</a><span>›</span><strong><?php echo esc_html($category); ?></strong></nav><div class="oubei-resource-detail-heading"><div><p class="eyebrow"><?php echo esc_html($category); ?></p><h1><?php the_title(); ?></h1><p><?php echo esc_html(get_the_excerpt()); ?></p><div><span><?php echo esc_html(get_the_date('F j, Y')); ?></span><?php if ($reading_time !== '') : ?><i></i><span><?php echo esc_html($reading_time); ?></span><?php endif; ?></div></div><img src="<?php echo esc_url($image['url']); ?>" alt="<?php echo esc_attr($image['alt']); ?>"></div></div></header>
<section class="oubei-section oubei-resource-detail-content"><div class="oubei-container"><div class="oubei-resource-article-body"><?php the_content(); ?></div><aside><div><p class="eyebrow">Engineering support</p><h2>Review this for your application</h2><p>Share your media, pressure, temperature, dimensions, and target volume with our technical team.</p><a class="button button--accent" href="<?php echo esc_url(home_url('/quote')); ?>">Request a review →</a></div><div class="oubei-resource-pack"><span>▤</span><h2>Need a printable copy?</h2><p>We can package this guidance with material data and a drawing review.</p><a href="<?php echo esc_url(home_url('/quote')); ?>">Request technical pack →</a></div></aside></div></section>
<section class="oubei-resource-continue"><div class="oubei-container"><div><p class="eyebrow">Continue exploring</p><h2>More resources for your next design review</h2></div><a class="button button--outline" href="<?php echo esc_url(home_url('/resources/')); ?>">Back to resources →</a></div></section>
</article></main>
<?php endwhile; get_footer();
