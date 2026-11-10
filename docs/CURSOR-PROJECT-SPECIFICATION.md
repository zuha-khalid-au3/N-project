# Cursor Project Specification: Artificial Gems & Stones Catalogue

## 1. Project objective

Build a production-ready, mobile-first product catalogue website for a business that manufactures artificial gems and stones.

The website must have:

1. A public-facing product catalogue.
2. A secure admin panel.
3. An admin product upload form.
4. MongoDB as the only application database.
5. Automatic display of newly published products on the public website.
6. Product image upload and storage.
7. Product search, filtering, and detail pages.
8. WhatsApp and contact enquiry actions.
9. JavaScript and Node.js only. Do not use TypeScript.

This is a catalogue and enquiry website for the first release. Do not implement online payments unless explicitly requested later.

## 2. Mandatory technology choices

Use the following stack:

- Frontend: React with Vite.
- Language: JavaScript only.
- Backend: Node.js with Express.
- Database: MongoDB Atlas.
- MongoDB driver: Mongoose or the official MongoDB Node.js driver. Prefer Mongoose for schema validation and maintainability.
- Authentication: Secure HTTP-only cookie session or JWT stored in an HTTP-only cookie. Never store authentication tokens in localStorage.
- Password hashing: Argon2 or bcrypt.
- Public hosting: Cloudflare Pages for the frontend.
- API hosting: Use a Node.js-compatible host. Keep the API deployable independently from the frontend.
- Repository: GitHub.
- Image storage: Use an object-storage provider such as Cloudflare R2. MongoDB must store image URLs and metadata, not large image binaries.
- Styling: Use a clean responsive CSS system. Tailwind CSS is allowed but not required.
- Validation: Use Zod, Joi, or express-validator on the server. Use matching client-side validation for good user feedback.

Do not use Supabase, Firebase, PostgreSQL, MySQL, Prisma, TypeScript, or a server-side-rendered framework unless the project owner explicitly changes the requirements.

## 3. Product and brand assumptions

The business manufactures artificial gems and stones for wholesale and business customers.

Use a premium but practical visual style:

- Deep charcoal or midnight background for selected sections.
- Warm gold or amber as the primary accent.
- White and soft grey surfaces for readability.
- High-quality product photography.
- Clean layouts with generous spacing.
- Avoid excessive gradients, childish illustrations, and generic stock imagery.
- The website must look suitable for a manufacturer and wholesale supplier.

Use placeholder business content only where real content is unavailable. Make all business information easy to change from one configuration file.

## 4. Brand identity and UI direction

The brand name is **Nemat Gems and Jewellery**.

Use this visual identity throughout the website:

- Brand personality: premium, trustworthy, refined, modern, and suitable for wholesale buyers.
- Primary colors: deep charcoal, midnight blue, warm gold, white, and soft grey.
- Accent color: royal jewel blue.
- Use an elegant serif typeface for the brand wordmark and headings where appropriate.
- Use a clean sans-serif typeface for product specifications, navigation, buttons, forms, and admin content.
- Use generous spacing, clean grids, high-quality product photography, subtle borders, and restrained shadows.
- Avoid childish illustrations, generic stock imagery, excessive gradients, loud neon colors, and cluttered layouts.
- The design should look like a premium jewellery catalogue and a professional manufacturing supplier website.

### Logo assets

Use the supplied Nemat Gems and Jewellery logo assets when they are available:

- Horizontal wordmark: `nemat-gems-jewellery-logo-wordmark.png`
- Compact emblem: `nemat-gems-jewellery-emblem.png`

Copy them into `client/public/assets/brand/` and use them as follows:

- Use the horizontal wordmark in the desktop header, footer, quotation documents, and presentation areas.
- Use the compact emblem in the mobile header, favicon, social profile image, WhatsApp profile image, product tags, packaging, and small spaces.
- Preserve the aspect ratio and do not stretch, rotate, or apply filters to the logos.
- Provide a light-background usage and a dark-background usage. Ensure the logo remains readable in both contexts.
- Add an accessible alt value such as `Nemat Gems and Jewellery`.
- If the supplied files are unavailable in the Cursor workspace, create a temporary placeholder using the same proportions and clearly mark it for replacement. Do not invent a different brand name.

### Public website UI

#### Header

- Place the logo on the left.
- Use navigation items: `Home`, `Products`, `About Us`, and `Contact`.
- Include a visible `Chat on WhatsApp` or `Request a Quote` button.
- Use a compact mobile menu on small screens.
- Keep the header clean and sticky or gently persistent without covering content.

