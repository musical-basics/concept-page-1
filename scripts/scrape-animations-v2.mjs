/**
 * Playwright scraper v2 — targets the EMBEDDED IFRAME preview on
 * themes.shopify.com and navigates its frame context directly.
 * Also tries alternate Shopify theme preview URL patterns.
 */

import { chromium } from 'playwright';
import { writeFileSync, mkdirSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SCREENSHOTS_DIR = join(ROOT, 'screenshots');
mkdirSync(SCREENSHOTS_DIR, { recursive: true });

const ENTRY_URL = 'https://themes.shopify.com/themes/concept/presets/concept';

async function ss(page, name) {
  await page.screenshot({ path: join(SCREENSHOTS_DIR, `${name}.png`), fullPage: false });
  console.log(`  📸 ${name}.png`);
}
async function ssFull(page, name) {
  await page.screenshot({ path: join(SCREENSHOTS_DIR, `${name}.png`), fullPage: true });
  console.log(`  📸 ${name}.png (full)`);
}

async function getAllKeyframes(page) {
  return page.evaluate(() => {
    const results = {};
    for (const sheet of Array.from(document.styleSheets)) {
      try {
        for (const rule of Array.from(sheet.cssRules || [])) {
          if (rule.constructor.name === 'CSSKeyframesRule' || rule.type === 7) {
            results[rule.name] = Array.from(rule.cssRules || []).map(r => ({
              keyText: r.keyText,
              cssText: r.cssText.slice(0, 400),
            }));
          }
        }
      } catch (e) {}
    }
    return results;
  });
}

async function getAllTransitionRules(page) {
  return page.evaluate(() => {
    const results = [];
    for (const sheet of Array.from(document.styleSheets)) {
      try {
        for (const rule of Array.from(sheet.cssRules || [])) {
          if (rule.type === 1) { // CSSStyleRule
            const t = rule.style.transition;
            const a = rule.style.animation;
            if ((t && t !== 'none') || (a && a !== 'none')) {
              results.push({
                selector: rule.selectorText?.slice(0, 120),
                transition: t || null,
                animation: a || null,
                transform: rule.style.transform || null,
                opacity: rule.style.opacity || null,
                filter: rule.style.filter || null,
                willChange: rule.style.willChange || null,
              });
            }
          }
        }
      } catch (e) {}
    }
    return results;
  });
}

async function getScrollRevealElements(page) {
  return page.evaluate(() => {
    const results = [];
    // Shopify Concept theme uses motion-reduce and custom scroll classes
    const patterns = [
      '[data-animate]', '[data-motion]', '[data-scroll]', '[data-aos]',
      '[class*="animate"]', '[class*="reveal"]', '[class*="motion"]',
      '[class*="scroll-trigger"]', '[class*="in-view"]',
      '[class*="appear"]', '[class*="enter"]',
      '[style*="opacity: 0"]', '[style*="opacity:0"]',
      '[style*="translateY"]', '[style*="translateX"]',
    ];
    const seen = new Set();
    for (const pat of patterns) {
      try {
        document.querySelectorAll(pat).forEach(el => {
          if (seen.has(el)) return;
          seen.add(el);
          const s = getComputedStyle(el);
          results.push({
            pattern: pat,
            tag: el.tagName,
            id: el.id,
            classes: el.className.toString().slice(0, 120),
            style: el.getAttribute('style')?.slice(0, 120),
            computedOpacity: s.opacity,
            computedTransform: s.transform,
            computedTransition: s.transition,
            computedAnimation: s.animation,
            dataAttrs: Array.from(el.attributes)
              .filter(a => a.name.startsWith('data-'))
              .map(a => `${a.name}="${a.value}"`)
              .join(' ').slice(0, 100),
          });
        });
      } catch (e) {}
    }
    return results;
  });
}

async function captureHoverEffect(page, selector, label) {
  try {
    const el = await page.locator(selector).first();
    if (await el.count() === 0) return { label, found: false };

    const before = await el.evaluate(e => {
      const s = getComputedStyle(e);
      return { opacity: s.opacity, transform: s.transform, transition: s.transition, background: s.backgroundColor, color: s.color, boxShadow: s.boxShadow, filter: s.filter };
    });

    await el.hover({ force: true });
    await page.waitForTimeout(350);

    const after = await el.evaluate(e => {
      const s = getComputedStyle(e);
      return { opacity: s.opacity, transform: s.transform, transition: s.transition, background: s.backgroundColor, color: s.color, boxShadow: s.boxShadow, filter: s.filter };
    });

    const changed = JSON.stringify(before) !== JSON.stringify(after);
    return { label, found: true, changed, before, after };
  } catch (e) {
    return { label, found: false, error: e.message.slice(0, 100) };
  }
}

// ── main ────────────────────────────────────────────────────────────────────

async function main() {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    ignoreHTTPSErrors: true,
  });

  const data = {
    meta: { scrapedAt: new Date().toISOString() },
    successUrl: null,
    keyframes: {},
    transitionRules: [],
    scrollRevealElements: [],
    hoverEffects: [],
    sectionAnimations: {},
    jsLibraries: [],
    mobileMenu: {},
    rawNotes: [],
  };

  const page = await ctx.newPage();

  // ── Step 1: Load themes.shopify.com and find the embedded preview ──────────
  console.log('🌐 Loading Shopify themes page…');
  await page.goto(ENTRY_URL, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);
  await ss(page, 'v2-01-themes-page');

  // Extract the iframe src or any preview URL
  const previewInfo = await page.evaluate(() => {
    const iframes = Array.from(document.querySelectorAll('iframe'));
    const links = Array.from(document.querySelectorAll('a[href*="myshopify"], a[href*="preview"], a[href*="demo"]'));
    const buttons = Array.from(document.querySelectorAll('button, a')).filter(el =>
      el.textContent.trim().toLowerCase().includes('demo') ||
      el.textContent.trim().toLowerCase().includes('preview')
    );
    return {
      iframes: iframes.map(i => ({ src: i.src, id: i.id, class: i.className })),
      demoLinks: links.map(l => ({ href: l.href, text: l.textContent.trim().slice(0, 50) })),
      demoButtons: buttons.map(b => ({
        tag: b.tagName,
        text: b.textContent.trim().slice(0, 50),
        href: b.href,
        onclick: b.getAttribute('onclick'),
        dataAttrs: Array.from(b.attributes).filter(a => a.name.startsWith('data-')).map(a => `${a.name}="${a.value}"`).join(' '),
      })),
    };
  });
  data.rawNotes.push({ step: 'previewInfo', data: previewInfo });
  console.log('  Iframes:', previewInfo.iframes.length);
  console.log('  Demo links:', previewInfo.demoLinks.map(l => l.href).join(', '));
  console.log('  Demo buttons:', previewInfo.demoButtons.map(b => `${b.tag}: ${b.text}`).join(', '));

  // ── Step 2: Try to access the theme inside the iframe ─────────────────────
  let demoPage = null;

  // If there's an iframe with the theme, switch to it
  if (previewInfo.iframes.length > 0) {
    const iframeSrc = previewInfo.iframes[0].src;
    console.log(`\n🖼  Found iframe: ${iframeSrc}`);
    if (iframeSrc && iframeSrc.startsWith('http')) {
      try {
        await page.goto(iframeSrc, { waitUntil: 'networkidle', timeout: 20000 });
        await page.waitForTimeout(2000);
        data.successUrl = iframeSrc;
        console.log('  ✓ Navigated to iframe src');
        await ss(page, 'v2-02-iframe-src');
      } catch (e) {
        console.log('  iframe navigation failed:', e.message.slice(0, 80));
      }
    }
  }

  // ── Step 3: Try "View demo" click more aggressively ────────────────────────
  if (!data.successUrl || data.successUrl.includes('password')) {
    console.log('\n🖱  Trying to click View demo more aggressively…');
    await page.goto(ENTRY_URL, { waitUntil: 'domcontentloaded', timeout: 20000 });
    await page.waitForTimeout(3000);

    // Look for the View demo button / link using page evaluation
    const viewDemoHref = await page.evaluate(() => {
      const candidates = [
        ...document.querySelectorAll('a'),
        ...document.querySelectorAll('button'),
      ];
      for (const el of candidates) {
        const text = el.textContent.trim().toLowerCase();
        if (text === 'view demo' || text === 'preview' || text === 'view preview') {
          return {
            tag: el.tagName,
            href: el.href || el.getAttribute('href'),
            text: el.textContent.trim(),
            parent: el.parentElement?.className,
          };
        }
      }
      return null;
    });
    console.log('  View demo element:', JSON.stringify(viewDemoHref));
    data.rawNotes.push({ step: 'viewDemoElement', data: viewDemoHref });

    if (viewDemoHref?.href) {
      try {
        await page.goto(viewDemoHref.href, { waitUntil: 'networkidle', timeout: 20000 });
        await page.waitForTimeout(2000);
        const title = await page.title();
        console.log(`  Navigated to: ${page.url()} (${title})`);
        if (!title.toLowerCase().includes('password')) {
          data.successUrl = page.url();
        }
      } catch (e) {
        console.log('  Navigation failed:', e.message.slice(0, 80));
      }
    }
  }

  // ── Step 4: Try known Shopify theme preview URL patterns ──────────────────
  const alternativeUrls = [
    'https://themes.shopify.com/themes/concept/styles/concept/preview',
    'https://concept-demo.myshopify.com/?preview_theme_id=concept',
    'https://concept-theme-demo.myshopify.com/',
    'https://shopify-concept.myshopify.com/',
  ];

  for (const url of alternativeUrls) {
    if (data.successUrl) break;
    console.log(`\n🌐 Trying: ${url}`);
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
      await page.waitForTimeout(2000);
      const title = await page.title();
      const currentUrl = page.url();
      console.log(`  → ${currentUrl} | "${title}"`);

      // Check if we got something useful (not just a password page or error)
      const isPasswordPage = await page.evaluate(() => {
        return document.body.textContent.includes('password') &&
               document.querySelector('input[type="password"]') !== null;
      });

      if (!isPasswordPage) {
        data.successUrl = currentUrl;
        console.log('  ✓ Accessible!');
        await ss(page, 'v2-03-accessible-url');
        break;
      } else {
        console.log('  ✗ Password protected');
      }
    } catch (e) {
      console.log('  ✗ Failed:', e.message.slice(0, 60));
    }
  }

  // ── Step 5: Work from the themes.shopify.com iframe preview ───────────────
  // The theme preview on themes.shopify.com IS the demo, just in an iframe
  // Let's scrape the actual iframe content by switching frame context
  console.log('\n🖼  Trying iframe frame context approach…');
  await page.goto(ENTRY_URL, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);

  const frames = page.frames();
  console.log(`  Found ${frames.length} frames`);
  frames.forEach((f, i) => console.log(`    [${i}] ${f.url().slice(0, 100)}`));

  let targetFrame = null;
  for (const frame of frames) {
    const url = frame.url();
    if (url.includes('myshopify') || url.includes('shopify') && url !== ENTRY_URL && !url.includes('themes.shopify.com/themes/concept/presets/concept')) {
      targetFrame = frame;
      console.log(`  ✓ Using frame: ${url}`);
      data.successUrl = url;
      break;
    }
  }

  // If we found a useful frame, extract from it
  if (targetFrame && !targetFrame.url().includes('password')) {
    console.log('\n📋 Extracting from iframe frame…');

    try {
      data.keyframes = await targetFrame.evaluate(() => {
        const results = {};
        for (const sheet of Array.from(document.styleSheets)) {
          try {
            for (const rule of Array.from(sheet.cssRules || [])) {
              if (rule.type === 7) {
                results[rule.name] = Array.from(rule.cssRules || []).map(r => ({
                  keyText: r.keyText,
                  cssText: r.cssText.slice(0, 400),
                }));
              }
            }
          } catch (e) {}
        }
        return results;
      });
      console.log(`  @keyframes: ${Object.keys(data.keyframes).length}`);

      data.transitionRules = await targetFrame.evaluate(() => {
        const results = [];
        for (const sheet of Array.from(document.styleSheets)) {
          try {
            for (const rule of Array.from(sheet.cssRules || [])) {
              if (rule.type === 1) {
                const t = rule.style.transition;
                const a = rule.style.animation;
                if ((t && t !== 'none') || (a && a !== 'none')) {
                  results.push({
                    selector: rule.selectorText?.slice(0, 120),
                    transition: t || null,
                    animation: a || null,
                    transform: rule.style.transform || null,
                    opacity: rule.style.opacity || null,
                    willChange: rule.style.willChange || null,
                  });
                }
              }
            }
          } catch (e) {}
        }
        return results;
      });
      console.log(`  Transition rules: ${data.transitionRules.length}`);

      data.jsLibraries = await targetFrame.evaluate(() => {
        const detected = [];
        if (window.gsap || window.TweenMax) detected.push('GSAP');
        if (window.AOS) detected.push('AOS');
        if (window.Swiper) detected.push('Swiper');
        if (window.Splide) detected.push('Splide');
        if (window.lenis) detected.push('Lenis');
        const scripts = Array.from(document.querySelectorAll('script[src]')).map(s => s.src.slice(0, 100));
        return { detected, scripts: scripts.slice(0, 15) };
      });

      data.scrollRevealElements = await targetFrame.evaluate(() => {
        const results = [];
        const seen = new Set();
        const patterns = [
          '[data-animate]', '[data-motion]', '[data-scroll]', '[data-aos]', '[data-section-type]',
          '[class*="animate"]', '[class*="reveal"]', '[class*="motion"]', '[class*="in-view"]',
          '[style*="opacity: 0"]', '[style*="opacity:0"]', '[style*="translateY"]',
        ];
        for (const pat of patterns) {
          document.querySelectorAll(pat).forEach(el => {
            if (seen.has(el)) return;
            seen.add(el);
            const s = getComputedStyle(el);
            results.push({
              pattern: pat,
              tag: el.tagName,
              classes: el.className.toString().slice(0, 120),
              style: el.getAttribute('style')?.slice(0, 120),
              computedOpacity: s.opacity,
              computedTransform: s.transform,
              computedTransition: s.transition.slice(0, 150),
              computedAnimation: s.animation.slice(0, 150),
              dataAttrs: Array.from(el.attributes).filter(a => a.name.startsWith('data-')).map(a => `${a.name}="${a.value}"`).join(' ').slice(0, 150),
            });
          });
        }
        return results;
      });
      console.log(`  Scroll-reveal elements: ${data.scrollRevealElements.length}`);

      // Section layout in the frame
      const sections = await targetFrame.evaluate(() => {
        return Array.from(document.querySelectorAll('[data-section-type], section, [class*="section"]')).slice(0, 25).map(el => ({
          tag: el.tagName,
          id: el.id,
          classes: el.className.toString().slice(0, 100),
          sectionType: el.getAttribute('data-section-type'),
          dataAttrs: Array.from(el.attributes).filter(a => a.name.startsWith('data-')).map(a => `${a.name}="${a.value}"`).join(' ').slice(0, 200),
        }));
      });
      data.sectionAnimations.sectionLayout = sections;
      console.log(`  Sections: ${sections.length}`);
      sections.forEach(s => console.log(`    - ${s.sectionType || s.classes.split(' ')[0]}`));

      // Full-page screenshot of the frame content
      // Navigate to the frame URL directly for full scraping
      if (data.successUrl && !data.successUrl.includes('password')) {
        await page.goto(data.successUrl, { waitUntil: 'networkidle', timeout: 20000 });
        await page.waitForTimeout(3000);
        await ssFull(page, 'v2-04-frame-full');

        // Now scrape this page more deeply
        console.log('\n🔬 Deep scraping the demo page…');
        data.keyframes = await getAllKeyframes(page);
        data.transitionRules = await getAllTransitionRules(page);
        data.scrollRevealElements = await getScrollRevealElements(page);

        console.log(`  @keyframes: ${Object.keys(data.keyframes).length} → ${Object.keys(data.keyframes).join(', ')}`);
        console.log(`  Transition rules: ${data.transitionRules.length}`);
        console.log(`  Scroll-reveal elements: ${data.scrollRevealElements.length}`);

        // Scroll through
        const pageH = await page.evaluate(() => document.body.scrollHeight);
        console.log(`  Page height: ${pageH}px`);

        for (const y of [0, 500, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000]) {
          if (y > pageH + 500) break;
          await page.evaluate((yy) => window.scrollTo(0, yy), y);
          await page.waitForTimeout(600);
          if (y % 1000 === 0) await ss(page, `v2-scroll-${y}`);
        }
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.waitForTimeout(500);

        // Hover effects
        console.log('\n🖱  Hover effects…');
        const hoverTargets = [
          { sel: 'header nav a, .header__nav a', label: 'Nav link' },
          { sel: '[class*="hero"] a, [class*="hero"] .button, [class*="slideshow"] .button', label: 'Hero CTA' },
          { sel: '[class*="product-card"], [class*="card--product"]', label: 'Product card' },
          { sel: '[class*="product-card"] img, [class*="card"] img', label: 'Product card image' },
          { sel: '.button, a.button, button[class*="button"]', label: 'Button' },
          { sel: '[class*="swatch"]', label: 'Color swatch' },
          { sel: '[class*="quick-add"], [class*="quick_add"]', label: 'Quick add' },
          { sel: 'footer a', label: 'Footer link' },
          { sel: '[class*="collection-card"], [class*="featured-collection"]', label: 'Collection card' },
          { sel: '[class*="blog"] [class*="card"], [class*="article"]', label: 'Blog card' },
        ];
        for (const t of hoverTargets) {
          const res = await captureHoverEffect(page, t.sel, t.label);
          data.hoverEffects.push(res);
          if (res.found) {
            console.log(`  ${res.changed ? '✅' : '·'} ${t.label}: ${res.changed ? 'ANIMATED' : 'static'}`);
            if (res.changed) {
              console.log(`     transition: ${res.after?.transition?.slice(0, 80) || 'n/a'}`);
              if (res.before?.transform !== res.after?.transform) console.log(`     transform: ${res.before?.transform} → ${res.after?.transform}`);
              if (res.before?.opacity !== res.after?.opacity) console.log(`     opacity: ${res.before?.opacity} → ${res.after?.opacity}`);
            }
          }
        }

        // Mobile check
        console.log('\n📱 Mobile viewport…');
        await page.setViewportSize({ width: 375, height: 812 });
        await page.waitForTimeout(500);
        await ss(page, 'v2-mobile');

        const mobileData = await page.evaluate(() => {
          const burger = document.querySelector('[class*="burger"], [class*="hamburger"], [class*="menu-icon"], [class*="nav-toggle"], [aria-label*="menu"], [aria-controls*="menu"]');
          const drawer = document.querySelector('[class*="drawer"], [class*="mobile-nav"], [class*="side-nav"], [class*="menu-drawer"]');
          return {
            burger: burger ? {
              classes: burger.className.toString(),
              transition: getComputedStyle(burger).transition,
              display: getComputedStyle(burger).display,
            } : null,
            drawer: drawer ? {
              classes: drawer.className.toString(),
              transition: getComputedStyle(drawer).transition,
              transform: getComputedStyle(drawer).transform,
              visibility: getComputedStyle(drawer).visibility,
              opacity: getComputedStyle(drawer).opacity,
              position: getComputedStyle(drawer).position,
            } : null,
          };
        });
        data.mobileMenu = mobileData;

        await page.setViewportSize({ width: 1440, height: 900 });
      }
    } catch (e) {
      console.log('  Frame extraction error:', e.message.slice(0, 100));
    }
  }

  // ── Fallback: Scrape themes.shopify.com page's own CSS ───────────────────
  // The iframe preview at themes.shopify.com DOES load the theme CSS
  // Let's also check what the preview iframe shows
  console.log('\n🔄 Fallback: re-scraping themes.shopify.com preview…');
  await page.goto(ENTRY_URL, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);

  // Find and switch to the preview iframe
  const allFrames = page.frames();
  console.log(`  Total frames: ${allFrames.length}`);
  for (const f of allFrames) {
    console.log(`    Frame: ${f.url().slice(0, 120)}`);
  }

  // Try each non-parent frame
  for (const frame of allFrames) {
    if (frame === page.mainFrame()) continue;
    const frameUrl = frame.url();
    if (!frameUrl || frameUrl === 'about:blank') continue;

    console.log(`\n🔬 Scraping frame: ${frameUrl.slice(0, 100)}`);

    try {
      const frameKeyframes = await frame.evaluate(() => {
        const results = {};
        for (const sheet of Array.from(document.styleSheets)) {
          try {
            for (const rule of Array.from(sheet.cssRules || [])) {
              if (rule.type === 7) {
                results[rule.name] = Array.from(rule.cssRules || []).map(r => ({
                  keyText: r.keyText,
                  cssText: r.cssText.slice(0, 400),
                }));
              }
            }
          } catch (e) {}
        }
        return results;
      });

      if (Object.keys(frameKeyframes).length > 0) {
        console.log(`  ✓ Found ${Object.keys(frameKeyframes).length} @keyframes in this frame!`);
        data.keyframes = { ...data.keyframes, ...frameKeyframes };
      }

      const frameTransitions = await frame.evaluate(() => {
        const results = [];
        for (const sheet of Array.from(document.styleSheets)) {
          try {
            for (const rule of Array.from(sheet.cssRules || [])) {
              if (rule.type === 1) {
                const t = rule.style.transition;
                const a = rule.style.animation;
                if ((t && t !== 'none') || (a && a !== 'none')) {
                  results.push({
                    selector: rule.selectorText?.slice(0, 120),
                    transition: t || null,
                    animation: a || null,
                    transform: rule.style.transform || null,
                    opacity: rule.style.opacity || null,
                    willChange: rule.style.willChange || null,
                    filter: rule.style.filter || null,
                  });
                }
              }
            }
          } catch (e) {}
        }
        return results;
      });

      if (frameTransitions.length > 0) {
        console.log(`  ✓ Found ${frameTransitions.length} transition rules in this frame!`);
        data.transitionRules = [...data.transitionRules, ...frameTransitions];
      }

      // Get sections & reveal elements
      const frameSections = await frame.evaluate(() => {
        return Array.from(document.querySelectorAll('[data-section-type], section, [class*="section--"]')).slice(0, 20).map(el => ({
          sectionType: el.getAttribute('data-section-type'),
          id: el.id,
          classes: el.className.toString().slice(0, 100),
          dataAttrs: Array.from(el.attributes).filter(a => a.name.startsWith('data-')).map(a => `${a.name}="${a.value}"`).join(' ').slice(0, 200),
        }));
      });
      if (frameSections.length > 0) {
        console.log(`  ✓ Found ${frameSections.length} sections`);
        data.sectionAnimations.frameSections = frameSections;
        frameSections.forEach(s => console.log(`    - [${s.sectionType || 'no-type'}] ${s.classes.split(' ')[0]}`));
      }

      // JS libraries in frame
      const frameLibs = await frame.evaluate(() => {
        const detected = [];
        if (window.gsap || window.TweenMax) detected.push('GSAP');
        if (window.AOS) detected.push('AOS');
        if (window.Swiper) detected.push('Swiper');
        if (window.Splide) detected.push('Splide');
        if (window.Flickity || window.flickity) detected.push('Flickity');
        if (window.lenis) detected.push('Lenis');
        if (window.ScrollTrigger) detected.push('ScrollTrigger');
        const scripts = Array.from(document.querySelectorAll('script[src]')).map(s => s.src.slice(0, 100));
        const bodyScripts = Array.from(document.querySelectorAll('script:not([src])')).map(s => s.textContent.slice(0, 200));
        return { detected, scripts, bodyScripts: bodyScripts.slice(0, 5) };
      });
      if (frameLibs.detected.length > 0 || frameLibs.scripts.length > 0) {
        console.log(`  Libraries: ${frameLibs.detected.join(', ') || 'none detected'}`);
        console.log(`  Scripts: ${frameLibs.scripts.slice(0, 5).join(', ')}`);
        data.jsLibraries = frameLibs;
      }

      // Scroll-reveal elements in frame
      const frameReveal = await frame.evaluate(() => {
        const results = [];
        const patterns = [
          '[data-animate]', '[data-motion]', '[data-scroll-reveal]',
          '[class*="animate"]', '[class*="reveal"]', '[class*="motion"]',
          '[style*="opacity: 0"]', '[style*="translateY"]',
        ];
        const seen = new Set();
        for (const pat of patterns) {
          document.querySelectorAll(pat).forEach(el => {
            if (seen.has(el)) return;
            seen.add(el);
            const s = getComputedStyle(el);
            results.push({
              pattern: pat,
              tag: el.tagName,
              classes: el.className.toString().slice(0, 100),
              style: el.getAttribute('style')?.slice(0, 100),
              computedOpacity: s.opacity,
              computedTransform: s.transform,
              computedTransition: s.transition.slice(0, 120),
              dataAttrs: Array.from(el.attributes).filter(a => a.name.startsWith('data-')).map(a => `${a.name}="${a.value}"`).join(' ').slice(0, 100),
            });
          });
        }
        return results;
      });
      if (frameReveal.length > 0) {
        console.log(`  ✓ Found ${frameReveal.length} scroll-reveal elements`);
        data.scrollRevealElements = [...data.scrollRevealElements, ...frameReveal];
      }

      // Take screenshot of frame
      await frame.evaluate(() => {
        try { window.scrollTo(0, 0); } catch (e) {}
      });
      data.successUrl = frameUrl;

    } catch (e) {
      console.log(`  Error in frame: ${e.message.slice(0, 80)}`);
    }
  }

  // ── Final summary ──────────────────────────────────────────────────────────
  console.log('\n📊 Summary:');
  console.log(`  Success URL: ${data.successUrl || 'N/A'}`);
  console.log(`  @keyframes: ${Object.keys(data.keyframes).length} → [${Object.keys(data.keyframes).join(', ')}]`);
  console.log(`  Transition rules: ${data.transitionRules.length}`);
  console.log(`  Scroll-reveal elements: ${data.scrollRevealElements.length}`);
  console.log(`  Hover effects tested: ${data.hoverEffects.length}`);
  console.log(`  JS libraries: ${(Array.isArray(data.jsLibraries) ? data.jsLibraries : data.jsLibraries?.detected || []).join(', ') || 'none'}`);

  const outputPath = join(ROOT, 'scripts', 'scrape-output-v2.json');
  writeFileSync(outputPath, JSON.stringify(data, null, 2));
  console.log(`\n✅ Output: ${outputPath}`);

  await browser.close();
  return data;
}

main().catch(console.error);
