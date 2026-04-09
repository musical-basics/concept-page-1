/**
 * v3: Deep-scrape the themes.shopify.com preview page directly.
 * The Concept theme renders inline on this page. We scroll through it,
 * capture all CSS (keyframes, transitions), hover effects, and section structure.
 * Also captures full-page screenshots at each scroll position.
 */

import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SS_DIR = join(ROOT, 'screenshots');
mkdirSync(SS_DIR, { recursive: true });

const DEMO_URL = 'https://themes.shopify.com/themes/concept/presets/concept';

async function ss(page, name) {
  await page.screenshot({ path: join(SS_DIR, `${name}.png`), fullPage: false });
}
async function ssFull(page, name) {
  await page.screenshot({ path: join(SS_DIR, `${name}.png`), fullPage: true });
  console.log(`  📸 ${name}.png`);
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  });
  const page = await ctx.newPage();

  const data = {
    url: DEMO_URL,
    scrapedAt: new Date().toISOString(),
    keyframes: {},
    transitionRules: [],
    sectionLayout: [],
    hoverEffects: [],
    jsLibraries: {},
    scrollRevealElements: [],
    specificAnimations: {},
    mobileObservations: {},
  };

  console.log('🌐 Navigating to Shopify Concept theme preview…');
  await page.goto(DEMO_URL, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);

  // ── Page structure ──────────────────────────────────────────────────────
  const pageInfo = await page.evaluate(() => ({
    title: document.title,
    url: window.location.href,
    bodyClasses: document.body.className,
    scrollHeight: document.body.scrollHeight,
    innerHeight: window.innerHeight,
    scripts: Array.from(document.querySelectorAll('script[src]')).map(s => s.src).slice(0, 20),
  }));
  console.log(`  Title: ${pageInfo.title}`);
  console.log(`  Body classes: ${pageInfo.bodyClasses}`);
  console.log(`  Page height: ${pageInfo.scrollHeight}px`);
  console.log(`  Scripts: ${pageInfo.scripts.slice(0, 3).join(', ')}`);

  // ── JS library detection ────────────────────────────────────────────────
  data.jsLibraries = await page.evaluate(() => {
    const detected = [];
    const checks = { gsap: window.gsap, AOS: window.AOS, Swiper: window.Swiper, Splide: window.Splide, lenis: window.lenis, ScrollTrigger: window.ScrollTrigger, Flickity: window.Flickity, anime: window.anime };
    for (const [k, v] of Object.entries(checks)) if (v) detected.push(k);
    const scripts = Array.from(document.querySelectorAll('script[src]')).map(s => s.src).filter(s => !s.includes('google') && !s.includes('youtube'));
    const inlineSnippets = Array.from(document.querySelectorAll('script:not([src])')).map(s => s.textContent.slice(0, 300)).filter(t => t.includes('animation') || t.includes('transition') || t.includes('scroll') || t.includes('reveal'));
    return { detected, scripts: scripts.slice(0, 20), inlineSnippets: inlineSnippets.slice(0, 5) };
  });
  console.log(`  Libraries detected: ${data.jsLibraries.detected.join(', ') || 'none'}`);

  // ── Extract ALL @keyframes ──────────────────────────────────────────────
  data.keyframes = await page.evaluate(() => {
    const results = {};
    for (const sheet of Array.from(document.styleSheets)) {
      try {
        for (const rule of Array.from(sheet.cssRules || [])) {
          if (rule.type === 7) { // CSSKeyframesRule
            results[rule.name] = Array.from(rule.cssRules || []).map(r => ({
              keyText: r.keyText,
              cssText: r.cssText.slice(0, 500),
            }));
          }
        }
      } catch (e) {}
    }
    return results;
  });
  console.log(`  @keyframes found: ${Object.keys(data.keyframes).length} → [${Object.keys(data.keyframes).join(', ')}]`);

  // ── Extract all transition/animation CSS rules ──────────────────────────
  data.transitionRules = await page.evaluate(() => {
    const results = [];
    for (const sheet of Array.from(document.styleSheets)) {
      try {
        for (const rule of Array.from(sheet.cssRules || [])) {
          if (rule.type === 1) {
            const t = rule.style.transition;
            const a = rule.style.animation;
            const tr = rule.style.transform;
            if ((t && t !== 'none') || (a && a !== 'none')) {
              results.push({
                selector: rule.selectorText?.slice(0, 150),
                transition: t || null,
                animation: a || null,
                transform: tr || null,
                opacity: rule.style.opacity || null,
                willChange: rule.style.willChange || null,
                filter: rule.style.filter || null,
                clipPath: rule.style.clipPath || null,
              });
            }
          }
        }
      } catch (e) {}
    }
    return results;
  });
  console.log(`  Transition rules: ${data.transitionRules.length}`);

  // Log the most interesting ones
  data.transitionRules.slice(0, 30).forEach(r => {
    if (r.transition || r.animation) {
      console.log(`    ${r.selector?.slice(0, 60)} → ${(r.transition || r.animation || '').slice(0, 80)}`);
    }
  });

  // ── Section layout mapping ──────────────────────────────────────────────
  data.sectionLayout = await page.evaluate(() => {
    // Map ALL meaningful sections — Shopify uses data-section-type
    const selectors = [
      '[data-section-type]',
      'section',
      '[class*="shopify-section"]',
      'header', 'footer',
      '[class*="section--"]',
      '[class*="hero"]',
      '[class*="banner"]',
      '[class*="feature"]',
      '[class*="collection"]',
      '[class*="testimonial"]',
      '[class*="countdown"]',
    ];
    const seen = new Set();
    const results = [];
    for (const sel of selectors) {
      document.querySelectorAll(sel).forEach(el => {
        if (seen.has(el) || results.length > 40) return;
        seen.add(el);
        const s = getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        results.push({
          tag: el.tagName,
          id: el.id,
          classes: el.className.toString().slice(0, 100),
          sectionType: el.getAttribute('data-section-type'),
          transition: s.transition.slice(0, 100),
          animation: s.animation.slice(0, 100),
          top: rect.top + window.scrollY,
          height: rect.height,
          dataAttrs: Array.from(el.attributes).filter(a => a.name.startsWith('data-')).map(a => `${a.name}="${a.value}"`).join(' ').slice(0, 200),
        });
      });
    }
    return results;
  });
  console.log(`\n  Section layout (${data.sectionLayout.length} sections):`);
  data.sectionLayout.forEach(s => {
    const name = s.sectionType || s.classes.split(' ').find(c => c.length > 2) || s.tag;
    console.log(`    [${s.top}px] ${name} — transition: ${s.transition?.slice(0, 60) || 'none'}`);
  });

  // ── Scroll-reveal / intersection observer patterns ─────────────────────
  data.scrollRevealElements = await page.evaluate(() => {
    const results = [];
    const seen = new Set();
    // Check various patterns
    const patterns = [
      '[data-animate]', '[data-motion]', '[data-scroll]', '[data-aos]',
      '[data-section-animations]', '[data-animation]', '[data-reveal]',
      '[class*="animate"]', '[class*="reveal"]', '[class*="in-view"]',
      '[class*="is-visible"]', '[class*="is-animated"]',
      '[style*="opacity: 0"]', '[style*="opacity:0"]',
      '[style*="translateY"]', '[style*="translateX"]',
      '[class*="motion-reduce"]',
    ];
    for (const pat of patterns) {
      try {
        document.querySelectorAll(pat).forEach(el => {
          if (seen.has(el)) return;
          seen.add(el);
          const s = getComputedStyle(el);
          results.push({
            pattern: pat,
            tag: el.tagName,
            classes: el.className.toString().slice(0, 120),
            inlineStyle: el.getAttribute('style')?.slice(0, 120),
            computedOpacity: s.opacity,
            computedTransform: s.transform,
            computedTransition: s.transition.slice(0, 150),
            computedAnimation: s.animation.slice(0, 100),
            dataAttrs: Array.from(el.attributes).filter(a => a.name.startsWith('data-')).map(a => `${a.name}="${a.value}"`).join('; ').slice(0, 150),
          });
        });
      } catch (e) {}
    }
    return results;
  });
  console.log(`\n  Scroll-reveal elements: ${data.scrollRevealElements.length}`);
  data.scrollRevealElements.slice(0, 10).forEach(e => {
    console.log(`    ${e.pattern} → ${e.classes.slice(0, 60)} opacity:${e.computedOpacity} t:${e.computedTransition.slice(0, 60)}`);
  });

  // ── Full page screenshot ────────────────────────────────────────────────
  console.log('\n📸 Taking full page screenshot…');
  await ssFull(page, 'v3-01-full-page');

  // ── Scroll through page & capture at each stop ─────────────────────────
  console.log('\n📜 Scrolling through page…');
  const totalH = pageInfo.scrollHeight;

  const scrollPositions = [];
  for (let y = 0; y <= totalH + 200; y += 400) scrollPositions.push(y);

  for (const y of scrollPositions) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(400);
    if (y % 1200 === 0) {
      await ss(page, `v3-scroll-${y}`);
      console.log(`  Scrolled to ${y}px`);

      // Capture what elements just entered viewport
      const inViewEls = await page.evaluate((scrollY) => {
        const vh = window.innerHeight;
        const els = document.querySelectorAll('[class*="animate"], [data-animate], [class*="motion"], [class*="reveal"], [class*="section"], section, [class*="hero"], [class*="banner"]');
        return Array.from(els).filter(el => {
          const r = el.getBoundingClientRect();
          return r.top < vh && r.bottom > 0;
        }).slice(0, 10).map(el => {
          const s = getComputedStyle(el);
          return {
            classes: el.className.toString().slice(0, 80),
            opacity: s.opacity,
            transform: s.transform.slice(0, 60),
            transition: s.transition.slice(0, 80),
            animation: s.animation.slice(0, 80),
          };
        });
      }, y);

      if (inViewEls.length > 0) {
        data.specificAnimations[`scroll_${y}`] = inViewEls;
      }
    }
  }

  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);

  // ── Hero section deep inspection ────────────────────────────────────────
  console.log('\n🦸 Hero section…');
  data.specificAnimations.hero = await page.evaluate(() => {
    const candidates = document.querySelectorAll('[class*="hero"], [class*="slideshow"], [class*="banner"], [data-section-type="slideshow"], [data-section-type="hero"]');
    return Array.from(candidates).slice(0, 5).map(el => {
      const s = getComputedStyle(el);
      const children = Array.from(el.children).slice(0, 8).map(child => {
        const cs = getComputedStyle(child);
        return {
          tag: child.tagName,
          classes: child.className.toString().slice(0, 80),
          opacity: cs.opacity, transform: cs.transform,
          transition: cs.transition.slice(0, 100),
          animation: cs.animation.slice(0, 100),
        };
      });
      return {
        classes: el.className.toString().slice(0, 100),
        sectionType: el.getAttribute('data-section-type'),
        transition: s.transition.slice(0, 100),
        animation: s.animation.slice(0, 100),
        children,
      };
    });
  });

  // ── Hover effects ────────────────────────────────────────────────────────
  console.log('\n🖱  Capturing hover effects…');
  const hoverTargets = [
    { sel: 'header nav a, .header a, [class*="nav"] a, [class*="header"] a', label: 'Nav links' },
    { sel: '[class*="hero"] a, [class*="slideshow"] a, [class*="banner"] a, [class*="hero"] button', label: 'Hero CTA' },
    { sel: '[class*="product-card"], [class*="card--product"], [class*="product__card"]', label: 'Product card' },
    { sel: '[class*="product-card"] img, [class*="card"] img', label: 'Product card image' },
    { sel: '[class*="quick-add"], [class*="quick_add"], [class*="add-to-cart"]', label: 'Quick-add button' },
    { sel: '[class*="collection-card"], [class*="featured-collection"] a', label: 'Collection/category card' },
    { sel: '.button, a.button, [class*="btn"]', label: 'Generic button' },
    { sel: '[class*="swatch"], [class*="color-swatch"]', label: 'Color swatch' },
    { sel: '[class*="social"] img, [class*="instagram"] img', label: 'Social grid item' },
    { sel: '[class*="blog-card"], [class*="article-card"]', label: 'Blog card' },
    { sel: 'footer a, [class*="footer"] a', label: 'Footer link' },
    { sel: '[class*="tab"] button, [role="tab"]', label: 'Tab button' },
    { sel: '[class*="value"] [class*="icon"], [class*="feature"] [class*="icon"]', label: 'Value prop icon' },
    { sel: '[class*="testimonial"]', label: 'Testimonial' },
    { sel: '[class*="announcement"] a', label: 'Announcement link' },
  ];

  for (const target of hoverTargets) {
    try {
      const el = await page.locator(target.sel).first();
      if (await el.count() === 0) { data.hoverEffects.push({ label: target.label, found: false }); continue; }

      const before = await el.evaluate(e => {
        const s = getComputedStyle(e);
        return { opacity: s.opacity, transform: s.transform, transition: s.transition, background: s.backgroundColor, color: s.color, boxShadow: s.boxShadow, filter: s.filter, scale: s.scale };
      });

      await el.hover({ force: true });
      await page.waitForTimeout(400);

      const after = await el.evaluate(e => {
        const s = getComputedStyle(e);
        return { opacity: s.opacity, transform: s.transform, transition: s.transition, background: s.backgroundColor, color: s.color, boxShadow: s.boxShadow, filter: s.filter, scale: s.scale };
      });

      const changed = JSON.stringify(before) !== JSON.stringify(after);
      const result = { label: target.label, found: true, changed, before, after };
      data.hoverEffects.push(result);

      console.log(`  ${changed ? '✅' : '·'} ${target.label}${changed ? ':' : ''}`);
      if (changed) {
        if (before.transform !== after.transform) console.log(`     transform: ${before.transform.slice(0, 60)} → ${after.transform.slice(0, 60)}`);
        if (before.opacity !== after.opacity) console.log(`     opacity: ${before.opacity} → ${after.opacity}`);
        if (before.background !== after.background) console.log(`     bg: ${before.background.slice(0, 40)} → ${after.background.slice(0, 40)}`);
        if (before.color !== after.color) console.log(`     color: ${before.color} → ${after.color}`);
        if (before.boxShadow !== after.boxShadow) console.log(`     shadow: ${before.boxShadow.slice(0, 60)} → ${after.boxShadow.slice(0, 60)}`);
        console.log(`     transition: ${(after.transition || before.transition).slice(0, 80)}`);
      }
    } catch (e) {
      data.hoverEffects.push({ label: target.label, found: false, error: e.message.slice(0, 80) });
    }
  }

  // ── Scroll down for product cards & capture hover ─────────────────────
  console.log('\n  Scrolling to find product cards…');
  // Try scrolling to mid-page for product cards
  for (const y of [800, 1200, 1600, 2000, 2400]) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(300);
    const found = await page.locator('[class*="product-card"], [class*="card--product"]').count();
    if (found > 0) {
      console.log(`  Found product cards at y=${y}`);
      await ss(page, `v3-product-cards-${y}`);

      const cardHover = await page.locator('[class*="product-card"], [class*="card--product"]').first();
      try {
        const before = await cardHover.evaluate(e => {
          const s = getComputedStyle(e);
          const img = e.querySelector('img');
          const is = img ? getComputedStyle(img) : null;
          return {
            card: { transform: s.transform, boxShadow: s.boxShadow, transition: s.transition },
            img: is ? { transform: is.transform, transition: is.transition } : null,
          };
        });
        await cardHover.hover({ force: true });
        await page.waitForTimeout(400);
        const after = await cardHover.evaluate(e => {
          const s = getComputedStyle(e);
          const img = e.querySelector('img');
          const is = img ? getComputedStyle(img) : null;
          const quickAdd = e.querySelector('[class*="quick-add"], [class*="quick_add"]');
          const qs = quickAdd ? getComputedStyle(quickAdd) : null;
          return {
            card: { transform: s.transform, boxShadow: s.boxShadow, transition: s.transition },
            img: is ? { transform: is.transform, transition: is.transition } : null,
            quickAdd: qs ? { transform: qs.transform, opacity: qs.opacity, transition: qs.transition } : null,
          };
        });
        data.specificAnimations.productCardHover = { y, before, after };
        console.log('  Card transform change:', before.card.transform, '→', after.card.transform);
        console.log('  Img transform change:', before.img?.transform, '→', after.img?.transform);
        if (after.quickAdd) console.log('  QuickAdd:', after.quickAdd.transform, 'opacity:', after.quickAdd.opacity);
      } catch (e) {
        console.log('  Card hover error:', e.message.slice(0, 60));
      }
      break;
    }
  }

  // ── Mobile viewport ───────────────────────────────────────────────────
  console.log('\n📱 Mobile viewport (375x812)…');
  await page.setViewportSize({ width: 375, height: 812 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(600);
  await ssFull(page, 'v3-mobile-full');

  data.mobileObservations = await page.evaluate(() => {
    const burger = document.querySelector('[class*="burger"], [class*="hamburger"], [class*="menu-icon"], [class*="nav-toggle"], [aria-label*="menu"], button[class*="header"]');
    const drawer = document.querySelector('[class*="drawer"], [class*="mobile-nav"], [class*="side-nav"], [class*="menu-drawer"], [class*="navigation-drawer"]');
    const announcement = document.querySelector('[class*="announcement"]');
    return {
      burger: burger ? {
        classes: burger.className.toString(),
        display: getComputedStyle(burger).display,
        transition: getComputedStyle(burger).transition,
      } : null,
      drawer: drawer ? {
        classes: drawer.className.toString(),
        transform: getComputedStyle(drawer).transform,
        transition: getComputedStyle(drawer).transition,
        left: getComputedStyle(drawer).left,
        visibility: getComputedStyle(drawer).visibility,
        opacity: getComputedStyle(drawer).opacity,
      } : null,
      announcement: announcement ? {
        classes: announcement.className.toString(),
        animation: getComputedStyle(announcement).animation,
        display: getComputedStyle(announcement).display,
      } : null,
    };
  });

  // Try burger click on mobile
  try {
    const burgerSel = '[class*="burger"], [class*="hamburger"], [class*="menu-icon"], [class*="nav-toggle"], button[aria-label*="menu"], button[aria-label*="Menu"]';
    const burgerEl = await page.locator(burgerSel).first();
    if (await burgerEl.count() > 0) {
      console.log('  Clicking mobile burger…');
      await burgerEl.click({ force: true });
      await page.waitForTimeout(600);
      await ss(page, 'v3-mobile-menu-open');

      const drawerOpen = await page.evaluate(() => {
        const d = document.querySelector('[class*="drawer"], [class*="mobile-nav"], [class*="side-nav"], [class*="menu-drawer"]');
        if (!d) return null;
        const s = getComputedStyle(d);
        return { classes: d.className.toString(), transform: s.transform, transition: s.transition, opacity: s.opacity, visibility: s.visibility };
      });
      data.mobileObservations.drawerOpen = drawerOpen;
      if (drawerOpen) console.log(`  Drawer open: transform=${drawerOpen.transform}, visibility=${drawerOpen.visibility}`);
    }
  } catch (e) {
    console.log('  Burger click failed:', e.message.slice(0, 60));
  }

  // Back to desktop
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);

  // ── Announcement bar / marquee ─────────────────────────────────────────
  console.log('\n📣 Announcement bar/marquee…');
  data.specificAnimations.announcement = await page.evaluate(() => {
    const selectors = ['[class*="announcement"]', '[class*="marquee"]', '[class*="ticker"]', '[class*="promo-bar"]'];
    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (!el) continue;
      const s = getComputedStyle(el);
      const inner = el.querySelector('[class*="inner"], [class*="track"], [class*="list"], [class*="content"]');
      const is = inner ? getComputedStyle(inner) : null;
      return {
        selector: sel,
        classes: el.className.toString(),
        height: s.height,
        animation: s.animation,
        overflow: s.overflow,
        inner: inner ? {
          classes: inner.className.toString(),
          animation: is.animation,
          transform: is.transform,
          display: is.display,
        } : null,
      };
    }
    return null;
  });

  // ── Sticky header ─────────────────────────────────────────────────────
  console.log('\n📌 Sticky header…');
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
  const headerBefore = await page.evaluate(() => {
    const h = document.querySelector('header, [class*="header"]');
    if (!h) return null;
    const s = getComputedStyle(h);
    return { classes: h.className.toString(), position: s.position, top: s.top, boxShadow: s.boxShadow, transition: s.transition, background: s.background, height: s.height, backdropFilter: s.backdropFilter };
  });

  await page.evaluate(() => window.scrollTo(0, 300));
  await page.waitForTimeout(500);
  const headerAfter = await page.evaluate(() => {
    const h = document.querySelector('header, [class*="header"]');
    if (!h) return null;
    const s = getComputedStyle(h);
    return { classes: h.className.toString(), position: s.position, top: s.top, boxShadow: s.boxShadow, transition: s.transition, background: s.background, height: s.height, backdropFilter: s.backdropFilter };
  });
  data.specificAnimations.stickyHeader = { before: headerBefore, after: headerAfter };
  if (headerBefore && headerAfter) {
    console.log(`  height: ${headerBefore.height} → ${headerAfter.height}`);
    console.log(`  shadow: ${headerBefore.boxShadow?.slice(0, 40)} → ${headerAfter.boxShadow?.slice(0, 40)}`);
    console.log(`  bg: ${headerBefore.background?.slice(0, 40)} → ${headerAfter.background?.slice(0, 40)}`);
    console.log(`  transition: ${headerAfter.transition?.slice(0, 80)}`);
  }
  await page.evaluate(() => window.scrollTo(0, 0));

  // ── Back to top ───────────────────────────────────────────────────────
  console.log('\n⬆️  Back-to-top…');
  await page.evaluate((h) => window.scrollTo(0, h), pageInfo.scrollHeight);
  await page.waitForTimeout(500);
  data.specificAnimations.backToTop = await page.evaluate(() => {
    const el = document.querySelector('[class*="back-to-top"], [class*="scroll-top"], [class*="top-button"]');
    if (!el) return null;
    const s = getComputedStyle(el);
    return { classes: el.className.toString(), opacity: s.opacity, transform: s.transform, transition: s.transition, position: s.position, bottom: s.bottom, right: s.right };
  });
  await page.evaluate(() => window.scrollTo(0, 0));

  // ── Countdown timer ───────────────────────────────────────────────────
  console.log('\n⏰ Countdown timer…');
  for (const y of [1000, 2000, 3000, 4000, 5000, 6000, 7000]) {
    if (y > pageInfo.scrollHeight) break;
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(300);
    const countdown = await page.evaluate(() => {
      const el = document.querySelector('[class*="countdown"], [class*="timer"], [data-section-type*="countdown"]');
      if (!el) return null;
      const num = el.querySelector('[class*="number"], [class*="digit"], [class*="count"], [class*="time"]');
      const s = getComputedStyle(el);
      const ns = num ? getComputedStyle(num) : null;
      return {
        classes: el.className.toString(),
        animation: s.animation, transition: s.transition,
        number: num ? { classes: num.className.toString(), animation: ns.animation, transition: ns.transition, fontVariantNumeric: ns.fontVariantNumeric } : null,
      };
    });
    if (countdown) { data.specificAnimations.countdown = countdown; break; }
  }

  // ── Video / play button ───────────────────────────────────────────────
  console.log('\n▶️  Video section…');
  await page.evaluate(() => window.scrollTo(0, 0));
  for (const y of [500, 1000, 1500, 2000]) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(300);
    const video = await page.evaluate(() => {
      const els = document.querySelectorAll('[class*="play"], [class*="video"] button, [class*="media"] button');
      for (const el of els) {
        const s = getComputedStyle(el);
        return { classes: el.className.toString(), animation: s.animation, transition: s.transition, transform: s.transform, borderRadius: s.borderRadius };
      }
      return null;
    });
    if (video) { data.specificAnimations.videoPlayBtn = video; break; }
  }

  // ── Image lazy loading ────────────────────────────────────────────────
  console.log('\n🖼  Image lazy loading…');
  await page.evaluate(() => window.scrollTo(0, 0));
  data.specificAnimations.imageLazyLoad = await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll('img'));
    return imgs.slice(0, 10).map(img => {
      const s = getComputedStyle(img);
      return {
        loading: img.getAttribute('loading'),
        fetchpriority: img.getAttribute('fetchpriority'),
        decoding: img.getAttribute('decoding'),
        src: img.src?.slice(-40),
        dataSrc: img.getAttribute('data-src')?.slice(-40),
        classes: img.className.toString().slice(0, 80),
        opacity: s.opacity,
        transition: s.transition.slice(0, 80),
        objectFit: s.objectFit,
      };
    });
  });
  console.log('  Sample images:', data.specificAnimations.imageLazyLoad?.slice(0, 3).map(i => `loading=${i.loading} opacity=${i.opacity} t=${i.transition.slice(0, 40)}`).join(', '));

  // ── Output ────────────────────────────────────────────────────────────
  const outPath = join(ROOT, 'scripts', 'scrape-output-v3.json');
  writeFileSync(outPath, JSON.stringify(data, null, 2));
  console.log(`\n✅ Scrape complete → ${outPath}`);
  console.log(`   @keyframes: ${Object.keys(data.keyframes).length}`);
  console.log(`   Transition rules: ${data.transitionRules.length}`);
  console.log(`   Hover effects: ${data.hoverEffects.length}`);
  console.log(`   Scroll-reveal elements: ${data.scrollRevealElements.length}`);

  await browser.close();
  return data;
}

main().catch(console.error);
