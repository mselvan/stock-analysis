const FixedSizeQueue = require("../app/ds/fixed-size-queue");
const expect = require('chai').expect;

describe('Data Structures - Fixed Size Queue', function () {
    describe("Array functions", function () {
        let myQueue = new FixedSizeQueue(10);
        for(let i = 0; i < 100; i++) {
            myQueue.enqueue(i);
        }
        it("getAll() to return an array", function (done) {
            expect(myQueue.getAll()).to.be.an('array');
            done();
        });
        it("getLast(5) to return an array of 5 elements", function (done) {
            expect(myQueue.getLast(5)).to.be.an('array').that.has.length(5);
            done();
        });
        it("getLast(5) contains 99", function (done) {
            expect(myQueue.getLast(5)).to.be.an('array').that.include(99);
            done();
        });
        it("getLast(5) does not contain 19", function (done) {
            expect(myQueue.getLast(5)).to.be.an('array').that.does.not.include(19);
            done();
        });
    });
});