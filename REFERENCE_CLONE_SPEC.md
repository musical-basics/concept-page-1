# Reference Clone Spec

## Objective
Clone the Shopify Concept theme behavior across this repo's storefront pages with high fidelity.

This means matching:
- layout and spacing
- typography scale and density
- rounded-corner system
- hover states
- sticky header behavior
- hero slider behavior
- card image rollover behavior
- dropdown / mega-menu behavior
- drawer / quick view behavior
- collection toolbar and filter interactions
- section reveal timing and easing

## Source of truth
1. https://themes.shopify.com/themes/concept/presets/concept
2. Click `View demo`
3. Inspect the live store at https://concept-theme-tech.myshopify.com/

## Page scope
- Home (`/`)
- Shop / collection page (`/shop`)
- Header / nav / mobile menu behavior shared across pages
- Any additional key pages introduced to mirror the reference site structure

## Fidelity rules
- Do not guess interaction behavior when it can be inspected.
- Prefer observed easing/timing over made-up motion.
- Preserve reusable implementation primitives when possible, but change them if they block fidelity.
- Build for responsive parity, not desktop-only parity.

## Behavior capture strategy
- Use browser inspection for quick visual/layout checks.
- Use Playwright when we need exact transient states, hover capture, repeated scroll-state capture, or hard-to-describe timing behavior.
- Document findings in markdown, not just scratch files.

## Immediate workstreams
1. Stabilize correctness/lint/build.
2. Refactor oversized implementation files that block iteration.
3. Normalize repo artifacts and docs.
4. Capture reference behavior for header, hero, shop toolbar, cards, and drawers.
5. Implement missing fidelity gaps page by page.

## Current observed implementation gaps
- `src/app/shop/page.tsx` is oversized and should be split.
- The repo still has scrape/screenshot byproducts that need normalization.
- Reference behavior is partially documented but should be made more actionable for implementation.
- Remaining lint warnings are mostly scrape-script noise plus the app font warning in `src/app/layout.tsx`.

## Success criteria
- `npm run build` passes
- `npm run lint` has no correctness errors and ideally no meaningful warnings
- shared components match reference behavior closely
- home and shop both feel like the same system as the reference site, not just loosely inspired pages
- changes are committed in small, reviewable increments for one-off fixes or orchestrated cleanly for larger tasks