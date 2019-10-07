const jwt = require("jsonwebtoken");
const crypto = require("crypto");

module.exports = async function({req : {body : {token, password}}, res, db, key}) {
    try {
        let email = jwt.verify(token, key).email;
        //Try and decrypt the token passed in the request to get the account to reset the password for and ensure it has not expired

        await db.get(`SELECT ID, salt FROM Users WHERE email="${email}"`)
            //Try and get the salt of the linked account
        
            .then(async ({ID, salt}) => {
                await db.run(`UPDATE Users SET password="${crypto.createHmac("sha512", salt).update(password).digest("hex")}"`);
                //Try to save the new encrypted password to the database

                res.status(200);
                res.cookie("token", jwt.sign(ID, key), {
                    httpOnly : true,
                });
                //Set the access token cookie to log the user in after successfully resetting their password
            })
            .catch(() => {
                res.status(500);
                res.send("database_error");
                //Respond with an error if any database commands fail
            });
    }
    catch (e) {
        res.status(400);
        res.send("invalid_token");
        //Respond with an error if the token is invalid
    }

    res.end();
    //End the response
};

module.exports.method = "post";