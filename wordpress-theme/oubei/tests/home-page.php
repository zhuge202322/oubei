<?php
$html = wp_remote_retrieve_body(wp_remote_get(home_url('/')));
oubei_assert(substr_count($html, 'data-oubei-ring') === 5, 'five ring descriptors required');
oubei_assert(!str_contains($html, '.glb'), 'GLB references are forbidden');
oubei_assert(!str_contains($html, 'hero-products/1.png') && !str_contains($html, 'hero-products/2.png'), 'product overlays are forbidden');
foreach (['Browse catalog', 'Technical specs', '20+ years experience', 'Global delivery', 'R&D lab tested', 'ISO 9001 certified', 'Technical Material Categories', 'Advanced Manufacturing Capacity', 'Material Property Comparison', 'Industry Insights', 'Have a drawing or sealing challenge?'] as $copy) {
    oubei_assert(str_contains($html, $copy) || str_contains($html, esc_html($copy)), "homepage copy missing: {$copy}");
}
oubei_assert(str_contains($html, 'Material slider controls'), 'material slider controls missing');
oubei_assert(substr_count($html, '<tbody>') === 1, 'material comparison table missing');
oubei_assert(substr_count($html, 'data-material-card') === 4, 'four material cards required');
