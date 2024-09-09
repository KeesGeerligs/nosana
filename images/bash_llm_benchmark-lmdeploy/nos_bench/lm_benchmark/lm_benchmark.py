import asyncio
import aiohttp
import time
import json
import argparse
import random
from collections import defaultdict
import numpy as np
import contextlib
import pandas as pd
import os
import math
import re
import subprocess
import threading
from .sysmain import get_extra
from datetime import datetime

def get_gpu_info():
    """Retrieve GPU clock speed, power usage, and utilization for all GPUs."""
    try:
        output = subprocess.check_output(
            ['nvidia-smi', '--query-gpu=index,clocks.gr,power.draw,utilization.gpu', '--format=csv,nounits,noheader'],
            text=True
        )
        gpu_info = []
        for line in output.strip().split('\n'):
            index, clock_speed, power_usage, utilization = line.split(', ')
            gpu_info.append({
                'index': int(index),
                'clock_speed': float(clock_speed),
                'power_usage': float(power_usage),
                'utilization': float(utilization)
            })
        return gpu_info
    except subprocess.CalledProcessError as e:
        print(f"Failed to retrieve GPU info: {e}")
        return []
    except Exception as e:
        print(f"Unexpected error when retrieving GPU info: {e}")
        return []

class GPUMonitor:
    def __init__(self):
        self.gpu_data = []
        self.stop_monitoring = threading.Event()

    def start_monitoring(self):
        self.monitoring_thread = threading.Thread(target=self._monitor_gpu)
        self.monitoring_thread.start()

    def stop_monitoring(self):
        self.stop_monitoring.set()
        self.monitoring_thread.join()

    def _monitor_gpu(self):
        while not self.stop_monitoring.is_set():
            try:
                gpu_info = get_gpu_info()
                timestamp = datetime.now().isoformat()
                for gpu in gpu_info:
                    self.gpu_data.append({
                        'timestamp': timestamp,
                        'gpu_index': gpu['index'],
                        'clock_speed': gpu['clock_speed'],
                        'power_usage': gpu['power_usage'],
                        'utilization': gpu['utilization']
                    })
                time.sleep(1)  # Collect data every second
            except Exception as e:
                print(f"Error in GPU monitoring thread: {e}")
                time.sleep(1)  # Wait a bit before trying again

    def get_gpu_stats(self, start_time, end_time):
        start_time_dt = datetime.fromtimestamp(start_time)
        end_time_dt = datetime.fromtimestamp(end_time)
        relevant_data = [d for d in self.gpu_data if start_time_dt <= datetime.fromisoformat(d['timestamp']) <= end_time_dt]
        if relevant_data:
            stats = defaultdict(lambda: {'clock_speed': [], 'power_usage': [], 'utilization': []})
            for d in relevant_data:
                stats[d['gpu_index']]['clock_speed'].append(d['clock_speed'])
                stats[d['gpu_index']]['power_usage'].append(d['power_usage'])
                stats[d['gpu_index']]['utilization'].append(d['utilization'])
            
            return {
                gpu_index: {
                    'avg_clock_speed': sum(data['clock_speed']) / len(data['clock_speed']),
                    'avg_power_usage': sum(data['power_usage']) / len(data['power_usage']),
                    'avg_utilization': sum(data['utilization']) / len(data['utilization'])
                }
                for gpu_index, data in stats.items()
            }
        return {}

