//Created by Melody Ruth. Licensed under Attribution-NonCommercial-ShareAlike 3.0 Unported (CC BY-NC-SA 3.0)

//shadows

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

var eyeX = 0;
var eyeY = 300;
var eyeZ = -540;
var zw = 0;

var zeroX = canvasWidth/2;
var zeroY = canvasHeight;

var xyz2xy = function(x, y, z) {
	return [(z-zw)*(eyeX-x)/(-eyeZ+z)+x+zeroX,zeroY-((z-zw)*(eyeY-y)/(-eyeZ+z)+y)];
};

var farAwayY = xyz2xy(0,0,1000000)[1];

var topScreenSlope = (zeroY-eyeY)/(zw-eyeZ);
var topScreenIntercept = zeroY - zw*(zeroY-eyeY)/(zw-eyeZ);

var bottomScreenSlope = (zeroY-canvasHeight-eyeY)/(zw-eyeZ);
var bottomScreenIntercept = zeroY-canvasHeight - zw*(zeroY-canvasHeight-eyeY)/(zw-eyeZ);

var leftScreenSlope = (-zeroX-eyeX)/(zw-eyeZ);
var leftScreenIntercept = zw*(zeroX+eyeX)/(zw-eyeZ) - zeroX;

var rightScreenSlope = (canvasWidth-zeroX-eyeX)/(zw-eyeZ);
var rightScreenIntercept = zw*(-canvasWidth+zeroX+eyeX)/(zw-eyeZ) + canvasWidth - zeroX;

var sun = [0,1000,40];

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
		shadow[0] = (this.x-sun[0])*sun[1]/(sun[1]-this.y);
		shadow[1] = 0;
		shadow[2] = (this.z-sun[2])*sun[1]/(sun[1]-this.y);
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
		shadow[0] = (this.x-sun[0])*sun[1]/(sun[1]-this.y) + sun[0];
		shadow[1] = 0;
		shadow[2] = (this.z-sun[2])*sun[1]/(sun[1]-this.y) + sun[2];
		this.shadowX = shadow[0];
		this.shadowY = shadow[1];
		this.shadowZ = shadow[2];
		/*if (keyIsPressed && key == ' ') {
			console.log(this.shadowX,this.shadowY,this.shadowZ);
		}*/
		return shadow;
	}
}

