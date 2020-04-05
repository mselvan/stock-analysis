const assert = require('assert');
const {MONGO_URL, OPTIONS, INITIALIZE} = require("./config");
const {ObjectId} = require('mongodb');
let {calculateAllMaxMin} = require("./processors/calculation-processor");
var MongoClient = require('mongodb').MongoClient;

const client = new MongoClient(MONGO_URL, OPTIONS);

client.connect(function(err, client) {
    assert.equal(null, err);
    console.log("Connected correctly to server");
    const db = client.db("stockstore");

    db.spy = db.collection("spy");

    if(INITIALIZE) {
        db.spy.updateMany({}, [{
            $set: {
                "lastTradedDate": {$toDate: "$lastTradedDate"},
                "open": {$toDecimal: "$open"},
                "high": {$toDecimal: "$high"},
                "low": {$toDecimal: "$low"},
                "close": {$toDecimal: "$close"},
                "adjClose": {$toDecimal: "$adjClose"},
                "volume": {$toLong: "$volume"}
            }
        }]);
    }

    db.spy.find({}).sort({lastTradedDate: 1}).toArray(function(err, docs) {
        assert.equal(null, err);
        var updateDocs = calculateAllMaxMin(docs);
        console.log(docs);
        for(var i in updateDocs) {
            var update = updateDocs[i];
            console.log(update);
            db.spy.updateOne({_id: ObjectId(update.id)}, [
                {
                    $addFields: update.values
                }
            ], {upsert: false});
        }
    });
});
