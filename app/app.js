const config = require('../app-config.json');
const {setupCollections} = require("./jobs/setup-job");

async function main() {
    if(config.START_OVER) {
        console.log("Setting up initial data")
        for(collection of config.COLLECTIONS) {
            await setupCollections(config.DB_NAME, collection);
        }
    }
}

main();