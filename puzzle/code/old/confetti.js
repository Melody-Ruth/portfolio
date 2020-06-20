var canvasWidth;
var canvasHeight;

setup = function() {
	canvasWidth = 800;
	canvasHeight = 500;
	angleMode(DEGREES);
	var testCanvas = createCanvas(canvasWidth,canvasHeight);
	testCanvas.parent('canvas1');
	background(250, 248, 237);
	noStroke();
	eyeX = canvasWidth/2;
};

var eyeX;
var eyeY = -67;
var eyeZ = 0;
var zw = 240;

var xyz2xy = function(x, y, z) {
	return [(zw-eyeZ)*(x-eyeX)/(z-eyeZ) + eyeX, (zw-eyeZ)*(y-eyeY)/(z-eyeZ) + eyeY];
};

var myRandom = function(low,high) {
	return Math.random()*(high-low)+low;
};

var newConfettiPiece = function(x1,y1,z1,h,r,colorR,colorG,colorB,rotateSpeed) {
	var confetti = {};
	confetti.p1 = [x1,y1,z1];
	confetti.p2 = [x1+r,y1-r*Math.sqrt(2),z1];
	confetti.p3 = [x1+r,y1-r*Math.sqrt(2)-h,z1];
	confetti.p4 = [x1,y1-h,z1];
	confetti.h = h;
	confetti.r = r;
	confetti.color = [colorR,colorG,colorB];
	confetti.fallSpeed = h*r/200;
	confetti.rotateSpeed = rotateSpeed;
	confetti.currentAngle = 0;
	/*if (Math.myRandom() > 0.5) {
		confetti.direction = -1;
	} else {
		confetti.direction = 1;
	}*/
	confetti.findPos = function() {
		this.screenP1 = xyz2xy(this.p1[0],this.p1[1],this.p1[2]);
		this.screenP2 = xyz2xy(this.p2[0],this.p2[1],this.p2[2]);
		this.screenP3 = xyz2xy(this.p3[0],this.p3[1],this.p3[2]);
		this.screenP4 = xyz2xy(this.p4[0],this.p4[1],this.p4[2]);
	}
	confetti.drawIt = function() {
		fill(this.color[0],this.color[1],this.color[2]);
		quad(this.screenP1[0],this.screenP1[1],this.screenP2[0],this.screenP2[1],this.screenP3[0],this.screenP3[1],this.screenP4[0],this.screenP4[1]);
	}
	confetti.moveIt = function() {
		this.p1[1]+=this.fallSpeed;
		this.p2[1]+=this.fallSpeed;
		this.p3[1]+=this.fallSpeed;
		this.p4[1]+=this.fallSpeed;
	}
	confetti.rotate = function() {
		//var startAngle = Math.atan((this.p2[2]-this.p1[2])/(this.p2[0]-this.p1[0]));
		//var newAngle = startAngle + this.rotateSpeed;
		this.currentAngle += this.rotateSpeed;
		this.p2[2] = this.p1[2]+r*Math.sin(this.currentAngle);
		this.p3[2] = this.p2[2];
		this.p2[0] = this.p1[0]+r*Math.cos(this.currentAngle);
		this.p3[0] = this.p2[0];
	}
	
	return confetti;
};

//var test = newConfettiPiece(100,200,200,30,15,255,0,0,0.02);

var confettiArray = [];
for (var i = 0; i < 200; i++) {
	confettiArray[i] = newConfettiPiece(myRandom(-200,900),
	myRandom(-800,200),300+i*2,myRandom(20,40),myRandom(10,20),myRandom(0,255),myRandom(0,255),myRandom(0,255),myRandom(0.01,0.08));
}

draw = function() {
	background(250, 248, 237);
	//test.moveIt();
	//test.rotate();
	//test.findPos();
	//test.drawIt();
	for (var i = 0; i < confettiArray.length; i++) {
		confettiArray[i].moveIt();
		confettiArray[i].rotate();
		confettiArray[i].findPos();
		confettiArray[i].drawIt();
	}
	//fill(255,0,0);
	//text("hello world", 200,200);
};