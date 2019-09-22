const fs = require("fs");
const path = require("path");

module.exports = async function({query : {id}}, res, db, key, api) {
    await api.makeRequest("ISteamUserStats/GetUserStatsForGame/v0002", {
        appid : 730,
        steamid : id,
    })
        .then((r, body) => {
            switch (r.statusCode) {
                case 200:
                    //Valid request
    
                    if (!fs.existsSync(path.resolve(__dirname, "../json/"))) fs.mkdirSync(path.resolve(__dirname, "../json/"));
                    fs.writeFileSync(path.resolve(__dirname, `../json/${id}.json`), JSON.stringify(body, null, 4));
                    //Ensure folder exists for JSON stat data and then save the data to a file there
    
                    res.status(200);
                    return res.send(body);
                    //Return data receieved from Steam API
                case 500:
                    //Invalid Steam ID
    
                    res.status(400);
                    res.send("invalid_id");
                    //Return error message
            }
        })
        .catch(() => {
            res.status(500);
            res.send("all_keys_invalid");
            //Handle the rejection thrown if no valid Steam API keys are available
        });

    res.end();
    //End the response
};

module.exports.method = "get";