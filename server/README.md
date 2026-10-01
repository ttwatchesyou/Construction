# Construction Backend

Node.js backend สำหรับวางบนเครื่อง Ubuntu server แล้วเปิดผ่าน Tailscale Funnel

## Local run

```bash
cd server
cp .env.example .env
npm install
npm run dev
```

## Ubuntu server

1. คัดลอกโฟลเดอร์ `server/` ไปที่เครื่อง Ubuntu
2. แก้ `server/.env`
3. รัน `npm install --omit=dev`
4. Import database schema: `mysql -u <user> -p <database> < db/schema.sql`
5. สร้าง admin SQL: `node db/create-admin.js admin '<password>' 'สมชาย ใจดี'`
6. นำ SQL ที่ได้ไปรันใน MySQL
7. รัน `npm run check`
8. รัน `npm start` หรือใช้ systemd

Frontend บน Vercel ต้องตั้งค่า:

```bash
NEXT_PUBLIC_API_BASE_URL=https://your-funnel-domain
NEXT_PUBLIC_API_ENABLED=true
```

Backend ต้องตั้งค่า:

```bash
FRONTEND_ORIGIN=https://your-vercel-domain
COOKIE_SECURE=true
JWT_SECRET=<long-random-secret>
ALLOW_DEMO_LOGIN=false
```

## systemd

ถ้าวาง backend ไว้ที่ `/opt/construction/server`:

```bash
sudo cp deploy/construction-backend.service /etc/systemd/system/construction-backend.service
sudo systemctl daemon-reload
sudo systemctl enable --now construction-backend
sudo systemctl status construction-backend
```

## Database contract

ตอนนี้ backend เตรียมอ่านตารางหรือ view เหล่านี้:

- `users`: `id`, `username`, `password_hash`, `role`, `display_name`, `is_active`
- `dashboard_projects`: `code`, `name`, `client_name`, `status`, `assigned_today`, `income_total`, `budget_total`, `expense_total`, `updated_at`
- `dashboard_stats`: `projects`, `income`, `balance`, `pendingExpenses`, `pendingMaterials`, `checkins`

ถ้ายังไม่มี schema ครบ ระบบจะใช้ fallback data เดิมเพื่อให้ flow หน้าเว็บยังรันได้ระหว่างย้าย DB
