from PIL import Image, ImageDraw

def crop_to_circle(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    # Make square
    width, height = img.size
    min_dim = min(width, height)
    
    # Apply zoom to crop tighter (hide orange)
    zoom_factor = 0.62 # Tighter crop to eliminate orange
    crop_size = min_dim * zoom_factor
    
    y_offset = -5 # Move crop box UP slightly to center on the Spiderman mask
    left = (width - crop_size) / 2
    top = (height - crop_size) / 2 + y_offset
    right = (width + crop_size) / 2
    bottom = (height + crop_size) / 2 + y_offset
    img = img.crop((left, top, right, bottom))
    
    # Create mask
    mask = Image.new("L", img.size, 0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse((0, 0, crop_size, crop_size), fill=255)
    
    # Apply mask
    output = Image.new("RGBA", img.size)
    output.paste(img, (0, 0), mask)
    
    output.save(output_path)

crop_to_circle("public/mask.png", "public/mask-circle.png")
print("Done")
