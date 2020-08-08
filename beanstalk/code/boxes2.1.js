//Created by Melody Ruth. Licensed under Attribution-NonCommercial-ShareAlike 3.0 Unported (CC BY-NC-SA 3.0)

//Updated painter's algorithm to be based on window z, not naive z. Made shadow transparency based on face transparency (now scaled version)

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
var mouseIsHeld = false;

function keyPressed() {
	keyIsPressed = true;
}

function keyReleased() {
	keyIsPressed = false;
	keyIsReleased = true;
}

function mousePressed() {
	mouseIsHeld = true;
}

function mouseReleased() {
	mouseIsHeld = false;
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

var normalizeVector = function(toNormalize) {
	var length = 0;
	for (var i = 0; i < toNormalize.length; i++) {
		length += toNormalize[i]*toNormalize[i];
	}
	length = Math.sqrt(length);
	var newVector = [];
	for (var i = 0; i < toNormalize.length; i++) {
		newVector[i] = toNormalize[i]/length;
	}
	return newVector;
}

var crossProduct = function(vector1, vector2) {
	var iPart = vector1[1] * vector2[2] - vector2[1] * vector1[2];
	var jPart = -vector1[0] * vector2[2] + vector2[0] * vector1[2];
	var kPart = vector1[0] * vector2[1] - vector2[0] * vector1[1];
	return [iPart, jPart, kPart];
}

var player = {};
player.eyeX = 0;
player.eyeY = 150;
player.eyeZ = -540;
player.zeroX = canvasWidth/2;
player.zeroY = canvasHeight;
player.zw = 0;
player.height = 150;
player.width = 30;
player.depth = 30;
player.p = [player.eyeX, player.eyeY-player.height, player.eyeZ];//position of feet
player.v = [0,0,0,0,0];//x, y, z, rotation xz, rotation yz
player.a = [0,0,0,0,0];//x, y, z, rotation xz, rotation yz
player.moveIt = function() {
	//console.log(this.onGround);
	if (keyIsPressed && key == ' ' && this.onGround) {
		this.jumping = true;
		this.v[1] = 5;
	}
	
	this.v[0] += this.a[0];
	this.v[1] += this.a[1];
	this.v[2] += this.a[2];
	
	this.p[0] += this.v[0];
	this.p[1] += this.v[1];
	this.p[2] += this.v[2];
	
	this.eyeX = this.p[0];
	this.eyeY = this.p[1]+this.height;
	this.eyeZ = this.p[2];
	
	this.a[1] = -0.1;
	this.onGround = false;
	this.jumping = false;
} 

var testPoint = [0,0,150];

var window = {};
window.fakeX = [1,0,0];
window.fakeY = [0,1,0];
window.fakeZ = [0,0,1];//Normal vector to window plane
window.eyeDistance = 540;//distance from the eye
window.theta = 90;//angle of main direction
window.phi = 0;//angle up and down
window.beta = 0;//additional left-right
window.cosMaxAngle = 0;//cos of angle between fakeZ and vector from eye to edge of canvas. Used to determine wher outside of window range
window.xyz2xy = function(x, y, z, printing) {
	//displacement is a vector from the point to the eye
	var displacement = [x - player.eyeX, y - player.eyeY, z - player.eyeZ];
	
	//fakeXPart is the amount the point is displaced from the eye in the direction across the screen ("x" direction)
	var fakeXPart = displacement[0] * this.fakeX[0] + displacement[1] * this.fakeX[1] + displacement[2] * this.fakeX[2];
	//fakeYPart is the amount the point is displaced from the eye in the direction across the screen ("y" direction)
	var fakeYPart = displacement[0] * this.fakeY[0] + displacement[1] * this.fakeY[1] + displacement[2] * this.fakeY[2];
	//fakeZPart is the amount the point is displaced from the eye in the direction across the screen ("z" direction)
	var fakeZPart = displacement[0] * this.fakeZ[0] + displacement[1] * this.fakeZ[1] + displacement[2] * this.fakeZ[2];
	
	if (typeof printing != 'undefined') {
		//console.log("Displacement: "+displacement);
		//console.log("fake parts",fakeXPart,fakeYPart,fakeZPart);
	}
	
	var screenPos = [];
	screenPos[0] = (fakeXPart * this.eyeDistance) / fakeZPart + canvasWidth/2;
	screenPos[1] = canvasHeight/2 - (fakeYPart * this.eyeDistance) / fakeZPart;
	return screenPos;
}
window.respondToPlayer = function() {
	//rotate based keys
	this.theta += player.v[3];
	var notUpPart = Math.sqrt(this.fakeZ[0] * this.fakeZ[0] + this.fakeZ[2] * this.fakeZ[2]);//Magnitude of the portion of fakeZ not in y
	this.fakeZ[0] = notUpPart * cos(this.theta + this.beta);
	this.fakeZ[2] = notUpPart * sin(this.theta + this.beta);
	
	//Rotate based on mouse (facing direction)
	mousePosition[0] = mouseX - canvasWidth/2;
	mousePosition[1] = -mouseY + canvasHeight/2;
	
	//Only adjust window if not in the center of the screen.
	//That way, the player can keep the mouse in the middle 10x10 square to stop the window from rotating
	if (mouseX > 0 && mouseX < canvasWidth && mouseY > 0 && mouseY < canvasHeight && (Math.abs(mousePosition[0]) > 5 || Math.abs(mousePosition[1]) > 5)) {
		//Start at position of center of screen. Then, go over fakeX for every pixel mouseX is to the right of center.
		//Finally, go over fakeY for every pixel mouseY is above center.
		mousePosition3D[0] = window.fakeZ[0] * window.eyeDistance + window.fakeX[0] * mousePosition[0] + window.fakeY[0] * mousePosition[1];
		mousePosition3D[1] = window.fakeZ[1] * window.eyeDistance + window.fakeX[1] * mousePosition[0] + window.fakeY[1] * mousePosition[1];
		mousePosition3D[2] = window.fakeZ[2] * window.eyeDistance + window.fakeX[2] * mousePosition[0] + window.fakeY[2] * mousePosition[1];
		
		mousePosition3D = normalizeVector(mousePosition3D);
		//Magnitude of the portion of mousePosition3D not in y
		var mouseNotUpPart = Math.sqrt(mousePosition3D[0] * mousePosition3D[0] + mousePosition3D[2] * mousePosition3D[2]);
		notUpPart = Math.sqrt(this.fakeZ[0] * this.fakeZ[0] + this.fakeZ[2] * this.fakeZ[2]);//Magnitude of the portion of fakeZ not in y
		
		//Phi
		var goalPhi = atan(mousePosition3D[1] / notUpPart) * 2 / 3;
		
		//Limit amount the player's "head" can "turn"
		if (goalPhi > 25) {
			goalPhi = 25;
		} else if (goalPhi < -25) {
			goalPhi = -25;
		}
		
		this.phi = 0.1 * goalPhi + 0.9 * this.phi;
		
		//Scale based on phi:
		//Scale xz part
		this.fakeZ[0] *= cos(this.phi) / notUpPart;
		this.fakeZ[2] *= cos(this.phi) / notUpPart;
		//Scale y part
		this.fakeZ[1] = sin(this.phi);
		
		//Beta
		goalBeta = (90 - acos(mousePosition[0]/(canvasWidth/2))) * 2 / 3;
		
		if (goalBeta > 25) {
			goalBeta = 25;
		} else if (goalBeta < -25) {
			goalBeta = -25;
		}
		this.beta = 0.1 * goalBeta + 0.9 * this.beta;
		//notUpPart = Math.sqrt(this.fakeZ[0] * this.fakeZ[0] + this.fakeZ[2] * this.fakeZ[2]);//Magnitude of the portion of fakeZ not in y
		//var goalBeta = (90-atan(mousePosition3D[2] / mousePosition3D[0])) * 2 / 7;
		//console.log(mousePosition3D[2], mousePosition3D[0], atan(mousePosition3D[2] / mousePosition3D[0]));
		/*if (goalBeta > 25) {
			goalBeta = 25;
		} else if (goalBeta < -25) {
			goalBeta = -25;
		}*/
		//this.beta = 0.1 * goalBeta + 0.9 * this.beta;
		
		//mousePosition3D[0] = 0.02*mousePosition3D[0] + 0.98 * window.fakeZ[0];
		//mousePosition3D[1] = 0.02*mousePosition3D[1] + 0.98 * window.fakeZ[1];
		//mousePosition3D[2] = 0.02*mousePosition3D[2] + 0.98 * window.fakeZ[2];
		
		//window.fakeZ = normalizeVector(mousePosition3D);
	}
	
	//console.log(this.beta);
	
	//Scale xz part
	this.fakeZ[0] *= cos(this.phi) / notUpPart;
	this.fakeZ[2] *= cos(this.phi) / notUpPart;
	//Scale y part
	this.fakeZ[1] = sin(this.phi);
	
	window.updatePosition();
}
window.updatePosition = function() {
	this.fakeX = crossProduct(this.fakeZ,[0,1,0]);
	this.fakeY = crossProduct(this.fakeX,this.fakeZ);
	this.cosMaxAngle = cos(atan(canvasWidth / (2 * this.eyeDistance)));
}

var xyz2xyOld = function(x, y, z) {
	return [(z-player.zw)*(player.eyeX-x)/(-player.eyeZ+z)+x+player.zeroX,player.zeroY-((z-player.zw)*(player.eyeY-y)/(-player.eyeZ+z)+y)];
};

var farAwayY = window.xyz2xy(0,0,1000000)[1];

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

var forward = [0,0,1];//fakeZ but without a y component and still with length 1

class Vertex {
	constructor(x,y,z,myFaces) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.screenX = x;
		this.screenY = y;
		this.offScreen;
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
		this.screenX = window.xyz2xy(this.x,this.y,this.z)[0];
		this.screenY = window.xyz2xy(this.x,this.y,this.z)[1];
		if (this.offScreen) {
			this.screenX = window.xyz2xy(this.pretendX,this.pretendY,this.pretendZ)[0];
			this.screenY = window.xyz2xy(this.pretendX,this.pretendY,this.pretendZ)[1];
		}
		this.shadowScreenX = window.xyz2xy(this.shadowX,this.shadowY,this.shadowZ)[0];
		this.shadowScreenY = window.xyz2xy(this.shadowX,this.shadowY,this.shadowZ)[1];
	}
	/*rotateUp() {
		var currAngle;
		var xDiff = this.x - player.eyeX;
		var yDiff = this.y - player.eyeY;
		var zDiff = this.z - player.eyeZ;
		var vertexForward = normalizeVector([xDiff,0,zDiff]);
		//fakeZDiff = vertexForward[0] * xDiff + vertexForward[1] * yDiff + vertexForward[2] * zDiff;
		var fakeZDiff = Math.sqrt(xDiff * xDiff + zDiff * zDiff);
		var radius = Math.sqrt(yDiff*yDiff+fakeZDiff*fakeZDiff);
		if (yDiff == 0 && fakeZDiff == 0) {
			currAngle = 0;
			radius = 0;
		} else if (fakeZDiff == 0) {
			if (yDiff > 0) {
				currAngle = 90;
			} else {
				currAngle = 270;
			}
		} else {
			currAngle = atan(yDiff/fakeZDiff);
			if (fakeZDiff < 0) {
				currAngle += 180;
			}
		}
		currAngle += player.v[4];
		this.y = player.eyeY + radius * sin(currAngle);
		var newFakeZDiff = radius * cos(currAngle);
		this.x = newFakeZDiff * vertexForward[0] + player.eyeX;
		this.z = newFakeZDiff * vertexForward[2] + player.eyeZ;
	}*/
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
		this.sideways = false;
		this.showing = [];//correspond to vertices. true means in front of window. false means behind window (not seen)
		this.pretendVertices = [];
		this.pretendVertexScreenPos = [];
		this.showingShadow = [];//correspond to vertices. true means in front of window. false means behind window (not seen)
		this.pretendVerticesShadow = [];
		this.pretendVertexScreenPosShadow = [];
		this.shadowOpacity = 255;
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
		//this.plane = new Plane(this.planeXCo,this.planeZCo,this.planeConstant);
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
			//this.plane = new Plane2(this.planeXCo,this.planeYCo,this.planeConstant);
			if (typeof printing != 'undefined' && printing) {
				console.log(this.planeXCo,this.planeYCo,this.planeConstant);
			}
			
			if (this.normal[2] == 0) {
				this.sideways = true;
				this.checkX = this.vertices[0].x;
			}
		}
	}
	checkShouldDraw(printing) {
		this.shouldDraw = false;
		this.shouldDrawShadow = false;
		this.passedFirstPart = false;
		var A = window.fakeZ[0];
		var B = window.fakeZ[1];
		var C = window.fakeZ[2];
		var b = [player.eyeX + 2 * A, player.eyeY + 2 * B, player.eyeZ + 2 * C];
		var D = A * b[0] + B * b[1] + C * b[2];
		//window is plane Ax + By + Cz = D
		
		//Check if eye is outside this face
		var check = [player.eyeX-this.vertices[0].x,player.eyeY-this.vertices[0].y,player.eyeZ-this.vertices[0].z];
		if (check[0] * this.normal[0] + check[1] * this.normal[1] + check[2] * this.normal[2] > 0) {
			this.passedFirstPart = true;
		}
		//Check if each vertex is on correct side of window
		for (var i = 0; i < this.vertices.length; i++) {
			var check = [this.vertices[i].x - b[0], this.vertices[i].y - b[1], this.vertices[i].z - b[2]];
			if (check[0] * A + check[1] * B + check[2] * C > 0) {
				this.showing[i] = true;
			} else {
				this.showing[i] = false;
			}
		}
		//Check if each shadow vertex is on correct side of window
		for (var i = 0; i < this.vertices.length; i++) {
			var check = [this.vertices[i].shadowX - b[0], this.vertices[i].shadowY - b[1], this.vertices[i].shadowZ - b[2]];
			if (check[0] * A + check[1] * B + check[2] * C > 0) {
				this.showingShadow[i] = true;
			} else {
				this.showingShadow[i] = false;
			}
		}
		for (var i = 0; i < this.vertices.length; i++) {
			if (this.passedFirstPart) {
				//If the eye is outside this face, check if we're within the scope of the window
				check = [player.eyeX-this.vertices[i].x,player.eyeY-this.vertices[i].y,player.eyeZ-this.vertices[i].z];
				var fakeYPart = check[0] * window.fakeY[0] + check[1] * window.fakeY[1] + check[2] * window.fakeY[2];
				check = [check[0] - fakeYPart * window.fakeY[0], check[1] - fakeYPart * window.fakeY[1], check[2] - fakeYPart * window.fakeY[2]];
				check = normalizeVector(check);
				if (-check[0] * window.fakeZ[0] + -check[1] * window.fakeZ[1] + -check[2] * window.fakeZ[2] > 0
				&& -check[0] * window.fakeZ[0] + -check[1] * window.fakeZ[1] + -check[2] * window.fakeZ[2] > window.cosMaxAngle) {
					this.shouldDraw = true;
				}
			}
			//Shadow
			check = [player.eyeX-this.vertices[i].shadowX,player.eyeY-this.vertices[i].shadowY,player.eyeZ-this.vertices[i].shadowZ];
			var fakeYPart = check[0] * window.fakeY[0] + check[1] * window.fakeY[1] + check[2] * window.fakeY[2];
			check = [check[0] - fakeYPart * window.fakeY[0], check[1] - fakeYPart * window.fakeY[1], check[2] - fakeYPart * window.fakeY[2]];
			check = normalizeVector(check);
			if (-check[0] * window.fakeZ[0] + -check[1] * window.fakeZ[1] + -check[2] * window.fakeZ[2] > 0
			&& -check[0] * window.fakeZ[0] + -check[1] * window.fakeZ[1] + -check[2] * window.fakeZ[2] > window.cosMaxAngle) {
				this.shouldDrawShadow = true;
			}
		}
		/*this.pretendVertices = [];
		for (var i = 0; i < this.vertices.length; i++) {
			this.pretendVertices.push([this.vertices[i].x,this.vertices[i].y,this.vertices[i].z]);
		}
		this.pretendVertexScreenPos = [];
		for (var i = 0; i < this.pretendVertices.length; i++) {
			this.pretendVertexScreenPos.push(window.xyz2xy(this.pretendVertices[i][0], this.pretendVertices[i][1], this.pretendVertices[i][2]));
		}*/
		
		//Deal with some points being off screen and others on screen:
		if (this.shouldDraw) {
			//Only bother if some of the points are visible
			this.pretendVertices = [];
			for (var i = 0; i < this.vertices.length - 1; i++) {
				if (this.showing[i] && this.showing[i + 1]) {
					this.pretendVertices.push([this.vertices[i].x,this.vertices[i].y,this.vertices[i].z]);
					this.pretendVertices.push([this.vertices[i + 1].x,this.vertices[i + 1].y,this.vertices[i + 1].z]);
				} else if (!this.showing[i] && this.showing[i + 1] || this.showing[i] && !this.showing[i + 1]) {
					var v1x = this.vertices[i].x;
					var v1y = this.vertices[i].y;
					var v1z = this.vertices[i].z;
					var v2x = this.vertices[i + 1].x;
					var v2y = this.vertices[i + 1].y;
					var v2z = this.vertices[i + 1].z;
					if (v1x * A + v1y * B + v1z * C - D < 0 && v2x * A + v2y * B + v2z * C - D < 0) {
						console.log("What??");
					}
					var t = (D - A * v1x - B * v1y - C * v1z) / (A * (v2x - v1x) + B * (v2y - v1y) + C * (v2z - v1z));
					var result = [v1x + (v2x - v1x) * t,v1y + (v2y - v1y) * t,v1z + (v2z - v1z) * t];
					if (this.showing[i]) {
						this.pretendVertices.push([this.vertices[i].x,this.vertices[i].y,this.vertices[i].z]);
						this.pretendVertices.push(result);
					} else {
						this.pretendVertices.push(result);
						this.pretendVertices.push([this.vertices[i + 1].x,this.vertices[i + 1].y,this.vertices[i + 1].z]);
					}
				}
			}
			if (this.showing[this.vertices.length - 1] && this.showing[0]) {
				this.pretendVertices.push([this.vertices[this.vertices.length - 1].x,this.vertices[this.vertices.length - 1].y,this.vertices[this.vertices.length - 1].z]);
				this.pretendVertices.push([this.vertices[0].x,this.vertices[0].y,this.vertices[0].z]);
			} else if (!this.showing[this.vertices.length - 1] && this.showing[0] || this.showing[this.vertices.length - 1] && !this.showing[0]) {
				var v1x = this.vertices[this.vertices.length - 1].x;
				var v1y = this.vertices[this.vertices.length - 1].y;
				var v1z = this.vertices[this.vertices.length - 1].z;
				var v2x = this.vertices[0].x;
				var v2y = this.vertices[0].y;
				var v2z = this.vertices[0].z;
				var t = (D - A * v1x - B * v1y - C * v1z) / (A * (v2x - v1x) + B * (v2y - v1y) + C * (v2z - v1z));
				if (Math.abs(t) > 1) {
					//console.log(t);
				}
				if (this.showing[this.vertices.length - 1]) {
					this.pretendVertices.push([this.vertices[this.vertices.length - 1].x,this.vertices[this.vertices.length - 1].y,this.vertices[this.vertices.length - 1].z]);
					this.pretendVertices.push([v1x + (v2x - v1x) * t,v1y + (v2y - v1y) * t,v1z + (v2z - v1z) * t]);
				} else {
					this.pretendVertices.push([v1x + (v2x - v1x) * t,v1y + (v2y - v1y) * t,v1z + (v2z - v1z) * t]);
					this.pretendVertices.push([this.vertices[0].x,this.vertices[0].y,this.vertices[0].z]);
				}

			}
			this.pretendVertexScreenPos = [];
			for (var i = 0; i < this.pretendVertices.length; i++) {
				this.pretendVertexScreenPos.push(window.xyz2xy(this.pretendVertices[i][0], this.pretendVertices[i][1], this.pretendVertices[i][2]));
			}
		}
		//Same thing for shadows
		if (this.shouldDrawShadow) {
			//Only bother if some of the points are visible
			this.pretendVerticesShadow = [];
			for (var i = 0; i < this.vertices.length - 1; i++) {
				if (this.showingShadow[i] && this.showingShadow[i + 1]) {
					this.pretendVerticesShadow.push([this.vertices[i].shadowX,this.vertices[i].shadowY,this.vertices[i].shadowZ]);
					this.pretendVertices.push([this.vertices[i + 1].shadowX,this.vertices[i + 1].shadowY,this.vertices[i + 1].shadowZ]);
				} else if (!this.showingShadow[i] && this.showingShadow[i + 1] || this.showingShadow[i] && !this.showingShadow[i + 1]) {
					var v1x = this.vertices[i].shadowX;
					var v1y = this.vertices[i].shadowY;
					var v1z = this.vertices[i].shadowZ;
					var v2x = this.vertices[i + 1].shadowX;
					var v2y = this.vertices[i + 1].shadowY;
					var v2z = this.vertices[i + 1].shadowZ;
					if (v1x * A + v1y * B + v1z * C - D < 0 && v2x * A + v2y * B + v2z * C - D < 0) {
						console.log("What??");
					}
					var t = (D - A * v1x - B * v1y - C * v1z) / (A * (v2x - v1x) + B * (v2y - v1y) + C * (v2z - v1z));
					var result = [v1x + (v2x - v1x) * t,v1y + (v2y - v1y) * t,v1z + (v2z - v1z) * t];
					if (this.showingShadow[i]) {
						this.pretendVerticesShadow.push([this.vertices[i].shadowX,this.vertices[i].shadowY,this.vertices[i].shadowZ]);
						this.pretendVerticesShadow.push(result);
					} else {
						this.pretendVerticesShadow.push(result);
						this.pretendVerticesShadow.push([this.vertices[i + 1].shadowX,this.vertices[i + 1].shadowY,this.vertices[i + 1].shadowZ]);
					}
				}
			}
			if (this.showingShadow[this.vertices.length - 1] && this.showingShadow[0]) {
				this.pretendVerticesShadow.push([this.vertices[this.vertices.length - 1].shadowX,this.vertices[this.vertices.length - 1].shadowY,this.vertices[this.vertices.length - 1].shadowZ]);
				this.pretendVerticesShadow.push([this.vertices[0].shadowX,this.vertices[0].shadowY,this.vertices[0].shadowZ]);
			} else if (!this.showingShadow[this.vertices.length - 1] && this.showingShadow[0] || this.showingShadow[this.vertices.length - 1] && !this.showingShadow[0]) {
				var v1x = this.vertices[this.vertices.length - 1].shadowX;
				var v1y = this.vertices[this.vertices.length - 1].shadowY;
				var v1z = this.vertices[this.vertices.length - 1].shadowZ;
				var v2x = this.vertices[0].shadowX;
				var v2y = this.vertices[0].shadowY;
				var v2z = this.vertices[0].shadowZ;
				var t = (D - A * v1x - B * v1y - C * v1z) / (A * (v2x - v1x) + B * (v2y - v1y) + C * (v2z - v1z));
				if (this.showingShadow[this.vertices.length - 1]) {
					this.pretendVerticesShadow.push([this.vertices[this.vertices.length - 1].shadowX,this.vertices[this.vertices.length - 1].shadowY,this.vertices[this.vertices.length - 1].shadowZ]);
					this.pretendVerticesShadow.push([v1x + (v2x - v1x) * t,v1y + (v2y - v1y) * t,v1z + (v2z - v1z) * t]);
				} else {
					this.pretendVerticesShadow.push([v1x + (v2x - v1x) * t,v1y + (v2y - v1y) * t,v1z + (v2z - v1z) * t]);
					this.pretendVerticesShadow.push([this.vertices[0].shadowX,this.vertices[0].shadowY,this.vertices[0].shadowZ]);
				}

			}
			this.pretendVertexScreenPosShadow = [];
			for (var i = 0; i < this.pretendVerticesShadow.length; i++) {
				this.pretendVertexScreenPosShadow.push(window.xyz2xy(this.pretendVerticesShadow[i][0], this.pretendVerticesShadow[i][1], this.pretendVerticesShadow[i][2]));
			}
		}
	}
	drawIt() {
		if (this.shouldDraw) {
			fill(this.color[0],this.color[1],this.color[2],this.color[3]);
			//stroke(0,0,0);
			//strokeWeight(2);
			beginShape();
			for (var i = 0; i < this.pretendVertexScreenPos.length; i++) {
				vertex(this.pretendVertexScreenPos[i][0],this.pretendVertexScreenPos[i][1]);	
			}
			endShape(CLOSE);
			//noStroke();
		}
	}
	drawShadow() {
		if (this.shouldDrawShadow) {
			fill(0,0,0,this.shadowOpacity);
			beginShape();
			for (var i = 0; i < this.pretendVertexScreenPosShadow.length; i++) {
				vertex(this.pretendVertexScreenPosShadow[i][0],this.pretendVertexScreenPosShadow[i][1]);	
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
			this.color[3] = 255;
		}
		this.shadowOpacity = this.color[3] * 0.39;
		/*for (var i = 0; i < this.vertices.length; i++) {
			this.vertices[i].getShadowVersion();
		}*/
	}
	respondToPlayer(printing) {
		var start = player.v[1];
		if (typeof printing != 'undefined' && printing) {
			console.log(this.normal);
		}
		//Non-vertical
		var againstPartV;
		if (!this.vertical && player.p[1] > this.planeXCo*player.p[0] + this.planeZCo*player.p[2] + this.planeConstant - 10 &&
		player.p[1] < this.planeXCo*player.p[0] + this.planeZCo*player.p[2] + this.planeConstant + 10) {
			//console.log("hi");
			this.playerOn = true;
			againstPartV = player.v[0]*this.normal[0] + player.v[1]*this.normal[1] + player.v[2]*this.normal[2];//portion of velocity going against the face (ie portion in the normal direction)
			var againstPartA = player.a[0]*this.normal[0] + player.a[1]*this.normal[1] + player.a[2]*this.normal[2];//portion of acceleration going against the face (ie portion in the normal direction)
			if (againstPartV < 0) {//going towards
				var againstPartVArray = [againstPartV*this.normal[0], againstPartV*this.normal[1], againstPartV*this.normal[2]];
				player.v = [player.v[0]-againstPartVArray[0],player.v[1]-againstPartVArray[1],player.v[2]-againstPartVArray[2],player.v[3],player.v[4]];
				if (this.jumpPlatform) {
					player.onGround = true;
				}
			}
			if (againstPartA < 0) {//going towards
				var againstPartAArray = [againstPartA*this.normal[0], againstPartA*this.normal[1], againstPartA*this.normal[2]];
				player.a = [player.a[0]-againstPartAArray[0],player.a[1]-againstPartAArray[1],player.a[2]-againstPartAArray[2],player.a[3]];
			}
			player.p[1] = this.planeXCo*player.p[0] + this.planeZCo*player.p[2] + this.planeConstant;
			//Push out just slightly so that you can still see the box
			/*player.p[0] += this.normal[0] * 6;
			player.p[1] += this.normal[1] * 6;
			player.p[2] += this.normal[2] * 6;*/
		}
		//Vertical
		if (this.sideways && player.p[0] > this.checkX - 10 && player.p[0] < this.checkX + 10) {
			this.playerOn = true;
			againstPartV = player.v[0]*this.normal[0] + player.v[1]*this.normal[1] + player.v[2]*this.normal[2];//portion of velocity going against the face (ie portion in the normal direction)
			var againstPartA = player.a[0]*this.normal[0] + player.a[1]*this.normal[1] + player.a[2]*this.normal[2];//portion of acceleration going against the face (ie portion in the normal direction)
			if (againstPartV < 0) {//going towards
				var againstPartVArray = [againstPartV*this.normal[0], againstPartV*this.normal[1], againstPartV*this.normal[2]];
				player.v = [player.v[0]-againstPartVArray[0],player.v[1]-againstPartVArray[1],player.v[2]-againstPartVArray[2],player.v[3],player.v[4]];
				if (this.jumpPlatform) {
					player.onGround = true;
				}
			}
			if (againstPartA < 0) {//going towards
				var againstPartAArray = [againstPartA*this.normal[0], againstPartA*this.normal[1], againstPartA*this.normal[2]];
				player.a = [player.a[0]-againstPartAArray[0],player.a[1]-againstPartAArray[1],player.a[2]-againstPartAArray[2],player.a[3]];
			}
			player.p[0] = this.checkX;
			//Push out just slightly so that you can still see the box
			/*player.p[0] += this.normal[0] * 6;
			player.p[1] += this.normal[1] * 6;
			player.p[2] += this.normal[2] * 6;*/
		} else if (this.vertical && player.p[2] > this.planeXCo*player.p[0] + this.planeYCo*player.p[1] + this.planeConstant - 10 &&
		player.p[2] < this.planeXCo*player.p[0] + this.planeYCo*player.p[1] + this.planeConstant + 10) {
			if (typeof printing != 'undefined' && printing) {
				console.log("hi");
			}
			this.playerOn = true;
			againstPartV = player.v[0]*this.normal[0] + player.v[1]*this.normal[1] + player.v[2]*this.normal[2];//portion of velocity going against the face (ie portion in the normal direction)
			var againstPartA = player.a[0]*this.normal[0] + player.a[1]*this.normal[1] + player.a[2]*this.normal[2];//portion of acceleration going against the face (ie portion in the normal direction)
			if (againstPartV < 0) {//going towards
				var againstPartVArray = [againstPartV*this.normal[0], againstPartV*this.normal[1], againstPartV*this.normal[2]];
				player.v = [player.v[0]-againstPartVArray[0],player.v[1]-againstPartVArray[1],player.v[2]-againstPartVArray[2],player.v[3],player.v[4]];
				if (this.jumpPlatform) {
					player.onGround = true;
				}
			}
			if (againstPartA < 0) {//going towards
				var againstPartAArray = [againstPartA*this.normal[0], againstPartA*this.normal[1], againstPartA*this.normal[2]];
				player.a = [player.a[0]-againstPartAArray[0],player.a[1]-againstPartAArray[1],player.a[2]-againstPartAArray[2],player.a[3]];
			}
			player.p[2] = this.planeXCo*player.p[0] + this.planeYCo*player.p[1] + this.planeConstant;
			//Push out just slightly so that you can still see the box
			/*player.p[0] += this.normal[0] * 6;
			player.p[1] += this.normal[1] * 6;
			player.p[2] += this.normal[2] * 6;*/
		}
		if (typeof printing != 'undefined' && printing && player.v[1] != start) {
			//console.log(player.p[1]);
		}
	}
	respondToPlayer2(printing) {
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
				//console.log("hi");
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
				//console.log("hello");
				remoteForward = false;
			}
		}
	}
	checkInside(point, printing) {
		var check = [point[0]-this.vertices[0].x,point[1]-this.vertices[0].y,point[2]-this.vertices[0].z];
		if (check[0] * this.normal[0] + check[1] * this.normal[1] + check[2] * this.normal[2] < 0) {
			if (typeof printing != 'undefined' && printing) {
				console.log("hi");
			}
			return true;
		} else {
			return false;
		}
	}
}

