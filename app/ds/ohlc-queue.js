const assert = require('assert');

class OhlcQueue {
    constructor(size) {
        assert(size > 0);
        this.maxIndex = size -1;
        this.size = size;
        this.elements = [];
        this.periodHigh = Number.MIN_SAFE_INTEGER;
        this.periodLow = Number.MAX_SAFE_INTEGER;
    }

    getAll() {
        return this.elements;
    }

    enqueue(e) {
        if(this.length() === this.size) {
            let recalculateMax = this.max() === this.elements[0].high;
            let recalculateMin = this.min() === this.elements[0].low;
            this.dequeue();
            if(recalculateMax) this.periodHigh = Math.max(...this.elements.map(entry => entry.high));
            if(recalculateMin) this.periodLow = Math.min(...this.elements.map(entry => entry.low));
        }
        this.periodHigh = e.high > this.periodHigh ? e.high : this.periodHigh;
        this.periodLow = e.low < this.periodLow ? e.low : this.periodLow;
        this.elements.push(e);
    }

    dequeue() {
        return this.elements.shift();
    }

    maxElements() {
        return this.size;
    }

    length() {
        return this.elements.length;
    }

    max() {
        return this.periodHigh;
    }

    min() {
        return this.periodLow;
    }
}


module.exports = OhlcQueue;

