from PIL import Image, ImageFilter
import os

SRC_TRANSPARENT = r'C:\Users\aleks\Desktop\Private Map\Projects\2026\checkers\docs\icons\logo-isnet-general-use.png'
OUT_DIR = r'C:\Users\aleks\Desktop\Private Map\Projects\2026\checkers\docs\icons'

# Clean up alpha channel: remove near-transparent fringe pixels
def clean_alpha(img, threshold=30):
    img = img.convert('RGBA')
    r, g, b, a = img.split()
    import PIL.Image as PILImage
    # Kill pixels below threshold
    a_data = a.load()
    w, h = img.size
    for y in range(h):
        for x in range(w):
            if a_data[x, y] < threshold:
                a_data[x, y] = 0
    return Image.merge('RGBA', (r, g, b, a))

print('Processing transparent logo...')
img = Image.open(SRC_TRANSPARENT).convert('RGBA')
img = clean_alpha(img, threshold=40)

# Save clean transparent logo
clean_path = os.path.join(OUT_DIR, 'logo-transparent-clean.png')
img.save(clean_path)
print(f'Saved: logo-transparent-clean.png')

# iOS App Store icon sizes (opaque — put on dark background)
IOS_SIZES = [1024, 180, 167, 152, 120, 87, 80, 76, 60, 58, 40, 29, 20]

ios_dir = os.path.join(OUT_DIR, 'ios')
os.makedirs(ios_dir, exist_ok=True)

print('\nGenerating iOS icons (dark background)...')
for size in IOS_SIZES:
    # Create dark background
    bg = Image.new('RGBA', (size, size), (5, 11, 6, 255))  # #050B06
    # Scale logo to 85% of icon size with padding
    logo_size = int(size * 0.92)
    logo = img.resize((logo_size, logo_size), Image.LANCZOS)
    offset = (size - logo_size) // 2
    bg.paste(logo, (offset, offset), logo)
    final = bg.convert('RGB')
    out_path = os.path.join(ios_dir, f'Icon-{size}.png')
    final.save(out_path, 'PNG')
    print(f'  {size}x{size}  ->  Icon-{size}.png')

# Transparent versions for PWA/web
web_dir = os.path.join(OUT_DIR, 'web')
os.makedirs(web_dir, exist_ok=True)

print('\nGenerating web icons (transparent)...')
for size in [512, 192, 32]:
    resized = img.resize((size, size), Image.LANCZOS)
    out_path = os.path.join(web_dir, f'icon-{size}.png')
    resized.save(out_path, 'PNG')
    print(f'  {size}x{size}  ->  icon-{size}.png')

print('\nAll done.')
