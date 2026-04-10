# SPEC: Split `src/app/shop/page.tsx` into maintainable modules without changing user-facing behavior

## Goal
Refactor the oversized shop page implementation into smaller modules/components while preserving current behavior and keeping the page buildable.

## Why
`src/app/shop/page.tsx` is too large and currently mixes:
- product data
- filter constants
- UI state
- quick drawer component
- icon components
- pagination behavior
- full page markup

This slows iteration and makes reference-fidelity work harder.

## Constraints
- Preserve current visual behavior unless a small correctness fix is required.
- Do not break `npm run build`.
- Do not introduce new lint errors.
- Keep the same route: `/shop`.
- Keep existing product data semantics.
- Prefer extraction over redesign.

## Desired extraction targets
At minimum, consider extracting some combination of:
- `src/app/shop/_components/QuickBuyDrawer.tsx`
- `src/app/shop/_components/ShopHero.tsx`
- `src/app/shop/_components/ShopToolbar.tsx`
- `src/app/shop/_components/ShopPagination.tsx`
- `src/app/shop/_components/RecentlyViewed.tsx`
- `src/app/shop/_components/icons.tsx`
- `src/app/shop/_lib/shop-data.ts`
- `src/app/shop/_lib/shop-types.ts`
- `src/app/shop/_lib/shop-constants.ts`

You do not need to create all of these. Choose a clean decomposition.

## Success criteria
- `src/app/shop/page.tsx` becomes materially smaller and easier to understand.
- Shared/isolated logic moves into clearly named files.
- The page still builds.
- Lint remains clean on correctness errors.
- The refactor creates a better base for later fidelity work against the Concept reference.

## Notes
- We already fixed the direct lint errors in the current page.
- The project now includes `CLAUDE.md` and `REFERENCE_CLONE_SPEC.md`.
- Reference behavior docs also include `SHOP_PAGE_SPEC.md`, `NAV_DROPDOWN_SPEC.md`, and `ANIMATIONS.md`.
- This refactor is a structural task, not a redesign task.