/**
 * Playwright scraper for Shopify Concept theme animations.
 * Navigates to the live demo, clicks "View demo", then systematically
 * inspects transitions, keyframes, Intersection Observer usage, and
 * hover/scroll-triggered effects across every section.
 */

import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SCREENSHOTS_DIR = join(ROOT, 'screenshots');

mkdirSync(SCREENSHOTS_DIR, { recursive: true });

const ENTRY_URL = 'https://themes.shopify.com/themes/concept/presets/concept';

// ─── helpers ────────────────────────────────────────────────────────────────

async function ss(page, name) {
  const p = join(SCREENSHOTS_DIR, `${name}.png`);
  await page.screenshot({ path: p, fullPage: false });
  console.log(`  📸 ${name}.png`);
}

/** Extract all CSS transition / animation properties from a selector */
async function getComputedAnimProps(page, selector) {
  return page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const s = getComputedStyle(el);
    return {
      transition: s.transition,
      animation: s.animation,
      transform: s.transform,
      opacity: s.opacity,
      transitionDuration: s.transitionDuration,
      transitionTimingFunction: s.transitionTimingFunction,
      transitionDelay: s.transitionDelay,
      transitionProperty: s.transitionProperty,
      animationName: s.animationName,
      animationDuration: s.animationDuration,
      animationTimingFunction: s.animationTimingFunction,
      animationDelay: s.animationDelay,
      animationIterationCount: s.animationIterationCount,
    };
  }, selector);
}

/** Extract all @keyframes rules from all stylesheets */
async function getAllKeyframes(page) {
  return page.evaluate(() => {
    const results = {};
    try {
      for (const sheet of Array.from(document.styleSheets)) {
        try {
          for (const rule of Array.from(sheet.cssRules || [])) {
            if (rule instanceof CSSKeyframesRule) {
              results[rule.name] = Array.from(rule.cssRules).map(r => ({
                keyText: r.keyText,
                cssText: r.cssText,
              }));
            }
          }
        } catch (e) { /* cross-origin sheets */ }
      }
    } catch (e) {}
    return results;
  });
}

/** Extract all CSS transitions from all rules (non-keyframe) */
async function getAllTransitionRules(page) {
  return page.evaluate(() => {
    const results = [];
    try {
      for (const sheet of Array.from(document.styleSheets)) {
        try {
          for (const rule of Array.from(sheet.cssRules || [])) {
            if (rule instanceof CSSStyleRule) {
              const t = rule.style.transition;
              const a = rule.style.animation;
              const tr = rule.style.transform;
              if (t || a) {
                results.push({
                  selector: rule.selectorText,
                  transition: t || null,
                  animation: a || null,
                  transform: tr || null,
                  opacity: rule.style.opacity || null,
                });
              }
            }
          }
        } catch (e) {}
      }
    } catch (e) {}
    return results;
  });
}

/** Inspect IntersectionObserver usage by patching it early (too late here but check for data attributes) */
async function getIntersectionObserverClues(page) {
  return page.evaluate(() => {
    // Look for elements with data-animate, data-aos, data-scroll etc.
    const clues = [];
    const attrs = ['data-animate', 'data-aos', 'data-scroll', 'data-reveal',
                   'data-motion', 'data-animation', 'data-entrance'];
    for (const attr of attrs) {
      const els = document.querySelectorAll(`[${attr}]`);
      els.forEach(el => {
        clues.push({ attr, value: el.getAttribute(attr), tag: el.tagName, class: el.className.toString().slice(0, 80) });
      });
    }
    // Also look for class patterns
    const animClasses = document.querySelectorAll('[class*="animate"], [class*="reveal"], [class*="motion"], [class*="fade"], [class*="slide-"], [class*="scroll-"]');
    animClasses.forEach(el => {
      clues.push({ attr: 'class-pattern', value: null, tag: el.tagName, class: el.className.toString().slice(0, 100) });
    });
    return clues;
  });
}

