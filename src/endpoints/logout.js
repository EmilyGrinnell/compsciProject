module.exports = function({res}) {
    res.status(200);
    res.clearCookie("token");
    res.end();
    //Set the access token cookie to expire immediately
};

module.exports.method = "get";