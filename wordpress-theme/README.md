# Oubei WordPress theme

Native WordPress theme for the Oubei B2B catalog and inquiry site. The local XAMPP runtime is `http://localhost:6911`.

## Local setup

Run `powershell -ExecutionPolicy Bypass -File scripts/setup-oubei-wordpress.ps1`, then activate the theme and import `wordpress-theme/oubei/import/production-content.json` with WP-CLI or a one-off `oubei_import_production_content()` call. Flush permalinks after activation.

## Content management

Products and categories are native WordPress content types. Resources are editable in the Resources post type. Website identity, inquiry notification email, social links, and all 48 page-image slots are under **Oubei settings**. Blog articles use native WordPress Posts and `/blog`.

## Inquiry email

Inquiries are saved as private records before `wp_mail()` is attempted. Configure SMTP through the host's approved SMTP plugin/provider; failed delivery remains visible in the inquiry record for retry or operational follow-up.

## VPS deployment

Upload the packaged theme ZIP, activate it, import the sanitized JSON, set HTTPS/site URL, flush permalinks, and ensure `wp-content/uploads` is writable by the web user. Back up the MariaDB database and uploads before updates. Restore database first, then uploads, then reactivate the prior theme if rollback is required.
