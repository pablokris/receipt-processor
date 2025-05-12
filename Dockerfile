# Use an official Node.js image
FROM node:20-alpine

# Create and set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy docs directory first to ensure it exists
COPY docs ./docs

# Copy application files
COPY . .

# Verify docs directory contents
RUN ls -la docs/

# Run tests
RUN npm test

# Set production environment
ENV NODE_ENV=production

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]