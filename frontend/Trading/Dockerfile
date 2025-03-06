# Stage 1: Build the Angular application
FROM node:20-alpine as build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock if using Yarn)
COPY package*.json ./

# Install Angular CLI globally
RUN npm install -g @angular/cli

# Install all dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Set environment variable to increase memory limit
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Expose the port the app runs on
EXPOSE 4200

# Start the Angular app with --disable-host-check
CMD ["ng", "serve", "--host", "0.0.0.0", "--disable-host-check"]
