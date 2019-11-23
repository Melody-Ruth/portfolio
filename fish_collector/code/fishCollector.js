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
		code_to_create_functions += processingmember+'=function(){p.'+processingmember+'.apply(p,arguments);},';
	}
	code_to_create_functions += 'easierthanremovingcomma;';
	eval(code_to_create_functions);
	//Also remember to do p.mouseClicked instead of var mouseClicked
	//Also remember to add mouseX = p.mouseX; mouseY = p.mouseY; to the draw function
	//Additional custom functions
	var arc = function(x,y,w,h,start,stop) {
		p.arc(x,y,w,h,start*Math.PI/180,stop*Math.PI/180);
	};
	var color = function(r,g,b) {
		return p.color(r,g,b);
	};
	var pushMatrix = function() {
		p.pushMatrix();
	};
	var popMatrix = function() {
		p.popMatrix();
	};
	var rotate = function(degrees) {
		p.rotate(degrees*Math.PI/180);
	};
	var translate = function(xShift,yShift) {
		p.translate(xShift,yShift);
	};
	var random = function(low,high){
		return Math.random()*(high-low)+low;
	};
	var round = function(value) {
		return Math.round(value);
	};
	var sin = function(degrees) {
		return Math.sin(degrees*Math.PI/180);
	};
	var cos = function(degrees) {
		return Math.cos(degrees*Math.PI/180);
	};
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
	var button = function(x, y, w, h, s, color, tab) {
	    var Button = {//defines a new object: Button
	    };
	    Button.pressed = false;
	    Button.x = x;
	    Button.y = y;
	    Button.w = w;
	    Button.h = h;
	    Button.state = s;
	    Button.color = color;
	    Button.tab = tab;
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
	        if (mouseIsClicked && mouseX > this.x && mouseX < this.x + this.w && mouseY > this.y && mouseY < this.y + this.h && state === this.state && !this.tab) {
	            this.pressed = true;
	        } else if (mouseIsClicked && mouseX > this.x && mouseX < this.x + this.w && mouseY > this.y && mouseY < this.y + this.h && state === this.state && selectedTab === this.tab) {
	            this.pressed = true;
	        } else {
	            this.pressed = false;
	        }
	    };
	    return Button;
	};
	
	
	
	p.setup = function() {
		size(800, 500);
		noFill();
		noStroke();
		background(2, 130, 194); //pick a color
	};

	
	var developer = false;
	var backgroundc = color(176, 255, 242);
	var state = "menu";
	var timer = 0;
	var showTimer;
	var justShowed = false;
	//var minu = minute();
	//var oldminu;
	var coins = 160;
	if (developer) {
	    coins = 5000000;
	}
	var cost = 50;
	var foodCost = 50;
	var decorationCost = 50;
	var selectedTab = "buy fish";
	var selectedType = 1;
	var selectedFish = "none";
	var selectedColor = 1;
	var selectedFood = 1;
	var selectedSize = 1;
	var selectedDecorations = 1;
	var affordTimer = 0;
	var noShowTimer = 0;
	var cannotPay = false;
	var cannotShow = false;
	var showCoins;
	var paused = false;
	var placingBasicFood = false;
	var aboutToPlaceFood = 0;

	var myFish = true;

	var breeding = false;
	var breedFish1;
	var breedFish2;

	var myr;
	var myg;
	var myb;

	var myRed = color(240, 44, 34);
	var myOrange = color(255, 111, 0);
	var myYellow = color(255, 234, 0);
	var myGreen = color(44, 196, 6);
	var myBlue = color(0, 149, 255);
	var myPurple = color(157, 0, 255);
	var myPink = color(255, 130, 238);
	var myBlack = color(61, 61, 61);

	var myRedOrange = color(255, 51, 0);
	var myOrangeYellow = color(255, 183, 0);
	var myBlueRed = color(169, 122, 204);
	var myPinkRed = color(255, 0, 179);
	var myBlueYellow = color(127, 207, 147);
	var myPinkPurple = color(226, 59, 255);
	var myPurpleBlue = color(94, 0, 255);
	var myBlueBlue = color(51, 99, 255);
	var myBlueGreen = color(0, 167, 186);
	var myYellowGreen = color(188, 255, 64);
	var myPurpleRed = color(255, 61, 236);
	var myPinkOrange = color(245, 150, 167);
	var myPinkYellow = color(255, 176, 213);
	var myPinkBlue = color(204, 163, 255);
	var myOrangeBlack = color(179, 66, 0);
	var myRedBlack = color(145, 0, 0);
	var myGreenBlack = color(45, 99, 11);
	var myBlueBlack = color(21, 62, 110);
	var myPurpleBlack = color(108, 31, 166);
	var myPinkBlack = color(181, 60, 126);
	var myOrangeWhite = color(255, 185, 135);
	var myYellowWhite = color(255, 249, 184);
	var myGreenWhite = color(209, 255, 219);
	var myBlueWhite = color(199, 223, 255);
	var myPurpleWhite = color(229, 201, 255);
	var myPinkWhite = color(253, 222, 255);

	var myWhite = color(255, 255, 255);

	var showPoints;
	var fish2;
	var fish3;
	var fish4;
	var fish5;

	var food = [];

	var rainbowLength = 200;

	var drawRainbowGames = function() {
	    background(105, 248, 255);
	    noFill();
	    stroke(224, 0, 0);
	    strokeWeight(12);
	    arc(200, 305, 270, 250, 218, rainbowLength);
	    stroke(255, 136, 0);
	    arc(200, 305, 250, 230, 218, rainbowLength);
	    stroke(255, 221, 0);
	    arc(200, 305, 225, 210, 218, rainbowLength);
	    stroke(35, 235, 0);
	    arc(200, 303, 210, 180, 218, rainbowLength);
	    noStroke();
	    fill(248, 248, 248);
	    ellipse(50, 258, 50, 40);
	    ellipse(68, 244, 50, 40);
	    ellipse(84, 251, 50, 40);
	    ellipse(100, 271, 50, 40);
	    ellipse(55, 270, 50, 40);
	    ellipse(78, 272, 50, 40);
	    fill(235, 0, 0);
	    textSize(40);
	    if (timer > 160) {
	        text("Over the Rainbow", 41, 50);
	    }
	    if (timer > 190) {
	        text("Games", 137, 101);
	    }
	    if (timer > 220) {
	        text("Presents", 123, 150);
	    }
	    if (timer > 250) {
	        text("Fish Collector", 82, 365);
	    }
	    if (timer > 130) {
	        fill(248, 248, 248);
	        ellipse(300, 258, 50, 40);
	        ellipse(318, 244, 50, 40);
	        ellipse(344, 251, 50, 40);
	        ellipse(350, 271, 50, 40);
	        ellipse(305, 270, 50, 40);
	        ellipse(338, 272, 50, 40);
	    }
	    if (timer < 130) {
	        rainbowLength++;
	    }
	    if (timer > 320) {
	        state = "menu";
	    }
	};

	

	var playButton = button(150+200, 220+50, 100, 50, "menu");
	//var helpButton = button(150, 310, 100, 50, "menu");
	var menuButton = button(150, 18, 100, 50, "help");
	var buyButton = button(250+400, 0, 60, 20, "starter tank");
	var selectedButton = button(330+400, 0, 70, 20, "starter tank");
	var oldBasicButton = button(260+400, 50, 50, 37, "starter tank", false, "buy fish");
	var oldLargeButton = button(330+400, 50, 50, 37, "starter tank", false, "buy fish");
	var oldRedButton = button(260+400, 120, 50, 37, "starter tank", color(240, 44, 34), "buy fish");
	var oldOrangeButton = button(335+400, 120, 50, 37, "starter tank", color(255, 111, 0), "buy fish");
	var oldYellowButton = button(260+400, 170, 50, 37, "starter tank", color(255, 234, 0), "buy fish");
	var oldGreenButton = button(335+400, 170, 50, 37, "starter tank", color(44, 196, 6), "buy fish");
	var oldBlueButton = button(260+400, 220, 50, 37, "starter tank", color(0, 149, 255), "buy fish");
	var oldPurpleButton = button(335+400, 220, 50, 37, "starter tank", color(157, 0, 255), "buy fish");
	var oldPinkButton = button(260+400, 270, 50, 37, "starter tank", color(255, 130, 238), "buy fish");
	var oldBlackButton = button(335+400, 270, 50, 37, "starter tank", color(61, 61, 61), "buy fish");
	var oldWhiteButton = button(260+400, 315, 50, 37, "starter tank", color(255, 255, 255), "buy fish");
	var oldBuyFishButton = button(285+400, 360, 80, 30, "starter tank", false, "buy fish");

	var buyFishButton = button(285+400, 30, 80, 30, "starter tank", false, "buy fish");
	var buyFoodButton = button(285+400, 207, 80, 25, "starter tank", false, "buy fish");
	var buyTankDecorationsButton = button(253+400, 302, 145, 25, "starter tank", false, "buy fish");
	var fishRightButton = button(361+400, 86, 30, 30, "starter tank", false, "buy fish");
	var fishLeftButton = button(257+400, 86, 30, 30, "starter tank", false, "buy fish");
	var colorRightButton = button(360+400, 156, 30, 30, "starter tank", false, "buy fish");
	var colorLeftButton = button(260+400, 156, 30, 30, "starter tank", false, "buy fish");
	var foodRightButton = button(360+400, 250, 30, 30, "starter tank", false, "buy fish");
	var foodLeftButton = button(260+400, 250, 30, 30, "starter tank", false, "buy fish");

	var sellFishButton = button(275+400, 120, 100, 50, "starter tank", false, "selected fish");
	var breedFishButton = button(275+400, 200, 100, 50, "starter tank", false, "selected fish");
	var showFishButton = button(275+400, 280, 100, 50, "starter tank", false, "selected fish");
	var showBackButton = button(50+400, 330, 100, 50, "showing", false);
	var cancelBreedingButton = button(27+400, 330, 100, 50, "starter tank", false);
	var pauseButton = button(142+400, 330, 100, 50, "starter tank", false);


	var newBasicFish = function(x, y, color, s, bf1, bf2, r, g, b) {
	    var fish = {};
	    fish.x = x;
	    fish.y = y;
	    fish.yStep = 1;
	    fish.xStep = 1;
	    fish.s = s;
	    fish.bf1 = bf1;
	    fish.bf2 = bf2;
	    fish.r = r;
	    fish.g = g;
	    fish.b = b;
	    fish.hungerLevel = 20000;
	    if (!bf1) {
	        fish.quality = random(3,6);
	        fish.color = color;
	    } else {
	        fish.quality = random(bf1.quality, bf2.quality);
	        if (bf1.color === myRed){
	            if (bf2.color === myOrange) {
	                fish.color = myRedOrange;
	            } else if (bf2.color === myYellow) {
	                fish.color = myOrange;
	            } else if (bf2.color === myGreen) {
	                fish.colorType = "christmas";
	            } else if (bf2.color === myBlue) {
	                fish.color = myBlueRed;
	            } else if (bf2.color === myPurple) {
	                fish.color = myPurpleRed;
	            } else if (bf2.color === myPink) {
	                fish.color = myPinkRed;
	            } else if (bf2.color === myRed) {
	                fish.color = myRed;
	            } else if (bf2.color === myBlack) {
	                fish.color = myRedBlack;
	            } else if (bf2.color === myWhite && !bf2.colorType) {
	                fish.color = myPink;
	            } else if (bf2.colorType === "zebra" && bf2.color === myWhite) {
	                fish.colorType = "zebra";
	                fish.color = myRed;
	            }
	        } else if (bf1.color === myOrange){
	            if (bf2.color === myOrange) {
	                fish.color = myOrange;
	            } else if (bf2.color === myYellow) {
	                fish.color = myOrangeYellow;
	            } else if (bf2.color === myGreen) {
	                fish.colorType = "pumpkin";
	            } else if (bf2.color === myPink) {
	                fish.color = myPinkOrange;
	            } else if (bf2.color === myRed) {
	                fish.color = myRedOrange;
	            } else if (bf2.color === myBlack) {
	                fish.color = myOrangeBlack;
	            } else if (bf2.color === myWhite && !bf2.colorType) {
	                fish.color = myOrangeWhite;
	            } else if (bf2.colorType === "zebra" && bf2.color === myWhite) {
	                fish.colorType = "zebra";
	                fish.color = myOrange;
	            }
	        } else if (bf1.color === myYellow){
	            if (bf2.color === myOrange) {
	                fish.color = myOrangeYellow;
	            } else if (bf2.color === myYellow) {
	                fish.color = myYellow;
	            } else if (bf2.color === green) {
	                fish.color = myYellowGreen;
	            } else if (bf2.color === myBlue) {
	                fish.color = myBlueYellow;
	            } else if (bf2.color === myPink) {
	                fish.color = myPinkYellow;
	            } else if (bf2.color === myRed) {
	                fish.color = myOrange;
	            } else if (bf2.color === myBlack) {
	                fish.colorType = "lightning";
	                fish.quality += 2;
	            } else if (bf2.color === myWhite && !bf2.colorType) {
	                fish.color = myYellowWhite;
	            } else if (bf2.colorType === "zebra" && bf2.color === myWhite) {
	                fish.colorType = "zebra";
	                fish.color = myYellow;
	            }
	        } else if (bf1.color === myGreen){
	            if (bf2.color === myYellow) {
	                fish.color = myYellowGreen;
	            } else if (bf2.color === myOrange) {
	                fish.colorType = "pumpkin";
	            } else if (bf2.color === green) {
	                fish.color = myGreen;
	            } else if (bf2.color === myBlue) {
	                fish.color = myBlueGreen;
	            } else if (bf2.color === myRed) {
	                fish.colorType = "christmas";
	            } else if (bf2.color === myBlack) {
	                fish.color = myGreenBlack;
	            } else if (bf2.color === myWhite && !bf2.colorType) {
	                fish.color = myGreenWhite;
	            } else if (bf2.colorType === "zebra" && bf2.color === myWhite) {
	                fish.colorType = "zebra";
	                fish.color = myGreen;
	            }
	        } else if (bf1.color === myBlue){
	            if (bf2.color === myYellow) {
	                fish.color = myBlueYellow;
	            } else if (bf2.color === green) {
	                fish.color = myBlueGreen;
	            } else if (bf2.color === myBlue) {
	                fish.color = myBlueBlue;
	            } else if (bf2.color === myPurple) {
	                fish.color = myPurpleBlue;
	            } else if (bf2.color === myPink) {
	                fish.color = myPinkBlue;
	            } else if (bf2.color === myRed) {
	                fish.color = myBlueRed;
	            } else if (bf2.color === myBlack) {
	                fish.color = myBlueBlack;
	            } else if (bf2.color === myWhite && !bf2.colorType) {
	                fish.color = myBlueWhite;
	            } else if (bf2.colorType === "zebra" && bf2.color === myWhite) {
	                fish.colorType = "zebra";
	                fish.color = myBlue;
	            }
	        } else if (bf1.color === myPurple){
	            if (bf2.color === myBlue) {
	                fish.color = myPurpleBlue;
	            } else if (bf2.color === myPurple) {
	                fish.color = myPurple;
	            } else if (bf2.color === myPink) {
	                fish.color = myPinkPurple;
	            } else if (bf2.color === myRed) {
	                fish.color = myPurpleRed;
	            } else if (bf2.color === myBlack) {
	                fish.color = myPurpleBlack;
	            } else if (bf2.color === myWhite && !bf2.colorType) {
	                fish.color = myPurpleWhite;
	            } else if (bf2.colorType === "zebra" && bf2.color === myWhite) {
	                fish.colorType = "zebra";
	                fish.color = myPurple;
	            }
	        } else if (bf1.color === myPink){
	            if (bf2.color === myOrange) {
	                fish.color = myPinkOrange;
	            } else if (bf2.color === myYellow) {
	                fish.color = myPinkYellow;
	            } else if (bf2.color === myBlue) {
	                fish.color = myPinkBlue;
	            } else if (bf2.color === myPurple) {
	                fish.color = myPinkPurple;
	            } else if (bf2.color === myPink) {
	                fish.color = myPink;
	            } else if (bf2.color === myRed) {
	                fish.color = myPinkRed;
	            } else if (bf2.color === myBlack) {
	                fish.color = myPinkBlack;
	            } else if (bf2.color === myWhite && !bf2.colorType) {
	                fish.color = myPinkWhite;
	            } else if (bf2.colorType === "zebra" && bf2.color === myWhite) {
	                fish.colorType = "zebra";
	                fish.color = myPink;
	            }
	        } else if (bf1.color === myBlack) {
	            if (bf2.color === myOrange) {
	                fish.color = myOrangeBlack;
	            } else if (bf2.color === myGreen) {
	                fish.color = myGreenBlack;
	            } else if (bf2.color === myBlue) {
	                fish.color = myBlueBlack;
	            } else if (bf2.color === myPurple) {
	                fish.color = myPurpleBlack;
	            } else if (bf2.color === myPink) {
	                fish.color = myPinkBlack;
	            } else if (bf2.color === myRed) {
	                fish.color = myRedBlack;
	            } else if (bf2.color === myBlack) {
	                fish.color = myBlack;
	            } else if (bf2.color === myWhite) {
	                fish.colorType = "zebra";
	                fish.quality += 1;
	                fish.color = myWhite;
	            } else if (bf2.color === myYellow) {
	                fish.colorType = "lightning";
	                fish.quality += 2;
	            }
	        } else if (bf1.color === myWhite && !bf1.colorType) {
	            if (bf2.color === myOrange) {
	                fish.color = myOrangeWhite;
	            } else if (bf2.color === myYellow) {
	                fish.color = myYellowWhite;
	            }else if (bf2.color === myGreen) {
	                fish.color = myGreenWhite;
	            } else if (bf2.color === myBlue) {
	                fish.color = myBlueWhite;
	            } else if (bf2.color === myPurple) {
	                fish.color = myPurpleWhite;
	            } else if (bf2.color === myPink) {
	                fish.color = myPinkWhite;
	            } else if (bf2.color === myRed) {
	                fish.color = myPink;
	            } else if (bf2.color === myBlack) {
	                fish.colorType = "zebra";
	                fish.quality += 1;
	                fish.color = myWhite;
	            } else if (bf2.color === myWhite) {
	                fish.color = myWhite;
	            }
	            fish.quality += 3;
	        } else if (bf1.colorType === "zebra") {
	            if (bf2.color === myOrange) {
	                fish.color = myOrange;
	                fish.colorType = "zebra";
	            } else if (bf2.color === myYellow) {
	                fish.color = myYellow;
	                fish.colorType = "zebra";
	            }else if (bf2.color === myGreen) {
	                fish.color = myGreen;
	                fish.colorType = "zebra";
	            } else if (bf2.color === myBlue) {
	                fish.color = myBlue;
	                fish.colorType = "zebra";
	            } else if (bf2.color === myPurple) {
	                fish.color = myPurple;
	                fish.colorType = "zebra";
	            } else if (bf2.color === myPink) {
	                fish.color = myPink;
	                fish.colorType = "zebra";
	            } else if (bf2.color === myRed) {
	                fish.color = myRed;
	                fish.colorType = "zebra";
	            }
	        } else {
	            fish.r = random(0,255);
	            fish.g = random(0,255);
	            fish.b = random(0,255);
	        }
	        fish.quality = random(3,6);
	    }
	    fish.cost = round(fish.quality * 10);
	    fish.type = "basic";
	    fish.sold = false;
	    fish.gender = random(0,1);
	    fish.selected = false;
	    if (fish.gender > 0.5) {
	        fish.gender = "female";
	    } else {
	        fish.gender = "male";
	    }
	    fish.drawIt = function() {
	        if (!this.sold && this.hungerLevel < 1000 && developer) {
	            fill(176, 0, 0, 175);
	            ellipse((this.x - 20) * s, (this.y - 10) * s, 175 * s, 175 * s);
	        }
	        if (!this.sold && !this.colorType) {
	            if (!this.r) {
	                fill(this.color);
	            } else {
	            fill(this.r, this.g, this.b);
	            }
	            // body
	            ellipse(this.x * s, this.y * s, 118 * s, 74 * s);
	            // tail
	            triangle((this.x-55) * s, this.y * s, (this.x-88.5) * s, (this.y-37) * s, (this.x-88.5) * s, (this.y+37) * s);
	            // eye
	            fill(0, 0, 0);
	            ellipse((this.x+29.5) * s, this.y * s, 15 * s, 15 * s);
	        } else if (!this.sold) {
	            if (this.colorType === "lightning") {
	                fill(61, 61, 61);
	                // body
	                ellipse(this.x * s, this.y * s, 118 * s, 74 * s);
	                // tail
	                triangle((this.x-55) * s, this.y * s, (this.x-88.5) * s, (this.y-37) * s, (this.x-88.5) * s, (this.y+37) * s);
	                // eye
	                fill(0, 0, 0);
	                ellipse((this.x+29.5) * s, this.y * s, 15 * s, 15 * s);
	        
	                fill(255, 234, 0);
	                triangle((this.x - 27) * s, (this.y + 34) * s, (this.x - 20) * s, (this.y - 9) * s, (this.x - 6) * s, (this.y + 3) * s);
	                triangle((this.x + 7) * s, (this.y - 21) * s, (this.x + 2) * s, (this.y - 36) * s, (this.x - 22) * s, (this.y - 7) * s);
	                triangle((this.x - 43) * s, (this.y + 29) * s, (this.x - 39) * s, (this.y - 9) * s, (this.x - 23) * s, (this.y - 20) * s);
	                triangle((this.x - 32) * s, (this.y - 9) * s, (this.x - 23) * s, (this.y - 20) * s, (this.x - 37) * s, (this.y - 31) * s);
	            }
	            if (this.colorType === "zebra") {
	                fill(this.color);
	                // body
	                ellipse(this.x * s, this.y * s, 118 * s, 74 * s);
	                // tail
	                triangle((this.x-55) * s, this.y * s, (this.x-88.5) * s, (this.y-37) * s, (this.x-88.5) * s, (this.y+37) * s);
	                // eye
	                fill(0, 0, 0);
	                ellipse((this.x+29.5) * s, this.y * s, 15 * s, 15 * s);
	                fill(0, 0, 0);
	                triangle((this.x - 27) * s, (this.y + 34) * s, (this.x - 20) * s, (this.y - 9) * s, (this.x - 6) * s, (this.y + 3) * s);
	                triangle((this.x + 7) * s, (this.y - 21) * s, (this.x + 2) * s, (this.y - 36) * s, (this.x - 22) * s, (this.y - 7) * s);
	                triangle((this.x - 43) * s, (this.y + 29) * s, (this.x - 39) * s, (this.y - 9) * s, (this.x - 23) * s, (this.y - 20) * s);
	                triangle((this.x - 32) * s, (this.y - 9) * s, (this.x - 23) * s, (this.y - 20) * s, (this.x - 37) * s, (this.y - 31) * s);
	            }
	            if (this.colorType === "pumpkin") {
	                fill(102, 181, 96);
	                // tail
	                triangle((this.x-18) * s, (this.y + -2) * s, (this.x-86) * s, (this.y-29) * s, (this.x-86) * s, (this.y+27) * s);
	                fill(255, 150, 38);
	                // body
	                ellipse(this.x * s, this.y * s, 118 * s, 74 * s);
	                // eye
	                fill(0, 0, 0);
	                ellipse((this.x+29.5) * s, this.y * s, 15 * s, 15 * s);
	            }
	            if (this.colorType === "christmas") {
	                fill(31, 166, 92);
	                // body
	                ellipse(this.x * s, this.y * s, 118 * s, 74 * s);
	                // tail
	                triangle((this.x+60) * s, this.y * s, (this.x-88.5) * s, (this.y-49) * s, (this.x-88.5) * s, (this.y+49) * s);
	                // eye
	                fill(0, 0, 0);
	                ellipse((this.x+29.5) * s, this.y * s, 15 * s, 15 * s);
	                fill(222, 0, 0);
	                ellipse(this.x * s, (this.y + 10) * s, 12 * s , 12 * s);
	                fill(0, 55, 255);
	                ellipse((this.x - 20) * s, (this.y - 10) * s, 12 * s , 12 * s);
	                fill(245, 245, 245);
	                ellipse((this.x - 55) * s, (this.y + 12) * s, 12 * s , 12 * s);
	                fill(255, 187, 0);
	                ellipse((this.x - 65) * s, (this.y - 20) * s, 12 * s , 12 * s);
	            }
	        }
	    };
	    fish.moveIt = function() {
	        if (!this.chosenFood) {
	            if (timer % 100 === 0) {
	                fish.yStep = random(-3, 3);
	            }
	            this.x += this.xStep;
	            this.y += this.yStep;
	            if (this.x > 715 || this.x < -15) {
	                this.xStep = -this.xStep;
	            }
	            if (this.y > 505 || this.y < -15) {
	                this.yStep = -this.yStep;
	            }
	        } else {
	            //debug("swim, swim!");
	            if (this.chosenFood.x - this.x > 3) {
	                this.x += 3;
	            } else if (this.x - this.chosenFood.x > 3) {
	                this.x -= 3;
	            } else if (this.chosenFood.x > this.x) {
	                this.x += 0.5;
	            } else if (this.chosenFood.x < this.x) {
	                this.x -= 0.5;
	            }
	            
	            if (this.chosenFood.y - this.y > 3) {
	                this.y += 3;
	            } else if (this.y - this.chosenFood.y > 3) {
	                this.y -= 3;
	            } else if (this.chosenFood.y > this.y) {
	                this.y += 0.5;
	            } else if (this.chosenFood.y < this.y) {
	                this.y -= 0.5;
	            }
	        }
	    };
	    fish.checkIfSelected = function() {
	        if (mouseIsClicked && mouseX > (this.x - 55) * s && mouseX < (this.x + 59) * s && mouseY > (this.y - 37) * s && mouseY < (this.y + 37) * s && !this.sold) {
	            this.selected = true;
	            selectedTab = "selected fish";
	        }
	        this.hungerLevel --;
	        if (this.hungerLevel < 0 && developer) {
	            this.sold = true;
	            selectedFish = "none";
	        }
	    };
	    fish.checkForFood = function(fishFood) {
	        if (this.chosenFood && !this.sold) {
	            if (this.chosenFoodDistance > dist(this.x, this.y, fishFood.x, fishFood.y)) {
	                this.chosenFood = fishFood;
	                this.chosenFoodDistance = dist(this.x, this.y, fishFood.x, fishFood.y);
	                debug("yum!");
	            }
	        } else if (!this.sold) {
	            this.chosenFood = fishFood;
	            this.chosenFoodDistance = dist(this.x, this.y, fishFood.x, fishFood.y);
	            debug("super yum");
	        }
	        
	        if (fishFood.x > (this.x - 55) * s && fishFood.x < (this.x + 59) * s && fishFood.y > (this.y - 37) * s && fishFood.y < (this.y + 37) * s && !this.sold) {
	            this.hungerLevel += 100;
	            this.chosenFood = 0;
	            debug(this.hungerLevel, "hi!!!");
	            //food.splice(fishFood);
	        }
	    };
	    return fish;
	};

	var newLargeFish = function(x, y, color, s, bf1, bf2, r, g, b) {
	    var fish = {};
	    fish.x = x;
	    fish.y = y;
	    fish.yStep = 1;
	    fish.xStep = 1;
	    fish.s = s;
	    fish.bf1 = bf1;
	    fish.bf2 = bf2;
	    fish.r = r;
	    fish.g = g;
	    fish.b = b;
	    if (!bf1) {
	        fish.quality = random(7,10);
	        fish.color = color;
	    } else {
	        fish.quality = random(bf1.quality, bf2.quality);
	        if (bf1.color === myRed){
	            if (bf2.color === myOrange) {
	                fish.color = myRedOrange;
	            } else if (bf2.color === myYellow) {
	                fish.color = myOrange;
	            } else if (bf2.color === myGreen) {
	                fish.colorType = "christmas";
	            } else if (bf2.color === myBlue) {
	                fish.color = myBlueRed;
	            } else if (bf2.color === myPurple) {
	                fish.color = myPurpleRed;
	            } else if (bf2.color === myPink) {
	                fish.color = myPinkRed;
	            } else if (bf2.color === myRed) {
	                fish.color = myRed;
	            } else if (bf2.color === myBlack) {
	                fish.color = myRedBlack;
	            } else if (bf2.color === myWhite && !bf2.colorType) {
	                fish.color = myPink;
	            } else if (bf2.colorType === "zebra" && bf2.color === myWhite) {
	                fish.colorType = "zebra";
	                fish.color = myRed;
	            }
	        } else if (bf1.color === myOrange){
	            if (bf2.color === myOrange) {
	                fish.color = myOrange;
	            } else if (bf2.color === myYellow) {
	                fish.color = myOrangeYellow;
	            } else if (bf2.color === myGreen) {
	                fish.colorType = "pumpkin";
	            } else if (bf2.color === myPink) {
	                fish.color = myPinkOrange;
	            } else if (bf2.color === myRed) {
	                fish.color = myRedOrange;
	            } else if (bf2.color === myBlack) {
	                fish.color = myOrangeBlack;
	            } else if (bf2.color === myWhite && !bf2.colorType) {
	                fish.color = myOrangeWhite;
	            } else if (bf2.colorType === "zebra" && bf2.color === myWhite) {
	                fish.colorType = "zebra";
	                fish.color = myOrange;
	            }
	        } else if (bf1.color === myYellow){
	            if (bf2.color === myOrange) {
	                fish.color = myOrangeYellow;
	            } else if (bf2.color === myYellow) {
	                fish.color = myYellow;
	            } else if (bf2.color === green) {
	                fish.color = myYellowGreen;
	            } else if (bf2.color === myBlue) {
	                fish.color = myBlueYellow;
	            } else if (bf2.color === myPink) {
	                fish.color = myPinkYellow;
	            } else if (bf2.color === myRed) {
	                fish.color = myOrange;
	            } else if (bf2.color === myBlack) {
	                fish.colorType = "lightning";
	                fish.quality += 2;
	            } else if (bf2.color === myWhite && !bf2.colorType) {
	                fish.color = myYellowWhite;
	            } else if (bf2.colorType === "zebra" && bf2.color === myWhite) {
	                fish.colorType = "zebra";
	                fish.color = myYellow;
	            }
	        } else if (bf1.color === myGreen){
	            if (bf2.color === myYellow) {
	                fish.color = myYellowGreen;
	            } else if (bf2.color === myOrange) {
	                fish.colorType = "pumpkin";
	            } else if (bf2.color === green) {
	                fish.color = myGreen;
	            } else if (bf2.color === myBlue) {
	                fish.color = myBlueGreen;
	            } else if (bf2.color === myRed) {
	                fish.colorType = "christmas";
	            } else if (bf2.color === myBlack) {
	                fish.color = myGreenBlack;
	            } else if (bf2.color === myWhite && !bf2.colorType) {
	                fish.color = myGreenWhite;
	            } else if (bf2.colorType === "zebra" && bf2.color === myWhite) {
	                fish.colorType = "zebra";
	                fish.color = myGreen;
	            }
	        } else if (bf1.color === myBlue){
	            if (bf2.color === myYellow) {
	                fish.color = myBlueYellow;
	            } else if (bf2.color === green) {
	                fish.color = myBlueGreen;
	            } else if (bf2.color === myBlue) {
	                fish.color = myBlueBlue;
	            } else if (bf2.color === myPurple) {
	                fish.color = myPurpleBlue;
	            } else if (bf2.color === myPink) {
	                fish.color = myPinkBlue;
	            } else if (bf2.color === myRed) {
	                fish.color = myBlueRed;
	            } else if (bf2.color === myBlack) {
	                fish.color = myBlueBlack;
	            } else if (bf2.color === myWhite && !bf2.colorType) {
	                fish.color = myBlueWhite;
	            } else if (bf2.colorType === "zebra" && bf2.color === myWhite) {
	                fish.colorType = "zebra";
	                fish.color = myBlue;
	            }
	        } else if (bf1.color === myPurple){
	            if (bf2.color === myBlue) {
	                fish.color = myPurpleBlue;
	            } else if (bf2.color === myPurple) {
	                fish.color = myPurple;
	            } else if (bf2.color === myPink) {
	                fish.color = myPinkPurple;
	            } else if (bf2.color === myRed) {
	                fish.color = myPurpleRed;
	            } else if (bf2.color === myBlack) {
	                fish.color = myPurpleBlack;
	            } else if (bf2.color === myWhite && !bf2.colorType) {
	                fish.color = myPurpleWhite;
	            } else if (bf2.colorType === "zebra" && bf2.color === myWhite) {
	                fish.colorType = "zebra";
	                fish.color = myPurple;
	            }
	        } else if (bf1.color === myPink){
	            if (bf2.color === myOrange) {
	                fish.color = myPinkOrange;
	            } else if (bf2.color === myYellow) {
	                fish.color = myPinkYellow;
	            } else if (bf2.color === myBlue) {
	                fish.color = myPinkBlue;
	            } else if (bf2.color === myPurple) {
	                fish.color = myPinkPurple;
	            } else if (bf2.color === myPink) {
	                fish.color = myPink;
	            } else if (bf2.color === myRed) {
	                fish.color = myPinkRed;
	            } else if (bf2.color === myBlack) {
	                fish.color = myPinkBlack;
	            } else if (bf2.color === myWhite && !bf2.colorType) {
	                fish.color = myPinkWhite;
	            } else if (bf2.colorType === "zebra" && bf2.color === myWhite) {
	                fish.colorType = "zebra";
	                fish.color = myPink;
	            }
	        } else if (bf1.color === myBlack) {
	            if (bf2.color === myOrange) {
	                fish.color = myOrangeBlack;
	            } else if (bf2.color === myGreen) {
	                fish.color = myGreenBlack;
	            } else if (bf2.color === myBlue) {
	                fish.color = myBlueBlack;
	            } else if (bf2.color === myPurple) {
	                fish.color = myPurpleBlack;
	            } else if (bf2.color === myPink) {
	                fish.color = myPinkBlack;
	            } else if (bf2.color === myRed) {
	                fish.color = myRedBlack;
	            } else if (bf2.color === myBlack) {
	                fish.color = myBlack;
	            } else if (bf2.color === myWhite) {
	                fish.colorType = "zebra";
	                fish.quality += 1;
	                fish.color = myWhite;
	            } else if (bf2.color === myYellow) {
	                fish.colorType = "lightning";
	                fish.quality += 2;
	            }
	        } else if (bf1.color === myWhite && !bf1.colorType) {
	            if (bf2.color === myOrange) {
	                fish.color = myOrangeWhite;
	            } else if (bf2.color === myYellow) {
	                fish.color = myYellowWhite;
	            }else if (bf2.color === myGreen) {
	                fish.color = myGreenWhite;
	            } else if (bf2.color === myBlue) {
	                fish.color = myBlueWhite;
	            } else if (bf2.color === myPurple) {
	                fish.color = myPurpleWhite;
	            } else if (bf2.color === myPink) {
	                fish.color = myPinkWhite;
	            } else if (bf2.color === myRed) {
	                fish.color = myPink;
	            } else if (bf2.color === myBlack) {
	                fish.colorType = "zebra";
	                fish.quality += 1;
	                fish.color = myWhite;
	            } else if (bf2.color === myWhite) {
	                fish.color = myWhite;
	            }
	            fish.quality += 3;
	        } else if (bf1.colorType === "zebra") {
	            if (bf2.color === myOrange) {
	                fish.color = myOrange;
	                fish.colorType = "zebra";
	            } else if (bf2.color === myYellow) {
	                fish.color = myYellow;
	                fish.colorType = "zebra";
	            }else if (bf2.color === myGreen) {
	                fish.color = myGreen;
	                fish.colorType = "zebra";
	            } else if (bf2.color === myBlue) {
	                fish.color = myBlue;
	                fish.colorType = "zebra";
	            } else if (bf2.color === myPurple) {
	                fish.color = myPurple;
	                fish.colorType = "zebra";
	            } else if (bf2.color === myPink) {
	                fish.color = myPink;
	                fish.colorType = "zebra";
	            } else if (bf2.color === myRed) {
	                fish.color = myRed;
	                fish.colorType = "zebra";
	            }
	        } else {
	            myr = random(0,255);
	            floor(myr);
	            myg = random(0,255);
	            floor(myr);
	            myb = random(0,255);
	            floor(myr);
	            debug(myr,myg,myb);
	            var newColor = (myr,myg,myb);
	            fish.color = newColor;
	        }
	        fish.quality = random(7,10);
	    }
	    fish.cost = round(fish.quality * 10);
	    fish.type = "basic";
	    fish.sold = false;
	    fish.gender = random(0,1);
	    fish.selected = false;
	    if (fish.gender > 0.5) {
	        fish.gender = "female";
	    } else {
	        fish.gender = "male";
	    }
	    fish.drawIt = function() {
	        if (!this.sold && !this.colorType) {
	        if (!this.r) {
	            fill(this.color);
	        } else {
	            fill(this.r, this.g, this.b);
	        }
	        // body
	        ellipse(this.x * s, this.y * s, 118 * s, 74 * s);
	        // tail
	        triangle((this.x-55) * s, this.y * s, (this.x-88.5) * s, (this.y-37) * s, (this.x-88.5) * s, (this.y+37) * s);
	        // eye
	        fill(0, 0, 0);
	        ellipse((this.x+29.5) * s, this.y * s, 15 * s, 15 * s);
	        } else if (!this.sold) {
	            if (this.colorType === "lightning") {
	                fill(61, 61, 61);
	                // body
	                ellipse(this.x * s, this.y * s, 118 * s, 74 * s);
	                // tail
	                triangle((this.x-55) * s, this.y * s, (this.x-88.5) * s, (this.y-37) * s, (this.x-88.5) * s, (this.y+37) * s);
	                // eye
	                fill(0, 0, 0);
	                ellipse((this.x+29.5) * s, this.y * s, 15 * s, 15 * s);
	        
	                fill(255, 234, 0);
	                triangle((this.x - 27) * s, (this.y + 34) * s, (this.x - 20) * s, (this.y - 9) * s, (this.x - 6) * s, (this.y + 3) * s);
	                triangle((this.x + 7) * s, (this.y - 21) * s, (this.x + 2) * s, (this.y - 36) * s, (this.x - 22) * s, (this.y - 7) * s);
	                triangle((this.x - 43) * s, (this.y + 29) * s, (this.x - 39) * s, (this.y - 9) * s, (this.x - 23) * s, (this.y - 20) * s);
	                triangle((this.x - 32) * s, (this.y - 9) * s, (this.x - 23) * s, (this.y - 20) * s, (this.x - 37) * s, (this.y - 31) * s);
	            }
	            if (this.colorType === "zebra") {
	                fill(this.color);
	                // body
	                ellipse(this.x * s, this.y * s, 118 * s, 74 * s);
	                // tail
	                triangle((this.x-55) * s, this.y * s, (this.x-88.5) * s, (this.y-37) * s, (this.x-88.5) * s, (this.y+37) * s);
	                // eye
	                fill(0, 0, 0);
	                ellipse((this.x+29.5) * s, this.y * s, 15 * s, 15 * s);
	                fill(0, 0, 0);
	                triangle((this.x - 27) * s, (this.y + 34) * s, (this.x - 20) * s, (this.y - 9) * s, (this.x - 6) * s, (this.y + 3) * s);
	                triangle((this.x + 7) * s, (this.y - 21) * s, (this.x + 2) * s, (this.y - 36) * s, (this.x - 22) * s, (this.y - 7) * s);
	                triangle((this.x - 43) * s, (this.y + 29) * s, (this.x - 39) * s, (this.y - 9) * s, (this.x - 23) * s, (this.y - 20) * s);
	                triangle((this.x - 32) * s, (this.y - 9) * s, (this.x - 23) * s, (this.y - 20) * s, (this.x - 37) * s, (this.y - 31) * s);
	            }
	            if (this.colorType === "pumpkin") {
	                fill(102, 181, 96);
	                // tail
	                triangle((this.x-18) * s, (this.y + -2) * s, (this.x-86) * s, (this.y-29) * s, (this.x-86) * s, (this.y+27) * s);
	                fill(255, 150, 38);
	                // body
	                ellipse(this.x * s, this.y * s, 118 * s, 74 * s);
	                // eye
	                fill(0, 0, 0);
	                ellipse((this.x+29.5) * s, this.y * s, 15 * s, 15 * s);
	            }
	        }
	    };
	    fish.moveIt = function() {
	        if (timer % 100 === 0) {
	            fish.yStep = random(-3, 3);
	        }
	        this.x += this.xStep;
	        this.y += this.yStep;
	        if (this.x > 215 || this.x < -15) {
	            this.xStep = -this.xStep;
	        }
	        if (this.y > 505 || this.y < -15) {
	            this.yStep = -this.yStep;
	        }
	    };
	    fish.checkIfSelected = function() {
	        if (mouseIsClicked && mouseX > (this.x - 55) * s && mouseX < (this.x + 59) * s && mouseY > (this.y - 37) * s && mouseY < (this.y + 37) * s && !this.sold) {
	            this.selected = true;
	            selectedTab = "selected fish";
	        }
	    };
	    return fish;
	};

	var shopBasicFish = newBasicFish(1000, 280, myRed, 0.33);
	var shopLargeFish = newLargeFish(1000, 280, myRed, 0.33);

	var menuFish = newBasicFish(0, 0, color(31, 87, 255), 0.5);

	var newBasicFood = function(x, y) {
	    var food = {};
	    food.x = x;
	    food.y = y;
	    food.speed = random(0.4, 1.8);
	    food.drawIt = function() {
	        fill(168, 123, 40);
	        ellipse(this.x, this.y, 12, 12);
	    };
	    food.moveIt = function() {
	        if (this.y < 375) {
	            this.y += this.speed;
	        } else {
	            //food.splice(this);
	        }
	    };
	    return food;
	};

	var shopBasicFood = newBasicFood(320, 255);
	var shopBasicFood2 = newBasicFood(340, 250);
	var shopBasicFood3 = newBasicFood(330, 263);

	var newSeaweed = function(x, y, s) {
	    var seaweed = {};
	    seaweed.x = x;
	    seaweed.y = y;
	    seaweed.beingPlaced = true;
	    seaweed.limit = random(315, 335);
	    seaweed.drawIt = function() {
	        if (this.beingPlaced) {
	            this.x = mouseX;
	            this.y = mouseY;
	            if (mouseIsPressed && this.x < 250) {
	                this.beingPlaced = false;
	            }
	        } else if (this.y < this.limit) {
	            this.y += 1;
	        }
	        fill(30, 199, 49);
	        ellipse(this.x * s, this.y * s, 15 * s, 130 * s);
	    };
	    return seaweed;
	};

	var shopSeaweed = newSeaweed(812, 905, 0.4);
	shopSeaweed.beingPlaced = false;

	var newSandcastle = function(x, y, s) {
	    var sandcastle = {};
	    sandcastle.x = x;
	    sandcastle.y = y;
	    sandcastle.beingPlaced = true;
	    sandcastle.limit = random(315, 335);
	    sandcastle.drawIt = function() {
	        if (this.beingPlaced) {
	            this.x = mouseX;
	            this.y = mouseY;
	            if (mouseIsPressed && this.x < 200) {
	                this.beingPlaced = false;
	            }
	        } else if (this.y < this.limit) {
	            this.y += 1;
	        }
	        //main part
	        fill(245, 239, 204);
	        rect(40, 270, 140, 110);
	        //small towers
	        ellipse(20, 380, 40, 40);
	        ellipse(200, 380, 40, 40);
	        rect(0, 250, 40, 124);
	        rect(180, 250, 40, 124);
	        triangle(0, 250, 40, 250, 20, 220);
	        triangle(180, 250, 220, 250, 200, 220);
	        //main tower
	        rect(60, 190, 100, 80);
	        triangle(60, 190, 160, 190, 110, 140);
	        //windows
	        fill(227, 222, 189);
	        rect(85, 190, 50, 66);
	        rect(9, 256, 20, 30);
	        rect(190, 256, 20, 30);
	        rect(9, 317, 20, 30);
	        rect(191, 316, 20, 30);
	        rect(56, 280, 20, 30);
	        rect(100, 280, 20, 30);
	        rect(145, 280, 20, 30);
	        rect(85, 315, 50, 66);
	        rect(56, 324, 20, 30);
	        rect(145, 325, 20, 30);
	    };
	    return sandcastle;
	};

	var boughtFish = [];
	var seaweed = [];

	var drawStarterTank = function() {
	    background(89, 216, 255);
	    if (developer) {
	        fill(227, 222, 189);
	        ellipse(60, 399, 154, 71);
	        ellipse(130, 399, 154, 71);
	        ellipse(-35, 399, 154, 71);
	        ellipse(267, 399, 154, 71);
	    }
	    fill(82, 160, 255);
	    rect(0, 0, 100, 50);
	    fill(9, 0, 255);
	    textSize(30);
	    text(coins, 46,40);
	    fill(255, 186, 48);
	    stroke(255, 170, 0);
	    ellipse(22, 17, 25, 25);
	    ellipse(32, 30, 25, 25);
	    ellipse(16, 29, 25, 25);
	    noStroke();
	    fill(161, 161, 255);
	    rect(250+400, 0, 150, 400);
	    fill(89, 216, 255);
	    rect(310+400, 0, 20, 20);
	    if (selectedTab === "buy fish" && !developer) {
	        fill(148, 148, 232);
	        rect(330+400, 0, 70, 20);
	        oldBasicButton.drawIt();
	        oldLargeButton.drawIt();
	        oldRedButton.drawIt();
	        oldOrangeButton.drawIt();
	        oldYellowButton.drawIt();
	        oldGreenButton.drawIt();
	        oldBlueButton.drawIt();
	        oldPurpleButton.drawIt();
	        oldPinkButton.drawIt();
	        oldBlackButton.drawIt();
	        oldWhiteButton.drawIt();
	        oldBuyFishButton.drawIt();
	        oldBasicButton.checkIfPressed();
	        oldLargeButton.checkIfPressed();
	        oldRedButton.checkIfPressed();
	        oldOrangeButton.checkIfPressed();
	        oldYellowButton.checkIfPressed();
	        oldGreenButton.checkIfPressed();
	        oldBlueButton.checkIfPressed();
	        oldPurpleButton.checkIfPressed();
	        oldPinkButton.checkIfPressed();
	        oldBlackButton.checkIfPressed();
	        oldWhiteButton.checkIfPressed();
	        oldBuyFishButton.checkIfPressed();
	        if (selectedType === "basic" && !developer) {
	            noFill();
	            stroke(0, 0, 0);
	            rect(260+400, 50, 50, 37,20);
	            noStroke();
	            cost = 40;
	        }
	        if (selectedType === "large" && !developer) {
	            noFill();
	            stroke(0, 0, 0);
	            rect(330+400, 50, 50, 37,20);
	            noStroke();
	            cost = 80;
	        }
	        if (selectedColor === color(240, 44, 34) && !developer) {
	            noFill();
	            stroke(0, 0, 0);
	            rect(260+400, 120, 50, 37,10);
	            noStroke();
	        }
	        if (selectedColor === color(255, 111, 0) && !developer) {
	            noFill();
	            stroke(0, 0, 0);
	            rect(335+400, 120, 50, 37,10);
	            noStroke();
	        }
	        if (selectedColor === color(255, 234, 0) && !developer) {
	            noFill();
	            stroke(0, 0, 0);
	            rect(260+400, 170, 50, 37,10);
	            noStroke();
	        }
	        if (selectedColor === color(44, 196, 6) && !developer) {
	            noFill();
	            stroke(0, 0, 0);
	            rect(335+400, 170, 50, 37,10);
	            noStroke();
	        }
	        if (selectedColor === color(0, 149, 255) && !developer) {
	            noFill();
	            stroke(0, 0, 0);
	            rect(260+400, 220, 50, 37,10);
	            noStroke();
	        }
	        if (selectedColor === color(157, 0, 255) && !developer) {
	            noFill();
	            stroke(0, 0, 0);
	            rect(335+400, 220, 50, 37,10);
	            noStroke();
	        }
	        if (selectedColor === color(255, 130, 238) && !developer) {
	            noFill();
	            stroke(0, 0, 0);
	            rect(260+400, 270, 50, 37,10);
	            noStroke();
	        }
	        if (selectedColor === color(61, 61, 61) && !developer) {
	            noFill();
	            stroke(0, 0, 0);
	            rect(335+400, 270, 50, 37,10);
	            noStroke();
	        }
	        if (selectedColor === color(255, 255, 255) && !developer) {
	            noFill();
	            stroke(0, 0, 0);
	            rect(260+400, 315, 50, 37,10);
	            noStroke();
	        }
	        fill(0, 21, 255);
	        textSize(24);
	        text("Types", 285+400, 40);
	        textSize(17);
	        text("Basic", 265+400, 75);
	        text("Large", 335+400, 75);
	        textSize(18);
	        text("Buy Fish", 290+400, 380);
	        if (oldBasicButton.pressed && !developer) {
	            selectedType = "basic";
	        }
	        if (oldLargeButton.pressed && !developer) {
	            selectedType = "large";
	        }
	        if (oldRedButton.pressed && !developer) {
	            selectedColor = color(240, 44, 34);
	        }
	        if (oldOrangeButton.pressed && !developer) {
	            selectedColor = color(255, 111, 0);
	        }
	        if (oldYellowButton.pressed && !developer) {
	            selectedColor = color(255, 234, 0);
	        }
	        if (oldGreenButton.pressed && !developer) {
	            selectedColor = color(44, 196, 6);
	        }
	        if (oldBlueButton.pressed && !developer) {
	            selectedColor = color(0, 149, 255);
	        }
	        if (oldPurpleButton.pressed && !developer) {
	            selectedColor = color(157, 0, 255);
	        }
	        if (oldPinkButton.pressed && !developer) {
	            selectedColor = color(255, 130, 238);
	            selectedButton.pressed = false;
	        }
	        if (oldBlackButton.pressed && !developer) {
	            selectedColor = color(61, 61, 61);
	            oldBlackButton.pressed = false;
	        }
	        if (oldWhiteButton.pressed && !developer) {
	            selectedColor = color(255, 255, 255);
	            oldWhiteButton.pressed = false;
	        }
	        text("40", 275+400, 110);
	        text("80", 350+400, 110);
	        if (oldBuyFishButton.pressed && selectedType === "basic" && coins >= cost) {
	            boughtFish.push(newBasicFish(130, 200, selectedColor, 0.7));
	            coins -= cost;
	            oldBuyFishButton.pressed = false;
	        } else if (oldBuyFishButton.pressed && selectedType === "large" && coins >= cost) {
	            boughtFish.push(newLargeFish(130, 200, selectedColor, 1));
	            coins -= cost;
	            oldBuyFishButton.pressed = false;
	        } else if (oldBuyFishButton.pressed) {
	            cannotPay = true;
	            affordTimer = 0;
	        }
	    }
	    if (selectedTab === "buy fish" && developer) {
	        //selected fish grayed out
	        fill(148, 148, 232);
	        rect(330+400, 0, 70, 20);
	        //backgrounds
	        fill(217, 214, 255);
	        rect(298+400, 75, 55, 55, 12);
	        if (selectedColor === 1) {
	            fill(myRed);
	            shopBasicFish.color = myRed;
	            shopLargeFish.color = myRed;
	        }
	        if (selectedColor === 2) {
	            fill(myOrange);
	            shopBasicFish.color = myOrange;
	            shopLargeFish.color = myOrange;
	        }
	        if (selectedColor === 3) {
	            fill(myYellow);
	            shopBasicFish.color = myYellow;
	            shopLargeFish.color = myYellow;
	        }
	        if (selectedColor === 4) {
	            fill(myGreen);
	            shopBasicFish.color = myGreen;
	            shopLargeFish.color = myGreen;
	        }
	        if (selectedColor === 5) {
	            fill(myBlue);
	            shopBasicFish.color = myBlue;
	            shopLargeFish.color = myBlue;
	        }
	        if (selectedColor === 6) {
	            fill(myPurple);
	            shopBasicFish.color = myPurple;
	            shopLargeFish.color = myPurple;
	        }
	        if (selectedColor === 7) {
	            fill(myPink);
	            shopBasicFish.color = myPink;
	            shopLargeFish.color = myPink;
	        }
	        if (selectedColor === 8) {
	            fill(myBlack);
	            shopBasicFish.color = myBlack;
	            shopLargeFish.color = myBlack;
	        }
	        if (selectedColor === 9) {
	            fill(myWhite);
	            shopBasicFish.color = myWhite;
	            shopLargeFish.color = myWhite;
	        }
	            rect(298+400, 145, 55, 55, 12);
	            fill(217, 214, 255);
	            rect(298+400, 240, 55, 55, 12);
	            rect(298+400, 335, 55, 55, 12);
	        //arrows
	        fill(107, 84, 255);
	        triangle(360,80,360,120,395,100);
	        triangle(292,80,292,120,254,100);
	        triangle(360,150,360,190,395,170);
	        triangle(292,150,292,190,254,170);
	        triangle(360,245,360,285,395,265);
	        triangle(292,245,292,285,254,265);
	        triangle(360,340,360,385,395,360);
	        triangle(292,340,292,385,254,360);
	        fishRightButton.checkIfPressed();
	        fishLeftButton.checkIfPressed();
	        colorRightButton.checkIfPressed();
	        colorLeftButton.checkIfPressed();
	        foodRightButton.checkIfPressed();
	        foodLeftButton.checkIfPressed();
	        buyFishButton.drawIt();
	        buyFoodButton.drawIt();
	        buyTankDecorationsButton.drawIt();
	        buyFishButton.checkIfPressed();
	        buyFoodButton.checkIfPressed();
	        buyTankDecorationsButton.checkIfPressed();
	        if (fishRightButton.pressed && selectedType < 2) {
	            selectedType++;
	        } else if (fishRightButton.pressed && selectedType === 2) {
	            selectedType = 1;
	        }
	        if (fishLeftButton.pressed && selectedType > 1) {
	            selectedType--;
	        } else if (fishLeftButton.pressed && selectedType === 1) {
	            selectedType = 2;
	        }
	        
	        if (colorRightButton.pressed && selectedColor < 9) {
	            selectedColor++;
	        } else if (colorRightButton.pressed && selectedColor === 9) {
	            selectedColor = 1;
	        }
	        if (colorLeftButton.pressed && selectedColor > 1) {
	            selectedColor--;
	        } else if (colorLeftButton.pressed && selectedColor === 1) {
	            selectedColor = 9;
	        }
	        if (foodRightButton.pressed && selectedFood < 2) {
	            selectedFood++;
	        } else if (foodRightButton.pressed && selectedFood === 2) {
	            selectedFood = 1;
	        }
	        if (foodLeftButton.pressed && selectedFood > 1) {
	            selectedFood--;
	        } else if (foodLeftButton.pressed && selectedFood === 1) {
	            selectedFood = 2;
	        }
	        if (selectedType === 1) {
	            shopBasicFish.drawIt();
	            fill(0, 8, 230);
	            textSize(11);
	            text("  Basic:\n40 coins", 305, 115);
	            cost = 40;
	        } else if (selectedType === 2) {
	            shopLargeFish.drawIt();
	            fill(0, 8, 230);
	            textSize(11);
	            text("  Large:\n80 coins", 305, 115);
	            cost = 80;
	        }
	        if (selectedFood === 1) {
	            shopBasicFood.drawIt();
	            shopBasicFood2.drawIt();
	            shopBasicFood3.drawIt();
	            fill(0, 8, 230);
	            textSize(13);
	            text("20 coins", 302, 282);
	            foodCost = 20;
	        }
	        if (selectedDecorations === 1) {
	            shopSeaweed.drawIt();
	            fill(0, 8, 230);
	            textSize(13);
	            text("10 coins", 302, 382);
	            decorationCost = 10;
	        }
	        fill(47, 0, 255);
	        textSize(18);
	        text("Buy Fish", 290, 50);
	        textSize(16);
	        text("Buy Food", 290, 225);
	        textSize(14);
	        text("Buy Tank Decorations", 257, 320);
	        if (buyFishButton.pressed && selectedType === 1 && coins >= cost) {
	            boughtFish.push(newBasicFish(130, 200, shopBasicFish.color, 0.7));
	            coins -= cost;
	            buyFishButton.pressed = false;
	        } else if (buyFishButton.pressed && selectedType === 2 && coins >= cost) {
	            boughtFish.push(newLargeFish(130, 200, shopLargeFish.color, 1));
	            coins -= cost;
	            buyFishButton.pressed = false;
	        } else if (buyFishButton.pressed) {
	            cannotPay = true;
	            affordTimer = 0;
	        }
	        if (buyFoodButton.pressed && selectedFood === 1 && coins >= foodCost) {
	            placingBasicFood = true;
	            aboutToPlaceFood += 3;
	            coins -= foodCost;
	            buyFoodButton.pressed = false;
	        }
	        if (buyTankDecorationsButton.pressed && selectedDecorations === 1 && coins >= decorationCost) {
	            seaweed.push(newSeaweed(mouseX, mouseY, 1));
	            coins -= decorationCost;
	            buyTankDecorationsButton.pressed = false;
	        }
	    }
	    if (selectedTab === "selected fish") {
	        fill(148, 148, 232);
	        rect(250+400, 0, 60, 20);
	        if (selectedFish === "none") {
	            fill(0, 29, 171);
	            textSize(20);
	            text("No fish selected.", 252, 55);
	        } else {
	            fill(70, 64, 255);
	            textSize(20);
	            text("Gender: " + selectedFish.gender, 260+400, 50);
	            text("Will sell for: " + selectedFish.cost, 260+400, 80);
	            sellFishButton.drawIt();
	            sellFishButton.checkIfPressed();
	            breedFishButton.drawIt();
	            breedFishButton.checkIfPressed();
	            showFishButton.drawIt();
	            showFishButton.checkIfPressed();
	            fill(51, 0, 255);
	            textSize(26);
	            text("Sell", 303+400, 154);
	            text("Breed", 290+400, 233);
	            textSize(20);
	            text("   Show\n(20 coins)", 283+400, 300);
	            if (sellFishButton.pressed) {
	                selectedFish.sold = true;
	                coins += selectedFish.cost;
	                selectedFish = "none";
	            }
	            if (breedFishButton.pressed && myFish) {
	                /*if (breeding && breedFish1 === selectedFish) {
	                    breeding = false;
	                }*/
	                if (!breeding) {
	                    breeding = true;
	                    breedFish1 = selectedFish;
	                }
	                if (breeding && breedFish1.gender === "female" && selectedFish.gender === "male" && breedFish1.s === selectedFish.s) {
	                    breedFish2 = selectedFish;
	                    if (breedFish1.s === 0.7) {
	                        boughtFish.push(newBasicFish(130, 200, selectedColor, 0.7, breedFish1, breedFish2));
	                    }
	                    if (breedFish1.s === 1) {
	                        boughtFish.push(newBasicFish(130, 200, selectedColor, 1, breedFish1, breedFish2));
	                    }
	                    breeding = false;
	                }
	                if (breeding && breedFish1.gender === "male" && selectedFish.gender === "female" && breedFish1.s === selectedFish.s) {
	                    breedFish2 = selectedFish;
	                    if (breedFish1.s === 0.7) {
	                        boughtFish.push(newBasicFish(130, 200, selectedColor, 0.7, breedFish1, breedFish2));
	                    }
	                    if (breedFish1.s === 1) {
	                        boughtFish.push(newBasicFish(130, 200, selectedColor, 1, breedFish1, breedFish2));
	                    }
	                    breeding = false;
	                }
	            }
	            if (showFishButton.pressed/* && minu - oldminu > 10*/) {
	                if (coins>=20 && !justShowed) {
	                    showPoints = 0;
	                    coins -= 20;
	                    justShowed = true;
	                    showTimer = 0;
	                    if (selectedFish.s === 0.7) {
	                        fish2 = newBasicFish(150, 75, false, 0.7, false, false, random(0,255), random(0,255), random(0,255));
	                        fish3 = newBasicFish(430, 75, false, 0.7, false, false, random(0,255), random(0,255), random(0,255));
	                        fish4 = newBasicFish(150, 350, false, 0.7, false, false, random(0,255), random(0,255), random(0,255));
	                        fish5 = newBasicFish(430, 350, false, 0.7, false, false, random(0,255), random(0,255), random(0,255));
	                    } else if (selectedFish.s === 1) {
	                        //debug("large fish");
	                        fish2 = newLargeFish(150, 75, false, 0.7, false, false, random(0,255), random(0,255), random(0,255));
	                        fish3 = newLargeFish(430, 75, false, 0.7, false, false, random(0,255), random(0,255), random(0,255));
	                        fish4 = newLargeFish(150, 350, false, 0.7, false, false, random(0,255), random(0,255), random(0,255));
	                        fish5 = newLargeFish(430, 350, false, 0.7, false, false, random(0,255), random(0,255), random(0,255));
	                    }
	                    if (selectedFish.quality > fish2.quality) {
	                        showPoints += 10;
	                    } if (selectedFish.quality > fish3.quality) {
	                        showPoints += 10;
	                    } if (selectedFish.quality > fish4.quality) {
	                        showPoints += 10;
	                    } if (selectedFish.quality > fish5.quality) {
	                        showPoints += 10;
	                    }
	                    //showCoins = showPoints - 20;
	                    coins += showPoints;
	                    //debug("Made the fish!", fish2);
	                    state = "showing";
	                }else if (!justShowed) {
	                    cannotPay = true;
	                    affordTimer = 0;
	                } else if (justShowed) {
	                    cannotShow = true;
	                    noShowTimer = 0;
	                }
	                    //}
	            }
	        }
	    }
	    fill(130, 98, 217);
	    textSize(15);
	    text("   Shop", 250+400, 15);
	    textSize(11);
	    text("Selected Fish", 332+400, 13);
	    buyButton.checkIfPressed();
	    selectedButton.checkIfPressed();
	    if (buyButton.pressed) {
	        selectedTab = "buy fish";
	        buyButton.pressed = false;
	    }
	    if (selectedButton.pressed) {
	        selectedTab = "selected fish";
	        selectedButton.pressed = false;
	    }
	    if (cannotPay) {
	        fill(0, 0, 0);
	        textSize(20);
	        text("You cannot afford this item.", 7+400, 200);
	    }
	    if (cannotShow) {
	        fill(0, 0, 0);
	        textSize(20);
	        text("No show is availible. Try again later.", 7+400, 200);
	    }
	    for (var i=0;i<boughtFish.length;i++) {
	        boughtFish[i].drawIt();
	        if (!paused) {
	            boughtFish[i].moveIt();    
	        }
	        boughtFish[i].checkIfSelected();
	        boughtFish[i].selected = false;
	        boughtFish[i].checkIfSelected();
	        if (boughtFish[i].selected) {
	            selectedFish = boughtFish[i];
	        }
	    }
	    for (var i=0;i<food.length;i++) {
	        food[i].drawIt();
	        food[i].moveIt(); 
	        for (var j=0;j<boughtFish.length;j++) {
	            boughtFish[j].checkForFood(food[i]);
	            debug("checking");
	        }
	    }
	    for (var i=0;i<seaweed.length;i++) {
	        seaweed[i].drawIt();
	    }
	    if (breeding) {
	        fill(255, 0, 0);
	        ellipse(mouseX, mouseY, 10, 10);
	        cancelBreedingButton.drawIt();
	        cancelBreedingButton.checkIfPressed();
	        fill(89, 0, 255);
	        textSize(18);
	        text("  Cancel\nBreeding", 40+400, 350);
	        if (breedFish1.gender === "female") {
	            fill(0, 0, 0);
	            text("Looking for a male",mouseX,mouseY+15);
	        } else {
	            fill(0, 0, 0);
	            text("Looking for a female",mouseX,mouseY+15);
	        }
	        if (cancelBreedingButton.pressed) {
	            breeding = false;
	        }
	    }
	    if (placingBasicFood) {
	        fill(156, 117, 26);
	        ellipse(mouseX, mouseY, 10, 10);
	        fill(0, 0, 0);
	        text("Placing food. "+ aboutToPlaceFood + " left.",mouseX-20,mouseY+20);
	        if (mouseIsClicked && mouseX < 250) {
	            food.push(newBasicFood(mouseX, mouseY));
	            aboutToPlaceFood--;
	        }
	        if (aboutToPlaceFood === 0) {
	            placingBasicFood = false;
	        }
	    }
	    pauseButton.drawIt();
	    pauseButton.checkIfPressed();
	    if (pauseButton.pressed) {
	        paused = !paused;
	    }
	    textSize(17);
	    fill(68, 0, 255);
	    text("Pause/Play", 150+400, 360);
	    if (justShowed) {
	        showTimer++;
	    }
	    if (showTimer>2000) {
	        justShowed = false;
	    }
	};

	var drawMenu = function() {
		pushMatrix();
		//translate(300,0);
	    background(0, 196, 255);
	    fill(0, 64, 255);
	    textSize(80);
	    text("Fish", 120+200, 90+50);
	    fill(0, 60, 163);
	    text("Collector", 45+200, 180+50);
	    playButton.drawIt();
	    playButton.checkIfPressed();
	    //helpButton.drawIt();
	    //helpButton.checkIfPressed();
	    pushMatrix();
	    translate(95+200,90+50);
	    rotate(30);
	    menuFish.drawIt();
	    popMatrix();
	    fill(194, 240, 252, 180);
	    stroke(194, 240, 252);
	    ellipse(50+200, 250+50, 80, 80);
	    ellipse(90+200, 350+50, 80, 80);
	    ellipse(330+200, 280+50, 120, 120);
	    noStroke();
	    fill(102, 0, 255);
	    textSize(40);
	    text("Play", 160+200, 255+50);
	    //text("Info", 165, 345);
	    if (playButton.pressed) {
	        state = "starter tank";
	    }
	    popMatrix();
	};

	var drawHelp = function() {
	    background(171, 242, 255);
	    fill(0, 147, 166);
	    text("        I'm sorry.\nThis page has not\n been created yet.\n  Check back later.", 30, 130);
	    fill(247, 255, 0);
	    ellipse(200, 320, 70, 70);
	    stroke(0, 0, 0);
	    strokeWeight(12);
	    point(182, 310);
	    point(218, 310);
	    noFill();
	    strokeWeight(6);
	    arc(200, 340, 40, 30, 179, 358);
	    noStroke();
	    /*if (mouseIsPressed && mouseX > 380 && mouseY > 380) {
	        state = "buyingAFish";
	    }*/
	    menuButton.drawIt();
	    menuButton.checkIfPressed();
	    fill(81, 0, 255);
	    textSize(38);
	    text("Menu", 152, 55);
	    if (menuButton.pressed) {
	        state = "menu";
	        menuButton.pressed = false;
	    }
	};

	var drawBuyingAFish = function() {
	    background(171, 242, 255);
	    fill(0, 147, 166);
	    textSize(45);
	    text("Buying a fish", 78, 55);
	    textSize(20);
	    text("Select which type of fish\nyou want to buy", 150, 105);
	    text("Choose a color", 150, 205);
	    text("Click Buy Fish", 150, 310);
	    
	    fill(0, 0, 0);
	    rect(25, 80, 120, 80);
	    rect(25, 186, 120, 80);
	    rect(25, 292, 120, 80);
	    fill(255, 255, 255);
	    rect(35, 90, 100, 60);
	    rect(35, 195, 100, 60);
	    rect(35, 300, 100, 60);
	};

	var drawShowingAFish = function() {
	    background(255, 255, 255);
	    //fish 2
	    fill(150, 217, 255);
	    stroke(0, 0, 0);
	    rect(20, 20, 150, 70);
	    noStroke();
	    fill(255, 255, 255);
	    rect(23, 23, 145, 15);
	    fish2.drawIt();
	    //fish 3
	    fill(150, 217, 255);
	    stroke(0, 0, 0);
	    rect(210, 20, 150, 70);
	    noStroke();
	    fill(255, 255, 255);
	    rect(213, 23, 145, 15);
	    fish3.drawIt();
	    //fish 4
	    fill(150, 217, 255);
	    stroke(0, 0, 0);
	    rect(20, 210, 150, 70);
	    noStroke();
	    fill(255, 255, 255);
	    rect(23, 213, 145, 15);
	    fish4.drawIt();
	    //fish 5
	    fill(150, 217, 255);
	    stroke(0, 0, 0);
	    rect(210, 210, 150, 70);
	    noStroke();
	    fill(255, 255, 255);
	    rect(213, 213, 145, 15);
	    fish5.drawIt();
	                    
	    if (selectedFish.quality > fish2.quality) {
	        //showPoints += 10;
	        fill(0, 255, 68);
	        textSize(15);
	        text("+10 Your fish beat this fish", 16, 120);
	    } if (selectedFish.quality > fish3.quality) {
	        //showPoints += 10;
	        fill(0, 255, 68);
	        textSize(15);
	        text("+10 Your fish beat this fish", 201, 120);
	    } if (selectedFish.quality > fish4.quality) {
	        //showPoints += 10;
	        fill(0, 255, 68);
	        textSize(15);
	        text("+10 Your fish beat this fish", 16, 310);
	    } if (selectedFish.quality > fish5.quality) {
	        //showPoints += 10;
	        fill(0, 255, 68);
	        textSize(15);
	        text("+10 Your fish beat this fish", 201, 310);
	    }
	    showCoins = showPoints - 20;
	    fill(0, 255, 68);
	    textSize(15);
	    text("Your profit is "+ showCoins + " coins", 201, 374);
	    showBackButton.drawIt();
	    fill(4, 0, 214);
	    textSize(30);
	    text("Back", 65+400, 365);
	    showBackButton.checkIfPressed();
	    if (showBackButton.pressed) {
	        state = "starter tank";
	    }
	    //coins += showPoints * 10;
	};
	
	p.draw = function() {
		mouseX = p.mouseX;
		mouseY = p.mouseY;
		keyCode = p.keyCode;
		if (state === "rainbowgames") {
	        drawRainbowGames();
	    }
	    if (state === "starter tank") {
	        drawStarterTank();
	    }
	    if (state === "menu") {
	        drawMenu();
	    }
	    if (state === "help") {
	        drawHelp();
	    }
	    if (state === "buyingAFish") {
	        drawBuyingAFish();
	    }
	    if (state === "showing") {
	        drawShowingAFish();
	    }
	    timer++;
	    //minu = minute();
	    affordTimer++;
	    if (affordTimer > 50) {
	        cannotPay = false;
	    }
	    noShowTimer++;
	    if (noShowTimer > 50) {
	        cannotShow = false;
	    }
	    keyIsReleased = false;
		keyIsPressed = false;
	    mouseIsClicked = false;
	};  

	
}

