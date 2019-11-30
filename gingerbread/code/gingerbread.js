function sketchProc(p) {
	
	// Khan Academy allows use of processing functions
	// (e.g. "ellipse(...)") without prepending "p.".
	// We do the same by creating local variables that
	// call the "p." versions.
	var code_to_create_functions = 'var ';
	for (var processingmember in p) {
		if (typeof(p[processingmember]) !== 'function' ||
			processingmember[0] == '_' ||
			eval("typeof("+processingmember+") !== 'undefined'")) {
			continue;
		}
		code_to_create_functions += processingmember+'=function(){p.'+processingmember+'.apply(p,arguments);},';
	}
	code_to_create_functions += 'easierthanremovingcomma;';
	eval(code_to_create_functions);
	//Also remember to add mouseX = p.mouseX; mouseY = p.mouseY; to the draw function and do p.key instead of key.toString
	//Additional custom functions
	var CLOSE = p.CLOSE;//For beginShape/endShape
	var arc = function(x,y,w,h,start,stop) {
		p.arc(x,y,w,h,start*Math.PI/180,stop*Math.PI/180);
	};
	var color = function(r,g,b) {
		return p.color(r,g,b);
	};
	var pushMatrix = function() {
		p.pushMatrix();
	};
	var popMatrix = function() {
		p.popMatrix();
	};
	var rotate = function(degrees) {
		p.rotate(degrees*Math.PI/180);
	};
	var translate = function(xShift,yShift) {
		p.translate(xShift,yShift);
	};
	var random = function(low,high){
		return Math.random()*(high-low)+low;
	};
	var floor = function(number){
		return Math.floor(number);
	};
	var ceil = function(number){
		return Math.ceil(number);
	};
	var sq = function(number){
		return p.sq(number);
	};
	var sqrt = function(number){
		return p.sqrt(number);
	};
	var round = function(value) {
		return Math.round(value);
	};
	var sin = function(degrees) {
		return Math.sin(degrees*Math.PI/180);
	};
	var cos = function(degrees) {
		return Math.cos(degrees*Math.PI/180);
	};
	var createFont = function(font, size) {
		return p.createFont(font,size);
	};
	var textFont = function(font,size) {
		p.textFont(font,size);
	};
	var CENTER = p.CENTER;
	var button = function(x, y, w, h, color) {
	    var Button = {//defines a new object: Button
	    };
	    Button.pressed = false;
	    Button.x = x;
	    Button.y = y;
	    Button.w = w;
	    Button.h = h;
	    Button.color = color;
	    Button.mousedOver = false;
	    Button.drawIt = function() {
	        if (!this.color) {
	            fill(139, 135, 255);
	            stroke(68, 0, 255);
	            strokeWeight(5);
	            rect(this.x, this.y, this.w, this.h, 20);
	            noStroke();
	        } else {
	            fill(this.color);
	            rect(this.x, this.y, this.w, this.h, 10);
	        }
	    };
	    Button.checkIfPressed = function() {
	        if (mouseIsClicked && mouseX > this.x && mouseX < this.x + this.w && mouseY > this.y && mouseY < this.y + this.h) {
	            this.pressed = true;
	            this.mousedOver = true;
	        } else if (mouseX > this.x && mouseX < this.x + this.w && mouseY > this.y && mouseY < this.y + this.h) {
	            this.mousedOver = true;
	            this.pressed = false;
	        } else {
	        	this.mousedOver = false;
	            this.pressed = false;
	        }
	    };
	    return Button;
	};
	var HAND = p.HAND;
	var ARROW = p.ARROW;
	var mouseIsClicked = false;
	p.mouseReleased = function() {
		mouseIsClicked = true;
		mouseIsPressed = false;
	};
	var mouseIsPressed = false;
	p.mousePressed= function() {
		mouseIsPressed = true;
	};
	var keyIsReleased = false;
	p.keyReleased = function() {//When a key is released, make keyIsReleased true
	    keyIsReleased = true;
	    keyIsPressed = false;
	};
	var keyIsPressed = false;
	p.keyPressed = function(){
		keyIsPressed = true;
	};
	var keyCode = p.keyCode;
	var UP = p.UP;
	var DOWN = p.DOWN;
	var RIGHT = p.RIGHT;
	var LEFT = p.LEFT;
	//Interaction Guide:
	/*p.mouseReleased is called right after the mouse is released
	 * p.mousePressed is called right after the mouse button is pushed down
	 * Similarly,
	 * p.keyReleased is called right after a key is released
	 * p.keyPressed is called right after a key is pushed down
	 * 
	 * My Variables:
	 * mouseIsClicked is true right after the mouse is released and false otherwise
	 * mouseIsPressed is true the entire the mouse button is down
	 * keyIsReleased is true right after a key is released and false otherwise
	 * keyIsPressed is true the entire a key is down
	 * 
	 * Use p.key for letter keys and keyCode for arrow keys. When using p.key, compare it to the ascii code number of the key in question.
	 * Make sure you use == instead of === in that case.
	 */
	
	
	var width = p.width;//canvas width
	var height = p.height;//canvas height
	p.setup = function() {
		size(400, 400);//size of the canvas
		width = 400;
		height = 400;
		noFill();
		noStroke();
		background(2, 130, 194); //pick a color
	};
	

	//Definitions here
	//colors for candy
	var myRed = color(240, 36, 36);
	var myOrange = color(255, 132, 0);
	var myYellow = color(255, 234, 0);
	var myGreen = color(0, 163, 24);
	var myBlue = color(36, 160, 255);
	var myPurple = color(200, 82, 255);
	var myPink = color(255, 143, 178);
	var myWhite = color(250, 248, 240);

	var selectedColor = myRed;
	var selectedCandy = "gumdrop";

	//gingerbread colors
	var lightBrown = color(171, 106, 44);
	var darkBrown = color(135, 75, 19);

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

	
	p.draw = function() {
		keyCode = p.keyCode;
		mouseX = p.mouseX;
		mouseY = p.mouseY;
		
		//Put code here
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
		
		keyIsReleased = false;
		mouseIsClicked = false;
	};  

	
}
