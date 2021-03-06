//Created by Melody Ruth. Licensed under Attribution-NonCommercial-ShareAlike 3.0 Unported (CC BY-NC-SA 3.0)

var canvasWidth = 800;
var canvasHeight = 500;

//Comes btwn 1.6 and 1.7

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

var goingRight = false;
var goingLeft = false;
var goingUp = false;
var goingDown = false;
var goingForward = false;
var goingBack = false;
var spinning = false;
var rotatingRight = false;
var rotatingLeft = false;
var remoteForward = false;
var remoteBackward = false;

var player = {};
player.eyeX = 0;
player.eyeY = 150;
player.eyeZ = -540;
player.zeroX = canvasWidth/2;
player.zeroY = canvasHeight;
player.zw = 0;
player.height = 150;
player.p = [player.eyeX, player.eyeY-player.height, player.eyeZ];//position of feet
player.v = [0,0,0,0];//x, y, z, rotation
player.a = [0,0,0,0];//x, y, z, roation
player.moveIt = function() {
	//console.log(this.onGround);
	if (keyIsPressed && key == ' ' && this.onGround) {
		this.jumping = true;
		this.v[1] = 5;
	}
	
	this.v[0] += this.a[0];
	this.v[1] += this.a[1];
	this.v[2] += this.a[2];
	
	//up and down
	this.p[1] += this.v[1];
	this.zeroY += this.v[1];
	
	//forward and back
	this.p[2] += this.v[2];
	this.zw += this.v[2];
	
	this.eyeX = this.p[0];
	this.eyeY = this.p[1]+this.height;
	this.eyeZ = this.p[2];
	
	this.a[1] = -0.1;
	this.onGround = false;
	this.jumping = false;
}

var xyz2xy = function(x, y, z) {
	return [(z-player.zw)*(player.eyeX-x)/(-player.eyeZ+z)+x+player.zeroX,player.zeroY-((z-player.zw)*(player.eyeY-y)/(-player.eyeZ+z)+y)];
};

var farAwayY = xyz2xy(0,0,1000000)[1];

var sun = {};
sun.p = [0,1000,40];
sun.respondToPlayer = function() {
	var currAngle;
	var zDiff = this.p[2] - player.eyeZ;
	var xDiff = this.p[0] - player.eyeX;
	var radius = Math.sqrt(zDiff*zDiff+xDiff*xDiff);
	
	if (xDiff == 0 && zDiff == 0) {
		currAngle = 0;
		radius = 0;
	} else if (xDiff == 0) {
		if (zDiff > 0) {
			currAngle = 90;
		} else {
			currAngle = 270;
		}
	} else {
		currAngle = atan(zDiff/xDiff);
		if (xDiff < 0) {
			currAngle += 180;
		}
	}
	
	currAngle += player.v[3];
	
	this.p[0] = player.eyeX + radius * cos(currAngle);
	this.p[2] = player.eyeZ + radius * sin(currAngle);
}

var topScreenSlope = (player.zeroY-player.eyeY)/(player.zw-player.eyeZ);
var topScreenIntercept = player.zeroY - player.zw*(player.zeroY-player.eyeY)/(player.zw-player.eyeZ);

var bottomScreenSlope = (player.zeroY-canvasHeight-player.eyeY)/(player.zw-player.eyeZ);
var bottomScreenIntercept = player.zeroY-canvasHeight - player.zw*(player.zeroY-canvasHeight-player.eyeY)/(player.zw-player.eyeZ);

var leftScreenSlope = (-player.zeroX-player.eyeX)/(player.zw-player.eyeZ);
var leftScreenIntercept = player.zw*(player.zeroX+player.eyeX)/(player.zw-player.eyeZ) - player.zeroX;

var rightScreenSlope = (canvasWidth-player.zeroX-player.eyeX)/(player.zw-player.eyeZ);
var rightScreenIntercept = player.zw*(-canvasWidth+player.zeroX+player.eyeX)/(player.zw-player.eyeZ) + canvasWidth - player.zeroX;

var forward = [0,0,1];

class Vertex {
	constructor(x,y,z,myFaces) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.screenX = x;
		this.screenY = y;
		if (typeof myFaces !== 'undefined') {
			this.faces = myFaces;
		} else {
			this.faces = [];
		}
		var shadow = [];
		shadow[0] = (this.x-sun.p[0])*sun.p[1]/(sun.p[1]-this.y);
		shadow[1] = 0;
		shadow[2] = (this.z-sun.p[2])*sun.p[1]/(sun.p[1]-this.y);
		this.shadowX = shadow[0];
		this.shadowY = shadow[1];
		this.shadowZ = shadow[2];
	}
	updateScreenPos() {
		this.screenX = xyz2xy(this.x,this.y,this.z)[0];
		this.screenY = xyz2xy(this.x,this.y,this.z)[1];
		this.shadowScreenX = xyz2xy(this.shadowX,this.shadowY,this.shadowZ)[0];
		this.shadowScreenY = xyz2xy(this.shadowX,this.shadowY,this.shadowZ)[1];
	}
	drawIt() {
		stroke(0,0,0);
		strokeWeight(5);
		point(this.screenX,this.screenY);
		noStroke();
	}
	getShadowVersion() {
		var shadow = [];
		shadow[0] = (this.x-sun.p[0])*sun.p[1]/(sun.p[1]-this.y) + sun.p[0];
		shadow[1] = 0;
		shadow[2] = (this.z-sun.p[2])*sun.p[1]/(sun.p[1]-this.y) + sun.p[2];
		this.shadowX = shadow[0];
		this.shadowY = shadow[1];
		this.shadowZ = shadow[2];
		/*if (keyIsPressed && key == ' ') {
			console.log(this.shadowX,this.shadowY,this.shadowZ);
		}*/
		return shadow;
	}
}

