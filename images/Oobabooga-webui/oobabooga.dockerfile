FROM pytorch/pytorch:2.3.0-cuda12.1-cudnn8-runtime


# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    wget \
    libgl1 \
    libglib2.0-0 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Clone Forge repository
RUN git clone 


# Install Forge dependencies
RUN pip install -r requirements_versions.txt



