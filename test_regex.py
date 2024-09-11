import re
import json

# Sample output from the job
log_output = """
==========

== CUDA ==

==========

CUDA Version 12.4.1

Container image Copyright (c) 2016-2023, NVIDIA CORPORATION & AFFILIATES. All rights reserved.

This container image and its contents are governed by the NVIDIA Deep Learning Container License.
By pulling and using the container, you accept the terms and conditions of this license:
https://developer.nvidia.com/ngc/nvidia-deep-learning-container-license

A copy of this license is made available in this container at /NGC-DL-CONTAINER-LICENSE for your convenience.

Starting lmdeploy service...

/opt/py3/lib/python3.10/site-packages/transformers/utils/hub.py:127: FutureWarning: Using `TRANSFORMERS_CACHE` is deprecated and will be removed in v5 of Transformers. Use `HF_HOME` instead.
  warnings.warn(
There was a problem when trying to write in your cache folder (/root/.cache/huggingface/). You should set the environment variable TRANSFORMERS_CACHE to a writable directory.

Running lm-benchmark...

Convert to turbomind format:   0%|          | 0/32 [00:00<?, ?it/s]
Convert to turbomind format:   3%|▎         | 1/32 [00:10<05:13, 10.11s/it]
Convert to turbomind format:  22%|██▏       | 7/32 [00:10<00:26,  1.07s/it]
Convert to turbomind format:  41%|████      | 13/32 [00:10<00:09,  2.08it/s]
Convert to turbomind format:  59%|█████▉    | 19/32 [00:10<00:03,  3.62it/s]
Convert to turbomind format:  78%|███████▊  | 25/32 [00:10<00:01,  5.67it/s]
Convert to turbomind format:  97%|█████████▋| 31/32 [00:10<00:00,  8.31it/s]

INFO:     Started server process [39]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:23333 (Press CTRL+C to quit)

/opt/py3/lib/python3.10/site-packages/numpy/core/fromnumeric.py:3504: RuntimeWarning: Mean of empty slice.
  return _methods._mean(a, axis=axis, dtype=dtype,
/opt/py3/lib/python3.10/site-packages/numpy/core/_methods.py:129: RuntimeWarning: invalid value encountered in scalar divide
  ret = ret.dtype.type(ret / rcount)
/opt/py3/lib/python3.10/site-packages/numpy/core/fromnumeric.py:3504: RuntimeWarning: Mean of empty slice.
  return _methods._mean(a, axis=axis, dtype=dtype,
/opt/py3/lib/python3.10/site-packages/numpy/core/_methods.py:129: RuntimeWarning: invalid value encountered in scalar divide
  ret = ret.dtype.type(ret / rcount)
/opt/py3/lib/python3.10/site-packages/numpy/core/fromnumeric.py:3504: RuntimeWarning: Mean of empty slice.
  return _methods._mean(a, axis=axis, dtype=dtype,
/opt/py3/lib/python3.10/site-packages/numpy/core/_methods.py:129: RuntimeWarning: invalid value encountered in scalar divide
  ret = ret.dtype.type(ret / rcount)
/opt/py3/lib/python3.10/site-packages/numpy/core/fromnumeric.py:3504: RuntimeWarning: Mean of empty slice.
  return _methods._mean(a, axis=axis, dtype=dtype,
/opt/py3/lib/python3.10/site-packages/numpy/core/_methods.py:129: RuntimeWarning: invalid value encountered in scalar divide
  ret = ret.dtype.type(ret / rcount)

Starting to retrieve system configurations...
Starting internet speed test...
Failed to retrieve speed test configuration: HTTP Error 403: Forbidden

system specs: {'system': 'Linux', 'memory_GB': 31.22, 'cpu': 'Intel(R) Core(TM) i9-14900K', 'os_version': 'Ubuntu 22.04.4 LTS', 'cpu_info': {'processor': 'x86_64', 'physical_cores': 16, 'logical_cores': 32}, 'memory_info': {'total_memory_GB': 31.22, 'available_memory_GB': 27.9, 'used_memory_GB': 2.52, 'memory_utilization': 10.6}, 'disk_info': {'total_disk_space_GB': 1006.85, 'used_disk_space_GB': 94.09, 'free_disk_space_GB': 861.54, 'disk_space_utilization': 9.8}, 'gpu_info': {'0': 'there_is_gpu', '1': {'id': 0, 'name': 'NVIDIA GeForce RTX 4090', 'driver': '560.94', 'gpu_memory_total_MB': 24564.0, 'gpu_memory_free_MB': 386.0, 'gpu_memory_used_MB': 23757.0, 'gpu_load_percent': 5.0, 'gpu_temperature_C': 49.0}}, 'download_speed': 'unknown', 'upload_speed': 'unknown'}

Starting benchmark service...
Testing latency...
Ping latency: 0.0015 seconds

Running benchmark for model llama3.1 with 100 CU
{
  "total_duration": 33.45,
  "total_tokens_produced": 84,
  "average_tokens_per_second": 2.51,
  "total_requests_made": 108,
  "status_distribution": {
    "200": 8
  },
  "average_latency": 28.2,
  "gpu_0_clock_speed": NaN,
  "gpu_0_power_usage": NaN,
  "gpu_0_utilization": NaN
}

Running benchmark for model llama3.1 with 50 CU
{
  "total_duration": 33.0,
  "total_tokens_produced": 0,
  "average_tokens_per_second": 0.0,
  "total_requests_made": 50,
  "status_distribution": {},
  "average_latency": 30.74,
  "gpu_0_clock_speed": NaN,
  "gpu_0_power_usage": NaN,
  "gpu_0_utilization": NaN
}

Running benchmark for model llama3.1 with 10 CU
{
  "total_duration": 32.81,
  "total_tokens_produced": 240,
  "average_tokens_per_second": 7.32,
  "total_requests_made": 14,
  "status_distribution": {
    "200": 4
  },
  "average_latency": 22.11,
  "gpu_0_clock_speed": NaN,
  "gpu_0_power_usage": NaN,
  "gpu_0_utilization": NaN
}

Running benchmark for model llama3.1 with 5 CU
{
  "total_duration": 32.05,
  "total_tokens_produced": 2404,
  "average_tokens_per_second": 75.0,
  "total_requests_made": 25,
  "status_distribution": {
    "200": 20
  },
  "average_latency": 6.19,
  "gpu_0_clock_speed": NaN,
  "gpu_0_power_usage": NaN,
  "gpu_0_utilization": NaN
}

Running benchmark for model llama3.1 with 1 CU
{
  "total_duration": 31.78,
  "total_tokens_produced": 222,
  "average_tokens_per_second": 6.99,
  "total_requests_made": 6,
  "status_distribution": {
    "200": 5
  },
  "average_latency": 5.16,
  "gpu_0_clock_speed": NaN,
  "gpu_0_power_usage": NaN,
  "gpu_0_utilization": NaN
}
"""

regex_patterns = {
    "results_CU_100": r"Running benchmark for model llama3.1 with 100 CU\s*({.*?}\s*\n)",
    "results_CU_50": r"Running benchmark for model llama3.1 with 50 CU\s*({.*?}\s*\n)",
    "results_CU_10": r"Running benchmark for model llama3.1 with 10 CU\s*({.*?}\s*\n)",
    "results_CU_5": r"Running benchmark for model llama3.1 with 5 CU\s*({.*?}\s*\n)",
    "results_CU_1": r"Running benchmark for model llama3.1 with 1 CU\s*({.*?}\s*\n)"
}

def extract_json(log, pattern):
    match = re.search(pattern, log, re.DOTALL)
    if match:
        # Extract JSON string
        json_string = match.group(1)

        try:
            # Try to parse it
            json_data = json.loads(json_string)
            return json_data
        except json.JSONDecodeError as e:
            return f"Error parsing JSON: {e}"
    return "No match found"

# Test each regex pattern
for key, pattern in regex_patterns.items():
    print(f"\nTesting pattern for {key}...")
    result = extract_json(log_output, pattern)
    print(result)