#### Homepage

Build the homepage in this order:

1. Hero section with a premium artificial-gem or stone image, the headline `Crafted Brilliance for Every Creation`, a concise supporting paragraph, and the buttons `Explore Products` and `Request a Quote`.
2. Product category section for Artificial Gems, Decorative Stones, Beads and Crystals, and Custom Designs. Make category names configurable.
3. Featured products section with high-quality images, product name, key specifications, and a `View Details` action.
4. Manufacturing and quality section with configurable claims only. Never invent certifications, capacity, export countries, or years of experience.
5. Wholesale enquiry section with the message `Looking for a specific colour, shape, or size?` and WhatsApp/contact actions.
6. Footer with logo, contact details, product links, social links, address, and copyright text.

#### Product catalogue UI

- Use a responsive product-card layout with strong image presentation.
- Include search, category, color, shape, material, stock-status, and sorting controls where data exists.
- Display product name, selected specifications, stock status, and a `View Details` button.
- Include useful loading, empty, error, and no-results states.
- Do not show unpublished or hidden products to public visitors.

#### Product detail UI

- Show a large product-image gallery with thumbnails.
- Show product name, SKU, material, color, shape, size, finish, MOQ, stock status, and price label.
- Use `Ask on WhatsApp` as the main enquiry action and prefill the product name in the WhatsApp message.
- Include a description, related products, and a clear return-to-catalogue action.

#### Admin panel UI

- Keep the admin panel practical and less decorative than the public website.
- Use a dark charcoal sidebar or top navigation with gold highlights and white content surfaces.
- Dashboard cards should show total, published, draft, and hidden product counts.
- The product form must have clear sections for basic information, specifications, images, SEO, and publishing status.
- Show image previews, upload progress, validation errors, save confirmation, and publish confirmation.
- Use confirmation dialogs for deletion and destructive actions.

### Primary calls to action

Use these labels consistently:

- `Explore Products`
- `View Collection`
- `View Details`
- `Request a Quote`
- `Chat on WhatsApp`
- `Ask on WhatsApp`
- `Add Product`
- `Save Draft`
- `Publish Product`

Do not use vague filler such as `Learn More` when a more specific action is possible.

## 5. Repository structure

Create this structure:

```text
artificial-gems-catalogue/
├── client/
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/
│       ├── layouts/
│       ├── pages/
│       │   ├── Home.jsx
│       │   ├── Products.jsx
│       │   ├── ProductDetails.jsx
│       │   ├── About.jsx
│       │   ├── Contact.jsx
│       │   ├── admin/
│       │   │   ├── AdminLogin.jsx
│       │   │   ├── AdminDashboard.jsx
│       │   │   ├── ProductCreate.jsx
│       │   │   └── ProductEdit.jsx
│       ├── services/
│       │   ├── api.js
│       │   ├── authService.js
│       │   └── productService.js
│       ├── hooks/
│       ├── context/
│       │   └── AuthContext.jsx
│       ├── routes/
│       ├── utils/
│       ├── config/
│       ├── App.jsx
│       └── main.jsx
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   ├── environment.js
│   │   │   └── business.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── productController.js
│   │   │   ├── uploadController.js
│   │   │   └── inquiryController.js
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   ├── adminMiddleware.js
│   │   │   ├── errorMiddleware.js
│   │   │   ├── rateLimitMiddleware.js
│   │   │   └── validationMiddleware.js
│   │   ├── models/
│   │   │   ├── AdminUser.js
│   │   │   ├── Product.js
│   │   │   └── Inquiry.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── productRoutes.js
│   │   │   ├── uploadRoutes.js
│   │   │   └── inquiryRoutes.js
│   │   ├── services/
│   │   │   ├── authService.js
│   │   │   ├── productService.js
│   │   │   └── storageService.js
│   │   ├── validators/
│   │   ├── app.js
│   │   └── server.js
│   └── package.json
├── .env.example
├── .gitignore
├── README.md
└── package.json
```

If a simpler monorepo structure is more appropriate, preserve the separation between `client` and `server`.

## 5. MongoDB data models

### AdminUser

Collection: `adminUsers`

Fields:

