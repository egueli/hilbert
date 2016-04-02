'use strict';

class Quadtree {
	static doTree(range, maxDepth, callback) {
		Quadtree.doTreeRecursive(range, maxDepth, callback, 0, 1, 0);
	}

	static doTreeRecursive(rangeToTest, maxDepth, callback, depth, scale, offset) {
		for (var i = 0; i < 1; i += 0.25) {
			var quadrant = range(i, i + 0.25).times(scale).add(offset);
			var result = rangeToTest.overlapTest(quadrant);

			if (result == 'in') {
				callback(depth, scale, quadrant);
			}
			if (result == 'part' && depth <= maxDepth) {
				Quadtree.doTreeRecursive(rangeToTest, maxDepth, callback, depth + 1, scale / 4, quadrant.from);
			}
		}
	}

}
