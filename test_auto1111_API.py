import requests
import base64
from PIL import Image
import io
import hashlib
import numpy as np
import sys

def generate_image(prompt, seed, steps=20, width=512, height=512, cfg_scale=7.0, sampler_name='DPM++ 2M', api_base_url='http://localhost:7860'):
    api_endpoint = f"{api_base_url}/sdapi/v1/txt2img"
    payload = {
        "prompt": prompt,
        "seed": seed,
        "steps": steps,
        "width": width,
        "height": height,
        "cfg_scale": cfg_scale,
        "sampler_name": sampler_name
    }
    response = requests.post(api_endpoint, json=payload)
    response.raise_for_status()
    data = response.json()
    images = data['images']

    image_data = images[0]
    image = decode_base64_image(image_data)
    return image

def decode_base64_image(image_data):
    if ',' in image_data:
        header, encoded = image_data.split(',', 1)
    else:
        encoded = image_data
    image_bytes = base64.b64decode(encoded)
    image = Image.open(io.BytesIO(image_bytes))
    return image

def compare_images(image1, image2):
    np_image1 = np.array(image1)
    np_image2 = np.array(image2)
    return np.array_equal(np_image1, np_image2)

def compute_image_hash(image):
    image_bytes = io.BytesIO()
    image.save(image_bytes, format='PNG')
    image_hash = hashlib.sha256(image_bytes.getvalue()).hexdigest()
    return image_hash

def main():
    if len(sys.argv) < 4:
        print("Usage: python check_image.py <prompt> <seed> <image_file> [api_base_url]")
        sys.exit(1)
    prompt = sys.argv[1]
    seed = int(sys.argv[2])
    image_file = sys.argv[3]
    api_base_url = 'http://localhost:7860'
    if len(sys.argv) >= 5:
        api_base_url = sys.argv[4]
    provided_image = Image.open(image_file).convert('RGB')
    generated_image = generate_image(prompt, seed, api_base_url=api_base_url).convert('RGB')
    if compare_images(provided_image, generated_image):
        print("The image matches the generated image.")
        provided_hash = compute_image_hash(provided_image)
        generated_hash = compute_image_hash(generated_image)
        print(f"Provided image hash: {provided_hash}")
        print(f"Generated image hash: {generated_hash}")
        generated_image.save('generated_image.png')
    else:
        print("The image does NOT match the generated image.")
        provided_hash = compute_image_hash(provided_image)
        generated_hash = compute_image_hash(generated_image)
        print(f"Provided image hash: {provided_hash}")
        print(f"Generated image hash: {generated_hash}")
        generated_image.save('generated_image.png')
        print("Generated image saved as 'generated_image.png' for manual inspection.")

if __name__ == "__main__":
    main()
