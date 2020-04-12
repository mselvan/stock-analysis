const config = require('../app-config.json');
const {initialize} = require("./jobs/setup-job");

async function main() {
    await initialize();
}

main();