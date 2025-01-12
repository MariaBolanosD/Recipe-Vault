# Use a Node.js image
FROM node:18-slim

# Set the working directory
WORKDIR /app

# Copy only package.json and install dependencies
COPY package.json /app/
RUN npm install

# Copy the rest of the application files
COPY . /app

# Expose the port the service runs on
EXPOSE 4000

# Start the application
CMD ["node", "gateway.js"]
