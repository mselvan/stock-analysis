const {getPercentChange} = require("../app/utils/general-utils");
const expect = require('chai').expect;
const testData = [
    {"current": 100, "previous": 50, "change": 1},
    {"current": 50, "previous": 100, "change": -0.5},
    {"current": 75, "previous": 50, "change": 0.5},
    {"current": 70, "previous": 40, "change": 0.75},
    {"current": 39, "previous": 30, "change": 0.3}
];

function itShouldTestArray(test) {
    it('For ' + test.previous + ' to ' + test.current + ' there is a ' + test.change * 100 + '% change', function () {
        expect(getPercentChange(test.current, test.previous)).to.equal(test.change);
    });
}

describe('Percentage Change', function () {
    for(test of testData) {
        itShouldTestArray(test);
    }
});