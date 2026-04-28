# Use Node.js 20 alpine image (lightweight)
FROM node:20-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package.json first to leverage Docker layer caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all server source code
COPY . .

# Create upload directories required by the server
RUN mkdir -p uploads/avatar uploads/coverImage uploads/temp

# Expose port 8080
EXPOSE 8080

# Start the server when the container launches
CMD ["node", "server.js"]