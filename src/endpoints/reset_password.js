const jwt = require("jsonwebtoken");

module.exports = async function({req : {protocol, query : {email}, headers : {host}}, res, db, key, transporter}) {
    if (!/^\w+@\w+\.\w+$/.test(email)) {
        res.status(400);
        res.send("invalid_email");
        //Check the provided email is a valid email address
    }
    else {
        await db.get(`SELECT email FROM Users WHERE email="${email}"`)
            //Check if the email address is linked to an account

            .then(async rows => {
                if (!rows) {
                    res.status(400);
                    res.send("email_not_used");
                    //Return an error if the email given is not linked to an account
                }
                else {
                    await transporter.sendMail({
                        to : email,
                        subject : "Password Reset Request",
                        html : `<a href="${protocol}://${host}/html/reset_password.html?token=${jwt.sign({email}, key, {
                            expiresIn : "48h",
                        })}">Here</a> is the link to reset your password. It expires in 48 hours.`,
                    });
                    //Attempt to send the email with the reset link

                    res.status(200);
                    //If sending the email was successful, return a status code to indicate there was no error
                }
            })
            .catch(() => {
                res.status(500);
                res.send("email_error");
                //Return an error if sending the email or checking if the email is in the database failed
            });
    }

    res.end();
    //End the response
};

module.exports.method = "get";