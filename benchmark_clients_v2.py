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

    def final_report(self):
        total_duration = time.time() - self.start_time
        print("Final Report")
        print(f"Total Duration: {total_duration} seconds")
        print(f"Total Tokens Produced: {self.total_tokens}")
        print(f"Total Tokens per Second: {self.total_tokens / total_duration}")
        print(f"Total Requests Made: {self.total_requests}")

    def save_to_excel(self):
        os.makedirs("metrics", exist_ok=True)
        filename = f"metrics/{self.run_name}.xlsx"
        data = {
            'Time (seconds)': self.time_series,
            'Tokens per Second': self.tokens_per_second_series
        }
        df = pd.DataFrame(data)
        with pd.ExcelWriter(filename, engine='openpyxl') as writer:
            df.to_excel(writer, index=False, sheet_name='Tokens_Per_Second')
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
        self.save_to_excel()

class User:
    def __init__(self, session, base_url, framework, model, collector, prompts, user_id):
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

    async def make_request(self):
        while True:
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
                url = f"{self.base_url}/v1/chat/completions"
                data = {
                    "model": self.model,
                    "messages": [{"role": "user", "content": prompt['instruction'] + " " + prompt['context']}]
                }
            elif self.framework == 'TGI':
                url = f"{self.base_url}/generate"
                data = {
                    "inputs": prompt['instruction'] + " " + prompt['context'],
                    "parameters": {"max_new_tokens": 512}
                }
            else:
                raise ValueError("Unsupported framework")

            headers = {"Content-Type": "application/json"}

            # Print the first cURL request
            if not self.first_request_printed:
                json_data = json.dumps(data).replace('"', '\\"')
                curl_command = f'curl -X POST "{url}" -H "Content-Type: application/json" -d "{json_data}"'
                print(f"First cURL Request: {curl_command}")
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
                                response_text = response_json['choices'][0]['message']['content']
                            elif self.framework == 'ollama':
                                response_text = await response.text()
                            elif self.framework == 'TGI':
                                response_text = response_json.get('generated_text', '')
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
            
            await asyncio.sleep(0.01)  # Simulate variable request timing

    def report_individual_tokens(self):
        duration = time.time() - self.start_time
        tokens_per_second = self.tokens / duration if duration > 0 else 0
        print(f"User {self.user_id} Tokens/s: {tokens_per_second}, Total Tokens: {self.tokens}, Total Requests: {self.request_count}, Empty Responses: {self.empty_response_count}")

def load_prompts(file_path):
    with open(file_path, 'r') as f:
        return [json.loads(line) for line in f if line.strip()]

class UserSpawner:
    def __init__(self, user_def, collector: MetricsCollector, target_user_count=None, target_time=None):
        self.target_user_count = 1 if target_user_count is None else target_user_count
        self.target_time = time.time() + 10 if target_time is None else target_time
        self.data_collector = collector
        self.user_def = user_def
        self.user_list = []

    async def sync(self):
        while True:
            if self.current_user_count == self.target_user_count:
                return
            await asyncio.sleep(0.1)

    @property
    def current_user_count(self):
        return len(self.user_list)

    async def user_loop(self):
        with self.data_collector.collect_user():
            cookie_jar = aiohttp.DummyCookieJar()
            try:
                async with aiohttp.ClientSession(cookie_jar=cookie_jar) as session:
                    while True:
                        await self.user_def.make_request()
                        await asyncio.sleep(self.user_def.get_rest_time())
            except asyncio.CancelledError:
                pass



    def spawn_user(self):
        self.user_list.append(asyncio.create_task(self.user_loop()))

    async def cancel_all_users(self):
        try:
            user = self.user_list.pop()
            user.cancel()
        except IndexError:
            pass
        await asyncio.sleep(0)

    async def spawner_loop(self):
        while True:
            current_users = len(self.user_list)
            if current_users == self.target_user_count:
                await asyncio.sleep(0.1)
            elif current_users < self.target_user_count:
                self.spawn_user()
                sleep_time = max(
                    (self.target_time - time.time())
                    / (self.target_user_count - current_users),
                    0,
                )
                await asyncio.sleep(sleep_time)
            elif current_users > self.target_user_count:
                self.user_list.pop().cancel()
                sleep_time = max(
                    (time.time() - self.target_time)
                    / (current_users - self.target_user_count),
                    0,
                )
                await asyncio.sleep(sleep_time)




    async def aimd_loop(self, adjust_interval=5, sampling_interval=5, ss_delta=1):
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

