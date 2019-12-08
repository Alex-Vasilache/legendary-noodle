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
var canMove = 1;


window.onload = start;

function start() {
	
	window.onresize = function() {
		if (resize){
			this.createGameBox();
			movePlayerAt(Math.ceil(gameSize/2), 1);
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
	initialBeta = -200;
	createGameBox();
	playerX = Math.ceil(gameSize/2);
	playerY = 1;
	movePlayerAt(Math.ceil(gameSize/2), 1);
	generateTerrain();
	toggleDisableStatus();
	document.getElementById("slider").hidden = true;
	document.getElementById("start").setAttribute("onclick", "restart()");
	document.getElementById("hint").innerText = "";
}

function setUpOrientation() {
	window.ondeviceorientation = function(){
		if(canMove) {
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
}

function createGameBox() {

	var width = window.innerWidth / 25;
	var height = window.innerHeight / 30;
	var font = Math.ceil(Math.min(width, height));
	gameSize = 25;
	

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
	document.getElementById("gameBox").setAttribute("style", "line-height: 0.8em; letter-spacing: 0.1em; font-family: 'Courier New', Courier, monospace; font-size: " + font + "px; white-space: pre;");
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
	canMove = 1;
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
		document.getElementById("speed").innerText = "Speed: " +  Math.floor(140 - speed);
		if(generateColumn())
			setTimeout(generateTerrain, speed);
		else {
			toggleDisableStatus();
			stop == 1;
			canMove = 0;
			document.getElementById("hint").innerText= "Oh, nö! You lost!";
		}
	}
}

function toggleDisableStatus() {

	var startButton = document.getElementById("start");
	var disabled = startButton.disabled;
	startButton.disabled = !disabled;

	if(disabled){
		startButton.style.backgroundColor = "#4CAF50";
	} else {
		startButton.style.backgroundColor = "#dcefde";
	}

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