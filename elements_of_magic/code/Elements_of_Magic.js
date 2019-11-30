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
	//Also remember to add mouseX = p.mouseX; mouseY = p.mouseY; to the draw function and do p.key instead of key.toString
	//Additional custom functions
	var CLOSE = p.CLOSE;//For beginShape/endShape
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
	var sq = function(number){
		return p.sq(number);
	};
	var sqrt = function(number){
		return p.sqrt(number);
	};
	var floor = function(number){
		return Math.floor(number);
	};
	var ceil = function(number){
		return Math.ceil(number);
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
	var createFont = function(font, size) {
		return p.createFont(font,size);
	};
	var textFont = function(font,size) {
		p.textFont(font,size);
	};
	var HAND = p.HAND;
	var ARROW = p.ARROW;
	var CENTER = p.CENTER;
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
	var keyIsPressed = false;
	p.keyPressed = function(){
		keyIsPressed = true;
	};
	var keyCode = p.keyCode;
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
	
	var width;
	var height;
	p.setup = function() {
		size(400, 400);//size of the canvas
		width = 400;
		height = 400;
		noFill();
		noStroke();
		background(2, 130, 194); //pick a color
	};
	
	var width = p.width;//canvas width
	var height = p.height;//canvas height

	//Definitions here
	//A work in progress game about mages (more commonly known as wizards).
	//The staff is your cursor. It glows more when you're over a button. To switch to a normal cursor change this variable:
	var staffCursor = true;
	var sound = false;//Change this to toggle sound
	//You can change the character's hair color. Change this variable to black, light brown, red, blonde or dark brown.
	var hairColor = "dark brown";
	//You can also change the character's skin color. Sorry for the lack of options; choose light or dark.
	var skinColor = "light";
	var gender = "girl"; //girl or boy?
	//A tip: If there's a person, they most likely have something helpful to say. Click on them to find out what it is.
	//You will come across coins (yellow-orange circles). Pick them up. They give you 5 coins.

	//A handy key guide:

	//basic
	//b to go back (it doesn't work with the first menus)
	//i to open your inventory (WIP)
	//p to see your level and xp and to change your character's outfit (not done yet)
	//m to open your map (no map yet)
	//s to save (no save yet)
	//q to open your quests

	//food
	//w to drink water
	//t to eat trail mix
	//a to eat an apple

	//spells
	//Fire spells:
	//h to cast Spark
	//j to cast Flame
	//k to cast Burn
	//l to cast Fire

	//Water spells:
	//h to cast Droplet
	//j to cast Stream
	//k to cast River
	//l to cast Ocean

	//Earth spells:
	//h to cast Pebble
	//j to cast Rock
	//k to cast Boulder
	//l to cast Earthquake

	//Air spells:
	//h to cast Breeze
	//j to cast Gust
	//k to cast Wind
	//l to cast Tornado

	//Light spells:
	//h to cast Shine
	//j to cast Glow
	//k to cast Illumminate
	//l to cast Light

	//Darkness spells:
	//h to cast Shadow
	//j to cast Darknen
	//k to cast Night
	//l to cast Darkness

	//Nature spells:
	//h to cast Seed
	//j to cast Sapling
	//k to cast Protect
	//l to cast Grow

	//so far: Main menu, choosing your element, cursors, academy, Nurse's office, cafeteria shop, making bracelets, training grounds entrance, beach, swimming game, quests, docks, sailing game, battle practice, archery, painting

	//to do: obstacle course, dorms, inventory

	//Code begins
	//in almost any game I make (begins)
	var state = "menu";
	var wPressed = false;
	var aPressed = false;
	var tPressed = false;
	var sPressed = false;
	var hPressed = false;
	var questsUp = false;
	var inventoryUp = false;
	var questPage = 1;
	var keyIsReleased = false;
	var mouseX,mouseY,pmouseX,pmouseY;
	p.keyReleased = function() {
	    if (p.key == 97) {
	        aPressed = true;
	    }
	    if (p.key == 104) {
	        hPressed = true;
	    }
	    if (p.key == 113) {
	        questsUp = !questsUp;
	    }
	    if (p.key == 105) {
	        inventoryUp = !inventoryUp;
	    }
	    if (p.key == 115) {
	        sPressed = true;
	    }
	    if (p.key == 116) {
	        tPressed = true;
	    }
	    if (p.key == 119) {
	        wPressed = true;
	    }
	    keyIsReleased = true;
	    keyIsPressed = false;
	};
	var onAButton = false;
	var timer = 0;
	var rainbowLength = 200;
	var button = function(x, y, w, h, s, color) {
	    var Button = {//defines a new object: Button
	    };
	    Button.pressed = false;
	    Button.x = x;
	    Button.y = y;
	    Button.w = w;
	    Button.h = h;
	    Button.state = s;
	    Button.color = color;
	    Button.drawIt = function() {
	        if (!this.color) {
	            fill(161, 135, 255);
	            stroke(106, 0, 255);
	            strokeWeight(5);
	            rect(this.x, this.y, this.w, this.h, 20);
	            noStroke();
	        } else {
	            fill(this.color);
	            rect(this.x, this.y, this.w, this.h, 10);
	        }
	    };
	    Button.checkIfPressed = function() {
	        if (mouseIsClicked && mouseX > this.x && mouseX < this.x + this.w && mouseY > this.y && mouseY < this.y + this.h && state === this.state && !questsUp && !inventoryUp) {
	            this.pressed = true;
	        } else {
	            this.pressed = false;
	        }
	        if (mouseX > this.x && mouseX < this.x + this.w && mouseY > this.y && mouseY < this.y + this.h && state === this.state && !questsUp && !inventoryUp) {
	            onAButton = true;
	            this.mousedOver = true;
	        } else {
	            this.mousedOver = false;
	        }
	    };
	    return Button;
	};
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
	        if (mouseIsClicked && sq(mouseX-this.x) + sq(mouseY-this.y) <= sq(this.r) && state === this.state && !questsUp && !inventoryUp) {
	            this.pressed = true;
	        } else {
	            this.pressed = false;
	        }
	        if (sq(mouseX-this.x) + sq(mouseY-this.y) <= sq(this.r) && state === this.state && !questsUp && !inventoryUp) {
	            onAButton = true;
	            this.mousedOver = true;
	        } else {
	            this.mousedOver = false;
	        }
	    };
	    return Button;
	};
	var drawCloud = function(x, y) {
	    fill(248, 248, 248);
	    ellipse(x, y + 8, 50, 40);
	    ellipse(x + 18, y - 6, 50, 40);
	    ellipse(x + 34, y + 1, 50, 40);
	    ellipse(x + 50, y + 21, 50, 40);
	    ellipse(x + 5, y+ 20, 50, 40);
	    ellipse(x + 28, y + 22, 50, 40);
	};
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
	    drawCloud(50, 250);
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
	        text("Elements of Magic", 38, 365);
	    }
	    if (timer > 130) {
	        drawCloud(300, 260);
	    }
	    if (timer < 130) {
	        rainbowLength++;
	    }
	    if (timer > 320) {
	        state = "menu";
	    }
	};
	//in almost any game I make (ends)

	var playButton = button(130, 200, 160, 100, "menu");
	var fireButton = button(10, 180, 80, 100, "chooseElement", color(255, 231, 217));
	var earthButton = button(110, 180, 80, 100, "chooseElement", color(255, 232, 201));
	var lightButton = button(210, 180, 80, 100, "chooseElement", color(255, 251, 199));
	var natureButton = button(310, 180, 80, 100, "chooseElement", color(227, 255, 196));
	var waterButton = button(10, 290, 80, 100, "chooseElement", color(219, 240, 255));
	var airButton = button(110, 290, 80, 100, "chooseElement", color(242, 254, 255));
	var darknessButton = button(210, 290, 80, 100, "chooseElement", color(227, 227, 227));
	var elementContinueButton = button(310, 290, 80, 100, "chooseElement", color(216, 194, 255));
	var cafeteriaButton = button(40, 190, 150, 90, "academy");
	var trainingGroundsButton = button(220, 190, 150, 90, "academy");
	var classroomsButton = button(40, 295, 150, 90, "academy");
	var dormsButton = button(220, 295, 150, 90, "academy");
	var playMakeBracletsButton = button(140, 130, 135, 70, "makeBracletsMenu");
	var howToPlayMakeBracletsButton = button(135, 222, 150, 90, "makeBracletsMenu");
	var classroomsBracletsButton = button(105, 332, 210, 50, "makeBracletsMenu");
	var playSwimmingButton = button(40, 100, 120, 120, "swimmingMenu");
	var howToPlaySwimmingButton = button(240, 130, 120, 120, "swimmingMenu");
	var beachButton = button(120, 260, 120, 120, "swimmingMenu");
	var continueSwimming = button(100, 220, 170, 60, "continueSwimming");
	var quitSwimming = button(100, 320, 170, 60, "continueSwimming");
	var level1Button = button(0, 270, 95, 130, "docks");
	var level2Button = button(155, 270, 95, 130, "docks");
	var level3Button = button(310, 270, 95, 130, "docks");
	var archeryMenuButton = button(127, 30, 200, 70, "archeryRange");
	//circle buttons
	var playArcheryButton = buttonCircle(190, 300, 60, "archeryMenu");
	var backArcheryButton = buttonCircle(80, 150, 40, "archeryMenu");
	var helpArcheryButton = buttonCircle(320, 180, 50, "archeryMenu");
	var backArcheryGameOverButton = buttonCircle(70, 330, 40, "archeryGameOver");
	var backArcheryHelpButton = buttonCircle(70, 330, 40, "archeryHelp");
	//painting
	var redButton = buttonCircle(340, 120, 12.5, "painting");
	var lightGreenButton = buttonCircle(340, 160, 12.5, "painting");
	var greenButton = buttonCircle(340, 200, 12.5, "painting");
	var pinkButton = buttonCircle(340, 240, 12.5, "painting");
	var brownButton = buttonCircle(340, 280, 12.5, "painting");
	var blackButton = buttonCircle(340, 320, 12.5, "painting");
	var orangeButton = buttonCircle(377, 120, 12.5, "painting");
	var yellowButton = buttonCircle(377, 160, 12.5, "painting");
	var blueButton = buttonCircle(377, 200, 12.5, "painting");
	var purpleButton = buttonCircle(377, 240, 12.5, "painting");
	var whiteButton = buttonCircle(377, 280, 12.5, "painting");
	var greyButton = buttonCircle(377, 320, 12.5, "painting");
	var fiveButton = buttonCircle(42.5, 110, 2.5, "painting");
	var tenButton = buttonCircle(42.5, 130, 5, "painting");
	var fifteenButton = buttonCircle(42.5, 160, 7.5, "painting");
	var twentyButton = buttonCircle(42.5, 195, 10, "painting");
	var thirtyButton = buttonCircle(42.5, 240, 15, "painting");
	var fortyFiveButton = buttonCircle(42.5, 300, 22.5, "painting");
	var undoButton = button(310, 345, 80, 45, "painting", color(176, 52, 217));
	var backPaintButton = button(10, 345, 80, 45, "painting", color(176, 52, 217));
	//music
	var musicWonBack = buttonCircle(200, 300, 100, "winMusic", color(255, 255, 255), color (0, 0, 0));
	var musicHelpBack = buttonCircle(50, 350, 70, "musicHelp", color(0, 0, 0), color (255, 255, 255));
	var musicGameOverBack = buttonCircle(200, 340, 100, "musicGameOver", color(0, 0, 0), color (255, 255, 255));
	//doors
	var nurseOfficeDoor = button(173,100,75,150,"cafeteria");
	var cafeteriaShopDoor = button(296,100,75,150,"cafeteria");
	var learnMagicDoor = button(20, 100, 72, 150,"classrooms");
	var playMusicDoor = button(110, 100, 72, 150,"classrooms");
	var paintDoor = button(210, 100, 72, 150,"classrooms");
	var makeBracletsDoor = button(305, 100, 72, 150,"classrooms");
	var practiceBattlingDoor = button(105, 140, 50, 120, "battlePractice");
	//spells
	//fire
	var spark = button(260, 55, 130, 60, "learnMagic", color(255, 141, 59));
	var flame = button(260, 120, 130, 60, "learnMagic", color(255, 141, 59));
	var burn = button(260, 185, 130, 60, "learnMagic", color(255, 141, 59));
	var fire = button(260, 250, 130, 60, "learnMagic", color(255, 141, 59));
	//water
	var droplet = button(260, 55, 130, 60, "learnMagic", color(110, 231, 255));
	var stream = button(260, 120, 130, 60, "learnMagic", color(110, 231, 255));
	var river = button(260, 185, 130, 60, "learnMagic", color(110, 231, 255));
	var ocean = button(260, 250, 130, 60, "learnMagic", color(110, 231, 255));
	//earth
	var pebble = button(260, 55, 130, 60, "learnMagic", color(196, 140, 29));
	var stone = button(260, 120, 130, 60, "learnMagic", color(196, 140, 29));
	var boulder = button(260, 185, 130, 60, "learnMagic", color(196, 140, 29));
	var earthquake = button(260, 250, 130, 60, "learnMagic", color(196, 140, 29));
	//air
	var breeze = button(260, 55, 130, 60, "learnMagic", color(225, 240, 242));
	var gust = button(260, 120, 130, 60, "learnMagic", color(225, 240, 242));
	var wind = button(260, 185, 130, 60, "learnMagic", color(225, 240, 242));
	var tornado = button(260, 250, 130, 60, "learnMagic", color(225, 240, 242));
	//light
	var shine = button(260, 55, 130, 60, "learnMagic", color(255, 232, 82));
	var glow = button(260, 120, 130, 60, "learnMagic", color(255, 232, 82));
	var illuminate = button(260, 185, 130, 60, "learnMagic", color(255, 232, 82));
	var light = button(260, 250, 130, 60, "learnMagic", color(255, 232, 82));
	//darkness
	var shadow = button(260, 55, 130, 60, "learnMagic", color(116, 111, 133));
	var darken = button(260, 120, 130, 60, "learnMagic", color(116, 111, 133));
	var night = button(260, 185, 130, 60, "learnMagic", color(116, 111, 133));
	var darkness = button(260, 250, 130, 60, "learnMagic", color(116, 111, 133));
	//nature
	var seed = button(260, 55, 130, 60, "learnMagic", color(83, 224, 83));
	var sapling = button(260, 120, 130, 60, "learnMagic", color(103, 224, 103));
	var protect = button(260, 185, 130, 60, "learnMagic", color(103, 224, 103));
	var grow = button(260, 250, 130, 60, "learnMagic", color(103, 224, 103));

	var newCharacter = function(x, y) {
	    var character = {};
	    character.x = x;
	    character.y = y;
	    character.xStep = 1;
	    character.yStep = 1;
	    character.limitTop = 250;
	    character.limitBottom = 370;
	    character.limitRight = 370;
	    character.limitLeft = 50;
	    character.alive = true;
	    character.element = "none";
	    character.health = 500;
	    character.nourishment = 500;
	    character.strength = 100;
	    character.archerySkill = 0;
	    character.luteSkill = 0;
	    character.fencingSkill = 0;
	    character.swimmingSkill = 0;
	    character.paintingSkill = 0;
	    character.braceletSkill = 0;
	    character.sailingSkill = 0;
	    character.xp = 0;
	    character.level = 1;
	    character.knowLevel1Spell = false;
	    character.drawIt = function() {
	        //body
	        if (character.element === "fire") {
	            fill(255, 162, 41);
	            this.color = color(255, 162, 41);
	            this.accentColor = color(255, 72, 0);
	        } else if (character.element === "water") {
	            fill(117, 191, 255);
	            this.color = color(117, 191, 255);
	            this.accentColor = color(0, 122, 204);
	        } else if (character.element === "light") {
	            fill(255, 244, 120);
	            this.color = color(255, 244, 120);
	            this.accentColor = color(255, 183, 0);
	        } else if (character.element === "darkness") {
	            fill(113, 105, 199);
	            this.color = color(113, 105, 199);
	            this.accentColor = color(0, 0, 0);
	        } else if (character.element === "earth") {
	            fill(201, 129, 74);
	            this.color = color(201, 129, 74);
	            this.accentColor = color(107, 68, 0);
	        } else if (character.element === "air") {
	            fill(242, 253, 255);
	            this.color = color(242, 253, 255);
	            this.accentColor = color(0, 234, 255);
	        } else if (character.element === "nature") {
	            fill(174, 255, 99);
	            this.color = color(174, 255, 99);
	            this.accentColor = color(17, 204, 0);
	        }
	        rect(this.x - 13, this.y - 15, 26, 30);
	        //hair
	        if (hairColor === "light brown") {
	            fill(191, 128, 55);
	        } else if (hairColor === "dark brown") {
	            fill(120, 52, 0);
	        } else if (hairColor === "red") {
	            fill(217, 107, 60);
	        } else if (hairColor === "blonde") {
	            fill(235, 215, 148);
	        } else if (hairColor === "black") {
	            fill(0, 0, 0);
	        }
	        rect(this.x - 13, this.y - 41, 26, 26);
	        //face
	        if (skinColor === "light") {
	            fill(237, 205, 154);
	        }
	        if (skinColor === "dark") {
	            fill(133, 82, 28);
	        }
	        if (gender === "girl") {
	            rect(this.x - 9, this.y - 32, 17, 17);
	        } else if (gender === "boy") {
	            rect(this.x - 13, this.y - 32, 26, 17);
	        }
	        //eyes
	        fill(0, 0, 0);
	        ellipse(this.x - 4, this.y - 27, 4, 4);
	        ellipse(this.x + 4, this.y - 27, 4, 4);
	        //smile
	        noFill();
	        stroke(0);
	        strokeWeight(2);
	        arc(this.x, this.y - 25, 15, 15, 40, 139);
	        noStroke();
	        //belt
	        fill(196, 161, 63);
	        rect(this.x - 13, this.y - 5, 26, 8);
	        //jewel
	        if (character.element === "fire") {
	            fill(255, 89, 0);
	        } else if (character.element === "water") {
	            fill(0, 110, 212);
	        } else if (character.element === "light") {
	            fill(255, 207, 64);
	        } else if (character.element === "darkness") {
	            fill(27, 0, 61);
	        } else if (character.element === "earth") {
	            fill(156, 68, 0);
	        } else if (character.element === "air") {
	            fill(214, 249, 255);
	        } else if (character.element === "nature") {
	            fill(102, 212, 0);
	        }
	        ellipse(this.x, this.y, 13, 13);
	    };
	    character.moveIt = function() {
	        if (keyIsPressed && keyCode === RIGHT && this.x < this.limitRight) {
	            this.x += this.xStep;
	        }
	        if (keyIsPressed && keyCode === LEFT && this.x > this.limitLeft) {
	            this.x -= this.xStep;
	        }
	        if (keyIsPressed && keyCode === UP && this.y > this.limitTop) {
	            this.y -= this.yStep;
	        }
	        if (keyIsPressed && keyCode === DOWN && this.y < this.limitBottom) {
	            this.y += this.yStep;
	        }
	    };
	    return character;
	};

	var character = newCharacter(200, 300);

	var xp = [0, 75, 125, 250, 500, 1000, 2000];
	var coins = 0;
	var hoveringCoins = [];
	var doneIntro = false;
	var fancy = createFont("Lucida Calligraphy", 40);
	var cursive = createFont("cursive", 40);
	var elementContinueCount = 0;
	var noElement = false;
	var back;
	var beenToAcademy = false;
	var beenToCafeteria = false;
	var beenToNurseOffice = false;
	var beenToCafeteriaShop = false;
	var beenToTrainingGrounds = false;
	var beenToBattlePractice = false;
	var beenToClassrooms = false;
	var beenToLearnMagic = false;
	var beenToDorms = false;
	var beenToHome = false;
	var beenToOoloos = false;
	var popUpY = [];
	var popUpTypes = [];
	var buritoDay = false;
	var pizzaDay = false;
	var myDay = 1;
	var eatingTimer = 0;
	//food
	var waterCanteens = [];
	var apples = [];
	var trailMixes = [];
	var eating = false;
	//quests
	var quests = [];
	//inventory
	var inventoryTab = "food";//can be food, furniture, clothing, spells
	//bracelet game
	var braceletGameTimer = 140;
	var beadsCaught = 0;
	var beads = [];
	var braceletCollectedCoins = 0;
	var bracelet = [];
	var currentBead;
	var madeBraceletWithoutPinkOrPurple = true;
	//swimming
	var air = 300;
	var swimmingPlayerY = 100;
	var swimmingPlayerX = 120;
	var swimmingPlayerSpeed = 2;
	var swimmingScore = 0;
	var swimmingTimer = 0;
	var swimmingLevel = 1;
	var sandXs = [];
	for (var i = 0; i < 15; i++) {
	    sandXs.push((i * 60) + 12);
	}
	//beach
	var oceanY = 350;
	var oceanYStep = 1;
	//sailing
	var sailingX = 174;
	var sailingTimer = 0;
	var sailingHealth = 380;
	var sailingScore = 0;
	//practice battling
	var cloud1X = 200;
	var cloud2X = 120;
	var battlingLevel = 1;
	var battlingScore = 0;
	//archery
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
	//painting
	var selectedColor = color(0, 0, 0);
	var selectedSize = 15;
	var paintingXs = [];
	var paintingYs = [];
	var paintingX2s = [];
	var paintingY2s = [];
	var paintingSs = [];
	var paintingCs = [];
	var paintingLetGoPoints = [];
	var paintingTimer = 0;
	//music game
	var playingMusic = false;
	var musicLevels = [[RIGHT], [LEFT, RIGHT, LEFT], [LEFT, RIGHT, UP, UP, RIGHT, LEFT], [RIGHT, UP, DOWN, RIGHT, RIGHT], [DOWN, UP, RIGHT, LEFT, DOWN, UP, RIGHT, RIGHT], [DOWN, RIGHT, UP, DOWN, RIGHT, DOWN, UP, UP, RIGHT]];
	var musicLevel = 0;
	var n = 0;
	var musicTimer = 0;
	var startTime = 0;
	var currentDirection = 0;
	var wrong = 0;
	var musicCoinsGiven = [15, 40, 70, 100, 150, 225, 500];
	var musicCoins = 0;

	//Paste code here:

	var newNPC = function(x, y, type, message, messageHeight, messageY) {
	    var npc = {};
	    npc.x = x;
	    npc.y = y;
	    npc.messageHeight = messageHeight;
	    npc.type = type;
	    npc.message = message;
	    npc.drawIt = function() {
	        if (this.type === "doctor") {
	            fill(255, 255, 255);
	            rect(this.x - 13, this.y - 15, 26, 30);
	            fill(84, 39, 0);
	            rect(this.x - 13, this.y - 41, 26, 26);
	            fill(237, 205, 154);
	            rect(this.x - 9, this.y - 32, 17, 17);
	            //eyes
	            fill(0, 0, 0);
	            ellipse(this.x - 4, this.y - 27, 4, 4);
	            ellipse(this.x + 4, this.y - 27, 4, 4);
	            //smile
	            noFill();
	            stroke(0);
	            strokeWeight(2);
	            arc(this.x, this.y - 25, 15, 15, 40, 139);
	            //stethascope
	            arc(this.x, this.y - 10, 20, 23, -8, 196);
	            line(this.x + 2, this.y + 4, this.x + 5, this.y + 10);
	            strokeWeight(5);
	            point(this.x + 5 , this.y + 10);
	            noStroke();
	        }
	        if (this.type === "storekeeper") {
	            fill(189, 144, 32);
	            rect(this.x - 13, this.y - 15, 26, 30);
	            fill(156, 70, 0);
	            rect(this.x - 13, this.y - 41, 26, 26);
	            fill(237, 205, 154);
	            rect(this.x - 13, this.y - 32, 26, 17);
	            //eyes
	            fill(0, 0, 0);
	            ellipse(this.x - 4, this.y - 27, 4, 4);
	            ellipse(this.x + 4, this.y - 27, 4, 4);
	            //smile
	            noFill();
	            stroke(0);
	            strokeWeight(2);
	            arc(this.x, this.y - 25, 15, 15, 40, 139);
	            noStroke();
	        }
	        if (this.type === "mentor") {
	            //body
	            if (character.element === "fire") {
	                fill(255, 162, 41);
	                this.color = color(255, 144, 54);
	                this.accentColor = color(255, 72, 0);
	            } else if (character.element === "water") {
	                fill(117, 191, 255);
	                this.color = color(156, 237, 255);
	                this.accentColor = color(0, 122, 204);
	            } else if (character.element === "light") {
	                fill(255, 244, 120);
	                this.color = color(255, 246, 150);
	                this.accentColor = color(255, 183, 0);
	            } else if (character.element === "darkness") {
	                fill(80, 5, 255);
	                this.color = color(113, 105, 199);
	                this.accentColor = color(0, 0, 0);
	            } else if (character.element === "earth") {
	                fill(201, 129, 74);
	                this.color = color(184, 129, 70);
	                this.accentColor = color(107, 68, 0);
	            } else if (character.element === "air") {
	                fill(242, 253, 255);
	                this.color = color(201, 253, 255);
	                this.accentColor = color(0, 234, 255);
	            } else if (character.element === "nature") {
	                fill(174, 255, 99);
	                this.color = color(89, 232, 0);
	                this.accentColor = color(15, 184, 0);
	            }
	            rect(this.x - 13, this.y - 15, 26, 30);
	            //hair
	            fill(84, 45, 0);
	            rect(this.x - 13, this.y - 41, 26, 26);
	            fill(250, 233, 208);
	            if (gender === "girl") {
	                rect(this.x - 9, this.y - 32, 17, 17);
	            } else if (gender === "boy") {
	                rect(this.x - 13, this.y - 32, 26, 17);
	            }
	            //eyes
	            fill(0, 0, 0);
	            ellipse(this.x - 4, this.y - 27, 4, 4);
	            ellipse(this.x + 4, this.y - 27, 4, 4);
	            //smile
	            noFill();
	            stroke(0);
	            strokeWeight(2);
	            arc(this.x, this.y - 25, 15, 15, 40, 139);
	            noStroke();
	            //belt
	            fill(196, 161, 63);
	            rect(this.x - 13, this.y - 5, 26, 8);
	            //jewel
	            if (character.element === "fire") {
	                fill(255, 89, 0);
	            } else if (character.element === "water") {
	                fill(0, 110, 212);
	            } else if (character.element === "light") {
	                fill(255, 207, 64);
	            } else if (character.element === "darkness") {
	                fill(27, 0, 61);
	            } else if (character.element === "earth") {
	                fill(156, 68, 0);
	            } else if (character.element === "air") {
	                fill(214, 249, 255);
	            } else if (character.element === "nature") {
	                fill(102, 212, 0);
	            }
	            ellipse(this.x, this.y, 13, 13);
	        }
	        if (this.type === "swimsuit") {
	            fill(186, 122, 26);
	            rect(this.x - 13, this.y - 15, 26, 30);
	            fill(255, 0, 204);
	            rect(this.x - 13, this.y - 15, 2, 4);
	            rect(this.x + 9, this.y - 15, 2, 4);
	            rect(this.x - 13, this.y - 11, 26, 11);
	            triangle(this.x - 13, this.y, this.x + 13, this.y, this.x, this.y + 6);
	            fill(0, 0, 0);
	            rect(this.x - 13, this.y - 41, 26, 26);
	            fill(186, 122, 26);
	            rect(this.x - 9, this.y - 32, 17, 17);
	            //eyes
	            fill(0, 0, 0);
	            ellipse(this.x - 4, this.y - 27, 4, 4);
	            ellipse(this.x + 4, this.y - 27, 4, 4);
	            //smile
	            noFill();
	            stroke(0);
	            strokeWeight(2);
	            arc(this.x, this.y - 25, 15, 15, 40, 139);
	            noStroke();
	        }
	        if (this.type === "sailor") {
	            fill(255, 255, 255);
	            rect(this.x - 13, this.y - 15, 26, 30);
	            fill(0, 71, 112);
	            rect(this.x - 13, this.y, 26, 15);
	            stroke(0, 68, 105);
	            strokeWeight(1);
	            line(this.x - 13, this.y - 14, this.x + 13, this.y - 14);
	            line(this.x - 13, this.y - 11, this.x + 13, this.y - 11);
	            line(this.x - 13, this.y - 8, this.x + 13, this.y - 8);
	            line(this.x - 13, this.y - 5, this.x + 13, this.y - 5);
	            line(this.x - 13, this.y - 2, this.x + 13, this.y - 2);
	            noStroke();
	            fill(199, 199, 199);
	            rect(this.x - 13, this.y - 41, 26, 26);
	            fill(237, 205, 154);
	            rect(this.x - 13, this.y - 32, 26, 17);
	            //eyes
	            fill(0, 0, 0);
	            ellipse(this.x - 4, this.y - 27, 4, 4);
	            ellipse(this.x + 4, this.y - 27, 4, 4);
	            //smile
	            noFill();
	            stroke(0);
	            strokeWeight(2);
	            arc(this.x, this.y - 25, 15, 15, 40, 139);
	            noStroke();
	        }
	        if (this.type === "archer") {
	            fill(186, 119, 48);
	            rect(this.x - 13, this.y - 15, 26, 30);
	            fill(122, 61, 0);
	            rect(this.x - 13, this.y - 5, 26, 10);
	            fill(73, 201, 50);
	            ellipse(this.x, this.y, 9, 7);
	            fill(255, 94, 0);
	            rect(this.x - 13, this.y - 41, 26, 26);
	            fill(250, 227, 192);
	            rect(this.x - 9, this.y - 32, 17, 17);
	            //eyes
	            fill(0, 0, 0);
	            ellipse(this.x - 4, this.y - 27, 4, 4);
	            ellipse(this.x + 4, this.y - 27, 4, 4);
	            //smile
	            noFill();
	            stroke(0);
	            strokeWeight(2);
	            arc(this.x, this.y - 25, 15, 15, 40, 139);
	            noStroke();
	        }
	    };
	    npc.checkIfSelected = function() {
	        if (mouseX > (this.x - 13) && mouseX < (this.x + 13) && mouseY > (this.y - 55) && mouseY < (this.y + 5)) {
	            this.mousedOver = true;
	            if (mouseIsPressed) {
	                this.selected = true;
	                this.timeSinceSelected = 0;
	            } else {
	                this.timeSinceSelected++;
	            }
	        } else {
	            this.mousedOver = false;
	            this.timeSinceSelected++;
	        }
	        if (this.timeSinceSelected > 300) {
	            this.selected = false;
	            this.timeSinceSelected = 0;
	        }
	    };
	    npc.talk = function() {
	        if (this.selected) {
	            if (messageY) {
	                fill(255, 255, 255);
	                rect(this.x - 40, this.y - messageY, 90, messageHeight);
	                fill(0, 0, 0);
	                textSize(10);
	                text(this.message, this.x - 40, this.y - messageY + 2, 90, this.messageHeight);
	            } else {
	                fill(255, 255, 255);
	                rect(this.x - 40, this.y - 155, 90, messageHeight);
	                fill(0, 0, 0);
	                textSize(10);
	                text(this.message, this.x - 40, this.y - 155, 90, this.messageHeight);
	            }
	        }
	    };
	    return npc;
	};

	var nurse = newNPC(320, 300, "doctor", "You regain health in my office. If you die, you will be sent back here.", 50, 100);
	var cafeteriaStoreGuy = newNPC(100, 170, "storekeeper", "Mouse over an item to learn about it, and click to buy it.", 50, 110);
	var mentor = newNPC(100, 270, "mentor", "I am your mentor. I will teach you a new spell every other time you gain a level. When you are level 15, I will give you your staff.", 95);
	var trainingGroundsGuy = newNPC(120, 270, "storekeeper", "Welcome to the Training Grounds! Use the sign posts to navigate. Return here and follow the path to the academy to leave.", 95);
	var swimmer = newNPC(250, 200, "swimsuit", "Walk into the water to swim.", 30, 90);
	var sailor = newNPC(255, 150, "sailor", "Find a sturdy craft and set sail!", 35, 90);
	var archer = newNPC(300, 250, "archer", "Start practicing and soon your aim will be perfect!", 35, 94);

	var drawWaterCanteen = function(x, y, s) {
	    fill(110, 148, 117);
	    ellipse(x * s, y * s, 40 * s, 40 * s);
	    pushMatrix();
	    rotate(30);
	    fill(194, 122, 15);
	    rect((x + 40) * s, (y - 184) * s, 40 * s, 10 * s);
	    popMatrix();
	    pushMatrix();
	    rotate(-30);
	    rect((x-125) * s, (y + 119) * s, 10 * s, 14 * s);
	    popMatrix();
	};

	var drawApple = function(x, y, s) {
	    fill(222, 0, 0);
	    ellipse(x * s, y * s, 30 * s, 30 * s);
	    noFill();
	    stroke(102, 20, 0);
	    strokeWeight(4);
	    arc((x - 5) * s, (y - 19) * s, 20 * s, 35 * s, 20, 50);
	    noStroke();
	};

	var drawTrailMix = function(x, y, s) {
	    fill(191, 146, 23);
	    quad((x - 10) * s, y * s, x * s, (y - 40) * s, (x + 18) * s, (y - 33) * s, (x + 21) * s, (y + 8) * s);
	    fill(212, 171, 66);
	    quad(x * s, (y - 40) * s, (x + 4) * s, (y - 44) * s, (x + 22) * s, (y - 37) * s, (x + 18) * s, (y - 33) * s);
	    fill(163, 117, 0);
	    quad((x + 21) * s, (y + 8) * s, (x + 18) * s, (y - 33) * s, (x + 22) * s, (y - 37) * s, (x + 28) * s, (y - 4) * s);
	};

	var newWaterCanteen = function() {
	    var waterCanteen = {};
	    waterCanteen.drank = false;
	    waterCanteen.checkIfDrank = function() {
	        if (wPressed && !this.drank && !eating) {
	            this.drank = true;
	            character.nourishment += 50;
	            popUpY.push(400);
	            popUpTypes.push("+50nourishment");
	            eating = true;
	        }
	    };
	    return waterCanteen;
	};

	var newApple = function() {
	    var apple = {};
	    apple.drank = false;
	    apple.checkIfEaten = function() {
	        if (aPressed && !this.eaten && !eating) {
	            this.eaten = true;
	            character.nourishment += 30;
	            character.strength += 10;
	            popUpY.push(400);
	            popUpTypes.push("+30nourishment");
	            popUpY.push(500);
	            popUpTypes.push("+10strength");
	            eating = true;
	        }
	    };
	    return apple;
	};

	var newTrailMix = function() {
	    var trailMix = {};
	    trailMix.drank = false;
	    trailMix.checkIfEaten = function() {
	        if (tPressed && !this.eaten && !eating) {
	            this.eaten = true;
	            character.nourishment += 15;
	            character.strength += 20;
	            popUpY.push(400);
	            popUpTypes.push("+15nourishment");
	            popUpY.push(500);
	            popUpTypes.push("+20strength");
	            eating = true;
	        }
	    };
	    return trailMix;
	};

	var newBead = function(x, y, s) {
	    var bead = {};
	    bead.x = x;
	    bead.y = y;
	    bead.s = s;
	    bead.type = random(0, 4);
	    if (bead.type < 0.4) {
	        bead.type = "green";
	    } else if (bead.type < 0.9) {
	        bead.type = "pink";
	    } else if (bead.type < 1.2) {
	        bead.type = "purple";
	    } else {
	        bead.type = "blue";
	    }
	    bead.drawIt = function() {
	        if (this.type === "green") {
	            fill(126, 255, 66);
	        } else if (this.type === "pink") {
	            fill(255, 127, 204);
	        } else if (this.type === "purple") {
	            fill(210, 97, 255);
	        } else if (this.type === "blue") {
	            fill(0, 208, 255);
	        }
	        rect(this.x * this.s, this.y * this.s, 15 * this.s, 20 * this.s, 22);
	    };
	    bead.moveIt = function() {
	        this.y ++;
	        if (this.y > 370 && this.x > mouseX - 15 && this.x < mouseX + 15 && !this.added) {
	            this.threaded = true;
	            beadsCaught ++;
	            if (this.type === "green") {
	                braceletGameTimer += 20;
	            }
	            if (this.type === "pink") {
	                coins += 10;
	                braceletCollectedCoins += 10;
	                madeBraceletWithoutPinkOrPurple = false;
	            }
	            if (this.type === "purple") {
	                coins += 20;
	                braceletCollectedCoins += 20;
	                madeBraceletWithoutPinkOrPurple = false;
	            }
	        }
	    };
	    return bead;
	};

	var bead1 = newBead(53, 90, 1);
	var bead3 = newBead(53, 120, 1);
	var bead5 = newBead(53, 150, 1);
	var bead7 = newBead(53, 180, 1);
	var bead9 = newBead(53, 210, 1);
	var bead11 = newBead(53, 240, 1);
	var bead13 = newBead(53, 270, 1);
	var bead15 = newBead(53, 300, 1);
	var bead17 = newBead(53, 330, 1);
	var bead2 = newBead(333, 90, 1);
	var bead4 = newBead(333, 120, 1);
	var bead6 = newBead(333, 150, 1);
	var bead8 = newBead(333, 180, 1);
	var bead10 = newBead(333, 210, 1);
	var bead12 = newBead(333, 240, 1);
	var bead14 = newBead(333, 270, 1);
	var bead16 = newBead(333, 300, 1);
	var bead18 = newBead(333, 330, 1);

	var newBubble = function(x, y) {
	    var bubble = {};
	    bubble.x = x;
	    bubble.y = y;
	    bubble.drawIt = function() {
	        if (!this.popped) {
	            fill(255, 255, 255, 150);
	            stroke(255, 255, 255, 220);
	            strokeWeight(4);
	            ellipse(this.x, this.y, 20, 20);
	        }
	        noStroke();
	    };
	    bubble.update = function() {
	        this.x --;
	        if (!this.popped && swimmingPlayerX + 56 > this.x - 10 && swimmingPlayerX < this.x + 10 || swimmingPlayerX > this.x - 10 && swimmingPlayerX < this.x + 10) {
	            if (swimmingPlayerY + 26 > this.y - 10 && swimmingPlayerY + 26 < this.y + 10 || swimmingPlayerY > this.y - 10 && swimmingPlayerY < this.y + 10) {
	                air += 35;
	                this.popped = true;
	                if (sound) {
	                    //playSound(getSound("rpg/water-bubble"));
	                }
	            }
	        }
	    };
	    return bubble;
	};

	var bubbles = [];

	var newShell = function(x, y, type) {
	    var shell = {};
	    shell.x = x;
	    shell.y = y;
	    shell.type = type;
	    shell.gotton = false;
	    shell.drawIt = function() {
	        if (!this.gotton) {
	            if (this.type === 1) {
	                fill(245, 212, 201);
	            } else if (this.type === 2) {
	                fill(0, 251, 255);
	            }
	            ellipse(this.x, this.y, 16, 16);
	            triangle(this.x, this.y, this.x + 8, this.y + 13, this.x - 8, this.y + 13);
	        }
	    };
	    shell.update = function() {
	        this.x --;
	        if (!this.gotton && swimmingPlayerX + 56 > this.x - 10 && swimmingPlayerX < this.x + 10 || swimmingPlayerX > this.x - 10 && swimmingPlayerX < this.x + 10) {
	            if (swimmingPlayerY + 26 > this.y - 10 && swimmingPlayerY + 26 < this.y + 10 || swimmingPlayerY > this.y - 10 && swimmingPlayerY < this.y + 10) {
	                swimmingScore += 30;
	                if (this.type === 2) {
	                    swimmingPlayerSpeed ++;
	                }
	                this.gotton = true;
	            }
	        }
	    };
	    return shell;
	};

	var shells = [];

	var newRock = function(x, y) {
	    var rock = {};
	    rock.x = x;
	    rock.y = y;
	    rock.bumpedInto = false;
	    rock.drawIt = function() {
	        fill(148, 87, 37);
	        quad(this.x, this.y, this.x + 35, this.y, this.x + 45, this.y + 45, this.x - 10, this.y + 45);
	    };
	    rock.update = function() {
	        this.y += 1;
	    };
	    rock.checkIfBumpedInto = function() {
	        if (this.y > 278 && this.y < 380 && !this.bumpedInto) {
	            if (this.x + 45 > sailingX - 34 && this.x + 45 < sailingX + 86 + 55) {
	                this.bumpedInto = true;
	                sailingHealth -= 80;
	            }
	        }
	    };
	    return rock;
	};

	var rocks = [];

	var newSailingCoin = function(x, y) {
	    var coin = {};
	    coin.x = x;
	    coin.y = y;
	    coin.bumpedInto = false;
	    coin.drawIt = function() {
	        if (!this.bumpedInto) {
	            fill(255, 186, 48);
	            stroke(255, 170, 0);
	            strokeWeight(7);
	            ellipse(this.x + 20, this.y + 20, 40, 40);
	            noStroke();
	        }
	    };
	    coin.update = function() {
	        this.y += 1;
	    };
	    coin.checkIfBumpedInto = function() {
	        if (this.y > 278 && this.y < 380 && !this.bumpedInto) {
	            if (this.x + 45 > sailingX - 34 && this.x + 45 < sailingX + 86 + 55) {
	                this.bumpedInto = true;
	                sailingScore += 25;
	                if (state === "sailingLevel2") {
	                    sailingScore += 10;
	                }
	                if (state === "sailingLevel3") {
	                    sailingScore += 20;
	                }
	            }
	        }
	    };
	    return coin;
	};

	var sailingCoins = [];

	var newCoin = function(x, y, state) {
	    var coin = {};
	    coin.x = x;
	    coin.y = y;
	    coin.state = state;
	    coin.gotton = false;
	    coin.timer = 0;
	    coin.drawIt = function() {
	        if (!this.gotton) {
	            fill(255, 186, 48);
	            stroke(255, 170, 0);
	            strokeWeight(5);
	            ellipse(this.x, this.y, 22, 22);
	            noStroke();
	        }
	    };
	    coin.update = function() {
	        this.timer++;
	    };
	    coin.checkIfGotton = function() {
	        if (!this.gotton && character.x > this.x - 11 && character.x < this.x + 11 && character.y > this.y - 21 && character.y < this.y + 26) {
	            this.gotton = true;
	            coins += 5;
	            if (sound) {
	                //playSound(getSound("rpg/coin-jingle"));
	            }
	        }
	    };
	    return coin;
	};

	//music game
	var drawRIGHT = function(x, y, s) {
	    fill(247, 108, 171);
	    rect(x, y, 50*s, 30*s);
	    triangle(x+50*s, y-20*s, x+50*s, y+50*s, x+90*s, y+15*s);
	};

	var drawLEFT = function(x, y, s) {
	    fill(161, 255, 189);
	    rect(x, y, 50*s, 30*s);
	    triangle(x, y-20*s, x, y+50*s, x-40*s, y+15*s);
	};

	var drawDOWN = function(x, y, s) {
	    fill(255, 252, 178);
	    rect(x, y, 30*s, 50*s);
	    triangle(x-20*s, y+50*s, x+50*s, y+50*s, x+15*s, y+90*s); 
	};

	var drawUP = function(x, y, s) {
	    fill(240, 191, 255);
	    rect(x, y, 30*s, 50*s);
	    triangle(x-20*s, y, x+50*s, y, x+15*s, y-40*s); 
	};

	var drawHeart = function(x, y, s) {
	    fill(255, 61, 158);
	    noStroke();
	    triangle(x, y, x + 20, y - 30, x - 20, y - 30);
	    ellipse(x+9, y-32, 22, 20);
	    ellipse(x-9, y-32, 22, 20);
	};

	var newArrow = function(x, y, s, r, type) {
	    var arrow = {};
	    arrow.x = x;
	    arrow.y = y;
	    //debug(arrow.y);
	    arrow.type = type;
	    arrow.r = r;
	    arrow.s = s;
	    arrow.drawIt = function() {
	        if (this.type === 1) {
	            drawRIGHT(this.x, this.y, this.s);
	        }
	        if (this.type === 2) {
	            drawLEFT(this.x, this.y, this.s);
	        }
	        if (this.type === 3) {
	            drawDOWN(this.x, this.y, this.s);
	        }
	        if (this.type === 4) {
	            drawUP(this.x, this.y, this.s);
	        }
	    };
	    arrow.moveIt = function() {
	        this.y += this.r;
	    };
	    return arrow;
	};

	var musicArrows = [];

	//archery

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
	            coins += floor(archeryScore/2);
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

	var spellDiameter = 20;
	var castingSpark = false;
	var castingPebble = false;
	var castingDroplet = false;
	var castingBreeze = false;
	var castingShadow = false;
	var castingSeed = false;
	var castingShine = false;

	var practiceDummy = function(x, y, type, walkingArea) {
	    var dummy = {};
	    dummy.x = x;
	    dummy.originalX = x;
	    dummy.y = y;
	    dummy.originalY = y;
	    dummy.type = type;
	    if (dummy.type === 1) {
	        dummy.speed = random(0.25, 0.75);
	        dummy.health = 100;
	        dummy.startingHealth = 100;
	    } else if (dummy.type === 2) {
	        dummy.speed = random(0.5, 1);
	        dummy.health = 200;
	        dummy.startingHealth = 200;
	    } else if (dummy.type === 3) {
	        dummy.speed = random(0.75, 1.25);
	        dummy.health = 300;
	        dummy.startingHealth = 300;
	    } else if (dummy.type === 4) {
	        dummy.speed = random(1, 1.5);
	        dummy.health = 500;
	        dummy.startingHealth = 500;
	    }
	    dummy.walkingArea = walkingArea;
	    dummy.beaten = false;
	    dummy.takingDamage = false;
	    dummy.damageTimer = 0;
	    dummy.moving = true;
	    dummy.yStep = 1;
	    dummy.drawIt = function() {
	        if (!this.beaten && this.type < 5) {
	            fill(189, 144, 32);
	            if (this.takingDamage) {
	                fill(255, 0, 0);
	            }
	            rect(this.x - 13, this.y - 41, 26, 46);
	            //eyes
	            fill(0, 0, 0);
	            ellipse(this.x - 4, this.y - 30, 4, 4);
	            ellipse(this.x + 4, this.y - 30, 4, 4);
	            fill(55, 255, 0);
	            rect(this.x - 13, this.y - 58, (this.health/this.startingHealth) * 26, 7);
	        }
	    };
	    dummy.moveIt = function() {
	        if (this.moving && !this.beaten) {
	            if (character.element === "air") {
	                this.x -= this.speed/2;
	            }
	            this.x += this.speed;
	            if (this.x > this.walkingArea + this.originalX || this.x < this.originalX) {
	                this.speed = -this.speed;
	            }
	        } else if (!this.beaten) {
	            this.health -= 0.4;
	            this.y += this.yStep;
	            if (this.y > this.originalY + 6 || this.y < this.originalY - 6) {
	                this.yStep = -this.yStep;
	            }
	            if (character.element === "fire") {
	                this.health -= 0.6;
	            }
	        }
	    };
	    dummy.battle = function() {
	        if (castingSpark || castingPebble || castingDroplet || castingBreeze || castingShine || castingShadow || castingSeed) {
	            if (character.x + spellDiameter/2 > this.x - 13 && character.x + spellDiameter/2 < this.x - 13 + spellDiameter) {
	                this.takingDamage = true;
	                this.damageTimer = 0;
	                this.moving = false;
	            }    
	        }
	        if (this.takingDamage) {
	            //debug("...");
	            this.damageTimer++;
	        }
	        if (this.damageTimer > 100) {
	            this.takingDamage = false;
	            this.moving = true;
	            //this.yStep = 0;
	        }
	        if (this.health <= 0) {
	            this.beaten = true;
	            coins += 25;
	        }
	    };
	    return dummy;
	};

	var currentDummy = practiceDummy(200, 300, 1, 100);

	var drawSpark = function() {
	    noFill();
	    strokeWeight(18);
	    stroke(255, 60, 0, 200);
	    ellipse(character.x, character.y - 10, spellDiameter, spellDiameter);
	    noStroke();
	    spellDiameter += 0.5;
	    if (spellDiameter > 120) {
	        castingSpark = false;
	    }
	};

	var drawPebble = function() {
	    noFill();
	    strokeWeight(18);
	    stroke(166, 101, 51, 200);
	    ellipse(character.x, character.y - 10, spellDiameter, spellDiameter);
	    noStroke();
	    spellDiameter += 0.5;
	    if (spellDiameter > 120) {
	        castingPebble = false;
	    }
	};

	var drawDroplet = function() {
	    noFill();
	    strokeWeight(18);
	    stroke(0, 168, 252, 200);
	    ellipse(character.x, character.y - 10, spellDiameter, spellDiameter);
	    noStroke();
	    spellDiameter += 0.5;
	    if (spellDiameter > 120) {
	        castingDroplet = false;
	    }
	};

	var drawBreeze = function() {
	    noFill();
	    strokeWeight(18);
	    stroke(145, 246, 255, 200);
	    ellipse(character.x, character.y - 10, spellDiameter, spellDiameter);
	    spellDiameter += 0.5;
	    noStroke();
	    if (spellDiameter > 120) {
	        castingBreeze = false;
	    }
	};

	var drawShine = function() {
	    noFill();
	    strokeWeight(18);
	    stroke(249, 255, 171, 200);
	    ellipse(character.x, character.y - 10, spellDiameter, spellDiameter);
	    noStroke();
	    spellDiameter += 0.5;
	    if (spellDiameter > 120) {
	        castingShine = false;
	    }
	};

	var drawShadow = function() {
	    noFill();
	    strokeWeight(18);
	    stroke(0, 0, 0);
	    ellipse(character.x, character.y - 10, spellDiameter, spellDiameter);
	    noStroke();
	    spellDiameter += 0.5;
	    if (spellDiameter > 120) {
	        castingShadow = false;
	    }
	};

	var drawSeed = function() {
	    noFill();
	    strokeWeight(18);
	    stroke(183, 255, 0, 200);
	    ellipse(character.x, character.y - 10, spellDiameter, spellDiameter);
	    noStroke();
	    spellDiameter += 0.5;
	    if (spellDiameter > 120) {
	        castingSeed = false;
	    }
	};

	var drawFire = function(x, y, s) {
	    fill(255, 81, 0);
	    arc(x * s, y * s, 100 * s, 100 * s, 0, 180);
	    arc(x * s, (y + 2) * s, 100 * s, 50 * s, 180, 356);
	    triangle((x - 49) * s, y * s, (x - 16) * s, y * s, (x - 45) * s, (y - 7) * s);
	    triangle((x - 36) * s, (y - 26) * s, (x + 15) * s, y * s, (x + -9) * s, (y - 101) * s);
	    triangle((x + 39) * s, (y - 8) * s, (x + 5) * s, y * s, (x + 9) * s, (y - 81) * s);
	    triangle((x + 48) * s, (y - 6) * s, (x + 22) * s, y * s, (x + 40) * s, (y - 69) * s);

	    fill(255, 140, 0);
	    arc(x * s, y * s, 100 * s, 100 * s, 0, 180);
	    arc(x * s, (y + 2) * s, 100 * s, 50 * s, 180, 356);
	    triangle((x - 49) * s, y * s, (x - 16) * s, y * s, (x - 40) * s, (y - 41) * s);
	    triangle((x - 26) * s, (y - 16) * s, (x + 15) * s, y * s, (x + -9) * s, (y - 58) * s);
	    triangle((x + 39) * s, (y - 8) * s, (x + 5) * s, y * s, (x + 13) * s, (y - 53) * s);
	    triangle((x + 48) * s, (y - 6) * s, (x + 22) * s, y * s, (x + 40) * s, (y - 45) * s);

	    fill(255, 191, 0);
	    arc(x * s, y * s, 100 * s, 100 * s, 0, 180);
	    arc(x * s, (y + 2) * s, 100 * s, 50 * s, 180, 356);
	    triangle((x - 49) * s, y * s, (x - 16) * s, y * s, (x - 40) * s, (y - 27) * s);
	    triangle((x - 26) * s, (y - 16) * s, (x + 15) * s, y * s, (x + -9) * s, (y - 39) * s);
	    triangle((x + 39) * s, (y - 8) * s, (x + 5) * s, y * s, (x + 16) * s, (y - 38) * s);
	    triangle((x + 48) * s, (y - 6) * s, (x + 22) * s, y * s, (x + 40) * s, (y - 30) * s);
	    
	    fill(255, 208, 0);
	    arc(x * s, (y + 17) * s, 100 * s, 70 * s, 0, 180);
	    triangle((x - 49) * s, (y + 20) * s, (x - 16) * s, (y + 20) * s, (x - 40) * s, (y - 11) * s);
	    triangle((x - 26) * s, (y + 16) * s, (x + 15) * s, (y + 20) * s, (x + -9) * s, (y - 17) * s);
	    triangle((x + 39) * s, (y + 23) * s, (x + 5) * s, (y + 20) * s, (x + 16) * s, (y - 23) * s);
	    triangle((x + 48) * s, (y + 32) * s, (x + 22) * s, (y + 20) * s, (x + 40) * s, (y - 10) * s);
	};

	var drawEarth = function(x, y, s) {
	    fill(133, 69, 0);
	    quad((x + 50) * s, y * s, (x + 70) * s, (y - 100) * s, (x + 110) * s, (y - 100) * s, (x + 170) * s, y * s);
	    fill(107, 46, 0);
	    quad(x * s, y * s, (x + 30) * s, (y - 80) * s, (x + 100) * s, (y - 70) * s, (x + 170) * s, y * s);
	    fill(135, 80, 22);
	    quad(x * s, (y - 5) * s, (x + 170) * s, y * s, (x + 116) * s, (y + 30) * s, (x + 35) * s, (y + 30) * s);
	    fill(168, 87, 0);
	    quad((x + 35) * s, (y + 30) * s, (x + 50) * s, (y - 30) * s, (x + 91) * s, (y - 30) * s, (x + 116) * s, (y + 30) * s);
	};

	var drawLight = function(x, y, s) {
	    fill(255, 213, 0, 10);
	    for (var i=0;i<150;i += 3) {
	        ellipse(x * s, y * s, i * s, i * s);
	    }
	};

	var drawNature = function(x, y, s) {
	    noFill();
	    stroke(59, 161, 0);
	    strokeWeight(4);
	    arc(x * s, (y + 56) * s, 30 * s, 50 * s, 185, 246);
	    noStroke();
	    fill(96, 214, 0);
	    ellipse((x + 11) * s, y * s, 80 * s, 80 * s);
	    triangle((x - 20) * s, (y - 27) * s, (x + 51) * s, (y + 5) * s, (x + 64) * s, (y - 87) * s);
	    noFill();
	    stroke(59, 161, 0);
	    arc((x + 24) * s, (y + 22) * s, 60 * s, 80 * s, 163, 241);
	    noStroke();
	};

	var drawWater = function(x, y, s) {
	    fill(0, 123, 255);
	    arc(x * s, y * s, 150 * s, 100 * s, 0, 180);
	    arc(x * s, (y + 2) * s, 150 * s, 50 * s, 180, 356);
	    triangle((x - 78) * s, y * s, (x - 51) * s, (y - 39) * s, (x + 43) * s, y * s);
	    triangle((x - 55) * s, y * s, (x - 14) * s, (y - 46) * s, (x + 43) * s, y * s);
	    triangle((x - 65) * s, y * s, (x  + 34) * s, (y - 48) * s, (x + 64) * s, y * s);
	    triangle((x + 79) * s, y * s, (x + 65) * s, (y - 39) * s, (x + 43) * s, y * s);
	    fill(0, 153, 255);
	    arc(x * s, y * s, 150 * s, 100 * s, 0, 180);
	    triangle((x - 78) * s, (y) * s, (x - 51) * s, (y - 19) * s, (x + 43) * s, y * s);
	    triangle((x - 55) * s, (y) * s, (x - 14) * s, (y - 26) * s, (x + 43) * s, y * s);
	    triangle((x - 65) * s, (y) * s, (x  + 34) * s, (y - 28) * s, (x + 64) * s, y * s);
	    triangle((x + 79) * s, (y) * s, (x + 65) * s, (y - 19) * s, (x + 43) * s, y * s);
	    fill(0, 166, 255);
	    arc(x * s, (y + 20) * s, 143 * s, 61 * s, 0, 180);
	    triangle((x - 78) * s, (y + 20) * s, (x - 51) * s, (y + 1) * s, (x + 43) * s, (y + 20) * s);
	    triangle((x - 55) * s, (y + 20) * s, (x - 14) * s, (y - 6) * s, (x + 43) * s, (y + 20) * s);
	    triangle((x - 65) * s, (y + 20) * s, (x  + 34) * s, (y - 8) * s, (x + 64) * s, (y + 20) * s);
	    triangle((x + 79) * s, (y + 20) * s, (x + 65) * s, (y + 1) * s, (x + 43) * s, (y + 20) * s);
	};

	var drawAir = function(x, y, s) {
	    fill(198, 227, 230, 10);
	    for (var i=0;i<150;i += 3) {
	        ellipse(x * s, y * s, i * s, i * s);
	    }
	    strokeWeight(10 * s);
	    stroke(198, 227, 230);
	    noFill();
	    arc((x + 2) * s, (y + -5) * s, 60 * s, 60 * s, 113, 223);
	    arc((x + 0) * s, (y + -13) * s, 50 * s, 50 * s, -78, 81);
	    arc((x + 4) * s, (y + -3) * s, 90 * s, 90 * s, -37, 94);
	    arc((x - 4) * s, (y + -3) * s, 90 * s, 90 * s, 127, 266);
	    noStroke();
	};

	var drawDarkness = function(x, y, s) {
	    fill(0, 0, 0, 10);
	    for (var i=0;i<150;i += 3) {
	        ellipse(x * s, y * s, i * s, i * s);
	    }
	};

	var drawDoor = function(x, y, s) {
	    fill(184, 131, 96);
	    rect(x * s, y * s, 75 * s, 150 * s);
	    stroke(130, 61, 0);
	    noFill();
	    strokeWeight(5 * s);
	    rect((x + 12) * s, (y + 10) * s, 50 * s, 50 * s);
	    rect((x + 12) * s, (y + 88) * s, 50 * s, 50 * s);
	    strokeWeight(12 * s);
	    point((x + 64) * s, (y + 75) * s);
	    noStroke();
	};

	var drawSignPost = function(x, y, myText, textHeight) {
	    fill(207, 132, 67);
	    stroke(102, 64, 34);
	    strokeWeight(5);
	    rect(x, y, 60, 30);
	    noStroke();
	    fill(102, 64, 34);
	    rect(x + 26, y + 30, 8, 30);
	    textFont(cursive, 12);
	    text(myText, x + 5, y + 12 + textHeight);
	};

	var drawStaff = function(x, y) {
	    if (character.element === "none") {
	        fill(255, 255, 255, 80);
	    } else if (character.element === "fire") {
	        fill(255, 89, 0, 80);
	    } else if (character.element === "water") {
	        fill(0, 110, 212, 80);
	    } else if (character.element === "light") {
	        fill(255, 207, 64, 80);
	    } else if (character.element === "darkness") {
	        fill(27, 0, 61, 80);
	    } else if (character.element === "earth") {
	        fill(156, 68, 0, 80);
	    } else if (character.element === "air") {
	        fill(214, 249, 255, 80);
	    } else if (character.element === "nature") {
	        fill(102, 212, 0, 80);
	    }
	    noStroke();
	    ellipse(x + 5, y + 65, 5, 5);
	    ellipse(x + 5, y + 65, 15, 15);
	    ellipse(x + 5, y + 65, 25, 25);
	    ellipse(x + 5, y + 65, 40, 40);
	    stroke(166, 117, 48);
	    strokeWeight(5);
	    noFill();
	    arc(x, y + 100, 10, 35, -27, 70);
	    arc(8 + x, y + 76, 10, 35, -226, -146);
	};

	var drawStaffSparkling = function(x, y) {
	    if (character.element === "none") {
	        fill(255, 255, 255, 80);
	    } else if (character.element === "fire") {
	        fill(255, 89, 0, 80);
	    } else if (character.element === "water") {
	        fill(0, 110, 212, 80);
	    } else if (character.element === "light") {
	        fill(255, 207, 64, 80);
	    } else if (character.element === "darkness") {
	        fill(27, 0, 61, 80);
	    } else if (character.element === "earth") {
	        fill(156, 68, 0, 80);
	    } else if (character.element === "air") {
	        fill(214, 249, 255, 80);
	    } else if (character.element === "nature") {
	        fill(102, 212, 0, 80);
	    }
	    ellipse(x + 5, y + 65, 5, 5);
	    ellipse(x + 5, y + 65, 15, 15);
	    ellipse(x + 5, y + 65, 25, 25);
	    ellipse(x + 5, y + 65, 40, 40);
	    ellipse(x + 5, y + 65, 55, 55);
	    ellipse(x + 5, y + 65, 70, 70);
	    stroke(166, 117, 48);
	    strokeWeight(5);
	    noFill();
	    arc(x, y + 100, 10, 35, -27, 70);
	    arc(8 + x, y + 76, 10, 35, -226, -146);
	    noStroke();
	};

	var drawQuests = function() {
	    background(character.color);
	    fill(character.accentColor);
	    textFont(fancy, 50);
	    text("Quests", 110, 50);
	    if (questPage === 1) {
	        for (var i = 0; i < quests.length; i ++) {
	            if ((i * 70) + 80 < 350) {
	                fill(255, 255, 255);
	                rect(20, (i * 70) + 80, 100, 50);
	                if (quests[i] === "findDoctor") {
	                    fill(0, 0, 0);
	                    textFont(cursive, 18);
	                    text("Find the doctor and talk to her.", 150, (i * 70) + 88, 250, 50);
	                    textFont(cursive, 16);
	                    text("Tour of the\n  Academy", 25, (i * 70) + 98);
	                } else if (quests[i] === "findMentor" && gender === "girl") {
	                    fill(0, 0, 0);
	                    textFont(cursive, 18);
	                    text("Find your Mentor and talk to her.", 150, (i * 70) + 88, 250, 50);
	                    textFont(cursive, 16);
	                    text("Tour of the\n  Academy", 25, (i * 70) + 98);
	                } else if (quests[i] === "findMentor" && gender === "boy") {
	                    fill(0, 0, 0);
	                    textFont(cursive, 18);
	                    text("Find your Mentor and talk to him.", 150, (i * 70) + 88, 250, 50);
	                    textFont(cursive, 16);
	                    text("Tour of the\n  Academy", 25, (i * 70) + 98);
	                } else if (quests[i] === "makeBracelet") {
	                    fill(0, 0, 0);
	                    textFont(cursive, 18);
	                    text("Successfuly make a bracelet.", 140, (i * 70) + 88, 250, 50);
	                    textFont(cursive, 17);
	                    text("Bracelet\n Making", 35, (i * 70) + 98);
	                } else if (quests[i] === "makeBraceletWithoutPink/Purple") {
	                    fill(0, 0, 0);
	                    textFont(cursive, 18);
	                    text("Successfuly make a bracelet without using pink or purple.", 140, (i * 70) + 88, 250, 50);
	                    textFont(cursive, 17);
	                    text("Bracelet\n Making", 35, (i * 70) + 98);
	                } else if (quests[i] === "swim") {
	                    fill(0, 0, 0);
	                    textFont(cursive, 18);
	                    text("Swim at the beach.", 140, (i * 70) + 88, 250, 50);
	                    textFont(cursive, 17);
	                    text("Training\nGrounds", 35, (i * 70) + 98);
	                } else if (quests[i] === "sail") {
	                    fill(0, 0, 0);
	                    textFont(cursive, 18);
	                    text("Complete level one of Set Sail.", 140, (i * 70) + 88, 250, 50);
	                    textFont(cursive, 17);
	                    text("Training\nGrounds", 35, (i * 70) + 98);
	                } else if (quests[i] === "sail2") {
	                    fill(0, 0, 0);
	                    textFont(cursive, 18);
	                    text("Complete level two of Set Sail.", 140, (i * 70) + 88, 250, 50);
	                    textFont(cursive, 17);
	                    text("Training\nGrounds", 35, (i * 70) + 98);
	                } else if (quests[i] === "sail3") {
	                    fill(0, 0, 0);
	                    textFont(cursive, 18);
	                    text("Complete level three of Set Sail.", 140, (i * 70) + 88, 250, 50);
	                    textFont(cursive, 17);
	                    text("Training\nGrounds", 35, (i * 70) + 98);
	                } else if (quests[i] === "battlePractice") {
	                    fill(0, 0, 0);
	                    textFont(cursive, 18);
	                    text("Defeat a dummy in the training room.", 140, (i * 70) + 88, 250, 50);
	                    textFont(cursive, 17);
	                    text("Training\nGrounds", 35, (i * 70) + 98);
	                } else if (quests[i] === "battlePractice2") {
	                    fill(0, 0, 0);
	                    textFont(cursive, 18);
	                    text("Defeat the highest level dummy in the training room.", 140, (i * 70) + 88, 250, 50);
	                    textFont(cursive, 17);
	                    text("Training\nGrounds", 35, (i * 70) + 98);
	                }
	            }
	        }
	    }
	};

	var drawInventory = function() {
	    background(240, 186, 125);
	    fill(133, 75, 13);
	    textSize(40);
	    text("Inventory", 105, 50);
	    fill(250, 245, 240);
	    rect(20, 80, 360, 260);
	};

	var drawMenu = function() {
	    background(173, 173, 255);
	    fill(94, 0, 255);
	    textFont(fancy, 60);
	    text("Elements\n of Magic", 58, 67);
	    playButton.checkIfPressed();
	    fill(107, 0, 201);
	    textFont(fancy, 40);
	    text("Earn My\n  Staff!", 118, 238);
	    drawFire(60, 217, 0.7);
	    drawWater(573, 314, 0.6);
	    drawEarth(51, 439, 0.6);
	    drawAir(554, 477, 0.6);
	    drawLight(89, 568, 0.6);
	    drawDarkness(414, 573, 0.6);
	    drawNature(242, 589, 0.6);
	    if (playButton.pressed) {
	        if (!doneIntro) {
	            state = "chooseElement";
	        } else {
	            state = "map";
	        }
	        playButton.pressed = false;
	    }
	};

	var drawChooseElement = function() {
	    background(207, 207, 255);
	    fill(115, 87, 255);
	    textFont(fancy, 55);
	    text("Select your\n  Element", 37, 65);
	    fireButton.drawIt();
	    drawFire(126, 633, 0.4);
	    fill(255, 81, 0);
	    textFont(fancy, 27);
	    text("Fire", 23, 208);
	    fireButton.checkIfPressed();
	    if (fireButton.pressed) {
	        character.element = "fire";
	    }
	    earthButton.drawIt();
	    drawEarth(290, 656, 0.4);
	    fill(161, 64, 0);
	    textFont(fancy, 22);
	    text("Earth", 116, 208);
	    earthButton.checkIfPressed();
	    if (earthButton.pressed) {
	        character.element = "earth";
	    }
	    lightButton.drawIt();
	    drawLight(628, 617, 0.4);
	    fill(255, 225, 0);
	    textFont(fancy, 25);
	    text("Light", 218, 208);
	    lightButton.checkIfPressed();
	    if (lightButton.pressed) {
	        character.element = "light";
	    }
	    natureButton.drawIt();
	    drawNature(854, 618, 0.4);
	    fill(119, 255, 0);
	    textFont(fancy, 19);
	    text("Nature", 314, 206);
	    natureButton.checkIfPressed();
	    if (natureButton.pressed) {
	        character.element = "nature";
	    }
	    waterButton.drawIt();
	    drawWater(126, 882, 0.4);
	    fill(0, 183, 255);
	    textFont(fancy, 21);
	    text("Water", 15, 316);
	    waterButton.checkIfPressed();
	    if (waterButton.pressed) {
	        character.element = "water";
	    }
	    airButton.drawIt();
	    drawAir(374, 882, 0.4);
	    fill(176, 247, 255);
	    textFont(fancy, 30);
	    text("Air", 122, 320);
	    airButton.checkIfPressed();
	    if (airButton.pressed) {
	        character.element = "air";
	    }
	    darknessButton.drawIt();
	    drawDarkness(622, 882, 0.4);
	    fill(0, 0, 0);
	    textFont(fancy, 15);
	    text("Darkness", 211, 313);
	    darknessButton.checkIfPressed();
	    if (darknessButton.pressed) {
	        character.element = "darkness";
	    }
	    elementContinueButton.drawIt();
	    fill(132, 0, 255);
	    textFont(cursive, 18);
	    text("Continue", 315, 340);
	    elementContinueButton.checkIfPressed();
	    if (elementContinueButton.pressed && character.element !== "none") {
	        state = "academy";
	        quests.push("findDoctor");
	        quests.push("makeBracelet");
	        popUpY.push(400);
	        popUpTypes.push("newQuest");
	        popUpY.push(470);
	        popUpTypes.push("newQuest");
	    } else if (elementContinueButton.pressed) {
	        noElement = true;
	    }
	    if (noElement) {
	        elementContinueCount ++;
	        background(207, 207, 255);
	        fill(115, 87, 255);
	        textFont(cursive, 60);
	        text(" You have\nnot chosen\nan element", 50, 100);
	    }
	    if (elementContinueCount > 200) {
	        noElement = false;
	        elementContinueCount = 0;
	    }
	};

	var drawAcademy = function() {
	    background(255, 254, 244);
	    //fire banner
	    fill(255, 167, 43);
	    rect(0, 0, 400/7, 80);
	    triangle(0, 80, 400/7, 80, 200/7, 120);
	    drawFire(62, 131, 0.45);
	    //earth banner
	    fill(199, 127, 76);
	    rect(400/7, 0, 400/7, 80);
	    triangle(400/7, 80, 800/7, 80, 600/7, 120);
	    drawEarth(204, 228, 0.3);
	    //light banner
	    fill(255, 254, 194);
	    rect(800/7, 0, 400/7, 80);
	    triangle(800/7, 80, 1200/7, 80, 1000/7, 120);
	    drawLight(478, 215, 0.3);
	    //nature banner
	    fill(196, 255, 166);
	    rect(1200/7, 0, 400/7, 80);
	    triangle(1200/7, 80, 1600/7, 80, 1400/7, 120);
	    drawNature(651, 215, 0.3);
	    //darkness banner
	    fill(159, 152, 171);
	    rect(1599/7, 0, 400/7, 80);
	    triangle(1600/7, 80, 2000/7, 80, 1800/7, 120);
	    drawDarkness(859, 215, 0.3);
	    //air banner
	    fill(242, 254, 255);
	    rect(1998/7, 0, 400/7, 80);
	    triangle(2400/7, 80, 2000/7, 80, 2200/7, 120);
	    drawAir(1048, 215, 0.3);
	    //water banner
	    fill(43, 195, 255);
	    rect(2398/7, 0, 405/7, 80);
	    triangle(2811/7, 80, 2400/7, 80, 2600/7, 120);
	    drawWater(1246, 215, 0.3);
	    
	    cafeteriaButton.drawIt();
	    cafeteriaButton.checkIfPressed();
	    if (cafeteriaButton.pressed) {
	        back = "academy";
	        state = "cafeteria";
	        beenToAcademy = true;
	        character.x = 200;
	        character.y = 300;
	    }
	    trainingGroundsButton.drawIt();
	    trainingGroundsButton.checkIfPressed();
	    if (trainingGroundsButton.pressed) {
	        back = "academy";
	        state = "trainingGrounds";
	        beenToAcademy = true;
	        character.x = 210;
	        character.y = 70;
	    }
	    classroomsButton.drawIt();
	    classroomsButton.checkIfPressed();
	    if (classroomsButton.pressed) {
	        back = "academy";
	        state = "classrooms";
	        beenToAcademy = true;
	        character.x = 200;
	        character.y = 300;
	    }
	    dormsButton.drawIt();
	    dormsButton.checkIfPressed();
	    
	    fill(94, 0, 255);
	    textFont(fancy, 40);
	    text("The Academy", 78, 148);
	    textFont(fancy, 26);
	    fill(119, 0, 255);
	    text("Places at the Academy:", 50, 181);
	    text("Cafeteria", 47, 244);
	    text("Training\nGrounds", 237, 229);
	    text("Dorms", 252, 350);
	    textFont(fancy, 24);
	    text("Classrooms", 45, 348);
	    
	    if (!beenToAcademy) {
	        if (cafeteriaButton.mousedOver) {
	            fill(205, 194, 255);
	            rect(mouseX - 60, mouseY - 100, 120, 80);
	            fill(94, 0, 255);
	            textFont(cursive, 14);
	            text("At the cafeteria, you can recharge, eat, and buy food to bring with you.", mouseX - 59, mouseY - 93, 120, 80);
	        }
	        if (trainingGroundsButton.mousedOver) {
	            fill(205, 194, 255);
	            rect(mouseX - 60, mouseY - 105, 120, 85);
	            fill(94, 0, 255);
	            textFont(cursive, 14);
	            text("At the training grounds, you can learn and practice 'outdoor' skills.", mouseX - 59, mouseY - 98, 120, 85);
	        }
	        if (classroomsButton.mousedOver) {
	            fill(205, 194, 255);
	            rect(mouseX - 60, mouseY - 105, 120, 85);
	            fill(94, 0, 255);
	            textFont(cursive, 14);
	            text("At the classrooms, you can learn and practice 'indoor' skills.", mouseX - 59, mouseY - 98, 120, 87);
	        }
	        if (dormsButton.mousedOver) {
	            fill(205, 194, 255);
	            rect(mouseX - 60, mouseY - 105, 120, 85);
	            fill(94, 0, 255);
	            textFont(cursive, 14);
	            text("At the dorms, you can decorate your room and play with your ooloos.", mouseX - 59, mouseY - 98, 120, 85);
	        }
	    }
	};

	var drawCafeteria = function() {
	    background(255, 246, 240);
	    fill(212, 162, 123);
	    rect(0, 250, 400, 150);
	    drawDoor(296, 100, 1);
	    cafeteriaShopDoor.checkIfPressed();
	    drawDoor(173, 100, 1);
	    nurseOfficeDoor.checkIfPressed();
	    fill(191, 142, 105);
	    quad(0, 400, 0, 300, 120, 150, 120, 250);
	    fill(212, 162, 123);
	    triangle(0, 300, 120, 150, 0, 150);
	    //plates
	    fill(255, 255, 255);
	    ellipse(59, 173, 60, 30);
	    ellipse(25, 217, 60, 30);
	    ellipse(-11, 262, 60, 30);
	    fill(245, 245, 245);
	    ellipse(59, 173, 50, 20);
	    ellipse(25, 217, 50, 20);
	    ellipse(-11, 262, 50, 20);
	    //red cross
	    fill(209, 0, 0);
	    rect(166, 34, 80, 20);
	    rect(197, 5, 20, 80);
	    //shop sign
	    fill(255, 255, 255);
	    rect(290, 26, 81, 50);
	    fill(0, 0, 0);
	    textFont(cursive, 33);
	    text("Shop", 290, 60);
	    if ((myDay+1) % 2 === 0) {
	        buritoDay = true;
	        pizzaDay = false;
	    } else {
	        pizzaDay = true;
	        buritoDay = false;
	    }
	    if (buritoDay) {
	        //poster
	        fill(255, 228, 76);
	        rect(28, 23, 70, 100);
	        fill(255, 0, 0);
	        textSize(18);
	        text("Special of the day: burritos", 30, 33, 68, 98);
	        //burritos
	        pushMatrix();
	        rotate(40);
	        fill(230, 216, 198);
	        rect(147, 73, 20, 40, 20);
	        rect(148, 127, 20, 40, 20);
	        rect(148, 182, 20, 40, 20);
	        popMatrix();
	    }
	    if (pizzaDay) {
	        //poster
	        fill(255, 255, 255);
	        rect(28, 23, 70, 100);
	        fill(191, 0, 0);
	        textSize(18);
	        text("Special of the day: pizza", 30, 33, 68, 98);
	        //pizza
	        fill(255, 250, 227);
	        triangle(35, 159, 60, 198, 91, 158);
	        triangle(0, 199, 25, 238, 56, 198);
	        fill(207, 185, 153);
	        quad(35, 158, 91, 157, 88, 165, 38, 165);
	        quad(0, 198, 56, 197, 53, 205, 3, 205);
	        fill(232, 0, 0);
	        ellipse(17, 213, 10, 7);
	        ellipse(34, 209, 10, 7);
	        ellipse(25, 223, 10, 7);
	    }
	    for (var i=0;i<waterCanteens.length;i++) {
	        waterCanteens[i].checkIfDrank();
	        if (waterCanteens[i].drank) {
	            waterCanteens.splice(i, 1);
	        }
	    }
	    for (var i=0;i<apples.length;i++) {
	        apples[i].checkIfEaten();
	        if (apples[i].eaten) {
	            apples.splice(i, 1);
	        }
	    }
	     for (var i=0;i<trailMixes.length;i++) {
	        trailMixes[i].checkIfEaten();
	        if (trailMixes[i].eaten) {
	            trailMixes.splice(i, 1);
	        }
	    }
	    if (character.nourishment<500 && timer % 150 === 0) {
	        character.nourishment += 50;
	        popUpY.push(400);
	        popUpTypes.push("+50nourishment");
	    }
	    character.drawIt();
	    character.moveIt();
	    character.limitLeft = 120;
	    character.limitTop = 250;
	    character.limitBottom = 370;
	    character.limitRight = 370;
	    if (character.y <= 250 && character.x > 173 && character.x < 220) {
	        state = "nurseOffice";
	        character.x = 200;
	        character.y = 350;
	        back = "cafeteria";
	    }
	    if (character.y <= 250 && character.x > 296 && character.x < 350) {
	        state = "cafeteriaShop";
	        character.x = 200;
	        character.y = 350;
	        back = "cafeteria";
	    }
	    if (character.y >= 370) {
	        state = "academy";
	        back = "cafeteria";
	        character.x = 200;
	        character.y = 300;
	    }
	    if (nurseOfficeDoor.pressed) {
	        state = "nurseOffice";
	        character.x = 200;
	        character.y = 350;
	        back = "cafeteria";
	    }
	    if (cafeteriaShopDoor.pressed) {
	        state = "cafeteriaShop";
	        character.x = 200;
	        character.y = 350;
	        back = "cafeteria";
	    }
	    fill(255, 255, 255);
	    rect(260, 360, 140, 50);
	    fill(0, 0, 0);
	    textSize(17);
	    text("To Academy", 269, 385);
	    text("coins: " + coins, 305, 17);
	    rect(379, 365, 10, 20);
	    triangle(370, 385, 395, 385, 383, 395);
	};

	var drawNurseOffice = function() {
	    background(173, 255, 240);
	    fill(219, 255, 243);
	    rect(0, 250, 400, 150);
	    fill(242, 242, 242);
	    rect(0,0,405,95);
	    rect(0,196,405,95);
	    fill(255, 255, 255);
	    rect(0,160,405,40);
	    noFill();
	    stroke(204, 204, 204);
	    strokeWeight(5);
	    rect(7, 7, 50, 80);
	    rect(67, 7, 70, 80);
	    rect(147, 7, 50, 80);
	    rect(207, 7, 50, 80);
	    rect(267, 7, 70, 80);
	    rect(347, 7, 50, 80);
	    rect(135, 209, 70, 75);
	    rect(218, 209, 70, 75);
	    rect(9, 207, 110, 18);
	    rect(9, 236, 110, 18);
	    rect(9, 263, 110, 18);
	    rect(297, 207, 110, 18);
	    rect(297, 236, 110, 18);
	    rect(297, 263, 110, 18);
	    strokeWeight(10);
	    point(45, 45);
	    point(126, 45);
	    point(159, 45);
	    point(247, 45);
	    point(279, 45);
	    point(358, 45);
	    point(361, 216);
	    point(361, 246);
	    point(361, 272);
	    point(234, 242);
	    point(189, 242);
	    point(66, 216);
	    point(66, 246);
	    point(66, 272);
	    noStroke();
	    if (character.health<500 && timer % 150 === 0) {
	        character.health += 50;
	        popUpY.push(400);
	        popUpTypes.push("+50health");
	    }
	    if (character.nourishment<50 && timer % 150 === 0) {
	        character.nourishment += 100;
	        popUpY.push(400);
	        popUpTypes.push("+50nourishment");
	    }
	    for (var i=0;i<waterCanteens.length;i++) {
	        waterCanteens[i].checkIfDrank();
	        if (waterCanteens[i].drank) {
	            waterCanteens.splice(i, 1);
	        }
	    }
	    for (var i=0;i<apples.length;i++) {
	        apples[i].checkIfEaten();
	        if (apples[i].eaten) {
	            apples.splice(i, 1);
	        }
	    }
	     for (var i=0;i<trailMixes.length;i++) {
	        trailMixes[i].checkIfEaten();
	        if (trailMixes[i].eaten) {
	            trailMixes.splice(i, 1);
	        }
	    }
	    nurse.drawIt();
	    nurse.checkIfSelected();
	    nurse.talk();
	    if (nurse.selected) {
	        beenToNurseOffice = true;
	    }
	    character.drawIt();
	    character.moveIt();
	    character.limitTop = 280;
	    character.limitBottom = 370;
	    character.limitRight = 370;
	    character.limitLeft = 30;
	    if (!beenToNurseOffice) {
	        fill(205, 194, 255);
	        rect(mouseX - 60, mouseY - 100, 120, 80);
	        fill(94, 0, 255);
	        textFont(cursive, 14);
	        text("Click on the doctor to learn about the doctor's office.", mouseX - 59, mouseY - 93, 120, 80);
	    }
	    if (character.y >= 370) {
	        state = "cafeteria";
	        back = "nurseOffice";
	        character.x = 200;
	        character.y = 300;
	    }
	    fill(255, 255, 255);
	    rect(260, 360, 140, 50);
	    fill(0, 0, 0);
	    textSize(17);
	    text("To cafeteria", 267, 385);
	    text("coins: " + coins, 305, 17);
	    rect(379, 365, 10, 20);
	    triangle(370, 385, 395, 385, 383, 395);
	    for (var i = 0; i < quests.length; i++) {
	        if (quests[i] === "findDoctor" && nurse.selected) {
	            quests[i] = "findMentor";
	            popUpY.push(400);
	            popUpTypes.push("completedQuest");
	            popUpY.push(480);
	            popUpTypes.push("newQuest");
	            coins += 50;
	            character.xp += 50;
	        }
	    }
	};

	var drawCafeteriaShop = function() {
	    background(255, 254, 244);
	    fill(240, 229, 209);
	    rect(0, 250, 400, 150);
	    fill(173, 248, 255);
	    rect(50, 24, 140, 70);
	    fill(0, 208, 255);
	    textFont(cursive, 50);
	    text("Shop", 62, 70);
	    cafeteriaStoreGuy.drawIt();
	    cafeteriaStoreGuy.checkIfSelected();
	    cafeteriaStoreGuy.talk();
	    fill(250, 250, 250);
	    rect(250, 80, 150, 170);
	    fill(230, 230, 230);
	    rect(270, 100, 120, 50);
	    rect(270, 175, 120, 50);
	    fill(181, 112, 34);
	    rect(0, 200, 250, 50);
	    fill(201, 132, 58);
	    rect(0, 170, 250, 30);
	    drawWaterCanteen(309, 205, 1);
	    drawApple(366, 136, 1);
	    drawTrailMix(354, 223, 1);
	    if (cafeteriaStoreGuy.selected) {
	        beenToCafeteriaShop = true;
	    }
	    character.limitLeft = 30;
	    character.limitTop = 250;
	    character.limitBottom = 370;
	    character.limitRight = 370;
	    character.drawIt();
	    character.moveIt();
	    if (!beenToCafeteriaShop) {
	        fill(205, 194, 255);
	        rect(mouseX - 60, mouseY - 80, 120, 60);
	        fill(94, 0, 255);
	        textFont(cursive, 14);
	        text("Click on the man to learn about shops.", mouseX - 59, mouseY - 73, 120, 80);
	    }
	    if (character.y >= 370) {
	        state = "cafeteria";
	        back = "cafeteriaShop";
	        character.x = 340;
	        character.y = 300;
	    }
	    fill(255, 255, 255);
	    rect(260, 360, 140, 50);
	    fill(0, 0, 0);
	    textSize(17);
	    text("To cafeteria", 267, 385);
	    rect(379, 365, 10, 20);
	    triangle(370, 385, 395, 385, 383, 395);
	    if (mouseX > 290 && mouseX < 330 && mouseY > 185 && mouseY < 225) {
	        fill(205, 194, 255);
	        rect(mouseX - 60, mouseY - 80, 120, 75);
	        fill(94, 0, 255);
	        textFont(cursive, 14);
	        text("Water Canteeen\n50 coins\nRestores 50 nourishment", mouseX - 59, mouseY - 73, 120, 75);
	        if (mouseIsClicked && coins >= 50) {
	            waterCanteens.push(newWaterCanteen());
	            //debug("Bought!");
	            popUpY.push(400);
	            popUpTypes.push("boughtCanteen");
	            coins -= 50;
	            if (sound) {
	                //playSound(getSound("rpg/coin-jingle"));
	            }
	        } else if (mouseIsClicked) {
	            popUpY.push(400);
	            popUpTypes.push("can'tAfford");
	        }
	    }
	    if (mouseX > 350 && mouseX < 380 && mouseY > 115 && mouseY < 150) {
	        fill(205, 194, 255);
	        rect(mouseX - 70, mouseY - 80, 100, 90);
	        fill(94, 0, 255);
	        textFont(cursive, 14);
	        text("Apple\n40 coins\nRestores 30 nourishment\n+10 strength", mouseX - 63, mouseY - 73, 120, 90);
	        if (mouseIsClicked && coins >= 40) {
	            apples.push(newApple());
	            popUpY.push(400);
	            popUpTypes.push("boughtApple");
	            coins -= 40;
	            if (sound) {
	                //playSound(getSound("rpg/coin-jingle"));
	            }
	        } else if (mouseIsClicked) {
	            popUpY.push(400);
	            popUpTypes.push("can'tAfford");
	        }
	    }
	    if (mouseX > 348 && mouseX < 395 && mouseY > 170 && mouseY < 220) {
	        fill(205, 194, 255);
	        rect(mouseX - 70, mouseY - 80, 100, 85);
	        fill(94, 0, 255);
	        textFont(cursive, 14);
	        text("Trail Mix\n35 coins\nRestores 15 nourishment\n+20 strength", mouseX - 63, mouseY - 73, 120, 85);
	        if (mouseIsClicked && coins >= 35) {
	            trailMixes.push(newTrailMix());
	            //debug("Bought!");
	            popUpY.push(400);
	            popUpTypes.push("boughtTrailMix");
	            coins -= 35;
	            if (sound) {
	                //playSound(getSound("rpg/coin-jingle"));
	            }
	        } else if (mouseIsClicked) {
	            popUpY.push(400);
	            popUpTypes.push("can'tAfford");
	        }
	    }
	    for (var i = waterCanteens.length - 1;i > -1; i--) {
	        waterCanteens[i].checkIfDrank();
	        if (waterCanteens[i].drank) {
	            waterCanteens.splice(i, 1);
	        }
	        if (i === 1) {
	            //debug(waterCanteens[i].drank);
	        }
	    }
	    for (var i=0;i<apples.length;i++) {
	        apples[i].checkIfEaten();
	        if (apples[i].eaten) {
	            apples.splice(i, 1);
	        }
	    }
	    for (var i=0;i<trailMixes.length;i++) {
	        trailMixes[i].checkIfEaten();
	        if (trailMixes[i].eaten) {
	            trailMixes.splice(i, 1);
	        }
	    }
	    fill(0, 0, 0);
	    textSize(17);
	    text("coins: " + coins, 305, 17);
	    //debug(waterCanteens);
	};

	var drawClassrooms = function() {
	    background(255, 254, 244);
	    fill(250, 247, 227);
	    rect(0, 250, 400, 340);
	    drawDoor(17, 100, 1);
	    learnMagicDoor.checkIfPressed();
	    if (learnMagicDoor.pressed) {
	        state = "learnMagic";
	        back = "classrooms";
	        character.x = 200;
	        character.y = 350;
	    }
	    if (character.x < 85 && character.y <= 250) {
	        state = "learnMagic";
	        back = "classrooms";
	        character.x = 200;
	        character.y = 350;
	    }
	    drawDoor(112, 100, 1);
	    playMusicDoor.checkIfPressed();
	    if (playMusicDoor.pressed) {
	        state = "musicMenu";
	    }
	    if (character.x > 112 && character.x < 187 && character.y <= 250) {
	        state = "musicMenu";
	        back = "classrooms";
	        character.x = 200;
	        character.y = 350;
	    }
	    drawDoor(207, 100, 1);
	    paintDoor.checkIfPressed();
	    if (paintDoor.pressed) {
	        state = "painting";
	        back = "classrooms";
	        staffCursor = false;
	        character.x = 200;
	        character.y = 350;
	    }
	    if (character.x > 207 && character.x < 282 && character.y <= 250) {
	        state = "painting";
	        back = "classrooms";
	        staffCursor = false;
	        character.x = 200;
	        character.y = 350;
	    }
	    drawDoor(302, 100, 1);
	    makeBracletsDoor.checkIfPressed();
	    if (makeBracletsDoor.pressed) {
	        state = "makeBracletsMenu";
	        back = "classrooms";
	        character.x = 200;
	        character.y = 350;
	    }
	    if (character.x > 302 && character.y <= 250) {
	        state = "makeBracletsMenu";
	        back = "classrooms";
	        character.x = 200;
	        character.y = 350;
	    }
	    fill(character.color);
	    rect(17, 30, 75, 40);
	    rect(112, 30, 75, 40);
	    rect(208, 30, 75, 40);
	    rect(302, 30, 75, 40);
	    fill(character.accentColor);
	    textFont(cursive, 15);
	    text("Learn Magic", 32, 32, 75, 40);
	    text(" Play\nMusic", 130, 32, 75, 40);
	    text("Paint", 226, 41, 75, 40);
	    text("  Make\nBracelets", 306, 32, 75, 40);
	    character.drawIt();
	    character.moveIt();
	    character.limitLeft = 30;
	    character.limitTop = 250;
	    character.limitBottom = 370;
	    character.limitRight = 370;
	    if (character.y >= 370) {
	        state = "academy";
	        back = "cafeteria";
	        character.x = 200;
	        character.y = 300;
	    }
	    fill(255, 255, 255);
	    rect(260, 360, 140, 50);
	    fill(0, 0, 0);
	    textSize(17);
	    text("To Academy", 269, 385);
	    rect(379, 365, 10, 20);
	    triangle(370, 385, 395, 385, 383, 395);
	    text("coins: " + coins, 305, 17);
	};

	var drawLearnMagic = function() {
	    background(character.accentColor);
	    fill(character.color);
	    rect(0, 250, 400, 150);
	    fill(255, 255, 255);
	    rect(250, 0, 155, 400);
	    fill(character.accentColor);
	    textFont(cursive, 20);
	    text("Available Spells", 250, 30);
	    if (character.element === "fire") {
	        spark.drawIt();
	        fill(character.accentColor);
	        textFont(cursive,30);
	        text("Spark", 286, 92);
	        spark.checkIfPressed();
	        if (spark.pressed && !character.knowLevel1Spell) {
	            character.knowLevel1Spell = true;
	            popUpY.push(400);
	            popUpTypes.push("learnedLevel1Spell");
	        }
	        flame.drawIt();
	        fill(character.accentColor);
	        text("Flame", 286, 157);
	        flame.checkIfPressed();
	        if (character.level >= 2) {
	            if (flame.pressed && !character.knowFlame) {
	                character.knowFlame = true;
	                popUpY.push(400);
	                popUpTypes.push("learnedLevel3Spell");
	            }
	        } else {
	            noFill();
	            stroke(196, 196, 196);
	            line(263, 122, 388, 178);
	            line(263, 178, 388, 122);
	            ellipse(325, 140, 23, 25);
	            noStroke();
	            fill(196, 196, 196);
	            rect(313, 140, 25, 26);
	            fill(156, 156, 156);
	            rect(322, 151, 8, 10);
	            ellipse(326, 150, 12, 12);
	        }
	        burn.drawIt();
	        fill(character.accentColor);
	        textFont(cursive,23);
	        text("Burn", 300, 223);
	        burn.checkIfPressed();
	        if (character.level >= 4) {
	            if (burn.pressed && !character.knowLevel2Spell) {
	                character.knowLevel2Spell = true;
	                popUpY.push(400);
	                popUpTypes.push("learnedLevel5Spell");
	            }
	        } else {
	            noFill();
	            stroke(196, 196, 196);
	            line(263, 188, 388, 244);
	            line(263, 244, 388, 188);
	            ellipse(325, 206, 23, 25);
	            noStroke();
	            fill(196, 196, 196);
	            rect(313, 206, 25, 26);
	            fill(156, 156, 156);
	            rect(322, 217, 8, 10);
	            ellipse(326, 216, 12, 12);
	        }
	        fire.drawIt();
	        fill(character.accentColor);
	        textFont(cursive,23);
	        text("Fire", 302, 287);
	        fire.checkIfPressed();
	        if (character.level >= 6) {
	            if (fire.pressed && !character.knowLevel3Spell) {
	                character.knowLevel3Spell = true;
	                popUpY.push(400);
	                popUpTypes.push("learnedLevel7Spell");
	            }
	        } else {
	            noFill();
	            stroke(196, 196, 196);
	            line(263, 254, 388, 310);
	            line(263, 310, 388, 254);
	            ellipse(325, 272, 23, 25);
	            noStroke();
	            fill(196, 196, 196);
	            rect(313, 272, 25, 26);
	            fill(156, 156, 156);
	            rect(322, 283, 8, 10);
	            ellipse(326, 282, 12, 12);
	        }
	    }
	    if (character.element === "water") {
	        droplet.drawIt();
	        fill(character.accentColor);
	        textFont(cursive,30);
	        text("Droplet", 272, 92);
	        droplet.checkIfPressed();
	        if (droplet.pressed && !character.knowLevel1Spell) {
	            character.knowLevel1Spell = true;
	            popUpY.push(400);
	            popUpTypes.push("learnedLevel1Spell");
	        }
	        stream.drawIt();
	        fill(character.accentColor);
	        text("Stream", 273, 157);
	        stream.checkIfPressed();
	        if (character.level >= 2) {
	            if (stream.pressed && !character.knowLevel2Spell) {
	                character.knowLevel2Spell = true;
	                popUpY.push(400);
	                popUpTypes.push("learnedLevel3Spell");
	            }
	        } else {
	            noFill();
	            stroke(196, 196, 196);
	            line(263, 122, 388, 178);
	            line(263, 178, 388, 122);
	            ellipse(325, 140, 23, 25);
	            noStroke();
	            fill(196, 196, 196);
	            rect(313, 140, 25, 26);
	            fill(156, 156, 156);
	            rect(322, 151, 8, 10);
	            ellipse(326, 150, 12, 12);
	        }
	        river.drawIt();
	        fill(character.accentColor);
	        textFont(cursive,23);
	        text("River", 300, 223);
	        river.checkIfPressed();
	        if (character.level >= 4) {
	            if (river.pressed && !character.knowLevel3Spell) {
	                character.knowLevel3Spell = true;
	                popUpY.push(400);
	                popUpTypes.push("learnedLevel5Spell");
	            }
	        } else {
	            noFill();
	            stroke(196, 196, 196);
	            line(263, 188, 388, 244);
	            line(263, 244, 388, 188);
	            ellipse(325, 206, 23, 25);
	            noStroke();
	            fill(196, 196, 196);
	            rect(313, 206, 25, 26);
	            fill(156, 156, 156);
	            rect(322, 217, 8, 10);
	            ellipse(326, 216, 12, 12);
	        }
	        ocean.drawIt();
	        fill(character.accentColor);
	        textFont(cursive,23);
	        text("Ocean", 292, 287);
	        ocean.checkIfPressed();
	        if (character.level >= 6) {
	            if (ocean.pressed && !character.knowLevel4Spell) {
	                character.knowLevel4Spell = true;
	                popUpY.push(400);
	                popUpTypes.push("learnedLevel7Spell");
	            }
	        } else {
	            noFill();
	            stroke(196, 196, 196);
	            line(263, 254, 388, 310);
	            line(263, 310, 388, 254);
	            ellipse(325, 272, 23, 25);
	            noStroke();
	            fill(196, 196, 196);
	            rect(313, 272, 25, 26);
	            fill(156, 156, 156);
	            rect(322, 283, 8, 10);
	            ellipse(326, 282, 12, 12);
	        }
	    }
	    if (character.element === "earth") {
	        pebble.drawIt();
	        fill(character.accentColor);
	        textFont(cursive,30);
	        text("Pebble", 272, 92);
	        pebble.checkIfPressed();
	        if (pebble.pressed && !character.knowLevel1Spell) {
	            character.knowLevel1Spell = true;
	            popUpY.push(400);
	            popUpTypes.push("learnedLevel1Spell");
	        }
	        stone.drawIt();
	        fill(character.accentColor);
	        text("Stone", 279, 157);
	        stone.checkIfPressed();
	        if (character.level >= 2) {
	            if (stone.pressed && !character.knowLevel2Spell) {
	                character.knowLevel2Spell = true;
	                popUpY.push(400);
	                popUpTypes.push("learnedLevel3Spell");
	            }
	        } else {
	            noFill();
	            stroke(196, 196, 196);
	            line(263, 122, 388, 178);
	            line(263, 178, 388, 122);
	            ellipse(325, 140, 23, 25);
	            noStroke();
	            fill(196, 196, 196);
	            rect(313, 140, 25, 26);
	            fill(156, 156, 156);
	            rect(322, 151, 8, 10);
	            ellipse(326, 150, 12, 12);
	        }
	        boulder.drawIt();
	        fill(character.accentColor);
	        textFont(cursive,25);
	        text("Boulder", 283, 223);
	        boulder.checkIfPressed();
	        if (character.level >= 4) {
	            if (boulder.pressed && !character.knowLevel3Spell) {
	                character.knowLevel3Spell = true;
	                popUpY.push(400);
	                popUpTypes.push("learnedLevel5Spell");
	            }
	        } else {
	            noFill();
	            stroke(196, 196, 196);
	            line(263, 188, 388, 244);
	            line(263, 244, 388, 188);
	            ellipse(325, 206, 23, 25);
	            noStroke();
	            fill(196, 196, 196);
	            rect(313, 206, 25, 26);
	            fill(156, 156, 156);
	            rect(322, 217, 8, 10);
	            ellipse(326, 216, 12, 12);
	        }
	        earthquake.drawIt();
	        fill(character.accentColor);
	        textFont(cursive,23);
	        text("Earthquake", 264, 287);
	        earthquake.checkIfPressed();
	        if (character.level >= 6) {
	            if (earthquake.pressed && !character.knowLevel4Spell) {
	                character.knowLevel4Spell = true;
	                popUpY.push(400);
	                popUpTypes.push("learnedLevel7Spell");
	            }
	        } else {
	            noFill();
	            stroke(196, 196, 196);
	            line(263, 254, 388, 310);
	            line(263, 310, 388, 254);
	            ellipse(325, 272, 23, 25);
	            noStroke();
	            fill(196, 196, 196);
	            rect(313, 272, 25, 26);
	            fill(156, 156, 156);
	            rect(322, 283, 8, 10);
	            ellipse(326, 282, 12, 12);
	        }
	    }
	    if (character.element === "air") {
	        breeze.drawIt();
	        fill(character.accentColor);
	        textFont(cursive,30);
	        text("Breeze", 272, 92);
	        breeze.checkIfPressed();
	        if (breeze.pressed && !character.knowLevel1Spell) {
	            character.knowLevel1Spell = true;
	            popUpY.push(400);
	            popUpTypes.push("learnedLevel1Spell");
	        }
	        gust.drawIt();
	        fill(character.accentColor);
	        text("Gust", 289, 157);
	        gust.checkIfPressed();
	        if (character.level >= 2) {
	            if (gust.pressed && !character.knowLevel2Spell) {
	                character.knowLevel2Spell = true;
	                popUpY.push(400);
	                popUpTypes.push("learnedLevel3Spell");
	            }
	        } else {
	            noFill();
	            stroke(196, 196, 196);
	            line(263, 122, 388, 178);
	            line(263, 178, 388, 122);
	            ellipse(325, 140, 23, 25);
	            noStroke();
	            fill(196, 196, 196);
	            rect(313, 140, 25, 26);
	            fill(156, 156, 156);
	            rect(322, 151, 8, 10);
	            ellipse(326, 150, 12, 12);
	        }
	        wind.drawIt();
	        fill(character.accentColor);
	        textFont(cursive,25);
	        text("Wind", 287, 223);
	        wind.checkIfPressed();
	        if (character.level >= 4) {
	            if (wind.pressed && !character.knowLevel3Spell) {
	                character.knowLevel3Spell = true;
	                popUpY.push(400);
	                popUpTypes.push("learnedLevel5Spell");
	            }
	        } else {
	            noFill();
	            stroke(196, 196, 196);
	            line(263, 188, 388, 244);
	            line(263, 244, 388, 188);
	            ellipse(325, 206, 23, 25);
	            noStroke();
	            fill(196, 196, 196);
	            rect(313, 206, 25, 26);
	            fill(156, 156, 156);
	            rect(322, 217, 8, 10);
	            ellipse(326, 216, 12, 12);
	        }
	        tornado.drawIt();
	        fill(character.accentColor);
	        textFont(cursive,23);
	        text("Tornado", 278, 287);
	        tornado.checkIfPressed();
	        if (character.level >= 6) {
	            if (tornado.pressed && !character.knowTornado) {
	                character.knowTornado = true;
	                popUpY.push(400);
	                popUpTypes.push("learnedLevel7Spell");
	            }
	        } else {
	            noFill();
	            stroke(196, 196, 196);
	            line(263, 254, 388, 310);
	            line(263, 310, 388, 254);
	            ellipse(325, 272, 23, 25);
	            noStroke();
	            fill(196, 196, 196);
	            rect(313, 272, 25, 26);
	            fill(156, 156, 156);
	            rect(322, 283, 8, 10);
	            ellipse(326, 282, 12, 12);
	        }
	    }
	    if (character.element === "light") {
	        shine.drawIt();
	        fill(character.accentColor);
	        textFont(cursive,30);
	        text("Shine", 286, 92);
	        shine.checkIfPressed();
	        if (shine.pressed && !character.knowLevel1Spell) {
	            character.knowLevel1Spell = true;
	            popUpY.push(400);
	            popUpTypes.push("learnedLevel1Spell");
	        }
	        glow.drawIt();
	        fill(character.accentColor);
	        text("Glow", 296, 157);
	        shine.checkIfPressed();
	        if (character.level >= 2) {
	            if (glow.pressed && !character.knowLevel2Spell) {
	                character.knowLevel2Spell = true;
	                popUpY.push(400);
	                popUpTypes.push("learnedLevel3Spell");
	            }
	        } else {
	            noFill();
	            stroke(196, 196, 196);
	            line(263, 122, 388, 178);
	            line(263, 178, 388, 122);
	            ellipse(325, 140, 23, 25);
	            noStroke();
	            fill(196, 196, 196);
	            rect(313, 140, 25, 26);
	            fill(156, 156, 156);
	            rect(322, 151, 8, 10);
	            ellipse(326, 150, 12, 12);
	        }
	        illuminate.drawIt();
	        fill(character.accentColor);
	        textFont(cursive,23);
	        text("Illuminate", 270, 223);
	        illuminate.checkIfPressed();
	        if (character.level >= 4) {
	            if (illuminate.pressed && !character.knowLevel3Spell) {
	                character.knowLevel3Spell = true;
	                popUpY.push(400);
	                popUpTypes.push("learnedLevel5Spell");
	            }
	        } else {
	            noFill();
	            stroke(196, 196, 196);
	            line(263, 188, 388, 244);
	            line(263, 244, 388, 188);
	            ellipse(325, 206, 23, 25);
	            noStroke();
	            fill(196, 196, 196);
	            rect(313, 206, 25, 26);
	            fill(156, 156, 156);
	            rect(322, 217, 8, 10);
	            ellipse(326, 216, 12, 12);
	        }
	        light.drawIt();
	        fill(character.accentColor);
	        textFont(cursive,23);
	        text("Light", 300, 287);
	        light.checkIfPressed();
	        if (character.level >= 6) {
	            if (light.pressed && !character.knowLevel4Spell) {
	                character.knowLevel4Spell = true;
	                popUpY.push(400);
	                popUpTypes.push("learnedLevel7Spell");
	            }
	        } else {
	            noFill();
	            stroke(196, 196, 196);
	            line(263, 254, 388, 310);
	            line(263, 310, 388, 254);
	            ellipse(325, 272, 23, 25);
	            noStroke();
	            fill(196, 196, 196);
	            rect(313, 272, 25, 26);
	            fill(156, 156, 156);
	            rect(322, 283, 8, 10);
	            ellipse(326, 282, 12, 12);
	        }
	    }
	    if (character.element === "darkness") {
	        shadow.drawIt();
	        fill(character.accentColor);
	        textFont(cursive,30);
	        text("Shadow", 272, 92);
	        shadow.checkIfPressed();
	        if (shadow.pressed && !character.knowShadow) {
	            character.knowLevel1Spell = true;
	            popUpY.push(400);
	            popUpTypes.push("learnedLevel1Spell");
	        }
	        darken.drawIt();
	        fill(character.accentColor);
	        text("Darken", 276, 157);
	        darken.checkIfPressed();
	        if (character.level >= 2) {
	            if (darken.pressed && !character.knowDarken) {
	                character.knowLevel2Spell = true;
	                popUpY.push(400);
	                popUpTypes.push("learnedLevel3Spell");
	            }
	        } else {
	            noFill();
	            stroke(196, 196, 196); 
	            line(263, 122, 388, 178);
	            line(263, 178, 388, 122);
	            ellipse(325, 140, 23, 25);
	            noStroke();
	            fill(196, 196, 196);
	            rect(313, 140, 25, 26);
	            fill(156, 156, 156);
	            rect(322, 151, 8, 10);
	            ellipse(326, 150, 12, 12);
	        }
	        night.drawIt();
	        fill(character.accentColor);
	        textFont(cursive,23);
	        text("Night", 293, 223);
	        night.checkIfPressed();
	        if (character.level >= 4) {
	            if (night.pressed && !character.knowNight) {
	                character.knowLevel3Spell = true;
	                popUpY.push(400);
	                popUpTypes.push("learnedLevel5Spell");
	            }
	        } else {
	            noFill();
	            stroke(196, 196, 196);
	            line(263, 188, 388, 244);
	            line(263, 244, 388, 188);
	            ellipse(325, 206, 23, 25);
	            noStroke();
	            fill(196, 196, 196);
	            rect(313, 206, 25, 26);
	            fill(156, 156, 156);
	            rect(322, 217, 8, 10);
	            ellipse(326, 216, 12, 12);
	        }
	        darkness.drawIt();
	        fill(character.accentColor);
	        textFont(cursive,23);
	        text("Darkness", 276, 287);
	        darkness.checkIfPressed();
	        if (character.level >= 6) {
	            if (darkness.pressed && !character.knowDarkness) {
	                character.knowLevel4Spell = true;
	                popUpY.push(400);
	                popUpTypes.push("learnedLevel7Spell");
	            }
	        } else {
	            noFill();
	            stroke(196, 196, 196);
	            line(263, 254, 388, 310);
	            line(263, 310, 388, 254);
	            ellipse(325, 272, 23, 25);
	            noStroke();
	            fill(196, 196, 196);
	            rect(313, 272, 25, 26);
	            fill(156, 156, 156);
	            rect(322, 283, 8, 10);
	            ellipse(326, 282, 12, 12);
	        }
	    }
	    if (character.element === "nature") {
	        seed.drawIt();
	        fill(character.accentColor);
	        textFont(cursive,30);
	        text("Seed", 286, 92);
	        seed.checkIfPressed();
	        if (seed.pressed && !character.knowLevel1Spell) {
	            character.knowLevel1Spell = true;
	            popUpY.push(400);
	            popUpTypes.push("learnedLevel1Spell");
	        }
	        sapling.drawIt();
	        fill(character.accentColor);
	        text("Sapling", 276, 157);
	        sapling.checkIfPressed();
	        if (character.level >= 2) {
	            if (sapling.pressed && !character.knowLevel2Spell) {
	                character.knowLevel2Spell = true;
	                popUpY.push(400);
	                popUpTypes.push("learnedLevel3Spell");
	            }
	        } else {
	            noFill();
	            stroke(196, 196, 196);
	            line(263, 122, 388, 178);
	            line(263, 178, 388, 122);
	            ellipse(325, 140, 23, 25);
	            noStroke();
	            fill(196, 196, 196);
	            rect(313, 140, 25, 26);
	            fill(156, 156, 156);
	            rect(322, 151, 8, 10);
	            ellipse(326, 150, 12, 12);
	        }
	        protect.drawIt();
	        fill(character.accentColor);
	        textFont(cursive,23);
	        text("Protect", 284, 223);
	        protect.checkIfPressed();
	        if (character.level >= 4) {
	            if (protect.pressed && !character.knowLevel3Spell) {
	                character.knowLevel3Spell = true;
	                popUpY.push(400);
	                popUpTypes.push("learnedLevel5Spell");
	            }
	        } else {
	            noFill();
	            stroke(196, 196, 196);
	            line(263, 188, 388, 244);
	            line(263, 244, 388, 188);
	            ellipse(325, 206, 23, 25);
	            noStroke();
	            fill(196, 196, 196);
	            rect(313, 206, 25, 26);
	            fill(156, 156, 156);
	            rect(322, 217, 8, 10);
	            ellipse(326, 216, 12, 12);
	        }
	        grow.drawIt();
	        fill(character.accentColor);
	        textFont(cursive,23);
	        text("Grow", 300, 287);
	        grow.checkIfPressed();
	        if (character.level >= 6) {
	            if (grow.pressed && !character.knowLevel4Spell) {
	                character.knowLevel4Spell = true;
	                popUpY.push(400);
	                popUpTypes.push("learnedLevel7Spell");
	            }
	        } else {
	            noFill();
	            stroke(196, 196, 196);
	            line(263, 254, 388, 310);
	            line(263, 310, 388, 254);
	            ellipse(325, 272, 23, 25);
	            noStroke();
	            fill(196, 196, 196);
	            rect(313, 272, 25, 26);
	            fill(156, 156, 156);
	            rect(322, 283, 8, 10);
	            ellipse(326, 282, 12, 12);
	        }
	    }
	    mentor.drawIt();
	    mentor.talk();
	    mentor.checkIfSelected();
	    character.drawIt();
	    character.moveIt();
	    character.limitLeft = 30;
	    character.limitTop = 250;
	    character.limitBottom = 370;
	    character.limitRight = 230;
	    if (!beenToLearnMagic) {
	        fill(205, 194, 255);
	        rect(mouseX - 60, mouseY - 100, 120, 50);
	        fill(94, 0, 255);
	        textFont(cursive, 15);
	        text("  Click on the             mage.", mouseX - 50, mouseY - 93, 120, 50);
	    }
	    if (mentor.selected) {
	        beenToLearnMagic = true;
	    }
	    if (character.y >= 370) {
	        state = "classrooms";
	        back = "learnMagic";
	        character.x = 200;
	        character.y = 300;
	    }
	    for (var i = 0; i < quests.length; i++) {
	        if (quests[i] === "findMentor" && mentor.selected) {
	            popUpY.push(400);
	            popUpTypes.push("completedQuest");
	            popUpY.push(480);
	            popUpTypes.push("newQuest");
	            quests.splice(i, 1);
	            coins += 50;
	            character.xp += 50;
	            quests.push("findCafeteriaShop");
	        }
	    }
	};

	var drawMakeBracletsMenu = function() {
	    background(255, 199, 229);
	    textFont(fancy, 40);
	    fill(255, 48, 186);
	    text("Bracelet Making\n        Studio", 33, 50);
	    stroke(255, 48, 186);
	    strokeWeight(3);
	    line(60, 370, 60, 80);
	    line(340, 370, 340, 80);
	    noStroke();
	    playMakeBracletsButton.checkIfPressed();
	    if (playMakeBracletsButton.pressed) {
	        state = "playingBracletMaking";
	        braceletGameTimer = 140;
	        braceletCollectedCoins = 0;
	        madeBraceletWithoutPinkOrPurple = true;
	        bracelet = [];
	    }
	    howToPlayMakeBracletsButton.checkIfPressed();
	    if (howToPlayMakeBracletsButton.pressed) {
	        state = "howToPlayBraceletMaking";
	        back = "makeBracletsMenu";
	    }
	    classroomsBracletsButton.checkIfPressed();
	    if (classroomsBracletsButton.pressed) {
	        state = "classrooms";
	        back = "makeBracletsMenu";
	    }
	    textFont(fancy, 45);
	    fill(255, 107, 225);
	    text("Play", 147, 179);
	    textFont(fancy, 35);
	    text("How To\n  Play", 131, 257);
	    text("Classrooms", 101, 368);
	    bead1.drawIt();
	    bead2.drawIt();
	    bead3.drawIt();
	    bead4.drawIt();
	    bead5.drawIt();
	    bead6.drawIt();
	    bead7.drawIt();
	    bead8.drawIt();
	    bead9.drawIt();
	    bead10.drawIt();
	    bead11.drawIt();
	    bead12.drawIt();
	    bead13.drawIt();
	    bead14.drawIt();
	    bead15.drawIt();
	    bead16.drawIt();
	    bead17.drawIt();
	    bead18.drawIt();
	};

	var drawPlayMakeBraclets = function() {
	    background(255, 199, 229);
	    if (timer % 10 === 0) {
	        braceletGameTimer --;
	    }
	    stroke(255, 48, 186);
	    strokeWeight(3);
	    line(mouseX, 370, mouseX, 402);
	    noStroke();
	    fill(255, 48, 186);
	    textFont(cursive, 25);
	    text("Timer: " + braceletGameTimer, 15, 40);
	    text(beadsCaught + "/40", 15, 70);
	    if (timer % 35 === 0) {
	        beads.push(newBead(random(0,400), 0, 1));
	    }
	    for (var i = 0; i < beads.length; i++) {
	        if (!beads[i].added) {
	            beads[i].drawIt();
	        }
	        beads[i].moveIt();
	        if (beads[i].threaded && !beads[i].added) {
	            bracelet.push(beads[i].type);
	            beads[i].added = true;
	        } else if (beads[i].y > 400) {
	            beads.splice(i, 1);
	        }
	    }
	    if (beadsCaught >= 40) {
	        state = "winBracelets";
	        beadsCaught = 0;
	        beads = [];
	        coins += 50;
	        braceletCollectedCoins += 50;
	        back = "makeBracletsMenu";
	        for (var i = 0; i < quests.length; i++) {
	            if (quests[i] === "makeBracelet") {
	                quests[i] = "makeBraceletWithoutPink/Purple";
	                popUpY.push(400);
	                popUpTypes.push("completedQuest");
	                popUpY.push(480);
	                popUpTypes.push("newQuest");
	                coins += 50;
	                character.xp += 50;
	            }
	            if (quests[i] === "makeBraceletWithoutPink/Purple" && madeBraceletWithoutPinkOrPurple) {
	                quests.splice(i, 1);
	                popUpY.push(400);
	                popUpTypes.push("completedQuest");
	                coins += 50;
	                character.xp += 50;
	            }
	        }
	    }
	    if (braceletGameTimer < 1) {
	        state = "gameOverBracelets";
	        beadsCaught = 0;
	        beads = [];
	        coins += 25;
	        braceletCollectedCoins += 25;
	        back = "makeBracletsMenu";
	    }
	};

	var drawWinBracelets = function() {
	    background(255, 199, 229);
	    textFont(fancy, 44);
	    fill(255, 48, 186);
	    text("You made a\n  bracelet!\n\nYou earned\n  " + braceletCollectedCoins + " coins", 35, 80);
	    stroke(255, 48, 186);
	    strokeWeight(3);
	    line(370, 10, 370, 390);
	    noStroke();
	    //8
	    for (var i=0; i < bracelet.length; i++) {
	        currentBead = newBead(367 * 2.1276596, (i * 9.5 + 10) * 2.1276596, 0.47);
	        currentBead.type = bracelet[i];
	        currentBead.drawIt();
	    }
	};

	var drawGameOverBracelets = function() {
	    background(255, 199, 229);
	    textFont(fancy, 44);
	    fill(255, 48, 186);
	    text("Game Over\n\nYou earned\n  " + braceletCollectedCoins + " coins", 55, 70);
	    
	};

	var drawHowToPlayBraceletMaking = function() {
	    background(255, 199, 229);
	    textFont(fancy, 40);
	    fill(255, 48, 186);
	    text("How To Play", 65, 50);
	    textFont(cursive, 25);
	    fill(255, 107, 225);
	    text("Move your mouse to control the thread. Try to string beads on it. String forty beads before time runs out to win.\n\nGreen beads add 20 to the timer. Pink beads give you 10 coins. Purple beads give you 20 coins.", 30, 90, 340, 400);
	};

	var drawPainting = function() {
	    background(215, 177, 227);
	    fill(255, 255, 255);
	    rect(85, 100, 230, 230);//canvas
	    for (var i = 0; i < paintingXs.length; i++) {
	        stroke(paintingCs[i]);
	        strokeWeight(paintingSs[i]);
	        line(paintingX2s[i], paintingY2s[i], paintingXs[i], paintingYs[i]);
	        noStroke();
	    }
	    fill(215, 177, 227);
	    rect(0, 90, 85, 340);
	    rect(85, 0, 240, 100);
	    rect(75, 330, 240, 200);
	    rect(315, 90, 85, 340);
	    fill(194, 0, 0);
	    ellipse(340, 120, 25, 25);
	    redButton.checkIfPressed();
	    if (redButton.pressed) {
	        selectedColor = color(194, 0, 0);
	    }
	    fill(227, 122, 16);
	    ellipse(377, 120, 25, 25);
	    orangeButton.checkIfPressed();
	    if (orangeButton.pressed) {
	        selectedColor = color(227, 122, 16);
	    }
	    fill(167, 222, 37);
	    ellipse(340, 160, 25, 25);
	    lightGreenButton.checkIfPressed();
	    if (lightGreenButton.pressed) {
	        selectedColor = color(167, 222, 37);
	    }
	    fill(245, 202, 32);
	    ellipse(377, 160, 25, 25);
	    yellowButton.checkIfPressed();
	    if (yellowButton.pressed) {
	        selectedColor = color(245, 202, 32);
	    }
	    fill(70, 161, 13);
	    ellipse(340, 200, 25, 25);
	    greenButton.checkIfPressed();
	    if (greenButton.pressed) {
	        selectedColor = color(70, 161, 13);
	    }
	    fill(31, 167, 240);
	    ellipse(377, 200, 25, 25);
	    blueButton.checkIfPressed();
	    if (blueButton.pressed) {
	        selectedColor = color(31, 167, 240);
	    }
	    fill(236, 120, 240);
	    ellipse(340, 240, 25, 25);
	    pinkButton.checkIfPressed();
	    if (pinkButton.pressed) {
	        selectedColor = color(236, 120, 240);
	    }
	    fill(147, 35, 245);
	    ellipse(377, 240, 25, 25);
	    purpleButton.checkIfPressed();
	    if (purpleButton.pressed) {
	        selectedColor = color(147, 35, 245);
	    }
	    fill(138, 73, 21);
	    ellipse(340, 280, 25, 25);
	    brownButton.checkIfPressed();
	    if (brownButton.pressed) {
	        selectedColor = color(138, 73, 21);
	    }
	    fill(255, 255, 255);
	    ellipse(377, 280, 25, 25);
	    whiteButton.checkIfPressed();
	    if (whiteButton.pressed) {
	        selectedColor = color(255, 255, 255);
	    }
	    fill(0, 0, 0);
	    ellipse(340, 320, 25, 25);
	    blackButton.checkIfPressed();
	    if (blackButton.pressed) {
	        selectedColor = color(0, 0, 0);
	    }
	    fill(133, 133, 133);
	    ellipse(377, 320, 25, 25);
	    greyButton.checkIfPressed();
	    if (greyButton.pressed) {
	        selectedColor = color(133, 133, 133);
	    }
	    fill(0, 0, 0);
	    ellipse(42.5, 110, 5, 5);
	    fiveButton.checkIfPressed();
	    if (fiveButton.pressed) {
	        selectedSize = 5;
	    }
	    ellipse(42.5, 130, 10, 10);
	    tenButton.checkIfPressed();
	    if (tenButton.pressed) {
	        selectedSize = 10;
	    }
	    ellipse(42.5, 160, 15, 15);
	    fifteenButton.checkIfPressed();
	    if (fifteenButton.pressed) {
	        selectedSize = 15;
	    }
	    ellipse(42.5, 195, 20, 20);
	    twentyButton.checkIfPressed();
	    if (twentyButton.pressed) {
	        selectedSize = 20;
	    }
	    ellipse(42.5, 240, 30, 30);
	    thirtyButton.checkIfPressed();
	    if (thirtyButton.pressed) {
	        selectedSize = 30;
	    }
	    ellipse(42.5, 300, 45, 45);
	    fortyFiveButton.checkIfPressed();
	    if (fortyFiveButton.pressed) {
	        selectedSize = 45;
	    }
	    backPaintButton.drawIt();
	    fill(110, 35, 138);
	    textFont(fancy, 25);
	    text("Back", 14, 375);
	    backPaintButton.checkIfPressed();
	    if (backPaintButton.pressed) {
	        state = "classrooms";
	        coins += floor(paintingTimer/500);
	        paintingTimer = 0;
	        selectedColor = color(0, 0, 0);
	        paintingXs = [];
	        paintingYs = [];
	        paintingX2s = [];
	        paintingY2s = [];
	        paintingSs = [];
	        paintingCs = [];
	        paintingLetGoPoints = [];
	    }
	    undoButton.drawIt();
	    fill(110, 35, 138);
	    text("Undo", 312, 375);
	    undoButton.checkIfPressed();
	    if (undoButton.pressed) {
	        if (paintingLetGoPoints.length !== 1) {
	            paintingXs.splice(paintingLetGoPoints[paintingLetGoPoints.length - 2] + 1, paintingLetGoPoints[paintingLetGoPoints.length - 1] - paintingLetGoPoints[paintingLetGoPoints.length - 2]);
	            paintingX2s.splice(paintingLetGoPoints[paintingLetGoPoints.length - 2] + 1, paintingLetGoPoints[paintingLetGoPoints.length - 1] - paintingLetGoPoints[paintingLetGoPoints.length - 2]);
	            paintingYs.splice(paintingLetGoPoints[paintingLetGoPoints.length - 2] + 1, paintingLetGoPoints[paintingLetGoPoints.length - 1] - paintingLetGoPoints[paintingLetGoPoints.length - 2]);
	            paintingY2s.splice(paintingLetGoPoints[paintingLetGoPoints.length - 2] + 1, paintingLetGoPoints[paintingLetGoPoints.length - 1] - paintingLetGoPoints[paintingLetGoPoints.length - 2]);
	            paintingCs.splice(paintingLetGoPoints[paintingLetGoPoints.length - 2] + 1, paintingLetGoPoints[paintingLetGoPoints.length - 1] - paintingLetGoPoints[paintingLetGoPoints.length - 2]);
	            paintingSs.splice(paintingLetGoPoints[paintingLetGoPoints.length - 2] + 1, paintingLetGoPoints[paintingLetGoPoints.length - 1] - paintingLetGoPoints[paintingLetGoPoints.length - 2]);
	        } else {
	            paintingXs.splice(0, paintingXs.length);
	            paintingYs.splice(0, paintingYs.length);
	            paintingX2s.splice(0, paintingX2s.length);
	            paintingY2s.splice(0, paintingY2s.length);
	            paintingCs.splice(0, paintingCs.length);
	            paintingSs.splice(0, paintingSs.length);
	        }
	        paintingLetGoPoints.splice(paintingLetGoPoints.length - 1, 1);
	    }
	    if (mouseIsPressed && mouseX > 85 && mouseX < 315 && mouseY > 100 && mouseY < 330 && paintingTimer > 2) {
	        paintingX2s.push(mouseX);
	        paintingY2s.push(mouseY);
	        paintingXs.push(pmouseX);
	        paintingYs.push(pmouseY);
	        paintingCs.push(selectedColor);
	        paintingSs.push(selectedSize);
	    }
	    if (mouseIsClicked && mouseX > 85 && mouseX < 315 && mouseY > 100 && mouseY < 330 && paintingTimer > 2) {
	        paintingLetGoPoints.push(paintingXs.length - 1);
	    }
	    fill(176, 52, 217);
	    textFont(fancy, 40);
	    text("Art Studio", 80, 65);
	    paintingTimer++;
	};

	var drawTrainingGroundsEntrance = function() {
	    if (!beenToTrainingGrounds) {
	        quests.push("swim");
	        popUpY.push(420);
	        popUpTypes.push("newQuest");
	    }
	    beenToTrainingGrounds = true;
	    background(149, 255, 110);
	    stroke(207, 132, 67);
	    strokeWeight(60);
	    noFill();
	    rect(210, -50, 230, 250, 9);
	    noStroke();
	    fill(207, 132, 67);
	    rect(260, 230, 57, 170);
	    rect(0, 85, 181, 57);
	    drawSignPost(330, 100, "Obstacle\n Course", 0);
	    drawSignPost(248, 12, "   The\nAcademy", 0);
	    drawSignPost(20, 17, " Battle\nPractice", 0);
	    drawSignPost(330, 332, "    Beach", 6);
	    fill(0, 0, 0);
	    textSize(17);
	    text("coins: " + coins, 311, 17);
	    trainingGroundsGuy.drawIt();
	    trainingGroundsGuy.checkIfSelected();
	    trainingGroundsGuy.talk();
	    character.drawIt();
	    character.moveIt();
	    character.limitLeft = 30;
	    character.limitTop = 60;
	    character.limitBottom = 370;
	    character.limitRight = 370;
	    if (character.x > 190 && character.x < 230 && character.y <= 60) {
	        state = "academy";
	        back = "trainingGrounds";
	    }
	    if (character.x > 260 && character.x < 317 && character.y >= 370) {
	        state = "beach";
	        back = "trainingGrounds";
	        character.x = 200;
	        character.y = 100;
	    }
	    if (character.x <= 30 && character.y > 80 && character.y < 120) {
	        state = "battlePractice";
	        back = "trainingGrounds";
	        character.x = 365;
	        character.y = 100;
	    }
	    for (var i=0;i<waterCanteens.length;i++) {
	        waterCanteens[i].checkIfDrank();
	        if (waterCanteens[i].drank) {
	            waterCanteens.splice(i, 1);
	        }
	    }
	    for (var i=0;i<apples.length;i++) {
	        apples[i].checkIfEaten();
	        if (apples[i].eaten) {
	            apples.splice(i, 1);
	        }
	    }
	     for (var i=0;i<trailMixes.length;i++) {
	        trailMixes[i].checkIfEaten();
	        if (trailMixes[i].eaten) {
	            trailMixes.splice(i, 1);
	        }
	    }
	};

	var drawBeach = function() {
	    background(245, 228, 186);
	    fill(0, 112, 153);
	    strokeWeight(10);
	    stroke(235, 243, 250);
	    ellipse(435, oceanY, 130, 80);
	    ellipse(305, oceanY, 130, 80);
	    ellipse(155, oceanY, 170, 70);
	    ellipse(20, oceanY, 100, 50);
	    noStroke();
	    rect(0, oceanY, 400, 400-oceanY);
	    if (oceanY > 350 || oceanY < 250) {
	        oceanYStep = -oceanYStep;
	    }
	    oceanY += oceanYStep;
	    drawSignPost(150, 20, "Entrance", 5);
	    drawSignPost(330, 50, " Archery", 7);
	    drawSignPost(20, 110, " Boating", 5);
	    fill(207, 132, 67);
	    rect(235, 0, 57, 70);
	    rect(380, 120, 20, 57);
	    swimmer.drawIt();
	    swimmer.checkIfSelected();
	    swimmer.talk();
	    character.drawIt();
	    character.moveIt();
	    character.limitLeft = 30;
	    character.limitTop = 60;
	    character.limitBottom = oceanY - 50;
	    character.limitRight = 370;
	    if (character.x <= 30 && character.y > 75 && character.y < 250) {
	        state = "docks";
	        back = "beach";
	        character.x = 350;
	        character.y = 240;
	    }
	    if (character.x >= 370 && character.y > 70 && character.y < 200) {
	        state = "archeryRange";
	        back = "beach";
	        character.x = 40;
	    }
	    if (character.x > 235 && character.x < 292 && character.y <= 60) {
	        back = "beach";
	        state = "trainingGrounds";
	        character.x = 260;
	        character.y = 270;
	    }
	    if (character.y >= oceanY) {
	        state = "swimmingMenu";
	        back = "beach";
	    }
	    for (var i=0;i<waterCanteens.length;i++) {
	        waterCanteens[i].checkIfDrank();
	        if (waterCanteens[i].drank) {
	            waterCanteens.splice(i, 1);
	        }
	    }
	    for (var i=0;i<apples.length;i++) {
	        apples[i].checkIfEaten();
	        if (apples[i].eaten) {
	            apples.splice(i, 1);
	        }
	    }
	     for (var i=0;i<trailMixes.length;i++) {
	        trailMixes[i].checkIfEaten();
	        if (trailMixes[i].eaten) {
	            trailMixes.splice(i, 1);
	        }
	    }
	    fill(0, 0, 0);
	    textSize(17);
	    text("coins: " + coins, 311, 17);
	};

	var drawSwimmingMenu = function() {
	    background(21, 163, 191);
	    fill(255, 255, 255, 150);
	    stroke(255, 255, 255, 220);
	    ellipse(100, 160, 120, 120);
	    ellipse(300, 190, 120, 120);
	    ellipse(180, 320, 120, 120);
	    ellipse(70, 280, 40, 40);
	    ellipse(340, 335, 50, 50);
	    ellipse(230, 120, 30, 30);
	    noStroke();
	    beachButton.checkIfPressed();
	    if (beachButton.pressed) {
	        state = "beach";
	        back = "swimmingMenu";
	        character.x = 265;
	        character.y = 70;
	    }
	    playSwimmingButton.checkIfPressed();
	    if (playSwimmingButton.pressed) {
	        state = "swimming";
	        back = "swimming";
	        character.x = 120;
	        character.y = 100;
	    }
	    howToPlaySwimmingButton.checkIfPressed();
	    if (howToPlaySwimmingButton.pressed) {
	        state = "swimmingHowToPlay";
	        back = "swimmingMenu";
	    }
	    fill(9, 102, 130);
	    textFont(fancy, 50);
	    text("Swimming", 60, 60);
	    textFont(fancy, 30);
	    text("Play", 60, 170);
	    text("Beach", 130, 330);
	    textFont(fancy, 20);
	    text("  How\nTo Play", 260, 180);
	};

	var drawSwimming = function() {
	    background(158, 249, 255);
	    fill(43, 164, 194);
	    rect(0, 100, 400, 300);
	    fill(245, 228, 186);
	    rect(0, 380, 400, 20);
	    for (var i = 0; i < sandXs.length; i++) {
	        ellipse(sandXs[i], 380, 60, 20);
	        sandXs[i] --;
	        if (sandXs[i] < -40) {
	            sandXs[i] = width;
	        }
	    }
	    if (keyIsPressed && keyCode === DOWN && swimmingPlayerY < 370) {
	        swimmingPlayerY += swimmingPlayerSpeed;
	    }
	    if (keyIsPressed && keyCode === UP && swimmingPlayerY > 100) {
	        swimmingPlayerY -= swimmingPlayerSpeed;
	    }
	    if (keyIsPressed && keyCode === RIGHT && swimmingPlayerX < 350) {
	        swimmingPlayerX += swimmingPlayerSpeed;
	        character.x += swimmingPlayerSpeed;
	    }
	    if (keyIsPressed && keyCode === LEFT && swimmingPlayerX > 50) {
	        swimmingPlayerX -= swimmingPlayerSpeed;
	        character.x -= swimmingPlayerSpeed;
	    }
	    if (swimmingPlayerY <= 100) {
	        character.drawIt();
	        air = 300;
	    } else {
	        air --;
	        //draw the character
	        fill(character.color);
	        rect(swimmingPlayerX, swimmingPlayerY, 30, 26);
	        if (hairColor === "light brown") {
	            fill(191, 128, 55);
	        } else if (hairColor === "dark brown") {
	            fill(120, 52, 0);
	        } else if (hairColor === "red") {
	            fill(217, 107, 60);
	        } else if (hairColor === "blonde") {
	            fill(235, 215, 148);
	        } else if (hairColor === "black") {
	            fill(0, 0, 0);
	        }
	        rect(swimmingPlayerX + 30, swimmingPlayerY, 26, 26);
	        if (skinColor === "light") {
	            fill(237, 205, 154);
	        }
	        if (skinColor === "dark") {
	            fill(133, 82, 28);
	        }
	        rect(swimmingPlayerX + 30, swimmingPlayerY + 12, 18, 14);
	        fill(196, 161, 63);
	        rect(swimmingPlayerX + 10, swimmingPlayerY, 8, 26);
	    }
	    //bubbles
	    fill(255, 255, 255, 150);
	    stroke(255, 255, 255, 220);
	    strokeWeight(4);
	    if (air >= 35) {
	        ellipse(20, 25, 20, 20);
	    }
	    if (air >= 70) {
	        ellipse(55, 25, 20, 20);
	    }
	    if (air >= 105) {
	        ellipse(90, 25, 20, 20);
	    }
	    if (air >= 140) {
	        ellipse(125, 25, 20, 20);
	    }
	    if (air >= 175) {
	        ellipse(160, 25, 20, 20);
	    }
	    if (air >= 210) {
	        ellipse(195, 25, 20, 20);
	    }
	    if (air >= 245) {
	        ellipse(230, 25, 20, 20);
	    }
	    if (air >= 280) {
	        ellipse(265, 25, 20, 20);
	    }
	    if (air <= 0) {
	        state = "beach";
	        swimmingLevel = 0;
	        air = 300;
	        swimmingPlayerY = 100;
	        swimmingLevel = 1;
	        swimmingPlayerX = 120;
	        swimmingPlayerSpeed = 2;
	        coins += swimmingScore/10;
	        if (sound) {
	            //playSound(getSound("rpg/coin-jingle"));
	        }
	        swimmingScore = 0;
	        swimmingTimer = 0;
	    }
	    noStroke();
	    if (timer % 50 === 0) {
	        bubbles.push(newBubble(420, random(140, 340)));
	    }
	    if (timer % 90 === 0) {
	        if (swimmingLevel === 1) {
	            shells.push(newShell(random(420, 440), random(370, 390), 1));
	        } else if (swimmingLevel === 2) {
	            shells.push(newShell(random(420, 440), random(370, 390), floor(random(1, 2.5))));
	        }
	    }
	    for (var i = 0; i < bubbles.length; i++) {
	        bubbles[i].drawIt();
	        bubbles[i].update();
	        if (bubbles[i].popped || bubbles[i].x < -50) {
	            bubbles.splice(i, 1);
	        }
	    }
	    for (var i = 0; i < shells.length; i++) {
	        shells[i].drawIt();
	        shells[i].update();
	        if (shells[i].gotton || shells[i].x < -50) {
	            shells.splice(i, 1);
	        }
	    }
	    fill(0, 0, 0);
	    textFont(cursive, 18);
	    text("Score: " + swimmingScore, 290, 30);
	    if (swimmingTimer > 1000) {
	        state = "continueSwimming";
	        swimmingTimer = 0;
	    }
	    swimmingTimer ++;
	    //debug(swimmingTimer);
	    if (swimmingTimer < 200 && swimmingLevel === 2) {
	        fill(255, 255, 255, 1000/swimmingTimer);
	        rect(0, 0, 400, 400);
	        fill(0, 0, 0);
	        text("          Level 2\n\n\nBlue shells make you faster", 120, 150);
	    }
	};

	var drawContinueSwimming = function() {
	    background(143, 229, 255);
	    fill(0, 166, 212);
	    textFont(fancy, 45);
	    text("Continue\nPlaying?", 90, 50);
	    textFont(fancy, 25);
	    text("Your Score: " + swimmingScore, 90, 170);
	    continueSwimming.drawIt();
	    quitSwimming.drawIt();
	    continueSwimming.checkIfPressed();
	    if (continueSwimming.pressed && swimmingLevel < 2) {
	        state = "swimming";
	        swimmingLevel ++;
	        swimmingPlayerY = 100;
	        swimmingPlayerX = 120;
	        character.x = 120;
	        character.y = 100;
	        swimmingPlayerSpeed = 2;
	        character.swimmingSkill += 10;
	    }
	    quitSwimming.checkIfPressed();
	    if (quitSwimming.pressed) {
	        state = "beach";
	        swimmingLevel = 0;
	        air = 300;
	        swimmingPlayerY = 100;
	        swimmingLevel = 1;
	        swimmingPlayerX = 120;
	        swimmingPlayerSpeed = 2;
	        coins += swimmingScore/10;
	        character.swimmingSkill += 10;
	        if (sound) {
	            //playSound(getSound("rpg/coin-jingle"));
	        }
	        swimmingScore = 0;
	        for (var i = 0; i < quests.length; i++) {
	            if (quests[i] === "swim") {
	                quests[i] = "sail";
	                popUpY.push(400);
	                popUpTypes.push("completedQuest");
	                popUpY.push(480);
	                popUpTypes.push("newQuest");
	                coins += 50;
	                character.xp += 50;
	            }
	        }
	    }
	    fill(106, 0, 255);
	    text("Continue", 125, 257);
	    text("Quit", 150, 357);
	};

	var drawSwimmingHowtoPlay = function() {
	    background(21, 163, 191);
	    fill(9, 102, 130);
	    textFont(fancy, 27);
	    text("Arrow keys to move. The bubbles at the top of the screen show your air. If you run out of air, you die and will be sent back to the beach. You will still get coins, though. Shells give you points. Blue shells make you faster.", 20, 15, 360, 370);
	};

	var drawDocks = function() {
	    background(227, 209, 170);
	    fill(179, 146, 97);
	    rect(0, 220, 400, 200);
	    fill(21, 148, 217);
	    quad(160, 275, 240, 275, 260, 400, 140, 400);
	    quad(-20, 275, 100, 275, 80, 400, -40, 400);
	    quad(420, 275, 300, 275, 320, 400, 440, 400);
	    fill(122, 209, 46);
	    ellipse(30, 100, 50, 25);
	    pushMatrix();
	    rotate(-25);
	    ellipse(-4, 90, 50, 25);
	    rotate(-40);
	    ellipse(-60, 40, 50, 25);
	    rotate(-60);
	    ellipse(-73, -48, 50, 25);
	    popMatrix();
	    triangle(12, 50, 50, 43, 25, 72);
	    triangle(50, 68, 75, 80, 40, 90);
	    triangle(50, 88, 70, 120, 32, 110);
	    fill(207, 132, 67);
	    rect(180, 0, 57, 70);
	    quad(-1, 235, 6, 110, 13, 110, 16, 235);
	    ellipse(5, 108, 20, 20);
	    ellipse(10, 100, 20, 20);
	    ellipse(17, 106, 20, 20);
	    drawSignPost(100, 20, "  Battle\nPractice", 2);
	    drawSignPost(330, 50, "  Beach", 6);
	    sailor.drawIt();
	    sailor.checkIfSelected();
	    sailor.talk();
	    character.drawIt();
	    character.moveIt();
	    character.limitLeft = 30;
	    character.limitTop = 60;
	    character.limitBottom = 250;
	    character.limitRight = 370;
	    if (character.x >= 370 && character.y > 100 && character.y < 175) {
	        state = "beach";
	        back = "docks";
	        character.x = 50;
	        character.y = 220;
	    }
	    if (character.x >= 175 && character.y <= 60 && character.x <= 237) {
	        state = "battlePractice";
	        back = "docks";
	        character.x = 200;
	        character.y = 365;
	    }
	    for (var i=0;i<waterCanteens.length;i++) {
	        waterCanteens[i].checkIfDrank();
	        if (waterCanteens[i].drank) {
	            waterCanteens.splice(i, 1);
	        }
	    }
	    for (var i=0;i<apples.length;i++) {
	        apples[i].checkIfEaten();
	        if (apples[i].eaten) {
	            apples.splice(i, 1);
	        }
	    }
	     for (var i=0;i<trailMixes.length;i++) {
	        trailMixes[i].checkIfEaten();
	        if (trailMixes[i].eaten) {
	            trailMixes.splice(i, 1);
	        }
	    }
	    fill(0, 0, 0);
	    textSize(17);
	    text("coins: " + coins, 320, 17);
	    text("Level 1", 15, 350);
	    text("Level 2", 173, 350);
	    text("Level 3", 330, 350);
	    level1Button.checkIfPressed();
	    level2Button.checkIfPressed();
	    level3Button.checkIfPressed();
	    if (level1Button.pressed) {
	        state = "sailingLevel1";
	    }
	    if (level2Button.pressed) {
	        state = "sailingLevel2";
	    }
	    if (level3Button.pressed) {
	        state = "sailingLevel3";
	    }
	};

	var drawSailingLevel1 = function() {
	    background(0, 166, 255);
	    fill(181, 129, 79);
	    rect(sailingX - 34, 360, 120, 40);
	    triangle(sailingX - 34, 360, sailingX + 86, 360, sailingX + 26, 320);
	    fill(character.color);
	    rect(sailingX, 330, 52, 60);
	    if (hairColor === "light brown") {
	        fill(191, 128, 55);
	    } else if (hairColor === "dark brown") {
	        fill(120, 52, 0);
	    } else if (hairColor === "red") {
	        fill(217, 107, 60);
	    } else if (hairColor === "blonde") {
	        fill(235, 215, 148);
	    } else if (hairColor === "black") {
	        fill(0, 0, 0);
	    }
	    rect(sailingX, 286, 52, 52);
	    if (sailingHealth > 200) {
	        fill(67, 212, 0);
	    } else {
	        fill(255, 0, 0);
	    }
	    rect(385, 5, 10, sailingHealth);
	    if (sailingHealth <= 0) {
	        coins += sailingScore;
	        state = "docks";
	        sailingHealth = 380;
	        sailingTimer = 0;
	        sailingScore = 0;
	    }
	    if (sailingTimer >= 1500) {
	        coins += sailingScore;
	        state = "docks";
	        sailingHealth = 380;
	        sailingTimer = 0;
	        sailingScore = 0;
	        for (var i = 0; i < quests.length; i++) {
	            if (quests[i] === "sail") {
	                quests[i] = "sail2";
	                popUpY.push(400);
	                popUpTypes.push("completedQuest");
	                popUpY.push(480);
	                popUpTypes.push("newQuest");
	                coins += 50;
	                character.xp += 50;
	            }
	        }
	    }
	    fill(0, 0, 0);
	    textSize(17);
	    text("Score: "+sailingScore, 295, 20);
	    if (keyIsPressed && keyCode === RIGHT && sailingX < 310) {
	        sailingX += 2;
	    }
	    if (keyIsPressed && keyCode === LEFT && sailingX > 38) {
	        sailingX -= 2;
	    }
	    if (timer % 200 === 0) {
	        rocks.push(newRock(random(50, 350), -50));
	    }
	    if (timer % 200 === 100) {
	        sailingCoins.push(newSailingCoin(random(50, 350), -50));
	    }
	    for (var i = 0; i < rocks.length; i++) {
	        rocks[i].drawIt();
	        rocks[i].update();
	        rocks[i].checkIfBumpedInto();
	        if (rocks[i].y > 450) {
	            rocks.splice(i, 1);
	        }
	    }
	    for (var i = 0; i < sailingCoins.length; i++) {
	        sailingCoins[i].drawIt();
	        sailingCoins[i].update();
	        sailingCoins[i].checkIfBumpedInto();
	        if (sailingCoins[i].y > 450) {
	            sailingCoins.splice(i, 1);
	        }
	    }
	    sailingTimer++;
	};

	var drawSailingLevel2 = function() {
	    background(0, 166, 255);
	    fill(181, 129, 79);
	    rect(sailingX - 34, 360, 120, 40);
	    triangle(sailingX - 34, 360, sailingX + 86, 360, sailingX + 26, 320);
	    fill(character.color);
	    rect(sailingX, 330, 52, 60);
	    if (hairColor === "light brown") {
	        fill(191, 128, 55);
	    } else if (hairColor === "dark brown") {
	        fill(120, 52, 0);
	    } else if (hairColor === "red") {
	        fill(217, 107, 60);
	    } else if (hairColor === "blonde") {
	        fill(235, 215, 148);
	    } else if (hairColor === "black") {
	        fill(0, 0, 0);
	    }
	    rect(sailingX, 286, 52, 52);
	    if (sailingHealth > 200) {
	        fill(67, 212, 0);
	    } else {
	        fill(255, 0, 0);
	    }
	    rect(385, 5, 10, sailingHealth);
	    if (sailingHealth <= 0) {
	        coins += sailingScore;
	        state = "docks";
	        sailingHealth = 380;
	        sailingTimer = 0;
	        sailingScore = 0;
	    }
	    if (sailingTimer >= 1500) {
	        coins += sailingScore;
	        state = "docks";
	        sailingHealth = 380;
	        sailingTimer = 0;
	        sailingScore = 0;
	        for (var i = 0; i < quests.length; i++) {
	            if (quests[i] === "sail2") {
	                quests[i] = "sail3";
	                popUpY.push(400);
	                popUpTypes.push("completedQuest");
	                popUpY.push(480);
	                popUpTypes.push("newQuest");
	                coins += 50;
	                character.xp += 50;
	            }
	        }
	    }
	    fill(0, 0, 0);
	    textSize(17);
	    text("Score: "+sailingScore, 295, 20);
	    if (keyIsPressed && keyCode === RIGHT && sailingX < 310) {
	        sailingX += 2;
	    }
	    if (keyIsPressed && keyCode === LEFT && sailingX > 38) {
	        sailingX -= 2;
	    }
	    if (timer % 150 === 0) {
	        rocks.push(newRock(random(50, 350), -50));
	    }
	    if (timer % 150 === 75) {
	        sailingCoins.push(newSailingCoin(random(50, 350), -50));
	    }
	    for (var i = 0; i < rocks.length; i++) {
	        rocks[i].drawIt();
	        rocks[i].update();
	        rocks[i].checkIfBumpedInto();
	        if (rocks[i].y > 450) {
	            rocks.splice(i, 1);
	        }
	    }
	    for (var i = 0; i < sailingCoins.length; i++) {
	        sailingCoins[i].drawIt();
	        sailingCoins[i].update();
	        sailingCoins[i].checkIfBumpedInto();
	        if (sailingCoins[i].y > 450) {
	            sailingCoins.splice(i, 1);
	        }
	    }
	    sailingTimer++;
	};

	var drawSailingLevel3 = function() {
	    background(0, 166, 255);
	    fill(181, 129, 79);
	    rect(sailingX - 34, 360, 120, 40);
	    triangle(sailingX - 34, 360, sailingX + 86, 360, sailingX + 26, 320);
	    fill(character.color);
	    rect(sailingX, 330, 52, 60);
	    if (hairColor === "light brown") {
	        fill(191, 128, 55);
	    } else if (hairColor === "dark brown") {
	        fill(120, 52, 0);
	    } else if (hairColor === "red") {
	        fill(217, 107, 60);
	    } else if (hairColor === "blonde") {
	        fill(235, 215, 148);
	    } else if (hairColor === "black") {
	        fill(0, 0, 0);
	    }
	    rect(sailingX, 286, 52, 52);
	    if (sailingHealth > 200) {
	        fill(67, 212, 0);
	    } else {
	        fill(255, 0, 0);
	    }
	    rect(385, 5, 10, sailingHealth);
	    if (sailingHealth <= 0) {
	        coins += sailingScore;
	        state = "docks";
	        sailingHealth = 380;
	        sailingTimer = 0;
	        sailingScore = 0;
	    }
	    if (sailingTimer >= 1500) {
	        coins += sailingScore;
	        state = "docks";
	        sailingHealth = 380;
	        sailingTimer = 0;
	        sailingScore = 0;
	        for (var i = 0; i < quests.length; i++) {
	            if (quests[i] === "sail3") {
	                quests[i] = "battlePractice";
	                popUpY.push(400);
	                popUpTypes.push("completedQuest");
	                popUpY.push(480);
	                popUpTypes.push("newQuest");
	                coins += 50;
	                character.xp += 50;
	            }
	        }
	    }
	    fill(0, 0, 0);
	    textSize(17);
	    text("Score: "+sailingScore, 295, 20);
	    if (keyIsPressed && keyCode === RIGHT && sailingX < 310) {
	        sailingX += 2;
	    }
	    if (keyIsPressed && keyCode === LEFT && sailingX > 38) {
	        sailingX -= 2;
	    }
	    if (timer % 100 === 0) {
	        rocks.push(newRock(random(50, 350), -50));
	    }
	    if (timer % 100 === 50) {
	        sailingCoins.push(newSailingCoin(random(50, 350), -50));
	    }
	    for (var i = 0; i < rocks.length; i++) {
	        rocks[i].drawIt();
	        rocks[i].update();
	        rocks[i].checkIfBumpedInto();
	        if (rocks[i].y > 450) {
	            rocks.splice(i, 1);
	        }
	    }
	    for (var i = 0; i < sailingCoins.length; i++) {
	        sailingCoins[i].drawIt();
	        sailingCoins[i].update();
	        sailingCoins[i].checkIfBumpedInto();
	        if (sailingCoins[i].y > 450) {
	            sailingCoins.splice(i, 1);
	        }
	    }
	    sailingTimer++;
	};

	var drawBattlePractice = function() {
	    background(118, 217, 78);
	    fill(207, 132, 67);
	    rect(180, 330, 57, 70);
	    rect(330, 85, 70, 57);
	    fill(156, 94, 40);
	    rect(0, 100, 250, 160);
	    fill(168, 110, 62);
	    rect(0, 50, 250, 50);
	    drawSignPost(275, 20, "Entrance", 5);
	    drawSignPost(260, 310, " Boating", 5);
	    drawSignPost(15, 210, "Training\n  Room", 1);
	    drawDoor(120, 175, 0.8);
	    practiceBattlingDoor.checkIfPressed();
	    if (practiceBattlingDoor.pressed || character.x > 95 && character.y > 140 && character.x < 155 && character.y < 260) {
	        character.x = 150;
	        character.y = 300;
	        state = "trainingRoom";
	        back = "battlePractice";
	    }
	    if (character.x >= 370 && character.y > 80 && character.y < 120) {
	        state = "trainingGrounds";
	        back = "battlePractice";
	        character.x = 35;
	        character.y = 70;
	    }
	    if (character.x >= 175 && character.y >= 370 && character.x <= 237) {
	        state = "docks";
	        back = "battlePractice";
	        character.x = 200;
	        character.y = 65;
	    }
	    character.drawIt();
	    character.moveIt();
	    if (character.y > 260) {
	        character.limitLeft = 30;
	    } else {
	        character.limitLeft = 270;
	    }
	    if (character.x > 270) {
	        character.limitTop = 60;
	    } else {
	        character.limitTop = 255;
	    }
	    character.limitBottom = 370;
	    character.limitRight = 370;
	    for (var i=0;i<waterCanteens.length;i++) {
	        waterCanteens[i].checkIfDrank();
	        if (waterCanteens[i].drank) {
	            waterCanteens.splice(i, 1);
	        }
	    }
	    for (var i=0;i<apples.length;i++) {
	        apples[i].checkIfEaten();
	        if (apples[i].eaten) {
	            apples.splice(i, 1);
	        }
	    }
	     for (var i=0;i<trailMixes.length;i++) {
	        trailMixes[i].checkIfEaten();
	        if (trailMixes[i].eaten) {
	            trailMixes.splice(i, 1);
	        }
	    }
	    fill(0, 0, 0);
	    textSize(17);
	    text("coins: " + coins, 320, 17);
	};

	var drawTrainingRoom = function() {
		background(120, 217, 255);
	    rect(0,0,width,height);
	    drawCloud(cloud1X, 70);
	    drawCloud(cloud2X, 145);
	    noFill();
	    stroke(105, 61, 0);
	    strokeWeight(10);
	    rect(60, 50, 280, 140);
	    noStroke();
	    fill(168, 110, 62);
	    rect(0, 0, 400, 45);
	    rect(0, 45, 55, 150);
	    rect(345, 45, 55, 150);
	    rect(0, 195, 400, 210);
	    fill(150, 92, 30, 100);
	    rect(0, 275, 400, 150);
	    cloud1X += 0.7;
	    cloud2X += 0.6;
	    if (cloud1X > 400) {
	        cloud1X = 0;
	    }
	    if (cloud2X > 400) {
	        cloud2X = 0;
	    }
	    if (currentDummy.beaten) {
	        battlingLevel++;
	        currentDummy = practiceDummy(random(50, 350), 300, battlingLevel, 100);
	        for (var i = 0; i < quests.length; i++) {
	            if (quests[i] === "battlePractice") {
	                quests[i] = "battlePractice2";
	                popUpY.push(400);
	                popUpTypes.push("completedQuest");
	                popUpY.push(480);
	                popUpTypes.push("newQuest");
	                coins += 50;
	                character.xp += 50;
	            }
	        }
	        if (battlingLevel === 5) {
	            for (var i = 0; i < quests.length; i++) {
	                if (quests[i] === "battlePractice2") {
	                    quests.splice(i, 1);
	                    popUpTypes.push("completedQuest");
	                    coins += 50;
	                    character.xp += 50;
	                }
	            }
	        }
	    }
	    if (hPressed && character.knowLevel1Spell) {
	        if (character.element === "fire") {
	            castingSpark = true;
	        }
	        if (character.element === "earth") {
	            castingPebble = true;
	        }
	        if (character.element === "water") {
	            castingDroplet = true;
	        }
	        if (character.element === "air") {
	            castingBreeze = true;
	        }
	        if (character.element === "light") {
	            castingShine = true;
	        }
	        if (character.element === "darkness") {
	            castingShadow = true;
	        }
	        if (character.element === "nature") {
	            castingSeed = true;
	        }
	        spellDiameter = 20;
	    }
	    if (castingSpark) {
	        drawSpark();
	    }
	    if (castingPebble) {
	        drawPebble();
	    }
	    if (castingDroplet) {
	        drawDroplet();
	    }
	    if (castingBreeze) {
	        drawBreeze();
	    }
	    if (castingShine) {
	        drawShine();
	    }
	    if (castingShadow) {
	        drawShadow();
	    }
	    if (castingSeed) {
	        drawSeed();
	    }
	    currentDummy.drawIt();
	    currentDummy.moveIt();
	    currentDummy.battle();
	    character.drawIt();
	    character.moveIt();
	    character.limitLeft = 30;
	    character.limitTop = 270;
	    character.limitBottom = 370;
	    character.limitRight = 370;
	};

	var drawArcheryRange = function() {
	    background(75, 196, 51);
	    fill(207, 132, 67);
	    rect(-20, 120, 83, 57);
	    drawSignPost(10, 50, "  Beach", 7);
	    drawTargetRange(130, 50, 0.7);
	    drawTargetRange(210, 50, 0.7);
	    drawTargetRange(290, 50, 0.7);
	    character.drawIt();
	    character.moveIt();
	    character.limitLeft = 30;
	    character.limitTop = 95;
	    character.limitBottom = 370;
	    character.limitRight = 370;
	    archer.drawIt();
	    archer.checkIfSelected();
	    archer.talk();
	    archeryMenuButton.checkIfPressed();
	    fill(0, 0, 0);
	    textSize(17);
	    text("coins: " + coins, 320, 17);
	    if (character.x <= 30 && character.y > 100 && character.y < 175) {
	        state = "beach";
	        back = "archeryRange";
	        character.x = 350;
	        character.y = 145;
	    }
	    if (archeryMenuButton.pressed) {
	        state = "archeryMenu";
	        back = "archeryRange";
	    }
	};

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
	    text("Back", 60, 155);
	    textSize(30);
	    text("Play", 159, 306);
	    textSize(24);
	    text("Help", 291, 190);
	    playArcheryButton.checkIfPressed();
	    backArcheryButton.checkIfPressed();
	    helpArcheryButton.checkIfPressed();
	    if (backArcheryButton.pressed) {
	        state = "archeryRange";
	    }
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
	                coins += floor(archeryScore/2);
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
	    text("You shot " + bullseyes + " bullseyes.", 30, 142);
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
	        state = "archeryRange";
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

	//menu
	var drawMusicMenu = function() {
	    background(0, 0, 0);
	    fill(255, 255, 255);
	    textSize(85);
	    text("  Play \n Music", 69, 88);
	    textSize(38);
	    text("Play", 164, 261);
	    text("Back", 36, 352);
	    text("Help", 282, 351);
	    noFill();
	    stroke(255, 255, 255);
	    strokeWeight(7);
	    ellipse(200, 250, 100, 100);
	    ellipse(320, 340, 100, 100);
	    ellipse(80, 340, 100, 100);
	    stroke(23, 224, 235);
	    strokeWeight(6);
	    line(47, 210, 57, 260);
	    stroke(247, 108, 171);
	    line(319, 34, 307, 80);
	    line(381, 47, 372, 95);
	    strokeWeight(9);
	    line(319, 34, 381, 47);
	    noStroke();
	    fill(23, 224, 235);
	    pushMatrix();
	    rotate(-20);
	    ellipse(-41, 263, 18, 12);
	    popMatrix();
	    fill(247, 108, 171);
	    pushMatrix();
	    rotate(15);
	    ellipse(310, 0, 18, 12);
	    ellipse(378, -2, 18, 12);
	    popMatrix();
	    if (mouseIsClicked && sq(mouseX-200) + sq(mouseY-250) < 2500) {
	        state = "playingMusic";
	        onAButton = true;
	        startTime = timer;
	    }
	    if (sq(mouseX-200) + sq(mouseY-250) < 2500) {
	        onAButton = true;
	    }
	    if (mouseIsClicked && sq(mouseX-320) + sq(mouseY-340) < 2500) {
	        state = "musicHelp";
	    }
	    if (sq(mouseX-320) + sq(mouseY-340) < 2500) {
	        onAButton = true;
	    }
	    if (mouseIsClicked && sq(mouseX-80) + sq(mouseY-340) < 2500) {
	        state = "classrooms";
	    }
	    if (sq(mouseX-80) + sq(mouseY-340) < 2500) {
	        onAButton = true;
	    }
	};

	var drawMusicHelp = function() {
	    background(0, 0, 0);
	    fill(255, 255, 255);
	    textSize(25);
	    textAlign(CENTER);
	    text("Each round you must memorize and enter a musical pattern using your arrow keys. The notes (from low to high) are made with the left arrow key, the right arrow key, the up arrow key, and the down arrow key. When you press the wrong key, you loose a heart. Loose all your hearts and it's game over!\nGood luck!", 10, 25, 390, 300);
	    textAlign(LEFT);
	    musicHelpBack.drawIt();
	    fill(255, 255, 255);
	    textSize(26);
	    text("Back", 21, 358);
	    musicHelpBack.checkIfPressed();
	    if (musicHelpBack.pressed) {
	        state = "musicMenu";
	    }
	};

	//game
	var drawPlayingMusic = function() {
	    background(0, 204, 255);
	    fill(255, 255, 255);
	    rect(0, 300, 410, 120);
	    noStroke();
	    
	    if (playingMusic) {
	        if (keyIsPressed && (keyCode === RIGHT || keyCode === LEFT || keyCode === UP || keyCode === DOWN)) {
	            currentDirection = keyCode;
	            if (keyCode === RIGHT) {
	                //playSound(getSound("retro/laser1"));
	            } else if (keyCode === LEFT) {
	                //playSound(getSound("retro/laser2"));
	            } else if (keyCode === DOWN) {
	                //playSound(getSound("retro/laser3"));
	            } else if (keyCode === UP) {
	                //playSound(getSound("retro/laser4"));
	            }
	        }
	        if (keyIsReleased && (keyCode === RIGHT || keyCode === LEFT || keyCode === UP || keyCode === DOWN)) {
	            if (currentDirection !== musicLevels[musicLevel][n]) {
	                wrong++;
	            } else if (n <musicLevels[musicLevel].length-1) {
	                n++;
	            } else {
	                n = 0;
	                musicLevel++;
	                currentDirection = 0;
	                if (musicLevel >musicLevels.length-1) {
	                    state = "winMusic";
	                    musicLevel = 0;
	                    for (var i = 0; i < 8; i++) {
	                        musicArrows.push(newArrow(random(20, 380), random(-60, -20), random(0.5, 1), random(0.5, 2), floor(random(1, 4.99))));
	                    }
	                }
	                playingMusic = false;
	                startTime = timer;
	            }
	        }
	        if (currentDirection === RIGHT) {
	            drawRIGHT(169, 145, 1);
	            quad(123, 300, 109, 400, 156, 400, 163, 300);
	        } else if (currentDirection === LEFT) {
	            drawLEFT(169, 145, 1);
	            quad(123, 300, 109, 400, 64, 400, 81, 300);
	        } else if (currentDirection === DOWN) {
	            drawDOWN(185, 145, 1);
	            quad(201, 300, 201, 400, 246, 400, 239, 300);
	        } else if (currentDirection === UP) {
	            drawUP(185, 145, 1);
	            quad(201, 300, 201, 400, 156, 400, 163, 300);
	        }
	        if (wrong === 3) {
	            state = "musicGameOver";
	            musicCoins = musicCoinsGiven[musicLevel];
	            musicLevel = 0;
	            playingMusic = false;
	            startTime = timer;
	        }
	    } else {
	        if (timer-startTime > 20) {
	            if (musicLevels[musicLevel][n] === RIGHT) {
	                drawRIGHT(169, 145, 1);
	                quad(123, 300, 109, 400, 156, 400, 163, 300);
	                //playSound(getSound("retro/laser1"));
	            } else if (musicLevels[musicLevel][n] === LEFT) {
	                drawLEFT(175, 145, 1);
	                quad(123, 300, 109, 400, 64, 400, 81, 300);
	                //playSound(getSound("retro/laser2"));
	            } else if (musicLevels[musicLevel][n] === DOWN) {
	                drawDOWN(185, 145, 1);
	                quad(201, 300, 201, 400, 245, 400, 238, 301);
	                //playSound(getSound("retro/laser3"));
	            } else if (musicLevels[musicLevel][n] === UP) {
	                drawUP(185, 145, 1);
	                quad(201, 300, 201, 400, 156, 400, 163, 300);
	                //playSound(getSound("retro/laser4"));
	            }
	        }
	        if (timer-startTime === 100) {
	            if (n <musicLevels[musicLevel].length-1) {
	                n++;
	                startTime = timer;
	            } else {
	                playingMusic = true;
	                n = 0;
	            }
	        }
	    }
	    
	    noStroke();
	    fill(0, 0, 0);
	    quad(52, 300, 42.1, 350, 21.8, 350, 34, 300);
	    quad(172, 300, 168.5, 350, 148.5, 350, 154, 300);
	    quad(135, 300, 128.5, 350, 108.0, 350, 116, 300);
	    quad(228, 300, 231.5, 350, 251.5, 350, 246, 300);
	    quad(268, 300, 273.0, 350, 295.0, 350, 286, 300);
	    quad(308, 300, 316.1, 350, 338, 350, 326, 300);
	    
	    stroke(0, 0, 0);
	    strokeWeight(1.5);
	    line(200, 301, 200, 400);
	    line(162, 301, 155, 400);
	    line(238, 301, 245, 400);
	    line(122, 301, 110, 400);
	    line(278, 301, 290, 400);
	    line(82, 301, 65, 400);
	    line(318, 301, 335, 400);
	    line(42, 301, 20, 400);
	    line(358, 301, 380, 400);
	    line(2, 301, -22, 400);
	    line(398, 301, 425, 400);
	    
	    for (var i = 0; i < 3-wrong; i++) {
	        drawHeart(275+50*i, 45, 1);
	    }
	};

	//game over
	var drawMusicGameOver = function() {
	    background(0, 0, 0);
	    musicGameOverBack.drawIt();
	    fill(255, 255, 255);
	    textSize(40);
	    text("Game Over", 100, 100);
	    text("Back", 155, 353);
	    textSize(20);
	    text("You earned "+musicCoins+" coins!", 110, 200);
	    musicGameOverBack.checkIfPressed();
	    if (musicGameOverBack.pressed) {
	        coins += musicCoins;
	        musicCoins = 0;
	        state = "musicMenu";
	        wrong = 0;
	    }
	};

	var drawWinMusic = function() {
	    background(255, 255, 255);
	    if (timer % 15 === 0) {
	        musicArrows.push(newArrow(random(20, 380), random(-160, -20), random(0.5, 1), random(0.5, 2), floor(random(1, 4.99))));
	    }
	    for (var i = 0; i < musicArrows.length; i++) {
	        musicArrows[i].drawIt();
	        musicArrows[i].moveIt();
	        if (musicArrows[i].y > 450) {
	            musicArrows.splice(i, 1);
	        }
	    }
	    fill(0, 0, 0);
	    textSize(40);
	    text("Congratulations!\n     You won!", 50, 80);
	    musicWonBack.drawIt();
	    fill(0, 0, 0);
	    text("Back", 157, 313);
	    musicWonBack.checkIfPressed();
	    if (musicWonBack.pressed) {
	        state = "musicMenu";
	        wrong = 0;
	    }
	};

	
	p.draw = function() {
		keyCode = p.keyCode;
		mouseX = p.mouseX;
		mouseY = p.mouseY;
		pmouseX = p.pmouseX;
		pmouseY = p.pmouseY;
		
		//Put code here
		noStroke();
	    if (state === "rainbowGames") {
	        drawRainbowGames();
	    }
	    if (state === "menu") {
	        drawMenu();
	    }
	    if (state === "chooseElement") {
	        drawChooseElement();
	    }
	    if (state === "academy") {
	        drawAcademy();
	    }
	    if (state === "cafeteria") {
	        drawCafeteria();
	    }
	    if (state === "nurseOffice") {
	        drawNurseOffice();
	    }
	    if (state === "cafeteriaShop") {
	        drawCafeteriaShop();
	    }
	    if (state === "classrooms") {
	        drawClassrooms();
	    }
	    if (state === "learnMagic") {
	        drawLearnMagic();
	    }
	    if (state === "makeBracletsMenu") {
	        drawMakeBracletsMenu();
	    }
	    if (state === "playingBracletMaking") {
	        drawPlayMakeBraclets();
	    }
	    if (state === "winBracelets") {
	        drawWinBracelets();
	    }
	    if (state === "gameOverBracelets") {
	        drawGameOverBracelets();
	    }
	    if (state === "howToPlayBraceletMaking") {
	        drawHowToPlayBraceletMaking();
	    }
	    if (state === "painting") {
	        drawPainting();
	    }
	    if (state === "trainingGrounds") {
	        drawTrainingGroundsEntrance();
	    }
	    if (state === "beach") {
	        drawBeach();
	    }
	    if (state === "swimmingMenu") {
	        drawSwimmingMenu();
	    }
	    if (state === "swimming") {
	        drawSwimming();
	    }
	    if (state === "continueSwimming") {
	        drawContinueSwimming();
	    }
	    if (state === "docks") {
	        drawDocks();
	    }
	    if (state === "sailingLevel1") {
	        drawSailingLevel1();
	    }
	    if (state === "sailingLevel2") {
	        drawSailingLevel2();
	    }
	    if (state === "sailingLevel3") {
	        drawSailingLevel3();
	    }
	    if (state === "battlePractice") {
	        drawBattlePractice();
	    }
	    if (state === "trainingRoom") {
	        drawTrainingRoom();
	    }
	    if (state === "swimmingHowToPlay") {
	        drawSwimmingHowtoPlay();
	    }
	    if (state === "archeryRange") {
	        drawArcheryRange();
	    }
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
	    if (state === "musicMenu") {
	        drawMusicMenu();
	    }
	    if (state === "playingMusic") {
	        drawPlayingMusic();
	    }
	    if (state === "musicGameOver") {
	        drawMusicGameOver();
	    }
	    if (state === "winMusic") {
	        drawWinMusic();
	    }
	    if (state === "musicHelp") {
	        drawMusicHelp();
	    }
	    for (var i = hoveringCoins.length-1; i >= 0; i--) {
	        if (hoveringCoins[i].state === state) {
	            hoveringCoins[i].drawIt();
	            hoveringCoins[i].checkIfGotton();
	        } else {
	            //hoveringCoins[i].update();
	            if (hoveringCoins[i].timer > 5000) {
	                //hoveringCoins.splice(i, 1);
	            }
	        }
	    }
	    if (questsUp) {
	        drawQuests();
	    }
	    if (inventoryUp) {
	        drawInventory();
	    }
	    if (keyIsPressed && p.key == 98 && back) {
	        if (state === "trainingRoom") {
	            coins += battlingScore;
	            battlingScore = 0;
	            battlingLevel = 1;
	            currentDummy = practiceDummy(200, 300, 1, 100);
	        }
	        if (state === "painting") {
	            coins += floor(paintingTimer/500);
	            paintingTimer = 0;
	            selectedColor = color(0, 0, 0);
	            paintingXs = [];
	            paintingYs = [];
	            paintingX2s = [];
	            paintingY2s = [];
	            paintingSs = [];
	            paintingCs = [];
	            paintingLetGoPoints = [];
	        }
	        state = back;
	    }
	    if (!inventoryUp && !questsUp && state !== "academy" && state !== "makeBracletsMenu" && state !== "playingBracletMaking" && state !== "winBracelets" && state !== "gameOverBracelets") {
	        for (var i=0;i<popUpY.length;i++) {
	        textFont("cursive", 10);
	        popUpY[i] --;
	        //debug("look at me go!");
	        fill(255, 255, 255, popUpY[i] - 70);
	        rect(120, popUpY[i], 160, 50);
	        if (popUpTypes[i] === "+50nourishment") {
	            fill(0, 0, 0, popUpY[i] - 70);
	            textSize(20);
	            text("+50 nourishment", 120, popUpY[i] + 10, 160, 50);
	        }
	        if (popUpTypes[i] === "+30nourishment") {
	            fill(0, 0, 0, popUpY[i] - 70);
	            textSize(20);
	            text("+30 nourishment", 120, popUpY[i] + 10, 160, 50);
	        }
	        if (popUpTypes[i] === "+15nourishment") {
	            fill(0, 0, 0, popUpY[i] - 70);
	            textSize(20);
	            text("+15 nourishment", 120, popUpY[i] + 10, 160, 50);
	        }
	        if (popUpTypes[i] === "+50health") {
	            fill(0, 0, 0, popUpY[i] - 70);
	            textSize(20);
	            text("+50 health", 120, popUpY[i] + 10, 160, 50);
	        }
	        if (popUpTypes[i] === "+10strength") {
	            fill(0, 0, 0, popUpY[i] - 70);
	            textSize(20);
	            text("+10 strength", 120, popUpY[i] + 10, 160, 50);
	        }
	        if (popUpTypes[i] === "+20strength") {
	            fill(0, 0, 0, popUpY[i] - 70);
	            textSize(20);
	            text("+20 strength", 120, popUpY[i] + 10, 160, 50);
	        }
	        if (popUpTypes[i] === "boughtCanteen") {
	            rect(120, popUpY[i], 160, 60);
	            fill(0, 0, 0, popUpY[i] - 70);
	            textSize(15);
	            text("You bought a water canteen. Press w to drink it.", 120, popUpY[i] + 7, 160, 60);
	        }
	        if (popUpTypes[i] === "boughtApple") {
	            rect(120, popUpY[i], 160, 60);
	            fill(0, 0, 0, popUpY[i] - 70);
	            textSize(15);
	            text("You bought an apple. Press a to eat it.", 120, popUpY[i] + 7, 160, 60);
	        }
	        if (popUpTypes[i] === "boughtTrailMix") {
	            rect(120, popUpY[i], 160, 60);
	            fill(0, 0, 0, popUpY[i] - 70);
	            textSize(15);
	            text("You bought a bag of trail mix. Press t to eat it.", 120, popUpY[i] + 7, 160, 60);
	        }
	        if (popUpTypes[i] === "learnedLevel1Spell") {
	            rect(120, popUpY[i], 160, 60);
	            fill(0, 0, 0, popUpY[i] - 70);
	            textSize(15);
	            text("You learned a new spell. Press h to use it.", 120, popUpY[i] + 7, 160, 60);
	        }
	        if (popUpTypes[i] === "learnedLevel3Spell") {
	            rect(120, popUpY[i], 160, 60);
	            fill(0, 0, 0, popUpY[i] - 70);
	            textSize(15);
	            text("You learned a new spell. Press j to use it.", 120, popUpY[i] + 7, 160, 60);
	        }
	        if (popUpTypes[i] === "learnedLevel5Spell") {
	            rect(120, popUpY[i], 160, 60);
	            fill(0, 0, 0, popUpY[i] - 70);
	            textSize(15);
	            text("You learned a new spell. Press k to use it.", 120, popUpY[i] + 7, 160, 60);
	        }
	        if (popUpTypes[i] === "learnedLevel7Spell") {
	            rect(120, popUpY[i], 160, 60);
	            fill(0, 0, 0, popUpY[i] - 70);
	            textSize(15);
	            text("You learned a new spell. Press l to use it.", 120, popUpY[i] + 7, 160, 60);
	        }
	        if (popUpTypes[i] === "can'tAfford") {
	            rect(120, popUpY[i], 160, 75);
	            fill(0, 0, 0, popUpY[i] - 70);
	            textSize(15);
	            text("You cannot afford this item. Play more games and complete more Quests.", 120, popUpY[i] + 7, 160, 75);
	        }
	        if (popUpTypes[i] === "newQuest") {
	            rect(120, popUpY[i], 160, 50);
	            fill(0, 0, 0, popUpY[i] - 70);
	            textSize(15);
	            text("New Quest!", 120, popUpY[i] + 7, 160, 50);
	        }
	        if (popUpTypes[i] === "completedQuest") {
	            rect(120, popUpY[i], 160, 50);
	            fill(0, 0, 0, popUpY[i] - 70);
	            textSize(15);
	            text("You completed a Quest!", 120, popUpY[i] + 7, 160, 50);
	        }
	        if (popUpTypes[i] === "died") {
	            fill(0, 0, 0, popUpY[i] - 70);
	            textSize(20);
	            text("You died.", 120, popUpY[i] + 7, 160, 50);
	        }
	        if (popUpTypes[i] === "levelup") {
	            fill(0, 0, 0, popUpY[i] - 70);
	            textSize(15);
	            text("You've leveled up. Now you're level "+character.level+"!", 120, popUpY[i] + 7, 160, 50);
	        }
	        if (popUpY[i] < -80) {
	            popUpY.splice(i, 1);
	            popUpTypes.splice(i, 1);
	        }
	    }
	    }
	    if (onAButton) {
	        if (staffCursor && state !== "playingBracletMaking" && state !== "playArchery") {
	            drawStaffSparkling(mouseX, mouseY - 50);
	        } else if (state !== "playingBracletMaking" && state !== "playArchery") {
	            cursor(HAND);
	        } else {
	            cursor("none");
	        }
	    } else {
	        if (staffCursor && state !== "playingBracletMaking" && state !== "playArchery") {
	            drawStaff(mouseX, mouseY - 50);
	        } else if (state !== "playingBracletMaking" && state !== "playArchery") {
	            cursor(ARROW);
	        } else {
	            cursor("none");
	        }
	    }
	    onAButton = false;
	    if (staffCursor) {
	        cursor("none");
	    }
	    if (sPressed) {
	        println("character.element = " + character.element + ";");
	    }
	    wPressed = false;
	    aPressed = false;
	    tPressed = false;
	    sPressed = false;
	    hPressed = false;
	    if (character.xp > xp[character.level]) {
	        character.level++;
	        popUpY.push(550);
	        popUpTypes.push("levelup");
	    }
	    if (timer % 1000 === 0) {
	        myDay ++;
	    }
	    if (state !== "menu" && state !== "chooseElement") {
	        character.nourishment -= 0.01;
	    }
	    if (character.nourishment < 0) {
	        character.alive = false;
	    }
	    //debug(character.nourishment);
	    if (!character.alive) {
	        //waterCanteens = [];
	        state = "nurseOffice";
	        character.x = 200;
	        character.y = 350;
	        popUpY.push(400);
	        popUpTypes.push("died");
	        character.died = false;
	    }
	    if (eatingTimer > 70) {
	        eating = false;
	        eatingTimer = 0;
	    }
	    if (eating) {
	        eatingTimer++;
	    }
	    if (state !== "menu" && state !== "chooseElemenent" && state !== "trainingGrounds" && timer % 5000 === 0) {
	        hoveringCoins.push(newCoin(random(60, 340), random(60, 340), "trainingGrounds"));
	    }
	    if (state !== "menu" && state !== "chooseElemenent" && state !== "cafeteria" && timer % 5000 === 500) {
	        hoveringCoins.push(newCoin(random(150, 340), random(250, 340), "cafeteria"));
	    }
	    if (state !== "menu" && state !== "chooseElemenent" && state !== "nurseOffice" && timer % 5000 === 1000) {
	        hoveringCoins.push(newCoin(random(60, 340), random(250, 340), "nurseOffice"));
	    }
	    if (state !== "menu" && state !== "chooseElemenent" && state !== "cafeteriaShop" && timer % 5000 === 1500) {
	        hoveringCoins.push(newCoin(random(60, 340), random(250, 340), "nurseOffice"));
	    }
	    if (state !== "menu" && state !== "chooseElemenent" && state !== "classrooms" && timer % 5000 === 2000) {
	        hoveringCoins.push(newCoin(random(60, 340), random(250, 340), "classrooms"));
	    }
	    if (state !== "menu" && state !== "chooseElemenent" && state !== "learnMagic" && timer % 5000 === 2500) {
	        hoveringCoins.push(newCoin(random(60, 250), random(250, 340), "learnMagic"));
	    }
	    if (state !== "menu" && state !== "chooseElemenent" && state !== "beach" && timer % 5000 === 3000) {
	        hoveringCoins.push(newCoin(random(60, 340), random(60, 220), "beach"));
	    }
	    if (state !== "menu" && state !== "chooseElemenent" && state !== "docks" && timer % 5000 === 3500) {
	        hoveringCoins.push(newCoin(random(60, 340), random(60, 200), "docks"));
	    }
	    if (state !== "menu" && state !== "chooseElemenent" && state !== "battlePractice" && timer % 5000 === 4000) {
	        hoveringCoins.push(newCoin(random(60, 340), random(60, 200), "battlePractice"));
	    }
	    
	    if (character.xp >= 250) {
	        character.level++;
	        character.xp = 0;
	    }
	    timer++;
		
		keyIsReleased = false;
		mouseIsClicked = false;
	};  

	
}
