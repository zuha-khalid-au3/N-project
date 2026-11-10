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

## Deployment notes

### Frontend (Cloudflare Pages)

1. Build command: `npm run build`
2. Output directory: `client/dist`
3. Set `VITE_API_URL` to the production API.
4. SPA fallback is included via `client/public/_redirects`.

### API

1. Deploy the `server` Node app to any Node-compatible host.
2. Configure production env vars and CORS `CLIENT_URL`.
3. Persist or migrate off local uploads; prefer Cloudflare R2 in production (`STORAGE_PROVIDER=cloudflare_r2`).

### MongoDB Atlas

1. Create a free cluster for development.
2. Restrict network access to your API host.
3. Indexes are defined on the Mongoose models.

## Security notes

- Auth uses HTTP-only cookies (JWT).
- Admin routes require server-side authorization.
- Login and enquiry endpoints are rate-limited.
- Public product APIs return only `published` products.
