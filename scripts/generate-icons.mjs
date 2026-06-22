import sharp from 'sharp';
import { mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SOURCE = 'C:/Users/aleks/Downloads/0b707175-e723-4197-afa0-2323e16ca030.png';

// iOS App Store required sizes
const IOS_ICONS = [
  { name: 'Icon-1024.png',        size: 1024 }, // App Store
  { name: 'Icon-180.png',         size: 180  }, // iPhone @3x
  { name: 'Icon-120.png',         size: 120  }, // iPhone @2x
  { name: 'Icon-167.png',         size: 167  }, // iPad Pro @2x
  { name: 'Icon-152.png',         size: 152  }, // iPad @2x
  { name: 'Icon-87.png',          size: 87   }, // iPhone Settings @3x
  { name: 'Icon-80.png',          size: 80   }, // Spotlight @2x
  { name: 'Icon-76.png',          size: 76   }, // iPad @1x
  { name: 'Icon-60.png',          size: 60   }, // Spotlight @3x
  { name: 'Icon-58.png',          size: 58   }, // Settings @2x
  { name: 'Icon-40.png',          size: 40   }, // Spotlight @1x
  { name: 'Icon-29.png',          size: 29   }, // Settings @1x
  { name: 'Icon-20.png',          size: 20   }, // Notification @1x
];

// Web / PWA sizes
const WEB_ICONS = [
  { name: 'favicon-32.png',       size: 32   },
  { name: 'favicon-192.png',      size: 192  },
  { name: 'favicon-512.png',      size: 512  },
];

const OUT_IOS = join(__dirname, '../docs/icons/ios');
const OUT_WEB = join(__dirname, '../docs/icons/web');

[OUT_IOS, OUT_WEB].forEach(d => { if (!existsSync(d)) mkdirSync(d, { recursive: true }); });

async function resize(outDir, icons) {
  for (const { name, size } of icons) {
    const dest = join(outDir, name);
    await sharp(SOURCE)
      .resize(size, size, { fit: 'cover', position: 'centre' })
      .png()
      .toFile(dest);
    console.log(`  ${size}x${size}  →  ${name}`);
  }
}

console.log('iOS icons:');
await resize(OUT_IOS, IOS_ICONS);

console.log('\nWeb icons:');
await resize(OUT_WEB, WEB_ICONS);

console.log('\nDone. Files saved to docs/icons/');
