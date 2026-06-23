# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

**Briarey** (Бриарей) is a content catalog site for a Russian fire-safety equipment manufacturer. It is a **read-only marketing/catalog site** — no real shopping cart, customer accounts, or payments. The frontend has `cart`/`checkout` routes, but orders are simple lead submissions (`POST /api/orders`), not e-commerce transactions. All site content is managed through the Laravel Filament admin panel; the public site is generated from it.

The canonical spec is [TECHNICAL_SPEC.md](TECHNICAL_SPEC.md) (in Russian). UI text, content, and many comments are in Russian — preserve that language when editing user-facing strings.

## Architecture

Two independent apps in one repo, glued by nginx and a REST API:

- **`frontend/`** — Next.js 14 (App Router), TypeScript, Tailwind CSS. Server-rendered. Talks to the backend over HTTP only.
- **`backend/`** — Laravel 12, PHP 8.2+ (Docker image uses 8.4), Filament 4 admin, MySQL 8.

Request flow (via nginx, see [docker/nginx/default.conf](docker/nginx/default.conf)):
- `/api`, `/admin`, `/livewire`, `/storage`, `/sanctum`, Filament assets → Laravel (`php:8000`)
- everything else → Next.js (`node:3000`)

The admin panel lives at `/admin`. The public API is unauthenticated read endpoints plus a few `POST` lead endpoints.

### Frontend ↔ Backend contract

- All API access goes through [frontend/lib/api.ts](frontend/lib/api.ts). It defines the `API_BASE` (server-side uses `API_URL` → internal `http://php:8000/api`; client-side uses `NEXT_PUBLIC_API_URL` → `/api`), TypeScript interfaces mirroring the backend JSON, and typed fetch helpers. **When you change an API response shape, update the matching interface here.** Responses are cached with `next: { revalidate: 60 }`.
- The home page is delivered as one aggregate payload: `GET /api/home` (handled by `HomeController::index`) returns every section of the landing page at once. `GET /api/site-settings` returns global header/footer data.
- Image URLs: `storageUrl()` resolves Laravel storage paths; `productImageUrl()` prefers a static `/images/catalog/products/{slug}.png` and falls back to storage. Next.js rewrites `/storage/:path*` to the backend (see [frontend/next.config.js](frontend/next.config.js)).
- API routes are declared in [backend/routes/api.php](backend/routes/api.php) and map to controllers in `backend/app/Http/Controllers/Api/`.

### Backend structure

- `app/Models/` — one Eloquent model per content block (Hero, Slide, Advantage, Faq, Category, Product + its many sub-models like `ProductImage`/`ProductMainSpec`/`ProductCompositionItem`, News, Certificate, Vacancy, etc.). The catalog is the most relational area: `Category` → `Product` → attribute/spec/composition/extra child tables.
- `app/Filament/Resources/` — one Filament resource per model; this is how content is edited. Adding a new content type means: migration + model + Filament resource + (usually) an API controller method + a seeder.
- `app/Http/Controllers/Api/` — thin read controllers that shape Eloquent data into the JSON the frontend expects.
- `database/seeders/` — each section has its own seeder; `DatabaseSeeder` orchestrates them. Seeders populate realistic default content, so a fresh DB renders a complete site.
- `database/data/catalog_import.json` — source catalog data.
- **Catalog import** uses `maatwebsite/excel`: `app/Imports/ProductsImport.php` + `app/Imports/Sheets/*` import a multi-sheet workbook (products, attributes, composition, extras). `app/Exports/` is the export counterpart. `app/Console/Commands/ScrapeProducts.php` is a scraper command (uses `symfony/dom-crawler`).

## Commands

All backend commands run **inside the `php` container** (or via Sail). From the repo root:

```bash
# Bring up the whole stack (nginx + php + mysql + node)
docker compose up -d
docker compose up -d --build        # rebuild after Dockerfile/dependency changes

# Open a shell in the backend container
docker compose exec php bash
```

### Backend (Laravel) — run inside the `php` container

```bash
php artisan migrate                 # run migrations
php artisan migrate:fresh --seed    # reset DB and reseed all content
php artisan db:seed                 # seed only
php artisan db:seed --class=NewsSeeder   # seed a single section
php artisan storage:link            # symlink public storage (done in Dockerfile)

composer test                       # config:clear + artisan test (PHPUnit)
php artisan test --filter=SomeTest  # run a single test
./vendor/bin/pint                   # format PHP (Laravel Pint)

# All-in-one local dev (server + queue + logs + vite) — defined in composer.json
composer dev
```

`composer setup` (in [backend/composer.json](backend/composer.json)) does a full first-time bootstrap: install, `.env` copy, key generate, migrate, npm build.

### Frontend (Next.js) — run inside the `node` container or `frontend/`

```bash
npm run dev      # next dev (port 3000)
npm run build    # production build
npm run start    # serve production build
npm run lint     # next lint
```

Note: the `node` Dockerfile runs `npm run dev`; the `backend/package.json` Vite scripts are only for compiling Filament/admin assets, **not** the public frontend.

## Conventions

- Content is data-driven: prefer adding/editing content via seeders + Filament resources over hardcoding it in frontend components. A new landing-page section generally needs a model, migration, Filament resource, seeder, an API field in `HomeController`, and a TypeScript interface in `lib/api.ts`.
- Keep Russian for all user-facing copy and content fields.
- `convert_dymka.py` (repo root) is a one-off FFmpeg helper to convert a GIF to alpha-channel `.webm`/`.mov` for the frontend — not part of the app runtime.
- `deploy.sh` and `webhook.py` are gitignored server-side deploy scripts and are not in the repo.
