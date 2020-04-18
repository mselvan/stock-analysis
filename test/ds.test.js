const OhlcQueue = require("../app/ds/ohlc-queue");
const expect = require('chai').expect;

describe('Data Structures - Fixed Size Queue', function () {
    describe("Array functions", function () {
        let myQueue = new OhlcQueue(10);
        for(let i = 0; i < 100; i++) {
            myQueue.enqueue(i);
        }
        it("getAll() to return an array", function (done) {
            expect(myQueue.getAll()).to.be.an('array');
            done();
        });
    });
});