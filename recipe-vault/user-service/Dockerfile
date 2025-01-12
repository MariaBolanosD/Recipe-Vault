# Use a lightweight Python image
FROM python:3.11-slim

# Install required system dependencies for mysqlclient
RUN apt-get update && apt-get install -y \
    gcc \
    libmariadb-dev \
    libpq-dev \
    pkg-config \
    && apt-get clean

# Set the working directory
WORKDIR /app

# Copy requirements.txt and install Python dependencies
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code
COPY . /app

# Expose the port Flask runs on
EXPOSE 5000

# Start the Flask application
CMD ["python", "app.py"]
