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
	
	
	var width = p.width;//canvas width
	var height = p.height;//canvas height
	p.setup = function() {
		size(400, 400);//size of the canvas
		width = 400;
		height = 400;
		noFill();
		noStroke();
		background(2, 130, 194); //pick a color
	};
	

	//Definitions here
	var state = "archeryMenu";
	var timer = 0;
	var eyeX = 0;
	var eyeY = -67;
	var eyeZ = 0;
	var zw = 240;
	var paused = false;
	var direction = 0;
	var archeryTimer = 0;
	var shooting = false;
	var arrows = 10;
	var archeryScore = 0;
	var archeryScores = [12, 9, 6, 3, 1, 1];
	var arrowX = 0;
	var arrowX2 = 0;
	var arrowY = 0;
	var arrowY2 = 0;
	var arrowZ = 10000;
	var arrowZ2 = 10000;
	var doneArrow;
	var bullseyes = 0;
	var arrowMouseX = 0;
	var drawnArrow = false;
	var shootingTimer = 0;
	var targetGround = 0;//Where the targets rest
	var targetTilt = 0.3;//How much the target tilts
	var targetRadius = 50;//The radius of the targets
	var legLength = 75;//The length of the legs of the target
	var radiusHeight = targetRadius*sqrt(1-sq(targetTilt)) + targetGround;
	var targetHeight = targetGround - (legLength * sqrt(1 - sq(targetTilt)));
	
	var xyz2xy = function(x, y, z) {
	    return [(zw-eyeZ)*(x-eyeX)/(z-eyeZ) + eyeX, (zw-eyeZ)*(y-eyeY)/(z-eyeZ) + eyeY];
	};

	var w2w = function(w, z) {
	    return w * (zw-eyeZ)/(z-eyeZ);
	};

	var newTarget = function(x, y, z, r) {
	    var target = {};
	    target.x = x;
	    target.y = y;
	    target.z = z;
	    target.r = r;
	    target.hitWhite = false;
	    target.hitBlack = false;
	    target.hitBlue = false;
	    target.hitRed = false;
	    target.hitYellow = false;
	    target.wasHit = false;
	    target.targetArrows = [];
	    target.distanceToArrow = 1000;
	    target.findPosition = function() {
	        this.screenX = xyz2xy(this.x, this.y, this.z)[0];
	        this.screenY = xyz2xy(this.x, this.y, this.z)[1];
	        this.rightPointScreenX = xyz2xy(this.x+this.r, this.y, this.z)[0];
	        this.rightPointScreenY = xyz2xy(this.x+this.r, this.y, this.z)[1];
	        this.topPointScreenX = xyz2xy(this.x, this.y-radiusHeight, this.z + targetTilt * targetRadius)[0];    
	        this.topPointScreenY = xyz2xy(this.x, this.y-radiusHeight, this.z + targetTilt * targetRadius)[1];
	        this.rightLegScreenX = xyz2xy(this.x+this.r+5, targetGround, this.z - targetTilt * targetRadius)[0];
	        this.rightLegScreenY = xyz2xy(this.x+this.r+5, targetGround, this.z - targetTilt * targetRadius)[1];
	        this.middleLegScreenX = xyz2xy(this.x, targetGround, this.z + 20)[0];
	        this.middleLegScreenY = xyz2xy(this.x, targetGround, this.z + 20)[1];
	        this.leftLegScreenX = xyz2xy(this.x-this.r-5, targetGround, this.z - targetTilt * targetRadius)[0];
	        this.leftLegScreenY = xyz2xy(this.x-this.r-5, targetGround, this.z - targetTilt * targetRadius)[1];
	        this.screenWidth = 2 * (this.rightPointScreenX - this.screenX);
	        this.screenHeight = -2 * (this.topPointScreenY - this.screenY);
	        //debug(arrowZ);
	    };
	    target.drawIt = function() {
	        stroke(140, 85, 14);
	        strokeWeight(w2w(10, this.z));
	        line(this.screenX, this.screenY, this.rightLegScreenX, this.rightLegScreenY);
	        line(this.screenX, this.screenY, this.middleLegScreenX, this.middleLegScreenY);
	        line(this.screenX, this.screenY, this.leftLegScreenX, this.leftLegScreenY);
	        noStroke();
	        fill(255, 254, 235);
	        ellipse(this.screenX, this.screenY, this.screenWidth, this.screenHeight);
	        fill(0, 0, 0);
	        ellipse(this.screenX, this.screenY, this.screenWidth * 4/5, this.screenHeight * 4/5);
	        fill(69, 165, 255);
	        ellipse(this.screenX, this.screenY, this.screenWidth * 3/5, this.screenHeight * 3/5);
	        fill(217, 20, 20);
	        ellipse(this.screenX, this.screenY, this.screenWidth * 2/5, this.screenHeight * 2/5);
	        fill(255, 225, 0);
	        ellipse(this.screenX, this.screenY, this.screenWidth * 1/5, this.screenHeight * 1/5);
	    };
	    target.moveIt = function() {
	        this.z -= 4;
	        for (var k = 0; k < this.targetArrows.length; k++) {
	            this.targetArrows[k].z -= 4;
	            this.targetArrows[k].z2 -= 4;
	            //debug("!");
	        }
	    };
	    target.checkIfHit = function() {
	        this.hitWhite = false;
	        this.hitBlack = false;
	        this.hitBlue = false;
	        this.hitRed = false;
	        this.hitYellow = false;
	        if (arrowZ < this.z - 5 || arrowZ > this.z + 5) {
	            return;
	        }
	        this.distanceToArrow = sqrt(sq(arrowX-this.x) + sq(arrowY-this.y));
	        if (this.distanceToArrow > this.r) {
	            return;
	        }
	        archeryScore += archeryScores[floor(5 * this.distanceToArrow/this.r)];
	        doneArrow = {x: arrowX, y: arrowY, x2: arrowX2, y2: arrowY2, z: arrowZ, z2: arrowZ2};
	        this.targetArrows.push(doneArrow);
	        doneArrow = 0;
	        if (floor(5 * this.distanceToArrow/this.r) === 0) {
	            bullseyes++;
	        }
	        //debug(this.targetArrows.length);
	        arrowX = 0;
	        arrowX2 = 0;
	        arrowY = 0;
	        arrowY2 = 0;
	        arrowZ = 10000;
	        arrowZ2 = 10000;
	        shooting = false;
	        if (arrows < 1) {
	            //coins += floor(archeryScore/2);
	            direction = 0;
	            archeryTimer = 0;
	            arrows = 10;
	            state = "archeryGameOver";
	        }
	    };
	    return target;
	};

	var drawTargetRange = function(x, y, s) {
	    stroke(140, 85, 14);
	    strokeWeight(7 * s);
	    line(x, y + (70 * s), x + (25 * s), y);
	    line(x + (25 * s), y, x + (50 * s), y + (70 * s));
	    line(x + (25 * s), y, x + (25 * s), y + (60 * s));
	    noStroke();
	    fill(255, 255, 255);
	    ellipse(x + (25 * s), y + (20 * s), 60 * s, 60 * s);
	    fill(0, 0, 0);
	    ellipse(x + (25 * s), y + (20 * s), 48 * s, 48 * s);
	    fill(69, 165, 255);
	    ellipse(x + (25 * s), y + (20 * s), 36 * s, 36 * s);
	    fill(217, 20, 20);
	    ellipse(x + (25 * s), y + (20 * s), 24 * s, 24 * s);
	    fill(255, 225, 0);
	    ellipse(x + (25 * s), y + (20 * s), 10 * s, 10 * s);
	};

	var targets = [];

	var newGrassClump = function(x, y, z) {
	    var grassClump = {};
	    grassClump.x = x;
	    grassClump.y = y;
	    grassClump.z = z;
	    grassClump.x1 = grassClump.x + 25;
	    grassClump.y1 = grassClump.y;
	    grassClump.x2 = random(x-12, x+37);
	    grassClump.y2 = random(y-10, y-30);
	    grassClump.x3 = random(x-12, x+37);
	    grassClump.y3 = random(y-10, y-30);
	    grassClump.x4 = random(x-12, x+37);
	    grassClump.y4 = random(y-10, y-30);
	    grassClump.x5 = random(x-12, x+37);
	    grassClump.y5 = random(y-10, y-30);
	    grassClump.drawIt = function() {
	        fill(3, 166, 0);
	        triangle(xyz2xy(this.x, this.y, this.z)[0], xyz2xy(this.x, this.y, this.z)[1], xyz2xy(this.x1, this.y1, this.z)[0], xyz2xy(this.x1, this.y1, this.z)[1], xyz2xy(this.x2, this.y2, this.z)[0], xyz2xy(this.x2, this.y2, this.z)[1]);
	        triangle(xyz2xy(this.x, this.y, this.z)[0], xyz2xy(this.x, this.y, this.z)[1], xyz2xy(this.x1, this.y1, this.z)[0], xyz2xy(this.x1, this.y1, this.z)[1], xyz2xy(this.x3, this.y3, this.z)[0], xyz2xy(this.x2, this.y2, this.z)[1]);
	        triangle(xyz2xy(this.x, this.y, this.z)[0], xyz2xy(this.x, this.y, this.z)[1], xyz2xy(this.x1, this.y1, this.z)[0], xyz2xy(this.x1, this.y1, this.z)[1], xyz2xy(this.x4, this.y4, this.z)[0], xyz2xy(this.x2, this.y2, this.z)[1]);
	        triangle(xyz2xy(this.x, this.y, this.z)[0], xyz2xy(this.x, this.y, this.z)[1], xyz2xy(this.x1, this.y1, this.z)[0], xyz2xy(this.x1, this.y1, this.z)[1], xyz2xy(this.x5, this.y5, this.z)[0], xyz2xy(this.x2, this.y2, this.z)[1]);
	    };
	    grassClump.moveIt = function() {
	        this.z -= 4;
	    };
	    return grassClump;
	};

	var grassClumps = [];

	var newRoad = function(x, y, z, w, l) {
	    var road = {};
	    road.x = x;
	    road.y = y;
	    road.z = z;
	    road.w = w;
	    road.l = l;
	    road.findPosition = function() {
	        /*this.screenX = (zw-eyeZ)*(this.x-eyeX)/this.z-eyeZ + eyeX;
	        this.screenY = (zw-eyeZ)*(this.y-eyeY)/this.z-eyeZ + eyeY;
	        this.topRightScreenX = (zw-eyeZ)*(this.x+this.w-eyeX)/this.z-eyeZ + eyeX;
	        this.topRightScreenY = this.screenY;
	        this.bottomRightScreenX = (zw-eyeZ)*(this.x+this.w-eyeX)/this.z-this.l-eyeZ + eyeX;    
	        this.bottomRightScreenY = (zw-eyeZ)*(this.y-eyeY)/this.z-this.l-eyeZ + eyeY;
	        this.bottomLeftScreenX = (zw-eyeZ)*(this.x-eyeX)/this.z-this.l-eyeZ + eyeX;
	        this.bottomLeftScreenY = this.bottomRightScreenY;*/
	        
	        this.screenX = xyz2xy(this.x, this.y, this.z)[0];
	        this.screenY = xyz2xy(this.x, this.y, this.z)[1];
	        this.topRightScreenX = xyz2xy(this.x+this.w, this.y, this.z)[0];
	        this.topRightScreenY = xyz2xy(this.x+this.w, this.y, this.z)[1];
	        this.bottomRightScreenX = xyz2xy(this.x+this.w, this.y, this.z-this.l)[0];    
	        this.bottomRightScreenY = xyz2xy(this.x+this.w, this.y, this.z-this.l)[1];
	        this.bottomLeftScreenX = xyz2xy(this.x, this.y, this.z-this.l)[0];
	        this.bottomLeftScreenY = xyz2xy(this.x, this.y, this.z-this.l)[1];
	    };
	    road.drawIt = function() {
	        fill(171, 106, 31);
	        quad(this.screenX, this.screenY, this.topRightScreenX, this.topRightScreenY, this.bottomRightScreenX, this.bottomRightScreenY, this.bottomLeftScreenX, this.bottomLeftScreenY);
	    };
	    return road;
	};

	var drawArrow = function(x, y) {
	    stroke(128, 75, 18);
	    strokeWeight(3);
	    line(x, y, x + 15, y - 25);
	    noStroke();
	    fill(128, 75, 18);
	    triangle(x + 5, y - 22, x + 18, y - 16, x + 15, y - 25);
	};

	var test = newRoad(-30, 0, 3500, 60, 3499);

	for (var i = 500; i < 3000; i += 250) {
	    direction = round(random(0,1));
	    if (direction === 0) {
	        targets.push(newTarget(-150, targetHeight, i, 50));
	    } else if (direction === 1) {
	        targets.push(newTarget(150, targetHeight, i, 50));
	    }
	}

	for (var i = 500; i < 3000; i += 750) {
	    direction = round(random(0,1));
	    if (direction === 0) {
	        grassClumps.push(newGrassClump(-50, 0, i));
	    } else if (direction === 1) {
	        grassClumps.push(newGrassClump(50, 0, i));
	    }
	}
	
	var buttonCircle = function(x, y, r, s, color, color2) {
	    var Button = {//defines a new object: Button
	    };
	    Button.pressed = false;
	    Button.x = x;
	    Button.y = y;
	    Button.r = r;
	    Button.state = s;
	    Button.color = color;
	    Button.color2 = color2;
	    Button.drawIt = function() {
	        if (!this.color) {
	            fill(161, 135, 255);
	            stroke(106, 0, 255);
	            strokeWeight(5);
	            ellipse(this.x, this.y, this.r, this.r);
	            noStroke();
	        } else {
	            fill(this.color);
	            if (this.color2) {
	                stroke(color2);
	                strokeWeight(5);
	            }
	            ellipse(this.x, this.y, this.r, this.r);
	            noStroke();
	        }
	    };
	    Button.checkIfPressed = function() {
	        if (mouseIsClicked && sq(mouseX-this.x) + sq(mouseY-this.y) <= sq(this.r) && state === this.state) {
	            this.pressed = true;
	        } else {
	            this.pressed = false;
	        }
	        if (sq(mouseX-this.x) + sq(mouseY-this.y) <= sq(this.r) && state === this.state) {
	            onAButton = true;
	            this.mousedOver = true;
	        } else {
	            this.mousedOver = false;
	        }
	    };
	    return Button;
	};
	
	var playArcheryButton = buttonCircle(190, 300, 60, "archeryMenu");
	var backArcheryButton = buttonCircle(80, 150, 40, "archeryMenu");
	var helpArcheryButton = buttonCircle(320, 180, 50, "archeryMenu");
	var backArcheryGameOverButton = buttonCircle(70, 330, 40, "archeryGameOver");
	var backArcheryHelpButton = buttonCircle(70, 330, 40, "archeryHelp");
	
	
	var drawArcheryMenu = function() {
	    background(39, 130, 0);
	    fill(0, 0, 0);
	    textSize(55);
	    text("Archery", 100, 70);
	    //target buttons
	    fill(255, 255, 255);
	    ellipse(190, 300, 120, 120);
	    ellipse(80, 150, 80, 80);
	    ellipse(320, 180, 100, 100);
	    fill(0, 0, 0);
	    ellipse(190, 300, 96, 96);
	    ellipse(80, 150, 64, 64);
	    ellipse(320, 180, 80, 80);
	    fill(69, 165, 255);
	    ellipse(190, 300, 72, 72);
	    ellipse(80, 150, 48, 48);
	    ellipse(320, 180, 60, 60);
	    fill(217, 20, 20);
	    ellipse(190, 300, 48, 48);
	    ellipse(80, 150, 32, 32);
	    ellipse(320, 180, 40, 40);
	    fill(255, 225, 0);
	    ellipse(190, 300, 24, 24);
	    ellipse(80, 150, 16, 16);
	    ellipse(320, 180, 20, 20);
	    //target buttons text
	    fill(0, 0, 0);
	    textSize(18);
	    //text("Back", 60, 155);
	    textSize(30);
	    text("Play", 159, 306);
	    textSize(24);
	    text("Help", 291, 190);
	    playArcheryButton.checkIfPressed();
	    //backArcheryButton.checkIfPressed();
	    helpArcheryButton.checkIfPressed();
	    /*if (backArcheryButton.pressed) {
	        state = "archeryRange";
	    }*/
	    if (helpArcheryButton.pressed) {
	        state = "archeryHelp";
	    }
	    if (playArcheryButton.pressed) {
	        state = "playArchery";
	    }
	};

	var drawArcheryGame = function() {
	    background(69, 218, 255);
	    pushMatrix();
	    translate(200, 200);
	    fill(3, 209, 0);
	    rect(-200, test.screenY, 400, 529);
	    test.findPosition();
	    test.drawIt();
	    drawnArrow = false;
	    for (var i = targets.length - 1; i > -1; i--) {
	        targets[i].findPosition();
	        if (arrowZ > targets[i].z && !drawnArrow) {
	            fill(89, 44, 12);
	            stroke(89, 44, 12);
	            strokeWeight(w2w(5, arrowZ));
	            line(xyz2xy(arrowX, arrowY, arrowZ)[0], xyz2xy(arrowX, arrowY, arrowZ)[1], xyz2xy(arrowX2, arrowY2, arrowZ2)[0], xyz2xy(arrowX2, arrowY2, arrowZ2)[1]);
	            noStroke();
	            ellipse(xyz2xy(arrowX, arrowY, arrowZ)[0], xyz2xy(arrowX, arrowY, arrowZ)[1], w2w(10, arrowZ), w2w(10, arrowZ));
	            drawnArrow = true;
	        }
	        targets[i].drawIt();
	        targets[i].checkIfHit();
	        //debug(doneArrows[0]);
	        for (var j = 0; j < targets[i].targetArrows.length; j++) {
	            fill(89, 44, 12);
	            stroke(89, 44, 12);
	            strokeWeight(w2w(5, targets[i].targetArrows[j].z));
	            line(xyz2xy(targets[i].targetArrows[j].x, targets[i].targetArrows[j].y, targets[i].targetArrows[j].z)[0], xyz2xy(targets[i].targetArrows[j].x, targets[i].targetArrows[j].y, targets[i].targetArrows[j].z)[1], xyz2xy(targets[i].targetArrows[j].x2, targets[i].targetArrows[j].y2, targets[i].targetArrows[j].z2)[0], xyz2xy(targets[i].targetArrows[j].x2, targets[i].targetArrows[j].y2, targets[i].targetArrows[j].z2)[1]);
	            noStroke();
	            //ellipse(xyz2xy(targets[i].targetArrows.x, targets[i].targetArrows[j].y, targets[i].targetArrows[j].z)[0], xyz2xy(targets[i].targetArrows[j].x, targets[i].targetArrows[j].y, targets[i].targetArrows[j].z)[1], w2w(10, targets[i].targetArrows[j].z), w2w(10, targets[i].targetArrows[j].z));
	        }
	        if (!paused) {
	            targets[i].moveIt();
	        }
	        if (targets[i].z < 100) {
	            targets.splice(i, 1);
	        }
	        if (arrowZ > 1000 && shooting || arrowX > 250 && shooting || arrowX < -250 && shooting) {
	            shooting = false;
	            arrowX = 0;
	            arrowX2 = 0;
	            arrowY = 0;
	            arrowY2 = 0;
	            arrowZ = 10000;
	            arrowZ2 = 10000;
	            if (arrows < 1) {
	                //coins += floor(archeryScore/2);
	                direction = 0;
	                archeryTimer = 0;
	                arrows = 10;
	                state = "archeryGameOver";
	            }
	        }
	    }
	    if (!drawnArrow) {
	        fill(89, 44, 12);
	        stroke(89, 44, 12);
	        strokeWeight(w2w(5, arrowZ));
	        line(xyz2xy(arrowX, arrowY, arrowZ)[0], xyz2xy(arrowX, arrowY, arrowZ)[1], xyz2xy(arrowX2, arrowY2, arrowZ2)[0], xyz2xy(arrowX2, arrowY2, arrowZ2)[1]);
	        noStroke();
	        ellipse(xyz2xy(arrowX, arrowY, arrowZ)[0], xyz2xy(arrowX, arrowY, arrowZ)[1], w2w(10, arrowZ), w2w(10, arrowZ));
	        drawnArrow = true;
	    }
	    for (var i = grassClumps.length - 1; i > -1; i--) {
	        grassClumps[i].drawIt();
	        if (!paused) {
	            grassClumps[i].moveIt();
	        }
	        if (grassClumps[i].z < 100) {
	            grassClumps.splice(i, 1);
	        }
	    }
	    if (archeryTimer % 100 === 0) {
	        direction = round(random(0,1));
	        if (direction === 0) {
	            targets.push(newTarget(-150, targetHeight, 3260, 50));
	        } else if (direction === 1) {
	            targets.push(newTarget(150, targetHeight, 3260, 50));
	        }
	    }
	    if (archeryTimer % 300 === 0) {
	        direction = round(random(0, 1));
	        if (direction === 0) {
	            grassClumps.push(newGrassClump(-50, 0, 3260));
	        } else if (direction === 1) {
	            grassClumps.push(newGrassClump(50, 0, 3260));
	        }
	    }
	    if (mouseIsClicked && !shooting && arrows > 0 && archeryTimer > 1) {
	        shooting = true;
	        arrows--;
	        arrowX = mouseX - 200;
	        arrowX2 = mouseX - 200;
	        arrowY = mouseY - 200;
	        arrowY2 = mouseY - 200;
	        arrowZ = 150;
	        arrowZ2 = 150;
	        arrowMouseX = mouseX;
	    }
	    if (arrowMouseX < 100) {
	        arrowX -= 1.5;
	        arrowX2 = arrowX + 96;
	        arrowZ += 0.5;
	        arrowZ2 = arrowZ - 32;
	    } else if (arrowMouseX < 200) {
	        arrowX -= 0.75;
	        arrowX2 = arrowX + 48;
	        arrowZ ++;
	        arrowZ2 = arrowZ - 64;
	    } else if (arrowMouseX < 300) {
	        arrowX += 0.75;
	        arrowX2 = arrowX - 48;
	        arrowZ ++;
	        arrowZ2 = arrowZ - 64;
	        //debug(arrowZ);
	    } else {
	        arrowX += 1.5;
	        arrowX2 = arrowX - 96;
	        arrowZ += 0.5;
	        arrowZ2 = arrowZ - 32;
	        //debug(arrowZ);
	    }
	    popMatrix();
	    noFill();
	    stroke(128, 75, 18);
	    strokeWeight(15);
	    if (mouseX < 67) {
	        line(mouseX+150, mouseY - 150, mouseX+150, mouseY + 150);
	        strokeWeight(20);
	        arc(mouseX+150, mouseY, 200, 300, 90, 270);
	        strokeWeight(15);
	        line(mouseX+150, mouseY, mouseX+16, mouseY);
	        noStroke();
	        fill(128, 75, 18);
	        triangle(mouseX, mouseY, mouseX+20, mouseY-15, mouseX + 20, mouseY+15);
	    } else if (mouseX < 130) {
	        line(mouseX+120, mouseY - 150, mouseX+120, mouseY + 150);
	        strokeWeight(20);
	        arc(mouseX+120, mouseY, 160, 300, 90, 270);
	        strokeWeight(15);
	        line(mouseX+120, mouseY, mouseX+16, mouseY);
	        noStroke();
	        fill(128, 75, 18);
	        triangle(mouseX, mouseY, mouseX+20, mouseY-15, mouseX + 20, mouseY+15);
	    } else if (mouseX < 200) {
	        line(mouseX+80, mouseY - 150, mouseX+80, mouseY + 150);
	        strokeWeight(20);
	        arc(mouseX+80, mouseY, 120, 300, 90, 270);
	        strokeWeight(15);
	        line(mouseX+80, mouseY, mouseX+16, mouseY);
	        noStroke();
	        fill(128, 75, 18);
	        triangle(mouseX, mouseY, mouseX+20, mouseY-15, mouseX + 20, mouseY+15);
	    } else if (mouseX < 270) {
	        line(mouseX-80, mouseY - 150, mouseX-80, mouseY + 150);
	        strokeWeight(20);
	        arc(mouseX-80, mouseY, 120, 300, 270, 450);
	        strokeWeight(15);
	        line(mouseX-80, mouseY, mouseX-16, mouseY);
	        noStroke();
	        fill(128, 75, 18);
	        triangle(mouseX, mouseY, mouseX-20, mouseY-15, mouseX-20, mouseY+15);
	    } else if (mouseX < 335) {
	        line(mouseX-120, mouseY - 150, mouseX-120, mouseY + 150);
	        strokeWeight(20);
	        arc(mouseX-120, mouseY, 160, 300, 270, 450);
	        strokeWeight(15);
	        line(mouseX-120, mouseY, mouseX-16, mouseY);
	        noStroke();
	        fill(128, 75, 18);
	        triangle(mouseX, mouseY, mouseX-20, mouseY-15, mouseX-20, mouseY+15);
	    } else {
	        line(mouseX-150, mouseY - 150, mouseX-150, mouseY + 150);
	        strokeWeight(20);
	        arc(mouseX-150, mouseY, 200, 300, 270, 450);
	        strokeWeight(15);
	        line(mouseX-150, mouseY, mouseX-16, mouseY);
	        noStroke();
	        fill(128, 75, 18);
	        triangle(mouseX, mouseY, mouseX-20, mouseY-15, mouseX-20, mouseY+15);
	    }
	    for (var i = 0; i < arrows; i++) {
	        drawArrow(375 - i * 20, 40);
	    }
	    fill(0, 0, 0);
	    textSize(30);
	    text("Score: " + archeryScore, 10, 35);
	    noStroke();
	    archeryTimer++;
	};

	var drawArcheryGameOver = function() {
	    background(39, 130, 0);
	    fill(0, 0, 0);
	    textSize(55);
	    text("Great Job!", 65, 70);
	    textSize(35);
	    text("You shot " + bullseyes + " bullseye(s).", 30, 142);
	    textSize(40);
	    text("Your score: " + archeryScore, 60, 200);
	    fill(255, 255, 255);
	    ellipse(70, 330, 80, 80);
	    fill(0, 0, 0);
	    ellipse(70, 330, 64, 64);
	    fill(69, 165, 255);
	    ellipse(70, 330, 48, 48);
	    fill(217, 20, 20);
	    ellipse(70, 330, 32, 32);
	    fill(255, 225, 0);
	    ellipse(70, 330, 16, 16);
	    fill(0, 0, 0);
	    textSize(18);
	    text("Back", 50, 335);
	    backArcheryGameOverButton.checkIfPressed();
	    if (backArcheryGameOverButton.pressed) {
	        state = "archeryMenu";
	        archeryScore = 0;
	        bullseyes = 0;
	    }
	};

	var drawArcheryHelp = function() {
	    background(39, 130, 0);
	    fill(0, 0, 0);
	    textSize(55);
	    text("Help", 150, 70);
	    textSize(30);
	    text("Aim with the mouse. Click\nto shoot. You only have\nten arrows, so use them\nwisely.\n            Good luck!", 27, 122);
	    fill(255, 255, 255);
	    ellipse(70, 330, 80, 80);
	    fill(0, 0, 0);
	    ellipse(70, 330, 64, 64);
	    fill(69, 165, 255);
	    ellipse(70, 330, 48, 48);
	    fill(217, 20, 20);
	    ellipse(70, 330, 32, 32);
	    fill(255, 225, 0);
	    ellipse(70, 330, 16, 16);
	    fill(0, 0, 0);
	    textSize(18);
	    text("Back", 50, 335);
	    backArcheryHelpButton.checkIfPressed();
	    if (backArcheryHelpButton.pressed) {
	        state = "archeryMenu";
	    }
	};
	
	p.draw = function() {
		keyCode = p.keyCode;
		mouseButton = p.mouseButton;
		pmouseX = p.pmouseX;
		pmouseY = p.pmouseY;
		mouseX = p.mouseX;
		mouseY = p.mouseY;
		
		//Put code here
		if (state === "archeryMenu") {
	        drawArcheryMenu();
	    }
	    if (state === "playArchery") {
	        drawArcheryGame();
	    }
	    if (state === "archeryGameOver") {
	        drawArcheryGameOver();
	    }
	    if (state === "archeryHelp") {
	        drawArcheryHelp();
	    }
		
		keyIsReleased = false;
		mouseIsClicked = false;
	};  

	
}
