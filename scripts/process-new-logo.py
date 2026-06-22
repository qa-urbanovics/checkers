from rembg import remove, new_session
from PIL import Image
import os, shutil

SOURCE = r'C:\Users\aleks\Downloads\e9fbd3e4-bf54-43e5-a744-b1cd419ff46d.png'
OUT_DIR = r'C:\Users\aleks\Desktop\Private Map\Projects\2026\checkers\docs\icons'
PUBLIC_DIR = r'C:\Users\aleks\Desktop\Private Map\Projects\2026\checkers\public'

# Clean old icons
for name in os.listdir(OUT_DIR):
    path = os.path.join(OUT_DIR, name)
    if os.path.isfile(path):
        os.remove(path)
ios_dir = os.path.join(OUT_DIR, 'ios')
web_dir = os.path.join(OUT_DIR, 'web')
os.makedirs(ios_dir, exist_ok=True)
os.makedirs(web_dir, exist_ok=True)

# Remove background
print('Removing background...')
session = new_session('isnet-general-use')
with open(SOURCE, 'rb') as f:
    data = f.read()
result = remove(data, session=session)

transparent_path = os.path.join(OUT_DIR, 'logo-transparent.png')
with open(transparent_path, 'wb') as f:
    f.write(result)
print('  Saved: logo-transparent.png')

# Clean up near-transparent fringe
img = Image.open(transparent_path).convert('RGBA')
pixels = img.load()
w, h = img.size
for y in range(h):
    for x in range(w):
        r, g, b, a = pixels[x, y]
        if a < 30:
            pixels[x, y] = (0, 0, 0, 0)

img.save(transparent_path)

# Copy transparent to public/ for use in the app
os.makedirs(PUBLIC_DIR, exist_ok=True)
shutil.copy(transparent_path, os.path.join(PUBLIC_DIR, 'logo.png'))
print('  Copied to public/logo.png')

# iOS icon sizes — logo centered on #050B06 background
IOS_SIZES = [1024, 180, 167, 152, 120, 87, 80, 76, 60, 58, 40, 29, 20]
print('\nGenerating iOS icons...')
for size in IOS_SIZES:
    bg = Image.new('RGBA', (size, size), (5, 11, 6, 255))
    pad = int(size * 0.08)
    logo_size = size - pad * 2
    logo = img.resize((logo_size, logo_size), Image.LANCZOS)
    bg.paste(logo, (pad, pad), logo)
    out = os.path.join(ios_dir, f'Icon-{size}.png')
    bg.convert('RGB').save(out, 'PNG')
    print(f'  {size}x{size}  Icon-{size}.png')

# Web/PWA icons — transparent
print('\nGenerating web icons...')
for size in [512, 192, 32]:
    resized = img.resize((size, size), Image.LANCZOS)
    out = os.path.join(web_dir, f'icon-{size}.png')
    resized.save(out, 'PNG')
    print(f'  {size}x{size}  icon-{size}.png')

print('\nAll done.')
