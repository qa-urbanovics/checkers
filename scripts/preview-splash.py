from PIL import Image
import os

SRC = r'C:\Users\aleks\Desktop\Private Map\Projects\2026\checkers\ios\App\App\Assets.xcassets\Splash.imageset\splash-2732x2732.png'
OUT = r'C:\Users\aleks\Desktop\Private Map\Projects\2026\checkers\docs\screenshots\splash-preview.png'

img = Image.open(SRC)
# Simulate iPhone 14 Pro screen (390x844) — crop center
w, h = img.size
ratio = 844 / 390
crop_w = int(h / ratio)
x = (w - crop_w) // 2
cropped = img.crop((x, 0, x + crop_w, h))
preview = cropped.resize((390, 844), Image.LANCZOS)
preview.save(OUT, 'PNG')
print(f'Preview saved: {OUT}')
