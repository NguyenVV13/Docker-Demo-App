FROM node:22

ENV MONGO_DB_USERNAME=admin \
    MONGO_DB_PWD=password

RUN mkdir -p /home/app

COPY ./app /home/app

# Set default dir so that next commands execute in /home/app
WORKDIR /home/app

# Will execute npm install in /home/app because of WORKDIR
RUN npm install

# No need for /home/app/server.js because of WORKDIR
CMD ["node", "server.js"]