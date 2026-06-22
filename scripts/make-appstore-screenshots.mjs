/**
 * Generates App Store screenshots for iPhone 6.7" (1290×2796)
 * and iPhone 6.5" (1242×2688) from raw Playwright captures.
 *
 * Usage: node scripts/make-appstore-screenshots.mjs
 */
import sharp from 'sharp';
import { mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(fileURLToPath(import.meta.url), '..', '..');
const OUT  = join(ROOT, 'appstore-screenshots');
mkdirSync(OUT, { recursive: true });

// App Store required sizes
const SIZES = [
  { name: 'iphone-67', w: 1290, h: 2796 },  // iPhone 15 Pro Max
  { name: 'iphone-65', w: 1242, h: 2688 },  // iPhone 11 Pro Max (older required)
];

// Raw screenshots captured at 390×844
const SCREENS = [
  { file: 'ss_home_raw.png',     label: '01-home'     },
  { file: 'ss_game_raw.png',     label: '02-game-8x8' },
  { file: 'ss_selected_raw.png', label: '03-moves'    },
  { file: 'ss_game10_raw.png',   label: '04-game-10x10'},
  { file: 'ss_rules_raw.png',    label: '05-rules'    },
];

async function process() {
  for (const size of SIZES) {
    const dir = join(OUT, size.name);
    mkdirSync(dir, { recursive: true });

    for (const screen of SCREENS) {
      const src = join(ROOT, screen.file);
      const dst = join(dir, `${screen.label}.png`);

      // Scale raw screenshot to fill the target size, then composite
      // on a solid #050B06 background (matching app bg)
      const raw = sharp(src);
      const meta = await raw.metadata();

      // Scale to fit width, then pad top/bottom to reach target height
      const scaleX = size.w / meta.width;
      const scaledH = Math.round(meta.height * scaleX);

      let pipeline = raw.resize(size.w, scaledH, { fit: 'fill' });

      if (scaledH < size.h) {
        // Pad vertically to reach full height
        const padTop = Math.floor((size.h - scaledH) / 2);
        const padBot = size.h - scaledH - padTop;
        pipeline = pipeline.extend({
          top: padTop, bottom: padBot, left: 0, right: 0,
          background: { r: 5, g: 11, b: 6, alpha: 1 },
        });
      } else if (scaledH > size.h) {
        // Crop to target height, centred
        const top = Math.floor((scaledH - size.h) / 2);
        pipeline = pipeline.extract({ left: 0, top, width: size.w, height: size.h });
      }

      await pipeline.png({ compressionLevel: 9 }).toFile(dst);
      console.log(`✓ ${size.name}/${screen.label}.png`);
    }
  }
  console.log(`\nDone → ${OUT}`);
}

process().catch(err => { console.error(err); process.exit(1); });
