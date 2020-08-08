var canvasWidth = 800;
var canvasHeight = 500;

function setup() {
	angleMode(DEGREES);
	var testCanvas = createCanvas(canvasWidth,canvasHeight);
	testCanvas.parent('canvas1');
	noFill();
	noStroke();
	background(2, 130, 194); //pick a color
};

var keyIsPressed = false;
var keyIsReleased = false;

function keyPressed() {
	keyIsPressed = true;
}

function keyReleased() {
	keyIsPressed = false;
	keyIsReleased = true;
}

var rightPressed = false;
var leftPressed = false;
var upPressed = false;
var downPressed = false;

function draw() {
	background(255,255,255);
	//console.log(upPressed);
	/*if (keyIsPressed) {
		if (keyCode == RIGHT_ARROW) {
			rightPressed = true;
		}
		if (keyCode == LEFT_ARROW) {
			leftPressed = true;
		}
		if (keyCode == UP_ARROW) {
			upPressed = true;
		}
		if (keyCode == DOWN_ARROW) {
			downPressed = true;
		}
	}
	if (keyIsReleased) {
		if (keyCode == RIGHT_ARROW) {
			rightPressed = false;
		}
		if (keyCode == LEFT_ARROW) {
			leftPressed = false;
		}
		if (keyCode == UP_ARROW) {
			upPressed = false;
		}
		if (keyCode == DOWN_ARROW) {
			downPressed = false;
		}
	}*/
	if (keyIsDown(RIGHT_ARROW)) {
		rightPressed = true;
	} else {
		rightPressed = false;
	}
	if (keyIsDown(UP_ARROW)) {
		upPressed = true;
	} else {
		upPressed = false;
	}
	if (keyIsDown(LEFT_ARROW)) {
		leftPressed = true;
	} else {
		leftPressed = false;
	}
	if (keyIsDown(DOWN_ARROW)) {
		downPressed = true;
	} else {
		downPressed = false;
	}
	fill(0,0,0);
	textSize(25);
	if (rightPressed) {
		text("Pressing right",20,50);
	}
	if (leftPressed) {
		text("Pressing left",180,50);
	}
	if (upPressed) {
		text("Pressing up",270,50);
	}
	if (downPressed) {
		text("Pressing down",400,50);
	}
	keyIsReleased = false;
}