class Face {
	constructor(newVertices,normalSwitch,myColor1,myColor2,light) {
		this.vertices = newVertices;
		if (typeof myColor1 === 'undefined') {
			this.lightLevel = 1;
			this.color = [255,0,0];
			this.color1 = this.color;
			this.color2 = this.color;
		} else if (typeof myColor2 === 'undefined') {
			this.lightLevel = 1;
			this.color = myColor;
			this.color1 = this.color;
			this.color2 = this.color;
		} else {
			this.lightLevel = light;
			this.color1 = myColor1;
			this.color2 = myColor2;
			this.color = [];
			for (var i = 0; i < 3; i++) {
				this.color[i] = this.color1[i] * this.lightLevel + this.color2[i] * (1-this.lightLevel);
			}
		}
		var cross1 = [this.vertices[0].x-this.vertices[1].x,this.vertices[0].y-this.vertices[1].y,this.vertices[0].z-this.vertices[1].z];
		var cross2 = [this.vertices[2].x-this.vertices[1].x,this.vertices[2].y-this.vertices[1].y,this.vertices[2].z-this.vertices[1].z];
		this.nSwitch = normalSwitch;
		this.normal = [cross1[1]*cross2[2]-cross2[1]*cross1[2],cross2[0]*cross1[2]-cross1[0]*cross2[2],cross1[0]*cross2[1]-cross2[0]*cross1[1]];
		this.normal[0] *= this.nSwitch;
		this.normal[1] *= this.nSwitch;
		this.normal[2] *= this.nSwitch;
		var mag = Math.sqrt(this.normal[0]*this.normal[0]+this.normal[1]*this.normal[1]+this.normal[2]*this.normal[2]);
		this.normal[0] /= mag;
		this.normal[1] /= mag;
		this.normal[2] /= mag;
		this.planeXCo = -this.normal[0]/this.normal[1];//x coefficient in the plane equation
		this.planeZCo = -this.normal[2]/this.normal[1];
		this.planeConstant = (this.normal[0]*this.vertices[0].x + this.normal[2]*this.vertices[0].z)/this.normal[1] - this.vertices[0].y;
		this.shouldDraw = true;
		this.jumpPlatform = false;
		this.playerOn = false;
		this.vertical = false;
	}
	updateNormal(printing) {
		var cross1 = [this.vertices[0].x-this.vertices[1].x,this.vertices[0].y-this.vertices[1].y,this.vertices[0].z-this.vertices[1].z];
		var cross2 = [this.vertices[2].x-this.vertices[1].x,this.vertices[2].y-this.vertices[1].y,this.vertices[2].z-this.vertices[1].z];
		this.normal = [cross1[1]*cross2[2]-cross2[1]*cross1[2],cross2[0]*cross1[2]-cross1[0]*cross2[2],cross1[0]*cross2[1]-cross2[0]*cross1[1]];
		this.normal[0] *= this.nSwitch;
		this.normal[1] *= this.nSwitch;
		this.normal[2] *= this.nSwitch;
		var mag = Math.sqrt(this.normal[0]*this.normal[0]+this.normal[1]*this.normal[1]+this.normal[2]*this.normal[2]);
		this.normal[0] /= mag;
		this.normal[1] /= mag;
		this.normal[2] /= mag;
		
		if (!this.vertical && typeof printing != 'undefined' && printing) {
			console.log(this.normal,this.vertices[0]);
		}
		this.planeXCo = -this.normal[0]/this.normal[1];//x coefficient in the plane equation
		this.planeZCo = -this.normal[2]/this.normal[1];
		this.planeConstant = -(this.normal[0]*this.vertices[0].x + this.normal[2]*this.vertices[0].z)/this.normal[1] + this.vertices[0].y;
		this.plane = new Plane(this.planeXCo,this.planeZCo,this.planeConstant);
		if (!this.vertical && typeof printing != 'undefined' && printing) {
			console.log(this.planeXCo,this.planeZCo,this.planeConstant);
		}
		
		if (this.vertical) {
			if (typeof printing != 'undefined' && printing) {
				console.log(this.normal,this.vertices[0]);
			}
			this.planeXCo = -this.normal[0]/this.normal[2];//x coefficient in the plane equation
			this.planeYCo = -this.normal[1]/this.normal[2];
			this.planeConstant = -(this.normal[0]*this.vertices[0].x + this.normal[1]*this.vertices[0].y)/this.normal[2] + this.vertices[0].z;
			this.plane = new Plane2(this.planeXCo,this.planeYCo,this.planeConstant);
			if (typeof printing != 'undefined' && printing) {
				console.log(this.planeXCo,this.planeYCo,this.planeConstant);
			}
		}
	}
	checkShouldDraw() {
		this.shouldDraw = false;
		this.shouldDrawShadow = false;
		for (var i = 0; i < this.vertices.length; i++) {
			if (this.vertices[i].z >= player.eyeZ && topScreenSlope * this.vertices[i].z + topScreenIntercept >= this.vertices[i].y
			&& bottomScreenSlope * this.vertices[i].z + bottomScreenIntercept < this.vertices[i].y
			&& leftScreenSlope * this.vertices[i].z + leftScreenIntercept < this.vertices[i].x
			&& rightScreenSlope * this.vertices[i].z + rightScreenIntercept >= this.vertices[i].x) {
				this.shouldDraw = true;
				//break;
			}
			if (this.vertices[i].shadowZ >= player.eyeZ && topScreenSlope * this.vertices[i].shadowZ + topScreenIntercept >= this.vertices[i].shadowY
			&& bottomScreenSlope * this.vertices[i].shadowZ + bottomScreenIntercept < this.vertices[i].shadowY
			&& leftScreenSlope * this.vertices[i].shadowZ + leftScreenIntercept < this.vertices[i].shadowX
			&& rightScreenSlope * this.vertices[i].shadowZ + rightScreenIntercept >= this.vertices[i].shadowX) {
				this.shouldDrawShadow = true;
				//console.log("hi");
				//break;
			} else {
				//console.log("nope");
			}
		}
		if (this.shouldDraw) {
			var check = [player.eyeX-this.vertices[1].x,player.eyeY-this.vertices[1].y,player.eyeZ-this.vertices[1].z];
			if (check[0] * this.normal[0] + check[1] * this.normal[1] + check[2] * this.normal[2] > 0) {
				this.shouldDraw = true;
			} else {
				this.shouldDraw = false;
			}
		}
	}
	drawIt() {
		if (this.shouldDraw) {
			fill(this.color[0],this.color[1],this.color[2],this.color[3]);
			//stroke(0,0,0);
			//strokeWeight(2);
			beginShape();
			for (var i = 0; i < this.vertices.length; i++) {
				vertex(this.vertices[i].screenX,this.vertices[i].screenY);
			}
			endShape(CLOSE);
			//noStroke();
		}
	}
	drawShadow() {
		if (this.shouldDrawShadow) {
			fill(0,0,0,100);
			beginShape();
			for (var i = 0; i < this.vertices.length; i++) {
				vertex(this.vertices[i].shadowScreenX,this.vertices[i].shadowScreenY);
			}
			endShape(CLOSE);
			//noStroke();
		}
	}
	drawPlane() {
		this.plane.drawIt();
	}
	updateLight() {
		var check = [sun.p[0]-this.vertices[1].x,sun.p[1]-this.vertices[1].y,sun.p[2]-this.vertices[1].z];
		var mag = Math.sqrt(check[0]*check[0]+check[1]*check[1]+check[2]*check[2]);
		check[0] /= mag;
		check[1] /= mag;
		check[2] /= mag;
		if (check[0] * this.normal[0] + check[1] * this.normal[1] + check[2] * this.normal[2] > 0) {
			this.lightLevel = check[0] * this.normal[0] + check[1] * this.normal[1] + check[2] * this.normal[2];
		} else {
			this.lightLevel = 0;
		}
		//this.color1 = myColor1;
		//this.color2 = myColor2;
		this.color = [];
		for (var i = 0; i < this.color1.length; i++) {
			this.color[i] = this.color1[i] * this.lightLevel + this.color2[i] * (1-this.lightLevel);
		}
		if (this.color.length < 4) {
			this.color[4] = 255;
		}
		/*for (var i = 0; i < this.vertices.length; i++) {
			this.vertices[i].getShadowVersion();
		}*/
	}
	respondToPlayer(printing) {
		//console.log(player.v[1]);
		//console.log(this.jumpPlatform);
		if (!this.vertical && player.p[1] > this.planeXCo*player.p[0] + this.planeZCo*player.p[2] + this.planeConstant - 5 &&
		player.p[1] < this.planeXCo*player.p[0] + this.planeZCo*player.p[2] + this.planeConstant + 5) {
			this.playerOn = true;
			var againstPartV = player.v[0]*this.normal[0] + player.v[1]*this.normal[1] + player.v[2]*this.normal[2];//portion of velocity going against the face (ie portion in the normal direction)
			var againstPartA = player.a[0]*this.normal[0] + player.a[1]*this.normal[1] + player.a[2]*this.normal[2];//portion of acceleration going against the face (ie portion in the normal direction)
			if (againstPartV <= 0) {//going towards
				var againstPartVArray = [againstPartV*this.normal[0], againstPartV*this.normal[1], againstPartV*this.normal[2]];
				player.v = [player.v[0]-againstPartVArray[0],player.v[1]-againstPartVArray[1],player.v[2]-againstPartVArray[2],player.v[3]];
				if (this.jumpPlatform) {
					player.onGround = true;
					
				}
			}
			if (againstPartA < 0) {//going towards
				var againstPartAArray = [againstPartA*this.normal[0], againstPartA*this.normal[1], againstPartA*this.normal[2]];
				player.a = [player.a[0]-againstPartAArray[0],player.a[1]-againstPartAArray[1],player.a[2]-againstPartAArray[2],player.a[3]];
			}
			if (player.v[0]*this.normal[0] + player.v[1]*this.normal[1] + player.v[2]*this.normal[2] < 0) {
				//console.log("What??");
			}
		}
		if (typeof printing != 'undefined' && printing && this.vertical) {
			console.log(this.planeXCo+player.p[0]+this.planeYCo*player.p[1]+this.planeConstant,player.p[2]);
		}
		if (this.vertical && player.p[2] > this.planeXCo*player.p[0] + this.planeYCo*player.p[1] + this.planeConstant - 10 &&
		player.p[2] < this.planeXCo*player.p[0] + this.planeYCo*player.p[1] + this.planeConstant + 10) {
			this.playerOn = true;
			var againstPartV = player.v[0]*this.normal[0] + player.v[1]*this.normal[1] + player.v[2]*this.normal[2];//portion of velocity going against the face (ie portion in the normal direction)
			var againstPartA = player.a[0]*this.normal[0] + player.a[1]*this.normal[1] + player.a[2]*this.normal[2];//portion of acceleration going against the face (ie portion in the normal direction)
			if (againstPartV < 0) {//going towards
				var againstPartVArray = [againstPartV*this.normal[0], againstPartV*this.normal[1], againstPartV*this.normal[2]];
				player.v = [player.v[0]-againstPartVArray[0],player.v[1]-againstPartVArray[1],player.v[2]-againstPartVArray[2],player.v[3]];
				if (this.jumpPlatform) {
					player.onGround = true;
				}
			}
			if (againstPartA < 0) {//going towards
				var againstPartAArray = [againstPartA*this.normal[0], againstPartA*this.normal[1], againstPartA*this.normal[2]];
				player.a = [player.a[0]-againstPartAArray[0],player.a[1]-againstPartAArray[1],player.a[2]-againstPartAArray[2],player.a[3]];
			}
			if (player.v[0]*this.normal[0] + player.v[1]*this.normal[1] + player.v[2]*this.normal[2] < 0) {
				//console.log("What??");
			}
			//console.log("hello");
		}
	}
	respondToPlayer2(printing) {
		//console.log(player.v[1]);
		//console.log(this.jumpPlatform);
		if (!this.vertical) {
			var intersects = false;
			for (var i = 0; i < remoteControl.v.length; i++) {
				if (remoteControl.v[i].y > this.planeXCo*remoteControl.v[i].x + this.planeZCo*remoteControl.v[i].z + this.planeConstant - 5 &&
		remoteControl.v[i].y < this.planeXCo*remoteControl.v[i].x + this.planeZCo*remoteControl.v[i].z + this.planeConstant + 5) {
					intersects = true;
					break;
				}
			}
			if (intersects) {
				console.log("hi");
			}
		} else {
			var intersects = false;
			for (var i = 0; i < remoteControl.v.length; i++) {
				if (remoteControl.v[i].z > this.planeXCo*remoteControl.v[i].x + this.planeYCo*remoteControl.v[i].y + this.planeConstant - 5 &&
		remoteControl.v[i].z < this.planeXCo*remoteControl.v[i].x + this.planeYCo*remoteControl.v[i].y + this.planeConstant + 5) {
					intersects = true;
					break;
				}
			}
			if (intersects) {
				console.log("hello");
				remoteForward = false;
			}
		}
		/*if (!this.vertical && remoteControl.v[0].y > this.planeXCo*remoteControl.v[0].x + this.planeZCo*remoteControl.v[0].z + this.planeConstant - 5 &&
		remoteControl.v[0].y < this.planeXCo*remoteControl.v[0].x + this.planeZCo*remoteControl.v[0].z + this.planeConstant + 5) {*/
			//this.playerOn = true;
			/*var againstPartV = player.v[0]*this.normal[0] + player.v[1]*this.normal[1] + player.v[2]*this.normal[2];//portion of velocity going against the face (ie portion in the normal direction)
			var againstPartA = player.a[0]*this.normal[0] + player.a[1]*this.normal[1] + player.a[2]*this.normal[2];//portion of acceleration going against the face (ie portion in the normal direction)
			if (againstPartV <= 0) {//going towards
				var againstPartVArray = [againstPartV*this.normal[0], againstPartV*this.normal[1], againstPartV*this.normal[2]];
				player.v = [player.v[0]-againstPartVArray[0],player.v[1]-againstPartVArray[1],player.v[2]-againstPartVArray[2],player.v[3]];
				if (this.jumpPlatform) {
					player.onGround = true;
					
				}
			}
			if (againstPartA < 0) {//going towards
				var againstPartAArray = [againstPartA*this.normal[0], againstPartA*this.normal[1], againstPartA*this.normal[2]];
				player.a = [player.a[0]-againstPartAArray[0],player.a[1]-againstPartAArray[1],player.a[2]-againstPartAArray[2],player.a[3]];
			}
			if (player.v[0]*this.normal[0] + player.v[1]*this.normal[1] + player.v[2]*this.normal[2] < 0) {
				//console.log("What??");
			}*/
			//console.log("hi");
		//}
		//if (this.vertical && remoteControl.v[0].z > this.planeXCo*remoteControl.v[0].x + this.planeYCo*remoteControl.v[0].y + this.planeConstant - 10 &&
		//remoteControl.v[0].z < this.planeXCo*remoteControl.v[0].x + this.planeYCo*remoteControl.v[0].y + this.planeConstant + 10) {
			//remoteForward = false;
			/*this.playerOn = true;
			var againstPartV = player.v[0]*this.normal[0] + player.v[1]*this.normal[1] + player.v[2]*this.normal[2];//portion of velocity going against the face (ie portion in the normal direction)
			var againstPartA = player.a[0]*this.normal[0] + player.a[1]*this.normal[1] + player.a[2]*this.normal[2];//portion of acceleration going against the face (ie portion in the normal direction)
			if (againstPartV < 0) {//going towards
				var againstPartVArray = [againstPartV*this.normal[0], againstPartV*this.normal[1], againstPartV*this.normal[2]];
				player.v = [player.v[0]-againstPartVArray[0],player.v[1]-againstPartVArray[1],player.v[2]-againstPartVArray[2],player.v[3]];
				if (this.jumpPlatform) {
					player.onGround = true;
				}
			}
			if (againstPartA < 0) {//going towards
				var againstPartAArray = [againstPartA*this.normal[0], againstPartA*this.normal[1], againstPartA*this.normal[2]];
				player.a = [player.a[0]-againstPartAArray[0],player.a[1]-againstPartAArray[1],player.a[2]-againstPartAArray[2],player.a[3]];
			}
			if (player.v[0]*this.normal[0] + player.v[1]*this.normal[1] + player.v[2]*this.normal[2] < 0) {
				//console.log("What??");
			}
			//console.log("hello");*/
			//console.log("hi");
		//}
	}
}