class MetricsCollector:
    def __init__(self, session_time=None, ping_latency=0.0):
        self.start_time = time.time()
        self.response_word_bucket = defaultdict(int)
        self.response_latency_bucket = defaultdict(list)
        self.on_going_requests = 0
        self.total_requests = 0
        self.on_going_users = 0
        self.status_bucket = defaultdict(int)
        self.total_tokens = 0
        self.time_series = []
        self.tokens_per_second_series = []
        self.latency_series = []
        self.run_name = "metrics_report"
        self.session_time = session_time
        self.ping_latency = ping_latency
        self.last_report_time = self.start_time
        self.last_report_tokens = 0
        self.gpu_monitor = GPUMonitor()
        self.gpu_stats = {}

    @contextlib.contextmanager
    def collect_http_request(self):
        start_time = time.time()
        self.on_going_requests += 1
        self.total_requests += 1
        try:
            yield
        finally:
            self.on_going_requests -= 1
            elapsed = time.time() - start_time - self.ping_latency
            self.response_latency_bucket[int(time.time())].append(elapsed)
            self.latency_series.append(elapsed)

    @contextlib.contextmanager
    def collect_user(self):
        self.on_going_users += 1
        try:
            yield
        finally:
            self.on_going_users -= 1

    def collect_response_status(self, status):
        self.status_bucket[status] += 1

    def collect_tokens(self, count):
        self.total_tokens += count
        self.response_word_bucket[int(time.time())] += count

    async def report_loop(self, time_window=10):
        try:
            while True:
                await asyncio.sleep(time_window)
                current_time = time.time()
                report_time = int(current_time - self.start_time)
                tokens_since_last_report = self.total_tokens - self.last_report_tokens
                time_since_last_report = current_time - self.last_report_time
                
                if time_since_last_report > 0:
                    current_throughput = tokens_since_last_report / time_since_last_report
                
                self.time_series.append(report_time)
                self.tokens_per_second_series.append(current_throughput)
                
                self.last_report_time = current_time
                self.last_report_tokens = self.total_tokens
                
                if self.session_time and report_time >= self.session_time:
                    break
        except asyncio.CancelledError:
            pass

    def start_gpu_monitoring(self):
        self.gpu_monitor.start_monitoring()

    def stop_gpu_monitoring(self):
        self.gpu_monitor.stop_monitoring.set()  # Set the Event to stop monitoring
        if hasattr(self.gpu_monitor, 'monitoring_thread'):
            self.gpu_monitor.monitoring_thread.join()  # Wait for the monitoring thread to finish

    def final_report(self):
        total_duration = time.time() - self.start_time
        average_tokens_per_second = self.total_tokens / total_duration
        
        self.gpu_stats = self.gpu_monitor.get_gpu_stats(self.start_time, time.time())
        
        report = {
            "total_duration": round(total_duration, 2),
            "total_tokens_produced": self.total_tokens,
            "average_tokens_per_second": round(average_tokens_per_second, 2),
            "total_requests_made": self.total_requests,
            "status_distribution": dict(self.status_bucket),
            "average_latency": round(sum(self.latency_series) / len(self.latency_series), 2) if self.latency_series else None,
            "gpu_stats": self.gpu_stats
        }
        
        print(json.dumps(report, indent=2))
        return report

class FrameworkHandler:
    def __init__(self, framework, base_url, model, token=None, endpoint='/v1/chat/completions', use_prompt_field=False):
        self.framework = framework
        self.base_url = base_url
        self.model = model
        self.token = token
        self.endpoint = endpoint
        self.use_prompt_field = use_prompt_field

    def get_request_url(self):
        return f"{self.base_url}{self.endpoint}"

    def get_request_data(self, prompt):
        if self.use_prompt_field:
            return {
                "model": self.model,
                "prompt": prompt,
                "max_tokens": 512
            }
        else:
            return {
                "model": self.model,
                "messages": [{"role": "user", "content": prompt}],
                "max_tokens": 512
            }

    def get_headers(self):
        headers = {"Content-Type": "application/json"}
        if self.token:
            headers["Authorization"] = f"Bearer {self.token}"
        return headers

class User:
    def __init__(self, session, handler: FrameworkHandler, collector: MetricsCollector, prompts, user_id):
        self.session = session
        self.handler = handler
        self.collector = collector
        self.prompts = prompts
        self.user_id = user_id
        self.tokens = 0
        self.request_count = 0

    async def make_request(self):
        prompt = random.choice(self.prompts)
        request_data = self.handler.get_request_data(prompt['instruction'] + " " + prompt['context'])
        headers = self.handler.get_headers()
        url = self.handler.get_request_url()

        try:
            with self.collector.collect_http_request(), self.collector.collect_user():
                async with self.session.post(url, headers=headers, json=request_data) as response:
                    self.request_count += 1
                    self.collector.collect_response_status(response.status)
                    if response.status == 200:
                        response_json = await response.json()

                        if self.handler.use_prompt_field:
                            response_text = response_json['choices'][0]['text']
                        else:
                            response_text = response_json['choices'][0]['message']['content']

                        tokens = len(response_text.split())
                        self.collector.collect_tokens(tokens)
                        self.tokens += tokens
                    else:
                        print(f"Unexpected status {response.status} received for request {self.request_count}", flush=True)
        except Exception as e:
            print(f"User {self.user_id} Request {self.request_count} failed: {e}", flush=True)

    async def user_loop(self):
        while True:
            await self.make_request()
            await asyncio.sleep(0.01)

