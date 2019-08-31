const express = require("express");
const request = require("request");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
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
            //Handle any errors
        }
        else if (body.includes("is_valid:true")) {
            res.status(200);
            res.send(req.query["openid.claimed_id"].match(/\d{17}/)[0]);
            //Handle valid login
            //TODO: check against database for valid linked account
        }
        else {
            res.status(401);
            res.send("Invalid login request");
            //Handle invalid login
        }

        res.end();
        //End response
    });
});

app.use(express.static(path.resolve(__dirname, "./public/")));
//Host public files

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