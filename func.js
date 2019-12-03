var geo = document.getElementById("geo");
var orientation = document.getElementById("orient");
var motion = document.getElementById("motion");
var point = document.getElementById("point");
var gameBox = document.getElementById("gameBox");
var stop = 0;
var speed = 100;

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    geo.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function showPosition(position) {
	geo.innerHTML = "Latitude: " + position.coords.latitude +
  "<br>Longitude: " + position.coords.longitude;
}

function getOrientation() {
	window.ondeviceorientation = function(){
		var beta = Math.round(event.beta); // [-180, 180]
		var gamma = Math.round(event.gamma); // [-90, 90]
		orientation.innerText = "Gama: " + gamma + 
		"\nBeta: " + beta ;
	}

	/*
	if (window.DeviceOrientationEvent) {
		window.addEventListener('deviceorientation', function(eventData) {
			// gamma is the left-to-right tilt in degrees
			orientation.innerHTML = "Gama: " + eventData.gamma + 
			"<br>Beta: " + eventData.beta + 
			"<br>Alpha: " + eventData.alpha;
			
			point.setAttribute("style", "position: absolute; top: " + 
			(eventData.beta * 0.27 + 50)+ "%; left: " +
			(eventData.alpha * 0.27 + 50)+ "%;");
			
			
		},false);
	}
	*/
	
}

function getMotion() {
	if (window.DeviceMotionEvent) {
		window.addEventListener('devicemotion', function(eventData) {   
			// Acceleration
			
			point.setAttribute("style", "position: absolute; top: " + 
			(eventData.acceleration.y * 10 + 50)+ "%; left: " +
			(eventData.acceleration.x * 10 + 50)+ "%;");
			/*

			motion.innerHTML = "acceleration.x: " + eventData.acceleration.x + 
			"<br>acceleration.y: " + eventData.acceleration.y + 
			"<br>acceleration.z: " + eventData.acceleration.z + 
		
			// Acceleration including gravity
			"<br>accelerationIncludingGravity.x: " + eventData.accelerationIncludingGravity.x + 
			"<br>accelerationIncludingGravity.y: " + eventData.accelerationIncludingGravity.y + 
			"<br>accelerationIncludingGravity.z: " + eventData.accelerationIncludingGravity.z + 
	
			// Rotation rate
			"<br>rotationRate.alpha: " + eventData.rotationRate.alpha + 
			"<br>rotationRate.beta: " + eventData.rotationRate.beta + 
			"<br>rotationRate.gamma: " + eventData.rotationRate.gamma;*/
		}, false);
	}
}

function createGameBox(x,y) {
	var newBox = "";
	var margin = "";
	for(var i = 1; i <= y; i ++){
		margin += "_";
	}
	newBox += " " + margin + "\n";

	var line = "|";
	for(var i = 1; i <= y; i ++){
		line += " ";
	}
	line += "|\n";

	for(var i = 1; i < x; i ++){
		newBox += line;
	}
	newBox += "|" + margin + "|";
	gameBox.innerText = newBox;
	gameBox.setAttribute("style", "line-height: 0.8em; letter-spacing: 0.1em; font-family: 'Courier New', Courier, monospace; white-space: pre;");
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
	gameBox.innerText = newBox;
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
		gameBox.innerText = newBox;
		
}