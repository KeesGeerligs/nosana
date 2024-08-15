import asyncio
import aiohttp
import time
import json
import argparse
import random
from collections import defaultdict
import numpy as np
import contextlib
import matplotlib.pyplot as plt
import pandas as pd
import os
import math

class MetricsCollector:
    def __init__(self, session_time=None, ping_latency=0.0):
        self.start_time = time.time()
        self.response_word_bucket = defaultdict(int)
        self.response_head_latency_bucket = defaultdict(list)
        self.response_latency_bucket = defaultdict(list)
        self.on_going_requests = 0
        self.response_bucket = defaultdict(int)
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
            self.response_bucket[int(time.time())] += 1
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

    def collect_response_head_latency(self, latency):
        self.response_head_latency_bucket[int(time.time())].append(latency - self.ping_latency)

    def collect_tokens(self, count):
        self.total_tokens += count
        self.response_word_bucket[int(time.time())] += count

    async def report_loop(self, time_window=10):
        try:
            while True:
                await asyncio.sleep(time_window)
                current_time = time.time()
                report_time = int(current_time - self.start_time)
                tokens_per_second = sum(self.response_word_bucket.values()) / (current_time - self.start_time)
                self.time_series.append(report_time)
                self.tokens_per_second_series.append(tokens_per_second)
                print(f"Time: {report_time} seconds")
                print(f"Active Users: {self.on_going_users}")
                print(f"Total Requests: {self.total_requests}")
                print(f"Active Requests: {self.on_going_requests}")
                if self.response_latency_bucket:
                    latency_values = [v for values in self.response_latency_bucket.values() for v in values]
                    if latency_values:
                        print(f"Average Response Latency: {np.mean(latency_values)} seconds")
                        print(f"95th Percentile Latency: {np.percentile(latency_values, 95)} seconds")
                        print(f"99th Percentile Latency: {np.percentile(latency_values, 99)} seconds")
                print(f"Response Tokens/s: {tokens_per_second}")
                print(f"Total Tokens Produced: {self.total_tokens}")
                print()

                if self.session_time and report_time >= self.session_time:
                    self.final_report()
                    break
        except asyncio.CancelledError:
            self.final_report()
            print("Report loop cancelled")

    def final_report(self):
        total_duration = time.time() - self.start_time
        print("Final Report")
        print(f"Total Duration: {total_duration} seconds")
        print(f"Total Tokens Produced: {self.total_tokens}")
        print(f"Total Tokens per Second: {self.total_tokens / total_duration}")
        print(f"Total Requests Made: {self.total_requests}")

    def save_to_excel(self, sheet_name='Metrics'):
        os.makedirs("metrics", exist_ok=True)
        filename = f"metrics/{self.run_name}.xlsx"

        min_length = min(len(self.time_series), len(self.tokens_per_second_series), len(self.latency_series))
        data = {
            'Time (seconds)': self.time_series[:min_length],
            'Tokens per Second': self.tokens_per_second_series[:min_length],
            'Latency (seconds)': self.latency_series[:min_length]
        }

        df = pd.DataFrame(data)
        with pd.ExcelWriter(filename, engine='openpyxl', mode='a' if os.path.exists(filename) else 'w') as writer:
            if sheet_name in writer.book.sheetnames:
                del writer.book[sheet_name]
            df.to_excel(writer, index=False, sheet_name=sheet_name)
        print(f"Metrics saved to {filename}")

    def plot(self):
        plt.figure(figsize=(10, 5))
        plt.plot(self.time_series, self.tokens_per_second_series, label='Tokens/s')
        plt.xlabel('Time (seconds)')
        plt.ylabel('Tokens per Second')
        plt.title('Tokens per Second over Time')
        plt.legend()
        plt.grid(True)
        plt.show()

        plt.figure(figsize=(10, 5))
        plt.plot(self.time_series, self.latency_series, label='Latency (s)')
        plt.xlabel('Time (seconds)')
        plt.ylabel('Latency (seconds)')
        plt.title('Response Latency over Time')
        plt.legend()
        plt.grid(True)
        plt.show()


