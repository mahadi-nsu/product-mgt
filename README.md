# Product Management App

A modern, full-featured product management application built with Next.js, featuring authentication, CRUD operations, search, pagination, and a polished UI/UX.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/mahadi-nsu/product-mgt.git
   cd product-mgt
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:

   ```bash
   # API Configuration
   NEXT_PUBLIC_API_BASE=https://api.bitechx.com
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔐 Authentication

- **Email**: Use your registered email address
- **Default**: `mahadi.nsucse@gmail.com` (pre-filled for testing)
- **JWT Token**: Automatically stored and managed

## ✨ Features

### 🔑 Authentication & Authorization

- **Login/Logout**: JWT-based authentication
- **Protected Routes**: Automatic redirect for unauthenticated users
- **Persistent Sessions**: Auth state persists across browser refreshes
- **Token Management**: Automatic token inclusion in API requests

### 📦 Product Management

- **View Products**: Paginated product listing with beautiful cards
- **Product Details**: Full product information with actions
- **Create Products**: Form with validation and category selection
- **Edit Products**: Update product information
- **Delete Products**: Confirmation modal with success feedback

### 🔍 Search & Filtering

- **Real-time Search**: Search products by name
- **Category Filtering**: Filter products by category
- **Combined Filters**: Search + category filtering
- **URL State**: All filters reflected in URL for bookmarking

### 📄 Pagination

- **Smart Pagination**: Efficient page-based navigation
- **URL Integration**: Page state in URL
- **Responsive Controls**: Mobile-friendly pagination

### 🎨 UI/UX Features

- **Responsive Design**: Works on all screen sizes
- **Loading States**: Skeleton loaders and loading indicators
- **Error Handling**: User-friendly error messages
- **Hover Effects**: Smooth animations and transitions
- **Consistent Heights**: Uniform product card heights
- **Image Optimization**: Next.js Image component with fallbacks

### 💾 Data Management

- **SWR Caching**: Automatic data caching and revalidation
- **Optimistic Updates**: Immediate UI feedback
- **Error Recovery**: Automatic retry on network failures
- **Background Sync**: Data updates in background

## 📁 Project Structure

```
assignment/
├── app/                          # Next.js App Router
│   ├── (protected)/             # Protected routes (require auth)
│   │   ├── layout.tsx           # Protected layout with auth check
│   │   └── products/            # Product management pages
│   │       ├── page.tsx         # Products listing
│   │       ├── new/page.tsx     # Create product
│   │       └── [slug]/          # Dynamic product routes
│   │           ├── page.tsx     # Product details
│   │           └── edit/page.tsx # Edit product
│   ├── (public)/                # Public routes
│   │   └── login/page.tsx       # Login page
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page (redirects to login)
│   └── providers.tsx            # App providers (Redux, SWR)
├── features/                     # Feature-based organization
│   ├── auth/                    # Authentication feature
│   │   ├── api/auth.ts          # Auth API calls
│   │   └── components/          # Auth components
│   │       ├── AuthHeader.tsx   # Header with user info
│   │       └── LoginForm.tsx    # Login form
│   ├── products/                # Products feature
│   │   ├── api/index.ts         # Product API calls
│   │   ├── components/          # Product components
│   │   │   ├── ProductCard.tsx  # Product card display
│   │   │   ├── ProductDetails.tsx # Product details page
│   │   │   ├── ProductForm.tsx  # Create product form
│   │   │   ├── ProductEditForm.tsx # Edit product form
│   │   │   ├── FilterBar.tsx    # Search and filter controls
│   │   │   └── PaginationControls.tsx # Pagination component
│   │   ├── types/index.ts       # Product type definitions
│   │   └── utils/index.ts       # Product utilities
│   └── categories/              # Categories feature
│       ├── api/index.ts         # Category API calls
│       └── types/index.ts       # Category type definitions
├── store/                       # Redux store
│   ├── index.ts                 # Store configuration
│   └── slices/                  # Redux slices
│       └── authSlice.ts         # Authentication state
├── public/                      # Static assets
├── next.config.ts               # Next.js configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── package.json                 # Dependencies and scripts
└── README.md                    # This file
```

## 🛠️ Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework

### State Management

- **Redux Toolkit** - Global state management (auth)
- **SWR** - Server state management (API data)
- **React Hook Form** - Form state management

### Validation & Forms

- **Zod** - Schema validation
- **React Hook Form** - Form handling
- **@hookform/resolvers** - Form validation integration

### Development Tools

- **ESLint** - Code linting
- **TypeScript** - Static type checking

## 🎨 Design System

### Color Palette

```css
--ink: #0D1821        /* Rich black */
--foam: #EFF1F3       /* Anti-flash white */
--green: #4E6E5D      /* Hooker's green */
--sand: #AD8A64       /* Lion */
--chestnut: #A44A3F   /* Chestnut */
```

### Typography

- **Primary Font**: Geist Sans
- **Monospace Font**: Geist Mono

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Breakpoints**:
  - `sm`: 640px+
  - `md`: 768px+
  - `lg`: 1024px+
  - `xl`: 1280px+

## 🔧 API Integration

### Endpoints Used

- `POST /auth` - Authentication
- `GET /products` - List products (with pagination/filters)
- `GET /products/search` - Search products
- `GET /products/:slug` - Get product details
- `POST /products` - Create product
- `PUT /products/:id` - Update product
- `DELETE /products/:id` - Delete product
- `GET /categories` - List categories

### Authentication

- JWT tokens automatically included in requests
- Token stored in Redux state and localStorage
- Automatic token refresh handling