class Shape {
	constructor(vertices, faces, myCenter) {
		this.v = vertices;
		this.f = faces;
		this.center = myCenter;
	}
	updateScreenPos() {
		for (var i = 0; i < this.v.length; i++) {
			this.v[i].getShadowVersion();
			this.v[i].updateScreenPos();
		}
	}
	moveIt(direction, amount) {
		for (var i = 0; i < this.v.length; i++) {
			if (direction == "x") {
				this.v[i].x += amount;
			} else if (direction == "y") {
				this.v[i].y += amount;
			} else if (direction == "z") {
				this.v[i].z += amount;
			}
		}
		if (direction == "x") {
			this.center[0] += amount;
		} else if (direction == "z") {
			this.center[1] += amount;
		}
		for (var i = 0; i < this.f.length; i++) {
			this.f[i].updateLight();
		}
	}
	moveVertex(index, direction, amount) {
		if (direction == "x") {
			this.v[index].x += amount;
		} else if (direction == "y") {
			this.v[index].y += amount;
		} else if (direction == "z") {
			this.v[index].z += amount;
		}
		
		for (var i = 0; i < this.f.length; i++) {
			this.f[i].updateNormal();
			this.f[i].updateLight();
		}
	}
	rotate(centerX,centerZ,degreeShift,printing) {
		var rotateCenterX = centerX;
		var rotateCenterZ = centerZ;
		
		var zDiff;
		var xDiff;
		var radius;
		var currAngle;
		for (var i = 0; i < this.v.length; i++) {
			zDiff = this.v[i].z - rotateCenterZ;
			xDiff = this.v[i].x - rotateCenterX;
			radius = Math.sqrt(zDiff*zDiff+xDiff*xDiff);
			
			if (xDiff == 0 && zDiff == 0) {
				currAngle = 0;
				radius = 0;
			} else if (xDiff == 0) {
				if (zDiff > 0) {
					currAngle = 90;
				} else {
					currAngle = 270;
				}
			} else {
				currAngle = atan(zDiff/xDiff);
				if (xDiff < 0) {
					currAngle += 180;
				}
			}
			
			//for debug
			if (typeof printing != 'undefined' && printing && i == 0) {
				console.log(currAngle);
			}
			
			currAngle += degreeShift;
			
			this.v[i].x = rotateCenterX + radius * cos(currAngle);
			this.v[i].z = rotateCenterZ + radius * sin(currAngle);
		}
		zDiff = this.center[1] - rotateCenterZ;
		xDiff = this.center[0] - rotateCenterX;
		radius = Math.sqrt(zDiff*zDiff+xDiff*xDiff);
		
		if (xDiff == 0 && zDiff == 0) {
			currAngle = 0;
			radius = 0;
		} else if (xDiff == 0) {
			if (zDiff > 0) {
				currAngle = 90;
			} else {
				currAngle = 270;
			}
		} else {
			currAngle = atan(zDiff/xDiff);
			if (xDiff < 0) {
				currAngle += 180;
			}
		}
		
		currAngle += degreeShift;
		
		this.center[0] = rotateCenterX + radius * cos(currAngle);
		this.center[1] = rotateCenterZ + radius * sin(currAngle);
		
		for (var i = 0; i < this.f.length; i++) {
			this.f[i].updateNormal();
			this.f[i].updateLight();
		}
	}
	rotateCenter(degreeShift,printing) {
		this.rotate(this.center[0],this.center[1],degreeShift,printing);
	}
	respondToPlayer() {
		this.rotate(player.eyeX,player.eyeZ,player.v[3]);
	}
	drawShadow() {
		for (var i = 0; i < this.f.length; i++) {
			this.f[i].checkShouldDraw();
		}
		for (var i = 0; i < this.f.length; i++) {
			this.f[i].drawShadow();
		}
		/*for (var i = 0; i < this.v.length; i++) {
			this.v[i].drawIt();
		}*/
	}
	drawIt() {
		/*for (var i = 0; i < this.f.length; i++) {
			this.f[i].checkShouldDraw();
		}*/
		for (var i = 0; i < this.f.length; i++) {
			this.f[i].drawIt();
		}
		/*for (var i = 0; i < this.v.length; i++) {
			this.v[i].drawIt();
		}*/
	}
	setColor(r,g,b) {
		for (var i = 0; i < this.f.length; i++) {
			this.f[i].color = [r,g,b];
		}
	}
	updateLight(color1,color2) {
		for (var i = 0; i < this.f.length; i++) {
			this.f[i].color1 = color1;
			this.f[i].color2 = color2;
			this.f[i].updateLight();
		}
	}
}

