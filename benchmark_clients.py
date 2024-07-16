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

class MetricsCollector:
    def __init__(self):
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

    @contextlib.contextmanager
    def collect_http_request(self):
        start_time = time.time()
        self.on_going_requests += 1
        self.total_requests += 1
        try:
            yield
        finally:
            self.on_going_requests -= 1
            elapsed = time.time() - start_time
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
        self.response_head_latency_bucket[int(time.time())].append(latency)

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
                    print(f"Median Response Latency: {np.percentile(latency_values, 50)} seconds")
                    print(f"95% Response Latency: {np.percentile(latency_values, 95)} seconds")
            print(f"Response Tokens/s: {tokens_per_second}")
            print(f"Total Tokens Produced: {self.total_tokens}")
            print()

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
        plt.show()  # Only show the plot without saving
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
                    "temperature": 0.7,
                    "top_p": 0.9,
                    "n": 1,
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
            else:
                raise ValueError("Unsupported framework")

            headers = {"Content-Type": "application/json"}

            # Print the first cURL request
            if not self.first_request_printed:
                if self.framework == 'vllm':
                    json_data = json.dumps(data).replace('"', '\\"')
                    curl_command = f'curl -X POST "{url}" -H "Content-Type: application/json" -d "{json_data}"'
                else:
                    json_data = json.dumps(data).replace('"', '\\"')
                    curl_command = f'curl -X POST {url} -H "Content-Type: application/json" -d "{json_data}"'
                print(f"First cURL Request: {curl_command}")
                self.first_request_printed = True

            try:
                with self.collector.collect_http_request(), self.collector.collect_user():
                    start_time = time.time()
                    async with self.session.post(url, headers=headers, json=data) as response:
                        self.request_count += 1  # Increment request count
                        self.collector.collect_response_status(response.status)
                        if response.status == 200:
                            response_json = await response.json()
                            if self.framework == 'vllm':
                                response_text = response_json['choices'][0]['text']
                            else:
                                response_text = await response.text()
                            #print(response_text)
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

async def main(num_clients, job_length, url, framework, model, run_name):
    prompts = load_prompts('databricks-dolly-15k.jsonl')
    collector = MetricsCollector()
    collector.run_name = run_name
    async with aiohttp.ClientSession() as session:
        users = [User(session, url, framework, model, collector, prompts, user_id=i) for i in range(num_clients)]
        tasks = [asyncio.create_task(user.make_request()) for user in users]
        report_task = asyncio.create_task(collector.report_loop(time_window=3))  
        await asyncio.sleep(job_length)  
        for task in tasks:
            task.cancel() 
        report_task.cancel()  
        try:
            await asyncio.gather(*tasks, return_exceptions=True)  
            await report_task  
        except asyncio.CancelledError:
            print("Tasks and report loop have been cancelled.")
        finally:
            for user in users:
                user.report_individual_tokens() 
            collector.final_report()
            collector.plot()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Run benchmark on an API')
    parser.add_argument('--num_clients', type=int, help='Number of concurrent clients')
    parser.add_argument('--job_length', type=int, help='Duration of the benchmark job in seconds')
    parser.add_argument('--url', type=str, help='URL of the API endpoint')
    parser.add_argument('--framework', type=str, choices=['vllm', 'ollama'], help='Framework to use (vllm or ollama)')
    parser.add_argument('--model', type=str, help='Model name to use')
    parser.add_argument('--run_name', type=str, default='metrics_report', help='Name of the run for saving files')
    args = parser.parse_args()

    print(f"Running benchmark with {args.num_clients} clients for {args.job_length} seconds on {args.url} using {args.framework} framework with model {args.model}...")
    asyncio.run(main(args.num_clients, args.job_length, args.url, args.framework, args.model, args.run_name))
