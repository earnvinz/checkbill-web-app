# CheckBill - ระบบคิดบิลใบเสร็จ (Web App)

ระบบจัดการบิลและใบเสร็จแบบ Full-stack พัฒนาด้วย Next.js 14 (App Router) พร้อมระบบยืนยันตัวตนและการจัดการฐานข้อมูลที่แยกส่วนกันชัดเจน

## 🚀 Tech Stack

- **Framework:** [Next.js 14.2.23](https://nextjs.org/) (App Router)
- **Authentication:** [NextAuth.js](https://next-auth.js.org/) (Google Provider) & [Better Auth](https://www.better-auth.com/)
- **ORM:** [TypeORM](https://typeorm.io/) (PostgreSQL)
- **UI Framework:** [Material UI (MUI)](https://mui.com/)
- **API Runtime:** [ElysiaJS](https://elysiajs.com/) (Integrated)
- **Environment Management:** [env-var](https://www.npmjs.com/package/env-var)
- **Database:** PostgreSQL (Docker Compose)
- **Runtime:** [Bun](https://bun.sh/) หรือ Node.js (แนะนำ Bun สำหรับการจัดการ package และความเร็ว)

## 🏗️ Architecture

โครงการนี้ใช้ฐานข้อมูล PostgreSQL แยกกัน 2 ก้อนเพื่อความเป็นระเบียบ:
1. **Auth Database (`checkbill_auth`):** สำหรับเก็บข้อมูล Session และ User ของระบบ Authentication (รันที่ port `5432`)
2. **Business Database (`checkbill_business`):** สำหรับเก็บข้อมูลธุรกิจ บิล และข้อมูลอื่นๆ (รันที่ port `5433`)

## 🛠️ การติดตั้งและรันโปรเจกต์

### 1. เตรียม Environment Variables
คัดลอกไฟล์ `.env.example` เป็น `.env` และตั้งค่าต่างๆ:
```bash
cp .env.example .env
```
ตั้งค่าที่สำคัญ:
- `GOOGLE_CLIENT_ID` และ `GOOGLE_CLIENT_SECRET` (จาก Google Cloud Console)
- `NEXTAUTH_SECRET` (สร้างด้วย `openssl rand -base64 32`)
- `BETTER_AUTH_SECRET`

### 2. เริ่มทำงาน Database (Docker)
ใช้ Docker Compose เพื่อรัน PostgreSQL ทั้ง 2 ก้อน:
```bash
docker compose up -d
```

### 3. ติดตั้ง Dependencies
```bash
bun install
# หรือ
npm install
```

### 4. รันโปรเจกต์ (Development)
```bash
bun run dev
# หรือ
npm run dev
```

## 💾 การจัดการฐานข้อมูล (Migrations)

โครงการใช้ TypeORM ในการควบคุม Schema ของ Business Database ผ่านคำสั่งดังนี้:

| คำสั่ง | คำอธิบาย |
|---------|----------|
| `npm run migration:generate -- src/db/migrations/Name` | สร้าง migration จาก Entity ที่แก้ไข |
| `npm run migration:run` | รัน migration ที่ค้างอยู่ทั้งหมด |
| `npm run migration:revert` | ยกเลิก migration ล่าสุด |
| `npm run migration:create -- src/db/migrations/Name` | สร้างไฟล์ migration เปล่า |

## 📁 โครงสร้างโฟลเดอร์

- `src/app`: Next.js App Router (Pages & API Routes)
- `src/components`: UI Components (MUI)
- `src/db`: TypeORM Configuration, Entities และ Migrations
- `src/lib`: Logic เสริม, Auth Clients และ Utility ต่างๆ
- `src/configs`: การรวบรวมและตรวจสอบ Environment Variables
- `src/types`: TypeScript Interfaces/Types

## 📜 License
MIT