class UserSpawner:
    def __init__(self, handler: FrameworkHandler, collector: MetricsCollector, prompts, target_user_count=None, target_time=None):
        self.target_user_count = target_user_count or 1
        self.target_time = time.time() + 10 if target_time is None else target_time
        self.data_collector = collector
        self.handler = handler
        self.prompts = prompts
        self.semaphore = asyncio.Semaphore(self.target_user_count)
        self.user_tasks = [] 

    async def user_loop(self, session, user_id):
        async with self.semaphore:
            user = User(session, self.handler, self.data_collector, self.prompts, user_id)
            await user.user_loop()

    def spawn_user(self, session, user_id):
        task = asyncio.create_task(self.user_loop(session, user_id))
        self.user_tasks.append(task)
        return task

    async def spawner_loop(self, session):
        try:
            current_users = []
            while True:
                if len(current_users) < self.target_user_count:
                    task = self.spawn_user(session, len(current_users))
                    current_users.append(task)
                await asyncio.sleep(0.01)

                current_users = [task for task in current_users if not task.done()]
        except asyncio.CancelledError:
            for task in current_users:
                task.cancel()
            await asyncio.gather(*current_users, return_exceptions=True)

    async def aimd_loop(self, session, adjust_interval=1, sampling_interval=5, ss_delta=2):
        def linear_regression(x, y):
            x = tuple((i, 1) for i in x)
            y = tuple(i for i in y)
            a, b = np.linalg.lstsq(x, y, rcond=None)[0]
            return a, b

        while True:
            while True:
                now = math.floor(time.time())
                words_per_seconds = [
                    self.data_collector.response_word_bucket[i]
                    for i in range(now - sampling_interval, now)
                ]
                slope = linear_regression(
                    range(len(words_per_seconds)), words_per_seconds
                )[0]
                if slope >= -0.01:
                    cwnd = self.target_user_count
                    target_cwnd = max(int(cwnd * (1 + ss_delta)), cwnd + 1)
                    self.target_user_count = target_cwnd
                    self.target_time = time.time() + adjust_interval
                    await asyncio.sleep(adjust_interval)
                else:
                    cwnd = self.target_user_count
                    target_cwnd = max(1, math.ceil(cwnd * 0.5))
                    self.target_user_count = target_cwnd
                    self.target_time = time.time() + adjust_interval
                    break

            await self.sync()
            await asyncio.sleep(min(adjust_interval, sampling_interval, 10))

    async def sync(self):
        await asyncio.sleep(0)
        
    async def cancel_all_users(self):
        for task in self.user_tasks:
            task.cancel()
        await asyncio.gather(*self.user_tasks, return_exceptions=True)
        self.user_tasks.clear()

def count_tokens(text):
    tokens = re.findall(r'\S+', text)
    return len(tokens)

def filter_prompts(prompts, max_tokens=512):
    filtered_prompts = []
    for prompt in prompts:
        total_tokens = count_tokens(prompt['instruction']) + count_tokens(prompt['context'])
        if total_tokens <= max_tokens:
            filtered_prompts.append(prompt)
    return filtered_prompts

def load_prompts(file_path, max_tokens=512):
    full_path = os.path.join(os.path.dirname(__file__), file_path)
    with open(full_path, 'r') as f:
        all_prompts = [json.loads(line) for line in f if line.strip()]
    return filter_prompts(all_prompts, max_tokens)

async def wait_for_service(handler: FrameworkHandler, check_interval=30):
    ping_url = handler.get_request_url()
    ping_data = handler.get_request_data("ping")
    headers = handler.get_headers()

    start_time = time.time()
    while True:
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(ping_url, headers=headers, json=ping_data) as response:
                    if response.status == 200:
                        return time.time() - start_time
        except aiohttp.ClientError:
            pass
        await asyncio.sleep(check_interval)

