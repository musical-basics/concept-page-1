# FIDELITY_GAPS_NEXT.md

Next highest-value fidelity tasks, ordered by visual/behavioral impact.

---

## ✅ DONE — Header transparent-at-rest + correct sticky transition
Merged. Header is transparent at page top, transitions to white on scroll with proper timing.

## ✅ DONE — NavDropdown exit animation
Merged. Dropdown fades in/out with correct easing; no instant unmount.

---

## 1. Mobile menu: transform-based slide + backdrop overlay + link stagger

**Reference behavior**
- Menu slides in from the left: `transform: translateX(-100%) → translateX(0)`, `400ms cubic-bezier(0.4, 0, 0.2, 1)`.
- A dark overlay fades in behind it simultaneously: `opacity 0.4s cubic-bezier(0.4,0,0.2,1)`.
- Links inside stagger-fade in: each link 40ms after the previous (`opacity 0 → 1`).

**Implementation notes**
- Replace `left: -100% → left: 0` with `transform: translateX(-100%) → translateX(0)` for composited animation.
- Add `.mobile-overlay` element before `.mobile-menu` in Header.tsx.
- Use `@keyframes mobileNavLinkIn` with `nth-child` delays for stagger.
- Easing: `cubic-bezier(0.4, 0, 0.2, 1)`.

**Files to touch**
- `src/components/Header.tsx` — add overlay div, keep desktop nav intact.
- `src/app/globals.css` — rewrite `.mobile-menu` positioning, add overlay + stagger keyframes.

---

## 2. Hero slide text entrance animation on slide change

**Reference behavior**
- When a new slide becomes active, heading fades up from `translateY(30px)` at `opacity 0 → 1`, `600ms cubic-bezier(0,0,0.2,1)`, starting 200ms after slide crossfade.
- CTA button animates in at delay 350ms with the same curve.

**Implementation notes**
- Key the text wrapper on `currentSlide` so React re-mounts it, re-triggering CSS animation.
- Use `@keyframes heroTextIn` with `animation-fill-mode: both`.

**Files to touch**
- `src/components/HeroSlider.tsx` — wrap h1+CTA in `<div key={currentSlide} className="hero-slide-text">`.
- `src/app/globals.css` — add `heroTextIn` keyframes and apply to `.hero-slide-text h1` and `.hero-slide-text .hero-cta`.

---

## 3. Home ProductGrid: hover image swap + bottom-slide quick-add

**Reference behavior (ANIMATIONS.md §13)**
- On card hover: second product image fades in (`opacity 0 → 1`, `500ms ease`) over the primary.
- Quick-add button slides up from the bottom of the image: `translateY(100%) → translateY(0)`, `300ms ease`.
- Button is positioned absolute at bottom of the image, full-width.

**Implementation notes**
- Add `hoverImage` src to each product card; render second `<img className="product-img-hover">` inside `.product-card-image`.
- Position `.quick-add` absolute at bottom, hidden by default with `transform: translateY(100%)`.
- On `.product-card:hover`, fade hover image to `opacity: 1` and slide quick-add to `translateY(0)`.

**Files to touch**
- `src/components/ProductGrid.tsx` — add hover images, restructure quick-add positioning.
- `src/app/globals.css` — add `.product-img-hover` opacity swap, `.quick-add` slide-up rules.

---

## 4. Collection/shop filtering UI polish

**Reference behavior**
- Filter panel slides down smoothly with content pushing below.
- Active filters show as removable pills.
- Sort dropdown matches Concept styling.

**Files to touch**
- `src/app/shop/page.tsx` (or split components)
- `src/app/globals.css`

---

## 5. Quick view / drawer behavior

**Reference behavior**
- Clicking "Quick View" opens a right-side drawer with product details.
- Drawer slides in from right with backdrop overlay.
- Transition: `transform 400ms cubic-bezier(0.4, 0, 0.2, 1)`.

**Files to touch**
- New component: `src/components/QuickViewDrawer.tsx`
- `src/app/globals.css`
