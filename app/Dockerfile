# Use an official Node.js image as the base
FROM node:22-slim

# Set the working directory for the container
WORKDIR /usr/src/app

# Install Python 3, FFmpeg, and any necessary dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    ffmpeg

# Copy the frontend and backend directories into the container
COPY ./frontend ./frontend
COPY ./backend ./backend
COPY ./media/m2.json ./media/m2.json
COPY ./media/process_video.py ./media/process_video.py
COPY ./initialize_video_table ./initialize_video_table

# Install dependencies for both frontend and backend
RUN cd /usr/src/app/frontend && npm install
RUN cd /usr/src/app/backend && npm install

# Build the frontend
RUN cd /usr/src/app/frontend && npm run build

# Expose the port the app will run on (adjust as necessary)
EXPOSE 5200

# Start the backend server (or frontend as needed)
CMD ["npm", "run", "start", "--prefix", "backend"]
