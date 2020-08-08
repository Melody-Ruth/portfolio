//Created by Melody Ruth. Licensed under Attribution-NonCommercial-ShareAlike 3.0 Unported (CC BY-NC-SA 3.0)

function setup() {
	angleMode(DEGREES);
	var testCanvas = createCanvas(800,500);
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
var rotating = false;

var eyeX = 0;
var eyeY = 300;
var eyeZ = -240;

var zeroX = 400;
var zeroY = 500;

var xyz2xy = function(x, y, z) {
	return [z*(eyeX-x)/(-eyeZ+z)+x+zeroX,zeroY-(z*(eyeY-y)/(-eyeZ+z)+y)];
};

var farAwayY = xyz2xy(0,0,1000000);

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
		var cross1 = [this.vertices[0].x-this.vertices[3].x,this.vertices[0].y-this.vertices[3].y,this.vertices[0].z-this.vertices[3].z];
		var cross2 = [this.vertices[2].x-this.vertices[3].x,this.vertices[2].y-this.vertices[3].y,this.vertices[2].z-this.vertices[3].z];
		this.nSwitch = normalSwitch;
		this.normal = [cross1[1]*cross2[2]-cross2[1]*cross1[2],cross2[0]*cross1[2]-cross1[0]*cross2[2],cross1[0]*cross2[1]-cross2[0]*cross1[1]];
		this.normal[0] *= this.nSwitch;
		this.normal[1] *= this.nSwitch;
		this.normal[2] *= this.nSwitch;
		this.shouldDraw = true;
	}
	updateNormal() {
		//var cross1 = [this.vertices[0].x-this.vertices[3].x,this.vertices[0].y-this.vertices[3].y,this.vertices[0].z-this.vertices[3].z];
		//var cross2 = [this.vertices[2].x-this.vertices[3].x,this.vertices[2].y-this.vertices[3].y,this.vertices[2].z-this.vertices[3].z];
		var cross1 = [this.vertices[0].x-this.vertices[1].x,this.vertices[0].y-this.vertices[1].y,this.vertices[0].z-this.vertices[1].z];
		var cross2 = [this.vertices[2].x-this.vertices[1].x,this.vertices[2].y-this.vertices[1].y,this.vertices[2].z-this.vertices[1].z];
		this.normal = [cross1[1]*cross2[2]-cross2[1]*cross1[2],cross2[0]*cross1[2]-cross1[0]*cross2[2],cross1[0]*cross2[1]-cross2[0]*cross1[1]];
		this.normal[0] *= this.nSwitch;
		this.normal[1] *= this.nSwitch;
		this.normal[2] *= this.nSwitch;
	}
	checkShouldDraw() {
		//var check = [eyeX-this.vertices[3].x,eyeY-this.vertices[3].y,eyeZ-this.vertices[3].z];
		var check = [eyeX-this.vertices[1].x,eyeY-this.vertices[1].y,eyeZ-this.vertices[1].z];
		if (check[0] * this.normal[0] + check[1] * this.normal[1] + check[2] * this.normal[2] > 0) {
			this.shouldDraw = true;
		} else {
			this.shouldDraw = false;
		}
	}
	drawIt() {
		if (this.shouldDraw) {
			fill(this.color[0],this.color[1],this.color[2]);
			/*quad(this.vertices[0].screenX,this.vertices[0].screenY,
			this.vertices[1].screenX,this.vertices[1].screenY,
			this.vertices[2].screenX,this.vertices[2].screenY,
			this.vertices[3].screenX,this.vertices[3].screenY);*/
			beginShape();
			for (var i = 0; i < this.vertices.length; i++) {
				vertex(this.vertices[i].screenX,this.vertices[i].screenY);
			}
			endShape(CLOSE);
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

//var octahedron = new Box(0,0,0,5,5,5);

//var octXPos = 0;
//var octYPos = 0;
//var octZPos = 0;



function draw() {
	background(255,255,255);
	farAwayY = xyz2xy(0,0,1000000);
	//background(100,255,100);
	//(0,farAwayY,800,1000);
	//test.moveIt("x",1.5);
	//test.moveIt("y",0.5);
	//test.rotateCenter(1);
	//test.rotate(-402,402,0.4);
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
	if (rotating) {
		test.rotateCenter(1);
	}
	test.updateScreenPos();
	test.drawIt();
	keyIsReleased = false;
};

