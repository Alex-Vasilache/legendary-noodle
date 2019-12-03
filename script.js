var stop = 1;
var resize = 1;
var speed = 100;
var gameSize = 16;

window.onload = start;

function start() {
	getOrientation();
	createGameBox();
}

function startGame() {
	resize = 0;
	stop = 0;
	addPlayer();
	generateTerrain();
}

function getOrientation() {
	document.getElementById("orient").innerText = "Gama: null" + 
		"\nBeta: null";
	window.ondeviceorientation = function(){
		var beta = Math.round(event.beta); // [-180, 180]
		var gamma = Math.round(event.gamma); // [-90, 90]
		document.getElementById("orient").innerText = "Gama: " + gamma + 
		"\nBeta: " + beta ;
	}
	window.onresize = function() {
		if (resize){
			this.createGameBox();
		}
	}
}

function createGameBox() {

	var width = window.innerWidth / 16;
	var height = window.innerHeight / 16;
	gameSize = Math.ceil(Math.min(width, height));
	console.log(gameSize);

	var newBox = "";
	var margin = "";
	for(var i = 1; i <= gameSize; i ++){
		margin += "_";
	}
	newBox += "" + margin + "\n";

	var line = "|";
	for(var i = 1; i <= gameSize; i ++){
		line += " ";
	}
	line += "|\n";

	for(var i = 1; i < gameSize; i ++){
		newBox += line;
	}
	newBox += "|" + margin + "|";
	document.getElementById("gameBox").innerText = newBox;
	document.getElementById("gameBox").setAttribute("style", "line-height: 0.8em; letter-spacing: 0.1em; font-family: 'Courier New', Courier, monospace; font-size: 16px; white-space: pre;");
}

function insertCharAt(c,x,y) {
	var lines = document.getElementById("gameBox").innerText.split("\n");
	var newBox = "";
	for(var i = 0; i < lines.length; i++){

		if(i != x)
			newBox += lines[i];
		else {
			var left = lines[i].substr(0,y);
			var right = lines[i].substr(y+1);
			newBox += left + c + right;
		}

		if(i != lines.length - 1)
			newBox += "\n";
	}
	document.getElementById("gameBox").innerText = newBox;
}

function addPlayer() { 
	insertCharAt('>', Math.ceil(gameSize/2) ,1);
}

function stopGame() {
	stop = 1;
}

function generateTerrain() {
	if(stop == 1){	}
	else {
		generateTerrainBox();
		setTimeout(generateTerrain, speed); 
	}
}

function generateTerrainBox() {
	
		var lines = gameBox.innerText.split("\n");
		var newBox = "";
		for(var i = 0; i < lines.length; i++){

		if(i != Math.ceil(gameSize/2))
			newBox += lines[i];
		else {
			var left = lines[i].substr(0,2);
			var right = lines[i].substr(3, lines[i].length-4);
		if(Math.round(Math.random() * 10) == 1)
			newBox += left + right + "+|";
		else
			newBox += left + right + "_|";
		}

		if(i != lines.length - 1)
			newBox += "\n";
		}
		document.getElementById("gameBox").innerText = newBox;
		
}