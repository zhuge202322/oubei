<?php
oubei_assert(count(oubei_media_slot_registry()) === 48, '48 media slots required');
update_option('oubei_site_settings', ['contact_email' => 'sales@example.com']);
oubei_assert(oubei_get_setting('contact_email') === 'sales@example.com', 'setting override missing');
$slot = oubei_get_media_slot('home.factory.workshop');
oubei_assert(is_array($slot) && ($slot['url'] ?? '') !== '', 'slot URL missing');
oubei_assert(($slot['is_default'] ?? false) === true, 'default slot state missing');
