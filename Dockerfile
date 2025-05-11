# Use an official Node.js image
FROM node:20-alpine

# Create and set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application files
COPY . .

# Run tests
RUN npm test

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]