class Box extends Shape {
	constructor(x1,y1,z1,w,l,h) {//Makes a box with one vertex at (x1, y1, z1) and width w, length l, and height h
		super([],[],[]);
		this.v = [];//vertices
		
		this.v[0] = new Vertex(x1,y1,z1);
		this.v[1] = new Vertex(x1+w,y1,z1);
		this.v[2] = new Vertex(x1+w,y1,z1+l);
		this.v[3] = new Vertex(x1,y1,z1+l);
		this.v[4] = new Vertex(x1,y1+h,z1);
		this.v[5] = new Vertex(x1+w,y1+h,z1);
		this.v[6] = new Vertex(x1+w,y1+h,z1+l);
		this.v[7] = new Vertex(x1,y1+h,z1+l);
		
		this.f = [];//faces
		
		this.f[0] = new Face([this.v[4],this.v[5],this.v[6],this.v[7]],1,[255,180,180],[255,0,0],0.9);
		this.f[1] = new Face([this.v[1],this.v[5],this.v[6],this.v[2]],-1,[255,180,180],[255,0,0],0.5);
		this.f[2] = new Face([this.v[0],this.v[1],this.v[2],this.v[3]],-1,[255,180,180],[255,0,0],0.1);
		this.f[3] = new Face([this.v[4],this.v[0],this.v[3],this.v[7]],-1,[255,180,180],[255,0,0],0.45);
		this.f[4] = new Face([this.v[4],this.v[5],this.v[1],this.v[0]],-1,[255,180,180],[255,0,0],0.5);
		this.f[5] = new Face([this.v[3],this.v[2],this.v[6],this.v[7]],-1,[255,180,180],[255,0,0],0.55);
		
		/*this.v[0].faces = [this.f[2],this.v,this.f[3],this.f[4]];
		this.v[1].faces = [this.f[2],this.v,this.f[1],this.f[4]];
		this.v[2].faces = [this.f[2],this.v,this.f[1],this.f[5]];
		this.v[3].faces = [this.f[2],this.v,this.f[3],this.f[5]];
		this.v[4].faces = [this.f[0],this.v,this.f[3],this.f[4]];
		this.v[5].faces = [this.f[0],this.v,this.f[1],this.f[4]];
		this.v[6].faces = [this.f[0],this.v,this.f[1],this.f[5]];
		this.v[7].faces = [this.f[0],this.v,this.f[3],this.f[5]];*/
		
		this.center = [];
		this.center[0] = (this.v[2].x-this.v[0].x)/2 + this.v[0].x;
		this.center[1] = (this.v[2].z-this.v[0].z)/2 + this.v[0].z;
		
		for (var i = 0; i < this.f.length; i++) {
			this.f[i].updateNormal();
		}
	}
}

