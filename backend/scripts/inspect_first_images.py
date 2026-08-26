import os
from PIL import Image

for f in ['image1.jpeg', 'image2.jpeg', 'image3.jpeg', 'image4.jpeg', 'image5.jpeg']:
    p = os.path.join('report_images', f)
    if os.path.exists(p):
        im = Image.open(p)
        print(f'{f}: size={im.size}, mode={im.mode}')