/** Get element bounding boxes for visible sections */
async function getSectionLayout(page) {
  return page.evaluate(() => {
    const sections = document.querySelectorAll('section, header, footer, [class*="section"], [class*="hero"], [class*="banner"]');
    return Array.from(sections).slice(0, 30).map(el => ({
      tag: el.tagName,
      id: el.id,
      classes: el.className.toString().slice(0, 100),
      rect: el.getBoundingClientRect().toJSON(),
    }));
  });
}

/** Hover an element and capture before/after computed styles */
async function captureHoverTransition(page, selector, label) {
  try {
    const el = await page.$(selector);
    if (!el) return { label, found: false };

    // Before hover
    const before = await page.evaluate((sel) => {
      const e = document.querySelector(sel);
      if (!e) return null;
      const s = getComputedStyle(e);
      return { opacity: s.opacity, transform: s.transform, transition: s.transition, background: s.backgroundColor, color: s.color, boxShadow: s.boxShadow };
    }, selector);

    await el.hover();
    await page.waitForTimeout(400);

    // After hover
    const after = await page.evaluate((sel) => {
      const e = document.querySelector(sel);
      if (!e) return null;
      const s = getComputedStyle(e);
      return { opacity: s.opacity, transform: s.transform, transition: s.transition, background: s.backgroundColor, color: s.color, boxShadow: s.boxShadow };
    }, selector);

    return { label, found: true, before, after };
  } catch (e) {
    return { label, found: false, error: e.message };
  }
}

/** Scroll to position and capture computed styles for a selector */
async function captureAtScroll(page, yPos, selector, label) {
  await page.evaluate((y) => window.scrollTo(0, y), yPos);
  await page.waitForTimeout(600);
  const styles = await page.evaluate((sel) => {
    const e = document.querySelector(sel);
    if (!e) return null;
    const s = getComputedStyle(e);
    return {
      opacity: s.opacity, transform: s.transform,
      transition: s.transition, animation: s.animation,
      visibility: s.visibility, display: s.display,
    };
  }, selector);
  return { label, yPos, selector, styles };
}

