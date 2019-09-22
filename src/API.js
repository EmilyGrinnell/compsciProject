const request = require("request");

class API {
    constructor(apiKeys) {
        this.apiKeys = apiKeys;
        this.currentKey = 0;
    }

    static formQueryString(query) {
        return Object.keys(query).map((key, index) => `${!index ? "?" : "&"}${key}=${query[key]}`).join("");
    }

    makeRequest(path, query) {
        return new Promise((resolve, reject) => {
            request({
                url : `https://api.steampowered.com/${path}${API.formQueryString(Object.assign(query, {
                    key : this.apiKeys[this.currentKey],
                }))}`,
                json : true,
            }, async (err, res, body) => {
                if (res.statusCode == 403) {
                    if (++ this.currentKey == this.apiKeys.length) return reject();

                    this.makeRequest(path, query)
                        .then(resolve)
                        .catch(reject);
                }
                else resolve(res, body);
            });
        });
    }
}

module.exports = API;
//API class used to recursively make requests with different API keys until a valid one is found
//Steam allows 100,000 requests per day so it should never need to use any but the first one, but allow for an unlimited amount to be used