def load_prompts(file_path):
    with open(file_path, 'r') as f:
        return [json.loads(line) for line in f if line.strip()]

class User:
    def __init__(self, session, base_url, framework, model, collector, prompts, user_id, token=None):
        self.session = session
        self.base_url = base_url
        self.framework = framework
        self.model = model
        self.collector = collector
        self.prompts = prompts
        self.user_id = user_id
        self.tokens = 0
        self.start_time = time.time()
        self.first_request_printed = False
        self.request_count = 0
        self.empty_response_count = 0
        self.token = token

    async def make_request(self):
        prompt = random.choice(self.prompts)
        if self.framework == 'vllm':
            url = f"{self.base_url}/v1/completions"
            data = {
                "model": self.model,
                "prompt": prompt['instruction'] + " " + prompt['context'],
                "max_tokens": 512,
                "stop": ["\\n"]
            }
        elif self.framework == 'ollama':
            url = f"{self.base_url}/api/generate"
            data = {
                "model": self.model,
                "prompt": prompt['instruction'] + " " + prompt['context'],
                "stream": False,
                "num_predict": 512
            }
        elif self.framework == 'lmdeploy':
            url = f"{self.base_url}/v1/completions"
            data = {
                "model": self.model,
                "prompt": prompt['instruction'] + " " + prompt['context'],
                "max_tokens": 512,
                "stop": ["\\n"]
            }
        elif self.framework == 'TGI':
            url = f"{self.base_url}/generate"
            data = {
                "inputs": prompt['instruction'] + " " + prompt['context'],
                "parameters": {"max_new_tokens": 512}
            }
        elif self.framework == 'deepinfra':
            url = f"{self.base_url}/v1/openai/chat/completions"
            data = {
                "model": self.model,
                "messages": [{"role": "user", "content": prompt['instruction'] + " " + prompt['context']}]
            }
            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {self.token}"
            }
        else:
            raise ValueError("Unsupported framework")

        # Default headers
        headers = {"Content-Type": "application/json"}

        # Print the first cURL request
        if not self.first_request_printed:
            json_data = json.dumps(data).replace('"', '\\"')
            curl_command = f'curl -X POST "{url}" -H "Content-Type: application/json" -d "{json_data}"'
            if self.framework == 'deepinfra':
                curl_command = f'curl -X POST "{url}" -H "Content-Type: application/json" -H "Authorization: Bearer {self.token}" -d "{json_data}"'
            #print(f"First cURL Request: {curl_command}")
            self.first_request_printed = True

        try:
            with self.collector.collect_http_request(), self.collector.collect_user():
                start_time = time.time()
                async with self.session.post(url, headers=headers, json=data) as response:
                    self.request_count += 1
                    self.collector.collect_response_status(response.status)
                    if response.status == 200:
                        response_json = await response.json()
                        if self.framework in ['vllm']:
                            response_text = response_json['choices'][0]['text']
                        elif self.framework == 'lmdeploy':
                            #print(response_json)
                            response_text = response_json['choices'][0]['text']
                        elif self.framework == 'ollama':
                            response_text = await response.text()
                        elif self.framework == 'TGI':
                            response_text = response_json.get('generated_text', '')
                        elif self.framework == 'deepinfra':
                            response_text = response_json['choices'][0]['message']['content']
                        tokens = len(response_text.split())
                        self.collector.collect_tokens(tokens)
                        self.tokens += tokens
                        self.collector.collect_response_head_latency(time.time() - start_time)
                        if tokens == 0:
                            self.empty_response_count += 1
                            print(f"User {self.user_id} Request {self.request_count}: 0 tokens. Response: {response_text}")
                    else:
                        print(f"User {self.user_id} Request {self.request_count} received non-200 response: {response.status}")
        except Exception as e:
            print(f"User {self.user_id} Request {self.request_count} failed: {e}")

    async def user_loop(self):
        while True:
            await self.make_request()
            await asyncio.sleep(0.01)  # Simulate variable request timing