```js
{
  email: String,              // required, unique, lowercase
  passwordHash: String,       // required, never return in API responses
  role: String,               // enum: "admin"
  isActive: Boolean,
  lastLoginAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

Create a unique index on `email`.

### Product

Collection: `products`

Fields:

```js
{
  name: String,               // required
  slug: String,               // required, unique
  sku: String,                // optional, unique when present
  category: String,           // required
  material: String,
  color: String,
  shape: String,
  size: String,
  finish: String,
  description: String,         // required
  moq: String,                // minimum order quantity
  priceLabel: String,          // example: "Contact for quotation"
  stockStatus: String,         // enum: "in_stock", "made_to_order", "out_of_stock"
  status: String,              // enum: "draft", "published", "hidden"
  featured: Boolean,
  images: [
    {
      url: String,
      storageKey: String,
      altText: String,
      sortOrder: Number
    }
  ],
  seo: {
    title: String,
    description: String
  },
  createdAt: Date,
  updatedAt: Date,
  publishedAt: Date
}
```

Create indexes on:

- `slug` unique.
- `sku` sparse unique where applicable.
- `status`.
- `category`.
- `featured`.
- `createdAt`.
- Text index across `name`, `description`, `category`, `color`, and `material` if compatible with the selected search approach.

### Inquiry

Collection: `inquiries`

Fields:

```js
{
  productId: ObjectId,
  name: String,
  email: String,
  phone: String,
  company: String,
  message: String,
  status: String,              // enum: "new", "contacted", "closed"
  createdAt: Date,
  updatedAt: Date
}
```

The inquiry feature may be implemented after the core catalogue if time is limited. The WhatsApp button is required in the first release.

## 6. Required public pages

### Home page `/`

Include:

- Business name and concise value proposition.
- Hero section focused on artificial gems and stones.
- Primary CTA: `View Products`.
- Secondary CTA: `Contact Us` or `Chat on WhatsApp`.
- Featured product section.
- Manufacturing or quality highlights.
- Product category links.
- Trust section with configurable business claims only; do not invent certifications.
- Footer with contact information and navigation.

### Product listing `/products`

Include:

- Search box.
- Category filter.
- Color filter.
- Shape filter.
- Material filter.
- Stock-status filter.
- Featured filter if useful.
- Sort by newest, name, and featured.
- Responsive product cards.
- Empty state when no products match.
- Pagination or safe limited loading.

Only products with `status: "published"` may be returned by the public API.

### Product details `/products/:slug`

Include:

- Product name.
- Image gallery.
- Description.
- SKU where available.
- Category.
- Material, color, shape, size, and finish.
- Minimum order quantity.
- Stock status.
- Price label.
- WhatsApp enquiry button with the product name prefilled.
- Related products.
- SEO title and description.

### About `/about`

Include configurable company story, manufacturing capabilities, quality approach, and service area. Do not invent years of experience, certifications, export countries, or production capacity.

### Contact `/contact`

Include:

- Phone.
- WhatsApp.
- Email.
- Address.
- Google Maps link.
- Contact form if implemented.
- Business hours.

## 7. Required admin pages

### Admin login `/admin/login`

- Email and password fields.
- Clear validation messages.
- Loading state.
- Generic login failure message that does not reveal whether an email exists.
- Rate limiting on login attempts.
- Secure redirect to dashboard after login.

### Admin dashboard `/admin`

Show:

- Total products.
- Published products.
- Draft products.
- Hidden products.
- Recent products.
- Button to add a product.
- Logout button.

### Product create `/admin/products/new`

Fields:

- Product name.
- SKU.
- Category.
- Material.
- Color.
- Shape.
- Size.
- Finish.
- Description.
- Minimum order quantity.
- Price label.
- Stock status.
- Featured checkbox.
- Multiple image upload.
- Image alt text.
- Status: draft or published.

The form must show a preview before saving where practical.

### Product edit `/admin/products/:id/edit`

Allow the admin to edit all product fields, reorder images, add images, remove images, change status, and save changes.

### Product management

Allow the admin to:

- Search products.
- Filter by status.
- Edit products.
- Publish products.
- Unpublish products.
- Hide products.
- Delete products only after confirmation.

## 8. API contract

Use JSON responses with a consistent format.

Success example:

```json
{
  "success": true,
  "data": {},
  "message": "Product created successfully"
}
```

Error example:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Please correct the highlighted fields",
    "fields": {}
  }
}
```

Required routes:

### Health

- `GET /api/health`

Response must include `{ "ok": true }` when the server is running.

### Authentication

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Public products

- `GET /api/products`
- `GET /api/products/featured`
- `GET /api/products/:slug`
- `GET /api/categories`
- `GET /api/filters`

