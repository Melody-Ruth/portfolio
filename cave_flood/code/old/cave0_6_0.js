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
	
	
	var width = 600;//canvas width
	var height = 600;//canvas height
	p.setup = function() {
		size(width,height);//size of the canvas
		noFill();
		noStroke();
		background(0,180,230); //pick a color
		frameRate(60);
	};
	

	//Definitions here
	//var circlePos = [300,300];
	//var circleR = 200;
	
	//var ballR = 15;
	//var theta = 45;
	//var ballPos = [circlePos[0]+(circleR-ballR)*cos(theta),circlePos[1]+(circleR-ballR)*sin(theta)];
	
	
	/* @pjs preload="test_image.png","smiley.png","crystal.png"; */
	var testing = loadImage("test_image.png");
	var smiley = loadImage("smiley.png");
	var crystal = loadImage("crystal.png");
	var crystalGroup = loadImage("crystal_group.png");
	
	var g = 0.1633;
	var xTranslate = 0;
	var yTranslate = 0;
	var xTranslateShifter = 0;
	var yTranslateShifter = 0;
	
	var ball = {};
	ball.p = [370,430];//position
	ball.v = [0,0];//velocity
	ball.m = 20;//"mass"
	ball.r = 18;//radius
	ball.e = 0.7;//elasticity (between 0 and 1)
	ball.e2 = 0.98;//parallel elasticity
	ball.resting = false;
	ball.inPassage = false;
	ball.a = [0,g];
	ball.right = false;
	ball.left = false;
	ball.rightForce = 0.05;
	ball.leftForce = 0.05;
	ball.score = 0;
	ball.drawIt = function() {
		fill(192, 142, 236);
		ellipse(this.p[0],this.p[1],this.r*2,this.r*2);
	};
	ball.inAirMove = function() {
		//If the ball is in the air, change a accordingly
		if (!this.resting) {
			//acceleration assignment
			this.a[1] = g;
			this.a[0] = 0;
			if (keyIsPressed && keyCode === RIGHT) {
				this.a[0] = 0.2;
				this.right = true;
			} else {
				this.right = false;
			}
			if (keyIsPressed && keyCode === LEFT) {
				this.a[0] = -0.2;
				this.left = true;
			} else {
				this.left = false;
			}
		}
		//velocity += acceleration
		//Always a good idea
		this.v[0] += this.a[0];
		this.v[1] += this.a[1];
	};
	ball.move = function() {
		//Jump
		if (this.resting && keyIsPressed && keyCode == UP) {
			this.v[1] -= 5;
			this.resting = false;
		}
		//Move the ball's position.
		this.p[0] += this.v[0];
		this.p[1] += this.v[1];
	};
	
	var newCircleEnclosure = function(x,y,r) {
		var myCircle = {};
		myCircle.p = [x,y];
		myCircle.r = r;
		myCircle.theta = 0;
		myCircle.drawIt = function() {
			fill(71, 40, 24);
			ellipse(myCircle.p[0],myCircle.p[1],myCircle.r*2,myCircle.r*2);
		};
		myCircle.collide = function() {
			this.on = false;
			/*if (sqrt(sq(ball.p[0]-this.p[0])+sq(ball.p[1]-this.p[1])) > this.r-ball.r+ball.r/2) {
				println("hi");
				ball.p[0] -= this.p[0];
				ball.p[1] -= this.p[1];
				var currentR = sqrt(sq(ball.p[0])+sq(ball.p[1]));
				ball.p[0] *= (this.r-ball.r)/currentR;
				ball.p[1] *= (this.r-ball.r)/currentR;
				ball.p[0] += this.p[0];
				ball.p[1] += this.p[1];
			}*/
			this.theta = atan((ball.p[1]-this.p[1])/(ball.p[0]-this.p[0]));
			var m = -1/tan(this.theta);
			var b = ball.p[1]-ball.p[0]*m;
			if (sqrt(sq(ball.p[0]-this.p[0])+sq(ball.p[1]-this.p[1])) > this.r-ball.r && sqrt(sq(ball.p[0]-this.p[0])+sq(ball.p[1]-this.p[1])) < this.r-ball.r+20) {
				//println(sqrt(sq(ball.v[0])+sq(ball.v[1])));
				this.on = true;
			}
			if (sqrt(sq(ball.p[0]-this.p[0])+sq(ball.p[1]-this.p[1])) > this.r-ball.r && sqrt(sq(ball.p[0]-this.p[0])+sq(ball.p[1]-this.p[1])) < this.r-ball.r+20 && ball.p[1] > this.p[1]) {
				var unitRamp = [1/sqrt(1+sq(m)),m/sqrt(1+sq(m))];
				var wallTheta = atan(m);
				//Have to adjust because of the radius of the ball.
				ball.resting = true;//The ball is on a ramp
				//Dot product of the ball's velocity and a unit vector in the direction of the ramp i.e. How much is the ball going in a direction parallel to the ramp?
				var parallelVelocity = ball.e2*(ball.v[0] * unitRamp[0] + ball.v[1] * unitRamp[1]);
				//The rest of the magnitude must come from the perpendicular component
				var perpendicularVelocity = -ball.e*sqrt(sq(ball.v[0])+sq(ball.v[1])-sq(parallelVelocity));
				ball.v[0] = parallelVelocity*unitRamp[0] - perpendicularVelocity*unitRamp[1];
				ball.v[1] = parallelVelocity*unitRamp[1] + perpendicularVelocity*unitRamp[0];
				//println(ball.v[1]);
				//ball.v[0] *= ball.e;
				//ball.v[1] *= ball.e;
				var aTotal = g*sin(wallTheta);
				if (ball.right) {
					aTotal += ball.rightForce*ball.m*cos(wallTheta);
				}
				if (ball.left) {
					aTotal -= ball.leftForce*ball.m*cos(wallTheta);
				}
				ball.a[0] = aTotal*unitRamp[0];
				ball.a[1] = aTotal*unitRamp[1];
			}
			if (sqrt(sq(ball.p[0]-this.p[0])+sq(ball.p[1]-this.p[1])) > this.r-ball.r && sqrt(sq(ball.p[0]-this.p[0])+sq(ball.p[1]-this.p[1])) < this.r-ball.r+20 && ball.p[1] < this.p[1]) {
				var unitRamp = [1/sqrt(1+sq(m)),m/sqrt(1+sq(m))];
				var wallTheta = atan(m);
				//Have to adjust because of the radius of the ball.
				//ball.resting = true;//The ball is on a ramp
				//Dot product of the ball's velocity and a unit vector in the direction of the ramp i.e. How much is the ball going in a direction parallel to the ramp?
				var parallelVelocity = ball.e2*(ball.v[0] * unitRamp[0] + ball.v[1] * unitRamp[1]);
				//The rest of the magnitude must come from the perpendicular component
				var perpendicularVelocity = ball.e*sqrt(sq(ball.v[0])+sq(ball.v[1])-sq(parallelVelocity));
				ball.v[0] = parallelVelocity*unitRamp[0] - perpendicularVelocity*unitRamp[1];
				ball.v[1] = parallelVelocity*unitRamp[1] + perpendicularVelocity*unitRamp[0];
				//ball.v[0] *= ball.e;
				//ball.v[1] *= ball.e;
				var aTotal = g*sin(wallTheta);
				if (ball.right) {
					aTotal += ball.rightForce*ball.m*cos(wallTheta);
				}
				if (ball.left) {
					aTotal -= ball.leftForce*ball.m*cos(wallTheta);
				}
				ball.a[0] = aTotal*unitRamp[0];
				ball.a[1] = aTotal*unitRamp[1];
			}
			if (sqrt(sq(ball.p[0]-this.p[0])+sq(ball.p[1]-this.p[1])) > this.r-ball.r) {
				//println(" "+sqrt(sq(ball.v[0])+sq(ball.v[1])));
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
			fill(99, 56, 35);
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
					var parallelVelocity = ball.e2*(ball.v[0] * unitRamp[0] + ball.v[1] * unitRamp[1]);
					//The rest of the magnitude must come from the perpendicular component
					var perpendicularVelocity = ball.e*sqrt(sq(ball.v[0])+sq(ball.v[1])-sq(parallelVelocity));
					ball.v[0] = parallelVelocity*unitRamp[0] - perpendicularVelocity*unitRamp[1];
					ball.v[1] = parallelVelocity*unitRamp[1] + perpendicularVelocity*unitRamp[0];
					//ball.v[0] *= ball.e;
					//ball.v[1] *= ball.e;
					var aTotal = g*sin(wallTheta);
					if (ball.right) {
						aTotal += ball.rightForce*ball.m*cos(wallTheta);
					}
					if (ball.left) {
						aTotal -= ball.leftForce*ball.m*cos(wallTheta);
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
					var parallelVelocity = ball.e2*(ball.v[0] * unitRamp[0] + ball.v[1] * unitRamp[1]);
					//The rest of the magnitude must come from the perpendicular component
					var perpendicularVelocity = -sqrt(sq(ball.v[0])+sq(ball.v[1])-sq(parallelVelocity));
					ball.v[0] = parallelVelocity*unitRamp[0] - perpendicularVelocity*unitRamp[1];
					ball.v[1] = parallelVelocity*unitRamp[1] + perpendicularVelocity*unitRamp[0];
					ball.v[0] *= ball.e;
					ball.v[1] *= ball.e;
					var aTotal = g*sin(wallTheta);
					if (ball.right) {
						aTotal += ball.rightForce*ball.m*cos(wallTheta);
					}
					if (ball.left) {
						aTotal -= ball.leftForce*ball.m*cos(wallTheta);
					}
					ball.a[0] = aTotal*unitRamp[0];
					ball.a[1] = aTotal*unitRamp[1];
			}
		};
		return myCircle;
	};
	
	var newCapsuleEnclosure = function(x,y,w,h) {
		var capsule = {};
		capsule.x = x;
		capsule.y = y;
		capsule.w = w;
		capsule.h = h;
		capsule.r = h/2;
		capsule.p1 = [x,y+capsule.r];
		capsule.p2 = [x+w,y+capsule.r];
		capsule.drawIt = function() {
			fill(71, 40, 24);
			rect(this.x,this.y,this.w,this.h);
			arc(this.p1[0],this.p1[1],this.r*2,this.r*2,90,270);
			arc(this.p2[0],this.p2[1],this.r*2,this.r*2,-90,90);
		};
		capsule.collide = function() {
			/*if (sqrt(sq(ball.p[0]-this.p1[0])+sq(ball.p[1]-this.p1[1])) > this.r-ball.r+ball.r/2 && ball.p[0]-ball.r < this.x) {
				println("hi1");
				ball.p[0] -= this.p1[0];
				ball.p[1] -= this.p1[1];
				var currentR = sqrt(sq(ball.p[0])+sq(ball.p[1]));
				ball.p[0] *= (this.r-ball.r)/currentR;
				ball.p[1] *= (this.r-ball.r)/currentR;
				ball.p[0] += this.p1[0];
				ball.p[1] += this.p1[1];
			} else if (sqrt(sq(ball.p[0]-this.p2[0])+sq(ball.p[1]-this.p2[1])) > this.r-ball.r+ball.r/2 && ball.p[0]+ball.r > this.x+this.w) {
				println("hi2");
				ball.p[0] -= this.p2[0];
				ball.p[1] -= this.p2[1];
				var currentR = sqrt(sq(ball.p[0])+sq(ball.p[1]));
				ball.p[0] *= (this.r-ball.r)/currentR;
				ball.p[1] *= (this.r-ball.r)/currentR;
				ball.p[0] += this.p2[0];
				ball.p[1] += this.p2[1];
			} else if (ball.p[1]+ball.r >= this.y+this.h+ball.r/2 && ball.p[0] > this.x && ball.p[0] < this.x+this.w) {
				println("hi3");
				ball.p[1] = this.y+this.h-ball.r;
			} else if (ball.p[1]-ball.r <= this.y-ball.r/2 && ball.p[0] > this.x && ball.p[0] < this.x+this.w) {
				println("hi4");
				ball.p[1] = this.y+ball.r;
			}*/
			if (ball.p[1]+ball.r >= this.y+this.h && ball.p[1]+ball.r <= this.y+this.h+20 && ball.p[0] > this.x && ball.p[0] < this.x+this.w) {//bouncing off floor
				this.m = 0;
				this.b = this.y+this.h;
				ball.resting = true;
				var unitRamp = [1,0];
				var parallelVelocity = ball.e2*ball.v[0];
				var perpendicularVelocity = -ball.e*abs(ball.v[1]);
				ball.v[0] = parallelVelocity*unitRamp[0] - perpendicularVelocity*unitRamp[1];
				ball.v[1] = parallelVelocity*unitRamp[1] + perpendicularVelocity*unitRamp[0];
				//ball.v[0] *= ball.e2;
				//ball.v[1] *= ball.e;
				var theta = atan(this.m);
				var aTotal = g*sin(theta);
				if (ball.right) {
					aTotal += ball.rightForce*ball.m*cos(theta);
				}
				if (ball.left) {
					aTotal -= ball.leftForce*ball.m*cos(theta);
				}
				ball.a[0] = aTotal*unitRamp[0];
				ball.a[1] = aTotal*unitRamp[1];
			} else if (ball.p[1]-ball.r <= this.y && ball.p[1]-ball.r >= this.y-20 && ball.p[0] > this.x && ball.p[0] < this.x+this.w) {//bouncing off the ceiling
				this.m = 0;
				//ball.resting = true;
				var unitRamp = [1,0];
				var parallelVelocity = ball.e2*ball.v[0];
				var perpendicularVelocity = ball.e*abs(ball.v[1]);
				ball.v[0] = parallelVelocity*unitRamp[0] - perpendicularVelocity*unitRamp[1];
				ball.v[1] = parallelVelocity*unitRamp[1] + perpendicularVelocity*unitRamp[0];
				//ball.v[0] *= ball.e2;
				//ball.v[1] *= ball.e;
				var theta = atan(this.m);
				var aTotal = g*sin(theta);
				if (ball.right) {
					aTotal += ball.rightForce*ball.m*cos(theta);
				}
				if (ball.left) {
					aTotal -= ball.leftForce*ball.m*cos(theta);
				}
				ball.a[0] = aTotal*unitRamp[0];
				ball.a[1] = aTotal*unitRamp[1];
			} else if (ball.p[0]-ball.r < this.x) {//Bouncing off circle 1
				this.theta = atan((ball.p[1]-this.p1[1])/(ball.p[0]-this.p1[0]));
				var m = -1/tan(this.theta);
				var b = ball.p[1]-ball.p[0]*m;
				if (sqrt(sq(ball.p[0]-this.p1[0])+sq(ball.p[1]-this.p1[1])) > this.r-ball.r && sqrt(sq(ball.p[0]-this.p1[0])+sq(ball.p[1]-this.p1[1])) < this.r-ball.r+20 && ball.p[1] > this.p1[1]) {
					var unitRamp = [1/sqrt(1+sq(m)),m/sqrt(1+sq(m))];
					var wallTheta = atan(m);
						//Have to adjust because of the radius of the ball.
						ball.resting = true;//The ball is on a ramp
						//Dot product of the ball's velocity and a unit vector in the direction of the ramp i.e. How much is the ball going in a direction parallel to the ramp?
						var parallelVelocity = ball.e2*(ball.v[0] * unitRamp[0] + ball.v[1] * unitRamp[1]);
						//The rest of the magnitude must come from the perpendicular component
						var perpendicularVelocity = -ball.e*sqrt(sq(ball.v[0])+sq(ball.v[1])-sq(parallelVelocity));
						ball.v[0] = parallelVelocity*unitRamp[0] - perpendicularVelocity*unitRamp[1];
						ball.v[1] = parallelVelocity*unitRamp[1] + perpendicularVelocity*unitRamp[0];
						//ball.v[0] *= ball.e;
						//ball.v[1] *= ball.e;
						var aTotal = g*sin(wallTheta);
						if (ball.right) {
							aTotal += ball.rightForce*ball.m*cos(wallTheta);
						}
						if (ball.left) {
							aTotal -= ball.leftForce*ball.m*cos(wallTheta);
						}
						ball.a[0] = aTotal*unitRamp[0];
						ball.a[1] = aTotal*unitRamp[1];
				} else if (sqrt(sq(ball.p[0]-this.p1[0])+sq(ball.p[1]-this.p1[1])) > this.r-ball.r && sqrt(sq(ball.p[0]-this.p1[0])+sq(ball.p[1]-this.p1[1])) < this.r-ball.r+20 && ball.p[1] < this.p1[1]) {
					var unitRamp = [1/sqrt(1+sq(m)),m/sqrt(1+sq(m))];
					var wallTheta = atan(m);
						//Have to adjust because of the radius of the ball.
						//ball.resting = true;//The ball is on a ramp
						//Dot product of the ball's velocity and a unit vector in the direction of the ramp i.e. How much is the ball going in a direction parallel to the ramp?
						var parallelVelocity = ball.e2*(ball.v[0] * unitRamp[0] + ball.v[1] * unitRamp[1]);
						//The rest of the magnitude must come from the perpendicular component
						var perpendicularVelocity = ball.e*sqrt(sq(ball.v[0])+sq(ball.v[1])-sq(parallelVelocity));
						ball.v[0] = parallelVelocity*unitRamp[0] - perpendicularVelocity*unitRamp[1];
						ball.v[1] = parallelVelocity*unitRamp[1] + perpendicularVelocity*unitRamp[0];
						//ball.v[0] *= ball.e;
						//ball.v[1] *= ball.e;
						var aTotal = g*sin(wallTheta);
						if (ball.right) {
							aTotal += ball.rightForce*ball.m*cos(wallTheta);
						}
						if (ball.left) {
							aTotal -= ball.leftForce*ball.m*cos(wallTheta);
						}
						ball.a[0] = aTotal*unitRamp[0];
						ball.a[1] = aTotal*unitRamp[1];
				}
			} else if (ball.p[0]+ball.r > this.x+this.w) {//Bouncing off circle 2
				this.theta = atan((ball.p[1]-this.p2[1])/(ball.p[0]-this.p2[0]));
				var m = -1/tan(this.theta);
				var b = ball.p[1]-ball.p[0]*m;
				/*stroke(0);
				strokeWeight(2);
				line(0,b,width,width*m+b);
				noStroke();
				if (sqrt(sq(ball.p[0]-this.p2[0])+sq(ball.p[1]-this.p2[1])) > this.r-ball.r) {
					//println(sqrt(sq(ball.v[0])+sq(ball.v[1])));
				}*/
				if (sqrt(sq(ball.p[0]-this.p2[0])+sq(ball.p[1]-this.p2[1])) > this.r-ball.r && sqrt(sq(ball.p[0]-this.p2[0])+sq(ball.p[1]-this.p2[1])) < this.r-ball.r+20 && ball.p[1] > this.p2[1]) {
					var unitRamp = [1/sqrt(1+sq(m)),m/sqrt(1+sq(m))];
					var wallTheta = atan(m);
						//Have to adjust because of the radius of the ball.
						ball.resting = true;//The ball is on a ramp
						//Dot product of the ball's velocity and a unit vector in the direction of the ramp i.e. How much is the ball going in a direction parallel to the ramp?
						var parallelVelocity = ball.e2*(ball.v[0] * unitRamp[0] + ball.v[1] * unitRamp[1]);
						//The rest of the magnitude must come from the perpendicular component
						var perpendicularVelocity = -ball.e*sqrt(sq(ball.v[0])+sq(ball.v[1])-sq(parallelVelocity));
						ball.v[0] = parallelVelocity*unitRamp[0] - perpendicularVelocity*unitRamp[1];
						ball.v[1] = parallelVelocity*unitRamp[1] + perpendicularVelocity*unitRamp[0];
						//println(ball.v[1]);
						//ball.v[0] *= ball.e;
						//ball.v[1] *= ball.e;
						var aTotal = g*sin(wallTheta);
						if (ball.right) {
							aTotal += ball.rightForce*ball.m*cos(wallTheta);
						}
						if (ball.left) {
							aTotal -= ball.leftForce*ball.m*cos(wallTheta);
						}
						ball.a[0] = aTotal*unitRamp[0];
						ball.a[1] = aTotal*unitRamp[1];
				}
				if (sqrt(sq(ball.p[0]-this.p2[0])+sq(ball.p[1]-this.p2[1])) > this.r-ball.r && sqrt(sq(ball.p[0]-this.p2[0])+sq(ball.p[1]-this.p2[1])) < this.r-ball.r+20 && ball.p[1] < this.p2[1]) {
					var unitRamp = [1/sqrt(1+sq(m)),m/sqrt(1+sq(m))];
					var wallTheta = atan(m);
						//Have to adjust because of the radius of the ball.
						//ball.resting = true;//The ball is on a ramp
						//Dot product of the ball's velocity and a unit vector in the direction of the ramp i.e. How much is the ball going in a direction parallel to the ramp?
						var parallelVelocity = ball.e2*(ball.v[0] * unitRamp[0] + ball.v[1] * unitRamp[1]);
						//The rest of the magnitude must come from the perpendicular component
						var perpendicularVelocity = ball.e*sqrt(sq(ball.v[0])+sq(ball.v[1])-sq(parallelVelocity));
						ball.v[0] = parallelVelocity*unitRamp[0] - perpendicularVelocity*unitRamp[1];
						ball.v[1] = parallelVelocity*unitRamp[1] + perpendicularVelocity*unitRamp[0];
						//ball.v[0] *= ball.e;
						//ball.v[1] *= ball.e;
						var aTotal = g*sin(wallTheta);
						if (ball.right) {
							aTotal += ball.rightForce*ball.m*cos(wallTheta);
						}
						if (ball.left) {
							aTotal -= ball.leftForce*ball.m*cos(wallTheta);
						}
						ball.a[0] = aTotal*unitRamp[0];
						ball.a[1] = aTotal*unitRamp[1];
				}
				if (sqrt(sq(ball.p[0]-this.p2[0])+sq(ball.p[1]-this.p2[1])) > this.r-ball.r) {
					//println(" "+sqrt(sq(ball.v[0])+sq(ball.v[1])));
				}
			}
		};
		return capsule;
	};
	
	var newReverseCapsule = function(x,y,w,h) {
		var capsule = {};
		capsule.x = x;
		capsule.y = y;
		capsule.w = w;
		capsule.h = h;
		capsule.r = h/2;
		capsule.p1 = [x,y+capsule.r];
		capsule.p2 = [x+w,y+capsule.r];
		capsule.drawIt = function() {
			fill(99, 56, 35);
			rect(this.x,this.y,this.w,this.h);
			arc(this.p1[0],this.p1[1],this.r*2,this.r*2,90,270);
			arc(this.p2[0],this.p2[1],this.r*2,this.r*2,-90,90);
		};
		capsule.collide = function() {
			/*if (sqrt(sq(ball.p[0]-this.p1[0])+sq(ball.p[1]-this.p1[1])) > this.r-ball.r+ball.r/2 && ball.p[0]-ball.r < this.x) {
				println("hi1");
				ball.p[0] -= this.p1[0];
				ball.p[1] -= this.p1[1];
				var currentR = sqrt(sq(ball.p[0])+sq(ball.p[1]));
				ball.p[0] *= (this.r-ball.r)/currentR;
				ball.p[1] *= (this.r-ball.r)/currentR;
				ball.p[0] += this.p1[0];
				ball.p[1] += this.p1[1];
			} else if (sqrt(sq(ball.p[0]-this.p2[0])+sq(ball.p[1]-this.p2[1])) > this.r-ball.r+ball.r/2 && ball.p[0]+ball.r > this.x+this.w) {
				println("hi2");
				ball.p[0] -= this.p2[0];
				ball.p[1] -= this.p2[1];
				var currentR = sqrt(sq(ball.p[0])+sq(ball.p[1]));
				ball.p[0] *= (this.r-ball.r)/currentR;
				ball.p[1] *= (this.r-ball.r)/currentR;
				ball.p[0] += this.p2[0];
				ball.p[1] += this.p2[1];
			} else if (ball.p[1]+ball.r >= this.y+this.h+ball.r/2 && ball.p[0] > this.x && ball.p[0] < this.x+this.w) {
				println("hi3");
				ball.p[1] = this.y+this.h-ball.r;
			} else if (ball.p[1]-ball.r <= this.y-ball.r/2 && ball.p[0] > this.x && ball.p[0] < this.x+this.w) {
				println("hi4");
				ball.p[1] = this.y+ball.r;
			}*/
			if (ball.p[1]-ball.r <= this.y+this.h && ball.p[1]-ball.r >= this.y+this.h/2 && ball.p[0] > this.x && ball.p[0] < this.x+this.w) {//bouncing off floor
				this.m = 0;
				this.b = this.y+this.h;
				//ball.resting = true;
				var unitRamp = [1,0];
				var parallelVelocity = ball.e2*ball.v[0];
				var perpendicularVelocity = ball.e*abs(ball.v[1]);
				ball.v[0] = parallelVelocity*unitRamp[0] - perpendicularVelocity*unitRamp[1];
				ball.v[1] = parallelVelocity*unitRamp[1] + perpendicularVelocity*unitRamp[0];
				//ball.v[0] *= ball.e2;
				//ball.v[1] *= ball.e;
				var theta = atan(this.m);
				var aTotal = g*sin(theta);
				if (ball.right) {
					aTotal += ball.rightForce*ball.m*cos(theta);
				}
				if (ball.left) {
					aTotal -= ball.leftForce*ball.m*cos(theta);
				}
				ball.a[0] = aTotal*unitRamp[0];
				ball.a[1] = aTotal*unitRamp[1];
			} else if (ball.p[1]+ball.r >= this.y && ball.p[1]+ball.r <= this.y+this.h/2 && ball.p[0] > this.x && ball.p[0] < this.x+this.w) {//bouncing off the ceiling
				this.m = 0;
				ball.resting = true;
				var unitRamp = [1,0];
				var parallelVelocity = ball.e2*ball.v[0];
				var perpendicularVelocity = -ball.e*abs(ball.v[1]);
				ball.v[0] = parallelVelocity*unitRamp[0] - perpendicularVelocity*unitRamp[1];
				ball.v[1] = parallelVelocity*unitRamp[1] + perpendicularVelocity*unitRamp[0];
				//ball.v[0] *= ball.e2;
				//ball.v[1] *= ball.e;
				var theta = atan(this.m);
				var aTotal = g*sin(theta);
				if (ball.right) {
					aTotal += ball.rightForce*ball.m*cos(theta);
				}
				if (ball.left) {
					aTotal -= ball.leftForce*ball.m*cos(theta);
				}
				ball.a[0] = aTotal*unitRamp[0];
				ball.a[1] = aTotal*unitRamp[1];
			} else if (ball.p[0]-ball.r < this.x) {//Bouncing off circle 1
				this.theta = atan((ball.p[1]-this.p1[1])/(ball.p[0]-this.p1[0]));
				var m = -1/tan(this.theta);
				var b = ball.p[1]-ball.p[0]*m;
				if (sqrt(sq(ball.p[0]-this.p1[0])+sq(ball.p[1]-this.p1[1])) <= this.r+ball.r && ball.p[1] > this.p1[1]) {
					var unitRamp = [1/sqrt(1+sq(m)),m/sqrt(1+sq(m))];
					var wallTheta = atan(m);
						//Have to adjust because of the radius of the ball.
						//ball.resting = true;//The ball is on a ramp
						//Dot product of the ball's velocity and a unit vector in the direction of the ramp i.e. How much is the ball going in a direction parallel to the ramp?
						var parallelVelocity = ball.e2*(ball.v[0] * unitRamp[0] + ball.v[1] * unitRamp[1]);
						//The rest of the magnitude must come from the perpendicular component
						var perpendicularVelocity = ball.e*sqrt(sq(ball.v[0])+sq(ball.v[1])-sq(parallelVelocity));
						ball.v[0] = parallelVelocity*unitRamp[0] - perpendicularVelocity*unitRamp[1];
						ball.v[1] = parallelVelocity*unitRamp[1] + perpendicularVelocity*unitRamp[0];
						//ball.v[0] *= ball.e;
						//ball.v[1] *= ball.e;
						var aTotal = g*sin(wallTheta);
						if (ball.right) {
							aTotal += ball.rightForce*ball.m*cos(wallTheta);
						}
						if (ball.left) {
							aTotal -= ball.leftForce*ball.m*cos(wallTheta);
						}
						ball.a[0] = aTotal*unitRamp[0];
						ball.a[1] = aTotal*unitRamp[1];
				} else if (sqrt(sq(ball.p[0]-this.p1[0])+sq(ball.p[1]-this.p1[1])) <= this.r+ball.r && ball.p[1] < this.p1[1]) {
					var unitRamp = [1/sqrt(1+sq(m)),m/sqrt(1+sq(m))];
					var wallTheta = atan(m);
						//Have to adjust because of the radius of the ball.
						ball.resting = true;//The ball is on a ramp
						//Dot product of the ball's velocity and a unit vector in the direction of the ramp i.e. How much is the ball going in a direction parallel to the ramp?
						var parallelVelocity = ball.e2*(ball.v[0] * unitRamp[0] + ball.v[1] * unitRamp[1]);
						//The rest of the magnitude must come from the perpendicular component
						var perpendicularVelocity = -ball.e*sqrt(sq(ball.v[0])+sq(ball.v[1])-sq(parallelVelocity));
						ball.v[0] = parallelVelocity*unitRamp[0] - perpendicularVelocity*unitRamp[1];
						ball.v[1] = parallelVelocity*unitRamp[1] + perpendicularVelocity*unitRamp[0];
						//ball.v[0] *= ball.e;
						//ball.v[1] *= ball.e;
						var aTotal = g*sin(wallTheta);
						if (ball.right) {
							aTotal += ball.rightForce*ball.m*cos(wallTheta);
						}
						if (ball.left) {
							aTotal -= ball.leftForce*ball.m*cos(wallTheta);
						}
						ball.a[0] = aTotal*unitRamp[0];
						ball.a[1] = aTotal*unitRamp[1];
				}
			} else if (ball.p[0]+ball.r > this.x+this.w) {//Bouncing off circle 2
				this.theta = atan((ball.p[1]-this.p2[1])/(ball.p[0]-this.p2[0]));
				var m = -1/tan(this.theta);
				var b = ball.p[1]-ball.p[0]*m;
				/*stroke(0);
				strokeWeight(2);
				line(0,b,width,width*m+b);
				noStroke();
				if (sqrt(sq(ball.p[0]-this.p2[0])+sq(ball.p[1]-this.p2[1])) > this.r-ball.r) {
					//println(sqrt(sq(ball.v[0])+sq(ball.v[1])));
				}*/
				if (sqrt(sq(ball.p[0]-this.p2[0])+sq(ball.p[1]-this.p2[1])) <= this.r+ball.r && ball.p[1] > this.p2[1]) {
					var unitRamp = [1/sqrt(1+sq(m)),m/sqrt(1+sq(m))];
					var wallTheta = atan(m);
						//Have to adjust because of the radius of the ball.
						ball.resting = true;//The ball is on a ramp
						//Dot product of the ball's velocity and a unit vector in the direction of the ramp i.e. How much is the ball going in a direction parallel to the ramp?
						var parallelVelocity = ball.e2*(ball.v[0] * unitRamp[0] + ball.v[1] * unitRamp[1]);
						//The rest of the magnitude must come from the perpendicular component
						var perpendicularVelocity = ball.e*sqrt(sq(ball.v[0])+sq(ball.v[1])-sq(parallelVelocity));
						ball.v[0] = parallelVelocity*unitRamp[0] - perpendicularVelocity*unitRamp[1];
						ball.v[1] = parallelVelocity*unitRamp[1] + perpendicularVelocity*unitRamp[0];
						//println(ball.v[1]);
						//ball.v[0] *= ball.e;
						//ball.v[1] *= ball.e;
						var aTotal = g*sin(wallTheta);
						if (ball.right) {
							aTotal += ball.rightForce*ball.m*cos(wallTheta);
						}
						if (ball.left) {
							aTotal -= ball.leftForce*ball.m*cos(wallTheta);
						}
						ball.a[0] = aTotal*unitRamp[0];
						ball.a[1] = aTotal*unitRamp[1];
				}
				if (sqrt(sq(ball.p[0]-this.p2[0])+sq(ball.p[1]-this.p2[1])) <= this.r+ball.r && ball.p[1] < this.p2[1]) {
					var unitRamp = [1/sqrt(1+sq(m)),m/sqrt(1+sq(m))];
					var wallTheta = atan(m);
						//Have to adjust because of the radius of the ball.
						//ball.resting = true;//The ball is on a ramp
						//Dot product of the ball's velocity and a unit vector in the direction of the ramp i.e. How much is the ball going in a direction parallel to the ramp?
						var parallelVelocity = ball.e2*(ball.v[0] * unitRamp[0] + ball.v[1] * unitRamp[1]);
						//The rest of the magnitude must come from the perpendicular component
						var perpendicularVelocity = -ball.e*sqrt(sq(ball.v[0])+sq(ball.v[1])-sq(parallelVelocity));
						ball.v[0] = parallelVelocity*unitRamp[0] - perpendicularVelocity*unitRamp[1];
						ball.v[1] = parallelVelocity*unitRamp[1] + perpendicularVelocity*unitRamp[0];
						//ball.v[0] *= ball.e;
						//ball.v[1] *= ball.e;
						var aTotal = g*sin(wallTheta);
						if (ball.right) {
							aTotal += ball.rightForce*ball.m*cos(wallTheta);
						}
						if (ball.left) {
							aTotal -= ball.leftForce*ball.m*cos(wallTheta);
						}
						ball.a[0] = aTotal*unitRamp[0];
						ball.a[1] = aTotal*unitRamp[1];
				}
				if (sqrt(sq(ball.p[0]-this.p2[0])+sq(ball.p[1]-this.p2[1])) > this.r-ball.r) {
					//println(" "+sqrt(sq(ball.v[0])+sq(ball.v[1])));
				}
			}
		};
		return capsule;
	};
	
	var newPassage = function(x,y,w,h,left,right,up,down) {
		var passage = {};
		passage.x = x;
		passage.y = y;
		passage.w = w;
		passage.h = h;
		passage.left = left;
		passage.right = right;
		passage.up = up;
		passage.down = down;
		passage.drawIt = function() {
			fill(71, 40, 24);
			//stroke(255,0,0);
			strokeWeight(3);
			rect(this.x,this.y,this.w,this.h);
			noStroke();
		};
		passage.collide = function() {
			if (ball.p[0] > this.x && ball.p[0] < this.x+this.w && ball.p[1]+ball.r > this.y && ball.p[1]-ball.r < this.y+this.h || ball.p[0]+ball.r > this.x && ball.p[0]-ball.r < this.x+this.w && ball.p[1] > this.y && ball.p[1] < this.y+this.h) {
				ball.inPassage = true;
				if (this.left && ball.p[0]-ball.r < this.x) {//Left side
					var unitRamp = [0,1];
					var parallelVelocity = ball.e2*(ball.v[0] * unitRamp[0] + ball.v[1] * unitRamp[1]);
					var perpendicularVelocity = -ball.e*sqrt(sq(ball.v[0])+sq(ball.v[1])-sq(parallelVelocity));
					ball.v[0] = parallelVelocity*unitRamp[0] - perpendicularVelocity*unitRamp[1];
					ball.v[1] = parallelVelocity*unitRamp[1] + perpendicularVelocity*unitRamp[0];
					//ball.v[0] *= ball.e;
					//ball.v[1] *= ball.e;
					var theta = 90;
					var aTotal = 0.1633*sin(theta);
					if (ball.right) {
						aTotal += ball.rightForce*ball.m*cos(theta);
					}
					if (ball.left) {
						aTotal -= ball.leftForce*ball.m*cos(theta);
					}
					ball.a[0] = aTotal*unitRamp[0];
					ball.a[1] = aTotal*unitRamp[1];
				}
				if (this.right && ball.p[0]+ball.r > this.x+this.w) {//Right side
					var unitRamp = [0,1];
					var parallelVelocity = ball.e2*(ball.v[0] * unitRamp[0] + ball.v[1] * unitRamp[1]);
					var perpendicularVelocity = ball.e*sqrt(sq(ball.v[0])+sq(ball.v[1])-sq(parallelVelocity));
					ball.v[0] = parallelVelocity*unitRamp[0] - perpendicularVelocity*unitRamp[1];
					ball.v[1] = parallelVelocity*unitRamp[1] + perpendicularVelocity*unitRamp[0];
					//ball.v[0] *= ball.e;
					//ball.v[1] *= ball.e;
					var theta = 90;
					var aTotal = 0.1633*sin(theta);
					if (ball.right) {
						aTotal += ball.rightForce*ball.m*cos(theta);
					}
					if (ball.left) {
						aTotal -= ball.leftForce*ball.m*cos(theta);
					}
					ball.a[0] = aTotal*unitRamp[0];
					ball.a[1] = aTotal*unitRamp[1];
				}
				if (this.up && ball.p[1]-ball.r < this.y) {//ceiling
					this.m = 0;
					this.b = this.y+this.h;
					var unitRamp = [1/sqrt(1+sq(this.m)),this.m/sqrt(1+sq(this.m))];
					var unitPer = [this.m/sqrt(1+sq(this.m)),-1/sqrt(1+sq(this.m))];
					var parallelVelocity = ball.e2*(ball.v[0] * unitRamp[0] + ball.v[1] * unitRamp[1]);
					var perpendicularVelocity = ball.e*sqrt(sq(ball.v[0])+sq(ball.v[1])-sq(parallelVelocity));
					ball.v[0] = parallelVelocity*unitRamp[0] - perpendicularVelocity*unitRamp[1];
					ball.v[1] = parallelVelocity*unitRamp[1] + perpendicularVelocity*unitRamp[0];
					//ball.v[0] *= ball.e;
					//ball.v[1] *= ball.e;
					var theta = atan(this.m);
					var aTotal = 0.1633*sin(theta);
					if (ball.right) {
						aTotal += ball.rightForce*ball.m*cos(theta);
					}
					if (ball.left) {
						aTotal -= ball.leftForce*ball.m*cos(theta);
					}
					ball.a[0] = aTotal*unitRamp[0];
					ball.a[1] = aTotal*unitRamp[1];
				}
				if (this.down && ball.p[1]+ball.r > this.y+this.h) {//floor
					ball.resting = true;
					this.m = 0;
					this.b = this.y+this.h;
					var unitRamp = [1/sqrt(1+sq(this.m)),this.m/sqrt(1+sq(this.m))];
					var unitPer = [this.m/sqrt(1+sq(this.m)),-1/sqrt(1+sq(this.m))];
					var parallelVelocity = ball.e2*(ball.v[0] * unitRamp[0] + ball.v[1] * unitRamp[1]);
					var perpendicularVelocity = -ball.e*sqrt(sq(ball.v[0])+sq(ball.v[1])-sq(parallelVelocity));
					ball.v[0] = parallelVelocity*unitRamp[0] - perpendicularVelocity*unitRamp[1];
					ball.v[1] = parallelVelocity*unitRamp[1] + perpendicularVelocity*unitRamp[0];
					//ball.v[0] *= ball.e;
					//ball.v[1] *= ball.e;
					var theta = atan(this.m);
					var aTotal = 0.1633*sin(theta);
					if (ball.right) {
						aTotal += ball.rightForce*ball.m*cos(theta);
					}
					if (ball.left) {
						aTotal -= ball.leftForce*ball.m*cos(theta);
					}
					ball.a[0] = aTotal*unitRamp[0];
					ball.a[1] = aTotal*unitRamp[1];
				}
			}
		};
		return passage;
	};
	
	var newCrystal = function(x,y,s,type) {
		var crystalObject = {};
		crystalObject.p = [x,y];
		crystalObject.s = s;
		crystalObject.collected = false;
		crystalObject.type = type;
		crystalObject.drawIt = function() {
			if (!this.collected) {
				if (this.type === 1) {
					image(crystal,this.p[0],this.p[1],this.s,this.s);
				} else if (this.type === 2) {
					image(crystalGroup,this.p[0],this.p[1],this.s,this.s);
				}
			}
		};
		crystalObject.interact = function() {
			if (!this.collected && ball.p[0] > this.p[0] && ball.p[0] < this.p[0]+this.s && ball.p[1] > this.p[1] && ball.p[1] < this.p[1]+this.s) {
				this.collected = true;
				if (this.type === 1) {
					ball.score+=50;
				} else if (this.type === 2) {
					ball.score+=150;
				}
			}
		};
		return crystalObject;
	};
	
	var testCircle = newCircleEnclosure(300,300,200);
	
	var testCircle2 = newReverseCircle(300,300,80);
	
	var testCapsule = newCapsuleEnclosure(250,100,500,400);
	
	var testCapsule2 = newReverseCapsule(300,200,400,200);
	
	var testPassage = newPassage(493,250,400,100,false,false,true,true);
	
	var myCrystal = newCrystal(500,290,70,2);
	
	var enclosures = [newCircleEnclosure(300,300,200),newCircleEnclosure(1087,300,200),newCapsuleEnclosure(837,893,500,400)];
	var reverses = [newReverseCircle(300,300,80),newReverseCapsule(887,993,400,200)];
	var passages = [newPassage(493,250,400,100,false,false,true,true),newPassage(1037,493,100,400,true,true,false,false),newPassage(250,-100,100,206,true,true,false,false)];
	var crystals = [newCrystal(500,290,70,1),newCrystal(1178,391,60,2),newCrystal(900,1243,60,2)];
	
	p.draw = function() {
		keyCode = p.keyCode;
		mouseButton = p.mouseButton;
		pmouseX = p.pmouseX;
		pmouseY = p.pmouseY;
		mouseX = p.mouseX;
		mouseY = p.mouseY;
		
		//Put code here
		pushMatrix();
		translate(xTranslate,yTranslate);
		background(130, 214, 237);
		fill(99, 56, 35);
		rect(-2000,-100,4000,4000);
		fill(91, 201, 94);
		rect(-2000,-110,4000,10);
		fill(130, 214, 237);
		rect(250,-111,100,11);
		for (var i = 0; i < enclosures.length; i++) {
			enclosures[i].drawIt();
		}
		for (var i = 0; i < passages.length; i++) {
			passages[i].drawIt();
		}
		for (var i = 0; i < reverses.length; i++) {
			reverses[i].drawIt();
		}
		for (var i = 0; i < crystals.length; i++) {
			crystals[i].drawIt();
		}
		
		ball.drawIt();
		ball.inAirMove();
		
		ball.resting = false;
		ball.inPassage = false;
		for (var i = 0; i < passages.length; i++) {
			passages[i].collide();
		}
		if (!ball.inPassage) {
			for (var i = 0; i < enclosures.length; i++) {
				enclosures[i].collide();
			}
			for (var i = 0; i < reverses.length; i++) {
				reverses[i].collide();
			}
			if (ball.p[1]+ball.r >= -110 && ball.p[1]+ball.r < -80 && !(ball.p[0] >= 250 && ball.p[0] <= 350)) {//bouncing off floor
				ball.resting = true;
				this.m = 0;
				this.b = -100;
				var unitRamp = [1/sqrt(1+sq(this.m)),this.m/sqrt(1+sq(this.m))];
				var unitPer = [this.m/sqrt(1+sq(this.m)),-1/sqrt(1+sq(this.m))];
				var parallelVelocity = ball.e2*(ball.v[0] * unitRamp[0] + ball.v[1] * unitRamp[1]);
				var perpendicularVelocity = -ball.e*sqrt(sq(ball.v[0])+sq(ball.v[1])-sq(parallelVelocity));
				ball.v[0] = parallelVelocity*unitRamp[0] - perpendicularVelocity*unitRamp[1];
				ball.v[1] = parallelVelocity*unitRamp[1] + perpendicularVelocity*unitRamp[0];
				//ball.v[0] *= ball.e;
				//ball.v[1] *= ball.e;
				var theta = atan(this.m);
				var aTotal = 0.1633*sin(theta);
				if (ball.right) {
					aTotal += ball.rightForce*ball.m*cos(theta);
				}
				if (ball.left) {
					aTotal -= ball.leftForce*ball.m*cos(theta);
				}
				ball.a[0] = aTotal*unitRamp[0];
				ball.a[1] = aTotal*unitRamp[1];
			}
		}
		ball.move();
		
		for (var i = 0; i < crystals.length; i++) {
			crystals[i].interact();
		}
		
		xTranslate += xTranslateShifter;
		yTranslate += yTranslateShifter;
		if (ball.p[0] > width-50-xTranslate) {
			xTranslateShifter = -abs(ceil(ball.v[0]));
		} else if (ball.p[0] < 50-xTranslate) {
			xTranslateShifter = abs(ceil(ball.v[0]));
		} else if (xTranslateShifter > 0) {
			xTranslateShifter *= 0.5;
		} else if (xTranslateShifter < 0) {
			xTranslateShifter *= 0.5;
		}
		
		if (ball.p[1] > height-50-yTranslate) {
			yTranslateShifter = -abs(ceil(ball.v[1]));
			//println(ball.p[1]+yTranslate);
		} else if (ball.p[1] < 50-yTranslate) {
			yTranslateShifter = abs(ceil(ball.v[1]));
		} else if (yTranslateShifter > 0) {
			yTranslateShifter *= 0.7;
		} else if (yTranslateShifter < 0) {
			yTranslateShifter *= 0.7;
		}
	
		popMatrix();

		fill(255);
		textSize(20);
		text("Score: "+ball.score,270,550);
		
		keyIsReleased = false;
		mouseIsClicked = false;
	};  

	
}
