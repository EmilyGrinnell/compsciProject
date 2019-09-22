const childProcess = require("child_process");
const dependencies = Object.keys(require("../package.json").dependencies);
//Get required packages from package.json file

try {
    for (let x = 0; x < dependencies.length; x ++) require(dependencies[x]);
    //Check all dependencies are installed

    require("./app.js");
    //Run app
}
catch (e) {
    if (!e.message.startsWith("Cannot find module '")) return console.log(e);
    //Ignore any errors in the actual app and only catch missing dependency errors

    console.log("Missing required dependencies, attempting to install them with Yarn");
    childProcess.exec("yarn install", (err, stdout, stderr) => {
        if (stderr.startsWith("'yarn' is not recognized")) {
            console.log("Failed to install dependencies with Yarn as it does not appear to be installed. Attempting to install dependencies using NPM");
            //Attempt to install dependencies using Yarn first

            childProcess.exec("npm install", (err, stdout, stderr) => {
                if (stderr) console.log("Failed to install required dependencies using Yarn or NPM");
                else require("./app.js");
                //Try installing using NPM if Yarn is not installed
                //Run app if installation with NPM is successful, otherwise exit the program
            });
        }
        else if (!stderr) require("./app.js");
        else console.log(`An error occurred whilst installing packages with Yarn:\n${stderr}`);
        //Run app if installation with Yarn is successful
    });
}