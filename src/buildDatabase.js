module.exports = function(db) {
    return new Promise((resolve, reject) => {
        db.run(`CREATE TABLE Users (
            ID int,
            username varchar(20),
            password varchar,
            salt varchar,
            steamIds varchar(4590)
        )`, err => {
            if (!err) return resolve();

            console.log(err);
            reject(err.code);
            //Try and create the Users table
            //Only allow 255 Steam IDs to be linked to a single account, each separated by a +
        });
    });
};