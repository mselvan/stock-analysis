const FixedSizeQueue = require("./ds/fixed-size-queue");
const config = require("./config");
var MongoClient = require('mongodb').MongoClient;

// Connection URL
var records = 21;
// Use connect method to connect to the Server
MongoClient.connect(config.MONGO_URL, {
    useUnifiedTopology: true
}, function (err, client) {
    var db = client.db("stockstore");
    console.log("Connected correctly to server");

    db.spy = db.collection('spy')
    // db.spy.deleteMany({});
    /*  db.spy.updateMany({}, [{
        $set: {
          "lastTradedDate": {$toDate: "$lastTradedDate"},
          "open": {$toDecimal: "$open"},
          "high": {$toDecimal: "$high"},
          "low": {$toDecimal: "$low"},
          "close": {$toDecimal: "$close"},
          "adjClose": {$toDecimal: "$adjClose"},
          "volume": {$toLong: "$volume"}
        }
      }]);*/
    /*  var counter = 1;
      db.spy.find().sort({lastTradedDate : 1}).forEach(function(entry) {
        db.spy.updateOne({_id: entry._id}, [{
          $set: {"n": counter}
        }]);
        console.log(counter);
        counter++;
      });*/
    var daysQueue = new FixedSizeQueue(records);
    db.spy.find().sort({lastTradedDate : 1}).limit(1).forEach(function(entry) {
        daysQueue.enqueue(parseFloat(entry.high));
        max21 = "max" + 63;
        newFields = { max21 : 21};
        db.spy.updateOne({_id: entry._id}, [{
            $addFields: newFields
        }]);
        console.log(daysQueue.max());
    });
});