class UserSpawner:
    def __init__(self, base_url, framework, model, collector: MetricsCollector, prompts, target_user_count=None, target_time=None, token=None):
        self.target_user_count = 1 if target_user_count is None else target_user_count
        self.target_time = time.time() + 10 if target_time is None else target_time
        self.data_collector = collector
        self.base_url = base_url
        self.framework = framework
        self.model = model
        self.prompts = prompts
        self.user_list = []
        self.token = token

    @property
    def current_user_count(self):
        return len(self.user_list)

    async def user_loop(self, session, user_id):
        user = User(session, self.base_url, self.framework, self.model, self.data_collector, self.prompts, user_id, self.token)
        await user.user_loop()

    def spawn_user(self, session, user_id):
        #print(f"Spawning user {user_id}")
        task = asyncio.create_task(self.user_loop(session, user_id))
        self.user_list.append(task)

    async def cancel_all_users(self):
        while self.user_list:
            user = self.user_list.pop()
            user.cancel()
        await asyncio.sleep(0)

    async def spawner_loop(self, session):
        try:
            while True:
                current_users = len(self.user_list)
                if current_users == self.target_user_count:
                    await asyncio.sleep(0.1)
                elif current_users < self.target_user_count:
                    self.spawn_user(session, current_users)
                    sleep_time = max(
                        (self.target_time - time.time())
                        / (self.target_user_count - current_users),
                        0,
                    )
                    await asyncio.sleep(sleep_time)
                elif current_users > self.target_user_count:
                    user = self.user_list.pop()
                    user.cancel()
                    sleep_time = max(
                        (time.time() - self.target_time)
                        / (current_users - self.target_user_count),
                        0,
                    )
                    await asyncio.sleep(sleep_time)
        except asyncio.CancelledError:
            for task in self.user_list:
                task.cancel()


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
                    cwnd = self.current_user_count
                    target_cwnd = max(int(cwnd * (1 + ss_delta)), cwnd + 1)
                    self.target_user_count = target_cwnd
                    self.target_time = time.time() + adjust_interval
                    print(f"SS: {cwnd} -> {target_cwnd}")
                    await asyncio.sleep(adjust_interval)
                else:
                    cwnd = self.current_user_count
                    target_cwnd = math.ceil(cwnd * 0.5)
                    self.target_user_count = target_cwnd
                    self.target_time = time.time() + adjust_interval
                    print(f"SS Ended: {target_cwnd}")
                    break

            await self.sync()
            await asyncio.sleep(min(adjust_interval, sampling_interval, 10))
            return 0

def get_ping_url(base_url, framework):
    if framework == 'vllm':
        return f"{base_url}/v1/completions"
    elif framework == 'ollama':
        return f"{base_url}/api/generate"
    elif framework == 'lmdeploy':
        return f"{base_url}/v1/completions"
    elif framework == 'TGI':
        return f"{base_url}/generate"
    elif framework == 'deepinfra':
        return f"{base_url}/v1/openai/chat/completions"
    else:
        raise ValueError("Unsupported framework")

def get_ping_data(framework, model):
    if framework == 'vllm':
        return {
            "model": model,
            "prompt": "ping",
            "max_tokens": 1
        }
    elif framework == 'ollama':
        return {
            "model": model,
            "prompt": "ping",
            "stream": False,
            "num_predict": 1
        }
    elif framework == 'lmdeploy':
        return {
            "model": model,
            "prompt": "ping",
            "max_tokens": 1
        }
    elif framework == 'TGI':
        return {
            "inputs": "ping",
            "parameters": {"max_new_tokens": 1}
        }
    elif framework == 'deepinfra':
        return {
            "model": model,
            "messages": [{"role": "user", "content": "ping"}]
        }
    else:
        raise ValueError("Unsupported framework")

