# Website Scrape — Animation Capture & Translation

## Objective

Use Playwright to interact with the live Shopify Concept theme demo, observe and document all animations and interactive behaviors, then translate those animations into the concept-clone Next.js pages.

## Source Site

**URL:** https://themes.shopify.com/themes/concept/presets/concept

### Step-by-step browser workflow:

1. **Navigate** to the URL above
2. **Click "View demo"** button to enter the live demo store
3. **Systematically scroll** through every section of the demo homepage
4. **Click into the shop/collection page** and scroll through it
5. **Click into individual product pages** and observe interactions
6. **Test mobile viewport** — set viewport to 375x812 (iPhone) and repeat key scrolls
7. **Test hover states** — hover over product cards, buttons, navigation items

## What to capture for each section:

For every animated element you encounter, document:

- **Element**: What component/section is animating
- **Trigger**: What causes the animation (scroll into view, hover, page load, click)
- **Animation type**: fade-in, slide-up, slide-left/right, scale, parallax, stagger children, etc.
- **Duration**: Approximate timing (ms)
- **Easing**: ease, ease-in-out, spring, cubic-bezier, etc.
- **Delay**: Any stagger delay between sibling elements
- **Threshold**: How far the element needs to be in viewport before triggering
- **CSS/JS approach**: CSS transitions, CSS @keyframes, Intersection Observer, Framer Motion, GSAP, etc.

## Sections to expect on the Concept theme homepage:

Based on the existing components in this project, pay special attention to:

1. **Announcement Bar** — any slide-in or marquee behavior
2. **Header/Nav** — sticky behavior, dropdown animations, cart drawer slide-in
3. **Hero Slider** — image transitions, text fade/slide timing, autoplay behavior
4. **Brand Intro** — text reveal animations on scroll
5. **Video Section** — play button animation, video reveal
6. **Featured Product** — image zoom on hover, CTA button animation
7. **Comparison Section** — side-by-side reveal animation
8. **Bundle Builder** — interactive add/remove animations
9. **Marquee** — infinite scroll speed and direction
10. **Social Feed** — staggered grid reveal
11. **Countdown Timer** — number flip animation
12. **Product Grid** — card hover effects (image swap, quick view slide-in)
13. **Testimonials** — carousel slide animation
14. **Tabbed Categories** — tab switch animation
15. **Blog Grid** — card hover lift/shadow
16. **Value Props** — icon + text staggered reveal
17. **Footer** — accordion expand on mobile
18. **Newsletter Popup** — entrance animation (slide up? fade in?)
19. **Back to Top** — show/hide on scroll threshold

Also observe:
- **Page load sequence** — order elements appear on first load
- **Scroll progress indicators** if any
- **Image lazy loading** behavior (blur-up? fade-in?)
- **Color swatches** — hover/click transitions
- **Cart drawer** — slide direction, overlay fade
- **Mobile menu** — hamburger to X animation, slide direction

## Implementation approach:

After documenting all animations, implement them in the concept-clone using:

1. **CSS animations** for simple transitions (hover states, fades)
2. **Intersection Observer** for scroll-triggered reveals (lightweight, no library needed)
3. **Framer Motion** for complex orchestrated animations (stagger, layout animations, hero transitions)

### Animation system architecture:

- Create `src/hooks/useScrollReveal.ts` — custom hook wrapping Intersection Observer
- Create `src/components/ScrollReveal.tsx` — wrapper component with configurable animation presets
- Create `src/lib/animations.ts` — shared animation config (durations, easings, presets)
- Apply animations to each existing component without changing structure/layout

### Presets to create:

```
fadeInUp    — opacity 0→1, translateY 30px→0
fadeIn      — opacity 0→1
slideInLeft — opacity 0→1, translateX -50px→0
slideInRight — opacity 0→1, translateX 50px→0
scaleIn     — opacity 0→1, scale 0.9→1
staggerChildren — parent triggers children with 0.1s delay between each
```

## Output artifacts:

1. `ANIMATIONS.md` — Full documentation of all observed animations (the "scrape" output)
2. Updated components with animations applied
3. `src/hooks/useScrollReveal.ts` — scroll reveal hook
4. `src/components/ScrollReveal.tsx` — reveal wrapper component
5. `src/lib/animations.ts` — animation config/presets

## Technical notes:

- Use Playwright with Chromium (headless) to programmatically scroll and capture behavior
- Take screenshots at key scroll positions to reference later
- Use browser DevTools (Playwright's `page.evaluate`) to inspect computed styles and transition properties
- For elements with CSS animations, extract the `@keyframes` rules
- For JS-driven animations, note the library used and key parameters
- The demo site may use Shopify's native animation system — translate the *effect*, not the implementation
