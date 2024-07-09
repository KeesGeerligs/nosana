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

    def save_to_excel(self, filename="metrics_report.xlsx"):
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
        self.first_request_printed = False  # Flag to ensure the first request is printed only once

    async def make_request(self):
        while True:
            prompt = random.choice(self.prompts)
            if self.framework == 'vllm':
                url = f"{self.base_url}/v1/completions"
                data = {
                    "model": self.model,
                    "prompt": prompt['instruction'] + " " + prompt['context'],
                    "max_tokens": 50,
                    "temperature": 0.7,
                    "top_p": 0.9,
                    "n": 1,
                    "stop": ["\n"]
                }
            elif self.framework == 'ollama':
                url = f"{self.base_url}/api/generate"
                data = {
                    "model": self.model,
                    "prompt": prompt['instruction'] + " " + prompt['context'],
                    "stream": False,
                    "num_predict": 50
                }
            else:
                raise ValueError("Unsupported framework")

            headers = {"Content-Type": "application/json"}

            # Print the first cURL request
            if not self.first_request_printed:
                json_data = json.dumps(data).replace('"', '\\"')
                curl_command = f"curl -X POST {url} -H \"Content-Type: application/json\" -d \"{json_data}\""
                print(f"First cURL Request: {curl_command}")
                self.first_request_printed = True

            try:
                with self.collector.collect_http_request(), self.collector.collect_user():
                    start_time = time.time()
                    async with self.session.post(url, headers=headers, json=data) as response:
                        self.collector.collect_response_status(response.status)
                        if response.status == 200:
                            response_text = await response.text()  # Ensure proper parsing
                            print(f"Response Text: {response_text}")  # Debugging: print raw response text
                            response_json = await response.json()
                            print(f"Response JSON: {response_json}")  # Debugging: print response JSON
                            tokens = self.parse_response(response_json)
                            self.collector.collect_tokens(tokens)
                            self.tokens += tokens
                            self.collector.collect_response_head_latency(time.time() - start_time)
                        else:
                            print(f"Received non-200 response: {response.status}")
            except Exception as e:
                print(f"Request failed: {e}")
            await asyncio.sleep(random.uniform(0.1, 1))  # Simulate variable request timing

    def parse_response(self, response):
        # Adjust parsing logic based on the actual response structure
        try:
            if self.framework == 'vllm':
                return len(response['choices'][0]['text'].split())
            elif self.framework == 'ollama':
                if 'response' in response:
                    return len(response['response'].split())
        except KeyError as e:
            print(f"Error parsing response: {e}")
        return 0

    def report_individual_tokens(self):
        duration = time.time() - self.start_time
        tokens_per_second = self.tokens / duration if duration > 0 else 0
        print(f"User {self.user_id} Tokens/s: {tokens_per_second}, Total Tokens: {self.tokens}")

def load_prompts(file_path):
    with open(file_path, 'r') as f:
        return [json.loads(line) for line in f if line.strip()]

async def main(num_clients, job_length, url, framework, model):
    prompts = load_prompts('databricks-dolly-15k.jsonl')
    collector = MetricsCollector()
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
    args = parser.parse_args()

    print(f"Running benchmark with {args.num_clients} clients for {args.job_length} seconds on {args.url} using {args.framework} framework with model {args.model}...")
    asyncio.run(main(args.num_clients, args.job_length, args.url, args.framework, args.model))
