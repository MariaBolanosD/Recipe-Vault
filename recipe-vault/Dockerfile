# Use Node.js as the base image
FROM node:18-slim

# Set the working directory
WORKDIR /app

# Copy dependencies
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy source files
COPY . .

# Expose port 3001
EXPOSE 3001

# Start the React development server
CMD ["npm", "start"]
