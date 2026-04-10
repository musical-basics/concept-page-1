# concept-clone

## Purpose
Recreate the Shopify Concept theme across the key storefront pages in this repo with high visual and behavioral fidelity.

## Goal
Match the reference site not just in static formatting, but in:
- animations
- hover states
- sticky/header behavior
- dropdown and mega-menu behavior
- collection/shop filtering UI
- quick view / drawer behavior
- section spacing and rounded-corner system
- transition timing and easing

## Canonical reference
- Theme page: https://themes.shopify.com/themes/concept/presets/concept
- Always click "View demo" and inspect the live storefront.
- Live demo storefront: https://concept-theme-tech.myshopify.com/

## Working rules
- For small surgical fixes, Hermes may edit directly, then verify, commit, and push immediately.
- For larger changes, use Claude Code.
- For partitionable larger changes, split work across multiple Claude Code instances and review each output before merging.
- Prefer the persistent tmux session `claude-concept` for major concept-clone work when available.
- For heavy Claude Code work, set `/effort max`.
- Before large write-heavy batches, set `/permissions bypassPermissions`.

## Current priorities
1. Preserve build stability.
2. Eliminate React/Next correctness issues before piling on more UI work.
3. Split oversized files when they become a bottleneck, especially `src/app/shop/page.tsx`.
4. Keep reference findings documented so behavior is not guessed from memory.
5. Keep generated scrape artifacts out of git unless they are intentionally promoted to documentation or reusable tooling.

## Artifact policy
- Keep durable docs/specs in tracked markdown files.
- Keep reusable scraper code if it is still useful.
- Ignore generated screenshots and one-off extracted JSON/HTML/TXT dumps unless explicitly needed.

## Verification checklist
Before reporting success:
- `npm run build`
- `npm run lint`
- verify the changed UI against the reference behavior
- confirm only intended files changed

## Notes
- Main routes currently include `/`, `/home2`, and `/shop`.
- The project is a Next.js app using App Router, React 19, and TypeScript.
- Fidelity matters more than generic redesign polish; reference behavior wins.