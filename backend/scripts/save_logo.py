from PIL import Image
import os

im1 = Image.open('report_images/image1.jpeg')
print('image1:', im1.size)

# Let's save a copy of image1 as parul_logo.jpeg for easy reference in LaTeX
im1.save('parul_logo.jpeg')
print('Saved parul_logo.jpeg successfully!')
