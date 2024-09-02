#!/bin/bash
echo "Current directory: $(pwd)"

# List all files in the current directory
echo "Files in the current directory:"
ls -la

# Start the lmdeploy service with provided arguments
echo "Starting lmdeploy service..."
lmdeploy serve api_server ../../root/snapshots/db1f81ad4b8c7e39777509fac66c652eb0a52f91 --model-name llama3.1 --model-format awq &

# Give the service some time to start
sleep 30

# Run the benchmark
echo "Running lm-benchmark..."
lm-benchmark --url http://localhost:23333 --endpoint /v1/completions --use_prompt_field --job_length 60

kill -TERM 1