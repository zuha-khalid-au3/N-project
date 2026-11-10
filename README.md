# Nemat Gems and Jewellery

Product catalogue and wholesale enquiry website for artificial gems and stones.

## Stack

- React + Vite (JavaScript only)
- Node.js + Express API
- MongoDB Atlas via Mongoose
- Local image storage in development; Cloudflare R2-ready for production
- Cloudflare Pages for the frontend SPA

## Structure

```text
client/   Public website + admin UI
server/   Express API, MongoDB models, uploads
docs/     Project specification
```

## Quick start (Yarn)

1. Copy environment defaults:

   ```bash
   cp .env.example .env
   ```

2. Set `MONGODB_URI`, `JWT_SECRET`, and business contact placeholders in `.env`.

3. Install dependencies:

   ```bash
   yarn install
   ```

4. Create the first admin:

   ```bash
   yarn create-admin --email owner@example.com --password 'your-strong-password'
   ```

5. Optional sample products (clearly marked SAMPLE):

   ```bash
   yarn seed
   ```

6. Run API + client:

   ```bash
   yarn dev
   ```

- Website: http://localhost:5173
- API health: http://localhost:5050/api/health
- Admin: http://localhost:5173/admin/login

> On macOS, port `5000` is often used by AirPlay Receiver, so the API defaults to `5050`.

## Scripts

| Command | Purpose |
| --- | --- |
| `yarn dev` | Start API and Vite client |
| `yarn build` | Production frontend build |
| `yarn start` | Start API only |
| `yarn create-admin` | Create first admin user |
| `yarn seed` | Insert sample catalogue products |
| `yarn lint` | Lint client and server |

## Environment

See `.env.example`. Never commit real `.env` values, MongoDB URIs, JWT secrets, storage credentials, or admin passwords.

Important variables:

- `MONGODB_URI`
- `JWT_SECRET` / `SESSION_SECRET`
- `CLIENT_URL`
- `VITE_API_URL` (frontend build-time API base, e.g. `https://api.example.com/api`)
- `STORAGE_PROVIDER=local` for development uploads under `server/uploads`
- Business contact fields (`BUSINESS_*`)

## Brand assets

- Desktop/header wordmark: `client/public/assets/brand/nemat-gems-jewellery-logo-wordmark.png`
- Mobile/favicon emblem: `client/public/assets/brand/nemat-gems-jewellery-emblem.png`

## Deployment guide

You need **3 parts**: website (frontend), API (backend), MongoDB (already on Atlas).

### 1) MongoDB Atlas (already set up)

- Keep your cluster running.
- Network Access: allow your API host IPs (or temporarily `0.0.0.0/0` while testing).
- Use the same `MONGODB_URI` in the API host env vars.

### 2) Deploy API (Render / Railway / Fly.io)

Recommended easy option: **Render Web Service**

1. Create a new Web Service from this GitHub repo.
2. Root/settings:
   - Build command: `yarn install`
   - Start command: `yarn workspace server start`
3. Add env vars from `.env.example` (production values):
   - `NODE_ENV=production`
   - `PORT` (host usually sets this)
   - `MONGODB_URI`
   - `JWT_SECRET` / `SESSION_SECRET` (long random strings)
   - `CLIENT_URL=https://nemat.gems.workers.dev` (must match the live frontend exactly)
   - Optional: `CLIENT_ORIGINS=https://old-frontend.example,https://another.example`
   - `COOKIE_NAME=nemat_gems_session`
   - `BUSINESS_*` contact fields
   - For images in production, use object storage (see below). Local `server/uploads` is fine only for demos.
4. After deploy, test: `https://your-api-domain/api/health` → `{ "ok": true }`
5. Create admin on the server once:

   ```bash
   yarn create-admin --email zuhakhalid@gmail.com --password 'your-strong-password'
   ```

### 3) Deploy frontend (Cloudflare)

Cloudflare’s newer UI may show **Workers** with Wrangler (no “Build output directory” field). That is fine.

1. Connect GitHub repo `N-project`.
2. Settings:
   - Build command: `corepack enable && corepack prepare yarn@1.22.22 --activate && yarn install --frozen-lockfile && yarn build`
   - Deploy command: `npx wrangler deploy`
   - Path/root: `/`
   - Important: this repo uses Yarn Classic (`1.22.22`). Cloudflare’s Yarn 4 breaks the lockfile.
3. Environment variable (must be available at **build** time):
   - `VITE_API_URL=https://your-api-domain/api`
4. Repo includes `wrangler.toml` pointing assets to `client/dist` with SPA routing.
5. Deploy, then open the Cloudflare URL and confirm products + admin login work.

If you still see classic **Pages** settings, use:
- Build command: `yarn install && yarn build`
- Build output directory: `client/dist`

### 4) Production images (important)

Local disk uploads on Render **do not persist**.

#### Recommended on Render: store images in MongoDB Atlas

No extra Cloudflare R2 setup needed. Image files are saved in MongoDB and served from:

`https://YOUR-API.onrender.com/uploads/products/...`

On Render set:

```env
STORAGE_PROVIDER=mongodb
```

Then **re-upload** product images in admin after deploy (old disk-only files are already gone).

#### Optional: Cloudflare R2

```env
STORAGE_PROVIDER=cloudflare_r2
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=...
R2_PUBLIC_BASE_URL=https://pub-xxxxx.r2.dev
```

### Quick checklist

- [ ] API health endpoint works
- [ ] `CLIENT_URL` matches frontend domain (CORS + cookies)
- [ ] Frontend `VITE_API_URL` points to API `/api`
- [ ] Admin user created in production DB
- [ ] Product images uploading and visible on public site

## Security notes

- Auth uses HTTP-only cookies (JWT).
- Admin routes require server-side authorization.
- Login and enquiry endpoints are rate-limited.
- Public product APIs return only `published` products.
