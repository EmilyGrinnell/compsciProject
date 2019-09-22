module.exports = function(db) {
    return db.run(`CREATE TABLE Users (
        ID int PRIMARY KEY NOT NULL,
        username varchar(20) NOT NULL,
        password varchar NOT NULL,
        salt char(16) NOT NULL,
        admin BIT NOT NULL,
        steamIds varchar(186)
    )`);
    //Try and create the Users table
    //Only allow 10 Steam IDs to be linked to a single account, each separated by a +
};