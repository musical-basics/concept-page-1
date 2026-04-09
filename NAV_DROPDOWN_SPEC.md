# Concept Theme Nav Bar Popup Menu - Implementation Spec

## Task
Implement the nav bar dropdown popup that appears on hover over navigation items (Products, Features, Resources, etc.) matching the Shopify Concept theme.

## Reference
**URL:** https://themes.shopify.com/themes/concept/presets/concept
**Action:** Press "View Demo" → Hover over nav items (Products, Features, Resources, Shop, etc.)

## Observed Behavior from Concept Theme

### Nav Item Structure
When hovering over categories with dropdowns:
- **Products** → Dropdown menu appears
- **Features** → Dropdown menu appears
- **Resources** → Dropdown menu appears

### Animation Characteristics
From extracted CSS in ANIMATIONS.md:
- Transition timing: **300ms** duration
- Easing curve: **`cubic-bezier(0.4, 0.22, 0.28, 1)`**
- Trigger: `mouseenter` → opacity 0→1
- Leave: `mouseleave` → opacity 1→0
- Position: **absolute dropdown** below the nav item
- Effect: **Fade + slide down animation**

### Content Structure
The Concept theme dropdown contains:
- List items with links
- Optional section headers
- Clean minimal styling
- No border, no background shadow
- Text color matches nav (white on dark)
- Padding: ~8-12px per item

## Implementation Tasks

1. **Identify nav items that should have dropdowns**
   - Products dropdown (most likely)
   - Features dropdown
   - Resources dropdown
   - Any category with sub-items

2. **Create dropdown menu component**
   - Name: `NavDropdown.tsx` or similar
   - Props: `label`, `items[]` array, `link` array
   - Use `ScrollReveal` with `slideInDown` animation
   - Trigger on `mouseenter`, hide on `mouseleave`

3. **Add to Header component**
   - Wrap dropdown items in NavDropdown
   - Ensure z-index: high (100+)
   - Position: absolute, right: 0 (relative to parent)

4. **Add CSS animations**
   - Dropdown opacity transition
   - Fade-in/slide-down effects
   - Use `@keyframes fadeInSlide` from extracted animations

5. **Match Concept styling**
   - Background: transparent (or inherit header bg)
   - No borders, no shadow
   - Items: padding, hover underline effect
   - External link arrows (same as Concept)

## CSS Animation Details
From WEBSITE_SCRAPE_SPEC.md:
```css
@keyframes fadeInSlide {
  0% { opacity: 0; }
  100% { opacity: 1; }
}
/* For dropdowns: combined with transform */
animation: fadeInSlide 300ms cubic-bezier(0.4, 0.22, 0.28, 1) ease-out;
opacity: 1;
transform: translateY(0);
```

## Testing Checklist
- [ ] Nav items show dropdown on hover
- [ ] Dropdown animates smoothly (300ms)
- [ ] Dropdown hides on mouse leave
- [ ] Items styled consistently
- [ ] External link arrows present
- [ ] Mobile: dropdown disabled or works differently

## Files to Modify
- `src/components/NavDropdown.tsx` — New component
- `src/components/Header.tsx` — Add dropdown usage
- `src/components/globals.css` — Add dropdown styles

## Do NOT change
- Keep the existing AnnouncementBar
- Keep the Header logo
- Keep mobile hamburger menu
- Keep the existing nav links structure

## Timeline & Token Plan
**Estimated:** ~15-20 turns
**In:** 3,000-5,000 tokens (this prompt, Claude Code analysis, code generation)
**Out:** 2,000-4,000 tokens (Claude Code reasoning, implementation, tests)
**Total:** 5,000-9,000 tokens

Claude Code should:
1. First, navigate to the reference URL and verify dropdown structure
2. Extract any additional hover transition rules for dropdowns
3. Create NavDropdown component with animation support
4. Integrate into Header where appropriate
5. Test both desktop and mobile behavior
