#!/bin/bash
ITERATION=1
TIMEOUT_MINS=${1:-100}
ITERATION_STEPS=${2:-10}
LAST_RUN_LENGTH_MINS=0
JOB_START_TIMESTAMP=$(date +%s)

echo Starting Ollama Benchmark Service;
ollama serve > /dev/null 2>&1 & sleep 1

llm_bench sysinfo
llm_bench check-internet
llm_bench check-version

monitor_gpu_usage() {
  echo "Ollama PS output:"
  ollama ps
  echo "GPU Power Consumption:"
  nvidia-smi --query-gpu=power.draw --format=csv
}

# Ensure the monitor process is killed on script exit
trap "kill 0" EXIT

while (( ((TIMEOUT_MINS - LAST_RUN_LENGTH_MINS) - (($(date +%s) - JOB_START_TIMESTAMP) / 60)) >= 0 ));
do
  ATLEAST_ONE_SUCCESS=false
  RUN_START_TIMESTAMP=$(date +%s)
  
  echo "Running LLM benchmarks $ITERATION"

  if llm_bench run --model gemma-small --test &>/dev/null; then
    echo "Running Gemma Small"
    ATLEAST_ONE_SUCCESS=true
    monitor_gpu_usage | tee /dev/fd/1  # Capture output once
    llm_bench run --model gemma-small --steps ${ITERATION_STEPS}
  fi

  if llm_bench run --model phi3-small --test &>/dev/null; then
    echo "Running Phi3 Small"
    ATLEAST_ONE_SUCCESS=true
    monitor_gpu_usage | tee /dev/fd/1  # Capture output once
    llm_bench run --model phi3-small --steps ${ITERATION_STEPS}
  fi

  if llm_bench run --model mistral-small --test &>/dev/null; then
    echo "Running Mistral Small"
    ATLEAST_ONE_SUCCESS=true
    monitor_gpu_usage | tee /dev/fd/1  # Capture output once
    llm_bench run --model mistral-small --steps ${ITERATION_STEPS}
  fi

  if llm_bench run --model llama3-small --test &>/dev/null; then
    echo "Running LLama3 Small"
    ATLEAST_ONE_SUCCESS=true
    monitor_gpu_usage | tee /dev/fd/1  # Capture output once
    llm_bench run --model llama3-small --steps ${ITERATION_STEPS}
  fi

  if llm_bench run --model qwen-small --test &>/dev/null; then
    echo "Running Qwen"
    ATLEAST_ONE_SUCCESS=true
    monitor_gpu_usage | tee /dev/fd/1  # Capture output once
    llm_bench run --model qwen-small --steps ${ITERATION_STEPS}
  fi

  echo "finished benchmarking"

  if [[ $ATLEAST_ONE_SUCCESS == true ]]; then
    ITERATION=$((ITERATION + 1))
    RUN_END_TIMESTAMP=$(date +%s)
    RUN_TIME_IN_SECONDS=$(($RUN_END_TIMESTAMP - $RUN_START_TIMESTAMP))
    LAST_RUN_LENGTH_MINS=$(($RUN_TIME_IN_SECONDS / 60))
  else
    LAST_RUN_LENGTH_MINS=$TIMEOUT_MINS
  fi  
done
