from rembg import remove, new_session
from PIL import Image
import os

SOURCE = r'C:\Users\aleks\Downloads\0b707175-e723-4197-afa0-2323e16ca030.png'
OUT_DIR = r'C:\Users\aleks\Desktop\Private Map\Projects\2026\checkers\docs\icons'
os.makedirs(OUT_DIR, exist_ok=True)

models = ['isnet-general-use', 'u2net_human_seg', 'silueta']

for model_name in models:
    print(f'Trying model: {model_name}')
    try:
        session = new_session(model_name)
        with open(SOURCE, 'rb') as f:
            input_data = f.read()
        output_data = remove(input_data, session=session)
        out_path = os.path.join(OUT_DIR, f'logo-{model_name}.png')
        with open(out_path, 'wb') as f:
            f.write(output_data)
        print(f'  Saved: {out_path}')
    except Exception as e:
        print(f'  Error: {e}')
