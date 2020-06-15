//var width = 5000;
//var height = 5000;

function setup() {
	createCanvas(500,500);
	noFill();
	noStroke();
	background(2, 130, 194); //pick a color
}

//Images (have to declare outside so scope will be global
var crystal, testing, smiley, crystalGroup, crystalGroupWater, crystalWater;
var numCrystals = 3;//Have to decide early so we know how many crystal images to load. Later each crystal will be assigned a crystal image to manipulate with the waterlevel.

function loadImgErrFix(errEvt) {
  const pic = errEvt.target;

  if (!pic.crossOrigin)  return console.log(`Failed to reload ${pic.src}!`);

  console.log(`Attempting to reload ${pic.src} as a tainted image now...`);
  pic.crossOrigin = null, pic.src = pic.src;
  console.log(pic.crossOrigin);
  console.log(pic.src);
}

function preload() {
	/*testing = loadImage("test_image.png", pic => print(pic), loadImgErrFix);
	smiley = loadImage("smiley.png", pic => print(pic), loadImgErrFix);
	//crystal = loadImage("crystal.png");
	//crystal = loadImage("https://live.staticflickr.com/65535/48576080816_3f3660771c.jpg");
	//crystal = loadImage("https://photos.app.goo.gl/xTkxGcvX4KSTuwFp7", pic => print(pic), loadImgErrFix);
	//crystal = loadImage("file:///C:/Users/Melody/Documents/javascript_development/testing_p5/crystal.png", pic => print(pic), loadImgErrFix);
	crystal = loadImage("crystal.png", pic => print(pic), loadImgErrFix);
	crystalGroup = loadImage("crystal_group2.png", pic => print(pic), loadImgErrFix);
	crystalGroupWater = loadImage("crystal_group_water.png", pic => print(pic), loadImgErrFix);
	crystalWater = loadImage("crystal_water.png", pic => print(pic), loadImgErrFix);*/
	
	
	testing = loadImage("test_image.png");
	smiley = loadImage("smiley.png");
	crystal = loadImage("crystal.png");
	crystalGroup = loadImage("crystal_group2.png");
	crystalGroupWater = loadImage("crystal_group_water.png");
	crystalWater = loadImage("crystal_water.png");
}
/*var testing = loadImage("test_image.png");
var smiley = loadImage("smiley.png");
var crystal = loadImage("crystal.png");
var crystalGroup = loadImage("crystal_group2.png");
var crystalGroupWater = loadImage("crystal_group_water.png");
var crystalWater = loadImage("crystal_water.png");*/



var g = 0.1633;
var ballStartPos = [370,430];
var waterLevel = 1430;
var xTranslate = 370-ballStartPos[0];
var yTranslate = 430-ballStartPos[1];
var xTranslateShifter = 0;
var yTranslateShifter = 0;

