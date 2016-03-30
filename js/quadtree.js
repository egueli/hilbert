
function indent(depth) {
	var s = ""
	for (var d = 0; d < depth; d++) s += "  ";
	return s;
}

function doTree(rangeToTest, callback, depth, scale, offset) {
	if (depth === undefined) {
		doTree(rangeToTest, callback, 0, 1, 0);
		return;
	}

	for (var i = 0; i < 1; i += 0.25) {
		var quadrant = range(i, i + 0.25).times(scale).add(offset);
		var result = rangeToTest.overlapTest(quadrant);

		if (result == 'in') {
			callback(depth, scale, quadrant);
		}
		if (result == 'part' && depth < 10) {
			doTree(rangeToTest, callback, depth + 1, scale / 4, quadrant.from);
		}
	}
}

doTree(range(process.argv[2], process.argv[3]), function(depth, scale, quadrant) {
	var s = indent(depth);
	s += quadrant.toString();
	console.log(s);
});