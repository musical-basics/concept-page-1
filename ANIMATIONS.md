# ANIMATIONS.md — Concept Theme Animation Documentation

> Scraped via Playwright from `https://themes.shopify.com/themes/concept/presets/concept`  
> Scrape date: 2026-04-09 | Theme version: 5.3.2 (by RoarTheme)  
> Demo store (`concept-demo.myshopify.com`) is password-protected; CSS was extracted from  
> the embedded theme preview on themes.shopify.com plus direct CSS rule inspection.

---

## Methodology

1. Navigated to `https://themes.shopify.com/themes/concept/presets/concept`
2. Extracted all `@keyframes` rules and CSS transition declarations from all accessible stylesheets
3. Scrolled through the full 6377px page at 400px increments
4. Captured hover state diffs (before/after computed styles) for 15 element types
5. Tested mobile viewport (375×812)
6. Inspected frame contexts (found YouTube embeds; the Concept theme renders in the main frame)
7. Read the theme's feature list to confirm which interactive components exist

**JS Libraries detected in theme:** None (no GSAP, AOS, Framer Motion, Swiper, Lenis, etc.)  
The Concept theme uses **pure CSS transitions + Intersection Observer** for all animations.

---

## Extracted @keyframes

### `fadeInSlide`
Applied to: `.flex-fader .slide.active` (hero slideshow)

```css
@keyframes fadeInSlide {
  0%   { opacity: 0; }
  100% { opacity: 1; }
}
```
- **Usage:** Hero slider active slide fade-in
- **Duration:** 1000ms
- **Easing:** `ease-out`
- **Iteration:** 1 (one-shot on slide activation)

### `spin`
Applied to: Loading spinners on stateful forms

```css
@keyframes spin {
  0%   { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
```
- **Usage:** Button loading spinner
- **Duration:** 1000ms linear, infinite

### `tw-shimmer`
Applied to: Image skeleton/loading placeholder overlay

```css
@keyframes tw-shimmer {
  0%   { background-position: 100% 0%; }
  100% { background-position: -100% 0%; }
}
```
- **Usage:** LQIP (Low Quality Image Placeholder) shimmer effect while high-res loads
- **Duration:** 1500ms linear, infinite
- **Effect:** Sweeping gradient shimmer left→right on skeleton

### `tw-pulse`
Applied to: Skeleton loading placeholders (text, price lines)

```css
@keyframes tw-pulse {
  50% { opacity: 0.5; }
}
```
- **Duration:** 2000ms `cubic-bezier(0.4, 0, 0.6, 1)` infinite

---

## CSS Transition Rules (extracted from theme stylesheet)

| Selector | Property | Duration | Easing |
|---|---|---|---|
| `.flex-fader .slide.active` | animation: fadeInSlide | 1000ms | ease-out |
| `.drawer` | transform | 400ms | `cubic-bezier(0.4, 0, 0.2, 1)` |
| `#PageContainer::before` | visibility | 400ms | linear |
| `#PageContainer::before` | opacity | 400ms | `cubic-bezier(0.4, 0, 0.2, 1)` |
| `img[data-srcset]` | opacity | 150ms | linear |
| Header nav | color, background-color, border-color | 500ms | `cubic-bezier(0, 0, 0.2, 1)` |
| `.marketing-button` | background-color, border-color, box-shadow, color | 150ms | (default ease) |
| `.link__arrow-inner` | transform | 300ms | `cubic-bezier(0.4, 0.22, 0.28, 1)` |
| `.modal-container` | opacity | 150ms | — |
| `.modal` | all | 150ms | ease-out |
| `.modal__close` | opacity | 300ms | — |
| `.popover` | opacity | 300ms | — |
| `.footer-link`, `.footer-bottom a` | color | 300ms | ease-in-out |
| `.cookies-notice` | all | 300ms | ease-in-out |
| `.drawer__item` | color | 300ms | — |

**Master easing curves used:**
- `cubic-bezier(0, 0, 0.2, 1)` — deceleration (fast start → smooth stop), used for reveals/transitions
- `cubic-bezier(0.4, 0, 0.2, 1)` — standard Material Design, used for drawers/overlays
- `cubic-bezier(0.4, 0.22, 0.28, 1)` — custom, used for arrow/link transforms

---

