#!/bin/bash
ITERATION=1
TIMEOUT_MINS=${1:-100}
ITERATION_STEPS=${2:-10}
CONCURRENT_USERS=${3:-1}
LAST_RUN_LENGTH_MINS=0
JOB_START_TIMESTAMP=$(date +%s)


echo Starting Ollama Benchmark Service;
ollama serve > /dev/null 2>&1 & sleep 1

llm_bench sysinfo
llm_bench check-internet
llm_bench check-version

while (( ((TIMEOUT_MINS - LAST_RUN_LENGTH_MINS) - (($(date +%s) - JOB_START_TIMESTAMP) / 60)) >= 0));
do
  ATLEAST_ONE_SUCCESS=false
  RUN_START_TIMESTAMP=$(date +%s)

  echo "Running LLM benchmarks $ITERATION"

  # llm_bench sysinfo
  if llm_bench run --model llama3-small --test &>/dev/null; then
    echo "Running LLama3.1 Small"
    ATLEAST_ONE_SUCCESS=true
    llm_bench run --model llama3-small --steps ${ITERATION_STEPS} --concurrent ${CONCURRENT_USERS} --monitor-gpu
  fi

  echo "finished benchmarking"

  if [[ $ATLEAST_ONE_SUCCESS == true ]]; then
    ITERATION=$((ITERATION + 1))
    RUN_END_TIMESTAMP=$(date +%s)
    RUN_TIME_IN_SECONDS=$(($RUN_END_TIMESTAMP-$RUN_START_TIMESTAMP))
    LAST_RUN_LENGTH_MINS=$(($RUN_TIME_IN_SECONDS / 60))
  else
    llm_bench run --model llama3-small --test
    LAST_RUN_LENGTH_MINS=TIMEOUT_MINS
  fi
done