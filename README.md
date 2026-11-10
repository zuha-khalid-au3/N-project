# N-project — Nemat Gems and Jewellery

Starter repository for the Nemat Gems and Jewellery product catalogue website.

## Current contents

- `client/public/assets/brand/nemat-gems-jewellery-logo-wordmark.png` — horizontal website logo.
- `client/public/assets/brand/nemat-gems-jewellery-emblem.png` — compact emblem for mobile, favicon, social media, and packaging.
- `docs/CURSOR-PROJECT-SPECIFICATION.md` — complete implementation prompt for Cursor.

## Planned technology

- React and Vite frontend
- JavaScript only; no TypeScript
- Node.js and Express backend
- MongoDB Atlas database
- Object storage for product images
- GitHub for source control
- Cloudflare Pages for the frontend

## Continue in Cursor

1. Clone the repository:

   ```bash
   git clone https://github.com/zuha-khalid-au3/N-project.git
   cd N-project
   ```

2. Open the folder in Cursor.
3. Open `docs/CURSOR-PROJECT-SPECIFICATION.md`.
4. Attach or reference that file in Cursor.
5. Attach the two logo files from `client/public/assets/brand/`.
6. Ask Cursor to implement the specification phase by phase.

Suggested first Cursor instruction:

> Read `docs/CURSOR-PROJECT-SPECIFICATION.md` completely. Start with Phase A: scaffold the React/Vite client and Node.js/Express server while preserving the existing brand assets. Use JavaScript only, MongoDB Atlas as the database, and keep the project runnable after this phase. Do not replace MongoDB with another database or introduce TypeScript.

## Brand

Brand name: **Nemat Gems and Jewellery**

Primary visual direction: deep charcoal, midnight blue, warm gold, white, soft grey, and royal jewel blue. Use the horizontal wordmark in the desktop header and the compact emblem in small spaces.

## Important security rule

Never commit real `.env` files, MongoDB connection strings, storage credentials, JWT secrets, or admin passwords. Use `.env.example` files with placeholder values only.
