const request = require("request");

class API {
    constructor(apiKeys) {
        this.apiKeys = apiKeys;
        this.currentKey = 0;
        //Start with first API key in passed array
    }

    static formQueryString(query) {
        return Object.keys(query).map((key, index) => `${!index ? "?" : "&"}${key}=${query[key]}`).join("");
        //Form a query string from a given object
    }

    makeRequest(path, query) {
        return new Promise((resolve, reject) => {
            request({
                url : `https://api.steampowered.com/${path}${API.formQueryString(Object.assign(query, {
                    key : this.apiKeys[this.currentKey],
                }))}`,
                //Generate the URL with the requested query and add the API key
                json : true,
            }, async (err, res, body) => {
                if (res.statusCode == 403) {
                    //Invalid API key

                    if (++ this.currentKey == this.apiKeys.length) return reject();
                    //Reject the promise if there are no more available API keys

                    this.makeRequest(path, query)
                        .then(resolve)
                        .catch(reject);
                    //Retry the request with the updated API key
                }
                else resolve(res, body);
                //Resolve the promise if the API key was valid
            });
        });
    }
}

module.exports = API;
//API class used to recursively make requests with different API keys until a valid one is found
//Steam allows 100,000 requests per day so it should never need to use any but the first one, but allow for an unlimited amount to be used