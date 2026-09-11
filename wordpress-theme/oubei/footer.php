<?php
$setting = static function (string $key, string $fallback): string {
    return function_exists('oubei_get_setting') ? oubei_get_setting($key, $fallback) : $fallback;
};
$company = $setting('contact_name', 'Xingtai Oubei Rubber Products Co., Ltd.');
$email = $setting('contact_email', 'htobsealjason@outlook.com');
$phone = $setting('contact_phone', '+86 18803390651');
$address = $setting('contact_address', 'Xingtai, Hebei, China');
?>
<footer class="site-footer">
    <div class="oubei-container site-footer__grid">
        <div><a class="site-brand" href="<?php echo esc_url(home_url('/')); ?>"><span class="site-brand__mark">OB</span><span><?php echo esc_html(get_bloginfo('name')); ?></span></a><p><?php esc_html_e('Precision rubber and plastic sealing components for global industrial supply chains.', 'oubei'); ?></p></div>
        <div><h2><?php esc_html_e('Catalog', 'oubei'); ?></h2><a href="<?php echo esc_url(home_url('/products')); ?>"><?php esc_html_e('Products', 'oubei'); ?></a><a href="<?php echo esc_url(home_url('/materials')); ?>"><?php esc_html_e('Materials', 'oubei'); ?></a><a href="<?php echo esc_url(home_url('/custom')); ?>"><?php esc_html_e('OEM / ODM', 'oubei'); ?></a></div>
        <div><h2><?php esc_html_e('Resources', 'oubei'); ?></h2><a href="<?php echo esc_url(home_url('/resources')); ?>"><?php esc_html_e('Technical guides', 'oubei'); ?></a><a href="<?php echo esc_url(home_url('/blog')); ?>"><?php esc_html_e('Blog', 'oubei'); ?></a><a href="<?php echo esc_url(home_url('/faq')); ?>"><?php esc_html_e('FAQ', 'oubei'); ?></a></div>
        <div><h2><?php esc_html_e('Contact', 'oubei'); ?></h2><a href="mailto:<?php echo esc_attr(antispambot($email)); ?>"><?php echo esc_html(antispambot($email)); ?></a><a href="tel:<?php echo esc_attr(preg_replace('/\s+/', '', $phone)); ?>"><?php echo esc_html($phone); ?></a><p><?php echo esc_html($address); ?></p></div>
    </div>
    <div class="oubei-container site-footer__bottom"><span>&copy; <?php echo esc_html(gmdate('Y')); ?> <?php echo esc_html($company); ?></span><span><?php esc_html_e('Built for reliable sealing', 'oubei'); ?></span></div>
</footer><?php wp_footer(); ?></body></html>