class Octahedron extends Shape {
	constructor(x1,y1,z1,s) {
		super([],[],[]);
		this.v = [];
		this.v[0] = new Vertex(x1,y1+s/2,z1+s);
		this.v[1] = new Vertex(x1+s,y1+s/2,z1+s);
		this.v[2] = new Vertex(x1+s,y1+s/2,z1);
		this.v[3] = new Vertex(x1,y1+s/2,z1);
		this.v[4] = new Vertex(x1+s/2,y1+s,z1+s/2);
		this.v[5] = new Vertex(x1+s/2,y1,z1+s/2);
		
		this.f = [];
		this.f[0] = new Face([this.v[0],this.v[1],this.v[4]],-1,[255,180,180],[255,0,0],0.85);
		this.f[1] = new Face([this.v[4],this.v[1],this.v[2]],-1,[255,180,180],[255,0,0],0.8);
		this.f[2] = new Face([this.v[2],this.v[4],this.v[3]],1,[255,180,180],[255,0,0],0.7);
		this.f[3] = new Face([this.v[0],this.v[3],this.v[4]],1,[255,180,180],[255,0,0],0.75);
		this.f[4] = new Face([this.v[0],this.v[1],this.v[5]],1,[255,180,180],[255,0,0],0.35);
		this.f[5] = new Face([this.v[5],this.v[1],this.v[2]],1,[255,180,180],[255,0,0],0.25);
		this.f[6] = new Face([this.v[2],this.v[5],this.v[3]],-1,[255,180,180],[255,0,0],0.3);
		this.f[7] = new Face([this.v[0],this.v[3],this.v[5]],-1,[255,180,180],[255,0,0],0.2);
		
		this.center[0] = x1+s/2;
		this.center[1] = z1+s/2;
		
		for (var i = 0; i < this.f.length; i++) {
			this.f[i].updateNormal();
		}
	}
}

