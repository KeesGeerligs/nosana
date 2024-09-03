FROM docker.io/openmmlab/lmdeploy:v0.5.3-cu12

RUN apt-get update && apt-get install -y git

RUN git clone https://github.com/KeesGeerligs/nos_bench.git /lm-benchmark

RUN pip install -e /lm-benchmark
