FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package.json .

RUN npm install --legacy-peer-deps

# Add rest of the client code
COPY . .

# Expose the port the app runs on
EXPOSE 3333

# Start the app in development mode
CMD pnpm dev --port 3333}
