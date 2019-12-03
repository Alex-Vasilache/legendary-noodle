var stop = 0;
var speed = 100;

function getOrientation() {
	window.ondeviceorientation = function(){
		var beta = Math.round(event.beta); // [-180, 180]
		var gamma = Math.round(event.gamma); // [-90, 90]
		document.getElementById("orient").innerText = "Gama: " + gamma + 
		"\nBeta: " + beta ;
	}
	window.onresize = createGameBox;
}

function createGameBox() {

	var width = window.innerWidth / 16;
	var height = window.innerHeight / 16;
	width = Math.ceil(Math.min(width, height));
	height = width;
	console.log("PX height x width: " + window.innerHeight + " x " + window.innerWidth );
	console.log("EM height x width: " + height + " x " + width);

	var newBox = "";
	var margin = "";
	for(var i = 1; i <= width; i ++){
		margin += "_";
	}
	newBox += "" + margin + "\n";

	var line = "|";
	for(var i = 1; i <= width; i ++){
		line += " ";
	}
	line += "|\n";

	for(var i = 1; i < height; i ++){
		newBox += line;
	}
	newBox += "|" + margin + "|";
	document.getElementById("gameBox").innerText = newBox;
	document.getElementById("gameBox").setAttribute("style", "line-height: 0.8em; letter-spacing: 0.1em; font-family: 'Courier New', Courier, monospace; font-size: 16px; white-space: pre;");
}

function insertCharAt(c,x,y) {
	var lines = gameBox.innerText.split("\n");
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
	insertCharAt('>',16,1);
}

function stopGame() {
	stop = 1;
}

function startGame() {
	stop = 0;
}

function generateTerrain() {
	
	var check = function(){
		if(stop == 1){	}
		else {
			generateTerrainBox();
			setTimeout(check, speed); 
		}
	}
	
	check();
}

function generateTerrainBox() {
	
		var lines = gameBox.innerText.split("\n");
		var newBox = "";
		for(var i = 0; i < lines.length; i++){

		if(i != 16)
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