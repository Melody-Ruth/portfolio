//Created by Melody Ruth. Licensed under Attribution-NonCommercial-ShareAlike 3.0 Unported (CC BY-NC-SA 3.0)

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
var rotating = false;

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
	}
	updateScreenPos() {
		this.screenX = xyz2xy(this.x,this.y,this.z)[0];
		this.screenY = xyz2xy(this.x,this.y,this.z)[1];
	}
	drawIt() {
		stroke(0,0,0);
		strokeWeight(5);
		point(this.screenX,this.screenY);
		noStroke();
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
		this.shouldDraw = true;
	}
	updateNormal() {
		var cross1 = [this.vertices[0].x-this.vertices[1].x,this.vertices[0].y-this.vertices[1].y,this.vertices[0].z-this.vertices[1].z];
		var cross2 = [this.vertices[2].x-this.vertices[1].x,this.vertices[2].y-this.vertices[1].y,this.vertices[2].z-this.vertices[1].z];
		this.normal = [cross1[1]*cross2[2]-cross2[1]*cross1[2],cross2[0]*cross1[2]-cross1[0]*cross2[2],cross1[0]*cross2[1]-cross2[0]*cross1[1]];
		this.normal[0] *= this.nSwitch;
		this.normal[1] *= this.nSwitch;
		this.normal[2] *= this.nSwitch;
	}
	checkShouldDraw() {
		this.shouldDraw = false;
		for (var i = 0; i < this.vertices.length; i++) {
			if (this.vertices[i].z >= eyeZ && topScreenSlope * this.vertices[i].z + topScreenIntercept >= this.vertices[i].y
			&& bottomScreenSlope * this.vertices[i].z + bottomScreenIntercept < this.vertices[i].y
			&& leftScreenSlope * this.vertices[i].z + leftScreenIntercept < this.vertices[i].x
			&& rightScreenSlope * this.vertices[i].z + rightScreenIntercept >= this.vertices[i].x) {
				this.shouldDraw = true;
				console.log("should draw something");
				break;
			}
		}
		//this.shouldDraw = true;
		if (this.shouldDraw) {
			var check = [eyeX-this.vertices[1].x,eyeY-this.vertices[1].y,eyeZ-this.vertices[1].z];
			if (check[0] * this.normal[0] + check[1] * this.normal[1] + check[2] * this.normal[2] > 0) {
				this.shouldDraw = true;
			} else {
				this.shouldDraw = false;
			}
		} else {
			
		}
	}
	drawIt() {
		if (this.shouldDraw) {
			fill(this.color[0],this.color[1],this.color[2]);
			//stroke(0,0,0);
			//strokeWeight(2);
			/*quad(this.vertices[0].screenX,this.vertices[0].screenY,
			this.vertices[1].screenX,this.vertices[1].screenY,
			this.vertices[2].screenX,this.vertices[2].screenY,
			this.vertices[3].screenX,this.vertices[3].screenY);*/
			beginShape();
			for (var i = 0; i < this.vertices.length; i++) {
				vertex(this.vertices[i].screenX,this.vertices[i].screenY);
			}
			endShape(CLOSE);
			noStroke();
		}
	}
}

class Box {
	constructor(x1,y1,z1,w,l,h) {//Makes a box with one vertex at (x1, y1, z1) and width w, length l, and height h
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
		this.f[3] = new Face([this.v[4],this.v[0],this.v[3],this.v[7]],-1,[255,180,180],[255,0,0],0.5);
		this.f[4] = new Face([this.v[4],this.v[5],this.v[1],this.v[0]],-1,[255,180,180],[255,0,0],0.5);
		this.f[5] = new Face([this.v[3],this.v[2],this.v[6],this.v[7]],-1,[255,180,180],[255,0,0],0.5);
		
		/*this.v[0].faces = [this.f[2],this.v,this.f[3],this.f[4]];
		this.v[1].faces = [this.f[2],this.v,this.f[1],this.f[4]];
		this.v[2].faces = [this.f[2],this.v,this.f[1],this.f[5]];
		this.v[3].faces = [this.f[2],this.v,this.f[3],this.f[5]];
		this.v[4].faces = [this.f[0],this.v,this.f[3],this.f[4]];
		this.v[5].faces = [this.f[0],this.v,this.f[1],this.f[4]];
		this.v[6].faces = [this.f[0],this.v,this.f[1],this.f[5]];
		this.v[7].faces = [this.f[0],this.v,this.f[3],this.f[5]];*/
	}
	
	updateScreenPos() {
		for (var i = 0; i < this.v.length; i++) {
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
		}
	}
	
	rotate(centerX,centerZ,degreeShift) {
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
				currAngle = 90;
			} else {
				currAngle = atan(zDiff/xDiff);
				if (xDiff < 0) {
					currAngle += 180;
				}
			}
			
			currAngle += degreeShift;
			
			this.v[i].x = rotateCenterX + radius * cos(currAngle);
			this.v[i].z = rotateCenterZ + radius * sin(currAngle);
		}
		
		for (var i = 0; i < this.f.length; i++) {
			this.f[i].updateNormal();
		}
	}
	
	rotateCenter(degreeShift) {
		var rotateCenterX = (this.v[2].x-this.v[0].x)/2 + this.v[0].x;
		var rotateCenterZ = (this.v[2].z-this.v[0].z)/2 + this.v[0].z;
		
		var zDiff;
		var xDiff;
		var radius;
		var currAngle;
		for (var i = 0; i < this.v.length; i++) {
			zDiff = this.v[i].z - rotateCenterZ;
			xDiff = this.v[i].x - rotateCenterX;
			radius = Math.sqrt(zDiff*zDiff+xDiff*xDiff);
			
			currAngle = atan(zDiff/xDiff);
			if (xDiff < 0) {
				currAngle += 180;
			}
			
			currAngle += degreeShift;
			
			this.v[i].x = rotateCenterX + radius * cos(currAngle);
			this.v[i].z = rotateCenterZ + radius * sin(currAngle);
		}
		
		for (var i = 0; i < this.f.length; i++) {
			this.f[i].updateNormal();
		}
	}
	
	drawIt() {
		for (var i = 0; i < this.f.length; i++) {
			this.f[i].checkShouldDraw();
		}
		for (var i = 0; i < this.f.length; i++) {
			this.f[i].drawIt();
		}
		/*for (var i = 0; i < this.v.length; i++) {
			this.v[i].drawIt();
		}*/
	}
}

