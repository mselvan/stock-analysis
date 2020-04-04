const FixedSizeQueue = require("../ds/fixed-size-queue");
const {DATA_INTERVALS} = require("../config");
const Decimal = require('mongodb').Decimal128;
const MIN_TEXT = "_min";
const MAX_TEXT = "_max";

const calculateAllMaxMin = function(data) {
    var minQueue = new FixedSizeQueue(DATA_INTERVALS.five_year);
    var maxQueue = new FixedSizeQueue(DATA_INTERVALS.five_year);
    var updateSpec = [];
    var counter = 0
    for(var entry in data) {
        var updateEntry = {};
        updateEntry.id =  'ObjectId("' + data[entry]._id + '")';
        updateEntry.values = {};
        minQueue.enqueue(data[entry].low);
        maxQueue.enqueue(data[entry].high);
        for(var interval in DATA_INTERVALS) {
            var movingMin = minQueue.minOfLast(DATA_INTERVALS[interval]);
            var movingMax = maxQueue.maxOfLast(DATA_INTERVALS[interval]);
            updateEntry.values[(interval + MIN_TEXT)] = 'NumberDecimal(“'+ movingMin +'”)';
            updateEntry.values[(interval + MAX_TEXT)] ='NumberDecimal(“'+ movingMax +'”)';
        }
        updateSpec.push(updateEntry);
    }
    return updateSpec;
}

module.exports = {calculateAllMaxMin: calculateAllMaxMin};
