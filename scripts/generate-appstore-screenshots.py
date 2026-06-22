from PIL import Image
import os

SHOTS_DIR = r'C:\Users\aleks\Desktop\Private Map\Projects\2026\checkers\docs\screenshots'
OUT_BASE  = r'C:\Users\aleks\Desktop\Private Map\Projects\2026\checkers\docs\appstore'

SOURCES = ['as-1-home', 'as-2-mode', 'as-3-difficulty', 'as-4-game', 'as-5-settings']

# App Store required sizes
FORMATS = {
    'iphone-69': (1320, 2868),   # iPhone 16 Pro Max — required from 2025
    'iphone-67': (1290, 2796),   # iPhone 15 Pro Max — optional but recommended
    'ipad-13':   (2064, 2752),   # iPad Pro 13" — required for iPad support
}

def make_screenshot(src_path, target_w, target_h):
    img = Image.open(src_path).convert('RGB')
    src_w, src_h = img.size

    # Scale to fill target height, center-crop width
    scale = target_h / src_h
    new_w = int(src_w * scale)
    new_h = target_h
    resized = img.resize((new_w, new_h), Image.LANCZOS)

    if new_w >= target_w:
        # Crop horizontally to center
        x = (new_w - target_w) // 2
        final = resized.crop((x, 0, x + target_w, target_h))
    else:
        # Pad horizontally with bg color (sample from edge)
        bg_color = resized.getpixel((0, 0))
        final = Image.new('RGB', (target_w, target_h), bg_color)
        x = (target_w - new_w) // 2
        final.paste(resized, (x, 0))

    return final

for fmt_name, (tw, th) in FORMATS.items():
    out_dir = os.path.join(OUT_BASE, fmt_name)
    os.makedirs(out_dir, exist_ok=True)
    print(f'\n{fmt_name} ({tw}x{th}):')
    for i, name in enumerate(SOURCES, 1):
        src = os.path.join(SHOTS_DIR, f'{name}.png')
        if not os.path.exists(src):
            print(f'  MISSING: {name}.png')
            continue
        img = make_screenshot(src, tw, th)
        out = os.path.join(out_dir, f'{i:02d}-{name.split("-", 2)[-1]}.png')
        img.save(out, 'PNG', optimize=True)
        print(f'  {i:02d}-{name.split("-", 2)[-1]}.png  ({img.size[0]}x{img.size[1]})')

print('\nAll App Store screenshots done.')
print(f'Output: {OUT_BASE}')
