FROM node:8

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Bundle app source
COPY . /usr/src/app

# Install app dependencies
RUN npm install

# Install postgresql to execute initial script for database
RUN apt-get update
RUN apt-get install -y postgresql postgresql-contrib