import asyncio
import aiohttp
import time
import json
import argparse
import random
from collections import defaultdict
import numpy as np
import contextlib

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

    async def report_loop(self, time_window=5):
        while True:
            await asyncio.sleep(time_window)
            current_time = time.time()
            report_time = int(current_time - self.start_time)
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
            print(f"Response Tokens/s: {sum(self.response_word_bucket.values()) / (current_time - self.start_time)}")
            print(f"Total Tokens Produced: {self.total_tokens}")
            print()

    def final_report(self):
        total_duration = time.time() - self.start_time
        print("Final Report")
        print(f"Total Duration: {total_duration} seconds")
        print(f"Total Tokens Produced: {self.total_tokens}")
        print(f"Total Tokens per Second: {self.total_tokens / total_duration}")
        print(f"Total Requests Made: {self.total_requests}")


class User:
    def __init__(self, session, base_url, collector, prompts):
        self.session = session
        self.base_url = base_url
        self.collector = collector
        self.prompts = prompts

    async def make_request(self):
        while True:
            prompt = random.choice(self.prompts)
            url = f"{self.base_url}/v1/completions"
            headers = {"Content-Type": "application/json"}
            data = {
                "model": "google/gemma-2b",
                "prompt": prompt['instruction'] + " " + prompt['context'],
                "max_tokens": 50,
                "temperature": 0.7,
                "top_p": 0.9,
                "n": 1,
                "stop": ["\n"]
            }
            with self.collector.collect_http_request(), self.collector.collect_user():
                start_time = time.time()
                async with self.session.post(url, headers=headers, json=data) as response:
                    self.collector.collect_response_status(response.status)
                    if response.status == 200:
                        response_text = await response.text()
                        tokens = len(response_text.split())  # Simplistic token count
                        self.collector.collect_tokens(tokens)
                        self.collector.collect_response_head_latency(time.time() - start_time)
            await asyncio.sleep(random.uniform(0.1, 1))  # Simulate variable request timing

def load_prompts(file_path):
    with open(file_path, 'r') as f:
        return [json.loads(line) for line in f if line.strip()]

async def main(num_clients, job_length, url):
    prompts = load_prompts('databricks-dolly-15k.jsonl')
    collector = MetricsCollector()
    async with aiohttp.ClientSession() as session:
        users = [User(session, url, collector, prompts) for _ in range(num_clients)]
        tasks = [asyncio.create_task(user.make_request()) for user in users]
        report_task = asyncio.create_task(collector.report_loop(time_window=5))  
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
            collector.final_report()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Run benchmark on an API')
    parser.add_argument('--num_clients', type=int, help='Number of concurrent clients')
    parser.add_argument('--job_length', type=int, help='Duration of the benchmark job in seconds')
    parser.add_argument('--url', type=str, help='URL of the API endpoint')
    args = parser.parse_args()

    print(f"Running benchmark with {args.num_clients} clients for {args.job_length} seconds on {args.url}...")
    asyncio.run(main(args.num_clients, args.job_length, args.url))


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Run benchmark on an API')
    parser.add_argument('--num_clients', type=int, help='Number of concurrent clients')
    parser.add_argument('--job_length', type=int, help='Duration of the benchmark job in seconds')
    parser.add_argument('--url', type=str, help='URL of the API endpoint')
    args = parser.parse_args()

    print(f"Running benchmark with {args.num_clients} clients for {args.job_length} seconds on {args.url}...")
    asyncio.run(main(args.num_clients, args.job_length, args.url))

