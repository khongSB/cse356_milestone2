# Start with an official Ubuntu base image
FROM ubuntu:22.04

# Set environment variables
ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && \
    apt install -y nginx certbot python3-certbot-nginx && \
    apt clean

# Copy custom Nginx configuration into the container
COPY nginx.conf /etc/nginx/sites-available/default

# Expose port 80 to access the Nginx server
EXPOSE 80 443

# Start Nginx when the container runs
CMD ["nginx", "-g", "daemon off;"]
