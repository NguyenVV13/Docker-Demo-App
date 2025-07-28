/**
 * Node.js file for the app backend
 */

const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const app = express();

app.use('/public', express.static(path.join(__dirname, 'files')));

app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json());

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/profile-picture', function(req, res) {
    let img = fs.readFileSync(path.join(__dirname, 'files', 'images', 'cafe.jpg'));
    res.writeHead(200, { 'Content-Type': 'image/jpg' });
    res.end(img, 'binary');
});

/* Obviously, usernames and passwords should never be hardcoded into real code,
   but this is just for the demo project */

// Use this variable when starting the application locally
let mongoUrlLocal = "mongodb://admin:password@localhost:27017";

// Use this variable when starting the application as a Docker container
let mongoUrlDocker = "mongodb://admin:password@mongodb";

// "user-account" in demo with docker. "my-db" in demo with docker-compose
let databaseName = "user-account";

// Gets the profile details of the first user in the database
app.get('/get-profile', async function (req, res) {
    let response = {};

    // Connect to the db
    const client = new MongoClient(mongoUrlLocal);
    try {
        await client.connect();

        // Get the collection from the database
        let collection = client.db(databaseName).collection('users');
        // Set query
        let myquery = { userid: 1 };
        // WAIT for the query to yield results before closing connection
        result = await collection.findOne(myquery);
        client.close();

    } catch (error) {
        console.error(error);
    } finally {
        // Send response
        res.send(result ? result : {});
    }
});

// Uploads the data provided in the webpage's textfields to the MongoDB database
// by updating the data present in the first user's row
app.post('/update-profile', async function (req, res) {
    let userObj = req.body;

    const client = new MongoClient(mongoUrlLocal);
    try {
        await client.connect();

        let collection = client.db(databaseName).collection('users');
        userObj['userid'] = 1;

        let myquery = { userid: 1 };
        let newvalues = { $set: userObj };

        await collection.updateOne(myquery, newvalues, {upsert: true});
        console.log('Updated user profile information');
        client.close();
    } catch (error) {
        console.error(error);
    } finally {
        // Send response
        res.send(userObj);
    }
});

app.listen(3000, function() {
    console.log("app listening on port 3000!");
});