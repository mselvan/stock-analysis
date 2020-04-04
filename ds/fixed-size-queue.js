const assert = require('assert');

class FixedSizeQueue {
    constructor(size) {
        assert(size > 0);
        this.maxIndex = size -1;
        this.size = size;
        this.elements = [];
    }

    getAll() {
        return this.elements;
    }

    getLast(chunkSize) {
        return this.elements.slice(Math.max(this.length() - chunkSize, 0));
    }

    enqueue(e) {
        if(this.length() == this.size) this.dequeue();
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
        return Math.max(...this.elements);
    }

    min() {
        return Math.min(...this.elements);
    }

    maxOfLast(chunkSize) {
        return Math.max(...this.getLast(chunkSize));
    }

    minOfLast(chunkSize) {
        return Math.min(...this.getLast(chunkSize));
    }
}


module.exports = FixedSizeQueue;