class BoxCloud extends Box {
	constructor(x1,y1,z1,w,l,h) {
		super(x1,y1,z1,w,l,h);
		this.updateLight([255,255,255,150],[200,200,220,150]);
		this.f[0].jumpPlatform = true;
		this.f[1].vertical = true;
		this.f[3].vertical = true;
		this.f[4].vertical = true;
		this.f[5].vertical = true;
		for (var i = 0; i < this.f.length; i++) {
			this.f[i].updateNormal();
		}
		this.f[0].updateNormal(false);
		this.f[4].updateNormal(true);
	}
	respondToPlayer() {
		super.respondToPlayer();
		//console.log(f[0])
		//for (var i = 2; i < 3; i++) {
			this.f[0].respondToPlayer2();
			this.f[4].respondToPlayer2(false);
			this.f[4].drawPlane();
			//console.log(this.f[4].vertical);
		//}
		//this.f[4].respondToPlayer();
		//this.f[0].drawPlane();
		//console.log(this.f[1].plane);
		//this.f[0].drawPlane();
	}
}

class Plane {
	constructor(xCo,zCo,constant) {
		this.xCo = xCo;
		this.zCo = zCo;
		this.constant = constant;
		
		this.points = [];
		for (var i = -15; i < 15; i++) {
			for (var j = -15; j < 15; j++) {
				this.points.push([i*30,xCo*i*30+zCo*j*30+constant,j*30]);
			}
		}
		this.screenPoints = [];
	}
	drawIt() {
		for (var i = 0; i < this.points.length; i++) {
			this.screenPoints[i] = xyz2xy(this.points[i][0],this.points[i][1],this.points[i][2]);
		}
		stroke(255,0,0);
		strokeWeight(3);
		for (var i = 0; i < this.points.length; i++) {
			point(this.screenPoints[i][0],this.screenPoints[i][1]);
		}
		noStroke();
	}
}