### Admin products

All require authenticated admin access:

- `GET /api/admin/products`
- `POST /api/admin/products`
- `GET /api/admin/products/:id`
- `PATCH /api/admin/products/:id`
- `DELETE /api/admin/products/:id`
- `POST /api/admin/products/:id/publish`
- `POST /api/admin/products/:id/unpublish`

### Uploads

All require authenticated admin access:

- `POST /api/admin/uploads/sign`
- `DELETE /api/admin/uploads`

Prefer signed uploads to object storage so large image files do not pass unnecessarily through the API. Validate MIME type, extension, file size, and image count.

### Inquiries

- `POST /api/inquiries`
- `GET /api/admin/inquiries`
- `PATCH /api/admin/inquiries/:id`

## 9. Security requirements

Implement all of the following:

1. Never expose `MONGODB_URI`, JWT secrets, storage secrets, or admin credentials to the frontend.
2. Add `.env` to `.gitignore`.
3. Provide `.env.example` with variable names only and fake placeholder values.
4. Hash admin passwords with Argon2 or bcrypt.
5. Use secure HTTP-only cookies for authentication.
6. Use `Secure` cookies in production HTTPS.
7. Use appropriate `SameSite` settings.
8. Add CORS with an explicit frontend origin, not `*` in production.
9. Add Helmet or equivalent security headers.
10. Add rate limiting to login and public inquiry endpoints.
11. Validate and sanitize all incoming data on the server.
12. Enforce maximum request body size.
13. Validate uploaded image MIME type and size.
14. Prevent path traversal in storage keys.
15. Do not trust `role` values submitted by the browser.
16. Return generic authentication errors.
17. Add authorization middleware to every admin route.
18. Do not allow unpublished products through public endpoints.
19. Escape or safely render product descriptions to prevent XSS.
20. Use MongoDB indexes and projections so public endpoints do not return unnecessary private fields.

## 10. Environment variables

Create `.env.example`:

```env
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/artificial_gems
SESSION_SECRET=replace_with_a_long_random_secret
JWT_SECRET=replace_with_a_long_random_secret
COOKIE_NAME=artificial_gems_session
STORAGE_PROVIDER=cloudflare_r2
R2_ACCOUNT_ID=replace_me
R2_ACCESS_KEY_ID=replace_me
R2_SECRET_ACCESS_KEY=replace_me
R2_BUCKET_NAME=replace_me
R2_PUBLIC_BASE_URL=https://images.example.com
BUSINESS_NAME=Your Business Name
BUSINESS_PHONE=+00 0000000000
BUSINESS_WHATSAPP=+00 0000000000
BUSINESS_EMAIL=info@example.com
BUSINESS_ADDRESS=Your business address
```

Do not commit real values.

## 11. Image requirements

- Accept JPEG, PNG, and WebP.
- Prefer WebP for new uploads.
- Maximum upload size: 5 MB per image before compression.
- Maximum 8 images per product.
- Resize large images on the client where practical.
- Generate useful alt text from the product name, but allow the admin to edit it.
- Store only the image URL, storage key, alt text, and sort order in MongoDB.
- Delete orphaned storage objects when an image is permanently removed.
- Show upload progress and errors.

## 12. Business configuration

Create a single configuration module for editable business information:

```js
export const businessConfig = {
  name: "Your Business Name",
  tagline: "Artificial gems and stones for your next creation",
  phone: "+00 0000000000",
  whatsapp: "+00 0000000000",
  email: "info@example.com",
  address: "Your business address",
  mapUrl: "",
  socialLinks: {
    instagram: "",
    facebook: "",
    linkedin: ""
  }
};
```

Do not scatter phone numbers, email addresses, or company names throughout the codebase.

## 13. SEO and accessibility

Implement:

- Unique page titles.
- Meta descriptions.
- Open Graph metadata.
- Product-specific metadata on product detail pages.
- Canonical URLs where appropriate.
- `sitemap.xml` for public pages and published products.
- `robots.txt` that blocks `/admin`.
- Semantic HTML.
- Keyboard-accessible controls.
- Visible focus states.
- Alt text for product images.
- Good color contrast.
- Responsive layouts from 320px width upward.

## 14. Development scripts

The root project should provide scripts similar to:

