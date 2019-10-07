module.exports = function(db) {
    return db.exec(`CREATE TABLE Users (
        ID int(15) PRIMARY KEY NOT NULL,
        username varchar(20) NOT NULL,
        password varchar NOT NULL,
        email varchar NOT NULL,
        salt char(16) NOT NULL,
        admin bit NOT NULL
    ); CREATE TABLE steamAccounts (
        userID int(15) NOT NULL,
        steamID int(186),
        lastRefreshed int,
        FOREIGN KEY(userID) REFERENCES Users(ID)
    ); CREATE TABLE Weapons (
        steamID int(186),
        FOREIGN KEY(steamID) REFERENCES steamAccounts(steamID)
    ); CREATE TABLE Achievements (
        steamID int(186),
        FOREIGN KEY(steamID) REFERENCES steamAccounts(steamID)
    ); CREATE TABLE Other (
        steamID int(186),
        FOREIGN KEY(steamID) REFERENCES steamAccounts(steamID)
    )`);
};