#!/usr/bin/env python3


import requests
import hashlib
import time
import sys
import base64
from PIL import Image
import io
import random
import argparse
import numpy as np
import json

def get_expected_performance(gpu_type):
    """
    Returns expected time per image and minimum batch size based on claimed GPU type.
    """

    gpu_performance = {
        'RTX 3090': {'time_per_image': 8.0, 'min_batch_size': 4},
        'RTX 3080': {'time_per_image': 9.0, 'min_batch_size': 3},
        'RTX 3070': {'time_per_image': 11.0, 'min_batch_size': 2},
        'RTX 4090': {'time_per_image': 7.0, 'min_batch_size': 4},
        'RTX 3060': {'time_per_image': 13.0, 'min_batch_size': 1},
        'RTX A6000': {'time_per_image': 7.0, 'min_batch_size': 6},
    }

    performance = gpu_performance.get(gpu_type)
    if not performance:
        raise ValueError(f"Unknown GPU type '{gpu_type}'. Please update the GPU performance mapping.")
    return performance['time_per_image'], performance['min_batch_size']

def poll_prompt_history(api_url, prompt_id, timeout=300):
    """
    Polls the ComfyUI history API for the status of the prompt and retrieves the images when they are ready.
    """
    history_url = f"{api_url}/history/{prompt_id}"
    view_url = f"{api_url}/view"
    start_time = time.time()
    
    while time.time() - start_time < timeout:
        response = requests.get(history_url)
        response.raise_for_status()
        history_data = response.json()
        prompt_data = history_data.get(prompt_id, {})
        status = prompt_data.get('status', {})
        completed = status.get('completed', False)

        if completed:
            outputs = prompt_data.get('outputs', {})
            images = []
            # Loop over outputs to fetch image files
            for output_id, output_data in outputs.items():
                if 'images' in output_data:
                    for image_info in output_data['images']:
                        # Retrieve the image using the view endpoint
                        image_filename = image_info.get('filename')
                        image_type = image_info.get('type', 'output')  # Use output as default type
                        image_subfolder = image_info.get('subfolder', '')

                        if image_filename:
                            image_response = requests.get(
                                f"{view_url}?filename={image_filename}&subfolder={image_subfolder}&type={image_type}"
                            )
                            if image_response.status_code == 200:
                                image = Image.open(io.BytesIO(image_response.content))
                                images.append(image)
                            else:
                                print(f"Error retrieving image {image_filename}. Status code: {image_response.status_code}")
            if images:
                return images
            else:
                print(f"Error: No images were found in the prompt history for prompt_id: {prompt_id}")
                return None
        elif 'error' in status.get('status_str', '').lower():
            print(f"Error: The prompt processing failed for prompt_id: {prompt_id}. Error: {status.get('error', 'Unknown error')}")
            return None
        
        time.sleep(1)
    
    print(f"Timeout: Image generation for prompt_id {prompt_id} exceeded {timeout} seconds.")
    return None


def generate_image_with_api_payload(payload, api_url, timeout=300):
    """
    Generates images using the ComfyUI API given a payload and waits for completion.
    Returns the images as a list of PIL Images.
    """
    prompt_endpoint = f"{api_url}/prompt"
    response = requests.post(prompt_endpoint, json=payload, timeout=timeout)
    if response.status_code != 200:
        print(f"Error: Failed to submit prompt. Status code: {response.status_code}, Response: {response.text}")
        response.raise_for_status()
    result = response.json()
    prompt_id = result.get('prompt_id')
    if not prompt_id:
        raise ValueError("No prompt_id returned by the API.")
    
    # Now poll the history to wait for images
    images = poll_prompt_history(api_url, prompt_id, timeout)
    return images

def get_max_batch_size(api_url, payload_template):
    """
    Determines the maximum batch size the remote GPU can handle before running out of VRAM.
    Also generates images at the maximum batch size and returns them along with the batch size.
    """
    batch_size = 100
    max_batch_size = batch_size
    max_batch_images = None
    max_batch_time = 0.0

    while True:
        payload = json.loads(json.dumps(payload_template))  # Deep copy
        # Update the batch size in the payload for ComfyUI
        payload["prompt"]["5"]["inputs"]["batch_size"] = batch_size
        print(f"Testing batch size: {batch_size}")

        # For debugging: print the payload
        # print(json.dumps(payload, indent=2))

        try:
            start_time = time.time()
            images = generate_image_with_api_payload(payload, api_url)
            elapsed_time = time.time() - start_time
            if images is None or len(images) == 0:
                print(f"API did not return images for batch size {batch_size}.")
                break  # Likely ran out of VRAM or other error
            # If successful, update max batch size and images
            max_batch_size = batch_size
            max_batch_images = images
            max_batch_time = elapsed_time
            print(f"Batch size {batch_size} succeeded in {elapsed_time:.2f} seconds.")
            batch_size += 1
        except requests.exceptions.RequestException as e:
            print(f"RequestException: Error at batch size {batch_size}. Error: {e}")
            break
        except Exception as e:
            print(f"Exception: Error at batch size {batch_size}. Error: {e}")
            break
    return max_batch_size, max_batch_images, max_batch_time

