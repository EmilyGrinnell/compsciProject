const fs = require("fs");
const path = require("path");

module.exports = async function({req : {query : {id}}, res, api}) {
    await api.makeRequest("ISteamUserStats/GetUserStatsForGame/v0002", {
        appid : 730,
        steamid : id,
        //App ID 730 is CS:GO, steamid is the Steam ID the user wishes to retrieve stats for
    })
        .then((r, body) => {
            switch (r.statusCode) {
                case 200:
                    //Valid request
    
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