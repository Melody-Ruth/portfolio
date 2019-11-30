var myRed;
var myOrange;
var myYellow;
var myGreen;
var myBlue;
var myPurple;
var myPink;
var myWhite;

var selectedColor;
var selectedCandy;

//gingerbread colors
var lightBrown;
var darkBrown;

function setup() {
	angleMode(DEGREES);
	createCanvas(400,400);
	noFill();
	noStroke();
	background(2, 130, 194); //pick a color
	
	myRed = color(240,36,36);
	myOrange = color(255, 132, 0);
	myYellow = color(255, 234, 0);
	myGreen = color(0, 163, 24);
	myBlue = color(36, 160, 255);
	myPurple = color(200, 82, 255);
	myPink = color(255, 143, 178);
	myWhite = color(250, 248, 240);

	selectedColor = myRed;
	selectedCandy = "gumdrop";

	//gingerbread colors
	lightBrown = color(171, 106, 44);
	darkBrown = color(135, 75, 19);
};

//colors for candy


//gumdrop arrays
var gumdropX = [];
var gumdropY = [];
var gumdropC = [];

//peppermint arrays
var peppermintX = [];
var peppermintY = [];
var peppermintC = [];

//candy cane arrays
var candycaneX = [];
var candycaneY = [];
var candycaneC = [];

//icing arrays
var icingX = [];
var icingY = [];
var icingX2 = [];
var icingY2 = [];
var icingC = [];

var colorMenuX = -100;
var colorMenuOut = false;
var candyMenuX = 400;
var candyMenuOut = false;

var drawGumDrop = function(x, y, color) {
    fill(color);
    arc(x, y, 40, 60, 180, 360);
    ellipse(x, y, 40, 20);
    fill(255, 255, 255, 50);
    ellipse(x - 5, y - 19, 15, 8);
};

var drawPeppermint = function(x, y, color) {
    fill(color);
    ellipse(x, y, 42, 42);
    fill(255, 255, 255);
    arc(x, y, 43, 43, 0, 22.5);
    arc(x, y, 43, 43, 45, 67.5);
    arc(x, y, 43, 43, 90, 112.5);
    arc(x, y, 43, 43, 135, 157.5);
    arc(x, y, 43, 43, 180, 202.5);
    arc(x, y, 43, 43, 225, 247.5);
    arc(x, y, 43, 43, 270, 292.5);
    arc(x, y, 43, 43, 315, 335.5);
};

var drawCandyCane = function(x, y, color) {
    stroke(255, 255, 255);
    strokeWeight(14);
    line(x, y, x, y + 72);
    noStroke();
    fill(color);
    quad(x - 7, y + 15, x + 7, y + 1, x + 7, y + 13, x - 7, y + 27);
    quad(x - 7, y + 39, x + 7, y + 25, x + 7, y + 37, x - 7, y + 51);
    quad(x - 7, y + 63, x + 7, y + 49, x + 7, y + 61, x - 7, y + 75);
};

