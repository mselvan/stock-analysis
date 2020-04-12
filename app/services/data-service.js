const MongoClient = require('mongodb').MongoClient;
const config = require('../../app-config.json');

const DataService = {
    getPlots : async (ticker, startDate, endDate) => {
        const client = new MongoClient(config.MONGO_URL, config.MONGO_OPTIONS);
        await client.connect();
        const db = client.db(config.DB_NAME);
        db.collection = await db.collection(ticker.toLowerCase());
        let result = await db.collection.find({lastTradedDate: {$gt: startDate, $lt: endDate}}).toArray();
        console.log(result);
        return result;
    }
};
module.exports = DataService;