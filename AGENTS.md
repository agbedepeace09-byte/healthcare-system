# Juwon — Healthcare Clinic Management System

## Architecture

- **Frontend:** `frontend/` — Next.js 16.2 (App Router), React 19.2, Tailwind CSS v4, JavaScript (`.jsx`)
- **Backend:** `backend/` — Express 5, CommonJS, multi-endpoint API under `/api/v1`
- **Routing:** Role-based — `/doctor`, `/nurse`, `/reception`, `/admin`, `/pharmacy`, `/lab` — each pushes from the login page (`/`)
- **Path alias:** `@/*` → `frontend/` root

## Setup & Run

```powershell
# Install & start backend
cd backend
npm install
node index.js                    # runs on :5000

# Separate terminal — install & start frontend
cd frontend
npm install
npm run dev                      # :3000
```

## Known bugs (resolved)

All previously known bugs have been fixed:
- `backend/package.json` now includes `cors` and `dotenv`
- `backend/package.json` has `"dev"` and `"start"` scripts
- `.env` file exists and is tracked by `.gitignore`; dotenv is loaded in `index.js`
- No remaining `.tsx` files — all pages are `.jsx`
- Sidebar in `frontend/app/layout.jsx` includes all navigation links

## Conventions & quirks

- **Dark mode:** Toggled via `.dark`/`.light` CSS class on `<html>`, persisted in `localStorage`. Tailwind v4 `@custom-variant dark (&:where(.dark, .dark *))` — not the `prefers-color-scheme` media strategy.
- **CSS:** Tailwind v4 with `@import "tailwindcss"` (no `tailwind.config.js`). Custom CSS vars in `globals.css` for Material Design–inspired tokens (`--surface`, `--primary`, etc.).
- **File extensions:** All `.jsx`. No TypeScript files remain in `frontend/app/`.
- **Auth:** Login page simulates role selection and redirects; no real JWT session validation on the frontend yet. Backend JWT auth is functional (`POST /api/v1/auth/login` returns a signed token).
- **Layout:** Root layout (`frontend/app/layout.jsx`) is a client component with persistent sidebar + top nav.

## Pages & Routes

| Route | File | Role |
|-------|------|------|
| `/` | `frontend/app/page.jsx` | Landing |
| `/login` | `frontend/app/login/page.jsx` | Login |
| `/doctor` | `frontend/app/doctor/page.jsx` | Doctor dashboard |
| `/doctor/encounter/[visitId]` | `frontend/app/doctor/encounter/[visitId]/page.jsx` | Doctor encounter |
| `/nurse` | `frontend/app/nurse/page.jsx` | Nurse triage dashboard |
| `/reception` | `frontend/app/reception/page.jsx` | Reception dashboard |
| `/pharmacy` | `frontend/app/pharmacy/page.jsx` | Pharmacy dashboard |
| `/lab` | `frontend/app/lab/page.jsx` | Lab dashboard |
| `/admin` | `frontend/app/admin/page.jsx` | Admin staff directory |
| `/resources` | `frontend/app/resources/page.jsx` | Resource management |

## Commands

| Command | Location | Notes |
|---|---|---|
| `npm run dev` | `frontend/` | Next.js dev server |
| `npm run build` | `frontend/` | Production build |
| `npm run lint` | `frontend/` | ESLint (Flat config in `eslint.config.mjs`) |
| `node index.js` | `backend/` | Backend (also `npm run dev` or `npm start`) |

## Testing

No test framework configured.

## Deploy

No CI, no Docker, no deployment config. Not deployed.

## Database

- PostgreSQL via Supabase
- Prisma ORM with driver adapters
- Seed: `npx prisma db seed` (seeds staff, patients, wards, beds, drip stands)
- Default password for all seeded staff: `password123`
- Schema file: `backend/prisma/schema.prisma`
- Migrations: `npx prisma migrate dev` or `npx prisma db push`
