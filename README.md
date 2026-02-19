# Growth Valley - Enterprise Website

A production-ready enterprise website built with Next.js 14, Tailwind CSS, and Express.js backend.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Install Frontend Dependencies**
   ```bash
   npm install
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   cd ..
   ```

### Development

1. **Start the Backend Server** (Terminal 1)
   ```bash
   cd backend
   npm run dev
   ```
   The API server runs on `http://localhost:3001`

2. **Start the Frontend** (Terminal 2)
   ```bash
   npm run dev
   ```
   The Next.js app runs on `http://localhost:3000`

### Production Build

1. **Build Frontend**
   ```bash
   npm run build
   npm start
   ```

2. **Build Backend**
   ```bash
   cd backend
   npm run build
   npm start
   ```

## 📁 Project Structure

```
growth-valley/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx            # Homepage
│   │   ├── solutions/          # Solutions page
│   │   ├── industries/         # Industries page
│   │   ├── case-studies/       # Case studies listing & detail
│   │   ├── insights/           # Blog listing & posts
│   │   ├── company/            # About page
│   │   ├── contact/            # Contact page with form
│   │   └── api/                # API route proxies
│   ├── components/             # Reusable React components
│   │   ├── Navbar.tsx          # Sticky navigation
│   │   ├── Footer.tsx          # Footer with links
│   │   ├── Section.tsx         # Section wrapper
│   │   ├── Button.tsx          # CTA button variants
│   │   ├── Card.tsx            # Card components
│   │   ├── Container.tsx       # Layout container
│   │   └── PageHeader.tsx      # Page header component
│   ├── lib/                    # Utility functions
│   └── globals.css             # Global styles & Tailwind
│
├── backend/
│   ├── server.ts               # Express API server
│   ├── data/                   # JSON file storage
│   │   ├── blog.json           # Blog posts data
│   │   ├── case-studies.json   # Case studies data
│   │   └── contacts.json       # Contact form submissions
│   └── utils/                  # Backend utilities
│
├── tailwind.config.ts          # Tailwind configuration
├── next.config.mjs             # Next.js configuration
└── package.json                # Frontend dependencies
```

## 🎨 Design System

### Colors
- **Primary Black**: `#0B0B0B`
- **Accent Yellow**: `#FFC107`
- **White**: `#FFFFFF`
- **Grey scale**: `#FAFAFA` to `#171717`

### Typography
- Display: 4rem / 1.1 line-height
- Heading 1: 3rem / 1.15 line-height
- Heading 2: 2.25rem / 1.2 line-height
- Heading 3: 1.5rem / 1.3 line-height
- Body: 1rem / 1.7 line-height

### Components
- **Buttons**: Primary (yellow), Secondary (outlined), Ghost (text)
- **Cards**: White background, subtle border, hover shadow
- **Sections**: White or grey background, consistent padding

## 🔌 API Endpoints

### Contact
- `POST /api/contact` - Submit contact form

### Blog
- `GET /api/blog` - List all posts
- `GET /api/blog?featured=true` - List featured posts
- `GET /api/blog/[slug]` - Get single post
- `POST /api/blog` - Create post (admin-ready)

### Case Studies
- `GET /api/case-studies` - List all case studies
- `GET /api/case-studies?featured=true` - List featured
- `GET /api/case-studies/[slug]` - Get single case study

## 📱 Features

- ✅ Fully responsive design
- ✅ SEO optimized with meta tags
- ✅ Clean, minimal enterprise aesthetic
- ✅ Contact form with validation
- ✅ Blog system with categories
- ✅ Case study showcase
- ✅ Sticky navigation
- ✅ No floating WhatsApp button
- ✅ Yellow CTAs only (brand consistency)

## 🛠 Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS 3.4
- **Backend**: Node.js, Express.js
- **Data Storage**: JSON files (simple, no database)

## 📝 Adding Content

### Blog Posts
Edit `backend/data/blog.json` to add new posts:
```json
{
  "id": "unique-id",
  "slug": "url-friendly-slug",
  "title": "Post Title",
  "excerpt": "Short description",
  "content": "Full content with ## markdown headings",
  "author": "Author Name",
  "category": "Category",
  "featured": true,
  "publishDate": "2026-01-15",
  "readTime": "5 min read"
}
```

### Case Studies
Edit `backend/data/case-studies.json` to add new case studies.

## 🚢 Deployment

### Vercel (Frontend)
1. Push to GitHub
2. Connect repo to Vercel
3. Deploy

### Backend Deployment
Deploy the backend to any Node.js hosting:
- Railway
- Render
- DigitalOcean
- AWS EC2

Set environment variables:
- `PORT` - Server port (default: 3001)
- `API_URL` - Backend URL (for frontend)

## 📄 License

Private project for Growth Valley.