#!/bin/bash

# Start the lmdeploy server
lmdeploy serve api_server ../../../root/snapshots/069adfb3ab0ceba60b9af8f11fa51558b9f9d396 --model-name llama3.1 &

# Wait for the server to start
sleep 30

# Run the benchmark
lm-benchmark --url http://localhost:23333 --endpoint /v1/completions --use_prompt_field --job_length 60

# Keep the container running
tail -f /dev/null