<?php
if (!defined('ABSPATH')) { exit; }
get_header();
$paged = max(1, (int) get_query_var('paged'), (int) get_query_var('page'));
$resources = new WP_Query([
    'post_type' => 'oubei_resource',
    'post_status' => 'publish',
    'posts_per_page' => 9,
    'paged' => $paged,
    'orderby' => 'date',
    'order' => 'DESC',
]);
$featured = $resources->posts[0] ?? null;
$featured_image = $featured instanceof WP_Post ? oubei_get_resource_image($featured->ID) : oubei_get_media_slot('resources.hero');
?>
<main class="oubei-resources-page">
<section class="oubei-resources-hero"><div class="oubei-container"><nav class="oubei-breadcrumbs oubei-breadcrumbs--dark"><a href="<?php echo esc_url(home_url('/')); ?>">Home</a><span>›</span><strong>Resources</strong></nav><div class="oubei-resources-hero-grid"><div><p class="eyebrow">Knowledge center / 01</p><h1>Engineering resources</h1><p>Practical material guidance, test methods, and application notes for teams designing reliable sealing systems.</p><a class="button button--accent" href="#resource-library">Browse resource library →</a></div><?php if ($featured instanceof WP_Post) : ?><a class="oubei-resources-feature" href="<?php echo esc_url(get_permalink($featured)); ?>"><img src="<?php echo esc_url($featured_image['url']); ?>" alt="<?php echo esc_attr($featured_image['alt']); ?>"><span>Featured guide</span><strong><?php echo esc_html(get_the_title($featured)); ?></strong></a><?php endif; ?></div></div><div class="oubei-resources-metrics"><div class="oubei-container"><div><b><?php echo esc_html((string) $resources->found_posts); ?></b><span>Published resources</span></div><div><b>ISO 9001</b><span>Quality system in operation</span></div><div><b>48 h</b><span>Typical drawing review</span></div></div></div></section>
<section id="resource-library" class="oubei-section oubei-section--white"><div class="oubei-container"><div class="oubei-section-heading oubei-section-heading--split"><div><p class="eyebrow">Resource library</p><h2>Browse engineering insights</h2><p>Guidance, application notes, and company updates maintained directly in WordPress.</p></div><a class="button button--outline" href="<?php echo esc_url(home_url('/quote')); ?>">Ask an engineer</a></div><?php if ($resources->have_posts()) : ?><div class="oubei-resource-archive-grid"><?php while ($resources->have_posts()) : $resources->the_post(); $image = oubei_get_resource_image(get_the_ID()); $reading_time = (string) get_post_meta(get_the_ID(), '_oubei_reading_time', true); ?><article><a class="oubei-resource-archive-image" href="<?php the_permalink(); ?>"><img src="<?php echo esc_url($image['url']); ?>" alt="<?php echo esc_attr($image['alt']); ?>"></a><div><p class="eyebrow"><?php echo esc_html(oubei_get_resource_category(get_the_ID())); ?></p><h2><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2><p><?php echo esc_html(get_the_excerpt()); ?></p><footer><span><?php echo esc_html(get_the_date('F j, Y')); ?><?php echo $reading_time !== '' ? ' · ' . esc_html($reading_time) : ''; ?></span><a href="<?php the_permalink(); ?>" aria-label="Read <?php echo esc_attr(get_the_title()); ?>">Read article →</a></footer></div></article><?php endwhile; wp_reset_postdata(); ?></div><nav class="oubei-pagination" aria-label="Resource pagination"><?php echo wp_kses_post(paginate_links(['total' => $resources->max_num_pages, 'current' => $paged, 'type' => 'list'])); ?></nav><?php else : ?><div class="oubei-empty-state"><p>No resources published yet.</p></div><?php endif; ?></div></section>
<section class="oubei-final-cta"><div class="oubei-container"><div><p class="eyebrow">Need a document?</p><h2>Request a tailored technical pack.</h2></div><a class="button button--accent" href="<?php echo esc_url(home_url('/quote')); ?>">Start a technical review →</a></div></section>
</main>
<?php get_footer();
