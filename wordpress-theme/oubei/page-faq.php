<?php
get_header();
$email = oubei_get_setting('contact_email', 'sales@example.com');
$groups = [
    ['company-engineering', 'Company & engineering', 'How we are organized and how our technical team supports new requirements.', [
        ['Are you a trading company or a manufacturer?', 'We are a manufacturer. Our production, quality control, engineering support, and order preparation are coordinated through our own manufacturing operation in Xingtai, Hebei.'],
        ['Do you have your own R&D team?', 'Yes. We have a six-person professional design and development team. We can review drawings, recommend materials, and customize products around your application requirements.'],
        ['Why should we choose Xingtai Oubei?', 'Our company combines advanced production equipment, complete scientific testing instruments, strong technical capabilities, and large-scale production capacity for stable repeat supply.'],
    ]],
    ['orders-delivery', 'Orders & delivery', 'Practical information for packaging, stock orders, and production lead times.', [
        ['What packaging options do you offer?', 'We offer standard packaging options and can also customize labels, bags, cartons, and packing formats according to your requirements.'],
        ['What is your typical delivery time?', 'Stock items can typically be dispatched within 3 days. Larger or custom production orders usually require about 10-20 days, depending on quantity, tooling, and the production schedule.'],
    ]],
    ['quality-materials', 'Quality & materials', 'Checks and compound families available for industrial sealing applications.', [
        ['How do you guarantee product quality?', 'We confirm a pre-production sample before mass production and perform final inspection before shipment. Material, dimensional, and visual checks are matched to the product and customer specification.'],
        ['Which materials can you produce?', 'Our material capabilities include NBR, FKM (Viton), EPDM, silicone, neoprene (CR), natural rubber, IIR, SBR, ACM, AEM, FVMQ, FFKM, liquid silicone rubber, and related custom compounds.'],
    ]],
];
$question_number = 0;
?>
<main class="oubei-faq-page">
<section class="oubei-faq-hero"><div class="oubei-container"><nav class="oubei-breadcrumbs oubei-breadcrumbs--dark"><a href="<?php echo esc_url(home_url('/')); ?>">Home</a><span>›</span><strong>FAQ</strong></nav><div class="oubei-faq-hero-grid"><div><p class="eyebrow eyebrow--light">Customer support / 01</p><h1>Frequently asked questions</h1><p>Clear answers about our manufacturing model, engineering support, packaging, delivery, quality controls, and material capabilities.</p><div class="oubei-hero__actions"><a class="button button--accent" href="#faq-list">Browse answers →</a><a class="button button--outline" href="<?php echo esc_url(home_url('/quote')); ?>">Ask a technical question</a></div></div><div class="oubei-faq-facts"><div><span>▣</span><p><strong>Manufacturer</strong>Direct production support</p></div><div><span>◇</span><p><strong>6-person R&amp;D</strong>Design and development team</p></div><div><span>✓</span><p><strong>Final inspection</strong>Before every shipment</p></div></div></div></div></section>
<section id="faq-list" class="oubei-faq-content"><div class="oubei-container oubei-faq-layout"><aside><p class="eyebrow">Browse by topic</p><nav aria-label="FAQ topics"><?php foreach ($groups as $index => $group) : ?><a href="#<?php echo esc_attr($group[0]); ?>"><span><?php echo esc_html($group[1]); ?></span><small>0<?php echo $index + 1; ?></small></a><?php endforeach; ?></nav><div class="oubei-faq-help"><strong>Need an application-specific answer?</strong><p>Share your media, pressure, temperature, dimensions, and target volume.</p><a href="<?php echo esc_url(home_url('/quote')); ?>">Contact engineering →</a></div></aside><div><?php foreach ($groups as $group_index => $group) : ?><section id="<?php echo esc_attr($group[0]); ?>" class="oubei-faq-group"><header><div><p class="eyebrow">Topic 0<?php echo $group_index + 1; ?></p><h2><?php echo esc_html($group[1]); ?></h2></div><p><?php echo esc_html($group[2]); ?></p></header><div class="oubei-faq-list"><?php foreach ($group[3] as $item) : $question_number++; ?><details <?php echo $question_number === 1 ? 'open' : ''; ?>><summary><span><?php echo esc_html(str_pad((string) $question_number, 2, '0', STR_PAD_LEFT)); ?></span><h3><?php echo esc_html($item[0]); ?></h3><b aria-hidden="true">⌄</b></summary><p><?php echo esc_html($item[1]); ?></p></details><?php endforeach; ?></div></section><?php endforeach; ?></div></div></section>
<section class="oubei-faq-cta"><div class="oubei-container"><div><p class="eyebrow">Engineering support</p><h2>Still need a technical answer?</h2><p>Our team can review your drawing and operating conditions, then recommend a material and manufacturing path.</p></div><div><a class="button button--accent" href="<?php echo esc_url(home_url('/quote')); ?>">Request a review →</a><a class="button button--outline" href="mailto:<?php echo esc_attr($email); ?>">Email engineering</a></div></div></section>
</main>
<?php get_footer();
