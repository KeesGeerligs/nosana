#!/bin/sh

# Start Docker daemon
dockerd &

# Wait a bit for the Docker daemon to be up and running
sleep 5

# The rest of your script
docker info >/dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "Docker daemon is not running."
    exit 1
fi

echo Starting Ollama Benchmark Service;
ollama serve > /dev/null 2>&1 & sleep 1

echo "Starting Docker Compose..."
docker-compose -f docker-compose.yaml -f docker-compose.gpu.yaml up -d --build

if [ $? -ne 0 ]; then
    echo "Docker Compose failed to start."
    exit 1
else
    echo "Docker Compose is up and running."
fi
