"use strict";
/**
 * Node.js file for the app backend
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const body_parser_1 = __importDefault(require("body-parser"));
const mongodb_1 = require("mongodb");
const app = (0, express_1.default)();
app.use('/public', express_1.default.static(path_1.default.join(__dirname, '..', '..', 'front')));
app.use(body_parser_1.default.urlencoded({
    extended: true
}));
app.use(body_parser_1.default.json());
app.get('/', function (req, res) {
    res.sendFile(path_1.default.join(__dirname, '..', '..', 'front', 'html', 'index.html'));
});
app.get('/profile-picture', function (req, res) {
    let img = fs_1.default.readFileSync(path_1.default.join('__dirname', '..', '..', 'front', 'images', 'cafe.jpg'));
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
app.get('/get-profile', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = null;
        // Connect to the db
        const client = new mongodb_1.MongoClient(mongoUrlLocal);
        try {
            yield client.connect();
            // Get the collection from the database
            let collection = client.db(databaseName).collection('users');
            // Set query
            let myquery = { userid: 1 };
            // WAIT for the query to yield results before closing connection
            result = yield collection.findOne(myquery);
            client.close();
        }
        catch (error) {
            console.error(error);
        }
        finally {
            // Send response
            res.send(result ? result : {});
        }
    });
});
// Uploads the data provided in the webpage's textfields to the MongoDB database
// by updating the data present in the first user's row
app.post('/update-profile', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let userObj = req.body;
        const client = new mongodb_1.MongoClient(mongoUrlLocal);
        try {
            yield client.connect();
            let collection = client.db(databaseName).collection('users');
            userObj['userid'] = 1;
            let myquery = { userid: 1 };
            let newvalues = { $set: userObj };
            yield collection.updateOne(myquery, newvalues, { upsert: true });
            console.log('Updated user profile information');
            client.close();
        }
        catch (error) {
            console.error(error);
        }
        finally {
            // Send response
            res.send(userObj);
        }
    });
});
app.listen(3000, function () {
    console.log("app listening on port 3000!");
});
