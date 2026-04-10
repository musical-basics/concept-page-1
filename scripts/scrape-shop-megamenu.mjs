/**
 * Scrape the Shop mega menu from the Concept theme demo.
 * Hovers over "Shop" in the header, captures screenshots + full structure/CSS.
 */
import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SS_DIR = join(ROOT, 'screenshots');
mkdirSync(SS_DIR, { recursive: true });

const DEMO_URL = 'https://concept-theme-tech.myshopify.com/';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  });
  const page = await ctx.newPage();

  console.log('🌐 Navigating to', DEMO_URL);
  await page.goto(DEMO_URL, { waitUntil: 'networkidle', timeout: 45000 });
  await page.waitForTimeout(2000);

  // Screenshot: baseline header
  await page.screenshot({ path: join(SS_DIR, 'mega-01-baseline.png'), fullPage: false });
  console.log('📸 mega-01-baseline.png');

  // Find the Shop nav link and hover it
  // The Concept theme uses a "Shop" link in the header nav
  const shopLink = await page.locator('header a, .header__navigation a, .site-nav a, nav a').filter({ hasText: /^shop$/i }).first();

  let shopExists = false;
  try {
    await shopLink.waitFor({ timeout: 5000 });
    shopExists = true;
  } catch (e) {
    console.log('⚠️  Could not find Shop nav link by filter, trying broader selectors...');
  }

  if (!shopExists) {
    // Try a broader approach
    const allNavLinks = await page.locator('header a, nav a').allTextContents();
    console.log('Nav links found:', allNavLinks);
  }

  // Hover over the Shop link
  try {
    await shopLink.hover();
    console.log('✅ Hovering over Shop link');
    await page.waitForTimeout(800);
  } catch (e) {
    // Try by text
    const byText = page.getByText(/shop/i).first();
    await byText.hover();
    await page.waitForTimeout(800);
  }

  // Screenshot: mega menu open
  await page.screenshot({ path: join(SS_DIR, 'mega-02-menu-open.png'), fullPage: false });
  console.log('📸 mega-02-menu-open.png');

  // Extract the mega menu HTML structure
  const megaMenuData = await page.evaluate(() => {
    // Find all possible mega menu containers
    const selectors = [
      '[class*="mega"]',
      '[class*="dropdown"]',
      '[class*="submenu"]',
      '[class*="nav-menu"]',
      '[class*="header__submenu"]',
      '[class*="header__mega"]',
      'details[open]',
      '[aria-expanded="true"]',
      '.header__menu-item--active',
    ];

    let megaEl = null;
    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (el && el.offsetParent !== null) {
        megaEl = el;
        break;
      }
    }

    // Also get all currently visible large menus
    const allVisible = [];
    document.querySelectorAll('*').forEach(el => {
      if (el.offsetParent !== null && el.getBoundingClientRect().height > 200) {
        const cls = el.className;
        if (typeof cls === 'string' && (cls.includes('menu') || cls.includes('dropdown') || cls.includes('mega') || cls.includes('nav'))) {
          allVisible.push({
            tag: el.tagName,
            className: el.className,
            id: el.id,
            rect: el.getBoundingClientRect(),
          });
        }
      }
    });

    // Get the full header HTML
    const header = document.querySelector('header') || document.querySelector('#header') || document.querySelector('[class*="header"]');

    return {
      headerHTML: header ? header.outerHTML.slice(0, 20000) : 'not found',
      megaEl: megaEl ? {
        tag: megaEl.tagName,
        className: megaEl.className,
        html: megaEl.outerHTML.slice(0, 10000),
      } : null,
      allVisibleLargeMenus: allVisible.slice(0, 10),
    };
  });

  writeFileSync(join(ROOT, 'scripts', 'mega-menu-html.json'), JSON.stringify(megaMenuData, null, 2));
  console.log('💾 mega-menu-html.json written');

  // Now try to find the mega menu by looking at what's visible after hover
  const megaMenuVisible = await page.evaluate(() => {
    // Look for the opened submenu
    const candidates = [
      ...document.querySelectorAll('[class*="header__submenu"]'),
      ...document.querySelectorAll('[class*="mega-menu"]'),
      ...document.querySelectorAll('[class*="megamenu"]'),
      ...document.querySelectorAll('details[open] > *:not(summary)'),
      ...document.querySelectorAll('[data-menu-open]'),
    ];

    const visible = candidates.filter(el => {
      const r = el.getBoundingClientRect();
      return r.height > 50 && r.width > 100;
    });

    return visible.map(el => ({
      tag: el.tagName,
      className: el.className,
      innerText: el.innerText.slice(0, 500),
      html: el.outerHTML.slice(0, 8000),
      rect: el.getBoundingClientRect(),
    }));
  });

  console.log(`Found ${megaMenuVisible.length} visible mega menu candidates`);

  // Capture full page structure around the header area
  const headerArea = await page.screenshot({
    path: join(SS_DIR, 'mega-03-header-area.png'),
    clip: { x: 0, y: 0, width: 1440, height: 700 },
  });
  console.log('📸 mega-03-header-area.png');

  // Get all CSS for visible elements in the header region
  const cssData = await page.evaluate(() => {
    const results = {};
    // Collect all stylesheets
    const allRules = [];
    for (const sheet of Array.from(document.styleSheets)) {
      try {
        for (const rule of Array.from(sheet.cssRules || [])) {
          if (rule.selectorText && (
            rule.selectorText.includes('mega') ||
            rule.selectorText.includes('header__sub') ||
            rule.selectorText.includes('nav-menu') ||
            rule.selectorText.includes('header__menu') ||
            rule.selectorText.includes('dropdown') ||
            rule.selectorText.includes('header__link')
          )) {
            allRules.push({
              selector: rule.selectorText,
              css: rule.cssText.slice(0, 1000),
            });
          }
        }
      } catch (e) {}
    }
    return allRules;
  });

  writeFileSync(join(ROOT, 'scripts', 'mega-menu-css.json'), JSON.stringify({ css: cssData, visible: megaMenuVisible }, null, 2));
  console.log('💾 mega-menu-css.json written');

  // Try the Shopify-specific approach: hover using JS
  // First, get the header HTML to understand the structure
  const fullHeaderHTML = await page.evaluate(() => {
    const header = document.querySelector('header');
    return header ? header.innerHTML : '';
  });

  writeFileSync(join(ROOT, 'scripts', 'header-html.txt'), fullHeaderHTML.slice(0, 100000));
  console.log('💾 header-html.txt written');

  // Try hovering over specific Shopify theme classes
  try {
    // Concept theme typically uses "header__menu-item" for nav items
    const shopItems = await page.locator('[class*="header__menu-item"], [class*="header__nav-item"], [class*="site-nav__item"]').all();
    console.log(`Found ${shopItems.length} header menu items`);

    for (let i = 0; i < Math.min(shopItems.length, 5); i++) {
      const text = await shopItems[i].textContent();
      console.log(`  Item ${i}: "${text?.trim().slice(0, 30)}"`);
    }
  } catch (e) {
    console.log('Could not enumerate header items:', e.message);
  }

  // Take one more screenshot with the hover still active
  await page.screenshot({ path: join(SS_DIR, 'mega-04-final.png'), fullPage: false });
  console.log('📸 mega-04-final.png');

  // Get computed styles of the mega menu panel
  const computedStyles = await page.evaluate(() => {
    // Find the largest visible panel in the top 500px of the page
    let bestEl = null;
    let bestArea = 0;

    document.querySelectorAll('*').forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.top > 40 && r.top < 200 && r.height > 100 && r.width > 400) {
        const area = r.width * r.height;
        if (area > bestArea) {
          bestArea = area;
          bestEl = el;
        }
      }
    });

    if (!bestEl) return null;

    const computed = window.getComputedStyle(bestEl);
    return {
      tag: bestEl.tagName,
      className: bestEl.className,
      background: computed.background,
      backgroundColor: computed.backgroundColor,
      padding: computed.padding,
      display: computed.display,
      gridTemplateColumns: computed.gridTemplateColumns,
      width: computed.width,
      maxWidth: computed.maxWidth,
      boxShadow: computed.boxShadow,
      borderRadius: computed.borderRadius,
      html: bestEl.outerHTML.slice(0, 15000),
    };
  });

  writeFileSync(join(ROOT, 'scripts', 'mega-computed.json'), JSON.stringify(computedStyles, null, 2));
  console.log('💾 mega-computed.json written');

  await browser.close();
  console.log('\n✅ Done. Check screenshots/ and scripts/ for output files.');
}

main().catch(console.error);
