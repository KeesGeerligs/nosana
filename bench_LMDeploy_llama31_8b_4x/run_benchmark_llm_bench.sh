set -x


echo "Current working directory: $(pwd)"


MODEL_PATH="/lm-benchmark/cache/snapshots/db1f81ad4b8c7e39777509fac66c652eb0a52f91"
if [ -d "$MODEL_PATH" ]; then
    echo "Model path exists: $MODEL_PATH"
    ls -lah "$MODEL_PATH"
else
    echo "Model path does NOT exist: $MODEL_PATH"
fi

exit 0