async def get_ping_latencies(handler: FrameworkHandler, num_samples, use_health_check=False):
    response_times = []
    timeout = aiohttp.ClientTimeout(total=10)

    async with aiohttp.ClientSession(timeout=timeout) as session:
        for _ in range(num_samples):
            time_start = time.time()
            endpoint = "/health" if use_health_check else "/v1/models"
            url = f"{handler.base_url}{endpoint}"
            
            try:
                async with session.get(url, headers=handler.get_headers()) as response:
                    if response.status == 200:
                        response_times.append(time.time() - time_start)
            except (aiohttp.ClientError, asyncio.TimeoutError):
                response_times.append(float('inf'))
            
            await asyncio.sleep(0.3)

    return response_times

async def run_benchmark_series(num_clients_list, job_length, url, framework, model, run_name, ping_correction, enable_aimd, token=None, endpoint='/v1/chat/completions', use_prompt_field=False):
    
    print("Starting benchmark service...")

    prompts = load_prompts('databricks-dolly-15k.jsonl')  
    handler = FrameworkHandler(framework, url, model, token, endpoint, use_prompt_field)
    await wait_for_service(handler)

    print("Testing latency...")

    response_times = await get_ping_latencies(handler, 5)
    ping_latency = sum(rt for rt in response_times if rt < float('inf')) / len(response_times)
    print(f"Ping latency: {ping_latency:.4f} seconds")

    for num_clients in num_clients_list:
        print(f"\nRunning benchmark for model {model} with {num_clients} CU")
        
        collector = MetricsCollector(session_time=job_length, ping_latency=ping_latency - 0.005 if ping_correction else 0)
        collector.run_name = run_name
        collector.start_gpu_monitoring()

        async with aiohttp.ClientSession() as session:
            user_spawner = UserSpawner(handler, collector, prompts, target_user_count=num_clients, target_time=time.time() + 20)
            spawner_task = asyncio.create_task(user_spawner.spawner_loop(session))
            if enable_aimd:
                aimd_task = asyncio.create_task(user_spawner.aimd_loop(session))
            report_task = asyncio.create_task(collector.report_loop(time_window=5))
            await asyncio.sleep(job_length + 1)
            await user_spawner.cancel_all_users()
            spawner_task.cancel()
            if enable_aimd:
                aimd_task.cancel()
            report_task.cancel()
            collector.stop_gpu_monitoring()
            collector.final_report()

def main():
    parser = argparse.ArgumentParser(description='Run benchmark on an API')
    parser.add_argument('--num_clients_list', type=int, nargs='+', help='List of concurrent clients to test with', default=[100, 50, 10, 5, 1])
    parser.add_argument('--job_length', type=int, help='Duration of the benchmark job in seconds', default=300)
    parser.add_argument('--url', type=str, help='URL of the API endpoint')
    parser.add_argument('--framework', type=str, choices=['standard', 'token_API'], help='API endpoint to use', default="standard")
    parser.add_argument('--model', type=str, help='Model name to use', default='llama3.1')
    parser.add_argument('--run_name', type=str, default='metrics_report', help='Name of the run for saving files')
    parser.add_argument('--enable_aimd', action='store_true', help='Enable AIMD control')
    parser.add_argument('--ping_correction', action='store_true', help='Apply ping latency correction')
    parser.add_argument('--token', type=str, help='Authorization token')
    parser.add_argument('--endpoint', type=str, help='API endpoint for the requests', default='/v1/chat/completions')
    parser.add_argument('--use_prompt_field', action='store_true', help='Use the prompt field instead of messages')
    args = parser.parse_args()

    # Get the system specs before the benchmarking
    sys_info = get_extra()
    print(f"system specs: {sys_info['specs']}\n")

    asyncio.run(run_benchmark_series(
        args.num_clients_list,
        args.job_length,
        args.url,
        args.framework,
        args.model,
        args.run_name,
        args.ping_correction,
        args.enable_aimd,
        args.token,
        args.endpoint,
        args.use_prompt_field
    ))

if __name__ == "__main__":
    main()