class Plane2 {
	constructor(xCo,yCo,constant) {
		this.xCo = xCo;
		this.yCo = yCo;
		this.constant = constant;
		
		this.points = [];
		for (var i = -15; i < 15; i++) {
			for (var j = -15; j < 15; j++) {
				this.points.push([i*30,j*30,xCo*i*30+yCo*j*30+constant]);
			}
		}
		this.screenPoints = [];
	}
	drawIt() {
		for (var i = 0; i < this.points.length; i++) {
			this.screenPoints[i] = xyz2xy(this.points[i][0],this.points[i][1],this.points[i][2]);
		}
		stroke(255,0,0);
		strokeWeight(3);
		for (var i = 0; i < this.points.length; i++) {
			point(this.screenPoints[i][0],this.screenPoints[i][1]);
		}
		noStroke();
	}
}

var test = new Box(-600,0,800,350,250,80);
//var testCloud = new BoxCloud(-600,200,800,350,250,80);
var testCloud2 = new BoxCloud(-200,20,600,350,250,80);
var remoteControl = new Box(-100,0,200,150,100,60);
remoteControl.w = 150;
remoteControl.l = 100;
remoteControl.h = 60;
//testCloud2.v[4].z += 25;
//testCloud2.v[5].z += 25;

var myOcts = [];

var octRadius = 1000;
var currentR, currentG, currentB;
for (var i = 0; i < 12; i++) {
	myOcts.push(new Octahedron(octRadius * Math.cos(i*30*Math.PI/180)+player.eyeX,0,octRadius * Math.sin(i*30*Math.PI/180)+player.eyeZ,180));
	currentR = 255*Math.random();
	currentG = 255*Math.random();
	currentB = 255*Math.random();
	myOcts[i].updateLight([currentR,currentG,currentB],[currentR/10,currentG/10,currentB/10]);
}

