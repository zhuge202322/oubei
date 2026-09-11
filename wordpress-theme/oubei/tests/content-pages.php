<?php
foreach ([
    '/about/' => ['Founded 2022', 'Quality records on file', 'Our Journey', 'Manufacturing Prowess', 'Global Customer Reach', 'Specialist Team', 'People behind production'],
    '/custom/' => ['Turn a drawing into a dependable component.', 'Engineering support from first sketch to repeat order', 'Case studies'],
    '/resources/' => ['Knowledge center', 'Featured guide', 'Resource library', 'Request a tailored technical pack'],
] as $path => $copy) {
    $response = wp_remote_get(home_url($path));
    oubei_assert(wp_remote_retrieve_response_code($response) === 200, "{$path} must return 200");
    $html = wp_remote_retrieve_body($response);
    foreach ($copy as $text) {
        oubei_assert(str_contains($html, $text), "{$path} missing: {$text}");
    }
}
$quote = wp_remote_retrieve_body(wp_remote_get(home_url('/quote/')));
foreach (['Engineering intake / 01', 'data-quote-step="1"', 'data-quote-step="2"', 'data-quote-step="3"', 'Review your request', 'Drawing or reference file'] as $copy) {
    oubei_assert(str_contains($quote, $copy), "quote missing: {$copy}");
}
