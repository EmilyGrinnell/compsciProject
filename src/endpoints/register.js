const crypto = require("crypto");
const jwt = require("jsonwebtoken");

module.exports = async function({body : {username = "", password = ""}}, res, db, key) {
    if (username.length <= 6 || username.length >= 20) {
        res.status(400);
        res.send("invalid_username");
        //Check the username is a valid length
    }
    else if (password.length <= 6 || password.length >= 20) {
        res.status(400);
        res.send("invalid_password");
        //Check the password is a valid length
    }
    else {
        await db.all("SELECT ID, username FROM Users ORDER BY ID DESC")
            //Try and find another user with the same username, ignoring case to ensure duplicate usernames are not allowed
            //Also get the current highest registered ID

            .then(async rows => {
                if (rows.findIndex(row => row.username.toLowerCase() == username.toLowerCase()) + 1) {
                    res.status(400);
                    res.send("username_taken");
                    //Respond with an error if the requested username is already in use by another user
                }
                else {
                    let newID = (rows[rows.length - 1] || {ID : -1}).ID + 1
                    let salt = crypto.randomBytes(8).toString("hex");
                    //Increment ID of last registered user and generate a random 64-bit salt to hash the password with

                    await db.run(`INSERT INTO USERS Values (
                        ${newID},
                        "${username}",
                        "${crypto.createHmac("sha512", salt).update(password).digest("hex")}",
                        "${salt}",
                        0,
                        ""
                    )`)
                        //Add the user to the database

                        .then(() => {
                            res.status(200);
                            res.cookie("token", jwt.sign(newID, key), {
                                httpOnly : true,
                            });
                            //Sign an access token and store it in a cookie
                        })
                        .catch(() => {
                            res.status(500);
                            res.send("database_error");
                            //Handle any errors while checking the database to get the current highest ID
                        });
                }
            })
            .catch(() => {
                res.status(500);
                res.send("database_error");
                //Handle any errors while checking the database for existing users with the requested username
            });
    }

    res.end();
    //End the response
};

module.exports.method = "post";