var spun = 0;

for (var i = 0; i < test.f.length; i++) {
	test.f[i].updateLight();
}

var allShapes = [];
//allShapes.push([testCloud.v[0].z,testCloud]);
allShapes.push([testCloud2.v[0].z,testCloud2]);
allShapes.push([remoteControl.v[0].z,remoteControl]);
for (var i = 0; i < myOcts.length/2; i++) {
	//allShapes.push([myOcts[i].v[0].z,myOcts[i]]);
}

function shapeSort(a, b) {
	return a[0] - b[0];
}

allShapes.sort(shapeSort);

function draw() {
	background(150,225,255);
	farAwayY = xyz2xy(0,0,1000000)[1];
	topScreenSlope = (player.zeroY-player.eyeY)/(player.zw-player.eyeZ);
	topScreenIntercept = player.zeroY - player.zw*(player.zeroY-player.eyeY)/(player.zw-player.eyeZ);
	bottomScreenSlope = (player.zeroY-canvasHeight-player.eyeY)/(player.zw-player.eyeZ);
	bottomScreenIntercept = player.zeroY-canvasHeight - player.zw*(player.zeroY-canvasHeight-player.eyeY)/(player.zw-player.eyeZ);
	leftScreenSlope = (-player.zeroX-player.eyeX)/(player.zw-player.eyeZ);
	leftScreenIntercept = player.zw*(player.zeroX+player.eyeX)/(player.zw-player.eyeZ) - player.zeroX;
	rightScreenSlope = (canvasWidth-player.zeroX-player.eyeX)/(player.zw-player.eyeZ);
	rightScreenIntercept = player.zw*(-canvasWidth+player.zeroX+player.eyeX)/(player.zw-player.eyeZ) + canvasWidth - player.zeroX;
	fill(100,255,100);
	rect(0,farAwayY,800,1000);
	fill(255,230,120);
	//ellipse(xyz2xy(sun[0],sun[1],sun[2])[0],xyz2xy(sun[0],sun[1],sun[2])[1],40,40);
	if (keyIsPressed) {
		if (keyCode == RIGHT_ARROW) {
			player.v[3] = 2;
		}
		if (keyCode == LEFT_ARROW) {
			player.v[3] = -2;
		}
		if (keyCode == UP_ARROW) {
			player.v[2] = 2;
		}
		if (keyCode == DOWN_ARROW) {
			player.v[2] = -2;
		}
		if (key == 'r') {
			spinning = true;
		}
		if (key == 'u') {
			player.v[1] = 2;
		}
		if (key == 'd') {
			player.v[1] = -2;
		}
		if (key == 'w') {
			remoteForward = true;
		}
	}
	if (keyIsReleased) {
		if (keyCode == RIGHT_ARROW) {
			player.v[3] = 0;
		}
		if (keyCode == LEFT_ARROW) {
			player.v[3] = 0;
		}
		if (keyCode == UP_ARROW) {
			player.v[2] = 0;
		}
		if (keyCode == DOWN_ARROW) {
			player.v[2] = 0;
		}
		if (key == 'r') {
			spinning = false;
		}
		if (key == 'u') {
			player.v[1] = 0;
		}
		if (key == 'd') {
			player.v[1] = 0;
		}
		if (key == 'w') {
			remoteForward = false;
		}
	}
	if (spinning) {
		for (var i = 0; i < allShapes.length; i++) {
			allShapes[i][1].rotateCenter(1);
		}
	}
	var currAngle;
	var radius = 1;
	if (forward[0] == 0 && forward[2] == 0) {
		currAngle = 0;
		radius = 0;
	} else if (forward[0] == 0) {
		if (forward[2] > 0) {
			currAngle = 90;
		} else {
			currAngle = 270;
		}
	} else {
		currAngle = atan(forward[2]/forward[0]);
		if (forward[0] < 0) {
			currAngle += 180;
		}
	}
	currAngle += player.v[3];
	forward[0] = radius * cos(currAngle);
	forward[2] = radius * sin(currAngle);
	
	sun.respondToPlayer();
	for (var i = allShapes.length - 1; i >= 0; i--) {
		allShapes[i][0] = allShapes[i][1].v[0].z;
	}
	allShapes.sort(shapeSort);
	for (var i = allShapes.length - 1; i >= 0; i--) {
		allShapes[i][1].respondToPlayer();
		allShapes[i][1].updateScreenPos();
	}
	for (var i = allShapes.length - 1; i >= 0; i--) {
		allShapes[i][1].drawShadow();
	}
	for (var i = allShapes.length - 1; i >= 0; i--) {
		allShapes[i][1].drawIt();
	}
	if (!player.jumping && player.p[1] < 10/* && player.p[1] > -10*/) {
		player.a[1] = 0;
		player.v[1] = 0;
		player.onGround = true;
	}
	player.moveIt();
	if (remoteForward) {
		remoteControl.moveIt("x",forward[0]*2);
		remoteControl.moveIt("z",forward[2]*2);
	}
	keyIsReleased = false;
};

