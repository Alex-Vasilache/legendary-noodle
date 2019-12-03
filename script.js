var stop = 1;
var resize = 1;
var speed = 100;
var gameSize = 16;
var playerX;
var playerY;
var initialBeta = -200;
var initialGamma = -200;
var sensitivity = 1/2;
var position = 0;
var score = 0;


window.onload = start;

function start() {
	
	document.getElementById("restart").disabled = true;
	window.onresize = function() {
		if (resize){
			this.createGameBox();
		}
	}
	//document.getElementById("orient").innerText = "Gama: null" + "\nBeta: null";
	createGameBox();
	
	playerX = Math.ceil(gameSize/2);
	playerY = 1;
	movePlayerAt(Math.ceil(gameSize/2), 1);
	
	setUpOrientation();
	document.getElementById("slider").oninput = function () {
		sensitivity = this.value/100;
		document.getElementById("score").innerText= "Sensitivity: " + sensitivity;
	}
}

function startGame() {
	resize = 0;
	stop = 0;
	speed = 100;
	createGameBox();
	playerX = Math.ceil(gameSize/2);
	playerY = 1;
	movePlayerAt(Math.ceil(gameSize/2), 1);
	generateTerrain();
	document.getElementById("start").disabled = true;
	document.getElementById("slider").hidden = true;
	//document.getElementById("hint").hidden = true;
}

function setUpOrientation() {
	window.ondeviceorientation = function(){
		var beta = Math.round(event.beta); // [-180, 180]
		var gamma = Math.round(event.gamma); // [-90, 90]
		//document.getElementById("orient").innerText = "Gama: " + gamma + "\nBeta: " + beta ;
		//TODO if in landscape change to gamma
		if(initialBeta == -200){
			initialBeta = beta;
			initialGamma = gamma;
		}
		
		tilt(beta - initialBeta);
	}
}

function createGameBox() {

	var width = window.innerWidth / 16;
	var height = window.innerHeight / 16;
	gameSize = Math.ceil(Math.min(width, height));

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

function restart() {
	score = 0;
	position = 0;	
	document.getElementById("restart").disabled = true;
	createGameBox();
	startGame();
	
}

function generateTerrain() {
	if(stop == 1){	}
	else {
		document.getElementById("score").innerText= "Score: " + score;
		position ++;
		score = Math.floor(score + 1 + (100 - speed) * 1/50);
		if(speed > 40)
			speed -= 1/30;
		document.getElementById("hint").innerText = "Speed: " +  Math.floor(140 - speed);
		if(generateColumn())
			setTimeout(generateTerrain, speed);
		else {
			document.getElementById("restart").disabled = false;
			stop == 1;
		}
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

function generateColumn() {
	var lines = document.getElementById("gameBox").innerText.split("\n");
	var newBox = lines[0] + "\n";

	gap = Math.round(Math.random() * (gameSize - 3));
	
	for(var i = 1; i <= gameSize; i ++) {
		newBox += "|";

		//Move box one unit to the left
		if(i != playerX)
			newBox += lines[i].substr(2,gameSize-1);
		else {
			if(lines[i][2] == "|")
				return false;
			else
				newBox += ">" + lines[i].substr(3, gameSize-2);
		}

			

		if(position % 10 == 0) {
			if(i > gap  && i <= gap + 3)
				if(i == gameSize)
					newBox += "_|";
				else
					newBox += " |";
			else
				newBox += "||";
		} else {
			if(i == gameSize)
					newBox += "_|";
				else
					newBox += " |";
		}
		
		if(i != gameSize )
			newBox += "\n";
	}
	document.getElementById("gameBox").innerText = newBox;
	return true;
}