ollama serve > /dev/null 2>&1 & sleep 1
serve_pid=$!

ollama run llama3 "what colour is the sky"

wait $serve_pid