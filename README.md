# Lakshmi Kai Pakkuvam — Premium South Indian Homemade Foods E-Commerce

A complete full-stack e-commerce website built with Next.js App Router, MongoDB, Cloudinary, and Framer Motion. Sells traditional homemade pickles, thokku, podis, snacks, and combo packs.

## Tech Stack

- **Next.js 14** (App Router)
- **React 18**
- **Tailwind CSS**
- **MongoDB + Mongoose**
- **Cloudinary** (image hosting)
- **Framer Motion** (animations)
- **Lucide React** (icons)
- **JWT** (admin authentication)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Open `.env.local` in the project root and fill in your real values:

```env
MONGODB_URI=mongodb+srv://your_user:your_password@cluster.mongodb.net/lakshmi-kai-pakkuvam?retryWrites=true&w=majority

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name

JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production
ADMIN_PASSWORD=Admin@123

NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Where to get these:**
- **MongoDB URI**: Create a free cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas), then get the connection string from "Connect" → "Drivers".
- **Cloudinary**: Sign up free at [cloudinary.com](https://cloudinary.com), then find your Cloud Name, API Key, and API Secret on your dashboard home page.
- **JWT_SECRET**: Any long random string (e.g. generate one with `openssl rand -base64 32`).
- **ADMIN_PASSWORD**: Choose your own admin login password.

### 3. (Optional) Seed sample products

This populates your database with 10 sample products so the storefront isn't empty:

```bash
npm run seed
```

> Note: seeded products use Unsplash demo image URLs, not actual Cloudinary uploads. Use the Admin → Add Product page to upload real product photos via Cloudinary.

### 4. Run the development server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) for the storefront.

### 5. Access the Admin Panel

Visit [http://localhost:3000/admin](http://localhost:3000/admin) and log in with the password you set as `ADMIN_PASSWORD`.

Admin dashboard includes:
- **Orders** — view, search, filter, update status, delete
- **Inventory** — view stock, edit quantities, toggle in/out of stock, delete products
- **Add Product** — upload new products with Cloudinary images
- **Analytics** — revenue, order counts, best sellers, monthly chart, recent orders

## Folder Structure

```
lakshmi-kai-pakkuvam/
├── scripts/
│   └── seed.js                  # Sample product seeder
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   ├── login/page.tsx
│   │   │   ├── dashboard/
│   │   │   │   ├── orders/page.tsx
│   │   │   │   ├── inventory/page.tsx
│   │   │   │   ├── products/page.tsx
│   │   │   │   ├── analytics/page.tsx
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── api/
│   │   │   ├── products/route.ts
│   │   │   ├── products/[id]/route.ts
│   │   │   ├── orders/route.ts
│   │   │   ├── orders/[id]/route.ts
│   │   │   ├── auth/route.ts
│   │   │   ├── upload/route.ts
│   │   │   └── analytics/route.ts
│   │   ├── about/page.tsx
│   │   ├── shop/page.tsx
│   │   ├── product/[id]/page.tsx
│   │   ├── cart/page.tsx
│   │   ├── checkout/page.tsx
│   │   ├── order-success/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── faq/page.tsx
│   │   ├── layout.tsx
│   │   ├── page.tsx              # Homepage
│   │   ├── globals.css
│   │   └── not-found.tsx
│   ├── components/
│   │   ├── layout/                # Navbar, Footer, AnnouncementBar
│   │   ├── home/                  # Hero, FeaturedProducts, etc.
│   │   ├── shop/                  # ProductCard
│   │   └── admin/                 # AdminSidebar
│   ├── lib/
│   │   ├── mongodb.ts
│   │   ├── cloudinary.ts
│   │   ├── auth.ts
│   │   └── cart.ts
│   ├── models/
│   │   ├── Product.ts
│   │   └── Order.ts
│   ├── hooks/
│   │   └── useAdminAuth.ts
│   └── types/
│       └── index.ts
├── .env.local
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── postcss.config.mjs
```

## Notes

- Cart data is stored in **localStorage** (`lkp_cart` key) — no login required to shop.
- Orders are saved to **MongoDB** with an auto-generated order number (format: `LKP-XXXXX-XXXX`).
- Admin auth uses a simple password check against `ADMIN_PASSWORD`, issuing a JWT stored in both `localStorage` and an HTTP-only cookie.
- Free delivery is automatically applied on orders ≥ ₹499; otherwise a flat ₹49 delivery charge applies.
- Low stock warning threshold in the Inventory dashboard is set to 10 units (edit `LOW_STOCK_THRESHOLD` in `src/app/admin/dashboard/inventory/page.tsx` to change it).

## Build for Production

```bash
npm run build
npm run start
```