async def start_benchmark_session(args, user_def):
    response_times = []
    async with aiohttp.ClientSession() as session:
        async with session.get(user_def.ping_url()) as response:
            assert response.status == 200
        await asyncio.sleep(0.3)

        for _ in range(5):
            time_start = time.time()
            async with session.get(user_def.ping_url()) as response:
                assert response.status == 200
            response_times.append(time.time() - time_start)
            await asyncio.sleep(0.3)
    ping_latency = sum(response_times) / len(response_times)
    print(f"Ping latency: {ping_latency}")

    collector = MetricsCollector(user_def, args.session_time, ping_latency - 0.005 if args.ping_correction else 0)
    user_spawner = UserSpawner(user_def, collector, args.max_users, target_time=time.time() + 20)
    asyncio.create_task(user_spawner.spawner_loop())
    asyncio.create_task(collector.report_loop())
    if args.max_users is None:
        asyncio.create_task(user_spawner.aimd_loop())

    if args.session_time is not None:
        await asyncio.sleep(args.session_time + 1)
    else:
        await asyncio.wait(user_spawner.user_list)

    await user_spawner.cancel_all_users()
    return 0

async def main(num_clients, job_length, url, framework, model, run_name, ping_correction):
    prompts = load_prompts('databricks-dolly-15k.jsonl')
    response_times = []
    async with aiohttp.ClientSession() as session:
        for _ in range(5):
            time_start = time.time()
            async with session.get(url) as response:
                assert response.status == 200
            response_times.append(time.time() - time_start)
            await asyncio.sleep(0.3)
    ping_latency = sum(response_times) / len(response_times)
    print(f"Ping latency: {ping_latency}")

    collector = MetricsCollector(session_time=job_length, ping_latency=ping_latency - 0.005 if ping_correction else 0)
    collector.run_name = run_name
    user_spawner = UserSpawner(User(session, url, framework, model, collector, prompts, user_id=0), collector, target_user_count=num_clients, target_time=time.time() + 20)
    asyncio.create_task(user_spawner.spawner_loop())
    asyncio.create_task(collector.report_loop())
    await asyncio.sleep(job_length + 1)
    await user_spawner.cancel_all_users()
    collector.final_report()
    collector.plot()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Run benchmark on an API')
    parser.add_argument('--num_clients', type=int, help='Number of concurrent clients')
    parser.add_argument('--job_length', type=int, help='Duration of the benchmark job in seconds')
    parser.add_argument('--url', type=str, help='URL of the API endpoint')
    parser.add_argument('--framework', type=str, choices=['vllm', 'ollama', 'lmdeploy', 'TGI'], help='Framework to use (vllm, ollama, lmdeploy, or TGI)')
    parser.add_argument('--model', type=str, help='Model name to use')
    parser.add_argument('--run_name', type=str, default='metrics_report', help='Name of the run for saving files')
    parser.add_argument('--ping_correction', type=bool, default=True, help='Apply ping latency correction')
    args = parser.parse_args()

    print(f"Running benchmark with {args.num_clients} clients for {args.job_length} seconds on {args.url} using {args.framework} framework with model {args.model}...")
    asyncio.run(main(args.num_clients, args.job_length, args.url, args.framework, args.model, args.run_name, args.ping_correction))
