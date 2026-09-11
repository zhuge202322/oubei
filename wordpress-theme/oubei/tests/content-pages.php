<?php
foreach ([
    '/about/' => ['Founded 2022', 'Quality records on file', 'Our Journey', 'Manufacturing Prowess', 'Global Customer Reach', 'Production base', 'Application support', 'Repeat production', 'Export coordination', 'Specialist Team', 'People behind production'],
    '/custom/' => ['Custom O-Ring Sets &amp; OEM/ODM Solutions', 'Design-to-Production Workflow', 'Consultation', 'Prototyping', 'Compounding', 'Mass production', 'Advanced Material Selection Guide', 'Mold design', 'Private labeling', 'Quality control', 'Global logistics', 'Case Studies', 'Ready to Engineer Your Custom Solution?'],
    '/faq/' => ['Frequently asked questions', 'Manufacturer', '6-person R&amp;D', 'Final inspection', 'Company &amp; engineering', 'Orders &amp; delivery', 'Quality &amp; materials', 'Still need a technical answer?'],
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
