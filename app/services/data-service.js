const MongoClient = require('mongodb').MongoClient;
const config = require('../../app-config.json');

const DataService = {
    getPlots: async (ticker, startDate, endDate) => {
        const client = new MongoClient(config.MONGO_URL, config.MONGO_OPTIONS);
        await client.connect();
        const db = client.db(config.DB_NAME);
        db.collection = await db.collection(ticker.toLowerCase());
        let result = await db.collection.aggregate([
            {$match: {lastTradedDate: {$gt: startDate, $lt: endDate}}},
            {
                $project: {
                    _id: 0,
                    date: {$dateToString: { format: "%Y-%m-%d", date: "$lastTradedDate" }},
                    close: {$round: [{$toDouble : "$close"}, 2]},
                    week_low: {$round: [{$toDouble : "$week_low"}, 2]}
                }
            }
        ]).toArray();
        let response = {ticker: ticker, timeseries: result};
        return response;
    }
};
module.exports = DataService;