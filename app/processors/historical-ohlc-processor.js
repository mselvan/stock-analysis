const assert = require('assert');
const OhlcQueue = require("../ds/ohlc-queue");

class HistoricalOhlcProcessor {
    constructor(config) {
        this.queueMap = {};
        for(const key of Object.keys(config)) {
            let ohlcQueue = new OhlcQueue(config[key]);
            this.queueMap[key] = ohlcQueue;
        }
    }

    addDataPoint(e) {
        for(const key of Object.keys(this.queueMap)) {
            this.queueMap[key].enqueue(e);
        }
    }

    getMax(key) {
        assert(Object.keys(this.queueMap).includes(key));
        return this.queueMap[key].max();
    }

    getMin(key) {
        assert(Object.keys(this.queueMap).includes(key));
        return this.queueMap[key].min();
    }
}

module.exports = HistoricalOhlcProcessor;