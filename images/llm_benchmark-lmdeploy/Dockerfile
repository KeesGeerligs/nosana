FROM docker.io/openmmlab/lmdeploy:v0.5.3-cu12

RUN apt-get update && apt-get install -y git

COPY ./nos_bench/ /lm-benchmark

COPY chat_template.json /

RUN pip install -e /lm-benchmark
