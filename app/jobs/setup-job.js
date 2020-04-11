const MongoClient = require('mongodb').MongoClient;
const config = require('../../app-config.json');
const {ObjectId, Decimal128, Long} = require('mongodb');
const {calculateAllMaxMin} = require("../processors/calculation-processor");
const csvtojson = require("csvtojson");

module.exports = {setupCollections: async function(dbName, collection) {
        const client = new MongoClient(config.MONGO_URL, config.MONGO_OPTIONS);
        try {
            await client.connect();
            console.log("Connected correctly to server");
            const db = client.db(dbName);
            const collections = await db.listCollections({name: collection.name}).toArray();
            if(collections.length === 0) {
                var collection = await db.createCollection(collection.name);
            }
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
            let docs = await db.collection.find({}).sort({lastTradedDate: 1}).toArray();
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
    }};