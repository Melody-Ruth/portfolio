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
	var tan = function(degrees) {
		return Math.tan(degrees*Math.PI/180);
	};
	var atan = function(tangent) {
		return Math.atan(tangent)*180/Math.PI;
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
	
	
	var width = 1000;//canvas width
	var height = 600;//canvas height
	p.setup = function() {
		size(width,height);//size of the canvas
		noFill();
		noStroke();
		background(0,180,230); //pick a color
		frameRate(60);
	};
	

	//Definitions here
	var circlePos = [300,300];
	var circleR = 200;
	
	//var ballR = 15;
	var theta = 45;
	//var ballPos = [circlePos[0]+(circleR-ballR)*cos(theta),circlePos[1]+(circleR-ballR)*sin(theta)];
	
	var ball = {};
	ball.p = [370,370];//position
	ball.v = [0,0];//velocity
	ball.m = 20;//"mass"
	ball.r = 18;//radius
	ball.e = 0.75;//elasticity (between 0 and 1)
	ball.resting = false;
	ball.againstWall = false;
	ball.a = [0,0.1633];
	ball.right = false;
	ball.left = false;
	ball.drawIt = function() {
		fill(255,0,0);
		ellipse(this.p[0],this.p[1],this.r*2,this.r*2);
	};
	ball.inAirMove = function() {
		//If the ball is in the air, change a accordingly
		if (!ball.resting) {
			//acceleration assignment
			ball.a[1] = 0.1633;
			ball.a[0] = 0;
			if (keyIsPressed && keyCode === RIGHT) {
				ball.a[0] = 0.2;
				ball.right = true;
			} else {
				ball.right = false;
			}
			if (keyIsPressed && keyCode === LEFT) {
				ball.a[0] = -0.2;
				ball.left = true;
			} else {
				ball.left = false;
			}
		}
		//velocity += acceleration
		//Always a good idea
		ball.v[0] += ball.a[0];
		ball.v[1] += ball.a[1];
	};
	ball.move = function() {
		//Jump
		if (ball.resting && keyIsPressed && keyCode == UP) {
			ball.v[1] -= 5;
			ball.resting = false;
		}
		//Move the ball's position.
		ball.p[0] += ball.v[0];
		ball.p[1] += ball.v[1];
	};
	
	var newCircleEnclosure = function(x,y,r) {
		var myCircle = {};
		myCircle.p = [x,y];
		myCircle.r = r;
		myCircle.theta = 0;
		myCircle.drawIt = function() {
			fill(255,255,255);
			ellipse(myCircle.p[0],myCircle.p[1],myCircle.r*2,myCircle.r*2);
		};
		myCircle.collide = function() {
			this.theta = atan((ball.p[1]-this.p[1])/(ball.p[0]-this.p[0]));
			var m = -1/tan(this.theta);
			var b = ball.p[1]-ball.p[0]*m;
			if (sqrt(sq(ball.p[0]-this.p[0])+sq(ball.p[1]-this.p[1])) > this.r-ball.r && ball.p[1] > this.p[1]) {
				var unitRamp = [1/sqrt(1+sq(m)),m/sqrt(1+sq(m))];
				var wallTheta = atan(m);
					//Have to adjust because of the radius of the ball.
					ball.resting = true;//The ball is on a ramp
					//Dot product of the ball's velocity and a unit vector in the direction of the ramp i.e. How much is the ball going in a direction parallel to the ramp?
					var parallelVelocity = ball.v[0] * unitRamp[0] + ball.v[1] * unitRamp[1];
					//The rest of the magnitude must come from the perpendicular component
					var perpendicularVelocity = -sqrt(sq(ball.v[0])+sq(ball.v[1])-sq(parallelVelocity));
					ball.v[0] = parallelVelocity*unitRamp[0] - perpendicularVelocity*unitRamp[1];
					ball.v[1] = parallelVelocity*unitRamp[1] + perpendicularVelocity*unitRamp[0];
					ball.v[0] *= ball.e;
					ball.v[1] *= ball.e;
					var aTotal = 0.1633*sin(wallTheta);
					if (ball.right) {
						aTotal += 0.1*ball.m*cos(wallTheta);
					}
					if (ball.left) {
						aTotal -= 0.1*ball.m*cos(wallTheta);
					}
					ball.a[0] = aTotal*unitRamp[0];
					ball.a[1] = aTotal*unitRamp[1];
			}
			if (sqrt(sq(ball.p[0]-this.p[0])+sq(ball.p[1]-this.p[1])) > this.r-ball.r && ball.p[1] < this.p[1]) {
				var unitRamp = [1/sqrt(1+sq(m)),m/sqrt(1+sq(m))];
				var wallTheta = atan(m);
					//Have to adjust because of the radius of the ball.
					//ball.resting = true;//The ball is on a ramp
					//Dot product of the ball's velocity and a unit vector in the direction of the ramp i.e. How much is the ball going in a direction parallel to the ramp?
					var parallelVelocity = ball.v[0] * unitRamp[0] + ball.v[1] * unitRamp[1];
					//The rest of the magnitude must come from the perpendicular component
					var perpendicularVelocity = sqrt(sq(ball.v[0])+sq(ball.v[1])-sq(parallelVelocity));
					ball.v[0] = parallelVelocity*unitRamp[0] - perpendicularVelocity*unitRamp[1];
					ball.v[1] = parallelVelocity*unitRamp[1] + perpendicularVelocity*unitRamp[0];
					ball.v[0] *= ball.e;
					ball.v[1] *= ball.e;
					var aTotal = 0.1633*sin(wallTheta);
					if (ball.right) {
						aTotal += 0.1*ball.m*cos(wallTheta);
					}
					if (ball.left) {
						aTotal -= 0.1*ball.m*cos(wallTheta);
					}
					ball.a[0] = aTotal*unitRamp[0];
					ball.a[1] = aTotal*unitRamp[1];
			}
		};
		return myCircle;
	};
	
	var newReverseCircle = function(x,y,r) {
		var myCircle = {};
		myCircle.p = [x,y];
		myCircle.r = r;
		myCircle.theta = 0;
		myCircle.drawIt = function() {
			fill(2, 130, 194);
			ellipse(myCircle.p[0],myCircle.p[1],myCircle.r*2,myCircle.r*2);
		};
		myCircle.collide = function() {
			this.theta = atan((ball.p[1]-this.p[1])/(ball.p[0]-this.p[0]));
			var m = -1/tan(this.theta);
			var b = ball.p[1]-ball.p[0]*m;
			if (sqrt(sq(ball.p[0]-this.p[0])+sq(ball.p[1]-this.p[1])) < this.r+ball.r && ball.p[1] > this.p[1]) {
				var unitRamp = [1/sqrt(1+sq(m)),m/sqrt(1+sq(m))];
				var wallTheta = atan(m);
					//Have to adjust because of the radius of the ball.
					//ball.resting = true;//The ball is on a ramp
					//Dot product of the ball's velocity and a unit vector in the direction of the ramp i.e. How much is the ball going in a direction parallel to the ramp?
					var parallelVelocity = ball.v[0] * unitRamp[0] + ball.v[1] * unitRamp[1];
					//The rest of the magnitude must come from the perpendicular component
					var perpendicularVelocity = sqrt(sq(ball.v[0])+sq(ball.v[1])-sq(parallelVelocity));
					ball.v[0] = parallelVelocity*unitRamp[0] - perpendicularVelocity*unitRamp[1];
					ball.v[1] = parallelVelocity*unitRamp[1] + perpendicularVelocity*unitRamp[0];
					ball.v[0] *= ball.e;
					ball.v[1] *= ball.e;
					var aTotal = 0.1633*sin(wallTheta);
					if (ball.right) {
						aTotal += 0.1*ball.m*cos(wallTheta);
					}
					if (ball.left) {
						aTotal -= 0.1*ball.m*cos(wallTheta);
					}
					ball.a[0] = aTotal*unitRamp[0];
					ball.a[1] = aTotal*unitRamp[1];
			}
			if (sqrt(sq(ball.p[0]-this.p[0])+sq(ball.p[1]-this.p[1])) < this.r+ball.r && ball.p[1] < this.p[1]) {
				var unitRamp = [1/sqrt(1+sq(m)),m/sqrt(1+sq(m))];
				var wallTheta = atan(m);
					//Have to adjust because of the radius of the ball.
					ball.resting = true;//The ball is on a ramp
					//Dot product of the ball's velocity and a unit vector in the direction of the ramp i.e. How much is the ball going in a direction parallel to the ramp?
					var parallelVelocity = ball.v[0] * unitRamp[0] + ball.v[1] * unitRamp[1];
					//The rest of the magnitude must come from the perpendicular component
					var perpendicularVelocity = -sqrt(sq(ball.v[0])+sq(ball.v[1])-sq(parallelVelocity));
					ball.v[0] = parallelVelocity*unitRamp[0] - perpendicularVelocity*unitRamp[1];
					ball.v[1] = parallelVelocity*unitRamp[1] + perpendicularVelocity*unitRamp[0];
					ball.v[0] *= ball.e;
					ball.v[1] *= ball.e;
					var aTotal = 0.1633*sin(wallTheta);
					if (ball.right) {
						aTotal += 0.1*ball.m*cos(wallTheta);
					}
					if (ball.left) {
						aTotal -= 0.1*ball.m*cos(wallTheta);
					}
					ball.a[0] = aTotal*unitRamp[0];
					ball.a[1] = aTotal*unitRamp[1];
			}
		};
		return myCircle;
	};
	
	
	var testCircle = newCircleEnclosure(300,300,200);
	
	var testCircle2 = newReverseCircle(300,300,80);
	
	p.draw = function() {
		keyCode = p.keyCode;
		mouseButton = p.mouseButton;
		pmouseX = p.pmouseX;
		pmouseY = p.pmouseY;
		mouseX = p.mouseX;
		mouseY = p.mouseY;
		
		//Put code here
		background(2, 130, 194);
		testCircle.drawIt();
		testCircle2.drawIt();
		
		ball.drawIt();
		ball.inAirMove();
		
		ball.resting = false;
		testCircle.collide();
		testCircle2.collide();
		ball.move();
		
		keyIsReleased = false;
		mouseIsClicked = false;
	};  

	
}
