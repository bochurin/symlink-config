FROM node:18-alpine

# Install git and bash for testing
RUN apk add --no-cache git bash

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Compile TypeScript
RUN npm run compile

# Default to bash shell
CMD ["bash"]