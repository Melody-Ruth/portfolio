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
		code_to_create_functions += processingmember+'=function(){return p.'+processingmember+'.apply(p,arguments);},';
	}
	code_to_create_functions += 'easierthanremovingcomma;';
	eval(code_to_create_functions);
	var code_to_create_functions = 'var ';
	for (var mathmember in Math) {
		if (typeof(Math[mathmember]) !== 'function' ||
			mathmember[0] == '_' ||
			eval("typeof("+mathmember+") !== 'undefined'")) {
			continue;
		}
		code_to_create_functions += mathmember+'=function(){return Math.'+mathmember+'.apply(Math,arguments);},';
	}
	code_to_create_functions += 'easierthanremovingcomma;';
	eval(code_to_create_functions);
	//Also remember to add mouseX = p.mouseX; mouseY = p.mouseY; to the draw function and do p.key instead of key.toString
	//Additional custom functions
	var CLOSE = p.CLOSE;//For beginShape/endShape
	var arc = function(x,y,w,h,start,stop) {
		p.arc(x,y,w,h,start*Math.PI/180,stop*Math.PI/180);
	};
	var rotate = function(degrees) {
		p.rotate(degrees*Math.PI/180);
	};
	var random = function(low,high){
		return Math.random()*(high-low)+low;
	};
	var sin = function(degrees) {
		return Math.sin(degrees*Math.PI/180);
	};
	var cos = function(degrees) {
		return Math.cos(degrees*Math.PI/180);
	};
	var CENTER = p.CENTER;
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
	var mouseButton = p.mouseButton;
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
	var state = "menu";

	noStroke();
	var onAButton = false;
	var newButton = function(x, y, w, h, words) {
	    var button = {};
	    button.x = x;
	    button.y = y;
	    button.w = w;
	    button.h = h;
	    button.words = words;
	    button.hover = false;
	    button.pressed = false;
	    button.drawIt = function() {
	        stroke(255, 255, 255, 200);
	        strokeWeight(this.h/10);
	        if (this.hover) {
	            fill(255, 255, 255, 75);
	        } else {
	            noFill();
	        }
	        rect(this.x, this.y, this.w, this.h, 10);
	        noStroke();
	        fill(255, 255, 255, 200);
	        textSize(this.h/2);
	        text(this.words, this.x+3/14*w, this.y+55/80*h);
	    };
	    button.update = function() {
	        this.pressed = false;
	        this.hover = false;
	        if (mouseX > this.x && mouseX < this.x + this.w && mouseY > this.y && mouseY < this.y + this.h) {
	            this.hover = true;
	            onAButton = true;
	            if (mouseIsPressed) {
	                this.pressed = true;
	            }
	        }
	    };
	    return button;
	};

	var play = newButton(130, 120, 140, 80, "Play");
	var how = newButton(130, 250, 140, 80, "How");
	var backHow = newButton(20, 320, 110, 60, "Back");

	var drawMushroom = function(x, y, s) {
	    fill(135, 255, 161);
	    rect(x, y, 15*s, 25*s, 5);
	    arc(x+7.5*s, y + 5*s, 30*s, 30*s, 180, 360);
	};

	var drawMenu = function() {
	    background(51, 22, 7);
	    //water
	    fill(15, 92, 140);
	    rect(0, 280, 400, 145);
	    ellipse(200, 290, 670, 100);
	    //stalactites and stalagmites
	    fill(56, 30, 17);
	    triangle(-18, 0, 30, 0, 6, 50);
	    fill(74, 39, 21);
	    triangle(15, 0, 30, 0, 6, 50);
	    
	    fill(66, 33, 17);
	    triangle(25, 0, 60, 0, 40, 70);
	    fill(79, 39, 18);
	    triangle(52, 0, 60, 0, 40, 70);
	    
	    fill(87, 47, 27);
	    triangle(95, 0, 135, 0, 115, 100);
	    fill(107, 59, 34);
	    triangle(123, 0, 135, 0, 115, 100);
	    
	    fill(71, 40, 24);
	    triangle(50, 0, 100, 0, 75, 120);
	    fill(99, 56, 35);
	    triangle(86, 0, 100, 0, 75, 120);
	    
	    fill(82, 39, 17);
	    triangle(120, 0, 180, 0, 150, 60);
	    fill(107, 51, 23);
	    triangle(164, 0, 180, 0, 150, 60);
	    
	    fill(112, 55, 26);
	    triangle(325, 0, 375, 0, 350, 90);
	    fill(99, 51, 27);
	    triangle(300, 0, 330, 0, 315, 70);
	    fill(105, 58, 34);
	    triangle(370, 0, 410, 0, 390, 130);
	    
	    fill(82, 35, 12);
	    ellipse(336, 251, 102, 41);
	    ellipse(346, 264, 73, 37);
	    fill(112, 42, 14);
	    ellipse(335, 245, 40, 30);
	    triangle(315, 245, 355, 245, 335, 123);
	    fill(115, 59, 31);
	    ellipse(361, 258, 60, 40);
	    triangle(331, 258, 391, 258, 361, 176);
	    
	    fill(87, 47, 27);
	    triangle(-10, 430, 40, 430, 15, 320);
	    fill(112, 61, 36);
	    triangle(22, 430, 40, 430, 15, 320);
	    
	    fill(94, 54, 35);
	    triangle(35, 430, 95, 430, 65, 361);
	    fill(133, 76, 49);
	    triangle(77, 430, 95, 430, 65, 361);
	    
	    drawMushroom(326, 240, 1);
	    drawMushroom(346, 259, 0.7);
	    
	    play.update();
	    how.update();
	    play.drawIt();
	    how.drawIt();
	    
	    if (how.pressed) {
	        state = "how";
	    }
	};

	var drawClump = function(x, y) {
	    fill(82, 35, 12);
	    ellipse(336+x, 251+y, 102, 41);
	    ellipse(346+x, 264+y, 73, 37);
	    fill(112, 42, 14);
	    ellipse(335+x, 245+y, 40, 30);
	    triangle(315+x, 245+y, 355+x, 245+y, 335+x, 123+y);
	    fill(115, 59, 31);
	    ellipse(361+x, 258+y, 60, 40);
	    triangle(331+x, 258+y, 391+x, 258+y, 361+x, 176+y);
	    drawMushroom(326+x, 240+y, 1);
	    drawMushroom(346+x, 259+y, 0.7);
	};

	var drawHow = function() {
	    background(51, 22, 7);
	    fill(15, 92, 140);
	    rect(0, 352, 400, 145);
	    drawClump(0, 109);
	    fill(135, 255, 161);
	    textSize(28);
	    text("Move with the arrow keys. Try to escape before you get trapped in the caves and drown. Find crystals for extra points. If you touch water, your torch will be extinguished.", 31, 32, 300, 300);
	    
	    backHow.drawIt();
	    backHow.update();
	    
	    if (backHow.pressed) {
	        state = "menu";
	    }
	};
	
	p.draw = function() {
		keyCode = p.keyCode;
		mouseButton = p.mouseButton;
		pmouseX = p.pmouseX;
		pmouseY = p.pmouseY;
		mouseX = p.mouseX;
		mouseY = p.mouseY;
		
		//Put code here
		if (state === "menu") {
	        drawMenu();
	    }
	    if (state === "how") {
	        drawHow();
	    }
		if (onAButton) {
			cursor(HAND);
		} else {
			cursor(ARROW);
		}
	    
		onAButton = false;
		keyIsReleased = false;
		mouseIsClicked = false;
	};  

	
}
