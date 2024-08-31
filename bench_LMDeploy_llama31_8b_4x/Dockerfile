FROM docker.io/openmmlab/lmdeploy:v0.5.3-cu12


RUN apt-get update && apt-get install -y git

RUN git clone https://github.com/KeesGeerligs/nos_bench.git /lm-benchmark

RUN pip install -e /lm-benchmark

COPY run_benchmark_llm_bench_v1.sh /lm-benchmark/run_benchmark_llm_bench_v1.sh

RUN chmod +x /lm-benchmark/run_benchmark_llm_bench_v1.sh

ENTRYPOINT ["/lm-benchmark/run_benchmark_llm_bench_v1.sh"]