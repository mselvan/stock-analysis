const MongoClient = require('mongodb').MongoClient;
const config = require('../../app-config.json');
const _ = require('lodash');
const data_config = require("./data-config");

const DataService = {
    getPlots: async (tickers, startDate, endDate, lowHigh) => {
        const client = new MongoClient(config.MONGO_URL, config.MONGO_OPTIONS);
        await client.connect();
        const db = client.db(config.DB_NAME);
        let response = {};
        for(const ticker of tickers) {
            db[ticker] = await db.collection(ticker.toLowerCase());
            let projection = {
                /*ticker: ticker.toUpperCase()*/
            };
            switch (lowHigh) {
                case "week":
                    projection = _.defaults(projection, data_config.default_projection, data_config.week);
                    break;
                case "month":
                    projection = _.defaults(projection, data_config.default_projection, data_config.month);
                    break;
                case "quarter":
                    projection = _.defaults(projection, data_config.default_projection, data_config.quarter);
                    break;
                case "year":
                    projection = _.defaults(projection, data_config.default_projection, data_config.year);
                    break;
                case "five_year":
                    projection = _.defaults(projection, data_config.default_projection, data_config.five_year);
                    break;
                case "all":
                    projection = _.defaults(projection, ...Object.values(data_config));
                    break;
                default:
                    projection = _.defaults(projection, data_config.default_projection);
                    break;
            }
            let result = await db[ticker].aggregate([
                {$match: {lastTradedDate: {$gt: startDate, $lt: endDate}}},
                {
                    $project: projection
                }
            ]).toArray();
            response[ticker.toUpperCase()] = result;
        }
        return response;
    }
};
module.exports = DataService;