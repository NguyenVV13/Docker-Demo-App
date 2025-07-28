## Demo App for Developing with Docker

This is a simple webapp that takes user input in text fields and updates the website with it, following a Docker development tutorial by TechWorld with Nana on YouTube.

https://www.youtube.com/watch?v=3c-iBn73dDE

The idea behind this project is to simulate how development could work with Docker. The developer pulls an image of MongoDB to program the frontend and backend code with, and commits this code to a repo like GitHub. CI/CD operations that would be performed with something like Jenkins, such as taking the new tested code, building the app, and creating a new Docker image with the committed Dockerfile, are stepped through by hand. Although the Dockerfile in this repo is usable in that the image can be installed and the container spun up, it is purely for demonstration purposes.

In this project, HTML, CSS, and JavaScript are used for the frontend. HTML is used to structure the website, CSS provides the style, and JavaScript is used to dynamically change the value of elements on the webpage when the buttons for editing and saving the profile are pressed.

NodeJS with Express module and MongoDB are used for the backend. NodeJS sets up the server and connects the website with MongoDB, taking user inputs via text fields and saving the data to the NoSQL database. Database entries are visualized using Mongo Express.

## Running the App

### Using Docker CLI

1. Create the Docker network for MongoDB and Mongo Express to communicate with each other

        docker network create mongo-network

2. Spin up the MongoDB container

        docker run -d -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=password --name mongodb --net mongo-network mongo
    
    - `-d`: run in detached mode
    - `-p`: connect host port 27017 to Docker port 27017
        - 27017 is the default port for MongoDB
    - `-e`: environment variable configuration when running MongoDB, in this case, creating a new user with provided username and password, an admin with the role of root
    - `--name`: the custom name for the container
    - `--network`, `--net`: the name of the Docker network to run the container in
    - `mongo`: the name of the image being run

3. Spin up the Mongo Express container

        docker run -d -p 8081:8081 -e ME_CONFIG_MONGODB_ADMINUSERNAME=admin -e ME_CONFIG_MONGODB_ADMINPASSWORD=password -e ME_CONFIG_MONGODB_SERVER=mongodb --name mongo-express --net mongo-network mongo-express

    - `-p`: in the command above are the default port values for Mongo Express
    - `-e`: the environment variables ADMINUSERNAME and ADMINPASSWORD are required to authenticate with MongoDB, since we overrode those values when starting up the MongoDB container in the previous step
        - ME_CONFIG_MONGODB_SERVER must match the name of the MongoDB container set up in the previous step

4. Open Mongo Express from the browser

        http://localhost:8081

    - May have to authenticate using the basicAuth credentials `admin:pass` that are set by default in config.js in the container

5. Create the `user-account` database and `users` collection in Mongo Express

6. Start the NodeJS application locally
    
    a. Go to the main directory of the project where the NodeJS server file is
    
        npm install
        node server.js

7. Access the NodeJS application from the browser

        http://localhost:3000

### Using Docker Compose

1. Start MongoDB and Mongo Express using the YAML file

        docker-compose -f mongo.yaml up

2. Open Mongo Express from the browser

        http://localhost:8081

    - May have to authenticate using the basicAuth credentials `admin:pass` that are set by default in config.js in the container

3. Create the `my-db` database and `users` collection in Mongo Express

4. Start the NodeJS application locally
    
    a. Go to the main directory of the project where the NodeJS server file is
    
        npm install
        node server.js

7. Access the NodeJS application from the browser

        http://localhost:3000