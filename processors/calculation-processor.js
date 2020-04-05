const FixedSizeQueue = require("../ds/fixed-size-queue");
const {DATA_INTERVALS} = require("../config");
const {getPercentChange} = require("../utils/general-utils");
const {Decimal128} = require('mongodb');
const LOW_TEXT = "_low";
const HIGH_TEXT = "_high";
const LOW_PERCENT_CHANGE_TEXT = "_low_to_close_change_percent";
const HIGH_PERCENT_CHANGE_TEXT = "_high_to_close_change_percent";

module.exports = {calculateAllMaxMin: function(data) {
        var minQueue = new FixedSizeQueue(DATA_INTERVALS.five_year);
        var maxQueue = new FixedSizeQueue(DATA_INTERVALS.five_year);
        var updateSpec = [];
        var counter = 0
        for(var entry of data) {
            var updateEntry = {};
            updateEntry.id =  entry._id;
            updateEntry.values = {};
            minQueue.enqueue(entry.low);
            maxQueue.enqueue(entry.high);
            for(var interval in DATA_INTERVALS) {
                var movingMin = minQueue.minOfLast(DATA_INTERVALS[interval]);
                var movingMax = maxQueue.maxOfLast(DATA_INTERVALS[interval]);
                updateEntry.values[(interval + LOW_TEXT)] = { $toDecimal: movingMin.toString()};
                updateEntry.values[(interval + HIGH_TEXT)] = { $toDecimal: movingMax.toString()};
                updateEntry.values[(interval + LOW_PERCENT_CHANGE_TEXT)] = { $toDecimal: (getPercentChange(entry.close, movingMin)).toString()};
                updateEntry.values[(interval + HIGH_PERCENT_CHANGE_TEXT)] = { $toDecimal: (getPercentChange(entry.close, movingMax)).toString()};
            }
            updateSpec.push(updateEntry);
        }
        return updateSpec;
    }};
