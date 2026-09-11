<?php
$html = wp_remote_retrieve_body(wp_remote_get(home_url('/')));
oubei_assert(substr_count($html, 'data-oubei-ring') === 5, 'five ring descriptors required');
oubei_assert(!str_contains($html, '.glb'), 'GLB references are forbidden');
oubei_assert(!str_contains($html, 'hero-products/1.png') && !str_contains($html, 'hero-products/2.png'), 'product overlays are forbidden');
