const crypto = require("crypto");
const jwt = require("jsonwebtoken");

module.exports = async function({req : {body : {username = "", password = ""}}, res, db, key}) {
    await db.get(`SELECT ID, salt, password FROM Users WHERE LOWER(username)="${username.toLowerCase()}"`)
        //Fetch the ID, salt and encrypted password of the first user in the database with a matching username (ignoring cases)

        .then(({ID, salt, password : pw} = {}) => {
            if (salt && crypto.createHmac("sha512", salt).update(password).digest("hex") == pw) {
                res.status(200);
                res.cookie("token", jwt.sign(ID, key), {
                    httpOnly : true,
                });
                //Check the row is not empty and compare the stored hashed password with a hash of the received password
                //If the passwords match, sign an access token and store it in a cookie
            }
            else {
                res.status(401);
                res.send("invalid_login");
                //Return an error if the user does not exist or the password is wrong
            }
        })
        .catch(() => {
            res.status(500);
            res.send("database_error");
            //Return an error if attempting to fetch the user from the database fails
        });

        res.end();
        //End the response
};

module.exports.method = "post";