# Atelier Clothing Webshop Template

A dependency-free storefront and owner admin prototype for independent clothing shops.

## Run it

Open `index.html` directly, or serve the folder locally:

```powershell
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Included

- Full-screen image/video hero
- Five-category editorial layout
- Product image swap on hover
- Product filtering, search and local shopping bag
- 35-piece locally hosted demo catalogue with four coordinated images per product
- Clickable gallery-led product pages with sizes, details and related products
- Editorial homepage sections inspired by luxury multi-brand retail pacing
- Store Studio for brand name, logo, hero copy, MP4/WebM and theme colours
- Four selectable product-page layouts: the original Atelier default, Maison Margiela, Luisa and Mango
- 20 built-in font choices for headings and body text, plus custom TTF upload
- Simple product listing form with product and on-model images
- Admin catalogue search, category filters, sorting and live result counts
- Browser persistence with `localStorage` and `IndexedDB`
- Responsive desktop and mobile layouts

This is a front-end product prototype. Checkout, authentication, stock management, orders,
shipping, taxes and cloud storage need a backend before production use.

## Catalogue assets

Generated product media lives in `assets/catalog/p1` through `assets/catalog/p35`.
Each product contains `product.webp`, `model.webp`, `detail.webp`, and `texture.webp`.
The untouched generated contact sheets are retained in `assets/catalog/sheets`.
