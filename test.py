import requests

# URL of the running container
url = "http://localhost:8000/v1/completions"

# Headers (optional, include if needed)
headers = {
    "Authorization": "Bearer <your-api-key>",  # If you have API key authentication enabled
    "Content-Type": "application/json"
}

# Payload
data = {
    "model": "mistralai/Mistral-7B-v0.1",
    "prompt": "Once upon a time",
    "max_tokens": 50
}

response = requests.post(url, headers=headers, json=data)

if response.status_code == 200:
    print("Response:", response.json())
else:
    print("Error:", response.status_code, response.text)
