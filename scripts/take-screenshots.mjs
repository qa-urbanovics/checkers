/**
 * App Store screenshot generator
 * Usage: node scripts/take-screenshots.mjs
 */

import { chromium } from 'playwright';
import { mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(fileURLToPath(import.meta.url), '..', '..');
const BASE = 'http://localhost:5178';

const DEVICES = [
  { id: 'iphone67', cssW: 430,  cssH: 932,  scale: 3 },
  { id: 'ipad129',  cssW: 1024, cssH: 1366, scale: 2 },
];

const wait = ms => new Promise(r => setTimeout(r, ms));

async function shot(page, path) {
  await wait(500);
  await page.screenshot({ path, fullPage: false });
  console.log('  ✓', path.split('/').slice(-1)[0]);
}

async function clickAny(page, texts, timeout = 4000) {
  for (const t of texts) {
    try {
      await page.locator(`text="${t}"`).first().click({ timeout });
      await wait(450);
      return true;
    } catch { /* try next */ }
  }
  // Last resort: partial text
  for (const t of texts) {
    try {
      await page.getByText(t, { exact: false }).first().click({ timeout: 2000 });
      await wait(450);
      return true;
    } catch { /* skip */ }
  }
  return false;
}

async function navigateToGame(page) {
  // 1. Click NEW GAME
  await clickAny(page, ['NEW GAME', 'НОВАЯ ИГРА', 'NUEVA PARTIDA']);
  // 2. Click 1 vs 1 mode
  await clickAny(page, ['1 vs 1']);
  // 3. Click 8×8 board — the card contains "8 × 8"
  await clickAny(page, ['8 × 8', '8×8', '8 x 8']);
  // Game should now be visible
  await wait(600);
}

async function selectPiece(page) {
  // Click first red piece in the bottom half of the board
  const clicked = await page.evaluate(() => {
    const allDivs = [...document.querySelectorAll('div')];
    // Find board: container whose children are rows, each row has 8 cell-divs
    let board = null;
    for (const d of allDivs) {
      if (d.children.length === 8) {
        let isBoard = true;
        for (const row of d.children) {
          if (row.children.length !== 8) { isBoard = false; break; }
        }
        if (isBoard) { board = d; break; }
      }
    }
    if (!board) return false;

    const rows = [...board.children];
    for (let r = 5; r < 8; r++) {
      const cells = [...rows[r].children];
      for (let c = 0; c < 8; c++) {
        if ((r + c) % 2 === 1 && cells[c]?.children?.length > 0) {
          cells[c].click();
          return true;
        }
      }
    }
    return false;
  });
  await wait(400);
  return clicked;
}

async function run() {
  const browser = await chromium.launch({ headless: true });

  for (const device of DEVICES) {
    const outDir = join(ROOT, 'docs', 'screenshots', 'appstore', device.id);
    mkdirSync(outDir, { recursive: true });

    const context = await browser.newContext({
      viewport: { width: device.cssW, height: device.cssH },
      deviceScaleFactor: device.scale,
    });
    const page = await context.newPage();

    console.log(`\n📱 ${device.id} (${device.cssW * device.scale}×${device.cssH * device.scale})`);

    // ── 1: Home ──────────────────────────────────────────────────────
    await page.goto(BASE, { waitUntil: 'networkidle' });
    await shot(page, join(outDir, '01-home.png'));

    // ── 2: Mode select ───────────────────────────────────────────────
    await clickAny(page, ['NEW GAME', 'НОВАЯ ИГРА', 'NUEVA PARTIDA']);
    await shot(page, join(outDir, '02-mode-select.png'));

    // ── 3: Game 8×8 ──────────────────────────────────────────────────
    await page.goto(BASE, { waitUntil: 'networkidle' });
    await navigateToGame(page);
    await shot(page, join(outDir, '03-game-8x8.png'));

    // ── 4: Piece selected (valid moves) ──────────────────────────────
    await selectPiece(page);
    await shot(page, join(outDir, '04-game-moves.png'));

    // ── 5: Rules ─────────────────────────────────────────────────────
    await page.goto(BASE, { waitUntil: 'networkidle' });
    await clickAny(page, ['Rules', 'Правила', 'Reglas']);
    await shot(page, join(outDir, '05-rules.png'));

    // ── 6: Settings ──────────────────────────────────────────────────
    await page.goto(BASE, { waitUntil: 'networkidle' });
    await clickAny(page, ['Settings', 'Настройки', 'Ajustes']);
    await shot(page, join(outDir, '06-settings.png'));

    await context.close();
  }

  await browser.close();
  console.log('\n✅ Done → docs/screenshots/appstore/');
}

run().catch(err => { console.error(err); process.exit(1); });