var testingVertex = new Vertex(500,0,300);
console.log(testingVertex.getShadowVersion());

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
		this.shouldDraw = true;
	}
	updateNormal() {
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
	}
	checkShouldDraw() {
		this.shouldDraw = false;
		this.shouldDrawShadow = false;
		for (var i = 0; i < this.vertices.length; i++) {
			if (this.vertices[i].z >= eyeZ && topScreenSlope * this.vertices[i].z + topScreenIntercept >= this.vertices[i].y
			&& bottomScreenSlope * this.vertices[i].z + bottomScreenIntercept < this.vertices[i].y
			&& leftScreenSlope * this.vertices[i].z + leftScreenIntercept < this.vertices[i].x
			&& rightScreenSlope * this.vertices[i].z + rightScreenIntercept >= this.vertices[i].x) {
				this.shouldDraw = true;
				//break;
			}
			if (this.vertices[i].shadowZ >= eyeZ && topScreenSlope * this.vertices[i].shadowZ + topScreenIntercept >= this.vertices[i].shadowY
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
			var check = [eyeX-this.vertices[1].x,eyeY-this.vertices[1].y,eyeZ-this.vertices[1].z];
			if (check[0] * this.normal[0] + check[1] * this.normal[1] + check[2] * this.normal[2] > 0) {
				this.shouldDraw = true;
			} else {
				this.shouldDraw = false;
			}
		}
	}
	drawIt() {
		if (this.shouldDraw) {
			fill(this.color[0],this.color[1],this.color[2]);
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
	updateLight() {
		var check = [sun[0]-this.vertices[1].x,sun[1]-this.vertices[1].y,sun[2]-this.vertices[1].z];
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
		for (var i = 0; i < 3; i++) {
			this.color[i] = this.color1[i] * this.lightLevel + this.color2[i] * (1-this.lightLevel);
		}
		/*for (var i = 0; i < this.vertices.length; i++) {
			this.vertices[i].getShadowVersion();
		}*/
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
		if (rotatingRight) {
			this.rotate(eyeX,eyeZ,1);
		} else if (rotatingLeft) {
			this.rotate(eyeX,eyeZ,-1);
		}
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

var test = new Box(-600,0,800,350,250,80);

test.moveVertex(5,"z",100);
test.moveVertex(1,"z",100);

test.v.push(new Vertex(-500,80,800));//8
test.v.push(new Vertex(-500,0,800));//9

test.f[4].vertices = [test.v[4],test.v[8],test.v[9],test.v[0]];
test.f[0].vertices = [test.v[4],test.v[8],test.v[5],test.v[6],test.v[7]];
test.f[2].vertices = [test.v[0],test.v[9],test.v[1],test.v[2],test.v[3]];

test.f.push(new Face([test.v[8],test.v[5],test.v[1],test.v[9]],-1,[255,180,180],[255,0,0],0.45));

for (var i = 0; i < test.f.length; i++) {
	test.f[i].updateNormal();
}

var testOct = new Octahedron(300,0,400,180);

var myOcts = [];

var octRadius = 1000;
var currentR, currentG, currentB;
for (var i = 0; i < 12; i++) {
	myOcts.push(new Octahedron(octRadius * Math.cos(i*30*Math.PI/180)+eyeX,0,octRadius * Math.sin(i*30*Math.PI/180)+eyeZ,180));
	currentR = 255*Math.random();
	currentG = 255*Math.random();
	currentB = 255*Math.random();
	myOcts[i].updateLight([currentR,currentG,currentB],[currentR/10,currentG/10,currentB/10]);
}

var spun = 0;

for (var i = 0; i < test.f.length; i++) {
	test.f[i].updateLight();
}

function draw() {
	background(150,225,255);
	farAwayY = xyz2xy(0,0,1000000)[1];
	topScreenSlope = (zeroY-eyeY)/(zw-eyeZ);
	topScreenIntercept = zeroY - zw*(zeroY-eyeY)/(zw-eyeZ);
	bottomScreenSlope = (zeroY-canvasHeight-eyeY)/(zw-eyeZ);
	bottomScreenIntercept = zeroY-canvasHeight - zw*(zeroY-canvasHeight-eyeY)/(zw-eyeZ);
	leftScreenSlope = (-zeroX-eyeX)/(zw-eyeZ);
	leftScreenIntercept = zw*(zeroX+eyeX)/(zw-eyeZ) - zeroX;
	rightScreenSlope = (canvasWidth-zeroX-eyeX)/(zw-eyeZ);
	rightScreenIntercept = zw*(-canvasWidth+zeroX+eyeX)/(zw-eyeZ) + canvasWidth - zeroX;
	fill(100,255,100);
	rect(0,farAwayY,800,1000);
	fill(255,230,120);
	//ellipse(xyz2xy(sun[0],sun[1],sun[2])[0],xyz2xy(sun[0],sun[1],sun[2])[1],40,40);
	if (keyIsPressed) {
		if (keyCode == RIGHT_ARROW) {
			rotatingRight = true;
		}
		if (keyCode == LEFT_ARROW) {
			rotatingLeft = true;
		}
		if (keyCode == UP_ARROW) {
			goingForward = true;
		}
		if (keyCode == DOWN_ARROW) {
			goingBack = true;
		}
		if (key == 'r') {
			spinning = true;
		}
		if (key == 'u') {
			goingUp = true;
		}
		if (key == 'd') {
			goingDown = true;
		}
	}
	if (keyIsReleased) {
		if (keyCode == RIGHT_ARROW) {
			rotatingRight = false;
		}
		if (keyCode == LEFT_ARROW) {
			rotatingLeft = false;
		}
		if (keyCode == UP_ARROW) {
			goingForward = false;
		}
		if (keyCode == DOWN_ARROW) {
			goingBack = false;
		}
		if (key == 'r') {
			spinning = false;
		}
		if (key == 'u') {
			goingUp = false;
		}
		if (key == 'd') {
			goingDown = false;
		}
	}
	if (goingRight) {
		eyeX+=2;
		zeroX-=2;
	}
	if (goingLeft) {
		eyeX-=2;
		zeroX+=2;
	}
	var currAngle;
	if (rotatingRight) {
		var zDiff = this.sun[2] - eyeZ;
		var xDiff = this.sun[0] - eyeX;
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
		
		currAngle++;
		
		this.sun[0] = eyeX + radius * cos(currAngle);
		this.sun[2] = eyeZ + radius * sin(currAngle);
	}
	if (rotatingLeft) {
		var zDiff = this.sun[2] - eyeZ;
		var xDiff = this.sun[0] - eyeX;
		var radius = Math.sqrt(zDiff*zDiff+xDiff*xDiff);
		//var currAngle;
		
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
		
		currAngle--;
		
		this.sun[0] = eyeX + radius * cos(currAngle);
		this.sun[2] = eyeZ + radius * sin(currAngle);
	}
	if (goingUp) {
		eyeY+=2;
		zeroY+=2;
	}
	if (goingDown) {
		eyeY-=2;
		zeroY-=2;
	}
	if (goingForward) {
		eyeZ+=2;
		zw+=2;
	}
	if (goingBack) {
		eyeZ-=2;
		zw-=2;
	}
	if (spinning) {
		test.rotateCenter(1);
		//testOct.rotateCenter(1);
		for (var i = 0; i < myOcts.length; i++) {
			myOcts[i].rotateCenter(1);
		}
		spun++;
	}
	test.respondToPlayer();
	test.updateScreenPos();
	test.drawShadow();
	test.drawIt();
	
	for (var i = 0; i < myOcts.length; i++) {
		myOcts[i].respondToPlayer();
		myOcts[i].updateScreenPos();
	}
	for (var i = 0; i < myOcts.length; i++) {
		myOcts[i].drawShadow();
	}
	for (var i = 0; i < myOcts.length; i++) {
		myOcts[i].drawIt();
	}
	
	//testOct.respondToPlayer();
	//testOct.updateScreenPos();
	//testOct.drawIt();
	keyIsReleased = false;
};

