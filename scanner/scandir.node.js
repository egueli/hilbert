var fs = require('fs');
var util = require('util');
var CircularJSON = require('circular-json');

var root = {
	size: 0,
	children: [],
	parent: null
};


function scanRecursively(path, branch) {
	var items = fs.readdirSync(path);
    for (var i=0; i<items.length; i++) {
    	var item = items[i];
    	var stat = fs.statSync(path + "/" + item);
    	var leaf = {};
    	leaf.name = item;
    	leaf.parent = branch;
    	leaf.children = [];
    	leaf.size = 0;
    	if (stat.isFile()) {
    		leaf.size = stat.blocks;
    		var toAccumulate = leaf.parent;
    		while (toAccumulate != null) {
    			toAccumulate.size += stat.blocks;
    			toAccumulate = toAccumulate.parent;
    		}
    	}
    	if (stat.isDirectory()) {
    		var subPath = path + "/" + item;
    		scanRecursively(subPath, leaf);
    	}
        branch.children.push(leaf);
    }
}

scanRecursively(".", root);
console.log(CircularJSON.stringify(root));
