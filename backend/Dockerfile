FROM node:20-alpine

WORKDIR /app

# Install dependencies first for better caching
COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 5001

CMD ["node", "server.js"]

