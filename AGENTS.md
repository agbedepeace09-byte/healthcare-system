# Juwon — Healthcare Clinic Management System

## Architecture

- **Frontend:** `frontend/` — Next.js 16.2 (App Router), React 19.2, Tailwind CSS v4, TypeScript (mixed `.tsx`/`.jsx`, migrating to `.jsx`)
- **Backend:** `backend/` — Express 5, CommonJS, single `/api/status` endpoint
- **Routing:** Role-based — `/doctor`, `/nurse`, `/reception`, `/admin`, `/pharmacy`, `/lab` — each pushes from the login page (`/`)
- **Path alias:** `@/*` → `frontend/` root

## Setup & Run

```powershell
# Install & start backend
cd backend
npm install express cors dotenv
node index.js                    # no start script exists — runs on :5000

# Separate terminal — install & start frontend
cd frontend
npm install
npm run dev                      # :3000
```

## Known bugs to fix

- `backend/package.json` is missing `cors` and `dotenv` — both are `require()`d in `index.js`
- `backend/package.json` has no `"start"` script (only a stub `"test"`)
- `backend/index.js` requires `dotenv` but no `.env` file is tracked — add one or make dotenv optional
- One remaining `.tsx` file needs conversion to `.jsx`: `frontend/app/nurse/triage/[appointment_id]/page.tsx`
- Sidebar in `frontend/app/layout.jsx` lacks navigation links for all pages (doctor, nurse, reception, admin, pharmacy, lab)

## Conventions & quirks

- **Dark mode:** Toggled via `.dark`/`.light` CSS class on `<html>`, persisted in `localStorage`. Tailwind v4 `@custom-variant dark (&:where(.dark, .dark *))` — not the `prefers-color-scheme` media strategy.
- **CSS:** Tailwind v4 with `@import "tailwindcss"` (no `tailwind.config.js`). Custom CSS vars in `globals.css` for Material Design–inspired tokens (`--surface`, `--primary`, etc.).
- **File extensions:** Mixed `.tsx` and `.jsx` — both are used. No strict TS rule enforced. Migration target: all `.jsx`.
- **Auth:** None. Login page just redirects to `/doctor` (or selected role) via `router.push()`. No session, no API call.
- **Layout:** Root layout (`frontend/app/layout.jsx`) is a client component with persistent sidebar + top nav. Role-specific layouts exist (e.g., `doctor/layout.jsx`).

## Pages & Routes

| Route | File | Role |
|-------|------|------|
| `/` | `frontend/app/page.jsx` | Login |
| `/login` | `frontend/app/login/page.jsx` | Login (empty stub) |
| `/doctor/dashboard` | `frontend/app/doctor/dashboard/page.jsx` | Doctor |
| `/doctor/consult/[id]` | `frontend/app/doctor/consult/[appointment_id]/page.jsx` | Doctor |
| `/nurse/dashboard` | `frontend/app/nurse/dashboard/page.jsx` | Nurse |
| `/nurse/triage/[id]` | `frontend/app/nurse/triage/[appointment_id]/page.tsx` | Nurse (needs `.jsx`) |
| `/reception/dashboard` | `frontend/app/reception/dashboard/page.jsx` | Reception |
| `/reception/register` | `frontend/app/reception/register/page.jsx` | Reception |
| `/pharmacy` | `frontend/app/pharmacy/page.jsx` | Pharmacy |
| `/admin` | `frontend/app/admin/page.jsx` | Admin |
| `/lab` | `frontend/app/lab/page.jsx` | Lab (empty stub) |

## Commands

| Command | Location | Notes |
|---|---|---|
| `npm run dev` | `frontend/` | Next.js dev server |
| `npm run build` | `frontend/` | Production build |
| `npm run lint` | `frontend/` | ESLint (Flat config in `eslint.config.mjs`) |
| `node index.js` | `backend/` | Backend (no `npm start` yet) |

## Testing

No test framework configured.

## Deploy

No CI, no Docker, no deployment config. Not deployed.

## Uncommitted work

The working tree differs significantly from HEAD — original uppercase paths (`Admin/`, `Doctor/`) were replaced by lowercase paths (`admin/`, `doctor/`) with much larger implementations. Check `git status` before adding features.