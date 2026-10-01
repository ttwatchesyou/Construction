# Production Deploy Checklist

## Node.js backend and database

- [ ] Copy `server/` to the Ubuntu server.
- [ ] Configure `server/.env` from `server/.env.example`.
- [ ] Configure `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, and `DB_NAME` outside source code.
- [ ] Set `JWT_SECRET` to a long random value.
- [ ] Set `FRONTEND_ORIGIN` to the Vercel domain.
- [ ] Run `npm install --omit=dev` and `npm start` or run the service with `pm2`.
- [ ] Make `/health`, `/auth/login`, `/auth/me`, `/auth/logout`, and `/dashboard` reachable through Tailscale Funnel.
- [ ] Configure database/file backups.

## Next.js / Vercel

- [ ] Set `NEXT_PUBLIC_API_BASE_URL=https://your-funnel-domain`.
- [ ] Set `NEXT_PUBLIC_API_ENABLED=true`.
- [ ] Use this project root as the Vercel Root Directory.
- [ ] Use Yarn commands: `yarn install`, `yarn build`, and `yarn start`.
- [ ] Confirm the browser can call the backend with cookies enabled.

## Acceptance tests

- [ ] Login with a valid user and reject an invalid password.
- [ ] Refresh the dashboard without losing the PHP session.
- [ ] Verify role restrictions for technician and admin users.
- [ ] Verify projects and dashboard stats come from MySQL, not fallback data.
- [ ] Verify logout invalidates the backend auth cookie.
- [ ] Test dashboard at 375px, 768px, 1280px, and 1920px widths.
- [ ] Test uploads, HTTPS, backup restore, and error logs before opening to users.