// ─── main ───────────────────────────────────────────────────────────────────

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  });

  const data = {
    meta: { scrapedAt: new Date().toISOString(), url: ENTRY_URL },
    demoUrl: null,
    sections: [],
    keyframes: {},
    transitionRules: [],
    intersectionObserverClues: [],
    hoverEffects: [],
    scrollEffects: [],
    pageLoadSequence: [],
    mobileObservations: [],
    interactiveElements: [],
    jsLibraries: [],
    rawCSS: {},
  };

  const page = await context.newPage();

  // ── 1. Navigate to theme preview page ──────────────────────────────────────
  console.log('\n🌐 Navigating to Shopify theme page…');
  await page.goto(ENTRY_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(3000);
  await ss(page, '01-theme-preview-page');

  // ── 2. Click "View demo" ───────────────────────────────────────────────────
  console.log('🖱  Looking for "View demo" button…');
  let demoUrl = null;
  try {
    // Try various selectors
    const demoBtn = await page.locator('a:has-text("View demo"), button:has-text("View demo"), a:has-text("Preview"), [data-testid*="demo"]').first();
    if (await demoBtn.count() > 0) {
      // Get the href before clicking
      const href = await demoBtn.getAttribute('href');
      console.log(`  Found demo link: ${href}`);

      // Open in new tab to capture the redirect
      const [newPage] = await Promise.all([
        context.waitForEvent('page'),
        demoBtn.click(),
      ]);
      if (newPage) {
        await newPage.waitForLoadState('domcontentloaded', { timeout: 15000 });
        demoUrl = newPage.url();
        console.log(`  Demo URL: ${demoUrl}`);
        data.demoUrl = demoUrl;
        await newPage.close();
      } else if (href) {
        demoUrl = href.startsWith('http') ? href : `https://themes.shopify.com${href}`;
        data.demoUrl = demoUrl;
      }
    }
  } catch (e) {
    console.log(`  Could not click View demo: ${e.message}`);
  }

  // Navigate directly to a known Concept demo URL as fallback
  const conceptDemoUrls = [
    demoUrl,
    'https://concept-demo.myshopify.com/',
    'https://shopify-concept-theme.myshopify.com/',
  ].filter(Boolean);

  let demoPg = null;
  for (const url of conceptDemoUrls) {
    try {
      console.log(`\n🌐 Trying demo at: ${url}`);
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await page.waitForTimeout(3000);
      const title = await page.title();
      console.log(`  Title: ${title}`);
      if (title && !title.includes('Shopify') && !title.toLowerCase().includes('error')) {
        demoPg = url;
        data.demoUrl = url;
        break;
      }
    } catch (e) {
      console.log(`  Failed: ${e.message}`);
    }
  }

  await ss(page, '02-demo-homepage');

  // ── 3. Extract JS libraries ────────────────────────────────────────────────
  console.log('\n📚 Detecting JS libraries…');
  const libs = await page.evaluate(() => {
    const detected = [];
    if (window.gsap || window.TweenMax || window.TweenLite) detected.push('GSAP');
    if (window.ScrollTrigger) detected.push('ScrollTrigger');
    if (window.AOS) detected.push('AOS (Animate On Scroll)');
    if (window.anime) detected.push('anime.js');
    if (window.Framer) detected.push('Framer');
    if (window.motion) detected.push('Framer Motion');
    if (window.lenis) detected.push('Lenis smooth scroll');
    if (window.LocomotiveScroll) detected.push('Locomotive Scroll');
    if (window.Swiper) detected.push('Swiper');
    if (window.Splide) detected.push('Splide');
    if (window.flickity || window.Flickity) detected.push('Flickity');
    // Check scripts
    const scripts = Array.from(document.querySelectorAll('script[src]')).map(s => s.src);
    const gsapScript = scripts.find(s => s.includes('gsap'));
    if (gsapScript) detected.push(`GSAP (via script: ${gsapScript})`);
    const aosScript = scripts.find(s => s.includes('aos'));
    if (aosScript) detected.push(`AOS (via script: ${aosScript})`);
    return { detected, allScripts: scripts.slice(0, 20) };
  });
  data.jsLibraries = libs;
  console.log('  Detected:', libs.detected.join(', ') || 'none');

  // ── 4. Extract all @keyframes ──────────────────────────────────────────────
  console.log('\n🎬 Extracting @keyframes…');
  data.keyframes = await getAllKeyframes(page);
  console.log(`  Found ${Object.keys(data.keyframes).length} @keyframe rules`);
  for (const name of Object.keys(data.keyframes)) {
    console.log(`    - ${name}`);
  }

  // ── 5. Extract all transition/animation CSS rules ──────────────────────────
  console.log('\n🔄 Extracting CSS transition/animation rules…');
  const allRules = await getAllTransitionRules(page);
  data.transitionRules = allRules;
  console.log(`  Found ${allRules.length} rules with transitions/animations`);

  // ── 6. Intersection Observer / data attribute clues ───────────────────────
  console.log('\n👁  Looking for scroll-reveal patterns…');
  data.intersectionObserverClues = await getIntersectionObserverClues(page);
  console.log(`  Found ${data.intersectionObserverClues.length} elements with animation attributes/classes`);

  // ── 7. Section layout ──────────────────────────────────────────────────────
  console.log('\n📐 Mapping section layout…');
  data.sections = await getSectionLayout(page);
  console.log(`  Found ${data.sections.length} sections`);
  data.sections.forEach(s => console.log(`    - ${s.tag}#${s.id} .${s.classes.split(' ')[0]}`));

  // ── 8. Scroll through page and capture scroll-triggered effects ─────────────
  console.log('\n📜 Scrolling through page…');
  const pageHeight = await page.evaluate(() => document.body.scrollHeight);
  console.log(`  Page height: ${pageHeight}px`);

  const scrollStops = [0, 300, 600, 900, 1200, 1600, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 5500, 6000];
  for (const y of scrollStops.filter(y => y <= pageHeight + 500)) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(500);
    if (y % 1000 === 0) {
      await ss(page, `03-scroll-${y}px`);
    }
  }

  // Back to top
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);

  // ── 9. Targeted hover captures ─────────────────────────────────────────────
  console.log('\n🖱  Capturing hover effects…');
  const hoverTargets = [
    // Header
    { sel: 'header nav a, .header nav a, [class*="nav"] a', label: 'Nav link hover' },
    { sel: 'header a, .header a, [class*="header"] a', label: 'Header link hover' },
    // Hero CTA
    { sel: '[class*="hero"] a, [class*="hero"] button, .hero a, .hero button', label: 'Hero CTA hover' },
    // Product cards
    { sel: '[class*="product-card"], [class*="card--product"], .product-card', label: 'Product card hover' },
    { sel: '[class*="product-card"] img, .product-card img', label: 'Product card image hover' },
    { sel: '[class*="quick-add"], [class*="quick_add"], .quick-add', label: 'Quick add button hover' },
    // Category cards
    { sel: '[class*="collection-card"], [class*="category"], [class*="featured-collection"]', label: 'Category card hover' },
    // Buttons
    { sel: 'button[class*="btn"], a[class*="btn"], .btn, button[class*="button"], a[class*="button"]', label: 'Generic button hover' },
    // Color swatches
    { sel: '[class*="swatch"], [class*="color-swatch"]', label: 'Color swatch hover' },
    // Social items
    { sel: '[class*="social"] [class*="item"], [class*="instagram"] [class*="item"]', label: 'Social item hover' },
    // Blog cards
    { sel: '[class*="blog-card"], [class*="article-card"], [class*="blog"] [class*="card"]', label: 'Blog card hover' },
    // Footer links
    { sel: 'footer a', label: 'Footer link hover' },
    // Tab buttons
    { sel: '[class*="tab"] button, [role="tab"]', label: 'Tab button hover' },
  ];

  for (const target of hoverTargets) {
    const result = await captureHoverTransition(page, target.sel, target.label);
    data.hoverEffects.push(result);
    if (result.found) {
      const changed = result.before && result.after && JSON.stringify(result.before) !== JSON.stringify(result.after);
      console.log(`  ${changed ? '✓' : '·'} ${target.label}: ${changed ? 'ANIMATED' : 'no change'}`);
    }
  }

  // ── 10. Capture specific section animations by scroll position ─────────────
  console.log('\n🎯 Capturing section-specific animations…');

  // Scroll to hero and look at hero elements
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(800);
  const heroElements = await page.evaluate(() => {
    const candidates = document.querySelectorAll('[class*="hero"] *, [class*="banner"] *, [class*="slideshow"] *');
    return Array.from(candidates).slice(0, 20).map(el => {
      const s = getComputedStyle(el);
      return {
        tag: el.tagName,
        class: el.className.toString().slice(0, 80),
        transition: s.transition,
        animation: s.animation,
        transform: s.transform,
        opacity: s.opacity,
        animationName: s.animationName,
      };
    }).filter(e => e.transition !== 'all 0s ease 0s' || e.animation !== 'none 0s ease 0s 1 normal none running' || e.animationName !== 'none');
  });
  data.pageLoadSequence = heroElements;

  // Product card scroll reveal
  const productReveal = await page.evaluate(() => {
    const cards = document.querySelectorAll('[class*="product-card"], [class*="card--product"], .product-card');
    return Array.from(cards).slice(0, 4).map(el => {
      const s = getComputedStyle(el);
      return {
        class: el.className.toString().slice(0, 80),
        opacity: s.opacity,
        transform: s.transform,
        transition: s.transition,
        animation: s.animation,
        // Check for in-viewport attribute
        inert: el.getAttribute('inert'),
        ariaHidden: el.getAttribute('aria-hidden'),
        dataAnimate: el.getAttribute('data-animate') || el.getAttribute('data-animation'),
      };
    });
  });
  data.scrollEffects.push({ section: 'Product Cards', data: productReveal });

  // Scroll to ~30% and capture
  await page.evaluate((h) => window.scrollTo(0, h * 0.3), pageHeight);
  await page.waitForTimeout(800);
  await ss(page, '04-mid-scroll');

  // ── 11. Check announcement bar / header sticky behavior ───────────────────
  console.log('\n📣 Checking announcement bar & header…');
  const announcementAnim = await page.evaluate(() => {
    const bar = document.querySelector('[class*="announcement"], [class*="marquee"], [class*="ticker"]');
    if (!bar) return null;
    const s = getComputedStyle(bar);
    const inner = bar.querySelector('[class*="track"], [class*="inner"], [class*="list"]');
    const is = inner ? getComputedStyle(inner) : null;
    return {
      barClasses: bar.className.toString(),
      transition: s.transition, animation: s.animation,
      innerAnimation: is?.animation,
      innerTransform: is?.transform,
    };
  });
  data.interactiveElements.push({ name: 'Announcement bar', data: announcementAnim });

  // Header sticky
  await page.evaluate(() => window.scrollTo(0, 200));
  await page.waitForTimeout(400);
  const headerSticky = await page.evaluate(() => {
    const h = document.querySelector('header, [class*="header"]');
    if (!h) return null;
    const s = getComputedStyle(h);
    return {
      classes: h.className.toString(),
      position: s.position, top: s.top, boxShadow: s.boxShadow,
      transition: s.transition, backdropFilter: s.backdropFilter,
      background: s.background, height: s.height,
    };
  });
  data.interactiveElements.push({ name: 'Sticky header (scrolled)', data: headerSticky });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);

  // ── 12. Check marquee/ticker ───────────────────────────────────────────────
  console.log('\n📢 Checking marquee/ticker animation…');
  const marqueeAnim = await page.evaluate(() => {
    const selectors = ['[class*="marquee"]', '[class*="ticker"]', '[class*="scrolling-text"]', '[class*="announcement-bar__message"]'];
    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (el) {
        const s = getComputedStyle(el);
        const items = el.querySelectorAll('[class*="item"], [class*="text"], span');
        const firstItem = items[0] ? getComputedStyle(items[0]) : null;
        return {
          selector: sel,
          classes: el.className.toString(),
          animation: s.animation,
          transform: s.transform,
          display: s.display,
          overflow: getComputedStyle(el.parentElement || el).overflow,
          itemAnimation: firstItem?.animation,
          animationDuration: s.animationDuration,
          animationTimingFunction: s.animationTimingFunction,
          animationIterationCount: s.animationIterationCount,
        };
      }
    }
    return null;
  });
  data.interactiveElements.push({ name: 'Marquee/ticker animation', data: marqueeAnim });

  // ── 13. Check play button animation ───────────────────────────────────────
  console.log('\n▶️  Checking video / play button…');
  const playBtn = await page.evaluate(() => {
    const selectors = ['[class*="play"]', '[class*="video"] button', '[class*="media"] button'];
    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (el) {
        const s = getComputedStyle(el);
        return {
          classes: el.className.toString(),
          animation: s.animation,
          transition: s.transition,
          transform: s.transform,
          borderRadius: s.borderRadius,
        };
      }
    }
    return null;
  });
  data.interactiveElements.push({ name: 'Play button', data: playBtn });

  // ── 14. Check mobile nav / hamburger ──────────────────────────────────────
  console.log('\n📱 Testing mobile viewport (375x812)…');
  await page.setViewportSize({ width: 375, height: 812 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  await ss(page, '05-mobile');

  const mobileMenu = await page.evaluate(() => {
    const burger = document.querySelector('[class*="burger"], [class*="hamburger"], [class*="menu-toggle"], [aria-label*="menu"]');
    const drawer = document.querySelector('[class*="drawer"], [class*="mobile-nav"], [class*="mobile-menu"], [class*="sidebar"]');
    const bs = burger ? getComputedStyle(burger) : null;
    const ds = drawer ? getComputedStyle(drawer) : null;
    return {
      burger: burger ? { classes: burger.className.toString(), transition: bs.transition, display: bs.display } : null,
      drawer: drawer ? {
        classes: drawer.className.toString(),
        transition: ds.transition,
        transform: ds.transform,
        left: ds.left,
        right: ds.right,
        top: ds.top,
        visibility: ds.visibility,
        opacity: ds.opacity,
        position: ds.position,
      } : null,
    };
  });
  data.mobileObservations.push({ name: 'Mobile menu state (closed)', data: mobileMenu });

  // Try opening mobile menu
  try {
    const burgerBtn = await page.$('[class*="burger"], [class*="hamburger"], [class*="menu-toggle"], [aria-label*="menu"]');
    if (burgerBtn) {
      await burgerBtn.click();
      await page.waitForTimeout(600);
      await ss(page, '06-mobile-menu-open');
      const menuOpen = await page.evaluate(() => {
        const drawer = document.querySelector('[class*="drawer"], [class*="mobile-nav"], [class*="mobile-menu"]');
        const ds = drawer ? getComputedStyle(drawer) : null;
        return drawer ? {
          classes: drawer.className.toString(),
          transition: ds.transition,
          transform: ds.transform,
          visibility: ds.visibility,
          opacity: ds.opacity,
        } : null;
      });
      data.mobileObservations.push({ name: 'Mobile menu state (open)', data: menuOpen });
      // Close
      await burgerBtn.click();
      await page.waitForTimeout(400);
    }
  } catch (e) {
    console.log('  Could not interact with mobile menu:', e.message);
  }

  // Reset to desktop
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.waitForTimeout(300);

  // ── 15. Check countdown/number animation ──────────────────────────────────
  console.log('\n⏰ Checking countdown timer…');
  // Scroll to find it
  await page.evaluate((h) => window.scrollTo(0, h * 0.6), pageHeight);
  await page.waitForTimeout(500);
  const countdownEl = await page.evaluate(() => {
    const selectors = ['[class*="countdown"]', '[class*="timer"]', '[id*="countdown"]'];
    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (el) {
        const s = getComputedStyle(el);
        const num = el.querySelector('[class*="number"], [class*="digit"], [class*="count"]');
        const ns = num ? getComputedStyle(num) : null;
        return {
          classes: el.className.toString(),
          animation: s.animation,
          numberAnimation: ns?.animation,
          numberTransition: ns?.transition,
          numberTransform: ns?.transform,
        };
      }
    }
    return null;
  });
  data.interactiveElements.push({ name: 'Countdown timer', data: countdownEl });

  // ── 16. Check cart drawer ─────────────────────────────────────────────────
  console.log('\n🛒 Checking cart drawer…');
  try {
    // Try clicking cart button
    const cartBtn = await page.$('[class*="cart"] button, [aria-label*="cart"], [class*="cart-toggle"]');
    if (cartBtn) {
      await cartBtn.click();
      await page.waitForTimeout(600);
      await ss(page, '07-cart-drawer');
      const cartDrawer = await page.evaluate(() => {
        const drawer = document.querySelector('[class*="cart-drawer"], [class*="mini-cart"], [id*="cart"]');
        if (!drawer) return null;
        const s = getComputedStyle(drawer);
        return {
          classes: drawer.className.toString(),
          transition: s.transition,
          transform: s.transform,
          right: s.right,
          visibility: s.visibility,
          opacity: s.opacity,
          position: s.position,
          zIndex: s.zIndex,
        };
      });
      data.interactiveElements.push({ name: 'Cart drawer (open)', data: cartDrawer });
      // Close
      await page.keyboard.press('Escape');
      await page.waitForTimeout(400);
    }
  } catch (e) {
    console.log('  Could not interact with cart:', e.message);
  }

  // ── 17. Image lazy load behavior ──────────────────────────────────────────
  console.log('\n🖼  Checking image lazy load behavior…');
  const imgLazy = await page.evaluate(() => {
    const imgs = document.querySelectorAll('img[loading], img[data-src], img[class*="lazy"]');
    return Array.from(imgs).slice(0, 5).map(img => ({
      src: img.src?.slice(0, 80),
      loading: img.getAttribute('loading'),
      dataSrc: img.getAttribute('data-src')?.slice(0, 80),
      classes: img.className.toString().slice(0, 80),
      style: img.getAttribute('style')?.slice(0, 80),
    }));
  });
  data.interactiveElements.push({ name: 'Image lazy loading', data: imgLazy });

  // ── 18. Scroll back to top, check Back-to-top behavior ────────────────────
  console.log('\n⬆️  Checking back-to-top…');
  await page.evaluate((h) => window.scrollTo(0, h), pageHeight);
  await page.waitForTimeout(400);
  const backToTopEl = await page.evaluate(() => {
    const el = document.querySelector('[class*="back-to-top"], [class*="scroll-top"], [aria-label*="top"]');
    if (!el) return null;
    const s = getComputedStyle(el);
    return {
      classes: el.className.toString(),
      opacity: s.opacity,
      transform: s.transform,
      transition: s.transition,
      visibility: s.visibility,
      position: s.position,
      bottom: s.bottom, right: s.right,
    };
  });
  data.interactiveElements.push({ name: 'Back to top button (visible)', data: backToTopEl });

  // ── 19. Check tab switch animation ────────────────────────────────────────
  console.log('\n🗂  Checking tab animations…');
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
  // Find tabs
  const tabBtn = await page.$('[role="tab"], [class*="tab"] button, [class*="tabs"] button');
  if (tabBtn) {
    const tabBefore = await page.evaluate(() => {
      const panel = document.querySelector('[role="tabpanel"], [class*="tab-panel"], [class*="tab__panel"]');
      if (!panel) return null;
      const s = getComputedStyle(panel);
      return { opacity: s.opacity, transform: s.transform, transition: s.transition };
    });
    await tabBtn.click();
    await page.waitForTimeout(500);
    const tabAfter = await page.evaluate(() => {
      const panel = document.querySelector('[role="tabpanel"], [class*="tab-panel"], [class*="tab__panel"]');
      if (!panel) return null;
      const s = getComputedStyle(panel);
      return { opacity: s.opacity, transform: s.transform, transition: s.transition };
    });
    data.interactiveElements.push({ name: 'Tab switch', data: { before: tabBefore, after: tabAfter } });
  }

  // ── 20. Final screenshot ───────────────────────────────────────────────────
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  await ss(page, '08-final');

  // ── 21. Raw CSS extraction (first 50 rules with transitions) ──────────────
  console.log('\n📋 Extracting raw CSS samples…');
  const rawCSSRules = await page.evaluate(() => {
    const results = [];
    try {
      for (const sheet of Array.from(document.styleSheets)) {
        try {
          for (const rule of Array.from(sheet.cssRules || [])) {
            if (rule instanceof CSSStyleRule) {
              const css = rule.cssText;
              if (css.includes('transition') || css.includes('animation') || css.includes('@keyframes')) {
                results.push(css.slice(0, 300));
                if (results.length >= 60) break;
              }
            }
          }
        } catch (e) {}
        if (results.length >= 60) break;
      }
    } catch (e) {}
    return results;
  });
  data.rawCSS.animationRules = rawCSSRules;

  await browser.close();

  // ── Write JSON output ──────────────────────────────────────────────────────
  const outputPath = join(ROOT, 'scripts', 'scrape-output.json');
  writeFileSync(outputPath, JSON.stringify(data, null, 2));
  console.log(`\n✅ Scrape complete. Output: ${outputPath}`);
  console.log(`   Screenshots in: ${SCREENSHOTS_DIR}`);

  return data;
}

main().catch(console.error);