class Shape {
	constructor(vertices, faces, myCenter) {
		this.v = vertices;
		this.f = faces;
		this.center = myCenter;
		this.playerOn = false;
		this.exists = true;
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
		//checkCollision();
	}
	drawShadow() {
		for (var i = 0; i < this.f.length; i++) {
			if (i == 0) {
				this.f[i].checkShouldDraw(true);
			} else {
				this.f[i].checkShouldDraw();
			}
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
	collide() {
		var didSide = false;
		this.playerOn = false;
		//Do sides (and top):
		for (var i = 0; i < this.f.length; i++) {
			if (!this.f[i].isBottom) {
				this.f[i].respondToPlayer();
				if (this.f[i].playerOn) {
					didSide = true;
					if (this.f[i].jumpPlatform) {
						this.playerOn = true;
					}
				}
			}
		}
		if (!didSide) {
			//Do bottoms:
			for (var i = 0; i < this.f.length; i++) {
				if (this.f[i].isBottom) {
					this.f[i].respondToPlayer();
				}
			}	
		}
	}
	//returns true if collision detected, false otherwise
	checkCollision() {
		this.headInside = [];
		this.feetInside = [];
		var insideAll = true;
		for (var i = 0; i < this.f.length; i++) {
			this.headInside[i] = this.f[i].checkInside([player.p[0], player.p[1] + player.height, player.p[2]]);
			if (!this.headInside[i]) {
				insideAll = false;
			}
		}
		if (insideAll) {
			//Head is inside all faces
			this.collide();
			return true;
		}
		var insideAll = true;
		for (var i = 0; i < this.f.length; i++) {
			this.feetInside[i] = this.f[i].checkInside([player.p[0], player.p[1], player.p[2]]);
			if (!this.feetInside[i]) {
				insideAll = false;
			}
		}
		if (insideAll) {
			//Feet are inside all faces
			this.collide();
			return true;
		}
		//console.log(this.headInside[0],this.feetInside[0]);
		//Check if head and feet agree
		var toTest;
		for (var i = 0; i < this.f.length; i++) {
			if (this.headInside[i] != this.feetInside[i]) {
				//toTest is the point on the line segment from the player's feet to their head and just inside the plane of this face
				toTest = [player.p[0], this.f[i].planeXCo*player.p[0] + this.f[i].planeZCo*player.p[2] + this.f[i].planeConstant, player.p[2]];
				toTest[0] -= this.f[i].normal[0];
				toTest[1] -= this.f[i].normal[1];
				toTest[2] -= this.f[i].normal[2];
				//Shouldn't ever be vertical if we're in this situation, but just in case don't bother trying if it's vertical
				if (!this.f[i].vertical) {
					insideAll = true;
					for (var i = 0; i < this.f.length; i++) {
						if (!this.f[i].checkInside([toTest[0], toTest[1], toTest[2]])) {
							insideAll = false;
						}
					}
					if (insideAll) {
						//new point is inside all faces
						this.collide();
						return true;
					}
				}
			}
		}
		return false;
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
		this.f[2].isBottom = true;
		for (var i = 0; i < this.f.length; i++) {
			this.f[i].updateNormal();
		}
		this.f[0].updateNormal(false);
		this.f[4].updateNormal(false);
		this.opacity = 150;
		this.exists = true;
	}
	respondToPlayer() {
		this.updateLight([255,255,255,this.opacity],[200,200,220,this.opacity]);
		if (this.playerOn) {
			this.opacity -= 0.5;
		}
		this.playerOn = false;
		if (this.opacity < 0) {
			this.exists = false;
		}
		super.respondToPlayer();
		super.checkCollision();
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
			this.screenPoints[i] = window.xyz2xy(this.points[i][0],this.points[i][1],this.points[i][2]);
		}
		stroke(255,0,0);
		strokeWeight(3);
		for (var i = 0; i < this.points.length; i++) {
			point(this.screenPoints[i][0],this.screenPoints[i][1]);
		}
		noStroke();
	}
}

//var testPlane = new Plane(-1,1,-800);

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
			this.screenPoints[i] = window.xyz2xy(this.points[i][0],this.points[i][1],this.points[i][2]);
		}
		stroke(255,0,0);
		strokeWeight(3);
		for (var i = 0; i < this.points.length; i++) {
			point(this.screenPoints[i][0],this.screenPoints[i][1]);
		}
		noStroke();
	}
}

