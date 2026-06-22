from PIL import Image
import math, os
from collections import deque

SOURCE = r'C:\Users\aleks\Downloads\e9fbd3e4-bf54-43e5-a744-b1cd419ff46d.png'
PUBLIC = r'C:\Users\aleks\Desktop\Private Map\Projects\2026\checkers\public\logo.png'

img = Image.open(SOURCE).convert('RGBA')
pixels = img.load()
w, h = img.size

# Flood-fill from all 4 corners to find connected white background
# Only removes white pixels that are reachable from edges
TOLERANCE = 35
visited = [[False] * h for _ in range(w)]

def is_bg(x, y):
    r, g, b, a = pixels[x, y]
    dist = math.sqrt((r - 255)**2 + (g - 255)**2 + (b - 255)**2)
    return dist < TOLERANCE

queue = deque()
# Seed from all 4 corners + edges (every 2 pixels along border)
seeds = []
for i in range(0, w, 2):
    seeds += [(i, 0), (i, h - 1)]
for i in range(0, h, 2):
    seeds += [(0, i), (w - 1, i)]

for sx, sy in seeds:
    if 0 <= sx < w and 0 <= sy < h and not visited[sx][sy] and is_bg(sx, sy):
        queue.append((sx, sy))
        visited[sx][sy] = True

while queue:
    x, y = queue.popleft()
    r, g, b, a = pixels[x, y]
    dist = math.sqrt((r - 255)**2 + (g - 255)**2 + (b - 255)**2)
    # Fully transparent if white background
    if dist < TOLERANCE:
        pixels[x, y] = (0, 0, 0, 0)
    else:
        # Semi-transparent soft edge
        alpha = int(min(255, (dist - TOLERANCE) / TOLERANCE * 255))
        pixels[x, y] = (r, g, b, alpha)
        continue  # don't spread through non-background
    for dx, dy in [(-1,0),(1,0),(0,-1),(0,1)]:
        nx, ny = x + dx, y + dy
        if 0 <= nx < w and 0 <= ny < h and not visited[nx][ny]:
            r2, g2, b2, a2 = pixels[nx, ny]
            dist2 = math.sqrt((r2 - 255)**2 + (g2 - 255)**2 + (b2 - 255)**2)
            if dist2 < TOLERANCE * 1.5:
                visited[nx][ny] = True
                queue.append((nx, ny))

# Auto-crop to tight bounding box
bbox = img.getbbox()
cropped = img.crop(bbox)

# Square canvas with equal 10% padding
cw, ch = cropped.size
side = max(cw, ch)
pad = int(side * 0.10)
size = side + pad * 2

canvas = Image.new('RGBA', (size, size), (0, 0, 0, 0))
canvas.paste(cropped, ((size - cw) // 2, (size - ch) // 2), cropped)

canvas.save(PUBLIC, 'PNG')
print(f'Saved: {size}x{size} -> public/logo.png')
