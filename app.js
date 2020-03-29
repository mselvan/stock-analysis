var MongoClient = require('mongodb').MongoClient

// Connection URL
var url = 'mongodb://localhost:27017/';
var records = 21;
// Use connect method to connect to the Server
MongoClient.connect(url, {
  useUnifiedTopology: true
}, function (err, client) {
  var db = client.db("stockstore");
  console.log("Connected correctly to server");
  //console.log(db.collection('spy').findOne({}));
});