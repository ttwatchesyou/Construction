# Production Deploy Checklist

## PHP and database

- [ ] Deploy the project root to a PHP 8.1+ host.
- [ ] Import `zshrmlsz_construction_db.sql` into the production MySQL database.
- [ ] Configure `DB_HOST`, `DB_USER`, `DB_PASS`, and `DB_NAME` outside source code.
- [ ] Make `api/login.php`, `api/me.php`, `api/logout.php`, and `api/dashboard.php` reachable under one HTTPS origin.
- [ ] Verify `pdo_mysql`, `mbstring`, `openssl`, and `fileinfo` are enabled.
- [ ] Give `uploads/` persistent write permission and configure daily database/file backups.
- [ ] Remove or protect `debug_dashboard.php`, `seed_users.php`, and SQL dump files.

## Next.js / Vercel

- [ ] Set `PHP_API_URL=https://your-php-domain.example/api`.
- [ ] Set `NEXT_PUBLIC_PHP_API_ENABLED=true`.
- [ ] Use the `frontend` directory as the Vercel Root Directory.
- [ ] Use Yarn commands: `yarn install`, `yarn build`, and `yarn start`.
- [ ] Confirm `/api/auth/login`, `/api/auth/me`, `/api/auth/logout`, and `/api/dashboard` return JSON.
- [ ] Confirm the PHP session cookie is forwarded through the Next proxy.

## Acceptance tests

- [ ] Login with a valid user and reject an invalid password.
- [ ] Refresh the dashboard without losing the PHP session.
- [ ] Verify role restrictions for technician and admin users.
- [ ] Verify projects and dashboard stats come from MySQL, not fallback data.
- [ ] Verify logout invalidates the PHP session.
- [ ] Test dashboard at 375px, 768px, 1280px, and 1920px widths.
- [ ] Test uploads, HTTPS, backup restore, and error logs before opening to users.