var test = new Box(-600,0,400,350,250,80);

//test.moveVertex(6,"y",250);
//test.moveVertex(7,"y",250);

test.moveVertex(5,"z",100);
test.moveVertex(1,"z",100);

test.v.push(new Vertex(-500,80,400));//8
test.v.push(new Vertex(-500,0,400));//9

test.f[4].vertices = [test.v[4],test.v[8],test.v[9],test.v[0]];
test.f[0].vertices = [test.v[4],test.v[8],test.v[5],test.v[6],test.v[7]];
test.f[2].vertices = [test.v[0],test.v[9],test.v[1],test.v[2],test.v[3]];

test.f.push(new Face([test.v[8],test.v[5],test.v[1],test.v[9]],-1,[255,180,180],[255,0,0],0.5));

for (var i = 0; i < test.f.length; i++) {
	test.f[i].updateNormal();
}

var octahedron = new Box(0,0,0,5,5,5);

var octXPos = 300;
var octYPos = 0;
var octZPos = 400;
var s = 180;

octahedron.v = [];
octahedron.v[0] = new Vertex(octXPos,octYPos+s/2,octZPos+s);
octahedron.v[1] = new Vertex(octXPos+s,octYPos+s/2,octZPos+s);
octahedron.v[2] = new Vertex(octXPos+s,octYPos+s/2,octZPos);
octahedron.v[3] = new Vertex(octXPos,octYPos+s/2,octZPos);
octahedron.v[4] = new Vertex(octXPos+s/2,octYPos+s,octZPos+s/2);
octahedron.v[5] = new Vertex(octXPos+s/2,octYPos,octZPos+s/2);

octahedron.f = [];
octahedron.f[0] = new Face([octahedron.v[0],octahedron.v[1],octahedron.v[4]],-1,[255,180,180],[255,0,0],0.85);
octahedron.f[1] = new Face([octahedron.v[4],octahedron.v[1],octahedron.v[2]],-1,[255,180,180],[255,0,0],0.8);
octahedron.f[2] = new Face([octahedron.v[2],octahedron.v[4],octahedron.v[3]],1,[255,180,180],[255,0,0],0.7);
octahedron.f[3] = new Face([octahedron.v[0],octahedron.v[3],octahedron.v[4]],1,[255,180,180],[255,0,0],0.75);
octahedron.f[4] = new Face([octahedron.v[0],octahedron.v[1],octahedron.v[5]],1,[255,180,180],[255,0,0],0.35);
octahedron.f[5] = new Face([octahedron.v[5],octahedron.v[1],octahedron.v[2]],1,[255,180,180],[255,0,0],0.25);
octahedron.f[6] = new Face([octahedron.v[2],octahedron.v[5],octahedron.v[3]],-1,[255,180,180],[255,0,0],0.3);
octahedron.f[7] = new Face([octahedron.v[0],octahedron.v[3],octahedron.v[5]],-1,[255,180,180],[255,0,0],0.2);

for (var i = 0; i < test.f.length; i++) {
	octahedron.f[i].updateNormal();
}

//var comparison = new Box(octXPos + 300, octYPos+s/2, octZPos, s, s, s/2);

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
	stroke(0,0,0);
	strokeWeight(5);
	//line(xyz2xy(-canvasWidth/2,0,1000000)[0], farAwayY, xyz2xy(-canvasWidth/2,0,zw)[0], xyz2xy(-canvasWidth/2,0,zw)[1]);
	noStroke();
	if (keyIsPressed) {
		if (keyCode == RIGHT_ARROW) {
			goingRight = true;
		}
		if (keyCode == LEFT_ARROW) {
			goingLeft = true;
		}
		if (keyCode == UP_ARROW) {
			goingUp = true;
		}
		if (keyCode == DOWN_ARROW) {
			goingDown = true;
		}
		if (key == 'r') {
			rotating = true;
		}
		if (key == 'w') {
			goingForward = true;
		}
		if (key == 'a') {
			goingBack = true;
		}
	}
	if (keyIsReleased) {
		if (keyCode == RIGHT_ARROW) {
			goingRight = false;
		}
		if (keyCode == LEFT_ARROW) {
			goingLeft = false;
		}
		if (keyCode == UP_ARROW) {
			goingUp = false;
		}
		if (keyCode == DOWN_ARROW) {
			goingDown = false;
		}
		if (key == 'w') {
			goingForward = false;
		}
		if (key == 'a') {
			goingBack = false;
		}
		if (key == 'r') {
			rotating = false;
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
	if (rotating) {
		test.rotateCenter(1);
		octahedron.rotate(octXPos+s/2,octZPos+s/2,1);
	}
	test.updateScreenPos();
	test.drawIt();
	
	//comparison.updateScreenPos();
	//comparison.drawIt();
	
	octahedron.updateScreenPos();
	octahedron.drawIt();
	keyIsReleased = false;
};

