# Use the official MongoDB image as the base
FROM mongo:latest

# Set the default database to be created on startup
ENV MONGO_INITDB_DATABASE=CSE356

# Copy the initialization script into the container (might not work idk)
COPY init-db.js /docker-entrypoint-initdb.d/
COPY mongod.conf /etc/mongod.conf

# MongoDB automatically runs scripts in /docker-entrypoint-initdb.d/ during startup