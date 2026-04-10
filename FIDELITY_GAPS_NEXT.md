# FIDELITY_GAPS_NEXT.md

Next 5 highest-value fidelity tasks, ordered by visual/behavioral impact.

---

## 1. Header transparent-at-rest + correct sticky transition

**Reference behavior**
- At rest (page top): transparent background, dark text — hero image shows full-bleed behind header.
- On scroll past 50px: white background + `box-shadow: 0 2px 20px rgba(0,0,0,0.08)`, height shrinks 80px → 60px.
- Transition: `color, background-color, border-color, box-shadow, height` at `500ms cubic-bezier(0,0,0.2,1)` (deceleration curve).
- Header stays `position: fixed` always — background changes, not the position property.

**Current gap**
- `globals.css`: `.header { background: var(--white) }` — always opaque, covers the hero on `/` and `/home2`.
- `Header.tsx:33`: toggles `position` between `"fixed"` and `"sticky"` causing layout reflow on scroll.
- Transition is `all 0.3s ease` (wrong property scope, wrong duration, wrong easing).

**Files to touch**
- `src/components/Header.tsx` — remove the `position` style toggle; accept an optional `transparent` prop (or detect from context); apply `.header--transparent` class when at top.
- `src/app/globals.css` — add `.header--transparent { background: transparent; border-color: transparent; }`, set header `position: fixed`, update transition to `background-color, border-color, box-shadow, height 500ms cubic-bezier(0,0,0.2,1)`.

---

## 2. NavDropdown exit animation (currently instant unmount)

**Reference behavior**
- Dropdown fades in over 300ms (`cubic-bezier(0.4, 0.22, 0.28, 1)`) on `mouseenter`.
- On `mouseleave` fades out over 300ms with the same curve before being hidden.
- No `box-shadow` on the menu panel — reference says "no border, no shadow".

**Current gap**
- `NavDropdown.tsx:35`: renders `{isOpen && (...)}` — dropdown unmounts instantly on mouse leave with zero exit animation.
- `globals.css:168`: `.nav-dropdown-menu { box-shadow: 0 4px 12px rgba(0,0,0,0.08); }` — shadow present, contradicts reference.

**Files to touch**
- `src/components/NavDropdown.tsx` — always render the menu; toggle a CSS class (e.g. `is-open`) instead of conditional render so both enter and exit can animate via CSS.
- `src/app/globals.css` — add `.nav-dropdown-menu { opacity: 0; visibility: hidden; pointer-events: none; transition: opacity 300ms cubic-bezier(0.4,0.22,0.28,1), visibility 0s linear 300ms; }`, `.nav-dropdown-menu.is-open { opacity: 1; visibility: visible; pointer-events: auto; transition-delay: 0s; }`. Remove the `box-shadow`.

---

## 3. Mobile menu: transform-based slide + backdrop overlay + link stagger

**Reference behavior**
- Menu slides in from the left: `transform: translateX(-100%) → translateX(0)`, `400ms cubic-bezier(0.4, 0, 0.2, 1)`.
- A dark overlay fades in behind it simultaneously: `opacity 0.4s cubic-bezier(0.4,0,0.2,1)`, `visibility 0.4s linear`.
- Links inside stagger-fade in: each link 40ms after the previous (`opacity 0 → 1`).

**Current gap**
- `globals.css:232–243`: menu animates `left: -100% → left: 0` — this is a non-composited property, causing repaints. Easing is `ease` not `cubic-bezier(0.4,0,0.2,1)`.
- No backdrop overlay element or styles exist.
- No link stagger animation.

**Files to touch**
- `src/app/globals.css` — replace `left` animation with `transform: translateX`, update easing, add `.mobile-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); opacity: 0; visibility: hidden; transition: opacity 0.4s cubic-bezier(0.4,0,0.2,1), visibility 0.4s linear; z-index: 998; }` + `.mobile-overlay.open { opacity: 1; visibility: visible; }`, add link stagger via `nth-child` delays.
- `src/components/Header.tsx` — add `<div className={`mobile-overlay${menuOpen ? " open" : ""}`} onClick={toggleMenu} />` before `.mobile-menu`.

---

## 4. Hero slide text entrance animation on slide change

**Reference behavior**
- When a new slide becomes active, the heading fades up from `translateY(30px) → translateY(0)` at `opacity 0 → 1`, `600ms cubic-bezier(0,0,0.2,1)`, starting 200ms after the slide crossfade begins.
- CTA button animates in at delay 350ms with the same curve.

**Current gap**
- `HeroSlider.tsx:67–70`: `<h1>` and `<a>` in `.hero-overlay` have no animation class or keying — they sit in a container that is always-visible; text appears instantly when `currentSlide` changes.
- `globals.css`: `.hero-overlay h1` has no `animation` property.

**Files to touch**
- `src/components/HeroSlider.tsx` — key the text wrapper on `currentSlide` (e.g. `<div key={currentSlide} className="hero-slide-text">`) so React re-mounts it on every transition, triggering the CSS animation fresh.
- `src/app/globals.css` — add `@keyframes heroTextIn { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }` and `.hero-slide-text h1 { animation: heroTextIn 600ms cubic-bezier(0,0,0.2,1) 200ms both; }`, `.hero-slide-text .hero-cta { animation: heroTextIn 600ms cubic-bezier(0,0,0.2,1) 350ms both; }`.

---

## 5. Home ProductGrid: missing hover image swap + bottom-slide quick-add

**Reference behavior (ANIMATIONS.md §13)**
- On card hover: second product image fades in (`opacity 0 → 1`, `500ms ease`) over the primary.
- Quick-add button slides up from the bottom of the image: `translateY(100%) → translateY(0)`, `300ms ease`.
- Button is positioned absolute at bottom of the image, full-width or centered.

**Current gap**
- `ProductGrid.tsx:14–18`: each card has one `<img>` — no second (hover) image in the markup or data.
- `globals.css:976`: `.product-card:hover .product-card-image img { transform: scale(1.05); }` — scale exists but no image swap.
- `globals.css` has no `.quick-add` position/animation rules; in `ProductGrid.tsx:19` the button is inline with no transition.

**Files to touch**
- `src/components/ProductGrid.tsx` — add `hoverImage` to each product entry; add a second `<img className="product-img-hover" …>` inside `.product-card-image`; reposition `.quick-add` to `position: absolute; bottom: 0; width: 100%`.
- `src/app/globals.css` — add `.product-img-primary { opacity: 1; }`, `.product-img-hover { opacity: 0; position: absolute; inset: 0; }`, `.product-card:hover .product-img-primary { opacity: 0; }`, `.product-card:hover .product-img-hover { opacity: 1; }`, `.quick-add { position: absolute; bottom: 0; left: 0; width: 100%; transform: translateY(100%); transition: transform 300ms ease; … }`, `.product-card:hover .quick-add { transform: translateY(0); }`.
