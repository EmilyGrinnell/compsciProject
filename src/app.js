const express = require("express");
const request = require("request");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const buildDatabase = require("./buildDatabase.js");
const app = express();
const db = new sqlite3.Database(path.resolve(__dirname, "./database.db"));

app.get("/", (req, res) => {
    res.redirect("/html/index.html");
    //Redirect to index page
});

app.get("/authenticate", (req, res) => {
    request({
        url : "https://steamcommunity.com/openid/login",
        method : "POST",
        form : Object.assign(req.query, {
            "openid.mode" : "check_authentication",
        }),
        //Send request to Steam to verify the login is valid
    }, (err, r, body) => {
        if (err) {
            res.status(400);
            res.send(err);
            res.end();
            //Handle any errors
        }
        else if (body.includes("is_valid:true")) {
            let id = req.query["openid.claimed_id"].match(/\d{17}/)[0];

            db.get(`SELECT * FROM Users WHERE steamIds LIKE "%${id}%"`, (err, row) => {
                if (err) {
                    res.status(500);
                    res.send("database_error");
                }
                else if (row) {
                    res.status(200);
                    res.send(row.username);
                }
                else {
                    res.status(401);
                    res.send("no_linked_steam");
                    //Check the user's Steam account is linked to an account in the database
                }
    
                res.end();
            });
        }
        else {
            res.status(401);
            res.send("invalid_login");
            res.end();
            //Handle invalid login
        }
    });
});

app.post("/register", (req, res) => {
    console.log(req.body);
});

app.use(express.static(path.resolve(__dirname, "./public/")));
//Host public files

db.run("SELECT * FROM Users", async err => {
    if (err) {
        let failed = await buildDatabase(db).catch(e => e);

        if (failed) {
            console.log("The user database could not be found and an error occurred while trying to generate it");
            return db.close(() => process.exit(1));
            //Close the database connection then exit with an error code of 1
        }
    }

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
});