//z = constant
class Plane3 {
	constructor(constant) {
		this.constant = constant;
		
		this.points = [];
		for (var i = -15; i < 15; i++) {
			for (var j = -15; j < 15; j++) {
				this.points.push([i*30,j*30,this.constant]);
			}
		}
		this.screenPoints = [];
	}
	drawIt() {
		for (var i = 0; i < this.points.length; i++) {
			this.screenPoints[i] = window.xyz2xy(this.points[i][0],this.points[i][1],this.points[i][2]);
		}
		stroke(255,0,0);
		strokeWeight(3);
		for (var i = 0; i < this.points.length; i++) {
			point(this.screenPoints[i][0],this.screenPoints[i][1]);
		}
		noStroke();
	}
}

//var testPlane = new Plane3(750);

var test = new Box(-600,0,800,350,250,80);
//var testCloud = new BoxCloud(-600,200,800,350,250,80);
var testCloud2 = new BoxCloud(-200,20,600,150,250,80);
var testCloud3 = new BoxCloud(-200,120,850,150,250,80);
var testCloud4 = new BoxCloud(-200,150,1200,150,250,80);
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
allShapes.push([testCloud3.v[0].z,testCloud3]);
allShapes.push([testCloud4.v[0].z,testCloud4]);
//allShapes.push([remoteControl.v[0].z,remoteControl]);
for (var i = 0; i < myOcts.length/2; i++) {
	//allShapes.push([myOcts[i].v[0].z,myOcts[i]]);
}