function draw() {
    background(207, 245, 255);
    noStroke();
    
    //house
    // roof front
    fill(lightBrown);
    triangle(200, 28, 350, 150, 50, 150);
    // roof sides
    stroke(darkBrown);
    strokeWeight(20);
    line(200, 28, 350, 150);
    line(200, 28, 50, 150);
    noStroke();
    // front wall
    fill(lightBrown);
    rect(60, 150, 280, 207, 10);
    // front door
    fill(darkBrown);
    rect(159, 241, 78, 117, 10);
    // ground
    fill(255, 255, 255);
    rect(0, 355, width, 100);
    
    for (var i=0;i<icingX.length;i++) {
        stroke(icingC[i]);
        strokeWeight(12);
        line(icingX2[i], icingY2[i], icingX[i], icingY[i]);
        noStroke();
    }
    
    for (var i=0;i<candycaneX.length;i++) {
        drawCandyCane(candycaneX[i], candycaneY[i], candycaneC[i]);
    }
    
    for (var i=0;i<gumdropX.length;i++) {
        drawGumDrop(gumdropX[i], gumdropY[i], gumdropC[i]);
    }
    
    for (var i=0;i<peppermintX.length;i++) {
        drawPeppermint(peppermintX[i], peppermintY[i], peppermintC[i]);
    }
    
    //color menu
    fill(255, 255, 255, 200);
    rect(colorMenuX, 0, 100, 355);
    rect(colorMenuX + 100, 0, 50, 50);
    fill(myOrange);
    rect(colorMenuX + 104, 6, 30, 25);
    fill(myYellow);
    rect(colorMenuX + 119, 20, 25, 25);
    fill(myRed);
    ellipse(colorMenuX + 30, 25, 40, 40);
    fill(myOrange);
    ellipse(colorMenuX + 70, 65, 40, 40);
    fill(myYellow);
    ellipse(colorMenuX + 30, 105, 40, 40);
    fill(myGreen);
    ellipse(colorMenuX + 70, 145, 40, 40);
    fill(myBlue);
    ellipse(colorMenuX + 30, 185, 40, 40);
    fill(myPurple);
    ellipse(colorMenuX + 70, 225, 40, 40);
    fill(myPink);
    ellipse(colorMenuX + 30, 265, 40, 40);
    fill(myWhite);
    ellipse(colorMenuX + 70, 305, 40, 40);
    
    //candy type menu
    fill(255, 255, 255, 200);
    rect(candyMenuX, 0, 100, 355);
    rect(candyMenuX - 50, 0, 50, 50);
    drawGumDrop(candyMenuX - 24, 35, myPink);
    stroke(myRed);
    strokeWeight(12);
    noFill();
    arc(candyMenuX + 35, 25, 30, 15, 180, 360);
    arc(candyMenuX + 65, 24, 30, 15, 0, 180);
    noStroke();
    drawGumDrop(candyMenuX + 50, 100, myRed);
    drawPeppermint(candyMenuX + 50, 170, myRed);
    drawCandyCane(candyMenuX + 50, 220, myRed);
    
    if (mouseX < 50 && mouseY < 50) {
        colorMenuOut = true;
    }
    if (mouseX > 100) {
        colorMenuOut = false;
    }
    if (colorMenuOut && colorMenuX < 0) {
        colorMenuX ++;
    }
    if (!colorMenuOut && colorMenuX > -100) {
        colorMenuX --;
    }
    
    
    if (mouseX > 350 && mouseY < 50) {
        candyMenuOut = true;
    }
    if (mouseX < 300) {
        candyMenuOut = false;
    }
    if (candyMenuOut && candyMenuX > 300) {
        candyMenuX --;
    }
    if (!candyMenuOut && candyMenuX < 400) {
        candyMenuX ++;
    }
    
    if (mouseIsPressed && sqrt(sq(mouseX - colorMenuX - 30) + sq(mouseY - 25)) < 20) {
        selectedColor = myRed;
    } else if (mouseIsPressed && sqrt(sq(mouseX - colorMenuX - 70) + sq(mouseY - 65)) < 20) {
        selectedColor = myOrange;
    } else if (mouseIsPressed && sqrt(sq(mouseX - colorMenuX - 30) + sq(mouseY - 105)) < 20) {
        selectedColor = myYellow;
    } else if (mouseIsPressed && sqrt(sq(mouseX - colorMenuX - 70) + sq(mouseY - 145)) < 20) {
        selectedColor = myGreen;
    } else if (mouseIsPressed && sqrt(sq(mouseX - colorMenuX - 30) + sq(mouseY - 185)) < 20) {
        selectedColor = myBlue;
    } else if (mouseIsPressed && sqrt(sq(mouseX - colorMenuX - 70) + sq(mouseY - 225)) < 20) {
        selectedColor = myPurple;
    } else if (mouseIsPressed && sqrt(sq(mouseX - colorMenuX - 30) + sq(mouseY - 265)) < 20) {
        selectedColor = myPink;
    } else if (mouseIsPressed && sqrt(sq(mouseX - colorMenuX - 70) + sq(mouseY - 305)) < 20) {
        selectedColor = myWhite;
    } else if (mouseIsPressed && mouseX > candyMenuX && mouseY < 50) {
        selectedCandy = "icing";
    } else if (mouseIsPressed && mouseX > candyMenuX && mouseY < 125) {
        selectedCandy = "gumdrop";
    } else if (mouseIsPressed && mouseX > candyMenuX && mouseY < 215) {
        selectedCandy = "peppermint";
    } else if (mouseIsPressed && mouseX > candyMenuX && mouseY < 295) {
        selectedCandy = "candycane";
    } else if (mouseIsPressed && selectedCandy === "icing") {
        icingX.push(pmouseX);
        icingY.push(pmouseY);
        icingX2.push(mouseX);
        icingY2.push(mouseY);
        icingC.push(selectedColor);
    } else if (mouseIsPressed && selectedCandy === "gumdrop") {
        gumdropX.push(mouseX);
        gumdropY.push(mouseY);
        gumdropC.push(selectedColor);
    } else if (mouseIsPressed && selectedCandy === "peppermint") {
        peppermintX.push(mouseX);
        peppermintY.push(mouseY);
        peppermintC.push(selectedColor);
    } else if (mouseIsPressed && selectedCandy === "candycane") {
        candycaneX.push(mouseX);
        candycaneY.push(mouseY);
        candycaneC.push(selectedColor);
    }
    
    if (selectedCandy === "gumdrop") {
        drawGumDrop(mouseX, mouseY, selectedColor);
    }
    if (selectedCandy === "peppermint") {
        drawPeppermint(mouseX, mouseY, selectedColor);
    } 
    if (selectedCandy === "candycane") {
        drawCandyCane(mouseX, mouseY, selectedColor);
    }
};