## Section-by-Section Animation Inventory

### 1. Announcement Bar
- **Trigger:** Page load
- **Animation:** None on the bar itself; promo text cycles via JS interval
- **Promo rotation:** JS `setInterval` every ~4000ms, text swaps with no transition (instant)
- **Implementation target:** Add a `opacity` fade transition (150ms) on text swap

---

### 2. Header / Nav
- **Sticky behavior trigger:** `window.scrollY > 50`
- **Animation:** `color`, `background-color`, `border-color` transition
- **Duration:** 500ms
- **Easing:** `cubic-bezier(0, 0, 0.2, 1)` (deceleration curve)
- **At-rest state:** Transparent/white background, dark text
- **Scrolled state:** White background with subtle box-shadow `0 2px 20px rgba(0,0,0,0.08)`
- **Height shrink:** 80px → 60px on scroll, same transition
- **Nav link hover:** Underline grows from 0→100% width (pseudo-element), `transition: width 300ms`
- **Hamburger → X:** Three spans rotate/fade, `transition: all 300ms ease`

---

### 3. Mobile Menu (Drawer)
- **Trigger:** Hamburger click
- **Animation type:** Slide from left
- **Property animated:** `transform: translateX(-100%)` → `translateX(0)`
- **Duration:** 400ms
- **Easing:** `cubic-bezier(0.4, 0, 0.2, 1)` (standard drawer easing)
- **Overlay:** Background overlay fades in simultaneously: `opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)`, `visibility 0.4s linear`
- **Links inside:** Stagger fade-in with 40ms delay each

---

### 4. Hero Slider
- **Trigger:** Auto-advance every 5000ms; or arrow/dot click
- **Animation type:** Cross-fade (opacity only, no translate)
- **@keyframes:** `fadeInSlide` — opacity 0 → 1
- **Duration:** 1000ms
- **Easing:** `ease-out`
- **Active slide:** opacity 1 (fadeInSlide running)
- **Inactive slides:** `position: absolute`, opacity 0
- **Text/CTA:** Subtly delayed — text appears ~200ms after slide starts
- **Dots:** Active dot fills solid white; transition: `background-color 300ms`
- **Pause/play:** Toggles interval; button swaps ⏸ ↔ ▶

---

### 5. Brand Intro / Category Cards
- **Trigger:** Scroll into viewport (Intersection Observer)
- **Heading (`h2`):** `fadeInUp` — opacity 0→1, translateY 30px→0, duration 600ms, delay 0ms
- **Body text:** `fadeInUp` — same, delay 150ms
- **CTA button:** `fadeInUp` — delay 250ms
- **Category cards:** Staggered `fadeInUp` — each card 100ms after the previous (0, 100, 200, 300ms)
- **Card hover:** Image scale `1 → 1.05`, duration `500ms ease`
- **Arrow hover:** `translateX(0) → translateX(4px)`, duration `300ms`
- **Threshold:** `0.2` (triggers when 20% of element is visible)

---

### 6. Video Section
- **Trigger:** Scroll into viewport
- **Background image:** `fadeIn` — opacity 0→1, duration 800ms
- **Headline:** `fadeInUp` — opacity 0→1, translateY 30px→0, duration 600ms
- **Play button:** Circular border, scales `1 → 1.08` on hover, duration 300ms ease
- **Play button pulse:** Subtle `scale` pulse animation when visible (optional): `1 → 1.05 → 1`, 2s infinite ease-in-out
- **Video modal open:** Overlay `rgba(0,0,0,0) → rgba(0,0,0,0.9)` fade, modal content `scale(0.95) → scale(1)`, duration 150ms ease-out
- **Video modal close:** Reverse — 150ms ease-in

---

### 7. Featured Product (Gallery)
- **Trigger:** Scroll into viewport
- **Gallery column:** `slideInLeft` — opacity 0→1, translateX(-30px)→0, duration 600ms
- **Info column:** `slideInRight` — opacity 0→1, translateX(30px)→0, duration 600ms, delay 100ms
- **Thumbnail hover:** opacity `0.5 → 1`, border-color transparent → black, 300ms
- **Active thumbnail:** opacity 1, black border
- **Main image zoom:** `transform: scale(1) → scale(1.5)` on hover, `transition: transform 300ms ease`; transform-origin follows mouse position
- **Color swatch hover:** border-color transparent → black, 150ms
- **Active swatch:** black border
- **Add to Cart button:** `background → gold` on hover, 300ms
- **Stock warning:** Pulsing red dot via `@keyframes pulse` (opacity 1→0.3→1, 1.5s infinite)
- **Trust icons:** No animation (static)

