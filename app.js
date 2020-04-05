const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const {MONGO_URL, DB_NAME, COLLECTION_NAME, OPTIONS, START_OVER} = require("./config");
const {ObjectId, Timestamp, Decimal128, Long} = require('mongodb');
const {calculateAllMaxMin} = require("./processors/calculation-processor");
const csvtojson = require("csvtojson");
let initialize = START_OVER;

(async function () {
    const client = new MongoClient(MONGO_URL, OPTIONS);
    try {
        await client.connect();
        console.log("Connected correctly to server");
        const db = client.db(DB_NAME);
        const collections = await db.listCollections({name: COLLECTION_NAME}).toArray();
        if(collections.length == 0) {
            var collection = await db.createCollection(COLLECTION_NAME);
            initialize = true;
        }
        db.spy = await db.collection(COLLECTION_NAME);
        var docCount = await db.spy.countDocuments({});
        if(docCount == 0) {
            initialize = true
        }
        if (START_OVER || initialize) {
            if(docCount != 0) await db.spy.deleteMany({});
            const csvData = await csvtojson()
                .fromFile("./data/SPY.csv")
                .subscribe((jsonObj) => {
                    delete jsonObj.adjClose;
                    jsonObj.lastTradedDate = new Date(jsonObj.lastTradedDate);
                    jsonObj.open = Decimal128.fromString(jsonObj.open);
                    jsonObj.high = Decimal128.fromString(jsonObj.high);
                    jsonObj.low = Decimal128.fromString(jsonObj.low);
                    jsonObj.close = Decimal128.fromString(jsonObj.close);
                    jsonObj.volume = Long.fromString(jsonObj.volume);
                });
            await db.spy.insertMany(csvData);
        }
        let docs = await db.spy.find({}).sort({lastTradedDate: 1}).toArray();
        console.log("Docs fetched count: " + docs.length);
        let calculatedData = calculateAllMaxMin(docs);
        console.log("Calculated data count: " + calculatedData.length);
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