#!/bin/bash

# Start Ollama in the background
echo "🚀 Starting Ollama server..."
ollama serve &

# Wait until the socket is ready
echo "⏳ Waiting for Ollama to start..."
sleep 5  # Ollama usually starts within a few seconds

# Pull the model directly
echo "⬇️ Pulling gemma3:27b..."
ollama pull gemma3:27b

# Keep the container running
echo "✅ Model ready. Keeping container alive..."
tail -f /dev/null
