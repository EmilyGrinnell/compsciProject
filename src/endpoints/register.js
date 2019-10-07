const crypto = require("crypto");
const jwt = require("jsonwebtoken");

module.exports = async function({req : {body : {username = "", email = "", password = ""}}, res, db, key}) {
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
    else if (!/^\w+@\w+\.\w+$/.test(email)) {
        res.status(400);
        res.send("invalid_email");
        //Check the email address is valid
    }
    else {
        await db.all("SELECT ID, username, email FROM Users")
            //Try and find another user with the same username, ignoring case to ensure duplicate usernames are not allowed
            //Also get the current highest registered ID

            .then(async rows => {
                if (rows.findIndex(row => row.username.toLowerCase() == username.toLowerCase()) + 1) {
                    res.status(400);
                    res.send("username_taken");
                    //Respond with an error if the requested username is already in use by another user
                }
                else if (rows.findIndex(row => row.email.toLowerCase() == email.toLowerCase()) + 1) {
                    res.status(400);
                    res.send("email_taken");
                    //Respond with an error if the requested email is already in use by another user
                }
                else {
                    let newID;
                    let salt = crypto.randomBytes(8).toString("hex");
                    let ids = rows.map(row => row.ID);
                    //Increment ID of last registered user and generate a random 64-bit salt to hash the password with

                    do {
                        newID = Math.floor((Math.random() * 9 + 1) * Math.pow(10, 15));
                        //Generate a random 15-digit ID
                    } while(ids.binarySearch(newID) + 1);
                    //Ensure the randomly generated ID is not already in use
                    //If it is, recursively generate new IDs until a free one is found

                    await db.run(`INSERT INTO Users Values (
                        ${newID},
                        "${username}",
                        "${crypto.createHmac("sha512", salt).update(password).digest("hex")}",
                        "${email}",
                        "${salt}",
                        0
                    )`)
                        //Add the user to the database

                        .then(() => {
                            res.status(200);
                            res.cookie("token", jwt.sign(newID, key), {
                                httpOnly : true,
                            });
                            //Sign an access token and store it in a cookie
                        });
                }
            })
            .catch(() => {
                res.status(500);
                res.send("database_error");
                //Handle any errors while running database commands
            });
    }

    res.end();
    //End the response
};

module.exports.method = "post";