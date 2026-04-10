# Fidelity Review Supplement — 2026-04-10 (Megamenu + Shop Card Interactivity)

Reviewed by Hermes against:
- Local home: http://127.0.0.1:3001/
- Local shop: http://127.0.0.1:3001/shop
- Reference collection: https://concept-theme-tech.myshopify.com/collections/all

---

## 1. Homepage megamenu clipping bug — confirmed

Status: real bug

How it was confirmed:
- Visual browser review of the opened local megamenu
- DOM measurement in browser

Observed issue:
- The homepage Shop megamenu is clipping content at the bottom.
- The right-side featured card copy is visibly cut off.
- The lower text on the first product tiles also appears partially cropped.

Measured evidence from local DOM:
- `.megamenu-ab` height: `340px`
- `.megamenu-ab` scrollHeight: `388px`
- `.megamenu-ab` has `overflow: hidden`
- `.megamenu-ab__panel` extends below the menu container
- `.megamenu-ab__featured` bottom extends below the menu boundary

Likely root cause:
- Fixed/min-height container is too short for the current merchandised content.
- Because the outer megamenu uses `overflow: hidden`, the extra content gets cropped instead of expanding the panel.

Files involved:
- `src/app/globals.css`
- possibly `src/components/ShopMegamenuAB.tsx` if content density should be adjusted

Recommended change:
- Let the megamenu height grow to fit the current panel content, or increase the effective minimum height materially.
- Re-check desktop spacing after the fix so the menu still feels tight and not overly tall.
- Keep the panel visually merged with the header, but do not crop merchandising copy.

Priority:
- High. This is a visible regression/bug, not just polish.

---

## 2. Reference /shop product-card interactivity — what the reference actually does

Status: local implementation is moving in the right direction, but still not matching the reference interaction model.

Confirmed on the reference collection page via DOM inspection:

### A. Product cards use richer overlay controls than local
Reference behavior observed:
- Top-right quick-view style control exists on cards:
  - button class includes `quick-view__button`
  - visually hidden at rest (`opacity: 0` on desktop)
- A second CTA exists inside the card media/content area:
  - “Choose options” button
  - also hidden at rest on desktop via `md:opacity-0`

Implication:
- The reference has a stronger dual-control card system than local.
- Local currently has a simpler single quick-view button treatment.

### B. Reference cards have secondary media behavior
Reference DOM observed:
- `.product-card__carousel` exists
- positioned absolutely over the media area
- transition includes opacity/visibility animation

Implication:
- The reference product cards are not just static-image + swatches.
- There is an explicit secondary-media layer / carousel behavior in the card media region.
- Local hover-image swap is directionally correct, but the reference structure is richer than a simple one-image fade.

### C. Swatches in the reference are not just cosmetic dots
Reference DOM observed:
- swatches are anchors with image-backed styling:
  - class includes `color-swatch with-image`
- each swatch links to a specific product variant URL
  - e.g. `/products/air-beats?variant=...`

Implication:
- The reference uses swatches as real variant affordances, not only visual indicators.
- Local currently swaps the preview image on selection, which is good, but it still behaves more like a demo state than a fully merchandised variant system.

### D. Reference cards surface more metadata directly on-card
Reference signals observed via DOM / visual review:
- vendor label
- title
- price
- rating badge/value
- badges like `New` / savings badge
- variant swatches
- additional compact spec/info chips on the card

Implication:
- The reference cards feel denser and more merchandised.
- Local cards are cleaner/simpler, but still lighter than the Concept reference.

---

## 3. Current local /shop card gaps vs reference

### Gap 1 — local cards lack the stronger two-layer CTA system
Needed change:
- Revisit card controls so they feel closer to the reference:
  - top-right quick-view control
  - stronger secondary CTA treatment in-card
- Decide whether to mirror `Choose options` semantics or adapt them cleanly for DreamPlay.

### Gap 2 — local hover media is simpler than the reference card-media system
Needed change:
- Evolve current hover-image swap toward a more reference-like secondary media treatment.
- Verify whether a simple hover swap is sufficient, or whether we should model a richer media overlay/carousel structure.

### Gap 3 — local swatches are functional but still too minimal
Needed change:
- Keep the new swatch -> image swap.
- Consider making swatches feel more like real variant selectors rather than generic color dots.
- Improve labeling / affordance / variant richness where appropriate.

### Gap 4 — local cards still feel less merchandised/information-rich
Needed change:
- Compare spacing and metadata hierarchy against the reference.
- Consider whether rating/spec-style support info should be added or whether DreamPlay should translate that concept into piano-relevant specs.

---

## Recommended next order after this review

1. Fix megamenu bottom clipping on homepage header
2. Revisit /shop product-card control model against the reference:
   - quick-view placement/visibility
   - secondary CTA behavior
3. Tighten /shop media behavior on cards to feel more like the reference’s layered media system
4. Consider richer variant/swatch treatment on /shop cards

---

## Bottom line

Two important findings:
- The megamenu bottom clipping is definitely real and should be fixed.
- The /shop product cards are improved, but the reference still has a richer interactivity model than local currently matches.