function shapeSort(a, b) {
	return a[0] - b[0];
}

allShapes.sort(shapeSort);

var windowTestCounter = 0;
var mousePosition = [];
var mousePosition3D = [];

function draw() {
	//noLoop();
	background(150,225,255);
	farAwayY = window.xyz2xy(0,0,1000000)[1];
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
	//ellipse(window.xyz2xy(sun[0],sun[1],sun[2])[0],window.xyz2xy(sun[0],sun[1],sun[2])[1],40,40);
	if (keyIsPressed) {
		if (keyCode == RIGHT_ARROW) {
			//player.v[3] = 2;
			goingRight = true;
		}
		if (keyCode == LEFT_ARROW) {
			//player.v[3] = -2;
			goingLeft = true;
		}
		if (keyCode == UP_ARROW) {
			//player.v[4] = -2;
			//player.v[0] = 2*forward[0];
			//player.v[2] = 2*forward[2];
			goingForward = true;
		}
		if (keyCode == DOWN_ARROW) {
			//player.v[4] = 2;
			//player.v[0] = -2*forward[0];
			//player.v[2] = -2*forward[2];
			goingBack = true;
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
	/*if (mouseIsHeld) {
		player.v[0] = 2*forward[0];
		player.v[2] = 2*forward[2];
	} else {
		player.v[0] = 0;
		player.v[2] = 0;
	}*/
	if (keyIsReleased) {
		if (keyCode == RIGHT_ARROW) {
			//player.v[3] = 0;
			goingRight = false;
		}
		if (keyCode == LEFT_ARROW) {
			player.v[3] = 0;
			goingLeft = false;
		}
		if (keyCode == UP_ARROW) {
			//player.v[4] = 0;
			//player.v[0] = 0;
			//player.v[2] = 0;
			goingForward = false;
		}
		if (keyCode == DOWN_ARROW) {
			//player.v[4] = 0;
			//player.v[0] = 0;
			//player.v[2] = 0;
			goingBack = false;
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
	/*var currAngle;
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
	forward[2] = radius * sin(currAngle);*/
	forward = normalizeVector([window.fakeZ[0],0,window.fakeZ[2]]);
	
	//Player movement prior to any collisions:
	if (goingRight) {
		player.v[3] = 2;
	} else if (goingLeft) {
		player.v[3] = -2;
	} else {
		player.v[3] = 0;
	}
	if (goingForward) {
		player.v[0] = 2*forward[0];
		player.v[2] = 2*forward[2];
	} else if (goingBack) {
		player.v[0] = -2*forward[0];
		player.v[2] = -2*forward[2];
	} else {
		player.v[0] = 0;
		player.v[2] = 0;
	}
	
	//sun.respondToPlayer();
	for (var i = allShapes.length - 1; i >= 0; i--) {
		if (!allShapes[i][1].exists) {
			allShapes.splice(i,1);
		}
	}
	
	for (var i = allShapes.length - 1; i >= 0; i--) {
		allShapes[i][0] = allShapes[i][1].v[0].x * window.fakeZ[0] + allShapes[i][1].v[0].y * window.fakeZ[1] + allShapes[i][1].v[0].z * window.fakeZ[2];
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
	
	window.respondToPlayer();
	
	fill(255,0,0);
	//console.log(testPoint[1]);
	//ellipse(canvasWidth/2,canvasHeight/2,2,2);
	if (remoteForward) {
		//remoteControl.moveIt("x",forward[0]*2);
		remoteControl.moveIt("z",2);
	}
	/*if (windowTestCounter > -1000) {
		windowTestCounter--;
	}*/
	//testPlane.drawIt();
	//console.log(player.p[2]);
	keyIsReleased = false;
};

