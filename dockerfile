# Use Docker's official image as the base
FROM docker:stable-dind

# Install dependencies and Git
RUN apk add --no-cache git curl

# Download and install Docker Compose
RUN COMPOSE_VERSION=$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep 'tag_name' | cut -d'"' -f4) \
    && curl -L "https://github.com/docker/compose/releases/download/${COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose \
    && chmod +x /usr/local/bin/docker-compose

# Clone the GitHub repository
RUN git clone https://github.com/open-webui/open-webui.git /open-webui

# Set the working directory
WORKDIR /open-webui

# Expose the port used by the web application (if needed, adjust based on the app configuration)
EXPOSE 3000

COPY webui.sh /open-webui/webui.sh

RUN chmod +x /open-webui/webui.sh

ENTRYPOINT ["dockerd-entrypoint.sh", "/bin/sh", "/open-webui/webui.sh"]


