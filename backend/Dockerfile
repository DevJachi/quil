FROM node:20-slim

# Install git, docker CLI, and railpack
RUN apt-get update && apt-get install -y git curl && rm -rf /var/lib/apt/lists/*

# Install Docker CLI
RUN curl -fsSL https://get.docker.com | sh

# Install railpack
RUN curl -sSL https://railpack.io/install.sh | sh

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3001

CMD ["node", "server.js"]
