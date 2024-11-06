import requests
import json
import time
import asyncio
import aiohttp
import random
# API endpoints
scan_url = "http://localhost:9090/api/v2/models/scan_folder"
install_url = "http://localhost:9090/api/v2/models/install"
list_models_url = "http://localhost:9090/api/v2/models/"
enqueue_url = "http://localhost:9090/api/v1/queue/default/enqueue_batch"
batch_status_url_template = "http://localhost:9090/api/v1/queue/default/b/{batch_id}/status"

# Model directory in Docker
model_dir = "/invokeai/models/stable-diffusion/"

async def wait_for_invokeai_image(session, batch_id, timeout=300):
    batch_status_url = batch_status_url_template.format(batch_id=batch_id)
    image_generated = False
    start_time = time.time()

    while not image_generated:
        elapsed_time = time.time() - start_time
        if elapsed_time > timeout:
            print(f"Timeout: Image generation for batch_id {batch_id} exceeded {timeout} seconds.")
            break

        try:
            async with session.get(batch_status_url) as response:
                if response.status == 200:
                    status_json = await response.json()
                    in_progress = status_json.get('in_progress', 0)
                    completed = status_json.get('completed', 0)

                    if in_progress > 0:
                        pass  # Image generation in progress
                    elif completed > 0:
                        image_generated = True
                    await asyncio.sleep(.2)  # Wait before checking again
                else:
                    await asyncio.sleep(.2)  # Wait before retrying
        except Exception as e:
            await asyncio.sleep(.2)  # Retry after a short delay

async def main():
    async with aiohttp.ClientSession() as session:
        try:
            # Scan for models
            scanned_models = requests.get(scan_url, params={"scan_path": model_dir}).json()

            for model in scanned_models:
                model_key, model_hash = None, None

                if not model.get("is_installed"):
                    install_response = requests.post(install_url, params={"source": model["path"], "inplace": True}, json={
                        "name": "v1-5-pruned-emaonly", "description": "Stable Diffusion v1.5 model"})

                    if install_response.status_code in [201, 409]:
                        while True:
                            time.sleep(.2)
                            models = requests.get(list_models_url).json().get("models", [])
                            installed_model = next((m for m in models if m["name"] == "v1-5-pruned-emaonly"), None)
                            if installed_model:
                                model_key, model_hash = installed_model.get("key"), installed_model.get("hash")
                                break
                else:
                    models = requests.get(list_models_url).json().get("models", [])
                    installed_model = next((m for m in models if m["name"] == "v1-5-pruned-emaonly"), None)
                    if installed_model:
                        model_key, model_hash = installed_model.get("key"), installed_model.get("hash")

                if model_key and model_hash:
                    payload = {
                        "batch": {
                            "batch_id": "batch_001",
                            "origin": "api",
                            "destination": "gallery",
                            "graph": {
                                "id": "graph_001",
                                "nodes": {
                                    "model_loader": {
                                        "id": "model_loader",
                                        "type": "main_model_loader",
                                        "model": {
                                            "model_id": "ce4d5902-cc32-46f8-878a-0572c88459f8",
                                            "model_type": "main",
                                            "key": model_key,
                                            "hash": model_hash,
                                            "name": "v1-5-pruned-emaonly",
                                            "base": "sd-1",
                                            "type": "main"
                                        }
                                    },
                                    "clip_skip": {
                                        "id": "clip_skip",
                                        "type": "clip_skip",
                                        "skipped_layers": 0
                                    },
                                    "pos_cond": {
                                        "id": "pos_cond",
                                        "type": "compel",
                                        "prompt": "a futuristic sunset pizza"
                                    },
                                    "neg_cond": {
                                        "id": "neg_cond",
                                        "type": "compel",
                                        "prompt": ""
                                    },
                                    "noise": {
                                        "id": "noise",
                                        "type": "noise",
                                        "seed": random.randint(0, 9999999999),
                                        "width": 512,
                                        "height": 512,
                                        "use_cpu": False
                                    },
                                    "denoise_latents": {
                                        "id": "denoise_latents",
                                        "type": "denoise_latents",
                                        "steps": 50,
                                        "cfg_scale": 7.5,
                                        "denoising_start": 0.0,
                                        "denoising_end": 1.0,
                                        "scheduler": "dpmpp_3m_k"
                                    },
                                    "core_metadata": {
                                        "id": "core_metadata",
                                        "type": "core_metadata",
                                        "generation_mode": "txt2img",
                                        "positive_prompt": "a futuristic city sunset",
                                        "negative_prompt": "",
                                        "width": 512,
                                        "height": 512,
                                        "seed": random.randint(0, 9999999999),
                                        "rand_device": "cpu",
                                        "cfg_scale": 7.5,
                                        "steps": 50
                                    },
                                    "canvas_output": {
                                        "id": "canvas_output",
                                        "type": "l2i",
                                        "width": 512,
                                        "height": 512,
                                        "fp32": True
                                    }
                                },
                                "edges": [
                                    {"source": {"node_id": "model_loader", "field": "unet"}, "destination": {"node_id": "denoise_latents", "field": "unet"}},
                                    {"source": {"node_id": "model_loader", "field": "clip"}, "destination": {"node_id": "clip_skip", "field": "clip"}},
                                    {"source": {"node_id": "clip_skip", "field": "clip"}, "destination": {"node_id": "pos_cond", "field": "clip"}},
                                    {"source": {"node_id": "clip_skip", "field": "clip"}, "destination": {"node_id": "neg_cond", "field": "clip"}},
                                    {"source": {"node_id": "pos_cond", "field": "conditioning"}, "destination": {"node_id": "denoise_latents", "field": "positive_conditioning"}},
                                    {"source": {"node_id": "neg_cond", "field": "conditioning"}, "destination": {"node_id": "denoise_latents", "field": "negative_conditioning"}},
                                    {"source": {"node_id": "noise", "field": "noise"}, "destination": {"node_id": "denoise_latents", "field": "noise"}},
                                    {"source": {"node_id": "denoise_latents", "field": "latents"}, "destination": {"node_id": "canvas_output", "field": "latents"}},
                                    {"source": {"node_id": "model_loader", "field": "vae"}, "destination": {"node_id": "canvas_output", "field": "vae"}}
                                ]
                            },
                            "runs": 5
                        }
                    }

                    response = requests.post(enqueue_url, headers={"Content-Type": "application/json"}, data=json.dumps(payload))

                    if response.status_code == 200:
                        batch_info = response.json().get('batch')
                        if batch_info and 'batch_id' in batch_info:
                            batch_id = batch_info['batch_id']
                            await wait_for_invokeai_image(session, batch_id)
                            print(f"Image generated for batch_id {batch_id}")
                    else:
                        pass  # Handle enqueue failure

        except Exception as e:
            pass  # Handle any exceptions


# Run the main function using asyncio
if __name__ == "__main__":
    asyncio.run(main())