def generate_comfy_payload(prompt, seed, steps, width, height, cfg_scale, sampler_name, batch_size, model_name):
    """
    Generates a payload for ComfyUI API.
    """
    payload = {
        "prompt": {
            "3": {
                "class_type": "KSampler",
                "inputs": {
                    "cfg": cfg_scale,
                    "denoise": 1,
                    "latent_image": ["5", 0],
                    "model": ["4", 0],
                    "negative": ["7", 0],
                    "positive": ["6", 0],
                    "sampler_name": sampler_name,
                    "scheduler": "normal",
                    "seed": seed,
                    "steps": steps
                }
            },
            "4": {
                "class_type": "CheckpointLoaderSimple",
                "inputs": {
                    "ckpt_name": model_name
                }
            },
            "5": {
                "class_type": "EmptyLatentImage",
                "inputs": {
                    "batch_size": batch_size,
                    "height": height,
                    "width": width
                }
            },
            "6": {
                "class_type": "CLIPTextEncode",
                "inputs": {
                    "clip": ["4", 1],
                    "text": prompt
                }
            },
            "7": {
                "class_type": "CLIPTextEncode",
                "inputs": {
                    "clip": ["4", 1],
                    "text": ""
                }
            },
            "8": {
                "class_type": "VAEDecode",
                "inputs": {
                    "samples": ["3", 0],
                    "vae": ["4", 2]
                }
            },
            "9": {
                "class_type": "SaveImage",
                "inputs": {
                    "images": ["8", 0],
                    "filename_prefix": "verification_image"
                }
            }
        }
    }
    return payload

def decode_base64_image(image_data):
    if ',' in image_data:
        header, encoded = image_data.split(',', 1)
    else:
        encoded = image_data
    image_bytes = base64.b64decode(encoded)
    image = Image.open(io.BytesIO(image_bytes))
    return image

def check_api_url(api_url):
    history_url = f"{api_url}/history"
    try:
        response = requests.get(history_url, timeout=10)
        if response.status_code != 200:
            print(f"Error: API check failed. Status code: {response.status_code}, Response: {response.text}")
            return False
        print("Remote API is reachable.")
        return True
    except requests.exceptions.RequestException as e:
        print(f"Error: Failed to connect to the remote API at {history_url}. {e}")
        return False

