from PIL import Image
import os

LOGO_SRC = r'C:\Users\aleks\Desktop\Private Map\Projects\2026\checkers\public\logo.png'
SPLASH_DIR = r'C:\Users\aleks\Desktop\Private Map\Projects\2026\checkers\ios\App\App\Assets.xcassets\Splash.imageset'

CANVAS = 2732
BG_COLOR = (5, 11, 6, 255)   # #050B06
LOGO_SIZE = 900               # logo occupies ~33% of canvas

logo = Image.open(LOGO_SRC).convert('RGBA')
logo = logo.resize((LOGO_SIZE, LOGO_SIZE), Image.LANCZOS)

def make_splash():
    canvas = Image.new('RGBA', (CANVAS, CANVAS), BG_COLOR)
    # Center logo slightly above middle (optical center)
    x = (CANVAS - LOGO_SIZE) // 2
    y = (CANVAS - LOGO_SIZE) // 2 - 60
    canvas.paste(logo, (x, y), logo)
    return canvas.convert('RGB')

splash = make_splash()

# All 3 required files have the same content (Xcode picks the right one at runtime)
for filename in ['splash-2732x2732.png', 'splash-2732x2732-1.png', 'splash-2732x2732-2.png']:
    out = os.path.join(SPLASH_DIR, filename)
    splash.save(out, 'PNG', optimize=True)
    print(f'Saved: {filename}')

print('Done.')
