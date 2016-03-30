'use strict';

class Range {
	constructor(from, to) {
		if (to < from) {
			throw new Error("invalid range: [" + from + ", " + to + ")");
		}
		this.from = from;
		this.to = to;
	}

	times(n) {
		return new Range(this.from * n, this.to * n);
	}

	add(offset) {
		return new Range(this.from + offset, this.to + offset);
	}

	overlapTest(reference) {
		if (reference.to <= this.from) // this is fully on the right of ref
			return 'out';
		if (reference.from >= this.to) // this is fully on the left of ref
			return 'out';
		if (reference.from >= this.from && reference.to <= this.to) // ref is fully inside this
			return 'in';
//		if (reference.from <= this.from && reference.to >= this.to) // this is fully inside ref
		// should return 'in', but this case requires deeper investigation
			return 'part';
	}

	toString() {
		return "[" + this.from + ", " + this.to + ")";
	}
}

function range(from, to) {
	return new Range(from, to);
}

/*
var rangeToTest = range(0.2, 0.4);

console.log(rangeToTest.overlapTest(range(0.0, 0.1)) == 'out');
console.log(rangeToTest.overlapTest(range(0.1, 0.2)) == 'out');
console.log(rangeToTest.overlapTest(range(0.1, 0.3)) == 'part');
console.log(rangeToTest.overlapTest(range(0.1, 0.4)) == 'in');
console.log(rangeToTest.overlapTest(range(0.1, 0.5)) == 'in');
console.log(rangeToTest.overlapTest(range(0.2, 0.5)) == 'in');
console.log(rangeToTest.overlapTest(range(0.3, 0.5)) == 'part');
console.log(rangeToTest.overlapTest(range(0.4, 0.5)) == 'out');
console.log(rangeToTest.overlapTest(range(0.2, 0.4)) == 'in');
console.log(rangeToTest.overlapTest(range(0.203125, 0.21875)) == 'in');
*/

