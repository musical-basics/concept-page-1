/**
 * v2: Targeted scrape of the Shop mega menu on concept-theme-tech.myshopify.com
 * Uses more precise selectors and JS-based hover simulation.
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

  console.log('🌐 Navigating...');
  await page.goto(DEMO_URL, { waitUntil: 'networkidle', timeout: 45000 });
  await page.waitForTimeout(2000);

  // Step 1: Dump ALL text nodes in the main nav/header area only
  const headerInfo = await page.evaluate(() => {
    // Try to find header element
    const headers = [
      document.querySelector('header'),
      document.querySelector('#header'),
      document.querySelector('[class*="header"]'),
      document.querySelector('[role="banner"]'),
    ].filter(Boolean);

    const header = headers[0];
    if (!header) return { error: 'no header found', bodyClasses: document.body.className };

    // Get all anchor tags in the header
    const anchors = Array.from(header.querySelectorAll('a')).map(a => ({
      text: a.textContent.trim().slice(0, 50),
      href: a.href,
      className: a.className,
      id: a.id,
      rect: a.getBoundingClientRect(),
      parentClassName: a.parentElement?.className || '',
      parentTag: a.parentElement?.tagName || '',
    })).filter(a => a.rect.top < 200 && a.rect.height > 0 && a.rect.width > 0); // Only visible header area

    // Also get all clickable/interactive elements in the header in the top 120px
    const allHeaderEls = Array.from(header.querySelectorAll('*')).filter(el => {
      const r = el.getBoundingClientRect();
      return r.top >= 0 && r.top < 120 && r.height > 0 && r.width > 20;
    }).map(el => ({
      tag: el.tagName,
      text: el.textContent.trim().slice(0, 40),
      className: el.className,
      id: el.id,
      rect: el.getBoundingClientRect(),
    }));

    return {
      headerTag: header.tagName,
      headerClass: header.className,
      anchors,
      allEls: allHeaderEls.slice(0, 50),
      headerHTML: header.outerHTML.slice(0, 30000),
    };
  });

  writeFileSync(join(ROOT, 'scripts', 'header-info.json'), JSON.stringify(headerInfo, null, 2));
  console.log('💾 header-info.json');
  console.log('Header class:', headerInfo.headerClass);
  console.log('Visible header anchors:');
  (headerInfo.anchors || []).forEach(a => console.log(`  [${a.rect.x.toFixed(0)},${a.rect.y.toFixed(0)}] "${a.text}" class="${a.className.slice(0,50)}"`));

  await page.screenshot({ path: join(SS_DIR, 'mm2-01-baseline.png') });
  console.log('📸 mm2-01-baseline.png');

  // Step 2: Find the Shop nav item by coordinates or class and hover it
  // Look for nav items in the top ~80px with short text like "Shop"
  const shopAnchor = (headerInfo.anchors || []).find(a =>
    /^shop$/i.test(a.text) || a.text.toLowerCase().includes('shop')
  );

  if (shopAnchor) {
    console.log(`✅ Found Shop anchor at (${shopAnchor.rect.x}, ${shopAnchor.rect.y}): "${shopAnchor.text}"`);
    // Move mouse to the center of the Shop link
    const cx = shopAnchor.rect.x + shopAnchor.rect.width / 2;
    const cy = shopAnchor.rect.y + shopAnchor.rect.height / 2;
    await page.mouse.move(cx, cy);
    await page.waitForTimeout(1000);
    await page.screenshot({ path: join(SS_DIR, 'mm2-02-shop-hover.png') });
    console.log('📸 mm2-02-shop-hover.png');
  } else {
    console.log('⚠️ No Shop anchor found in visible header area. All anchors:', JSON.stringify(headerInfo.anchors?.slice(0,10)));
    // Fallback: try JS dispatch
    await page.evaluate(() => {
      const all = Array.from(document.querySelectorAll('a, button, [role="button"]'));
      const shop = all.find(el => {
        const r = el.getBoundingClientRect();
        return r.top < 120 && r.height > 0 && /shop/i.test(el.textContent.trim());
      });
      if (shop) {
        shop.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
        shop.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
      }
    });
    await page.waitForTimeout(800);
    await page.screenshot({ path: join(SS_DIR, 'mm2-02-shop-hover-fallback.png') });
    console.log('📸 mm2-02-shop-hover-fallback.png');
  }

  // Step 3: Extract ALL currently visible elements after hover
  const afterHover = await page.evaluate(() => {
    // Find all visible elements that appeared (in the header/dropdown area, below 60px from top)
    const els = [];
    document.querySelectorAll('*').forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.top >= 60 && r.top < 700 && r.height > 10 && r.width > 10 && el.offsetParent) {
        const style = window.getComputedStyle(el);
        if (style.display !== 'none' && style.visibility !== 'hidden' && parseFloat(style.opacity) > 0) {
          const tag = el.tagName;
          if (['UL', 'LI', 'NAV', 'DIV', 'SECTION', 'ASIDE'].includes(tag)) {
            const cls = el.className;
            if (typeof cls === 'string' && (
              cls.includes('menu') || cls.includes('dropdown') || cls.includes('mega') ||
              cls.includes('submenu') || cls.includes('nav') || cls.includes('header')
            )) {
              els.push({
                tag,
                className: cls.slice(0, 100),
                text: el.textContent.trim().slice(0, 200),
                rect: r,
                html: el.outerHTML.slice(0, 5000),
              });
            }
          }
        }
      }
    });
    return els.sort((a, b) => (b.rect.width * b.rect.height) - (a.rect.width * a.rect.height)).slice(0, 10);
  });

  writeFileSync(join(ROOT, 'scripts', 'after-hover.json'), JSON.stringify(afterHover, null, 2));
  console.log(`💾 after-hover.json (${afterHover.length} elements)`);
  afterHover.forEach(el => {
    console.log(`  ${el.tag}.${el.className.split(' ')[0]} [${el.rect.width.toFixed(0)}x${el.rect.height.toFixed(0)}] "${el.text.slice(0,60)}"`);
  });

  // Step 4: Get the full HTML of the biggest visible panel
  const panelHTML = await page.evaluate(() => {
    // Find the largest new element in the dropdown region (y: 60-700)
    let best = null, bestArea = 0;
    document.querySelectorAll('*').forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.top >= 60 && r.top < 300 && r.bottom < 750 && r.height > 150 && r.width > 400) {
        const area = r.width * r.height;
        if (area > bestArea) {
          const style = window.getComputedStyle(el);
          if (style.display !== 'none' && parseFloat(style.opacity) > 0.5) {
            bestArea = area;
            best = el;
          }
        }
      }
    });
    if (!best) return { error: 'no panel found' };
    const computed = window.getComputedStyle(best);
    return {
      tag: best.tagName,
      className: best.className,
      outerHTML: best.outerHTML.slice(0, 50000),
      computedStyle: {
        display: computed.display,
        gridTemplateColumns: computed.gridTemplateColumns,
        gridTemplateRows: computed.gridTemplateRows,
        flexDirection: computed.flexDirection,
        background: computed.background,
        backgroundColor: computed.backgroundColor,
        padding: computed.padding,
        gap: computed.gap,
        width: computed.width,
        maxWidth: computed.maxWidth,
        boxShadow: computed.boxShadow,
      },
    };
  });

  writeFileSync(join(ROOT, 'scripts', 'mega-panel.json'), JSON.stringify(panelHTML, null, 2));
  console.log('💾 mega-panel.json');

  // Step 5: Get all relevant CSS rules
  const relevantCSS = await page.evaluate(() => {
    const rules = [];
    for (const sheet of Array.from(document.styleSheets)) {
      try {
        for (const rule of Array.from(sheet.cssRules || [])) {
          if (rule.cssText && rule.cssText.length < 2000) {
            const text = rule.cssText.toLowerCase();
            if (text.includes('mega') || text.includes('dropdown') || text.includes('submenu') ||
                text.includes('header__menu') || text.includes('header__nav') || text.includes('site-nav') ||
                text.includes('header__link') || text.includes('header__item')) {
              rules.push(rule.cssText);
            }
          }
        }
      } catch (e) {}
    }
    return rules;
  });

  writeFileSync(join(ROOT, 'scripts', 'relevant-css.txt'), relevantCSS.join('\n\n'));
  console.log(`💾 relevant-css.txt (${relevantCSS.length} rules)`);

  // Step 6: Scroll slightly to see if it triggers the menu differently, then re-hover
  // Also try clicking on "Shop" nav tab within the mega menu to see the product grid
  await page.screenshot({ path: join(SS_DIR, 'mm2-03-panel.png'), clip: { x: 0, y: 0, width: 1440, height: 700 } });
  console.log('📸 mm2-03-panel.png');

  // Step 7: Try to click different category tabs
  const tabs = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('[class*="mega"] button, [class*="mega"] [role="tab"], [class*="dropdown"] button'))
      .filter(el => el.getBoundingClientRect().height > 0)
      .map(el => ({
        text: el.textContent.trim(),
        rect: el.getBoundingClientRect(),
        className: el.className,
      }));
  });
  console.log('Mega menu tabs/buttons:', tabs.map(t => t.text));

  // Get the full header HTML for analysis
  const fullHTML = await page.evaluate(() => {
    const h = document.querySelector('header') || document.querySelector('[role="banner"]');
    return h ? h.outerHTML : document.body.outerHTML.slice(0, 100000);
  });
  writeFileSync(join(ROOT, 'scripts', 'full-header.html'), fullHTML);
  console.log(`💾 full-header.html (${fullHTML.length} chars)`);

  await browser.close();
  console.log('\n✅ Done!');
}

main().catch(err => {
  console.error('ERROR:', err.message);
  process.exit(1);
});
