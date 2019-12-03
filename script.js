var stop = 1;
var resize = 1;
var speed = 100;
var gameSize = 16;
var playerX;
var playerY;
var initialBeta = -200;
var sensitivity = 1/4;
var score = 0;


window.onload = start;

function start() {
	
	window.onresize = function() {
		if (resize){
			this.createGameBox();
		}
	}
	document.getElementById("orient").innerText = "Gama: null" + 
		"\nBeta: null";
	
	createGameBox();
}

function startGame() {
	resize = 0;
	stop = 0;
	playerX = Math.ceil(gameSize/2);
	playerY = 1;
	movePlayerAt(Math.ceil(gameSize/2), 1);
	generateTerrain();
	setUpOrientation();
	
	sensitivity = document.getElementById("input").value;
	document.getElementById("sens").innerText = "Sensitivity: " + sensitivity;
}

function setUpOrientation() {
	window.ondeviceorientation = function(){
		var beta = Math.round(event.beta); // [-180, 180]
		var gamma = Math.round(event.gamma); // [-90, 90]
		document.getElementById("orient").innerText = "Gama: " + gamma + 
		"\nBeta: " + beta ;
		if(initialBeta == -200)
			initialBeta = beta;
		tilt(beta - initialBeta);
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

function movePlayerAt(x,y) {

	if(playerX == gameSize)
		insertCharAt('_', playerX, playerY);
	else
		insertCharAt(' ', playerX, playerY);
	if(x > gameSize)
		x = gameSize;
	if(x < 1)
		x = 1;
	playerX = x;
	playerY = y;
	insertCharAt('>', playerX, playerY);
}

function tilt(amount) {

	amount = amount * sensitivity;
	movePlayerAt(Math.ceil(gameSize/2 + amount), playerY);

}

function stopGame() {
	stop = 1;
}

function generateTerrain() {
	if(stop == 1){	}
	else {
		document.getElementById("score").innerText= "Score: " + score;
		score ++;
		generateObstacleColumn();
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

function generateObstacleColumn() {

	var lines = gameBox.innerText.split("\n");
	var newBox = "";

	gap = Math.round(Math.random() * (gameSize - 3));

	
	newBox += lines[0] + "\n";

	if(score%10 == 0) {

		for(var i = 1; i < lines.length ; i++) {
			var left = lines[i].substr(0,2);
			var right = lines[i].substr(3, lines[i].length-4);

			if(i > gap  && i <= gap + 3)
				if(i == gameSize)
					newBox += left + right + "_|";
				else
					newBox += left + right + " |";
			else
				newBox += left + right + "||";

			if(i != lines.length - 1)
				newBox += "\n";
		}
	} else {

		for(var i = 1; i < lines.length ; i++) {
			var left = lines[i].substr(0,2);
			var right = lines[i].substr(3, lines[i].length-4);

			if(i == gameSize)
				newBox += left + right + "_|";
			else
				newBox += left + right + " |";

			if(i != lines.length - 1)
				newBox += "\n";
		}
	}

	document.getElementById("gameBox").innerText = newBox;
}