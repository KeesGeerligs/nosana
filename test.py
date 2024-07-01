import requests

url = "https://n5kqvdy2m44adbfe27tj8h6ww2ush7qm.node.k8s.prd.nos.ci/v1/completions"
headers = {"Content-Type": "application/json"}
data = {
    "model": "google/gemma-2b",
    "prompt": "Once upon a time",
    "max_tokens": 50,
    "temperature": 0.7,
    "top_p": 0.9,
    "n": 1,
    "stop": ["\n"]
}

response = requests.post(url, headers=headers, json=data)
print(f"Status Code: {response.status_code}")
print(f"Response: {response.text}")
