# Construction Pro

Next.js frontend สำหรับ deploy บน Vercel และ Node.js backend สำหรับวางบน Ubuntu server/Tailscale Funnel

## Getting Started

Frontend:

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Backend:

```bash
cd server
cp .env.example .env
npm install
npm run dev
```

## Environment

Frontend ใช้ endpoint จากตัวแปรเดียว:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
NEXT_PUBLIC_API_ENABLED=true
```

บน Vercel ให้เปลี่ยน `NEXT_PUBLIC_API_BASE_URL` เป็น Tailscale Funnel HTTPS URL ของ backend

## Deploy

ดูรายละเอียดใน `DEPLOY_CHECKLIST.md` และ `server/README.md`