```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev:server\" \"npm run dev:client\"",
    "dev:client": "npm --prefix client run dev",
    "dev:server": "npm --prefix server run dev",
    "build": "npm --prefix client run build",
    "start": "npm --prefix server start",
    "lint": "npm --prefix client run lint && npm --prefix server run lint",
    "test": "npm --prefix server test"
  }
}
```

Use a simple `README.md` explaining installation, environment variables, local development, database setup, admin creation, and deployment.

## 15. Seed and admin setup

Create a safe setup script that creates the first admin user from environment variables or a one-time CLI command.

Do not hard-code a default password.

Example command:

```bash
npm --prefix server run create-admin -- --email owner@example.com
```

Prompt securely for the password or require an environment variable during setup.

Also provide an optional seed script with clearly marked sample products. Sample products must be easy to delete and must not be presented as real business inventory.

## 16. Deployment requirements

### Frontend

- Build the React client.
- Deploy the generated frontend to Cloudflare Pages.
- Configure the production API URL as a frontend environment variable.
- Configure SPA fallback routing so direct product and admin URLs work.

### API

- Deploy the Node.js API to a Node-compatible service.
- Configure all server environment variables.
- Add the production frontend URL to CORS.
- Add a health-check endpoint.
- Use production logging without exposing secrets.

### MongoDB Atlas

- Create a Free cluster during initial development.
- Create a database user with a strong password.
- Restrict network access as much as the selected hosting environment allows.
- Create the database indexes during application startup or a migration/setup command.
- Set a billing alert if a paid MongoDB plan is ever enabled.
- Export the database regularly because a free cluster is not a complete backup strategy.

## 17. Acceptance criteria

The implementation is acceptable only when all of the following work:

1. A visitor can open the homepage on a mobile phone.
2. A visitor can browse only published products.
3. A visitor can search products.
4. A visitor can filter products by category and relevant attributes.
5. A visitor can open a product detail page using a readable slug.
6. A visitor can see product images, specifications, MOQ, stock status, and enquiry actions.
7. An unauthenticated visitor cannot access admin data or admin actions.
8. The admin can log in and log out.
9. The admin can create a draft product.
10. The admin can upload multiple product images.
11. The admin can publish a product.
12. A newly published product appears automatically in the public catalogue without manually editing frontend code.
13. The admin can edit, hide, unpublish, and delete products.
14. Deleted products do not remain visible through public API endpoints.
15. MongoDB stores product data and image metadata.
16. Large image files are stored outside MongoDB.
17. Secrets are absent from the Git repository and browser bundle.
18. The API validates all admin input.
19. The API has a working health endpoint.
20. The project can be installed and run from the README instructions.
21. The frontend production build completes successfully.
22. Direct navigation to `/products/:slug` and `/admin` works after deployment.
23. The website includes usable loading, empty, success, and error states.
24. The website has no TypeScript files.

## 18. Cursor execution instructions

Implement this in phases and keep the application runnable after every phase.

### Phase A: Scaffold

Create the monorepo, React/Vite client, Express server, environment example, Git ignore, README, and health endpoint.

### Phase B: MongoDB

Add the MongoDB connection, Mongoose models, indexes, validation, safe admin creation script, and optional sample seed.

### Phase C: Public catalogue

Build the home page, product listing, filters, product detail page, responsive layout, SEO metadata, and WhatsApp links.

### Phase D: Authentication

Build admin login, secure session handling, authorization middleware, logout, and protected route behavior.

### Phase E: Admin product management

Build dashboard, product create, image upload, product edit, publish/unpublish, hide, delete, validation, and success/error states.

### Phase F: Inquiry and polish

Add the inquiry workflow, contact page, accessibility improvements, SEO files, image optimization, rate limiting, and deployment documentation.

After each phase:

1. Run linting.
2. Run available tests.
3. Run the production frontend build.
4. Check that no secrets are committed.
5. Update the README if setup behavior changed.
6. Keep the code simple and readable.

Do not replace MongoDB with another database. Do not use TypeScript. Do not create fake certifications, customer reviews, business history, or product claims. Ask for clarification only when a missing business decision blocks implementation; otherwise use clearly marked configuration placeholders.

## 19. Useful official references

- GitHub product plans: https://docs.github.com/get-started/learning-about-github/githubs-products
- GitHub Pages usage limits: https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits
- MongoDB Atlas pricing: https://www.mongodb.com/pricing
- MongoDB Atlas Free cluster limitations: https://www.mongodb.com/docs/atlas/reference/free-shared-limitations/
- Cloudflare Pages limits: https://developers.cloudflare.com/pages/platform/limits/
