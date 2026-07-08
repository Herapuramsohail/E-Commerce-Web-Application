# ShopSphere – Full-Stack MERN E-Commerce Platform

ShopSphere is a professional, production-ready, full-stack e-commerce web application built using the MERN Stack (**MongoDB, Express.js, React.js, Node.js**). It features clean architecture, protected routes, JWT authentication, server-side validation, a shopping cart, wishlists, customer reviews, checkout integration, and a comprehensive admin management dashboard with inventory alerts and interactive sales charts.

---

## Technical Stack & Libraries

### Frontend
- **Framework**: React.js (via Vite)
- **Styling**: Tailwind CSS (v3.4) & Custom glassmorphic utilities
- **Routing**: React Router DOM (v6)
- **State Management**: React Context API (AuthContext, CartContext)
- **Forms**: React Hook Form
- **Notifications**: React Toastify
- **Icons**: Lucide React

### Backend
- **Platform**: Node.js & Express.js
- **Database**: MongoDB & Mongoose
- **Security**: bcryptjs (password hashing) & JWT (authentication tokens)
- **Validation**: Express Validator
- **Image Processing**: Multer (configured local uploads)
- **Development**: Nodemon & dotenv
- **In-Memory fallback**: mongodb-memory-server (for zero-setup execution)

---

## User Roles & Key Features

### 👤 Customer Features
- **Authentication**: Secure registration, login, logout, password reset flow.
- **Persistent Sessions**: JWT session storage.
- **Product Catalog**: Paginated grid, fuzzy text search, category tags, price filters.
- **Product Details**: Image thumbnail slider, stock warnings, average star reviews list, add review form.
- **Wishlist**: Toggle and persist saved products locally.
- **Shopping Cart**: Real-time server sync, secure cost calculations, quantity increment/decrement, clear cart.
- **Checkout**: Add shipping address, coupon codes (e.g., `WELCOME20` for 20% off), select Stripe credit card checkout (simulated authorization delays) or Cash on Delivery.
- **Orders**: Interactive purchase logs detailing statuses (Pending, Processing, Shipped, Delivered, Cancelled) and invoice details.
- **Profile**: Update account profile details and avatar pictures.

### 🛡️ Admin Features
- **Dashboard Overview**: Cards representing Total Sales, Revenue, Product Count, and User Registrations.
- **Native Analytics**: SVG-based daily sales trends chart.
- **Stock Alerts**: Flags low inventory (stock <= 5).
- **Product Catalog Management**: Create products, modify details (prices, categories, stock, discounts), and delete items.
- **Order Administration**: Track all orders, check billing statements, and update delivery statuses (Pending to Delivered/Cancelled).
- **User Management**: Database list of active accounts, including deletion of users (deletes their carts automatically).

---

## Folder Structure

```text
shopsphere/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components (Navbar, Footer, ProductCard, etc.)
│   │   ├── context/        # AuthContext, CartContext
│   │   ├── pages/          # Home, Shop, Details, Cart, Checkout, Admin pages
│   │   ├── services/       # Axios API instances with interceptors
│   │   ├── index.css       # Tailwind entry and custom styling
│   │   ├── main.jsx        # App entry point
│   │   └── App.jsx         # Routes definition
│   ├── index.html          # HTML template with Google Fonts
│   ├── tailwind.config.js  # Theme configuration
│   └── postcss.config.js   # Style processor
│
└── server/                 # Express backend
    ├── config/             # DB connection configuration
    ├── controllers/        # Controllers (auth, products, carts, orders, users)
    ├── middleware/         # authMiddleware, uploadMiddleware
    ├── models/             # Mongoose schemas (User, Product, Cart, Order, Review)
    ├── routes/             # REST routing tables
    ├── uploads/            # Local product images directory
    ├── utils/              # Seeding utilities and helpers
    ├── .env                # App configuration variables
    └── server.js           # Server starter file
```

---

## REST API Endpoints

