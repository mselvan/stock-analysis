const config = require('../../app-config.json');
const HistoricalOhlcProcessor = require('../processors/historical-ohlc-processor');
const LOW_TEXT = "_low";
const HIGH_TEXT = "_high";

module.exports = {calculateAllMaxMin: function(data) {
    let ohlcProcessor = new HistoricalOhlcProcessor(config.DATA_INTERVALS);
    let updateSpec = [];
    let counter = 0
    for(let entry of data) {
        let updateEntry = {};
        updateEntry.id =  entry._id;
        updateEntry.values = {};
        ohlcProcessor.addDataPoint(entry);
        for(var interval in config.DATA_INTERVALS) {
            let movingMin = ohlcProcessor.getMin(interval);
            let movingMax = ohlcProcessor.getMax(interval);
            updateEntry.values[(interval + LOW_TEXT)] = { $toDecimal: movingMin.toString()};
            updateEntry.values[(interval + HIGH_TEXT)] = { $toDecimal: movingMax.toString()};
        }
        updateSpec.push(updateEntry);
    }
    return updateSpec;
}};
