# Zyla — AI Personal Styling, Wardrobe & Marketplace

## Quick Start

```bash
npm install
cp .env.example .env.local   # set your Django API URL
npm run dev                  # runs on http://localhost:3000
```

## Tech Stack
- React 18 + TypeScript + Vite
- TailwindCSS
- React Router v6
- React Hook Form
- Axios (with JWT interceptors)

## Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── layout/         # AppLayout, Navbar, Sidebar
│   ├── ui/             # Button, Badge, Input, Modal, Toast
│   ├── wardrobe/       # ClothingCard
│   ├── marketplace/    # ProductCard, CartItemRow
│   └── outfits/        # OutfitCard
├── context/            # AuthContext, CartContext, WardrobeContext
├── hooks/              # useWardrobe, useProducts, useWardrobeStats…
├── pages/              # All page components
├── services/           # API service layer (Axios)
├── types/              # TypeScript interfaces
└── utils/              # formatters, helpers
```

## Environment Variables
| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Django backend URL (default: `http://localhost:8000/api`) |

## API Assumptions
The frontend expects a Django REST API with:
- `POST /api/auth/login/` → `{ access, refresh }`
- `GET /api/wardrobe/` · `POST /api/wardrobe/` · `GET /api/wardrobe/stats/`
- `POST /api/outfits/generate/` · `GET /api/outfits/`
- `GET /api/marketplace/products/` · `POST /api/marketplace/orders/`
- `GET /api/seller/products/` · `GET /api/seller/stats/`
