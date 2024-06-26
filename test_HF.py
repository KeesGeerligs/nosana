import requests
import time


headers = {"Authorization": "Bearer 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"}
API_URL = "https://wptplk0qhtmirgf8.us-east-1.aws.endpoints.huggingface.cloud"

def query(payload):
    start_time = time.time() 
    response = requests.post(API_URL, headers=headers, json=payload)
    end_time = time.time()  
    latency = end_time - start_time
    return response.json(), latency


prompts = [
    "What is the answer to the universe?",
    "Tell me about the history of the Roman Empire.",
    "How does quantum computing work?",
    "What are the benefits of a vegan diet?",
    "Explain the theory of relativity.",
    "What is blockchain technology?",
    "How to perform a cartwheel?",
    "Describe the water cycle.",
    "What is machine learning?",
    "Why is the sky blue?"
]

total_tokens = 0
total_latency = 0


for prompt in prompts:
    data, latency = query({"inputs": prompt})
    print(f"Response: {data} \nLatency: {latency:.2f} seconds")
    total_latency += latency


average_latency = total_latency / len(prompts)

print(f"Average Latency: {average_latency:.2f} seconds")
print(f"Total Tokens: {total_tokens}")

