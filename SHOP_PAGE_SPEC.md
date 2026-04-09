# Shop Page Redesign Spec — Match Shopify Concept Theme Demo

Reference screenshots are in `/root/projects/shopify-concept-screenshots/`:
- `shop-page-top.png` — hero banner + toolbar area
- `shop-page-products.png` — product grid cards
- `shop-page-bottom.png` — bottom section + footer

Target page to modify: `src/app/shop/page.tsx` + `src/app/globals.css` (shop-related styles)

## Demo Reference: Concept Theme Shop Page Layout

### 1. Collection Banner (Hero)
- **Full-width image** with dark overlay (~40% opacity)
- Image uses `object-fit: cover`, full viewport width, ~350-400px height on desktop
- **Breadcrumbs overlay** on top-left of the banner image: `Home > Collections > All products`
  - Home icon (SVG house) as first breadcrumb item
  - Chevron separators between items
  - White text, small size
- **Collection title** "All products" as large white `<h1>` overlaid on the banner, bottom-left aligned
- **Rounded bottom corners** on the banner section (~16px border-radius)
- The banner image has a parallax/zoom-out entrance animation

### 2. Toolbar / Filter Bar
Immediately below the banner, inside a container:

- **"Show filters" button** — toggles a horizontal filter drawer/panel that slides down from the toolbar area. NOT a left sidebar.
  - Filter panel contains filter groups horizontally: Category, Finish, Price Range
  - Each filter group is a collapsible accordion-style section
  - Active filters shown as removable pill/tag buttons
  - "Clear all" link when filters active
  
- **Collection quick-links** — horizontal pill/tag buttons for quick category navigation:
  - "Grand 6" | "Upright 4" | "Digital 5" (with counts)
  - Styled as bordered pill buttons, active state filled

- **"Show on model" button** — (optional, we can skip this feature but keep the button as a placeholder styled the same way)

- **Sort dropdown** — right-aligned, simple `<select>` with label "Sort by"
  - Options: Featured, Best selling, Alphabetically A-Z, Alphabetically Z-A, Price low to high, Price high to low, Date old to new, Date new to old

- **Product count** — "1" or "59 products" text near the sort

- **Pagination** — number links: "1 2 3 … 6 Next" — right side of toolbar or below grid

### 3. Product Grid
- **4-column grid** on desktop, **2-column** on tablet/mobile
- Gap between cards: ~24px (gap-6)
- Cards are stacked vertically: image on top, info below

**Product Card Design:**
- **Image area**: 
  - Aspect ratio ~3:4 (portrait)
  - `object-fit: cover`, rounded corners (~8px)
  - Hover: second image fades in (image rollover/swap)
  - **Quick View button**: appears on hover — eye icon button positioned top-right of the image, semi-transparent background, slides in with opacity transition
  - **Product badges**: small labels positioned top-left of image
    - "Lionel's Pick" — gold/amber background
    - "Sale" — red background  
    - "New" — dark/black background

- **Card info area** (below image):
  - **Vendor name**: small uppercase tracking-widest text, muted color (e.g., "DREAMPLAY" in caps, small gray text)
  - **Product title**: medium font-weight, text-base-xl, linked, dark color
  - **Price**: aligned right on same row as title on desktop, or below on mobile
    - Regular price: `$4,299`
    - Sale: strikethrough original + red/accent sale price
  - **Color swatches**: row of small round circles below the info
    - Each swatch is a ~20px circle with the variant color as background
    - Swatches with product images as background (using `--swatch-background-image`)
    - On hover/click: changes the product card image to that variant
    - Active/selected swatch has a ring/outline

- **Stock counter**: "Only X left" — small red/urgent text below swatches when stock ≤ 5

### 4. Quick View Drawer
When "Quick View" eye icon is clicked:
- **Drawer slides in from the right** — full height, ~450px wide
- Dark semi-transparent overlay behind it
- Drawer contains:
  - Close button (X) top-right
  - Product image (large)
  - Vendor, title, price
  - Color/variant swatches as radio buttons
  - Quantity selector
  - "Add to Cart" button
  - Stock status
  - "View full details" link

### 5. Bottom Section — "Discover Pure Euphony"
- Full-width section with background image + dark overlay
- Left-aligned text block:
  - Small uppercase tag: "DREAMPLAY"  
  - Large heading: "Discover Pure Euphony"
  - Descriptive paragraph text
  - CTA link/button

### 6. General Styling Notes
- The overall feel is **minimal, clean, lots of whitespace**
- Cards have **no visible border/shadow** — they rely on spacing and image contrast
- Typography is clean sans-serif, good hierarchy
- The page uses a **page-width container** (~1400px max, centered with padding)
- **Rounded corners** throughout (8-16px on cards, buttons, banner)
- **Smooth transitions** on hover states (200-300ms ease)
- Filter panel uses **horizontal layout** (not left sidebar) — this is a key difference from the current implementation

## Key Changes from Current Implementation

1. **REMOVE the left sidebar filter layout** — replace with a horizontal toolbar filter system
2. **Collection banner** — move breadcrumbs INTO the banner overlay (not below it), add rounded corners
3. **Product card** — add vendor name above title, add color swatches as interactive round circles, restructure title+price layout
4. **Quick view** — change from "Quick Add" text button to an eye-icon button that appears on image hover (top-right corner)
5. **Category pills** — add quick-link category pills in the toolbar (e.g., "Grand 6", "Upright 4", "Digital 5")
6. **Pagination** — add numbered page links below the grid
7. **"Show on model" button** — add placeholder button in toolbar (doesn't need to work, just visual match)
8. **Sort options** — expand to match demo's full sort list

## Do NOT Change
- Product data structure (keep the 12 piano products with same fields)
- Keep the existing `<AnnouncementBar />`, `<Header />`, `<Footer />`, `<BackToTop />` components
- Keep the QuickBuyDrawer component but restyle it as a right-side drawer
- Keep the "Discover Pure Euphony" bottom section but restyle to match
- Keep Recently Viewed section (it's not in the demo but it's a nice addition)

## Technical Notes
- All styles go in `globals.css` — the project uses vanilla CSS + Tailwind utility classes
- Components are all `"use client"` — keep this pattern
- Use `picsum.photos` for images (existing pattern)
- Make sure the page is fully responsive (4-col → 2-col → 1-col)
