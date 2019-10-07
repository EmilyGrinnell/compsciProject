const cookieParser = require("cookie-parser");
const nodemailer = require("nodemailer");
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const path = require("path");
const util = require("util");
const SteamAPI = require("./SteamAPI.js");
const buildDatabase = require("./buildDatabase.js");
const app = express();
const db = new sqlite3.Database(path.resolve(__dirname, "./config/database.db"));
const cfgFolder = `${__dirname.substring(__dirname.lastIndexOf("\\")).replace("\\", "/")}/config/`;
//Import required dependencies, create an express app object and create a connection to the database

if (!fs.existsSync(path.resolve(__dirname, "./config/jwt_key.txt"))) return console.log(`JWT key file could not be found. Please place a key to be used for generating access tokens in jwt_key.txt in the ${cfgFolder} folder`);
if (!fs.existsSync(path.resolve(__dirname, "./config/steam_api_keys.txt"))) return console.log(`Steam API key file could not be found. Please place at least one (or more, if separated by a new line) API key from https://steamcommunity.com/dev/apikey in steam_api_keys.txt in the ${cfgFolder} folder`);
//Ensure JSON web token key and Steam API key files exist

const config = require("./config/settings.json");
const key = fs.readFileSync(path.resolve(__dirname, "./config/jwt_key.txt"), "utf-8").trim();
const apiKeys = fs.readFileSync(path.resolve(__dirname, "./config/steam_api_keys.txt"), "utf-8").split("\n").map(line => line.split("//")[0].trim()).filter(line => line);
//Read config files, allowing for comments in the Steam API key file and ignoring empty lines

if (!key) return console.log(`JWT key file is empty. Please place a key to be used for generating access tokens in jwt_key.txt in the ${cfgFolder} folder`);
if (!apiKeys.length) return console.log(`No Steam API keys were found in the Steam API key file. Please place at least one (or more, if separated by a new line) API key from https://steamcommunity.com/dev/apikey in steam_api_keys.txt in the ${cfgFolder} folder`);
//Ensure a JWT key and at least one Steam API key have been provided

const api = new SteamAPI(apiKeys);
//Create an API object used to make requests to the Steam API

const transporter = nodemailer.createTransport({
    service : config.email.service,
    auth : {
        user : config.email.address,
        pass : config.email.password,
    },
});
//Create a transporter used for sending reset password emails

transporter.sendMail = util.promisify(transporter.sendMail);
//Allow sending of emails to be awaited in an async function

for (let func of ["run", "get", "all", "close", "exec"]) db[func] = util.promisify(db[func]);
//Allow database functions to be awaited in an async function

app.use(require("body-parser").urlencoded({extended : true}));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.resolve(__dirname, "./public/")));
//Use middleware to parse request bodies and cookies, and host public files

app.get("/", (req, res) => {
    res.redirect("/html/index.html");
    //Redirect to index page
});

let endpoints = fs.readdirSync(path.resolve(__dirname, "./endpoints/"));
//Read endpoints directory

for (let x = 0; x < endpoints.length; x ++) {
    let endpoint = require(`./endpoints/${endpoints[x]}`);
    //Import the endpoint file

    //app[endpoint.method](`/${endpoints[x].substring(0, endpoints[x].lastIndexOf("."))}`, (req, res) => endpoint({req, res, db, key, api, transporter}));
    app[endpoint.method](`/${endpoints[x].substring(0, endpoints[x].lastIndexOf("."))}`, (req, res) => {
        delete require.cache[require.resolve(`./endpoints/${endpoints[x]}`)];
        endpoint = require(`./endpoints/${endpoints[x]}`);
        endpoint({req, res, db, key, api, transporter});
    });
    //FOR TESTING: RELOAD EACH ENDPOINT BEFORE RUNNING FUNCTION TO ALLOW FOR CHANGES TO ENDPOINT SCRIPTS WITHOUT RESTARTING APP

    //Register each endpoint and pass requests to function defined in the corresponding file
}

(async () => {
    await db.run("SELECT ID FROM Users").catch(async () => {
        let {message} = await buildDatabase(db).catch(e => e) || {};
        //Try to create the database table and catch any errors doing so

        if (message) {
            console.log(`The user database could not be found and the following error occurred while trying to generate it: ${message}`);
            await db.close();
            process.exit(1);
            //Close the database connection then exit with an error code of 1
        }
    });

    (function findPort(port) {
        app.listen(port)
            .on("error", e => {
                if (e.message.startsWith("listen EADDRINUSE")) findPort(port + 1);
                else throw e;
                //Only ignore address in use errors
            })
            .on("listening", () => console.log(`Listening on port ${port}`));
        //Try to start listening on port 8000, and switch to the next port recursively until one is not in use
    })(8000);
})();