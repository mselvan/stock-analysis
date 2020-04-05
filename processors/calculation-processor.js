const FixedSizeQueue = require("../ds/fixed-size-queue");
const {DATA_INTERVALS} = require("../config");
const {Decimal128} = require('mongodb');
const LOW_TEXT = "_low";
const HIGH_TEXT = "_high";

const calculateAllMaxMin = function(data) {
    var minQueue = new FixedSizeQueue(DATA_INTERVALS.five_year);
    var maxQueue = new FixedSizeQueue(DATA_INTERVALS.five_year);
    var updateSpec = [];
    var counter = 0
    for(var entry in data) {
        var updateEntry = {};
        // updateEntry.id =  'ObjectId("' + data[entry]._id + '")';
        updateEntry.id =  data[entry]._id;
        updateEntry.values = {};
        minQueue.enqueue(data[entry].low);
        maxQueue.enqueue(data[entry].high);
        for(var interval in DATA_INTERVALS) {
            var movingMin = minQueue.minOfLast(DATA_INTERVALS[interval]);
            var movingMax = maxQueue.maxOfLast(DATA_INTERVALS[interval]);
            updateEntry.values[(interval + LOW_TEXT)] = new Decimal128(movingMin);
            updateEntry.values[(interval + HIGH_TEXT)] = new Decimal128(movingMax);
        }
        updateSpec.push(updateEntry);
    }
    return updateSpec;
}

module.exports = {calculateAllMaxMin: calculateAllMaxMin};
