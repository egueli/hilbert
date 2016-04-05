var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var light = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( light );

var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
directionalLight.position.set( 1, 1, 1 );
scene.add( directionalLight );

var rootObject = new THREE.Object3D();
scene.add(rootObject);

camera.position.y = 1;
camera.position.z = 1;
camera.lookAt(new THREE.Vector3(0,0,0));

var maxDetail = 4;
var maxDepth = 80;
var layerHeight = 0.025;

function render() {
	requestAnimationFrame( render );

	rootObject.rotation.y += 0.003;

	renderer.render( scene, camera );
}

var green = new THREE.MeshLambertMaterial( { color: 0x00ff00 } );

var blocks = new THREE.Object3D();
rootObject.add(blocks);

function buildGeometries() {
	var ph = 0.05;
	var planeGeom = new THREE.BoxGeometry(1.05, ph, 1.05);
	var planeMesh = new THREE.Mesh(planeGeom, green);
	planeMesh.position.y = -ph;
	rootObject.add(planeMesh);
}

function putBlocks(h) {
	var color = new THREE.Color();
	color.setHSL(Math.random(), Math.random(), 0.5);
	var material = new THREE.MeshLambertMaterial(
		{ color: color } 
		);
	return function(x, y, size) {
		var geometry = new THREE.BoxGeometry(size, layerHeight, size);
		var block = new THREE.Mesh(geometry, material);
		block.position.x = x - 0.5 + size / 2;
		block.position.y = h + layerHeight / 2;
		block.position.z = y - 0.5 + size / 2;
		blocks.add(block);
	}
}

var tree;

function updateGeometries() {
	rootObject.remove(blocks);
	blocks = new THREE.Object3D();
	traverseRecursively(tree, 0, 0, 1 / tree.size);
	rootObject.add(blocks);
}

function traverseRecursively(branch, depth, begin, scale) {
	if (depth > maxDepth)
		return;

	var end = begin + (branch.size * scale);
	traverseRangeInHilbert(maxDetail, begin, end, putBlocks(depth * layerHeight));

	var childBegin = begin;
	for (var i = 0; i < branch.children.length; i++) {
	 	traverseRecursively(branch.children[i], depth + 1, childBegin, scale);
	 	childBegin += branch.children[i].size * scale;					
	}
}

function fullPath(branch) {
	if (branch == null) {
		return "";
	}
	return fullPath(branch.parent) + "/" + branch.name;
}

var rid = 0;
function traverseRangeInHilbert(maxDetail, from, to, callback) {
	Quadtree.doTree(range(from, to), maxDetail, function(depth, scale, quadrant) {
		var level = depth + 1;
		var size_t = (1<<(2*level));
		var size_2d = (1<<level);
		var blockSize = 1 / size_2d;
		var t = quadrant.from * size_t;
		var xyH = hilbert.d2xy(level, t);
		var x = xyH[0] / size_2d;
		var y = xyH[1] / size_2d;
		callback(x, y, blockSize);
	});
}

$(document).ready(function() {
	$.ajax({
		url: "scan.json",
		dataType: "text"
	}).done(function(data) {
		tree = CircularJSON.parse(data);
		start();
	}).fail(function(err) {
		console.log(err);
	});
});

function start() {
	buildGeometries();
	updateGeometries();
	render();
}
