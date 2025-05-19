FROM pytorch/pytorch:2.3.0-cuda12.1-cudnn8-runtime

# Install ComfyUI and its dependencies
WORKDIR /root

RUN apt-get update && apt-get install -y \
    git \
    libgl1-mesa-dev \
    libglib2.0-0 \
    fonts-dejavu fonts-freefont-ttf


# Clone ComfyUI
RUN git clone https://github.com/comfyanonymous/ComfyUI.git && \
    cd ComfyUI && \
    pip install -r requirements.txt

# Install custom nodes
WORKDIR /root/ComfyUI/custom_nodes

RUN git clone https://github.com/yolain/ComfyUI-Easy-Use && \
    git clone https://github.com/rgthree/rgthree-comfy.git && \
    git clone https://github.com/Suzie1/ComfyUI_Comfyroll_CustomNodes.git && \
    git clone https://github.com/WASasquatch/was-node-suite-comfyui/ && \
    git clone https://github.com/Fannovel16/comfyui_controlnet_aux/ && \
    git clone https://github.com/sipherxyz/comfyui-art-venture && \
    git clone https://github.com/ltdrdata/ComfyUI-Manager

# Install requirements for each custom node
RUN cd ComfyUI-Easy-Use && pip install -r requirements.txt && \
    cd ../was-node-suite-comfyui && pip install -r requirements.txt && \
    cd ../comfyui_controlnet_aux && pip install -r requirements.txt && \
    cd ../comfyui-art-venture && pip install -r requirements.txt && \
    cd ../ComfyUI-Manager && pip install -r requirements.txt

# Set environment variables
ENV PYTHONPYCACHEPREFIX="/root/.cache/pycache"
ENV PIP_USER=true
ENV PATH="${PATH}:/root/.local/bin"
ENV PIP_ROOT_USER_ACTION=ignore

# Set working directory back to root
WORKDIR /root

# Expose port
EXPOSE 8188

# Set default CLI args
ENV CLI_ARGS=""

# Command to start ComfyUI
CMD ["python3", "./ComfyUI/main.py", "--listen", "--port", "8188", "--enable-cors-header"]


