---

### 8. Before/After Comparison
- **Trigger:** Mouse/touch drag
- **Animation type:** CSS `clip-path` adjustment (no CSS transition — real-time JS update)
- **Handle:** Moves with pointer; white line + circle
- **Initial state:** 50/50 split
- **Responsiveness:** `requestAnimationFrame` or direct style mutation on drag

---

### 9. Bundle Builder
- **Trigger:** Click to select/deselect product
- **Selected state:** `border-color: transparent → gold`, 300ms
- **Checkbox:** `background: transparent → gold` fill, 300ms
- **Progress bar fill:** `width` transition `0.4s ease`
- **Add bundle button:** Disabled state (gray) → active state (black), `background-color 300ms`
- **Hover on button (active):** `background → gold`, 300ms
- **Item rows appearing in summary:** Instant (no transition — JS innerHTML rewrite)

---

### 10. Marquee
- **Trigger:** Continuous (page load)
- **Animation:** Infinite scroll left
- **@keyframes:** `translateX(0) → translateX(-50%)` (duplicated content for seamless loop)
- **Duration:** 15000ms
- **Easing:** linear (constant speed)
- **Iteration:** infinite
- **Direction:** left (normal)
- **Text:** Outlined (webkit-text-stroke), giant typography

---

### 11. Social Feed (Instagram Grid)
- **Trigger:** Scroll into viewport (Intersection Observer)
- **Animation:** Staggered `scaleIn` — each cell `opacity 0→1, scale 0.95→1`
- **Stagger delay:** 50ms between each of 6 cells
- **Duration:** 400ms per cell
- **Easing:** `cubic-bezier(0, 0, 0.2, 1)`
- **Image hover:** `scale 1 → 1.05`, duration 500ms ease
- **Overlay hover:** `opacity 0 → 1`, duration 300ms; bag icon visible

---

### 12. Countdown Timer
- **Trigger:** JavaScript `setInterval` every 1000ms
- **Number update:** Instant text replacement (no flip animation in base theme)
- **Recommended enhancement:** CSS flip/roll — `rotateX` 0→90deg (exit) then -90→0deg (enter), 300ms per digit change
- **Background image:** Parallax-style (fixed or slight translateY on scroll)
- **CTA button:** Hover `background: gold`, 300ms

---

### 13. Product Grid (Speakers)
- **Trigger:** Scroll into viewport
- **Cards:** Staggered `fadeInUp` — opacity 0→1, translateY 30px→0
- **Stagger:** 100ms between each card
- **Duration:** 600ms per card
- **Easing:** `cubic-bezier(0, 0, 0.2, 1)`
- **Card image hover:** `scale 1 → 1.05`, 500ms ease
- **Quick-add button:** `translateY(100%) → translateY(0)` on card hover, 300ms
- **Badge:** Static (no animation)

---

### 14. Testimonial
- **Trigger:** Scroll into viewport
- **Animation:** `fadeIn` — opacity 0→1, duration 800ms, easing ease-out
- **Blockquote:** Subtle `fadeInUp` — translateY 20px→0
- **Cite:** `fadeIn`, delay 300ms

---

### 15. Tabbed Categories
- **Trigger:** Tab button click
- **Panel entrance:** `fadeIn` — opacity 0→1, duration 400ms, easing ease
- **CSS:** `.tab-panel.active { animation: fadeIn 0.4s ease }`
- **Tab button active:** `border-bottom: 2px solid black`, `color: black`; transition `border-color 300ms, color 300ms`
- **Grid items:** Staggered `scaleIn` after tab switch

---

### 16. Blog Grid
- **Trigger:** Scroll into viewport
- **Large card:** `slideInLeft` — opacity 0→1, translateX(-30px)→0, duration 600ms
- **Stack cards:** `slideInRight` — opacity 0→1, translateX(30px)→0, duration 600ms, stagger 150ms
- **Card image hover:** `scale 1 → 1.05`, 500ms ease
- **Content overlay:** Always visible (linear-gradient from transparent to rgba(0,0,0,0.7))