### 🔐 Authentication (`/api/auth`)
- `POST /register` - Register a customer. Input: `{ name, email, password }`
- `POST /login` - Login customer/admin. Input: `{ email, password }`
- `GET /profile` - Retrieve current profile (JWT required).
- `PUT /profile` - Update profile details. Input: `{ name, email, profileImage, password }`

### 📦 Products (`/api/products`)
- `GET /` - List products. Supports query filters: `?page=1&keyword=phone&category=Electronics&minPrice=10&maxPrice=100&sort=priceAsc`
- `GET /:id` - Get product details.
- `POST /` - Add product (Admin only). Supports multiple uploads.
- `PUT /:id` - Edit product (Admin only).
- `DELETE /:id` - Delete product (Admin only).
- `POST /:id/reviews` - Add user product review. Input: `{ rating, comment }`

### 🛒 Shopping Cart (`/api/cart`)
- `GET /` - Retrieve cart contents.
- `POST /` - Add/Update item. Input: `{ productId, quantity }`
- `DELETE /:productId` - Remove item.
- `DELETE /` - Clear cart.

### 📋 Orders (`/api/orders`)
- `POST /` - Place order. Input: `{ shippingAddress, paymentMethod, paymentResult }`
- `GET /myorders` - List current user's order history.
- `GET /analytics` - Get sales aggregates (Admin only).
- `GET /:id` - Inspect specific order details.
- `PUT /:id` - Update status (Admin only). Input: `{ orderStatus }`

### 👥 Users (`/api/users`)
- `GET /` - List users (Admin only).
- `DELETE /:id` - Delete user account (Admin only).

---

## Installation & Running Locally

### 1. Prerequisite Setup
Clone or navigate to the directory:
```bash
cd shopsphere
```

### 2. Backend Setup
1. Open the server folder and install dependencies:
   ```bash
   cd server
   npm install
   ```
2. Check or modify `.env` parameters:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/shopsphere
   JWT_SECRET=supersecretkey_shopsphere_2026_antigravity
   JWT_EXPIRES_IN=7d
   ```
3. Start the server:
   - **Development**: Runs nodemon for live updates.
     ```bash
     npm run dev
     ```
   - **Production**:
     ```bash
     npm start
     ```
   *Note: If a local MongoDB instance is not running on port 27017, the server will launch a temporary, fully functional in-memory database using `mongodb-memory-server` and pre-seed it with products, users, and carts for zero-setup execution.*

4. **Database Seeding (Optional)**:
   If running a local database, seed it manually:
   ```bash
   npm run seed
   ```

### 3. Frontend Setup
1. Open the client folder and install dependencies:
   ```bash
   cd ../client
   npm install
   ```
2. Start the Vite React development server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:5173` in your browser.

---

## Seed Authentication Accounts
For testing, use the following credentials:

- **Customer**:
  - Email: `customer@shopsphere.com`
  - Password: `customer123`
- **Admin**:
  - Email: `admin@shopsphere.com`
  - Password: `admin123`

---

## Deployment Guide

### Backend (on Render)
1. Sign up on **Render** and create a new **Web Service**.
2. Connect your GitHub repository containing the backend code.
3. Configure the settings:
   - **Environment**: `Node`
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && node server.js`
4. Define Environment Variables:
   - `MONGO_URI`: Your MongoDB Atlas connection URI string.
   - `JWT_SECRET`: A secure hashing key.
   - `NODE_ENV`: `production`
5. Click **Deploy**. Render will provide a service URL (e.g., `https://shopsphere-api.onrender.com`).

### Frontend (on Vercel)
1. Sign up on **Vercel** and select **Add New Project**.
2. Select your repository.
3. Configure build settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Set environment overrides:
   - Update the base Axios url in `client/src/services/api.js` to point to your live Render endpoint instead of `http://localhost:5000/api`.
5. Click **Deploy**. Vercel will build and host your single-page app with high performance.
