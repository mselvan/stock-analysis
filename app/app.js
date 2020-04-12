const config = require('../app-config.json');
const {initialize} = require("./jobs/setup-job");
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const apiRoutes = require('./routes/api-routes');

async function main() {
    await initialize();
    // defining the Express app
    const app = express();
    app.use(helmet());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    app.use(cors());
    app.use(morgan('combined'));

    // Use Api routes in the App
    app.use("/", apiRoutes);

    // starting the server
    app.listen(3000, () => {
        console.log('listening on port 3000');
    });
}

main(); // Entry point