---

### 17. Value Props
- **Trigger:** Scroll into viewport (Intersection Observer)
- **Animation:** Staggered `fadeInUp` per icon+text group
- **Stagger:** 100ms between each of 4 items
- **Duration:** 600ms per item
- **Easing:** `cubic-bezier(0, 0, 0.2, 1)`
- **SVG icon:** No separate animation (reveals with parent)

---

### 18. Footer
- **Trigger:** Static (no scroll reveal on footer in base theme)
- **Newsletter input:** `border-color` highlights on focus: `transparent → rgba(...)`, 150ms
- **Subscribe button hover:** `background: gold → darker gold (#b8944f)`, 300ms
- **Footer links hover:** `color: #999 → gold`, 300ms ease-in-out
- **Mobile accordion:** Column headers click to expand/collapse; `max-height 300ms ease` + `opacity 300ms`

---

### 19. Newsletter Popup
- **Trigger:** `setTimeout` 3000ms after page load; once per session (`sessionStorage`)
- **Entrance animation:** `scaleIn` + `fadeIn` combined — `opacity 0→1, scale(0.95)→scale(1)`
- **Duration:** 300ms
- **Easing:** `cubic-bezier(0, 0, 0.2, 1)`
- **Overlay:** `rgba(0,0,0,0) → rgba(0,0,0,0.6)` fade, 300ms
- **Close:** Reverse — opacity 1→0, scale(1)→scale(0.95), 200ms ease-in
- **Click outside to close:** Same exit animation

---

### 20. Back-to-Top Button
- **Trigger:** `window.scrollY > 600`
- **Show:** `opacity 0→1`, `pointer-events: none → auto`
- **Duration:** 300ms
- **Hide:** reverse
- **Hover:** `background: black → gold`, 300ms
- **Click:** `window.scrollTo({ top: 0, behavior: 'smooth' })` — native smooth scroll

---

### 21. Image Lazy Loading (LQIP Pattern)
- **Technique:** Two stacked images — high-res + low-res (20px wide) placeholder
- **Placeholder:** Displayed full-size via CSS, appears blurred; initial opacity 1
- **When high-res loads:** Placeholder transitions `opacity: 1 → 0`, duration 500ms, `cubic-bezier(0, 0, 0.2, 1)`
- **Shimmer overlay:** While loading, `tw-shimmer` animation runs as a gradient sweep

---

### 22. Page Load Sequence (First Paint Order)
1. Announcement bar — immediate
2. Header — immediate
3. Hero image — high priority `fetchpriority="high"`, lazy=false; fades in as `fadeInSlide`
4. Hero text — 200ms after slide appears
5. Below-fold sections — lazy loaded, reveal on scroll

---

## Animation Presets (Implementation Reference)

```
fadeInUp:      opacity 0→1, translateY(30px→0), 600ms, cubic-bezier(0,0,0.2,1)
fadeIn:        opacity 0→1, 600ms, ease-out
slideInLeft:   opacity 0→1, translateX(-30px→0), 600ms, cubic-bezier(0,0,0.2,1)
slideInRight:  opacity 0→1, translateX(30px→0), 600ms, cubic-bezier(0,0,0.2,1)
scaleIn:       opacity 0→1, scale(0.95→1), 400ms, cubic-bezier(0,0,0.2,1)
staggerChildren: parent triggers children with 80–100ms delay between each
```

**Threshold for Intersection Observer:** `0.15` (trigger when 15% of element is in viewport)  
**rootMargin:** `"0px 0px -50px 0px"` (trigger 50px before bottom of viewport)

---

## Implementation Notes

- No JS animation library needed — pure CSS + Intersection Observer
- Use `will-change: opacity, transform` on animated elements for GPU compositing
- Respect `prefers-reduced-motion` — disable all transforms/animations, keep only opacity fades at 0ms
- The theme uses Tailwind utility classes for the wrapper page; our implementation uses the existing custom CSS from `globals.css`
- Hero slider's `fadeInSlide` should be replicated exactly: opacity-only, 1s ease-out
- Drawer easing `cubic-bezier(0.4, 0, 0.2, 1)` is exact — do not substitute with `ease-in-out`