def main():
    # Parse command-line arguments
    parser = argparse.ArgumentParser(description="GPU Verification Benchmark Script using ComfyUI")
    parser.add_argument('--api-url', type=str, required=True, help="Remote ComfyUI API base URL (e.g., http://remote-pc-address:8188)")
    parser.add_argument('--gpu-type', type=str, required=True, help="Claimed GPU type of the remote PC (e.g., 'RTX 3090')")
    parser.add_argument('--num-images', type=int, default=5, help="Number of images to generate and verify")
    parser.add_argument('--prompt', type=str, default="A futuristic city skyline at sunset", help="Prompt for image generation")
    parser.add_argument('--model-name', type=str, default="v1-5-pruned-emaonly", help="Model name to use")
    parser.add_argument('--local-api-url', type=str, default="http://localhost:8188", help="Local ComfyUI API base URL")
    args = parser.parse_args()

    remote_api_url = args.api_url.rstrip('/')
    local_api_url = args.local_api_url.rstrip('/')

    # Check if the API is reachable
    if not check_api_url(remote_api_url):
        sys.exit(1)

    claimed_gpu_type = args.gpu_type
    num_images = args.num_images
    prompt = args.prompt
    model_name = args.model_name

    try:
        # Get expected performance metrics based on claimed GPU
        time_threshold_per_image, min_batch_size = get_expected_performance(claimed_gpu_type)

        # Payload template for ComfyUI
        payload_template = generate_comfy_payload(
            prompt=prompt,
            seed=random.randint(0, 2**32 - 1),  # Placeholder seed
            steps=20,
            width=512,
            height=512,
            cfg_scale=7.0,
            sampler_name='euler',
            batch_size=1,  # Will be updated in the loop
            model_name=model_name
        )

        # Determine maximum batch size on the remote PC and get images at that batch size
        print("Determining maximum batch size on the remote PC...")
        max_batch_size, max_batch_images, max_batch_time = get_max_batch_size(remote_api_url, payload_template)
        print(f"Maximum batch size determined: {max_batch_size}")

        if max_batch_size < min_batch_size:
            print(f"Verification failed: Remote GPU's max batch size ({max_batch_size}) is less than the minimum required ({min_batch_size}) for {claimed_gpu_type}.")
            sys.exit(1)

        # Generate random seeds for image generation
        seeds = [random.randint(0, 2**32 - 1) for _ in range(num_images)]

        # Generate images locally using the local ComfyUI API
        print("Generating images locally for verification...")
        local_images = []
        for seed in seeds:
            payload = generate_comfy_payload(
                prompt=prompt,
                seed=seed,
                steps=20,
                width=512,
                height=512,
                cfg_scale=7.0,
                sampler_name='euler',
                batch_size=1,
                model_name=model_name
            )
            images = generate_image_with_api_payload(payload, local_api_url)
            if images:
                local_images.append(images[0])  # Assuming batch_size=1
            else:
                print("Error: Failed to generate image locally.")
                sys.exit(1)

        local_hashes = [compute_image_hash(img) for img in local_images]

        # Request images from the remote API
        print("Requesting images from the remote API...")
        remote_images = []
        remote_times = []
        for seed in seeds:
            payload = generate_comfy_payload(
                prompt=prompt,
                seed=seed,
                steps=20,
                width=512,
                height=512,
                cfg_scale=7.0,
                sampler_name='euler',
                batch_size=1,
                model_name=model_name
            )
            start_time = time.time()
            images = generate_image_with_api_payload(payload, remote_api_url)
            time_taken = time.time() - start_time
            if images:
                remote_images.append(images[0])  # Assuming batch_size=1
                remote_times.append(time_taken)
            else:
                print("Error: Failed to generate image on remote API.")
                sys.exit(1)

        # Compare image hashes and measure times
        all_hashes_match = True
        all_times_within_threshold = True

        for i in range(num_images):
            local_hash = local_hashes[i]
            remote_hash = compute_image_hash(remote_images[i])
            time_taken = remote_times[i]

            if local_hash != remote_hash:
                print(f"Verification failed: Image {i} hash does not match.")
                all_hashes_match = False
            else:
                print(f"Image {i} hash matches.")

            if time_taken > time_threshold_per_image:
                print(f"Verification failed: Image {i} generation took {time_taken:.2f}s, which exceeds the threshold of {time_threshold_per_image}s for {claimed_gpu_type}.")
                all_times_within_threshold = False
            else:
                print(f"Image {i} generated in {time_taken:.2f}s, within the acceptable threshold.")

        # Verify at least one image from the max batch size testing
        print("\nVerifying an image from the max batch size testing...")
        # Generate seeds for the batch
        batch_seeds = [random.randint(0, 2**32 - 1) for _ in range(max_batch_size)]

        # Generate batch images locally
        local_batch_images = []
        for seed in batch_seeds:
            payload = generate_comfy_payload(
                prompt=prompt,
                seed=seed,
                steps=20,
                width=512,
                height=512,
                cfg_scale=7.0,
                sampler_name='euler',
                batch_size=1,
                model_name=model_name
            )
            images = generate_image_with_api_payload(payload, local_api_url)
            if images:
                local_batch_images.append(images[0])
            else:
                print("Error: Failed to generate batch image locally.")
                sys.exit(1)

        local_batch_hashes = [compute_image_hash(img) for img in local_batch_images]

        # Process remote batch images
        remote_batch_images = max_batch_images  # Already a list of PIL Images

        # Compare at least one image from the batch
        index_to_verify = random.randint(0, max_batch_size - 1)
        local_batch_hash = local_batch_hashes[index_to_verify]
        remote_batch_hash = compute_image_hash(remote_batch_images[index_to_verify])

        if local_batch_hash != remote_batch_hash:
            print(f"Verification failed: Batch image {index_to_verify} hash does not match.")
            all_hashes_match = False
        else:
            print(f"Batch image {index_to_verify} hash matches.")

        # Check time taken for the batch
        avg_time_per_image = max_batch_time / max_batch_size
        print(f"Remote batch generation time: {max_batch_time:.2f}s for batch size {max_batch_size} (avg {avg_time_per_image:.2f}s per image)")

        if avg_time_per_image > time_threshold_per_image:
            print(f"Verification failed: Average time per image in batch exceeds the threshold of {time_threshold_per_image}s for {claimed_gpu_type}.")
            all_times_within_threshold = False
        else:
            print(f"Average time per image in batch is within the acceptable threshold.")

        # Final result
        if all_hashes_match and all_times_within_threshold:
            print("\nVerification passed: All images match and were generated within the time threshold.")
            print(f"Remote GPU's maximum batch size: {max_batch_size}")
            sys.exit(0)
        else:
            print("\nVerification failed.")
            sys.exit(1)

    except ValueError as ve:
        print(f"Error: {ve}")
        sys.exit(1)
    except requests.exceptions.RequestException as e:
        print(f"Error: Failed to connect to remote ComfyUI API. {e}")
        sys.exit(1)
    except requests.exceptions.Timeout:
        print("Error: Request to remote ComfyUI API timed out.")
        sys.exit(1)
    except requests.exceptions.HTTPError as e:
        print(f"Error: HTTP error occurred. {e}")
        sys.exit(1)
    except IOError:
        print("Error: Failed to decode the image. Ensure Pillow is installed and up to date.")
        sys.exit(1)
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        sys.exit(1)

def compute_image_hash(image):
    image_bytes = io.BytesIO()
    image.save(image_bytes, format='PNG')
    image_hash = hashlib.sha256(image_bytes.getvalue()).hexdigest()
    return image_hash

if __name__ == "__main__":
    main()
