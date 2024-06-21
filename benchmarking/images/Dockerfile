FROM docker.io/ollama/ollama:latest


RUN apt-get update && \
    apt-get install -y curl python3 python3-pip && \
    pip3 install llm-bench


RUN ollama serve > /dev/null 2>&1 & \
    sleep 20 && \
    ollama pull phi3 && \
    ollama pull llama3 && \
    ollama pull mistral && \
    ollama pull gemma:7b && \
    ollama pull qwen:7b


ENTRYPOINT ["/bin/bash"] 