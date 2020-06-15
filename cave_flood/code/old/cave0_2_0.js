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
	var ball = {};
	ball.p = [200,200];//position
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
		fill(255,255,255);
		if (this.againstWall) {
			fill(255,0,0);
		}
		ellipse(this.p[0],this.p[1],this.r*2,this.r*2);
		//println(this.r*2);
	};
	ball.update = function() {
		/*if (this.p[1] > height - this.r && this.v[1] > 0) {
			this.v[1] = -this.e*this.v[1];
		}*/
		/*if (this.p[1] > height - 1 - this.r && abs(this.v[1]) < 1) {
			this.v[1] = 0;
			this.a[1] = 0;
			this.resting = true;
		} else {
			this.a[1] = 0.1633;
		}*/
		this.a[1] = 0.1633;
		
		if (keyIsPressed && keyCode === RIGHT) {
			this.a[0] = 0.1;
		} else if (keyIsPressed && keyCode === LEFT) {
			this.a[0] = -0.1;
		} else if (this.v[0] > 0) {
			this.a[0] = 0;
			this.v[0] -= 0.05;
			if (this.v[0] < 0) {
				this.v[0] = 0;
			}
		} else if (this.v[0] < 0) {
			this.a[0] = 0;
			this.v[0] += 0.05;
			if (this.v[0] > 0) {
				this.v[0] = 0;
			}
		} else {
			this.a[0] = 0;
		}
		if (this.v[0] > 10) {
			this.v[0] = 10;
		} else if (this.v[0] < -10) {
			this.v[0] = -10;
		}
		if (this.v[0] > 10) {
			this.v[0] = 10;
		} else if (this.v[0] < -10) {
			this.v[0] = -10;
		}
		
		if (keyIsReleased && keyCode === UP) {
			this.a[1] = 0.1633;
			this.v[1] = 10;
		}
	};
	ball.move = function() {
		this.p[0] += this.v[0];
		this.p[1] += this.v[1];
		this.v[0] += this.a[0];
		this.v[1] += this.a[1];
		this.p[0] += this.v[0];
		if (!this.resting) {
			this.p[1] += this.v[1];
			this.v[1] += 0.1633;
		}
		if (keyIsPressed && keyCode === RIGHT) {
			this.v[0] += 0.1;
		} else if (keyIsPressed && keyCode === LEFT) {
			this.v[0] -= 0.1;
		} else if (this.v[0] > 0) {
			this.v[0] -= 0.05;
			if (this.v[0] < 0) {
				this.v[0] = 0;
			}
		} else if (this.v[0] < 0) {
			this.v[0] += 0.05;
			if (this.v[0] > 0) {
				this.v[0] = 0;
			}
		}
		if (this.v[0] > 10) {
			this.v[0] = 10;
		} else if (this.v[0] < -10) {
			this.v[0] = -10;
		}
	};
	
	var newWall = function(m,b) {
		var wall = {};
		wall.m = m;
		wall.b = b;
		wall.collide = function() {
			if (ball.p[1] >= (ball.p[0]+ball.r*sqrt((sq(this.m)+1)/sq(this.m)))*this.m + this.b) {
				var unitRamp = [1/sqrt(1+sq(this.m)),this.m/sqrt(1+sq(this.m))];
				//println(unitRamp);
				var parallelVelocity = ball.v[0] * unitRamp[0] + ball.v[1] * unitRamp[1];
				var perpendicularVelocity = -sqrt(sq(ball.v[0])+sq(ball.v[1]) - sq(parallelVelocity));
				if (abs(perpendicularVelocity) < 0.8) {
					//println(ball.p[1]);
					perpendicularVelocity = 0;
					ball.p[0] -= ((ball.p[0]+ball.r*sqrt((sq(this.m)+1)/sq(this.m)))*this.m + this.b - ball.p[1])/this.m;
					ball.p[1] = (ball.p[0]+ball.r*sqrt((sq(this.m)+1)/sq(this.m)))*this.m + this.b;
					//ball.a[1] = 0.1633*sin(atan(this.m))/sqrt((sq(m)+1)/sq(m));
					ball.a[0] += 0.1633*sin(atan(this.m))/(sqrt((sq(m)+1)/sq(m))*this.m);
					ball.a[1] = ball.a[0]*this.m;
					//println(ball.p[1]);
				}
				ball.v[0] = parallelVelocity*unitRamp[0] - perpendicularVelocity*unitRamp[1];
				ball.v[1] = parallelVelocity*unitRamp[1] + perpendicularVelocity*unitRamp[0];
				ball.v[0] *= ball.e;
				ball.v[1] *= ball.e;
				//println(ball.v[1]);
				ball.againstWall = true;
			} else {
				ball.againstWall = false;
			}
			stroke(255,0,0);
			strokeWeight(2);
			line(0,this.b,width,width*this.m+this.b);
			stroke(0,0,0);
			line(0,this.b+ball.r*sqrt((sq(this.m)+1)/sq(this.m))*this.m,width,(width+ball.r*sqrt((sq(this.m)+1)/sq(this.m)))*this.m+this.b);
			
			strokeWeight(3);
			point(ball.p[0], (ball.p[0]+ball.r*sqrt((sq(this.m)+1)/sq(this.m)))*this.m + this.b)
			noStroke();
		};
		return wall;
	};
	
	//var wall = newWall(-1.5*height/width, height*5/8+1.5*height);
	var wall = newWall(-1/3,800);
	var floor = newWall(0,height);
	//var 
	//ball.v = [5,0];
	
	p.draw = function() {
		keyCode = p.keyCode;
		mouseButton = p.mouseButton;
		pmouseX = p.pmouseX;
		pmouseY = p.pmouseY;
		mouseX = p.mouseX;
		mouseY = p.mouseY;
		
		//Put code here
		background(0,180,230);
		fill(255,255,255);
		//triangle(width*3/4,height,width,height,width,height*5/8);
		//triangle(300,500,600,500,600,400);
		triangle(0, wall.b,width,width*wall.m+wall.b,width, height);
		ball.drawIt();
		//ball.update();
		//wall.collide();
		//ball.move();
		
		
		/**TESTING**/
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
		ball.v[0] += ball.a[0];
		ball.v[1] += ball.a[1];
		ball.resting = false;
		//bouncing off ramp
		if (ball.p[1] >= (ball.p[0]+ball.r*sqrt((sq(wall.m)+1)/sq(wall.m)))*wall.m + wall.b) {
			ball.resting = true;
			var unitRamp = [1/sqrt(1+sq(wall.m)),wall.m/sqrt(1+sq(wall.m))];
			var unitPer = [wall.m/sqrt(1+sq(wall.m)),-1/sqrt(1+sq(wall.m))];
			var parallelVelocity = ball.v[0] * unitRamp[0] + ball.v[1] * unitRamp[1];
			var perpendicularVelocity = -sqrt(sq(ball.v[0])+sq(ball.v[1])-sq(parallelVelocity));
			ball.v[0] = parallelVelocity*unitRamp[0] - perpendicularVelocity*unitRamp[1];
			ball.v[1] = parallelVelocity*unitRamp[1] + perpendicularVelocity*unitRamp[0];
			ball.v[0] *= ball.e;
			ball.v[1] *= ball.e;
			var theta = atan(wall.m);
			var aTotal = 0.1633*sin(theta);
			if (ball.right) {
				aTotal += 0.1*ball.m*cos(theta);
			}
			if (ball.left) {
				aTotal -= 0.1*ball.m*cos(theta);
			}
			ball.a[0] = aTotal*unitRamp[0];
			ball.a[1] = aTotal*unitRamp[1];
		} else if (ball.p[1]+ball.r >= floor.b) {//bouncing off floor
			ball.resting = true;
			var unitRamp = [1/sqrt(1+sq(floor.m)),floor.m/sqrt(1+sq(floor.m))];
			var unitPer = [floor.m/sqrt(1+sq(floor.m)),-1/sqrt(1+sq(floor.m))];
			var parallelVelocity = ball.v[0] * unitRamp[0] + ball.v[1] * unitRamp[1];
			var perpendicularVelocity = -sqrt(sq(ball.v[0])+sq(ball.v[1])-sq(parallelVelocity));
			ball.v[0] = parallelVelocity*unitRamp[0] - perpendicularVelocity*unitRamp[1];
			ball.v[1] = parallelVelocity*unitRamp[1] + perpendicularVelocity*unitRamp[0];
			ball.v[0] *= ball.e;
			ball.v[1] *= ball.e;
			var theta = atan(floor.m);
			var aTotal = 0.1633*sin(theta);
			if (ball.right) {
				aTotal += 0.1*ball.m*cos(theta);
			}
			if (ball.left) {
				aTotal -= 0.1*ball.m*cos(theta);
			}
			ball.a[0] = aTotal*unitRamp[0];
			ball.a[1] = aTotal*unitRamp[1];
		} else if (ball.p[0]-ball.r <= 0) {//bouncing off left wall
			//ball.resting = true;
			var unitRamp = [0,1];
			//var unitPer = [floor.m/sqrt(1+sq(floor.m)),-1/sqrt(1+sq(floor.m))];
			var parallelVelocity = ball.v[0] * unitRamp[0] + ball.v[1] * unitRamp[1];
			var perpendicularVelocity = -sqrt(sq(ball.v[0])+sq(ball.v[1])-sq(parallelVelocity));
			ball.v[0] = parallelVelocity*unitRamp[0] - perpendicularVelocity*unitRamp[1];
			ball.v[1] = parallelVelocity*unitRamp[1] + perpendicularVelocity*unitRamp[0];
			ball.v[0] *= ball.e;
			ball.v[1] *= ball.e;
			var theta = 90;
			var aTotal = 0.1633*sin(theta);
			if (ball.right) {
				aTotal += 0.1*ball.m*cos(theta);
			}
			if (ball.left) {
				aTotal -= 0.1*ball.m*cos(theta);
			}
			ball.a[0] = aTotal*unitRamp[0];
			ball.a[1] = aTotal*unitRamp[1];
		} else if (ball.p[0]+ball.r >= width) {//bouncing off right wall
			//ball.resting = true;
			var unitRamp = [0,1];
			//var unitPer = [floor.m/sqrt(1+sq(floor.m)),-1/sqrt(1+sq(floor.m))];
			var parallelVelocity = ball.v[0] * unitRamp[0] + ball.v[1] * unitRamp[1];
			var perpendicularVelocity = sqrt(sq(ball.v[0])+sq(ball.v[1])-sq(parallelVelocity));
			ball.v[0] = parallelVelocity*unitRamp[0] - perpendicularVelocity*unitRamp[1];
			ball.v[1] = parallelVelocity*unitRamp[1] + perpendicularVelocity*unitRamp[0];
			ball.v[0] *= ball.e;
			ball.v[1] *= ball.e;
			var theta = 90;
			var aTotal = 0.1633*sin(theta);
			if (ball.right) {
				aTotal += 0.1*ball.m*cos(theta);
			}
			if (ball.left) {
				aTotal -= 0.1*ball.m*cos(theta);
			}
			ball.a[0] = aTotal*unitRamp[0];
			ball.a[1] = aTotal*unitRamp[1];
		}
		if (ball.resting && keyIsPressed && keyCode == UP) {
			ball.v[1] = -5;
			ball.resting = false;
		}
		ball.p[0] += ball.v[0];
		ball.p[1] += ball.v[1];
		
		/**TESTING END**/
		stroke(255,0,0);
		strokeWeight(4);
		//line(0,200,width,3*width+200);
		//line(0,200,width,3*width+200);
		noStroke();
		
		keyIsReleased = false;
		mouseIsClicked = false;
	};  

	
}
