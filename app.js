const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const {MONGO_URL, DB_NAME, COLLECTION_NAME, OPTIONS, START_OVER} = require("./config");
const {ObjectId, Timestamp, Decimal128, Long} = require('mongodb');
const {calculateAllMaxMin} = require("./processors/calculation-processor");
const csvtojson = require("csvtojson");

(async function () {
    const client = new MongoClient(MONGO_URL, OPTIONS);

    try {
        await client.connect();
        console.log("Connected correctly to server");

        const db = client.db(DB_NAME);
        db.spy = db.collection(COLLECTION_NAME);

        if (START_OVER) {
            await db.spy.deleteMany({});
            await csvtojson()
                .fromFile("./data/SPY.csv")
                .subscribe((jsonObj) => {
                    delete jsonObj.adjClose;
                    jsonObj.lastTradedDate = new Date(jsonObj.lastTradedDate);
                    jsonObj.open = Decimal128.fromString(jsonObj.open);
                    jsonObj.high = Decimal128.fromString(jsonObj.high);
                    jsonObj.low = Decimal128.fromString(jsonObj.low);
                    jsonObj.close = Decimal128.fromString(jsonObj.close);
                    jsonObj.volume = Long.fromString(jsonObj.volume);
                })
                .then(csvData => {
                    console.log(csvData);
                    db.spy.insertMany(csvData);
                });
        }
        let docs = await db.spy.find({}).sort({lastTradedDate: 1}).toArray();
        let calculatedData = calculateAllMaxMin(docs);
        for (toUpdate of calculatedData) {
            // console.log(toUpdate);
            await db.spy.updateOne({_id: ObjectId(toUpdate.id)}, [
                {
                    $addFields: toUpdate.values
                }
            ], {upsert: false});
        }
    } catch (err) {
        console.log(err.stack);
    }
    // Close connection
    client.close();
})();