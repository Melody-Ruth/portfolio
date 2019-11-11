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
	var scene = 0;
	var timer = 0;
	//0 = menu, 1 = stopped, 2 = lightspeed, 3 = planet 1, 4 = projection, 5 = lightspeed, 6 = planet 2
	var stopped = floor(random(0,2));// 0 = darth vadar, 1 = kylo ren
	var transmission = floor(random(0,1));//0=yoda
	var planet1 = floor(random(0,3));//0=Tatooine,1=Kashyyyk,2=Jakku
	var planet2 = floor(random(0,2));//0=Naboo,1=Death Star

	var myCompare = function(a,b) {
	    return a[0]-b[0];
	};
	
	var eyeX = 200;
	var eyeY = 200;
	var eyeZ = 0;
	var zw = 240;
	noStroke();

	var stars = [];
	var rocks = [];
	var seaweed = [];
	var trees = [];
	var fish1 = [];
	var fish2 = [];
	var boxes = [];
	var opponent = {};
	var deathStar = {};
	var falcon = {};
	var numStars = 175;
	var s0vadar;
	var s1vadar;
	var xMove = 0;
	var yMove = 0;
	var zMove = 0;
	var theta = 0;
	var thetaMove = 0;

	var xyz2xy = function(x, y, z) {
	    return [(zw-eyeZ)*(x-eyeX)/(2*(z-eyeZ)) + eyeX, 400 - ((zw-eyeZ)*(y-eyeY)/(2*(z-eyeZ)) + eyeY)];
	};

	var w2w = function(w, z) {
	    return w * (zw-eyeZ)/(z-eyeZ);
	};

	var drawEarth = function(x, y, s) {
	    fill(186, 153, 112);
	    pushMatrix();
	    translate(x-79*s,y+16*s);
	    quad(50 * s, 0, 70 * s, -100 * s, 110 * s, -100 * s, 170 * s, 0);
	    fill(120, 84, 40);
	    quad(0, 0, 30 * s, -80 * s, 100 * s, -70 * s, 170 * s, 0);
	    fill(102, 76, 45);
	    quad(0, -5* s, 170* s, 0, 116 * s, 30 * s, 35 * s, 30 * s);
	    fill(222, 199, 169);
	    quad(35 * s, 30 * s, 50 * s, -30 * s, 91 * s, -30 * s, 116 * s, 30 * s);
	    popMatrix();
	};

	var drawEarth2 = function(x, y, s, theta) {
	    fill(110, 66, 12);
	    pushMatrix();
	    translate(x-79*s,y+16*s);
	    rotate(theta);
	    quad(50 * s, 0, 70 * s, -100 * s, 110 * s, -100 * s, 170 * s, 0);
	    fill(71, 42, 6);
	    quad(0, 0, 30 * s, -80 * s, 100 * s, -70 * s, 170 * s, 0);
	    fill(38, 22, 3);
	    quad(0, -5* s, 170* s, 0, 116 * s, 30 * s, 35 * s, 30 * s);
	    fill(133, 73, 0);
	    quad(35 * s, 30 * s, 50 * s, -30 * s, 91 * s, -30 * s, 116 * s, 30 * s);
	    popMatrix();
	    stroke(255, 0, 0);
	    strokeWeight(5);
	    //point(x,y);
	    noStroke();
	};

	var drawEarth3 = function(x, y, s) {
	    fill(173, 137, 113);
	    pushMatrix();
	    translate(x-79*s,y+16*s);
	    quad(50 * s, 0, 70 * s, -100 * s, 110 * s, -100 * s, 170 * s, 0);
	    fill(135, 107, 88);
	    quad(0, 0, 30 * s, -80 * s, 100 * s, -70 * s, 170 * s, 0);
	    fill(97, 71, 54);
	    quad(0, -5* s, 170* s, 0, 116 * s, 30 * s, 35 * s, 30 * s);
	    fill(207, 172, 149);
	    quad(35 * s, 30 * s, 50 * s, -30 * s, 91 * s, -30 * s, 116 * s, 30 * s);
	    popMatrix();
	    stroke(255, 0, 0);
	    strokeWeight(5);
	    //point(x,y);
	    noStroke();
	};

	var drawVadar = function(x,y,s) {
	    noStroke();
	    pushMatrix();
	    translate(x, y);
	    fill(0, 0, 0);
	    arc(0,198*s,220*s,430*s,181,360);
	    fill(20, 20, 20);
	    rect(-40*s,0,80*s,100*s,10*s);//body
	    rect(-40*s,88*s,35*s,110*s,10*s);//right leg
	    rect(5*s,88*s,35*s,110*s,10*s);//left leg
	    quad(-35*s,0,35*s,0,20*s,-15*s,-20*s,-15*s);//shoulders
	    //key pad
	    fill(0, 0, 0);
	    rect(-15*s,25*s,30*s,30*s);
	    fill(255, 0, 0);
	    rect(7*s,29*s,5*s,10*s);
	    fill(0, 34, 255);
	    rect(-8*s,29*s,8*s,5*s);
	    fill(110, 110, 110);
	    rect(-8*s,42*s,8*s,5*s);
	    //belt
	    fill(0, 0, 0);
	    rect(-40*s,70*s,80*s,20*s);
	    //head
	    fill(20, 20, 20);
	    quad(20*s,-15*s,-20*s,-15*s, -30*s,-30*s,30*s,-30*s);
	    arc(0,-30*s,60*s,82*s,180,360);
	    fill(31, 31, 31);
	    rect(-52*s,-6*s,30*s,110*s,10*s);//right arm
	    rect(22*s,-6*s,30*s,110*s,10*s);//left arm
	    //stripes
	    stroke(161, 161, 161);
	    strokeWeight(5*s);
	    line(0,-8*s,0,18*s);
	    line(10*s,-6*s,10*s,13*s);
	    line(-10*s,-6*s,-10*s,13*s);
	    line(18*s,-4*s,18*s,10*s);
	    line(-18*s,-4*s,-18*s,10*s);
	    noStroke();
	    fill(255, 0, 0);
	    //ellipse(40,0,10,10);
	    popMatrix();
	};

	var drawKyloRen = function(x,y,s) {
	    noStroke();
	    pushMatrix();
	    translate(x, y);
	    fill(0, 0, 0);
	    arc(0,198*s,160*s,430*s,181,360);
	    fill(20, 20, 20);
	    rect(-40*s,0,80*s,100*s,10*s);//body
	    rect(-40*s,88*s,35*s,110*s,10*s);//right leg
	    rect(5*s,88*s,35*s,110*s,10*s);//left leg
	    //belt
	    fill(0, 0, 0);
	    rect(-40*s,70*s,80*s,20*s);
	    
	    fill(31, 31, 31);
	    rect(-52*s,-6*s,30*s,110*s,10*s);//right arm
	    rect(22*s,-6*s,30*s,110*s,10*s);//left arm
	    
	    fill(36, 36, 36);
	    //quad(-35*s,0,35*s,0,20*s,-15*s,-20*s,-15*s);//shoulder
	    ellipse(0,-4*s,70*s,30*s);
	    //head
	    fill(20, 20, 20);
	    quad(20*s,-15*s,-20*s,-15*s, -30*s,-30*s,30*s,-30*s);
	    arc(0,-30*s,60*s,82*s,180,360);
	    //stripes
	    stroke(145, 145, 145);
	    strokeWeight(3*s);
	    noFill();
	    rect(-18*s,-55*s,36*s,20*s,5*s);
	    rect(-13*s,-51*s,26*s,12*s,5*s);
	    noStroke();
	    fill(0, 0, 0);
	    //fill(255, 0, 0);
	    quad(-6*s,-42*s,6*s,-42*s,9*s,-27*s,-9*s,-27*s);
	    rect(-9*s,-27*s,18*s,5*s);
	    //light saber
	    fill(255,0,0,100);
	    rect(-44*s,98*s,12*s,110*s,5*s);
	    rect(-58*s,99*s,45*s,12*s,5*s);
	    popMatrix();
	};

	var drawYoda = function(x,y,s) {
	    pushMatrix();
	    translate(x,y);
	    fill(81, 109, 143);
	    rect(-20*s,-20*s,40*s,70*s);
	    ellipse(0,-20*s,40*s,10*s);
	    fill(73, 93, 115);
	    rect(-20*s,10*s,40*s,8*s);
	    fill(102, 132, 166);
	    quad(-20*s,-22*s,-10*s,-24*s,-10*s,55*s,-32*s,55*s);
	    quad(20*s,-22*s,10*s,-24*s,10*s,55*s,32*s,55*s);
	    stroke(198, 209, 209);
	    strokeWeight(10);
	    line(27*s,6*s,27*s,54*s);
	    noStroke();
	    fill(147, 201, 174);
	    ellipse(-6*s,2*s,10*s,10*s);
	    ellipse(28*s,6*s,10*s,10*s);
	    fill(116, 146, 181);
	    pushMatrix();
	    rotate(-58);
	    rect(-21*s,-31*s,30*s,13*s,6*s);
	    popMatrix();
	    pushMatrix();
	    rotate(10);
	    rect(9*s,-26*s,25*s,13*s,6*s);
	    popMatrix();
	    quad(-20*s,-3*s,-7*s,-3*s,-9*s,15*s,-30*s,6*s);
	    quad(28*s,-9*s,37*s,-18*s,40*s,10*s,23*s,3*s);
	    fill(147, 201, 174);
	    ellipse(0,-35*s,28*s,30*s);
	    pushMatrix();
	    rotate(-18);
	    arc(29*s,-34*s,15*s,10*s,0,180);
	    popMatrix();
	    pushMatrix();
	    rotate(18);
	    arc(-29*s,-34*s,15*s,10*s,0,180);
	    popMatrix();
	    popMatrix();
	    stroke(255, 0, 0);
	    strokeWeight(5);
	    //point(x,y);
	    noStroke();
	};

	var drawSeaWeed = function(x,y,s) {//x and y at the bottom
	    pushMatrix();
	    translate(x+2*s,y-46*s);
	    stroke(81, 148, 13);
	    noFill();
	    strokeWeight(5*s);
	    arc(0,0,20*s,40*s,123,253);
	    arc(-3*s,-39*s,20*s,40*s,-44,83);
	    arc(-12*s,36*s,20*s,50*s,-44,19);
	    noStroke();
	    popMatrix();
	    stroke(255, 0, 0);
	    strokeWeight(5);
	    //point(x,y);
	    noStroke();
	};

	var drawFish1 = function(x,y,s,fishColor) {
	    pushMatrix();
	    translate(x,y);
	    fill(fishColor);
	    ellipse(0,0,50*s,20*s);
	    triangle(20*s,0,45*s,-6*s,45*s,6*s);
	    stroke(255, 255, 255);
	    strokeWeight(6.5*s);
	    point(-12*s,-4*s);
	    strokeWeight(5*s);
	    stroke(0, 0, 0);
	    point(-12*s,-4*s);
	    noStroke();
	    popMatrix();
	};//x and y in the middle of body

	var drawFish12 = function(x,y,s,fishColor) {
	    pushMatrix();
	    translate(x,y);
	    fill(fishColor);
	    ellipse(0,0,50*s,20*s);
	    triangle(-20*s,0,-45*s,-6*s,-45*s,6*s);
	    stroke(255, 255, 255);
	    strokeWeight(6.5*s);
	    point(12*s,-4*s);
	    strokeWeight(5*s);
	    stroke(0, 0, 0);
	    point(12*s,-4*s);
	    noStroke();
	    popMatrix();
	};//x and y in the middle of body

	var drawFish2 = function(x,y,s) {//x and y at middle of upper jaw
	    pushMatrix();
	    translate(x,y);
	    pushMatrix();
	    fill(166, 74, 8);
	    rotate(-74);
	    arc(0,0,50*s,70*s,-180,0);
	    noFill();
	    stroke(166, 74, 8);
	    strokeWeight(5*s);
	    arc(32*s,4*s,40*s,45*s,-133,35);
	    noStroke();
	    fill(166, 74, 8);
	    popMatrix();
	    pushMatrix();
	    rotate(-6);
	    arc(4*s,14*s,40*s,25*s,0,180);
	    popMatrix();
	    quad(-20*s,-20*s,-32*s,5*s,-47*s,-11*s,-44*s,-19*s);
	    fill(199, 255, 254,100);
	    quad(-47*s,-11*s,-44*s,-19*s,-52*s,-32*s,-60*s,-7*s);
	    stroke(255, 255, 255);
	    strokeWeight(9*s);
	    point(-7*s,-17*s);
	    strokeWeight(7*s);
	    stroke(0, 0, 0);
	    point(-7*s,-17*s);
	    noStroke();
	    fill(255, 255, 255);
	    triangle(1*s,14*s,5*s,13.5*s,2*s,3*s);
	    triangle(9*s,13*s,15*s,12.4*s,11*s,-1*s);
	    triangle(16*s,12*s,25*s,11.1*s,19*s,-1*s);
	    triangle(7*s,-24*s,10*s,-13*s,5*s,-18*s);
	    triangle(4*s,-15*s,7*s,-9*s,3*s,-10*s);
	    triangle(2*s,-7*s,5*s,-3*s,0*s,-1*s);
	    fill(255, 220, 94,100);
	    ellipse(30*s,-41*s,20*s,20*s);
	    ellipse(30*s,-41*s,12*s,12*s);
	    ellipse(30*s,-41*s,6*s,6*s);
	    popMatrix();
	};

	var drawFish22 = function(x,y,s) {//x and y at middle of upper jaw
	    pushMatrix();
	    translate(x,y);
	    pushMatrix();
	    fill(166, 74, 8);
	    rotate(74);
	    arc(0,0,50*s,70*s,-180,0);
	    noFill();
	    stroke(166, 74, 8);
	    strokeWeight(5*s);
	    arc(-32*s,4*s,40*s,45*s,146,303);
	    noStroke();
	    fill(166, 74, 8);
	    popMatrix();
	    pushMatrix();
	    rotate(6);
	    arc(-4*s,14*s,40*s,25*s,0,180);
	    popMatrix();
	    quad(20*s,-20*s,32*s,5*s,47*s,-11*s,44*s,-19*s);
	    fill(199, 255, 254,100);
	    quad(47*s,-11*s,44*s,-19*s,52*s,-32*s,60*s,-7*s);
	    stroke(255, 255, 255);
	    strokeWeight(9*s);
	    point(7*s,-17*s);
	    strokeWeight(7*s);
	    stroke(0, 0, 0);
	    point(7*s,-17*s);
	    noStroke();
	    fill(255, 255, 255);
	    triangle(-1*s,14*s,-5*s,13.5*s,-2*s,3*s);
	    triangle(-9*s,13*s,-15*s,12.4*s,-11*s,-1*s);
	    triangle(-16*s,12*s,-25*s,11.1*s,-19*s,-1*s);
	    triangle(-7*s,-24*s,-10*s,-13*s,-5*s,-18*s);
	    triangle(-4*s,-15*s,-7*s,-9*s,-3*s,-10*s);
	    triangle(-2*s,-7*s,-5*s,-3*s,0*s,-1*s);
	    fill(255, 220, 94,100);
	    ellipse(-30*s,-41*s,20*s,20*s);
	    ellipse(-30*s,-41*s,12*s,12*s);
	    ellipse(-30*s,-41*s,6*s,6*s);
	    popMatrix();
	};

	var drawTree = function(x,y,s) {
	    pushMatrix();
	    translate(x,y);
	    fill(36, 122, 17);
	    ellipse(-25*s,-164*s,80*s,25*s);
	    fill(55, 140, 36);
	    ellipse(-4*s,-188*s,75*s,45*s);
	    fill(52, 133, 33);
	    ellipse(8*s,-176*s,80*s,25*s);
	    fill(41, 110, 25);
	    ellipse(12*s,-160*s,90*s,20*s);
	    fill(133, 85, 43);
	    quad(-20*s,0,20*s,0,10*s,-130*s,-10*s,-130*s);
	    quad(9*s,-130*s,-10*s,-130*s,-43*s,-170*s,-35*s,-170*s);
	    quad(-9*s,-130*s,10*s,-130*s,36*s,-160*s,23*s,-160*s);
	    quad(9*s,-130*s,-10*s,-130*s,-12*s,-198*s,-3*s,-204*s);
	    fill(65, 145, 45);
	    ellipse(-32*s,-174*s,40*s,20*s);
	    ellipse(10*s,-183*s,40*s,20*s);
	    popMatrix();
	};

	var drawTreeWookee = function(x,y,s) {
	    pushMatrix();
	    translate(x,y);
	    fill(36, 122, 17);
	    ellipse(-25*s,-164*s,80*s,25*s);
	    fill(55, 140, 36);
	    ellipse(-4*s,-188*s,75*s,45*s);
	    fill(52, 133, 33);
	    ellipse(8*s,-176*s,80*s,25*s);
	    fill(41, 110, 25);
	    ellipse(12*s,-160*s,90*s,20*s);
	    fill(133, 85, 43);
	    quad(-20*s,0,20*s,0,10*s,-130*s,-10*s,-130*s);
	    quad(9*s,-130*s,-10*s,-130*s,-43*s,-170*s,-35*s,-170*s);
	    quad(-9*s,-130*s,10*s,-130*s,36*s,-160*s,23*s,-160*s);
	    quad(9*s,-130*s,-10*s,-130*s,-12*s,-198*s,-3*s,-204*s);
	    fill(65, 145, 45);
	    ellipse(-32*s,-174*s,40*s,20*s);
	    ellipse(10*s,-183*s,40*s,20*s);
	    fill(107, 68, 34);
	    ellipse(0,-90*s,90*s,25*s);
	    fill(133, 85, 43);
	    quad(-12*s,-90*s,12*s,-90*s,10*s,-130*s,-10*s,-130*s);
	    fill(122, 76, 39);
	    rect(22*s,-119*s,15*s,20*s,5*s);
	    rect(22*s,-104*s,6*s,18*s,2*s);
	    rect(31*s,-104*s,6*s,18*s,2*s);
	    rect(19*s,-120*s,6*s,18*s,2*s);
	    rect(32*s,-120*s,9*s,6*s,2*s);
	    rect(37*s,-127*s,6*s,12*s,2*s);
	    ellipse(29*s,-117*s,15*s,30*s);
	    ellipse(40*s,-127*s,8*s,8*s);
	    popMatrix();
	};

	var drawPodRacer = function(x,y1,y2,s) {
	    stroke(234, 94, 255,100);
	    strokeWeight(10*s);
	    line(x+155*s,y1,x-155*s,y2);
	    noStroke();
	    fill(166, 166, 166);
	    ellipse(x+155*s,y1,100*s,100*s);
	    ellipse(x-155*s,y2,100*s,100*s);
	    fill(255, 189, 97,100);
	    ellipse(x+155*s,y1,80*s,80*s);
	    ellipse(x+155*s,y1,50*s,50*s);
	    ellipse(x-155*s,y2,80*s,80*s);
	    ellipse(x-155*s,y2,50*s,50*s);
	};

	var drawDeathStar = function(x,y,s) {
	    pushMatrix();
	    translate(x,y);
	    fill(96, 97, 99);
	    ellipse(0,0,200*s,200*s);
	    fill(77, 77, 79);
	    arc(0,0,200*s,200*s,80,260);
	    pushMatrix();
	    rotate(-100);
	    arc(1*s,-2*s,200*s,60*s,0,180);
	    popMatrix();
	    stroke(102, 103, 105);
	    noFill();
	    strokeWeight(8*s);
	    arc(0,0,200*s,80*s,15,164);
	    stroke(77, 77, 79,150);
	    arc(0,0,200*s,80*s,73,164);
	    noStroke();
	    fill(102, 103, 105);
	    ellipse(30*s,-34*s,65*s,68*s);
	    fill(77, 77, 79);
	    arc(30*s,-34*s,65*s,68*s,-58,18);
	    fill(108, 110, 112);
	    ellipse(30*s,-34*s,25*s,26*s);
	    popMatrix();
	};

	var drawFalcon = function(x,y,s) {
	    pushMatrix();
	    translate(x,y);
	    fill(207, 207, 207);
	    quad(-72*s, 29*s, 86*s, 63*s, 101*s, 57*s, 16*s, 22*s);
	    quad(121*s, 44*s,133*s, 40*s,55*s, -19*s,11*s, -8*s);
	    fill(173, 173, 173);
	    quad(-19*s, 46*s, 86*s, 74*s, 86*s, 63*s, -21*s, 26*s);
	    quad(86*s, 74*s, 86*s, 63*s,101*s, 57*s,100*s, 69*s);
	    quad(121*s, 43*s,121*s, 53*s,51*s, 24*s,56*s, 10*s);
	    quad(121*s, 43*s,121*s,53*s,133*s,51*s,133*s,40*s);
	    pushMatrix();
	    rotate(10);
	    fill(191, 191, 191);
	    ellipse(0,0,200*s,90*s);
	    popMatrix();
	    fill(181, 181, 181);
	    quad(-37*s,-26*s,-32*s,-22*s,-49*s,22*s,-65*s,12*s);
	    fill(199, 199, 199);
	    quad(-37*s,-26*s,-65*s,12*s,-86*s,12*s,-49*s,-33*s);
	    pushMatrix();
	    fill(199, 199, 199);
	    quad(-44*s,-35*s,-3*s,-35*s,99*s,33*s,87*s,42*s);
	    rotate(-4);
	    ellipse(-25*s,-35*s,50*s,20*s);
	    popMatrix();
	    beginShape();
	    //fill(255, 0, 0);
	    vertex(-81*s,18*s);
	    vertex(-56*s,50*s);
	    vertex(-33*s,55*s);
	    vertex(-20*s,38*s);
	    vertex(-33*s,17*s);
	    vertex(-58*s,5*s);
	    //poly(-80*s,-30*s,-70*s,-40*s,-55*s,-42*s,-45*s,-36*s,-40*s,-75*s,-25*s);
	    endShape();
	    ellipse(-70*s,13*s,25*s,25*s);
	    fill(191, 191, 191);
	    ellipse(-29*s,44*s,22*s,22*s);
	    //beginShape(); vertex(269*s, 270*s); vertex(171, 229); vertex(116, 133); vertex(173, 82); vertex(276, 139); vertex(315, 225); endShape(CLOSE); 
	    popMatrix();
	};

	var newDeathStar = function(x,y,z) {
	    var ds = {};
	    ds.x = x;
	    ds.y = y;
	    ds.z = z;
	    ds.findPosition = function() {
	        this.screenX = xyz2xy(this.x,this.y,this.z)[0];
	        this.screenY = xyz2xy(this.x,this.y,this.z)[0];
	        this.screenW = w2w(1,this.z);
	    };
	    ds.drawIt = function() {
	        drawDeathStar(this.screenX,this.screenY,this.screenW);
	    };
	    ds.moveIt = function() {
	        this.z--;
	    };
	    return ds;
	};

	var newSeaweed = function(x,y,z) {
	    var seaweed = {};
	    seaweed.y = y;
	    seaweed.x = x;
	    seaweed.z = z;
	    seaweed.findPosition = function() {
	        this.screenX = xyz2xy(this.x, this.y, this.z)[0];
	        this.screenY = xyz2xy(this.x, this.y, this.z)[1];
	        this.screenW = w2w(2, this.z);
	    };
	    seaweed.drawIt = function() {
	        drawSeaWeed(this.screenX, this.screenY, this.screenW);
	    };
	    seaweed.moveIt = function() {
	        this.z--;
	    };
	    return seaweed;
	};

	var newFish1 = function(x,y,z) {
	    var fish = {};
	    fish.y = y;
	    fish.x = x;
	    fish.z = z;
	    fish.xStep = 0;
	    fish.myColor = color(random(0,255),random(0,255),random(0,255));
	    fish.turnTime = floor(random(50,70));
	    //fish.myColor = color(255, 0, 0);
	    fish.findPosition = function() {
	        this.screenX = xyz2xy(this.x, this.y, this.z)[0];
	        this.screenY = xyz2xy(this.x, this.y, this.z)[1];
	        this.screenW = w2w(1.5, this.z);
	    };
	    fish.drawIt = function() {
	        if (this.xStep > 0) {
	            drawFish12(this.screenX,this.screenY,this.screenW,this.myColor);
	        } else {
	            drawFish1(this.screenX,this.screenY,this.screenW,this.myColor);
	        }
	    };
	    fish.moveIt = function() {
	        this.z--;
	        if (timer === 1 || timer % this.turnTime === 0) {
	            this.xStep = random(-5,5);
	        }
	        this.x += this.xStep;
	    };
	    return fish;
	};

	var newFalcon = function(x,y,z) {
	    var falcon = {};
	    falcon.y = y;
	    falcon.x = x;
	    falcon.z = z;
	    falcon.xStep = 0;
	    falcon.yStep = 0;
	    falcon.turnTime = floor(random(50,70));
	    //fish.myColor = color(255, 0, 0);
	    falcon.findPosition = function() {
	        this.screenX = xyz2xy(this.x, this.y, this.z)[0];
	        this.screenY = xyz2xy(this.x, this.y, this.z)[1];
	        this.screenW = w2w(1, this.z);
	    };
	    falcon.drawIt = function() {
	        drawFalcon(this.screenX,this.screenY,this.screenW);
	    };
	    falcon.moveIt = function() {
	        this.z--;
	        if (timer === 1 || timer % this.turnTime === 0) {
	            this.xStep = random(-5,5);
	            this.yStep = random(-5,5);
	        }
	        this.x += this.xStep;
	        this.y += this.yStep;
	    };
	    return falcon;
	};

	var newFish2 = function(x,y,z) {
	    var fish = {};
	    fish.y = y;
	    fish.x = x;
	    fish.z = z;
	    fish.xStep = 0;
	    fish.turnTime = floor(random(50,70));
	    fish.findPosition = function() {
	        this.screenX = xyz2xy(this.x, this.y, this.z)[0];
	        this.screenY = xyz2xy(this.x, this.y, this.z)[1];
	        this.screenW = w2w(1.5, this.z);
	    };
	    fish.drawIt = function() {
	        if (this.xStep > 0) {
	            drawFish2(this.screenX,this.screenY,this.screenW);
	        } else {
	            drawFish22(this.screenX,this.screenY,this.screenW);
	        }
	    };
	    fish.moveIt = function() {
	        this.z--;
	        if (timer === 1 || timer % this.turnTime === 0) {
	            this.xStep = random(-5,5);
	        }
	        this.x += this.xStep;
	    };
	    return fish;
	};

	var newRock = function(x,y,z,type) {
	    var rock = {};
	    rock.x = x;
	    rock.y = y;
	    rock.z = z;
	    rock.size = random(0.15,0.45);
	    if (type === 1) {
	        rock.size = random(0.4,0.8);
	    }
	    if (type === 2) {
	        rock.size = random(0.15,0.38);
	    }
	    rock.type = type;
	    rock.xStep = 0;
	    rock.yStep = 0;
	    rock.time = floor(random(60,85));
	    rock.findPosition = function() {
	        this.screenX = xyz2xy(this.x, this.y, this.z)[0];
	        this.screenY = xyz2xy(this.x, this.y, this.z)[1];
	        this.screenW = w2w(this.size, this.z);
	    };
	    rock.drawIt = function(theta) {
	        if (this.type === 0) {
	            drawEarth(this.screenX, this.screenY, this.screenW);
	        } else if (this.type === 1) {
	            drawEarth2(this.screenX, this.screenY, this.screenW,theta);
	        } else if (this.type === 2) {
	            drawEarth3(this.screenX, this.screenY, this.screenW);
	        }
	    };
	    rock.moveIt = function() {
	        if (this.type === 0 || this.type === 2) {
	            this.z--;
	        } else {
	            this.z--;
	            if (timer === 1 || timer % this.time === 0) {
	                this.yStep = random(-2,2);
	                this.xStep = random(-2,2);
	            }
	            this.y += this.yStep;
	            this.x += this.xStep;
	        }
	    };
	    return rock;
	};

	var newTree = function(x,y,z) {
	    var tree = {};
	    tree.x = x;
	    tree.y = y;
	    tree.z = z;
	    tree.wookee = floor(random(0,7));
	    tree.findPosition = function() {
	        this.screenX = xyz2xy(this.x, this.y, this.z)[0];
	        this.screenY = xyz2xy(this.x, this.y, this.z)[1];
	        this.screenW = w2w(1, this.z);
	    };
	    tree.drawIt = function() {
	        if (this.wookee === 0) {
	            drawTreeWookee(this.screenX, this.screenY, this.screenW);
	        } else {
	            drawTree(this.screenX, this.screenY, this.screenW);
	        }
	    };
	    tree.moveIt = function() {
	        this.z--;
	    };
	    return tree;
	};

	var newStar = function(x,y,z) {
	    var star = {};
	    star.x = x;
	    star.y = y;
	    star.z = z;
	    star.findPosition = function() {
	        this.screenX = xyz2xy(this.x, this.y, this.z)[0];
	        this.screenY = xyz2xy(this.x, this.y, this.z)[1];
	        this.screenW = w2w(4, this.z);
	    };
	    star.drawIt = function() {
	        fill(255, 255, 255);
	        ellipse(this.screenX, this.screenY, this.screenW, this.screenW);
	    };
	    star.moveIt = function() {
	        this.z--;
	    };
	    return star;
	};

	var newVadar = function(x,y,z) {
	    var vadar = {};
	    vadar.x = x;
	    vadar.y = y;
	    vadar.z = z;
	    vadar.findPosition = function() {
	        this.screenX = xyz2xy(this.x, this.y, this.z)[0];
	        this.screenY = xyz2xy(this.x, this.y, this.z)[1];
	        this.screenW = w2w(0.75, this.z);
	    };
	    vadar.drawIt = function() {
	        drawVadar(this.screenX, this.screenY, this.screenW);
	    };
	    vadar.moveIt = function() {
	        if (this.z > 200) {
	            this.z--;
	        }
	    };
	    return vadar;
	};

	var newKylo = function(x,y,z) {
	    var kylo = {};
	    kylo.x = x;
	    kylo.y = y;
	    kylo.z = z;
	    kylo.findPosition = function() {
	        this.screenX = xyz2xy(this.x, this.y, this.z)[0];
	        this.screenY = xyz2xy(this.x, this.y, this.z)[1];
	        this.screenW = w2w(0.75, this.z);
	    };
	    kylo.drawIt = function() {
	        drawKyloRen(this.screenX, this.screenY, this.screenW);
	    };
	    kylo.moveIt = function() {
	        if (this.z > 200) {
	            this.z--;
	        }
	    };
	    return kylo;
	};

	var newBox = function(x,y,z,w,l,h,reversedLighting,r,g,b,r2,g2,b2,r3,g3,b3) {//uper forward left corner (least x,least z, most y) (w is x side length, h is y side length, h is z side length)
	    var box = {};
	    box.reversedLighting = reversedLighting;//top is brightest or bottom is brightest
	    box.mainColor = [r,g,b];
	    box.darkColor = [r2,g2,b2];
	    box.lightColor = [r3,g3,b3];
	    //box.mainColor = [255, 0, 0];
	    //box.darkColor = [99, 0, 0];
	    //box.lightColor = [255, 138, 138];
	    box.pos = [[x,y+h,z],[x+w,y+h,z],[x+w,y+h,z+l],[x,y+h,z+l],[x,y,z],[x+w,y,z],[x+w,y,z+l],[x,y,z+l]];
	    box.screenPos = [[x,y+h,z],[x+w,y+h,z],[x+w,y+h,z+l],[x,y+h,z+l],[x,y,z],[x+w,y,z],[x+w,y,z+l],[x,y,z+l]];//just for starters; never actually is this
	    box.distances = [[0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7]];
	    box.xStep = 0;
	    box.yStep = 0;
	    box.zStep = 0;
	    //[[],[],[],[],[],[],[],[]];
	    box.findPos = function() {
	        for (var i = 0; i < this.pos.length; i++) {
	            this.screenPos[i][0] = xyz2xy(this.pos[i][0],this.pos[i][1],this.pos[i][2])[0];
	            this.screenPos[i][1] = xyz2xy(this.pos[i][1],this.pos[i][1],this.pos[i][2])[1];
	        }
	    };
	    box.drawIt = function(testing) {//if testing=true, only outlines
	        if (testing) {
	            stroke(0, 0, 0);
	            noFill();
	            quad(this.screenPos[0][0],this.screenPos[0][1],this.screenPos[1][0],this.screenPos[1][1],this.screenPos[5][0],this.screenPos[5][1],this.screenPos[4][0],this.screenPos[4][1]);//side 1
	            quad(this.screenPos[0][0],this.screenPos[0][1],this.screenPos[1][0],this.screenPos[1][1],this.screenPos[2][0],this.screenPos[2][1],this.screenPos[3][0],this.screenPos[3][1]);//side 2
	            quad(this.screenPos[2][0],this.screenPos[2][1],this.screenPos[1][0],this.screenPos[1][1],this.screenPos[5][0],this.screenPos[5][1],this.screenPos[6][0],this.screenPos[6][1]);//side 3
	            quad(this.screenPos[2][0],this.screenPos[2][1],this.screenPos[3][0],this.screenPos[3][1],this.screenPos[7][0],this.screenPos[7][1],this.screenPos[6][0],this.screenPos[6][1]);//side 4
	            quad(this.screenPos[4][0],this.screenPos[4][1],this.screenPos[5][0],this.screenPos[5][1],this.screenPos[6][0],this.screenPos[6][1],this.screenPos[7][0],this.screenPos[7][1]);//side 5
	            quad(this.screenPos[0][0],this.screenPos[0][1],this.screenPos[3][0],this.screenPos[3][1],this.screenPos[7][0],this.screenPos[7][1],this.screenPos[4][0],this.screenPos[4][1]);//side 6
	            noStroke();
	        } else if ( this.pos[0][2] < 20) {
	            
	        } else {
	            this.distances = [[0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7]];
	            for (var i = 0; i < 8; i++) {
	                this.distances[i][0] = sqrt(sq(this.pos[i][0]-eyeX)+sq(this.pos[i][1]-eyeY)+sq(this.pos[i][2]-eyeZ));
	            }
	            
	            //debug(this.distances[1][0]);
	            this.distances.sort(myCompare);
	            //debug(this.distances[0][0]+" "+this.distances[0][1]+" "+this.distances[1][0]+" "+this.distances[1][1]+" "+this.distances[2][0]+" "+this.distances[2][1]+" "+this.distances[3][0]+" "+this.distances[3][1]+" "+this.distances[4][0]+" "+this.distances[4][1]+" "+this.distances[5][0]+" "+this.distances[5][1]+" "+this.distances[6][0]+" "+this.distances[6][1]+" "+this.distances[7][0]+" "+this.distances[7][1]);
	            //debug(this.distances[1][0] + " " + this.distances[1][1]);
	            //debug();
	            //text(this.distances[0][1]
	            
	            //stroke(this.darkColor[0],this.darkColor[1],this.darkColor[2]);
	            strokeWeight(w2w(3,this.pos[0][2]));
	            if (this.reversedLighting) {
	                fill(this.darkColor[0],this.darkColor[1],this.darkColor[2]);
	            } else {
	                fill(this.lightColor[0],this.lightColor[1],this.lightColor[2]);        
	            }
	            if (this.distances[0][1] === 0) {
	                if (this.screenPos[0][0]<this.screenPos[3][0]) {
	                    //background(255, 0, 0);
	                    quad(this.screenPos[0][0],this.screenPos[0][1],this.screenPos[1][0],this.screenPos[1][1],this.screenPos[2][0],this.screenPos[2][1],this.screenPos[3][0],this.screenPos[3][1]);//side 2
	                    fill(this.mainColor[0],this.mainColor[1],this.mainColor[2]);
	                    quad(this.screenPos[0][0],this.screenPos[0][1],this.screenPos[1][0],this.screenPos[1][1],this.screenPos[5][0],this.screenPos[5][1],this.screenPos[4][0],this.screenPos[4][1]);//side 1
	                } else {
	                    quad(this.screenPos[0][0],this.screenPos[0][1],this.screenPos[1][0],this.screenPos[1][1],this.screenPos[2][0],this.screenPos[2][1],this.screenPos[3][0],this.screenPos[3][1]);//side 2
	                    fill(this.mainColor[0],this.mainColor[1],this.mainColor[2]);
	                    quad(this.screenPos[0][0],this.screenPos[0][1],this.screenPos[1][0],this.screenPos[1][1],this.screenPos[5][0],this.screenPos[5][1],this.screenPos[4][0],this.screenPos[4][1]);//side 1
	                    quad(this.screenPos[0][0],this.screenPos[0][1],this.screenPos[3][0],this.screenPos[3][1],this.screenPos[7][0],this.screenPos[7][1],this.screenPos[4][0],this.screenPos[4][1]);//side 6
	                }
	            } else if (this.distances[0][1] === 1) {
	                if (this.screenPos[1][0]>this.screenPos[2][0]) {
	                    quad(this.screenPos[0][0],this.screenPos[0][1],this.screenPos[1][0],this.screenPos[1][1],this.screenPos[2][0],this.screenPos[2][1],this.screenPos[3][0],this.screenPos[3][1]);//side 2
	                    fill(this.mainColor[0],this.mainColor[1],this.mainColor[2]);
	                    quad(this.screenPos[0][0],this.screenPos[0][1],this.screenPos[1][0],this.screenPos[1][1],this.screenPos[5][0],this.screenPos[5][1],this.screenPos[4][0],this.screenPos[4][1]);//side 1
	                } else {
	                    quad(this.screenPos[0][0],this.screenPos[0][1],this.screenPos[1][0],this.screenPos[1][1],this.screenPos[2][0],this.screenPos[2][1],this.screenPos[3][0],this.screenPos[3][1]);//side 2
	                    fill(this.mainColor[0],this.mainColor[1],this.mainColor[2]);
	                    quad(this.screenPos[0][0],this.screenPos[0][1],this.screenPos[1][0],this.screenPos[1][1],this.screenPos[5][0],this.screenPos[5][1],this.screenPos[4][0],this.screenPos[4][1]);//side 1
	                    quad(this.screenPos[2][0],this.screenPos[2][1],this.screenPos[1][0],this.screenPos[1][1],this.screenPos[5][0],this.screenPos[5][1],this.screenPos[6][0],this.screenPos[6][1]);//side 3
	                }
	            } else if (this.distances[0][1] === 2) {
	                if (this.distances[1][0] !== this.distances[0][0]) {
	                    quad(this.screenPos[0][0],this.screenPos[0][1],this.screenPos[1][0],this.screenPos[1][1],this.screenPos[2][0],this.screenPos[2][1],this.screenPos[3][0],this.screenPos[3][1]);//side 2
	                    fill(this.mainColor[0],this.mainColor[1],this.mainColor[2]);
	                    quad(this.screenPos[2][0],this.screenPos[2][1],this.screenPos[3][0],this.screenPos[3][1],this.screenPos[7][0],this.screenPos[7][1],this.screenPos[6][0],this.screenPos[6][1]);//side 4
	                    quad(this.screenPos[2][0],this.screenPos[2][1],this.screenPos[1][0],this.screenPos[1][1],this.screenPos[5][0],this.screenPos[5][1],this.screenPos[6][0],this.screenPos[6][1]);//side 3
	                }
	            } else if (this.distances[0][1] === 3) {
	                if (this.distances[1][0] !== this.distances[0][0]) {
	                    quad(this.screenPos[0][0],this.screenPos[0][1],this.screenPos[1][0],this.screenPos[1][1],this.screenPos[2][0],this.screenPos[2][1],this.screenPos[3][0],this.screenPos[3][1]);//side 2
	                    fill(this.mainColor[0],this.mainColor[1],this.mainColor[2]);
	                    quad(this.screenPos[2][0],this.screenPos[2][1],this.screenPos[3][0],this.screenPos[3][1],this.screenPos[7][0],this.screenPos[7][1],this.screenPos[6][0],this.screenPos[6][1]);//side 4
	                    quad(this.screenPos[0][0],this.screenPos[0][1],this.screenPos[3][0],this.screenPos[3][1],this.screenPos[7][0],this.screenPos[7][1],this.screenPos[4][0],this.screenPos[4][1]);//side 6
	                }
	            }
	            if (!this.reversedLighting) {
	                fill(this.darkColor[0],this.darkColor[1],this.darkColor[2]);
	            } else {
	                fill(this.lightColor[0],this.lightColor[1],this.lightColor[2]);        
	            }
	            if (this.distances[0][1] === 4) {
	                if (this.screenPos[0][0]<this.screenPos[3][0]) {
	                    quad(this.screenPos[4][0],this.screenPos[4][1],this.screenPos[5][0],this.screenPos[5][1],this.screenPos[6][0],this.screenPos[6][1],this.screenPos[7][0],this.screenPos[7][1]);//side 5
	                    fill(this.mainColor[0],this.mainColor[1],this.mainColor[2]);
	                    quad(this.screenPos[0][0],this.screenPos[0][1],this.screenPos[1][0],this.screenPos[1][1],this.screenPos[5][0],this.screenPos[5][1],this.screenPos[4][0],this.screenPos[4][1]);//side 1
	                } else {
	                    quad(this.screenPos[4][0],this.screenPos[4][1],this.screenPos[5][0],this.screenPos[5][1],this.screenPos[6][0],this.screenPos[6][1],this.screenPos[7][0],this.screenPos[7][1]);//side 5
	                    fill(this.mainColor[0],this.mainColor[1],this.mainColor[2]);
	                    quad(this.screenPos[0][0],this.screenPos[0][1],this.screenPos[1][0],this.screenPos[1][1],this.screenPos[5][0],this.screenPos[5][1],this.screenPos[4][0],this.screenPos[4][1]);//side 1
	                    quad(this.screenPos[0][0],this.screenPos[0][1],this.screenPos[3][0],this.screenPos[3][1],this.screenPos[7][0],this.screenPos[7][1],this.screenPos[4][0],this.screenPos[4][1]);//side 6
	                }
	            } else if (this.distances[0][1] === 5) {
	                if (this.screenPos[1][0]>this.screenPos[2][0]) {
	                    quad(this.screenPos[4][0],this.screenPos[4][1],this.screenPos[5][0],this.screenPos[5][1],this.screenPos[6][0],this.screenPos[6][1],this.screenPos[7][0],this.screenPos[7][1]);//side 5
	                    fill(this.mainColor[0],this.mainColor[1],this.mainColor[2]);
	                    quad(this.screenPos[0][0],this.screenPos[0][1],this.screenPos[1][0],this.screenPos[1][1],this.screenPos[5][0],this.screenPos[5][1],this.screenPos[4][0],this.screenPos[4][1]);//side 1
	                } else {
	                    quad(this.screenPos[4][0],this.screenPos[4][1],this.screenPos[5][0],this.screenPos[5][1],this.screenPos[6][0],this.screenPos[6][1],this.screenPos[7][0],this.screenPos[7][1]);//side 5
	                    fill(this.mainColor[0],this.mainColor[1],this.mainColor[2]);
	                    quad(this.screenPos[0][0],this.screenPos[0][1],this.screenPos[1][0],this.screenPos[1][1],this.screenPos[5][0],this.screenPos[5][1],this.screenPos[4][0],this.screenPos[4][1]);//side 1
	                    quad(this.screenPos[2][0],this.screenPos[2][1],this.screenPos[1][0],this.screenPos[1][1],this.screenPos[5][0],this.screenPos[5][1],this.screenPos[6][0],this.screenPos[6][1]);//side 3
	                }
	            } else if (this.distances[0][1] === 6) {
	                if (this.distances[1][0] !== this.distances[0][0]) {
	                    quad(this.screenPos[4][0],this.screenPos[4][1],this.screenPos[5][0],this.screenPos[5][1],this.screenPos[6][0],this.screenPos[6][1],this.screenPos[7][0],this.screenPos[7][1]);//side 5
	                    fill(this.mainColor[0],this.mainColor[1],this.mainColor[2]);
	                    quad(this.screenPos[2][0],this.screenPos[2][1],this.screenPos[3][0],this.screenPos[3][1],this.screenPos[7][0],this.screenPos[7][1],this.screenPos[6][0],this.screenPos[6][1]);//side 4
	                    quad(this.screenPos[2][0],this.screenPos[2][1],this.screenPos[1][0],this.screenPos[1][1],this.screenPos[5][0],this.screenPos[5][1],this.screenPos[6][0],this.screenPos[6][1]);//side 3
	                }
	            } else if (this.distances[0][1] === 7) {
	                if (this.distances[1][0] !== this.distances[0][0]) {
	                    quad(this.screenPos[4][0],this.screenPos[4][1],this.screenPos[5][0],this.screenPos[5][1],this.screenPos[6][0],this.screenPos[6][1],this.screenPos[7][0],this.screenPos[7][1]);//side 5
	                    fill(this.mainColor[0],this.mainColor[1],this.mainColor[2]);
	                    quad(this.screenPos[2][0],this.screenPos[2][1],this.screenPos[3][0],this.screenPos[3][1],this.screenPos[7][0],this.screenPos[7][1],this.screenPos[6][0],this.screenPos[6][1]);//side 4
	                    quad(this.screenPos[0][0],this.screenPos[0][1],this.screenPos[3][0],this.screenPos[3][1],this.screenPos[7][0],this.screenPos[7][1],this.screenPos[4][0],this.screenPos[4][1]);//side 6
	                }
	            } 
	            //println(this.distances);
	            noStroke();
	        }
	    };
	    box.moveIt = function() {
	        for (var i = 0; i < 8; i++) {
	            this.pos[i][2]-=2;
	        }
	    };
	    return box;
	};

	mouseClicked = function() {
	    mouseIsClicked = true;
	    //scene++;
	};

	var drawLightspeed = function() {
	    if (timer === 0) {
	        background(0, 0, 0);
	        eyeX = 200;
	        eyeY = 200;
	        eyeZ = 0;
	        numStars = 175;
	        zw = 240;
	        stars = [];
	        for (var i = 0; i < numStars; i++) {
	            stars.push(newStar(random(-200, 600), random(-200,600), random(200,600)));
	        }
	    }
	    for (var i = 0; i < numStars; i++) {
	        stars[i].findPosition();
	        stars[i].drawIt();
	        stars[i].moveIt();
	    }
	    timer++;
	    if (timer > 120) {
	        timer = 0;
	        scene++;
	    }
	};

	var drawMenu = function() {
	    background(0, 0, 0);
	    fill(255, 215,0);
	    textSize(45);
	    text("Star Tours", 88,100);
	    textSize(35);
	    text("Start", 160,220);
	    if (mouseIsClicked && mouseX > 150 && mouseX < 250 && mouseY > 190 && mouseY < 230) {
	        scene++;
	    }
	};

	var draws0 = function() {
	    background(10, 32, 74);
	    if (timer === 0) {
	        stars = [];
	        numStars = 1000;
	        eyeX = 200;
	        eyeY = 200;
	        eyeZ = -1;
	        zw = 240;
	        for (var i = 0; i < numStars; i++) {
	            stars.push(newStar(random(-5000, 9000), random(-5000,11000), random(700,3000)));
	        }
	        s0vadar = newVadar(200,300,400);
	    }
	    for (var i = 0; i < numStars; i++) {
	        stars[i].findPosition();
	        stars[i].drawIt();
	    }
	    if (timer % 30 === 0) {
	        xMove = random(-1.5,1.5);
	        yMove = random(-1.2,0.5);
	        zMove = random(-1.5,0);
	        if (eyeZ < -150) {
	            zMove = random(0,1.5);
	        }
	    }
	    eyeX += xMove;
	    eyeY += yMove;
	    eyeZ += zMove;
	    fill(13, 13, 13);
	    //rect(75,eyeY,250,400-eyeY);
	    //quad(75,eyeY,75,400,0,400,0,229);
	    //quad(325,eyeY,325,400,400,400,400,229);
	    //quad(75,eyeY,325,eyeY,810,400,-409,400);
	    quad(xyz2xy(-400,0,600)[0],xyz2xy(-400,0,600)[1],xyz2xy(800,0,600)[0],xyz2xy(800,0,600)[1],xyz2xy(800,0,0)[0],xyz2xy(800,0,0)[1],xyz2xy(-400,0,0)[0],xyz2xy(-400,0,0)[1]);
	    stroke(255, 0, 0);
	    strokeWeight(25);
	    //point(xyz2xy(400,0,160)[0],xyz2xy(400,0,160)[1]);
	    stroke(13, 13, 13);
	    strokeWeight(10);
	    //line(80,eyeY,160, 50);
	    line(xyz2xy(-400,0,600)[0],xyz2xy(-400,0,600)[1],xyz2xy(-200,800,600)[0],xyz2xy(-200,800,600)[1]);
	    line(xyz2xy(800,0,600)[0],xyz2xy(800,0,600)[1],xyz2xy(600,800,600)[0],xyz2xy(600,800,600)[1]);
	    line(xyz2xy(-200,800,600)[0],xyz2xy(-200,800,600)[1],xyz2xy(600,800,600)[0],xyz2xy(600,800,600)[1]);
	    line(xyz2xy(-200,800,600)[0],xyz2xy(-200,800,600)[1],xyz2xy(-400,1600,600)[0],xyz2xy(-400,1600,600)[1]);
	    line(xyz2xy(600,800,600)[0],xyz2xy(600,800,600)[1],xyz2xy(800,1600,600)[0],xyz2xy(800,1600,600)[1]);
	    //line(320,eyeY,240, 50);
	    //line(160, 50, 240, 50);
	    //line(160, 50,110,0);
	    //line(240, 50,290,0);
	    noStroke();
	    s0vadar.findPosition();
	    s0vadar.drawIt();
	    s0vadar.moveIt();
	    timer++;
	    if (mouseIsClicked || s0vadar.z <= 200) {
	        timer = 0;
	        scene++;
	    }
	    fill(255, 0, 0);
	    textSize(30);
	    //ext(eyeZ,50,50);
	};

	var draws1 = function() {
	    background(10, 32, 74);
	    if (timer === 0) {
	        stars = [];
	        numStars = 1000;
	        eyeX = 200;
	        eyeY = 200;
	        eyeZ = -1;
	        zw = 240;
	        for (var i = 0; i < numStars; i++) {
	            stars.push(newStar(random(-5000, 9000), random(-5000,11000), random(700,3000)));
	        }
	        s1vadar = newKylo(200,300,400);
	    }
	    for (var i = 0; i < numStars; i++) {
	        stars[i].findPosition();
	        stars[i].drawIt();
	    }
	    if (timer % 30 === 0) {
	        xMove = random(-1.5,1.5);
	        yMove = random(-1.2,0.5);
	        zMove = random(-1.5,0);
	        if (eyeZ < -150) {
	            zMove = random(0,1.5);
	        }
	    }
	    eyeX += xMove;
	    eyeY += yMove;
	    eyeZ += zMove;
	    fill(13, 13, 13);
	    //rect(75,eyeY,250,400-eyeY);
	    //quad(75,eyeY,75,400,0,400,0,229);
	    //quad(325,eyeY,325,400,400,400,400,229);
	    //quad(75,eyeY,325,eyeY,810,400,-409,400);
	    quad(xyz2xy(-400,0,600)[0],xyz2xy(-400,0,600)[1],xyz2xy(800,0,600)[0],xyz2xy(800,0,600)[1],xyz2xy(800,0,0)[0],xyz2xy(800,0,0)[1],xyz2xy(-400,0,0)[0],xyz2xy(-400,0,0)[1]);
	    stroke(255, 0, 0);
	    strokeWeight(25);
	    //point(xyz2xy(400,0,160)[0],xyz2xy(400,0,160)[1]);
	    stroke(13, 13, 13);
	    strokeWeight(10);
	    //line(80,eyeY,160, 50);
	    line(xyz2xy(-400,0,600)[0],xyz2xy(-400,0,600)[1],xyz2xy(-200,800,600)[0],xyz2xy(-200,800,600)[1]);
	    line(xyz2xy(800,0,600)[0],xyz2xy(800,0,600)[1],xyz2xy(600,800,600)[0],xyz2xy(600,800,600)[1]);
	    line(xyz2xy(-200,800,600)[0],xyz2xy(-200,800,600)[1],xyz2xy(600,800,600)[0],xyz2xy(600,800,600)[1]);
	    line(xyz2xy(-200,800,600)[0],xyz2xy(-200,800,600)[1],xyz2xy(-400,1600,600)[0],xyz2xy(-400,1600,600)[1]);
	    line(xyz2xy(600,800,600)[0],xyz2xy(600,800,600)[1],xyz2xy(800,1600,600)[0],xyz2xy(800,1600,600)[1]);
	    //line(320,eyeY,240, 50);
	    //line(160, 50, 240, 50);
	    //line(160, 50,110,0);
	    //line(240, 50,290,0);
	    noStroke();
	    s1vadar.findPosition();
	    s1vadar.drawIt();
	    s1vadar.moveIt();
	    timer++;
	    if (mouseIsClicked || s1vadar.z <= 200) {
	        timer = 0;
	        scene++;
	    }
	    fill(255, 0, 0);
	    textSize(30);
	    //ext(eyeZ,50,50);
	};

	var drawp10 = function() {
	    if (timer === 0) {
	        stars = [];
	        numStars = 1000;
	        eyeX = 200;
	        eyeY = 200;
	        eyeZ = -1;
	        zw = 240;
	        for (var i = 0; i < numStars; i++) {
	            stars.push(newStar(random(-3000, 7000), random(-3000,7000), random(700,3000)));
	        }
	    } else if (timer < 100) {
	        background(0, 0, 0);
	        for (var i = 0; i < numStars; i++) {
	            stars[i].findPosition();
	            stars[i].drawIt();
	        }
	        fill(191, 133, 101);
	        ellipse(200,200,150,150);
	        fill(125, 79, 85);
	        ellipse(223,168,60,50);
	        ellipse(201,178,30,50);
	        ellipse(188,183,20,30);
	        ellipse(246,194,50,50);
	        ellipse(172,232,50,40);
	        ellipse(196,253,50,40);
	        ellipse(172,215,20,20);
	        ellipse(163,157,30,40);
	    } else if (timer === 100) {
	        for (var i = 15; i > 0; i--) {
	            rocks.push(newRock(random(350,750),0,133*i+random(-20,20),0));
	        }
	        for (var i = 15; i > 0; i--) {
	            rocks.push(newRock(random(-350,50),0,133*i+random(-20,20)+50,0));
	        }
	        eyeY = 150;
	        
	        opponent.x = random(-150,150);
	        opponent.y1 = random(100,400);
	        opponent.y2 = random(opponent.y1-50,opponent.y1+50);
	        opponent.z = 300;
	        opponent.xStep = 0;
	        opponent.yStep1 = 0;
	        opponent.yStep2 = 0;
	        opponent.zStep = 0;
	        opponent.drawIt = function() {
	            drawPodRacer(this.screenX,this.screenY1,this.screenY2,this.screenW);
	        };
	        opponent.findPosition = function() {
	            this.screenX = xyz2xy(this.x,this.y1,this.z)[0];
	            this.screenY1 = xyz2xy(this.x,this.y1,this.z)[1];
	            this.screenY2 = xyz2xy(this.x,this.y2,this.z)[1];
	            this.screenW = w2w(0.5,this.z);
	        };
	        opponent.moveIt = function() {
	            if (timer % 50 === 0) {
	                this.xStep = random(-1,1);
	                this.yStep1 = random(-1,1);
	                this.yStep2 = random(-1,1);
	                this.zStep = random(-2,1.5);
	            }
	            this.x += this.xStep;
	            this.y1 += this.yStep1;
	            this.y2 += this.yStep2;
	            this.z += this.zStep;
	        };
	        //rocks.push(newRock(200,0,1000));
	    } else {
	        if (timer % 20 === 0) {
	            yMove = random(-1,1);
	        }
	        eyeY += yMove;
	        background(153, 205, 222);
	        fill(222, 199, 169);
	        rect(0,400-eyeY,400,400);
	        fill(186, 153, 112);
	        quad(200,400-eyeY,200,400-eyeY,300,400,100,400);
	        for (var i = 0; i < rocks.length; i++) {
	            rocks[i].findPosition();
	            rocks[i].drawIt();
	            rocks[i].moveIt();
	            if (rocks[i].z < 50) {
	                rocks.splice(i,1);
	            }
	        }
	        opponent.findPosition();
	        if (opponent.z > 50) {
	            opponent.drawIt();
	            opponent.moveIt();
	        } else {
	            fill(0, 0, 0);
	            textSize(20);
	            text("You won the pod race!",96,200);
	        }
	        stroke(234, 94, 255,100);
	        strokeWeight(10);
	        line(355,100,45,100);
	        noStroke();
	        fill(166, 166, 166);
	        ellipse(355,100,100,100);
	        ellipse(45,100,100,100);
	        fill(255, 189, 97,100);
	        ellipse(355,100,80,80);
	        ellipse(355,100,50,50);
	        ellipse(45,100,80,80);
	        ellipse(45,100,50,50);
	    }
	    if (timer > 1000 || mouseIsClicked) {
	        timer = 0;
	        scene++;
	    }
	    timer++;
	};

	var drawp11 = function() {
	    if (timer === 0) {
	        stars = [];
	        numStars = 1000;
	        eyeX = 200;
	        eyeY = 200;
	        eyeZ = -1;
	        zw = 240;
	        for (var i = 0; i < numStars; i++) {
	            stars.push(newStar(random(-3000, 7000), random(-3000,7000), random(700,3000)));
	        }
	    } else if (timer < 100) {
	        background(0, 0, 0);
	        for (var i = 0; i < numStars; i++) {
	            stars[i].findPosition();
	            stars[i].drawIt();
	        }
	        fill(48, 156, 93);
	        ellipse(200,200,150,150);
	        fill(105, 158, 66);
	        ellipse(223,168,60,50);
	        ellipse(201,178,30,50);
	        ellipse(188,183,20,30);
	        ellipse(246,194,50,50);
	        ellipse(172,232,50,40);
	        ellipse(196,253,50,40);
	        ellipse(172,215,20,20);
	        ellipse(163,157,30,40);
	    } else if (timer === 100) {
	        for (var i = 16; i > 0; i--) {
	            trees.push(newTree(random(350,550),0,150*i+random(-20,20)));
	        }
	        for (var i = 16; i > 0; i--) {
	            trees.push(newTree(random(-150,50),0,150*i+random(-20,20)+50));
	        }
	        eyeY = 150;
	        //rocks.push(newRock(200,0,1000));
	    } else {
	        if (timer % 20 === 0) {
	            yMove = random(-1,1);
	            xMove = random(-1,1);
	        }
	        eyeY += yMove;
	        eyeX += xMove;
	        background(70, 192, 214);
	        fill(89, 56, 16);
	        rect(0,400-eyeY,400,400);
	        for (var i = 0; i < trees.length; i++) {
	            trees[i].findPosition();
	            trees[i].drawIt();
	            trees[i].moveIt();
	            if (trees[i].z < 50) {
	                trees.splice(i,1);
	            }
	        }
	    }
	    if (timer > 1000 || mouseIsClicked) {
	        timer = 0;
	        scene++;
	    }
	    timer++;
	};

	var drawp12 = function() {
	    if (timer === 0) {
	        eyeX = 200;
	        eyeY = 200;
	        eyeZ = -1;
	        thetaMove = 0;
	        zw = 240;
	        falcon = newFalcon(200,400,800);
	        for (var i = 25; i > 0; i--) {
	            //rocks.push(newRock(random(-450,850),random(-450,850),40*i+random(-20,20),1));
	            rocks.push(newRock(random(-650,650),20,40*i+random(-20,20),2));
	        }
	        for (var i = 10; i > 0; i--) {
	            //rocks.push(newRock(random(-450,850),random(-450,850),40*i+random(-20,20),1));
	            boxes.push(newBox(random(-450,450),0,250*i+random(-20,20)+300,250,180,100,false,135, 116, 91,135, 116, 91,222, 191, 151));
	            boxes.push(newBox(random(-750,750),600,250*i+random(-20,20)+300,350,280,100,true,135, 116, 91,135, 116, 91,222, 191, 151));
	            fill(133, 112, 84);
	            fill(222, 191, 151);
	            fill(135, 116, 91);
	        }
	        stars = [];
	        numStars = 1000;
	        for (var i = 0; i < numStars; i++) {
	            stars.push(newStar(random(-3000, 7000), random(-3000,7000), random(700,3000)));
	        }
	    } else if (timer < 100) {
	        background(0, 0, 0);
	        for (var i = 0; i < numStars; i++) {
	            stars[i].findPosition();
	            stars[i].drawIt();
	        }
	        fill(163, 124, 96);
	        ellipse(200,200,150,150);
	        fill(173, 131, 102);
	        ellipse(223,168,60,50);
	        ellipse(201,178,30,50);
	        ellipse(188,183,20,30);
	        ellipse(246,194,50,50);
	        ellipse(172,232,50,40);
	        ellipse(196,253,50,40);
	        ellipse(172,215,20,20);
	        ellipse(163,157,30,40);
	    } else if (timer < 700) {
	        if (timer % 20 === 0) {
	            yMove = random(-1,1);
	        }
	        eyeY += yMove;
	        background(153, 205, 222);
	        fill(161, 126, 102);
	        rect(0,400-eyeY,400,400);
	        fill(186, 153, 112);
	        //quad(200,400-eyeY,200,400-eyeY,300,400,100,400);
	        for (var i = 0; i < rocks.length; i++) {
	            rocks[i].findPosition();
	            rocks[i].drawIt();
	            rocks[i].moveIt();
	            if (rocks[i].z < 50) {
	                rocks.splice(i,1);
	            }
	        }
	        falcon.findPosition();
	        falcon.drawIt();
	        falcon.moveIt();
	    } else {
	        background(92, 73, 56);
	        fill(189, 163, 127);
	        rect(0,xyz2xy(0,-60,3000)[1],400,400);
	        rect(0,0,400,xyz2xy(0,1000,3000)[1]);
	        for (var i = 0; i < boxes.length; i++) {
	            boxes[i].findPos();
	            boxes[i].drawIt(false);
	            boxes[i].moveIt();
	            if (boxes[i].pos[0][2] < 20) {
	                boxes.splice(i,1);
	            }
	        }
	    }
	    timer++;
	    if (timer > 1500 || mouseIsClicked) {
	        timer = 0;
	        scene++;
	    }
	};

	var drawt0 = function() {
	    background(0, 0, 0);
	    fill(120, 183, 222,175);
	    quad(256,252,148,270,179,146,211,146);
	    quad(232,252,170,270,190,146,199,146);
	    drawYoda(200,270,1.5);
	    fill(255, 255, 255);
	    textSize(20);
	    text("Yoda, I am. On your ship, one loyal to our \ncause, you carry. Mmm. Deliver them, you\nmust, or all will be lost. To your R2 unit,\ncoordinates I will send.\n            May the Force be with you.",15,30);
	    timer++;
	    if (mouseIsClicked || timer > 600) {
	        timer = 0;
	        scene++;
	    }
	};

	var drawp20 = function() {
	    if (timer === 0) {
	        stars = [];
	        numStars = 1000;
	        eyeX = 200;
	        eyeY = 200;
	        eyeZ = -1;
	        zw = 240;
	        for (var i = 0; i < numStars; i++) {
	            stars.push(newStar(random(-3000, 7000), random(-3000,7000), random(700,3000)));
	        }
	    } else if (timer < 100) {
	        background(0, 0, 0);
	        for (var i = 0; i < numStars; i++) {
	            stars[i].findPosition();
	            stars[i].drawIt();
	        }
	        fill(43, 131, 179);
	        ellipse(200,200,150,150);
	        fill(30, 112, 19);
	        ellipse(223,168,60,50);
	        ellipse(201,178,30,50);
	        ellipse(188,183,20,30);
	        ellipse(246,194,50,50);
	        ellipse(172,232,50,40);
	        ellipse(196,253,50,40);
	        ellipse(172,215,20,20);
	        ellipse(163,157,30,40);
	    } else if (timer === 100) {
	        eyeY = 100;
	        for (var i = 12; i > 0; i--) {
	            seaweed.push(newSeaweed(random(350,750),0,300*i+random(-40,40)));
	        }
	        for (var i = 12; i > 0; i--) {
	            seaweed.push(newSeaweed(random(-350,50),0,300*i+random(-40,40)+50));
	        }
	        for (var i = 10; i > 0; i--) {
	            fish1.push(newFish1(random(-350,750),random(50,1200),300*i+random(-40,40)));
	        }
	        for (var i = 6; i > 0; i--) {
	            fish2.push(newFish2(random(-350,750),random(50,1200),400*i+random(-40,40)));
	        }
	    } else {
	        fill(13, 24, 122);
	        rect(0,0,400,400-eyeY);
	        if (timer % 20 === 0) {
	            yMove = random(-1,1);
	        }
	        eyeY += yMove;
	        fill(222, 199, 169);
	        rect(0,400-eyeY,400,400);
	        for (var i = 0; i < seaweed.length; i++) {
	            seaweed[i].findPosition();
	            seaweed[i].drawIt();
	            seaweed[i].moveIt();
	            if (seaweed[i].z < 50) {
	                seaweed.splice(i,1);
	            }
	        }
	        for (var i = 0; i < fish1.length; i++) {
	            fish1[i].findPosition();
	            fish1[i].drawIt();
	            fish1[i].moveIt();
	            if (fish1[i].z < 50) {
	                fish1.splice(i,1);
	            }
	        }
	        for (var i = 0; i < fish2.length; i++) {
	            fish2[i].findPosition();
	            fish2[i].drawIt();
	            fish2[i].moveIt();
	            if (fish2[i].z < 50) {
	                fish2.splice(i,1);
	            }
	        }
	        fill(13, 24, 122,100);
	        rect(0,0,400,400);
	    }
	    timer++;
	    if (timer > 1000 || mouseIsClicked) {
	        timer = 0;
	        scene++;
	    }
	};

	var testBox = newBox(305, 136, 88, 70, 100, 130, false, 130, 130, 130,64, 64, 64,201, 201, 201);

	var drawp21 = function() {
	    if (timer === 0) {
	        eyeX = 200;
	        eyeY = 200;
	        eyeZ = -1;
	        thetaMove = 0;
	        zw = 240;
	        boxes = [];
	        rocks = [];
	        for (var i = 20; i > 0; i--) {
	            //rocks.push(newRock(random(-450,850),random(-450,850),40*i+random(-20,20),1));
	            rocks.push(newRock(random(-450,450),random(-450,450),40*i+random(-20,20),1));
	        }
	        for (var i = 10; i > 0; i--) {
	            //rocks.push(newRock(random(-450,850),random(-450,850),40*i+random(-20,20),1));
	            boxes.push(newBox(random(-450,450),0,250*i+random(-20,20)+300,250,180,100,false,87, 87, 92,32, 32, 33,130, 130, 133));
	            boxes.push(newBox(random(-750,750),600,250*i+random(-20,20)+300,350,280,100,true,87, 87, 92,32, 32, 33,130, 130, 133));
	            fill(87, 87, 92);
	            fill(32, 32, 33);
	            fill(130, 130, 133);
	        }
	        deathStar = newDeathStar(0,0,800);
	    } else if (deathStar.z > 50) {
	        background(0, 0, 0);
	        if (timer % 30 === 0) {
	            thetaMove = random(-2,2);
	        }
	        theta += thetaMove;
	        //debug(theta);
	        pushMatrix();
	        eyeX = 0;
	        eyeY = 0;
	        translate(200,200);
	        rotate(theta);
	        deathStar.findPosition();
	        deathStar.drawIt();
	        deathStar.moveIt();
	        popMatrix();
	        eyeX = 200;
	        eyeY = 200;
	        for (var i = 0; i < rocks.length; i++) {
	            rocks[i].findPosition();
	            rocks[i].drawIt(theta);
	            rocks[i].moveIt();
	            if (rocks[i].z < 50) {
	                rocks.splice(i,1);
	            }
	        }
	    } else {
	        background(0, 0, 0);
	        fill(57, 58, 59);
	        rect(0,xyz2xy(0,-60,3000)[1],400,200);
	        rect(0,0,400,xyz2xy(0,1000,3000)[1]);
	        for (var i = 0; i < boxes.length; i++) {
	            boxes[i].findPos();
	            boxes[i].drawIt(false);
	            boxes[i].moveIt();
	            if (boxes[i].pos[0][2] < 20) {
	                boxes.splice(i,1);
	            }
	        }
	    }
	    timer++;
	    if (timer > 1500 || mouseIsClicked) {
	        timer = 0;
	        scene++;
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
		if (scene === 2 || scene === 5) {
	        drawLightspeed();
	    } else if (scene === 0) {
	        drawMenu();
	    } else if (scene === 1) {
	        if (stopped === 0) {
	            draws0();
	        } else if (stopped === 1) {
	            draws1();
	        }
	    } else if (scene === 3) {
	        if (planet1 === 0) {
	            drawp10();
	        } else if (planet1 === 1) {
	            drawp11();
	        } else if (planet1 === 2) {
	            drawp12();
	        }
	    } else if (scene === 4) {
	        if (transmission === 0) {
	            drawt0();
	        }
	    } else if (scene === 6) {
	        if (planet2 === 0) {
	            drawp20();
	        }
	        if (planet2 === 1) {
	            drawp21();
	        }
	    } else {
	        background(0, 0, 0);
	        fill(255, 255, 255);
	        textSize(25);
	        text("Thank you for flying Star Tours!\n                Buh-bye!",29,50);
	    }
		
		keyIsReleased = false;
		mouseIsClicked = false;
	};  

	
}
