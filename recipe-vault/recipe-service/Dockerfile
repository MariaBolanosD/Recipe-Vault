# Use Node.js as the base image
FROM node:18-slim

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json into the container
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy all the project files into the container
COPY . .

# Expose the port that your app runs on
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]
