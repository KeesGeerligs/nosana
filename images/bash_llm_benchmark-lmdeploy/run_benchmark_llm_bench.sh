#!/bin/bash

echo "Starting lmdeploy service..."
lmdeploy serve api_server ../../root/snapshots/db1f81ad4b8c7e39777509fac66c652eb0a52f91 --model-name llama3.1 --chat-template /chat_template.json --model-format awq > /dev/null &
sleep 30

echo "Running lm-benchmark..."
lm-benchmark --url http://localhost:23333 --ping_correction --job_length 900
sleep 1h
