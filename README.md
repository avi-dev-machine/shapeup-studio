# SHAPE UP — Premium Fitness Studio Platform

> **A full-stack web application for SHAPE UP, a premium fitness studio established in 2001 with 4 branches across Kolkata.**  
> The platform delivers a high-performance public-facing website and a secure, admin-only CMS — all driven by a REST API backend.

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Repository Structure](#repository-structure)
- [Frontend](#frontend)
  - [Tech Stack](#frontend-tech-stack)
  - [Pages & Routing](#pages--routing)
  - [Components](#components)
  - [Utilities](#utilities)
  - [Environment Variables](#frontend-environment-variables)
  - [Running the Frontend](#running-the-frontend)
- [Backend](#backend)
  - [Tech Stack](#backend-tech-stack)
  - [Project Layout](#backend-project-layout)
  - [API Reference](#api-reference)
  - [Data Models](#data-models)
  - [Authentication & Security](#authentication--security)
  - [Database & Seeding](#database--seeding)
  - [File Uploads](#file-uploads)
  - [Environment Variables](#backend-environment-variables)
  - [Running the Backend](#running-the-backend)
- [Local Development (Full Stack)](#local-development-full-stack)
- [Deployment Notes](#deployment-notes)

---

## Overview

SHAPE UP is a production-grade, content-manageable fitness studio website. It is split into two independently runnable services:

| Service | Technology | Default Port |
|---|---|---|
| **Frontend** | Next.js 16 (App Router) | `3000` |
| **Backend** | FastAPI + SQLite (async) | `8000` |

The public website (`/`) showcases the gym's trainers, pricing packages, gallery, videos, special programs, reviews, and branch locations. A protected admin panel (`/admin`) provides a full CMS for every content area, authenticated via JWT Bearer tokens.

---

## Architecture

```
Browser
  │
  ├─► Next.js Frontend (port 3000)
  │       ├─ Public landing page  (/):    Server-rendered shell, client-driven data
  │       └─ Admin panel          (/admin): Client-side SPA; JWT guard on every page
  │
  └─► FastAPI Backend (port 8000)
          ├─ /api/...            Public read endpoints
          ├─ /api/admin/...      Protected write endpoints (JWT required)
          ├─ /uploads/...        Static file server for uploaded media
          └─ /docs               Interactive Swagger UI
```

**Data flow:**  
1. On page load the frontend calls the public `/api/*` endpoints to hydrate each section.  
2. The admin panel authenticates via `POST /api/auth/login`, receives a JWT, and stores it in `localStorage` (`shapeup_token`).  
3. All subsequent admin writes pass `Authorization: Bearer <token>` automatically via the shared `apiFetch` wrapper.

---

## Repository Structure

```
shapeup/
├── frontend/          # Next.js application
│   ├── src/
│   │   ├── app/       # Next.js App Router pages & layouts
│   │   ├── components/ # UI section components
│   │   └── utils/     # API client, constants, helpers
│   ├── public/        # Static assets (images, SVGs)
│   ├── package.json
│   └── next.config.mjs
│
├── backend/           # FastAPI application
│   ├── api/           # Route handlers (one file per resource)
│   ├── core/          # Configuration & security utilities
│   ├── db/            # Async engine, session factory, table init & seeding
│   ├── models/        # SQLAlchemy ORM models
│   ├── schemas/       # Pydantic request/response schemas
│   ├── uploads/       # Uploaded media files (runtime, git-ignored)
│   ├── main.py        # Application entry point
│   └── requirements.txt
│
├── logo.png           # Brand logo asset
├── design.md          # Design reference notes
└── guide.md           # Development guide & decisions
```

---

## Frontend

### Frontend Tech Stack

| Dependency | Version | Purpose |
|---|---|---|
| **Next.js** | 16.2.4 | React framework with App Router |
| **React** | 19.2.4 | UI rendering |
| **Framer Motion** | ^12.38.0 | Declarative animations & transitions |
| **GSAP** | ^3.15.0 | Timeline-based animation sequences (loader screen) |
| **Lucide React** | ^1.11.0 | Icon library (admin panel) |
| **CSS Modules** | (built-in) | Scoped component styles |

**Fonts loaded via Google Fonts:** Bebas Neue, Montserrat (300–800), Orbitron (400–900).

---

### Pages & Routing

```
/                  → Public landing page (all sections composed in PageClient.js)
/admin             → Admin dashboard overview
/admin/login       → JWT login form (no sidebar)
/admin/trainers    → Trainer CRUD
/admin/pricing     → Pricing package CRUD
/admin/branches    → Branch location CRUD
/admin/programs    → Special program CRUD
/admin/hours       → Gym hours & admission charge management
/admin/videos      → Workout video CRUD
/admin/gallery     → Gallery image/video management
/admin/reviews     → Review moderation (delete)
/admin/owner       → Owner profile editor
/admin/logo        → Logo upload & preview
```

The admin layout (`src/app/admin/layout.js`) acts as a client-side authentication gate: on every route change it reads `localStorage.shapeup_token`. If absent, it redirects to `/admin/login`. The login page bypasses the sidebar wrapper entirely.

---

### Components

All components live in `src/components/`. Each is paired with a scoped CSS Module (`.module.css`).

| Component | Description |
|---|---|
| **LoaderScreen** | Full-screen animated intro using GSAP timelines. Fires `onComplete` when the animation finishes; the parent fades in the main content. Server-side rendered is disabled (`ssr: false`) to avoid GSAP hydration conflicts. |
| **Navbar** | Sticky top navigation. Reads `NAV_LINKS` from constants. Highlights the active section on scroll. |
| **Hero** | Full-viewport hero section with animated headline, tagline, and CTA buttons (WhatsApp + call dialer). |
| **StatsCounter** | Animated number counters for key gym statistics (years, trainers, members, sq. ft.). Sourced from `STATS` constant. |
| **OwnerSection** | Displays the owner's name, photo, and bio fetched from `GET /api/owner`. |
| **TrainerMarquee** | Infinite horizontal scroll marquee of trainer cards. Fetches `GET /api/trainers` and filters by `is_in_marquee`. |
| **ProgramsSection** | Grid display of special programs fetched from `GET /api/programs`. |
| **PricingSection** | Tabbed pricing display across five categories (Gym, PT, Group PT, Weight Loss, Add-Ons). Fetches all packages from `GET /api/packages`. |
| **VideoSection** | Horizontal scroll / grid of embedded workout videos fetched from `GET /api/videos`. |
| **Gallery** | Masonry-style photo/video gallery fetched from `GET /api/gallery`. |
| **ReviewSection** | Customer review cards. Supports public review submission (`POST /api/reviews`). Fetches existing reviews via `GET /api/reviews`. |
| **BranchSection** | Location cards for all 4 branches. Each card links to Google Maps. Fetches `GET /api/branches`. |
| **Footer** | Site footer with contact links (WhatsApp, phone dialer), social links, branch addresses, and navigation. |

---

### Utilities

**`src/utils/api.js`** — Central API client.  
Exports two objects:

- `api` — Public read-only methods (`getTrainers`, `getPackages`, `getGallery`, etc.)
- `adminApi` — Authenticated write methods for every resource (create, update, delete)

Also exports `getUploadUrl(path)` which resolves relative upload paths to absolute URLs using `NEXT_PUBLIC_API_URL`.

**`src/utils/constants.js`** — Application-wide constants:  
`SITE_NAME`, `SITE_TAGLINE`, `STATS`, `NAV_LINKS`, `PACKAGE_CATEGORIES`.

**`src/utils/dialer.js`** — Helper to trigger a native phone call (`tel:` link).

**`src/utils/whatsapp.js`** — Builds a WhatsApp deep-link URL with a pre-filled message.

---

### Frontend Environment Variables

Create a `.env.local` file inside the `frontend/` directory:

```env
# URL of the FastAPI backend (must include /api path prefix)
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

If this variable is not set, the client defaults to `http://localhost:8000/api`.

---

### Running the Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development server (hot reload)
npm run dev

# Build for production
npm run build
npm run start
```

The application will be available at **http://localhost:3000**.

---

## Backend

### Backend Tech Stack

| Package | Version | Purpose |
|---|---|---|
| **FastAPI** | 0.115.0 | Async web framework & OpenAPI generation |
| **Uvicorn** | 0.30.0 | ASGI server with hot-reload |
| **SQLAlchemy** (async) | 2.0.35 | ORM & async query engine |
| **aiosqlite** | 0.20.0 | Async SQLite driver |
| **Pydantic** | 2.9.0 | Schema validation & serialization |
| **pydantic-settings** | 2.5.0 | Environment-based configuration |
| **python-jose** | 3.3.0 | JWT encoding / decoding (HS256) |
| **passlib[bcrypt]** | 1.7.4 | Password hashing |
| **bcrypt** | 4.0.1 | Bcrypt backend for passlib |
| **python-multipart** | 0.0.12 | Multipart form / file upload parsing |
| **Pillow** | 10.4.0 | Image processing (future use) |
| **aiofiles** | 24.1.0 | Async file I/O for uploads |

---

### Backend Project Layout

```
backend/
├── main.py              # App factory, CORS config, router registration, lifespan hook
├── requirements.txt
│
├── core/
│   ├── config.py        # Pydantic Settings — all configurable values
│   └── security.py      # bcrypt hashing, JWT create/decode, get_current_admin dependency
│
├── db/
│   └── database.py      # Async engine, session factory, Base, init_db() + seed logic
│
├── models/              # SQLAlchemy ORM table definitions
│   ├── admin.py         # Admin (email + hashed_password)
│   ├── trainer.py       # Trainer (name, photo_url, is_in_marquee, display_order)
│   ├── owner.py         # Owner (name, photo_url, description)
│   ├── package.py       # Package (category, title, price, duration, notes, display_order)
│   ├── hours.py         # GymHours + AdmissionCharge
│   ├── review.py        # Review (name, rating, text, created_at)
│   ├── gallery.py       # GalleryItem (media_type, url, caption, created_at)
│   ├── branch.py        # Branch (name, address, maps_url, photo_url)
│   ├── logo.py          # SiteLogo (logo_url)
│   ├── video.py         # WorkoutVideo (title, video_url, display_order)
│   └── program.py       # SpecialProgram (name, display_order)
│
├── schemas/             # Pydantic request/response models (mirrors models/)
│   └── *.py
│
├── api/                 # FastAPI route handlers (one file per resource)
│   ├── auth.py
│   ├── trainers.py
│   ├── owner.py
│   ├── packages.py
│   ├── hours.py
│   ├── reviews.py
│   ├── gallery.py
│   ├── branches.py
│   ├── logo.py
│   ├── upload.py
│   ├── videos.py
│   └── programs.py
│
├── uploads/             # Runtime directory for uploaded media (auto-created)
└── shapeup.db           # SQLite database file (auto-created on first run)
```

---

### API Reference

All routes are prefixed with `/api`. Endpoints marked **🔒** require a valid `Authorization: Bearer <token>` header.

Interactive documentation (Swagger UI) is available at **http://localhost:8000/docs**.

#### Authentication

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/auth/login` | Admin login → returns JWT access token |

Request body: `{ "email": "...", "password": "..." }`  
Response: `{ "access_token": "<jwt>", "token_type": "bearer" }`

---

#### Trainers

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/api/trainers` | Public | List all trainers ordered by `display_order` |
| `POST` | `/api/admin/trainers` | 🔒 | Create a new trainer |
| `PUT` | `/api/admin/trainers/{id}` | 🔒 | Update a trainer |
| `DELETE` | `/api/admin/trainers/{id}` | 🔒 | Delete a trainer |

---

#### Packages (Pricing)

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/api/packages` | Public | List all packages (optionally `?category=gym\|pt\|group_pt\|weight_loss\|addon`) |
| `POST` | `/api/admin/packages` | 🔒 | Create a package |
| `PUT` | `/api/admin/packages/{id}` | 🔒 | Update a package |
| `DELETE` | `/api/admin/packages/{id}` | 🔒 | Delete a package |

---

#### Gym Hours & Admission

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/api/hours` | Public | List all gym hour slots |
| `GET` | `/api/admission` | Public | List all admission charges |
| `POST` | `/api/admin/hours` | 🔒 | Create a new hour slot |
| `PUT` | `/api/admin/hours/{id}` | 🔒 | Update a gym hour slot |
| `DELETE` | `/api/admin/hours/{id}` | 🔒 | Delete a gym hour slot |
| `PUT` | `/api/admin/admission/{id}` | 🔒 | Update an admission charge |

---

#### Gallery

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/api/gallery` | Public | List all gallery items (newest first) |
| `POST` | `/api/admin/gallery` | 🔒 | Add a gallery item |
| `DELETE` | `/api/admin/gallery/{id}` | 🔒 | Remove a gallery item |

---

#### Reviews

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/api/reviews` | Public | List all reviews |
| `POST` | `/api/reviews` | Public | Submit a new review |
| `DELETE` | `/api/admin/reviews/{id}` | 🔒 | Delete a review |

---

#### Branches

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/api/branches` | Public | List all branches |
| `POST` | `/api/admin/branches` | 🔒 | Create a branch |
| `PUT` | `/api/admin/branches/{id}` | 🔒 | Update a branch |
| `DELETE` | `/api/admin/branches/{id}` | 🔒 | Delete a branch |

---

#### Videos

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/api/videos` | Public | List all workout videos ordered by `display_order` |
| `POST` | `/api/admin/videos` | 🔒 | Add a video |
| `PUT` | `/api/admin/videos/{id}` | 🔒 | Update a video |
| `DELETE` | `/api/admin/videos/{id}` | 🔒 | Delete a video |

---

#### Special Programs

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/api/programs` | Public | List all special programs |
| `POST` | `/api/admin/programs` | 🔒 | Create a program |
| `PUT` | `/api/admin/programs/{id}` | 🔒 | Update a program |
| `DELETE` | `/api/admin/programs/{id}` | 🔒 | Delete a program |

---

#### Owner Profile

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/api/owner` | Public | Get owner profile |
| `PUT` | `/api/admin/owner` | 🔒 | Update owner profile |

---

#### Logo

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/api/logo` | Public | Get current logo URL |
| `PUT` | `/api/admin/logo` | 🔒 | Update logo URL |

---

#### File Upload

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/api/admin/upload` | 🔒 | Upload a file (image/video). Returns `{ url, filename }` |

- **Max file size:** 10 MB  
- Uploaded files are saved with a UUID-based filename to `backend/uploads/`  
- Files are served statically at `/uploads/<filename>`

---

#### Health Check

| Method | Path | Description |
|---|---|---|
| `GET` | `/` | Returns API running confirmation |
| `GET` | `/api/health` | Returns `{ "status": "healthy" }` |

---

### Data Models

#### `Trainer`
| Field | Type | Notes |
|---|---|---|
| `id` | Integer PK | Auto-increment |
| `name` | String(255) | Required |
| `photo_url` | String(500) | URL to uploaded image |
| `is_in_marquee` | Boolean | Controls marquee visibility |
| `display_order` | Integer | Sort order |

#### `Package`
| Field | Type | Notes |
|---|---|---|
| `id` | Integer PK | — |
| `category` | String(50) | `gym` / `pt` / `group_pt` / `weight_loss` / `addon` |
| `title` | String(255) | e.g. "1 Month", "Single Class" |
| `price` | Integer | Amount in INR (₹) |
| `duration` | String(100) | e.g. "1 Month", "Per Class" |
| `notes` | Text | Optional footnote |
| `display_order` | Integer | Sort order within category |

#### `GymHours`
| Field | Type | Notes |
|---|---|---|
| `id` | Integer PK | — |
| `slot_name` | String(255) | e.g. "Morning", "Ladies Only" |
| `time_range` | String(255) | e.g. "6:30 AM – 12:00 PM" |
| `is_highlighted` | Boolean | Visually emphasizes the slot (e.g. ladies-only) |

#### `AdmissionCharge`
| Field | Type | Notes |
|---|---|---|
| `id` | Integer PK | — |
| `description` | String(255) | e.g. "Single Person" |
| `amount` | Integer | Amount in INR (₹) |

#### `Branch`
| Field | Type | Notes |
|---|---|---|
| `id` | Integer PK | — |
| `name` | String(255) | Branch name (e.g. "KASBA") |
| `address` | String(500) | Street address |
| `maps_url` | String(500) | Google Maps deep link |
| `photo_url` | String(500) | Optional branch image |

#### `GalleryItem`
| Field | Type | Notes |
|---|---|---|
| `id` | Integer PK | — |
| `media_type` | String(20) | `image` or `video` |
| `url` | String(500) | Uploaded file URL or external URL |
| `caption` | String(500) | Optional caption |
| `created_at` | DateTime | UTC timestamp, auto-set |

#### `WorkoutVideo`
| Field | Type | Notes |
|---|---|---|
| `id` | Integer PK | — |
| `title` | String(255) | — |
| `video_url` | String(1000) | YouTube / external URL or upload path |
| `display_order` | Integer | Sort order |

#### `SpecialProgram`
| Field | Type | Notes |
|---|---|---|
| `id` | Integer PK | — |
| `name` | String(255) | Program name |
| `display_order` | Integer | Sort order |

#### `Review`
| Field | Type | Notes |
|---|---|---|
| `id` | Integer PK | — |
| `name` | String(255) | Reviewer name |
| `rating` | Integer | 1–5 |
| `text` | Text | Review content |
| `created_at` | DateTime | UTC timestamp |

#### `Owner`
| Field | Type | Notes |
|---|---|---|
| `id` | Integer PK | — |
| `name` | String(255) | — |
| `photo_url` | String(500) | — |
| `description` | Text | Bio / about text |

---

### Authentication & Security

- **Algorithm:** HS256 JWT  
- **Token lifetime:** 24 hours (configurable via `JWT_EXPIRATION_MINUTES`)  
- **Password storage:** bcrypt hashed via passlib  
- **Auth dependency:** `get_current_admin` — a FastAPI `Depends` injected into every protected route. Validates the Bearer token and returns the admin's email payload.

> **Important:** The `JWT_SECRET_KEY` and `ADMIN_PASSWORD` in `core/config.py` are development defaults. **Change these before deploying to production** using environment variables or a `.env` file.

---

### Database & Seeding

The database is a local SQLite file (`shapeup.db`) managed via SQLAlchemy's async engine. It is automatically created on first startup via the `lifespan` hook in `main.py`.

`db/database.py → init_db()` performs the following on every startup:

1. Runs `Base.metadata.create_all` — creates missing tables without dropping existing data.
2. Seeds the following records **only if the respective table is empty:**
   - Admin user (from `ADMIN_EMAIL` / `ADMIN_PASSWORD` config)
   - Owner profile (Debashish Dutta)
   - 4 branch locations (Kasba, Triborno, Ballygunge, Nandibagan)
   - Gym hour slots (Morning, Ladies Only Afternoon, Evening, Closure)
   - Admission charges (Single, Group of 2, Group of 3+)
   - 20 pricing packages across all 5 categories
   - 1 blank logo record
   - 9 special programs (Stretching, Massage, Kickboxing, Yoga, etc.)

This means the database is **fully self-initializing** — no migration scripts or manual seed steps are needed.

---

### File Uploads

Uploaded files are saved to `backend/uploads/` with a UUID-based filename to prevent collisions. The directory is created automatically via `os.makedirs` in `core/config.py`.

The `/uploads` path is mounted as a `StaticFiles` directory in `main.py`, making uploaded files publicly accessible at:

```
http://localhost:8000/uploads/<uuid-filename>.<ext>
```

The frontend `getUploadUrl(path)` helper normalizes relative upload paths to full URLs.

---

### Backend Environment Variables

Configuration is handled by Pydantic Settings, which reads from a `.env` file in the `backend/` directory (falls back to defaults if absent).

Create `backend/.env` for production overrides:

```env
# Application
APP_NAME=SHAPE UP API
DEBUG=false

# Database
DATABASE_URL=sqlite+aiosqlite:///./shapeup.db

# JWT — CHANGE THIS IN PRODUCTION
JWT_SECRET_KEY=your-strong-random-secret-key-here
JWT_EXPIRATION_MINUTES=1440

# Admin credentials (seeded on first run)
ADMIN_EMAIL=your@email.com
ADMIN_PASSWORD=your-secure-password

# File Uploads
MAX_UPLOAD_SIZE=10485760

# CORS
CORS_ALLOW_ALL=false
CORS_ORIGINS=["https://yourfrontenddomain.com"]
```

---

### Running the Backend

```bash
cd backend

# Create and activate a virtual environment
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Start the development server (auto-reload enabled)
uvicorn main:app --reload --port 8000
```

The API will be available at **http://localhost:8000**.  
Swagger documentation: **http://localhost:8000/docs**

---

## Local Development (Full Stack)

Run both services simultaneously in two separate terminals:

**Terminal 1 — Backend:**
```bash
cd backend
venv\Scripts\activate
uvicorn main:app --reload --port 8000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```

Then open **http://localhost:3000** in your browser.

The admin panel is accessible at **http://localhost:3000/admin**.

---

## Deployment Notes

- **Backend:** Deploy using `uvicorn main:app --host 0.0.0.0 --port 8000` behind a reverse proxy (e.g. Nginx). For production, consider replacing SQLite with PostgreSQL (`asyncpg` driver) and set `DATABASE_URL` accordingly.
- **Frontend:** Run `npm run build && npm run start` or deploy to Vercel. Set `NEXT_PUBLIC_API_URL` to your backend's public URL.
- **CORS:** Set `CORS_ALLOW_ALL=false` and list your frontend domain in `CORS_ORIGINS` in production.
- **Secrets:** Override `JWT_SECRET_KEY` and admin credentials via environment variables — never commit production secrets to version control.
- **Uploads:** The `backend/uploads/` directory must be persisted across deployments (e.g. mounted volume). It is not tracked in git.
