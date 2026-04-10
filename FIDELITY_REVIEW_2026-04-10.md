# Fidelity Review — 2026-04-10

Reviewed by Hermes against the live Shopify Concept reference:
- Reference home: https://concept-theme-tech.myshopify.com/
- Reference collection: https://concept-theme-tech.myshopify.com/collections/all
- Local home: http://127.0.0.1:3001/
- Local shop: http://127.0.0.1:3001/shop

This is a review/triage note, not an implementation spec. It captures the next changes that still appear necessary after the latest homepage/header + /shop passes.

---

## Global / shared issue to fix first

### 1. Announcement bar is covering / colliding with the header on all pages

Observed problem:
- The announcement bar sits above the header visually, but the header is still positioned at `top: 0`, so the two layers overlap.
- This makes the header feel clipped/crowded and reduces nav readability over the hero.
- User-reported screenshot confirms the issue on `/shop`, and the current CSS strongly supports that diagnosis.

Current CSS evidence:
- `.announcement-bar` → `position: relative; z-index: 1001;`
- `.header` → `position: fixed; top: 0; z-index: 1000;`

Why this matters:
- It affects all pages.
- It degrades the top-of-page hierarchy more than any smaller polish issue.
- It makes the otherwise-improved header/megamenu work look wrong.

Needed change:
- Establish intentional stacked layout between announcement bar and fixed header.
- Likely options:
  - offset the header below the announcement bar when the bar is visible, or
  - make the announcement/header wrapper behave as a single fixed stack.
- Re-check desktop and mobile after the fix.

Files likely involved:
- `src/app/globals.css`
- potentially `src/components/AnnouncementBar.tsx`
- potentially `src/components/Header.tsx`

---

## Homepage (`/`) — remaining fidelity gaps

### 2. Header/logo/nav hierarchy still feels weaker than the reference

Observed gap:
- Compared to the reference home, the local header still reads thinner and less deliberate.
- The reference has a clearer stacked hierarchy and more confident nav/logo presence over the hero.
- On local, the nav can feel visually lost against the hero image, especially while the announcement/header overlap exists.

Needed change:
- After fixing the overlap, refine header/nav contrast, spacing, and logo prominence so the top stack reads more intentionally.

---

### 3. Hero still feels simpler and less editorial than the reference

Observed gap:
- The reference hero has stronger editorial composition and a more premium landing-page feel.
- Local hero now has better text animation, but still reads as a simpler banner system.
- CTA/content balance and overall hero composition are still less elevated than the reference.

Needed change:
- Refine hero content block hierarchy, spacing, and image/content balance.
- Compare button treatment, text width, and visual weight against the reference.

Files likely involved:
- `src/components/HeroSlider.tsx`
- `src/app/globals.css`

---

### 4. Homepage section pacing / merchandising hierarchy still trails the reference

Observed gap:
- The reference homepage alternates editorial modules, premium product storytelling, and denser commerce moments with very deliberate rhythm.
- Local homepage has improved interactions, but still feels more like a strong custom page than a true Concept-level editorial storefront.
- The top product/feature sections could use tighter hierarchy and stronger module-to-module rhythm.

Needed change:
- Review section spacing, section order emphasis, and merchandising density.
- Focus less on adding more content and more on making the existing sections feel like one coherent premium system.

---

## Shop (`/shop`) — remaining fidelity gaps

### 5. Shop hero/banner is still too dominant and not as disciplined as the reference collection hero

Observed gap:
- Local `/shop` hero is visually strong, but still feels larger and more image-dominant than the reference collection page.
- The reference shifts users into product discovery more quickly.
- Local title/breadcrumb/banner spacing still feel more cinematic than collection-utility-focused.

Needed change:
- Tighten hero height and spacing.
- Keep premium look, but shift emphasis toward toolbar + product discovery sooner.

Files likely involved:
- `src/app/shop/_components/ShopHero.tsx`
- shop-specific CSS in `src/app/globals.css`

---

### 6. Toolbar/filter system still needs stronger Concept-style hierarchy

Observed gap:
- The local toolbar is structurally close, but still feels lighter and less systematized than the reference.
- `Show filters`, quick category chips, product count, and sort control do not yet feel like one tightly integrated control surface.
- `Show on model` still reads like a placeholder rather than a convincing part of the UX.

Needed change:
- Improve toolbar hierarchy and spacing.
- Make filter + sort feel like primary paired controls.
- Either justify `Show on model` visually/functionally or demote/remove it.

Files likely involved:
- `src/app/shop/_components/ShopToolbar.tsx`
- shop-specific CSS in `src/app/globals.css`

---

### 7. Product cards still need more premium interaction fidelity

Observed gap:
- Cards are much better, but still not fully at Concept-level polish.
- Remaining gaps likely include:
  - swatch → card image swap
  - slightly stronger hover affordance hierarchy
  - tighter spacing/rhythm between badge, vendor, title, price, swatches, and stock note

Needed change:
- Implement swatch-driven image changes on cards.
- Refine the badge system and card metadata spacing.
- Make card interactions feel more obviously intentional and premium.

Files likely involved:
- `src/app/shop/_components/ProductCard.tsx`
- `src/app/shop/_lib/*`
- shop-specific CSS in `src/app/globals.css`

---

### 8. Filter panel still needs accordion-style behavior

Observed gap:
- Current filter panel is functional, but the reference spec calls for collapsible accordion-style filter groups.
- This is still missing.

Needed change:
- Add collapsible behavior for Category / Finish / Price Range groups.
- Preserve existing filtering logic while making the panel feel more like the reference.

Files likely involved:
- `src/app/shop/_components/ShopToolbar.tsx`
- shop-specific CSS in `src/app/globals.css`

---

### 9. Quick-view / drawer experience still has room to improve

Observed gap:
- Recent pass improved drawer polish and Escape handling.
- Remaining likely misses vs reference:
  - richer product-image behavior
  - swatch-linked image updates inside drawer
  - stronger premium detail layout and media hierarchy

Needed change:
- Improve the drawer's image/variant relationship and overall product-detail feel.

Files likely involved:
- `src/app/shop/_components/QuickBuyDrawer.tsx`
- shop-specific CSS in `src/app/globals.css`

---

### 10. Small-screen `/shop` responsiveness still needs another pass

Observed gap:
- Claimed remaining gap from the latest /shop run: still not fully reaching the intended 4 → 2 → 1 column collapse pattern.
- This should be confirmed and then corrected.

Needed change:
- Review mobile portrait layout carefully.
- Ensure product grid, toolbar, filters, and drawer all feel intentional at narrow widths.

---

## Recommended next implementation order

1. Fix announcement-bar/header overlap globally
2. Tighten `/shop` toolbar hierarchy
3. Implement swatch → card image swap on `/shop`
4. Add accordion behavior to `/shop` filters
5. Improve `/shop` drawer media/variant fidelity
6. Revisit homepage hero + section hierarchy only after the global header stack is corrected

---

## Summary

The project has moved materially closer to the reference.

What feels mostly advanced now:
- shared header/megamenu behavior
- mobile menu motion
- hero text animation
- homepage product-card hover basics
- `/shop` refactor into smaller modules
- `/shop` first-pass fidelity improvements

What still most obviously needs work:
- announcement/header stacking
- `/shop` control-surface polish
- `/shop` card/drawer variant fidelity
- some remaining homepage editorial hierarchy polish
