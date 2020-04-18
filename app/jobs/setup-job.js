const MongoClient = require('mongodb').MongoClient;
const config = require('../../app-config.json');
const {ObjectId, Decimal128, Long} = require('mongodb');
const {calculateAllMaxMin} = require("../processors/calculation-processor");
const csvtojson = require("csvtojson");

async function setupCollection(dbName, collection) {
    const client = new MongoClient(config.MONGO_URL, config.MONGO_OPTIONS);
    try {
        await client.connect();
        console.log("Connected correctly to server");
        const db = client.db(dbName);
        db.collection = await db.collection(collection.name);
        var docCount = await db.collection.countDocuments({});
        if(docCount !== 0) await db.collection.deleteMany({});
        const csvData = await csvtojson()
            .fromFile(collection.csvFile)
            .subscribe((jsonObj) => {
                var keys = Object.keys(jsonObj);
                jsonObj.lastTradedDate = new Date(jsonObj.Date);
                jsonObj.open = Decimal128.fromString(jsonObj.Open);
                jsonObj.high = Decimal128.fromString(jsonObj.High);
                jsonObj.low = Decimal128.fromString(jsonObj.Low);
                jsonObj.close = Decimal128.fromString(jsonObj.Close);
                jsonObj.volume = Long.fromString(jsonObj.Volume);
                keys.forEach(key => delete jsonObj[key]);
            });
        await db.collection.insertMany(csvData);
        let docs = await db.collection.aggregate([
            {$match: {}},
            {
                $project: {
                    open: {$toDouble : "$open"},
                    high: {$toDouble : "$high"},
                    low: {$toDouble : "$low"},
                    close: {$toDouble : "$close"}
                }
            }]).sort({lastTradedDate: 1}).toArray();
        console.log("Docs fetched count: " + docs.length);
        let calculatedData = calculateAllMaxMin(docs);
        console.log("Calculated data count: " + calculatedData.length);
        for (toUpdate of calculatedData) {
            // console.log(toUpdate);
            await db.collection.updateOne({_id: ObjectId(toUpdate.id)}, [
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
}

module.exports = {
    initialize: async function (initOverride = false) {
        const client = new MongoClient(config.MONGO_URL, config.MONGO_OPTIONS);
        await client.connect();
        const db = client.db(config.DB_NAME);
        const collections = await db.listCollections({name: {$in : config.COLLECTIONS.map(c => c.name)}}).toArray();
        const existingCollectionNames = collections.map(c => c.name);
        for(collection of config.COLLECTIONS) {
            let initialize = false;
            if(! existingCollectionNames.includes(collection.name)) {
                await db.createCollection(collection.name);
                initialize = true;
            }
            if(config.START_OVER || initialize || initOverride) {
                console.log("Setting up initial data for " + collection.name);
                await setupCollection(config.DB_NAME, collection);
            }
            // close connection
            client.close();
        }
    }
};