var ball = {};
//ball.p = [370,430];//position
ball.p = [ballStartPos[0],ballStartPos[1]];
ball.v = [0,0];//velocity
ball.m = 20;//"mass"
ball.r = 18;//radius
ball.e = 0.7;//elasticity (between 0 and 1)
ball.e2 = 0.98;//parallel elasticity
ball.resting = false;
ball.restingBottom = false;
ball.restingTop = false;
ball.inPassage = false;
ball.a = [0,g];
ball.right = false;
ball.left = false;
ball.rightForce = 0.05;
ball.leftForce = 0.05;
ball.score = 0;
ball.waterTheta = 0;
ball.drawIt = function() {
	if (waterLevel > this.p[1]+this.r) {
		fill(192, 142, 236);
		ellipse(this.p[0],this.p[1],this.r*2,this.r*2);
	} else if (waterLevel < this.p[1]-this.r) {
		fill(155, 151, 230);
		ellipse(this.p[0],this.p[1],this.r*2,this.r*2);
	} else if (waterLevel < this.p[1]) {
		fill(192, 142, 236);
		ellipse(this.p[0],this.p[1],this.r*2,this.r*2);
		this.waterTheta = acos((this.p[1]-waterLevel)/this.r);
		fill(155, 151, 230);
		arc(this.p[0],this.p[1],this.r*2,this.r*2,this.waterTheta-90,270-this.waterTheta);
		triangle(this.p[0],this.p[1],this.p[0]+this.r*sin(this.waterTheta),waterLevel,this.p[0]-this.r*sin(this.waterTheta),waterLevel);
	} else {
		fill(155, 151, 230);
		ellipse(this.p[0],this.p[1],this.r*2,this.r*2);
		this.waterTheta = acos((waterLevel-this.p[1])/this.r);
		fill(192, 142, 236);
		arc(this.p[0],this.p[1],this.r*2,this.r*2,90+this.waterTheta,450-this.waterTheta);
		triangle(this.p[0],this.p[1],this.p[0]+this.r*sin(this.waterTheta),waterLevel,this.p[0]-this.r*sin(this.waterTheta),waterLevel);
	}
};
ball.inAirMove = function() {
	//If the ball is in the air, change a accordingly
	if (!this.resting) {
		//acceleration assignment
		this.a[1] = g;
		this.a[0] = 0;
		if (keyIsPressed && keyCode === RIGHT_ARROW) {
			this.a[0] = 4*this.rightForce;
			this.right = true;
		} else {
			this.right = false;
		}
		if (keyIsPressed && keyCode === LEFT_ARROW) {
			this.a[0] = -4*this.leftForce;
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
	if (this.resting && keyIsPressed && keyCode == UP_ARROW) {
		this.v[1] -= 5;
		this.resting = false;
		this.restingBottom = false;
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
		//fill(71, 40, 24);
		//ellipse(this.p[0],this.p[1],this.r*2,this.r*2);
		if (waterLevel > this.p[1]+this.r) {
			fill(71, 40, 24);
			ellipse(this.p[0],this.p[1],this.r*2,this.r*2);
		} else if (waterLevel < this.p[1]-this.r) {
			fill(89,169,194);
			ellipse(this.p[0],this.p[1],this.r*2,this.r*2);
		} else if (waterLevel < this.p[1]) {
			fill(71, 40, 24);
			ellipse(this.p[0],this.p[1],this.r*2,this.r*2);
			this.waterTheta = acos((this.p[1]-waterLevel)/this.r);
			fill(89,169,194);
			arc(this.p[0],this.p[1],this.r*2,this.r*2,this.waterTheta-90,270-this.waterTheta);
			triangle(this.p[0],this.p[1],this.p[0]+this.r*sin(this.waterTheta)+2,waterLevel,this.p[0]-this.r*sin(this.waterTheta)-2,waterLevel);
		} else {
			//println("hi");
			fill(71, 40, 24);
			ellipse(this.p[0],this.p[1],this.r*2,this.r*2);
			fill(89,169,194);
			ellipse(this.p[0],this.p[1],this.r*2,this.r*2);
			this.waterTheta = acos((waterLevel-this.p[1])/this.r);
			fill(71, 40, 24);
			arc(this.p[0],this.p[1],this.r*2,this.r*2,90+this.waterTheta,450-this.waterTheta);
			triangle(this.p[0],this.p[1],this.p[0]+this.r*sin(this.waterTheta)+2,waterLevel,this.p[0]-this.r*sin(this.waterTheta)-2,waterLevel);
		}
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
			ball.restingBottom = true;//The ball is on a ramp
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
			ball.restingTop = true;//The ball is on a ramp
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
				ball.restingTop = true;//The ball is on a ramp
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
				ball.restingBottom = true;//The ball is on a ramp
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
		if (waterLevel > this.y+this.h) {//Water level below this enclosure
			fill(71, 40, 24);
			rect(this.x-1,this.y,this.w+2,this.h);
			arc(this.p1[0],this.p1[1],this.r*2,this.r*2,90,270);
			arc(this.p2[0],this.p2[1],this.r*2,this.r*2,-90,90);
		} else if (waterLevel < this.y) {//Water level above this enclosure (flooded)
			fill(89,169,194);
			rect(this.x-1,this.y,this.w+2,this.h);
			arc(this.p1[0],this.p1[1],this.r*2,this.r*2,90,270);
			arc(this.p2[0],this.p2[1],this.r*2,this.r*2,-90,90);
		} else if (waterLevel < this.p1[1]) {//Water level above the center of this enclosure
			fill(71, 40, 24);
			rect(this.x-1,this.y,this.w+2,this.h);
			arc(this.p1[0],this.p1[1],this.r*2,this.r*2,90,270);
			arc(this.p2[0],this.p2[1],this.r*2,this.r*2,-90,90);
			fill(89,169,194);
			rect(this.x-1,waterLevel,this.w+2,this.y+this.h-waterLevel);
			var waterTheta = acos((this.p1[1]-waterLevel)/this.r);
			arc(this.p1[0],this.p1[1],this.r*2,this.r*2,90,270-waterTheta);
			arc(this.p2[0],this.p2[1],this.r*2,this.r*2,-90+waterTheta,90);
			triangle(this.p1[0]+1,this.p1[1]+5,this.p1[0]+1,waterLevel,this.p1[0]-this.r*sin(waterTheta),waterLevel);
			triangle(this.p2[0]-1,this.p2[1]+5,this.p2[0]-1,waterLevel,this.p2[0]+this.r*sin(waterTheta),waterLevel);
		} else {//Water level below the center of this enclosure
			fill(71, 40, 24);
			rect(this.x-2,this.y,this.w+4,this.h);
			fill(89,169,194);
			rect(this.x-1,waterLevel,this.w+2,this.y+this.h-waterLevel);
			arc(this.p1[0],this.p1[1],this.r*2,this.r*2,90,270);
			arc(this.p2[0],this.p2[1],this.r*2,this.r*2,-90,90);
			var waterTheta = acos((waterLevel-this.p1[1])/this.r);
			fill(71, 40, 24);
			arc(this.p1[0]+1,this.p1[1],this.r*2+2,this.r*2+1,90+waterTheta,270);
			arc(this.p2[0]-1,this.p2[1],this.r*2+2,this.r*2+1,-90,90-waterTheta);
			triangle(this.p1[0]+1,this.p1[1]-5,this.p1[0]+1,waterLevel,this.p1[0]-this.r*sin(waterTheta),waterLevel);
			triangle(this.p2[0]-1,this.p2[1]-5,this.p2[0]-1,waterLevel,this.p2[0]+this.r*sin(waterTheta),waterLevel);
		}
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
			ball.restingBottom = true;
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
			ball.restingTop = true;
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
					ball.restingBottom = true;//The ball is on a ramp
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
					ball.restingTop = true;//The ball is on a ramp
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
					ball.restingBottom = true;//The ball is on a ramp
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
					ball.restingTop = true;//The ball is on a ramp
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
		rect(this.x-1,this.y,this.w+2,this.h);
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
			ball.restingTop = true;
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
			ball.restingBottom = true;
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
					ball.restingTop = true;//The ball is on a ramp
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
					ball.restingBottom = true;//The ball is on a ramp
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
					ball.restingBottom = true;//The ball is on a ramp
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
					ball.restingTop = true;//The ball is on a ramp
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
		//fill(71, 40, 24);
		//rect(this.x,this.y,this.w,this.h);
		if (waterLevel > this.y + this.h) {
			fill(71, 40, 24);
			rect(this.x,this.y,this.w,this.h+1);
		} else if (waterLevel < this.y) {
			fill(89,169,194);
			rect(this.x,this.y,this.w,this.h+1);
		} else {
			fill(71, 40, 24);
			rect(this.x,this.y,this.w,this.h);
			fill(89,169,194);
			rect(this.x,waterLevel,this.w,this.y+this.h-waterLevel+1);
		}
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
				ball.restingTop = true;
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
				ball.restingBottom = true;
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

/*var testImage = createGraphics(width,height, p.P2D);
testImage.beginDraw();
testImage.stroke(255);
testImage.fill(0,0,0);
testImage.ellipse(900,1243,60,60);
testImage.endDraw();*/

var newCrystal = function(x,y,s,type,theta) {
	var crystalObject = {};
	crystalObject.p = [x,y];
	crystalObject.s = s;
	crystalObject.collected = false;
	crystalObject.type = type;
	crystalObject.theta = theta;
	crystalObject.r = s/2;
	crystalObject.drawIt = function() {
		if (!this.collected) {
			push();
			translate(this.p[0]+this.r,this.p[1]+this.r);
			rotate(this.theta);
			if (this.type === 1) {
				image(crystal,-this.r,-this.r,this.s,this.s);
			} else if (this.type === 2) {
				image(crystalGroup,-this.r,-this.r,this.s,this.s);
			}
			/*if (waterLevel < this.p[1]+this.s && waterLevel > this.p[1]) {
				fill(89,169,194,150);
				rect(0,waterLevel-this.p[1],this.s,this.p[1]+this.s-waterLevel);
			} else if (waterLevel < this.p[1]+this.s) {
				fill(89,169,194,150);
				//rect(0,0,this.s,this.s);
				image(crystalGroupWater,0,0,this.s,this.s);
				//crystalCluster.blend(testImage,0,0,width,height,0,0,width,height,ADD);
			}*/
			pop();
			if (waterLevel > this.p[1]+this.s) {
			} else if (waterLevel > this.p[1]+this.r) {
				fill(89,169,194,150);
				var waterTheta = acos((waterLevel-(this.p[1]+this.r))/this.r);
				arc(this.p[0]+this.r,waterLevel,2*this.r*sin(waterTheta)+this.r/3,2*(this.p[1]+this.s-waterLevel)+this.r/5,0,180);
			} else if (waterLevel > this.p[1]) {
				fill(89,169,194,150);
				var waterTheta = acos(((this.p[1]+this.r)-waterLevel)/this.r);
				arc(this.p[0]+this.r,this.p[1]+this.r,this.s+this.r/3,this.s+this.r/3,0,180);
				rect(this.p[0]+this.r-(this.s+this.r/3)/2,waterLevel,this.s+this.r/3,this.p[1]+this.r-waterLevel);
			} else {
				push();
				translate(this.p[0]+this.r,this.p[1]+this.r);
				rotate(this.theta);
				if (this.type === 2){
					image(crystalGroupWater,-this.r,-this.r,this.s,this.s);
				} else if (this.type === 1) {
					image(crystalWater,-this.r,-this.r,this.s,this.s);
				}
				pop();
			}
		}
		
	};
	crystalObject.interact = function() {
		if (!this.collected && sqrt(sq(ball.p[0]-(this.p[0]+this.r))+sq(ball.p[1]-(this.p[1]+this.r))) < this.r) {
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
var crystals = [newCrystal(500,281,70,1,0),newCrystal(1178,387,60,2,-40),newCrystal(900,1236,60,2,0)];

draw = function() {
	angleMode(DEGREES);
	//keyCode = p.keyCode;
	//mouseButton = p.mouseButton;
	//pmouseX = p.pmouseX;
	//pmouseY = p.pmouseY;
	//mouseX = p.mouseX;
	//mouseY = p.mouseY;
	
	//Put code here
	push();
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
	
	//Lighting
	/**var lightRadius = 100;
	var leftX = ball.p[0]-lightRadius;
	var upperY = ball.p[1]-lightRadius;
	var rightX = ball.p[0]+lightRadius;
	var lowerY = ball.p[1]+lightRadius;
	
	fill(0,0,0,150);
	rect(0,0,10000,upperY);
	rect(0,upperY,leftX,10000);
	rect(rightX,upperY,10000,lightRadius*2);
	rect(leftX,lowerY,10000,10000);
	
	//stroke(0,0,0,150);
	//strokeWeight(1);
	for (var i = 0; i < lightRadius; i++) {
		for (var j = 0; j < lightRadius; j++) {
			if (sqrt(sq(i-lightRadius)+sq(j-lightRadius)) > lightRadius) {
				point(i+leftX,j+upperY);
				point(rightX-i,j+upperY);
				point(rightX-i,lowerY-j);
				point(i+leftX,lowerY-j);
				rect(i+leftX,j+upperY,1,1);
				rect(rightX-i,j+upperY,1,1);
				rect(rightX-i,lowerY-j,1,1);
				rect(i+leftX,lowerY-j,1,1);
			}
		}
	}
	noStroke();**/
	
	if (ball.p[1] + ball.r/2 > waterLevel && ball.p[1] > -100) {
		ball.inWater = true;
		g = -0.1633;
		//ball.a[1] = g;
		//ball.rightForce = 0.02;
		//ball.leftForce = 0.02;
	} else {
		ball.inWater = false;
		g = 0.1633;
		ball.rightForce = 0.05;
		ball.leftForce = 0.05;
	}
	
	ball.inAirMove();
	
	ball.resting = false;
	ball.restingBottom = false;
	ball.restingTop = false;
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
			ball.restingBottom = true;
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
	if (!ball.inWater && ball.restingBottom) {
		ball.resting = true;
	}
	if (ball.inWater && ball.restingTop) {
		ball.resting = true;
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

	pop();
	
	waterLevel --;
	
	//println(ball.resting);
	
	
	
	fill(255);
	textSize(20);
	text("Score: "+ball.score,270,550);
	
	keyIsReleased = false;
	mouseIsClicked = false;
};  