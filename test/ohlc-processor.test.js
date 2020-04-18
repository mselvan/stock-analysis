const HistoricalOhlcProcessor = require("../app/processors/historical-ohlc-processor");
const expect = require('chai').expect;
const config = require('../app-config.json');

describe('Processors - OHLC Processor', function () {
    let ohlcProcessor = new HistoricalOhlcProcessor(config.DATA_INTERVALS);
    it("Max", function (done) {
        ohlcProcessor.addDataPoint({"high" : 45, "low": 20});
        expect(ohlcProcessor.getMax("week")).to.equal(45);
        done();
    });
});
