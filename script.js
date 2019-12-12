var stop = 1;
var resize = 1;
var speed = 100;
var gameSize = 25;
var playerX;
var playerY;
var initialBeta = -200;
var initialGamma = -200;
var sensitivity = 1/2;
var position = 0;
var score = 0;
var canMove = 1;
var obstacleGap = 10;
var columnGapSize = 6;


window.onload = setUpPage;

/**
 * Set up Page
 */
function setUpPage() {
	
	window.onresize = function() {
		if (resize){
			this.createGameBox();
			movePlayerAt(Math.ceil(gameSize/2), 1);
		}
	}

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

/**
 * Initialize variables, hide hint text and slider and start game
 */
function startGame() {
	resize = 0;
	stop = 0;
	speed = 100;
	initialBeta = -200;

	createGameBox();
	
	movePlayerAt(Math.ceil(gameSize/2), 1);
	generateTerrain();
	toggleDisableStatus();

	document.getElementById("slider").hidden = true;
	document.getElementById("start").setAttribute("onclick", "restart()");
	document.getElementById("hint").innerText = "";
}

/**
 * Starts a new game
 */
function restart() {
	
	score = 0;
	position = 0;
	canMove = 1;
	createGameBox();
	startGame();
	
}

/**
 * Set up the device oreientation detection
 */
function setUpOrientation() {

	window.ondeviceorientation = function(){
		if(canMove) {
			var beta = Math.round(event.beta); 
			var gamma = Math.round(event.gamma);
			
			//Recalibrate orientation sensor
			if(initialBeta == -200){
				initialBeta = beta;
				initialGamma = gamma;
			}
			
			tilt(beta - initialBeta);
		}
	}
}

/**
 * Create a game box and adjust font size according to window size
 */
function createGameBox() {

	var width = window.innerWidth / 25;
	var height = window.innerHeight / 30;
	var font = Math.ceil(Math.min(width, height));

	var newBox = "";
	var margin = "";

	for(var i = 1; i <= gameSize; i ++) {margin += "_";}

	newBox += "" + margin + "\n";

	var line = "|";

	for(var i = 1; i <= gameSize; i ++) {line += " ";}

	line += "|\n";

	for(var i = 1; i < gameSize; i ++) {newBox += line;}

	newBox += "|" + margin + "|";

	document.getElementById("gameBox").innerText = newBox;
	document.getElementById("gameBox").setAttribute("style", "line-height: 0.8em; letter-spacing: 0.1em; font-family: " +
	"'Courier New', Courier, monospace; font-size: " + font + "px; white-space: pre;");
}

/**
 * Inserts a character at a specified position inside the game box
 * @param {Character to be insrted} c 
 * @param {Position on the X axis where the character should be placed} x 
 * @param {Position on the X axis where the character should be placed} y 
 */
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

/**
 * Repositions player character at specified position
 * @param {New X position of player} x 
 * @param {New Y position of player} y 
 */
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

/**
 * Moves the player up or down inside the game box
 * @param {Specifies the amount by which the player moves on the vertical axis} amount 
 */
function tilt(amount) {

	amount = amount * sensitivity;
	movePlayerAt(Math.ceil(gameSize/2 + amount), playerY);

}

/**
 * Moves the game box content to the left by one unit and generates a new column.
 * In case of collision the game is stopped.
 */
function generateTerrain() {

	if(stop == 1){}
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

/**
 * Generates a new column for the game box, introducing a new obstacle at an interval specified by the variable obstacleGap.
 * Returns false if a collision was detected and true otherwise.
 */
function generateColumn() {
	var lines = document.getElementById("gameBox").innerText.split("\n");
	var newBox = lines[0] + "\n";

	columnGap = Math.round(Math.random() * (gameSize - columnGapSize));
	
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

		if(position % obstacleGap == 0) {
			if(i > columnGap  && i <= columnGap + columnGapSize)
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

/**
 * Toggles the enable status of the Start button
 */
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