async def wait_for_service(base_url, framework, model, token=None, check_interval=60):
    ping_url = get_ping_url(base_url, framework)
    ping_data = get_ping_data(framework, model)

    headers = {"Content-Type": "application/json"}
    if framework == 'deepinfra':
        headers["Authorization"] = f"Bearer {token}"

    start_time = time.time()
    while True:
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(ping_url, headers=headers, json=ping_data) as response:
                    if response.status == 200:
                        break
                    else:
                        print(f"Unexpected status {response.status} received from {ping_url}")
        except aiohttp.ClientError as e:
            print(f"HTTP request failed: {e}")
        await asyncio.sleep(check_interval)
    
    return time.time() - start_time

async def run_benchmark_series(num_clients_list, job_length, url, framework, model, run_name, ping_correction, token=None):
    prompts = load_prompts('databricks-dolly-15k.jsonl')
    wait_time = await wait_for_service(url, framework, model)
    print(f"Service became available after {wait_time} seconds.")    
    ping_url = get_ping_url(url, framework)
    ping_data = get_ping_data(framework, model)

    headers = {"Content-Type": "application/json"}
    if framework == 'deepinfra':
        headers["Authorization"] = f"Bearer {token}"

    for num_clients in num_clients_list:
        response_times = []
        async with aiohttp.ClientSession() as session:
            for _ in range(5):
                time_start = time.time()
                try:
                    async with session.post(ping_url, headers=headers, json=ping_data) as response:
                        if response.status == 200:
                            response_times.append(time.time() - time_start)
                        else:
                            print(f"Unexpected status code {response.status} received from {ping_url}")
                            response_times.append(float('inf')) 
                except aiohttp.ClientError as e:
                    print(f"HTTP request failed: {e}")
                    response_times.append(float('inf')) 
                await asyncio.sleep(0.3)
                
            ping_latency = sum(rt for rt in response_times if rt < float('inf')) / len(response_times)
            print(f"Ping latency: {ping_latency}")

            collector = MetricsCollector(session_time=job_length, ping_latency=ping_latency - 0.005 if ping_correction else 0)
            collector.run_name = run_name
            user_spawner = UserSpawner(url, framework, model, collector, prompts, target_user_count=num_clients, target_time=time.time() + 20, token=token)
            spawner_task = asyncio.create_task(user_spawner.spawner_loop(session))
            report_task = asyncio.create_task(collector.report_loop(time_window=5))  # Adjust the time window here
            await asyncio.sleep(job_length + 1)
            await user_spawner.cancel_all_users()
            spawner_task.cancel()
            report_task.cancel()
            collector.final_report()
            collector.save_to_excel(sheet_name=f'CU_{num_clients}')



if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Run benchmark on an API')
    parser.add_argument('--num_clients_list', type=int, nargs='+', help='List of concurrent clients to test with')
    parser.add_argument('--job_length', type=int, help='Duration of the benchmark job in seconds')
    parser.add_argument('--url', type=str, help='URL of the API endpoint')
    parser.add_argument('--framework', type=str, choices=['vllm', 'ollama', 'lmdeploy', 'TGI', 'deepinfra'], help='Framework to use (vllm, ollama, lmdeploy, TGI, or deepinfra)')
    parser.add_argument('--model', type=str, help='Model name to use', default='llama3.1')
    parser.add_argument('--run_name', type=str, default='metrics_report', help='Name of the run for saving files')
    parser.add_argument('--ping_correction', type=bool, default=True, help='Apply ping latency correction')
    parser.add_argument('--token', type=str, help='Authorization token for Deepinfra')
    args = parser.parse_args()

    print(f"Running benchmark series with clients {args.num_clients_list} for {args.job_length} seconds each on {args.url} using {args.framework} framework with model {args.model}...")
    asyncio.run(run_benchmark_series(args.num_clients_list, args.job_length, args.url, args.framework, args.model, args.run_name, args.ping_correction, args.token))
