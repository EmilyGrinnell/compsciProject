const request = require("request");
const jwt = require("jsonwebtoken");

module.exports = function(req, res, db, key) {
    request({
        url : "https://steamcommunity.com/openid/login",
        method : "POST",
        form : Object.assign(req.query, {
            "openid.mode" : "check_authentication",
        }),
        //Send request to Steam to verify the login is valid
    }, async (err, r, body) => {
        if (err) {
            res.status(400);
            res.send("request_error");
            //Handle any errors returned by Steam
        }
        else if (!body.includes("is_valid:true")) {
            res.status(401);
            res.send("invalid_login");
            //Handle invalid login requests
        }
        else {
            await db.get(`SELECT ID FROM Users WHERE steamIds LIKE "%${req.query["openid.claimed_id"].match(/\d{17}/)[0]}%"`)
                //Get the ID of the first user who has linked their account to the returned 17-digit Steam ID

                .then(row => {
                    if (!row) {
                        res.status(401);
                        res.send("no_linked_steam");
                        //Check the returned Steam ID is linked to an account
                    }
                    else {
                        res.status(200);
                        res.cookie("token", jwt.sign(row.ID, key), {
                            httpOnly : true,
                        });
                        //Sign an access token and store it in a cookie
                    }
                })
                .catch(() => {
                    res.status(500);
                    res.send("database_error");
                    //Handle any errors checking the database for a linked Steam account
                });
        }

        res.end();
        //End the response
    });
};

module.exports.method = "get";