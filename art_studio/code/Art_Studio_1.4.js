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
	var floor = function(number){
		return Math.floor(number);
	};
	var ceil = function(number){
		return Math.ceil(number);
	};
	var sq = function(number){
		return p.sq(number);
	};
	var sqrt = function(number){
		return p.sqrt(number);
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
	
	
	/*

	Ideas for Future Updates:
	*   pencil
	*   eraser
	*   mixing paint
	*   save paintings in a gallery
	*   colored pencils
	*   partialy transparent paint

	If you have an idea, comment in the tips and thanks!

	*/

	/*
	Version History:

	1.2 Pencil and eraser
	*   a pencil
	*   right click to use the eraser side of the pencil

	1.1 A way to "paintbucket"
	*   right click to cover the whole canvas
	*   paintbrush on top of undo button

	1.0 Released!
	*   paintbrushes
	*   palatte
	*   canvas
	*   painting
	*   undo

	*/
	var selectedPaintbrush = 0;
	var selectedColor = color(199, 46, 46);
	var paintingXs = [];
	var paintingYs = [];
	var paintingX2s = [];
	var paintingY2s = [];
	var paintingSs = [];
	var paintingCs = [];
	var paintingTs = [];
	var paintingLetGoPoints = [];
	var startingOut = 1;
	var developer = false;
	var erasing = false;
	var cp = false;//currently painting
	var startIndex = 0;
	
	var savedColors = [color(255,255,255),color(255,255,255),color(255,255,255),color(255,255,255)];
	var freeSlots = [1,1,1,1];//1=free, 0=taken
	var currentR = red(selectedColor);
	//currentR = p.red(selectedColor);
	var currentG = green(selectedColor);
	var currentB = blue(selectedColor);
	var rSlider = currentR*0.6667+115;
	var gSlider = currentG*0.6667+115;
	var bSlider = currentB*0.6667+115;
	var sliding = false;
	var saved = false;
	var savedColorOpen = false;
	var colorPickerOpen = false;
	var transparency = 255;

	var myFont = createFont("MV Boli", 25);
	
	var drawSave = function(x,y,s,bc) {
		pushMatrix();
		translate(x,y);
		//fill(193, 200, 212);
		fill(215, 215, 215);
		rect(0,0,84*s,100*s,10*s);
		//fill(216, 223, 235);
		fill(229,229,229);
		//stroke(140, 150, 168);
		stroke(143,143,143);
		strokeWeight(4*s);
		rect(26*s,-4*s,32*s,26*s,6*s);
		line(50*s,6*s,50*s,14*s);
		rect(16*s,52*s,51*s,54*s,8*s);
		line(24*s,63*s,60*s,63*s);
		line(24*s,74*s,60*s,74*s);
		line(24*s,87*s,60*s,87*s);
		noStroke();
		fill(bc);
		triangle(65*s,0,84*s,19*s,84*s,0*s);
		rect(0,-8*s,84*s,8*s);
		rect(0,100*s,84*s,12*s);
		popMatrix();
	};
	
	var drawTrash = function(x,y,s) {
		pushMatrix();
		translate(x,y);
		fill(70,70,70);
		quad(0,0,80*s,0,70*s,90*s,10*s,90*s);
		arc(40*s,0,95*s,40*s,180,360);
		stroke(70,70,70);
		noFill();
		strokeWeight(5*s);
		ellipse(40*s,-20*s,17*s,12*s);
		stroke(30,30,30);
		line(12*s,10*s,18*s,70*s);
		line(68*s,10*s,62*s,70*s);
		line(28*s,10*s,32*s,71*s);
		line(52*s,10*s,48*s,71*s);
		noStroke();
		popMatrix();
	};
	
	var drawPaintTube = function(x,y,s) {
		pushMatrix();
		translate(x,y);
		fill(235,235,235);
		quad(0,0,70*s,0,100*s,200*s,-30*s,200*s);
		rect(-30*s,200*s,130*s,20*s);
		ellipse(35*s,0,70*s,25*s);
		fill(20,20,20);
		rect(20*s,-20*s,30*s,9*s);
		rect(10*s,-32*s,50*s,14*s);
		fill(80,40,255);
		quad(-5*s,30*s,75*s,30*s,84*s,90*s,-14*s,90*s);
		popMatrix();
	}
	
	var drawColorPicker = function(x,y,s) {
		pushMatrix();
		translate(x,y);
		fill(255,255,255);
		stroke(190,190,190);
		strokeWeight(3*s);
		rect(0,0,320*s,160*s);
		noStroke();
		
		//Preview
		fill(currentR,currentG,currentB);
		rect(10*s,10*s,90*s,125*s);
		fill(100,100,100);
		textSize(15*s);
		text("Current Color", 9.5*s,152*s);
		
		//Sliders
		stroke(190,190,190);
		strokeWeight(3*s);
		//r slider
		line(115*s,12*s,115*s,30*s);
		line(285*s,12*s,285*s,30*s);
		line(115*s,21*s,285*s,21*s);
		//g slider
		line(115*s,47*s,115*s,65*s);
		line(285*s,47*s,285*s,65*s);
		line(115*s,56*s,285*s,56*s);
		//b slider
		line(115*s,82*s,115*s,100*s);
		line(285*s,82*s,285*s,100*s);
		line(115*s,91*s,285*s,91*s);
		noStroke();
		
		
		fill(100,100,100);
		//r slider (cont)
		rect((rSlider-4)*s,11*s,8*s,20*s);
		//g slider (cont)
		rect((gSlider-4)*s,46*s,8*s,20*s);
		//b slider (cont)
		rect((bSlider-4)*s,81*s,8*s,20*s);
		//slider interaction
		if (sliding && startingOut === 6) {
			startingOut++;
		}
		if (mouseIsPressed && !sliding && mouseX > (rSlider-4)*s+x && mouseX < (rSlider+4)*s+x && mouseY > 11*s+y && mouseY < 31*s+y) {
			sliding = "r";
			savedColorOpen = false;
		}
		if (sliding === "r") {
			if (mouseX > 115*s+x && mouseX < 285*s+x && mouseY > y && mouseY < 47*s+y) {
				//println("Sliding red!")
				rSlider = (mouseX-x)/s;
				currentR = rSlider*1.5-172.5;
			} else {
				sliding = false;
			}
		}
		if (mouseIsPressed && !sliding && mouseX > (gSlider-4)*s+x && mouseX < (gSlider+4)*s+x && mouseY > 46*s+y && mouseY < 66*s+y) {
			sliding = "g";
			savedColorOpen = false;
		}
		if (sliding === "g") {
			if (mouseX > 115*s+x && mouseX < 285*s+x && mouseY > 30*s+y && mouseY < 82*s+y) {
				//println("Sliding green!")
				gSlider = (mouseX-x)/s;
				currentG = gSlider*1.5-172.5;
			} else {
				sliding = false;
			}
		}
		if (mouseIsPressed && !sliding && mouseX > (bSlider-4)*s+x && mouseX < (bSlider+4)*s+x && mouseY > 81*s+y && mouseY < 101*s+y) {
			sliding = "b";
			savedColorOpen = false;
		}
		if (sliding === "b") {
			if (mouseX > 115*s+x && mouseX < 285*s+x && mouseY > 65*s+y && mouseY < 110*s+y) {
				//println("Sliding blue!")
				bSlider = (mouseX-x)/s;
				currentB = bSlider*1.5-172.5;
			} else {
				sliding = false;
			}
		}
		if (mouseIsClicked) {
			sliding = false;
		}
		fill(190,190,190);
		textSize(17*s);
		text("r",293*s,26*s);
		text("g",293*s,60*s);
		text("b",293*s,97*s);
		
		//Saved Colors
		stroke(190,190,190);
		strokeWeight(3*s);
		for (var i = 0; i < savedColors.length; i++) {
			fill(savedColors[i]);
			rect((115+35*i)*s,116*s,28*s,28*s);
			if (mouseIsPressed && mouseX > (115+35*i)*s+x && mouseX < (143+35*i)*s+x && mouseY > 116*s+y && mouseY < 144*s+y) {
				savedColorOpen = i;
				currentR = red(savedColors[i]);
				currentG = green(savedColors[i]);
				currentB = blue(savedColors[i]);
				rSlider = currentR*0.6667+115;
				gSlider = currentG*0.6667+115;
				bSlider = currentB*0.6667+115;
			}
		}
		noStroke();
		//save
		drawSave(256*s,115*s,0.3*s,color(255,255,255));
		if (mouseIsClicked && mouseX > 252*s+x && mouseX < 283*s+x && mouseY > 115*s+y && mouseY < 148*s+y) {
			saved = false;
			var i = 0;
			while(!saved && i < freeSlots.length) {
				if (freeSlots[i] === 1) {
					saved = true;
					freeSlots[i] = 0;
					savedColors[i] = color(currentR,currentG,currentB);
					if (startingOut === 7) {
						startingOut++;
					}
				}
				i++;
			}
		}
		//trash
		drawTrash(290*s,120*s,0.3*s);
		if (mouseIsClicked && savedColorOpen !== false && mouseX > 287*s+x && mouseX < 320*s+x && mouseY > 110*s+y && mouseY < 144*s+y) {
			savedColors[savedColorOpen] = color(255,255,255);
			freeSlots[savedColorOpen] = 1;
			savedColorOpen = false;
			if (startingOut === 8) {
				startingOut++;
			}
		}
		//x button
		fill(240,20,20);
		rect(304*s,-2*s,18*s,18*s);
		stroke(150,10,10);
		strokeWeight(2*s);
		line(308*s,2*s,318*s,12*s);
		line(308*s,12*s,318*s,2*s);
		noStroke();
		if (mouseIsClicked && mouseX > 304*s+x && mouseX < 322*s+x && mouseY > -2*s+y && mouseY < 16*s+y) {
			selectedColor = color(currentR,currentG,currentB);
			selectedPaintbrush = 0;
			colorPickerOpen = false;
		}
		popMatrix();
	};
	

	var drawPaintbrush1 = function(x, y, s) {
	    fill(71, 134, 237);
	    quad((x - 20) * s, y * s, (x + 20) * s, y * s, (x + 16) * s, (y + 235) * s, (x - 14) * s, (y + 235) * s);
	    fill(168, 168, 168);
	    rect((x - 20) * s, (y - 55) * s, 40 * s, 55 * s);
	    fill(184, 119, 55);
	    quad((x - 20) * s, (y - 55) * s, (x - 22) * s, (y - 95) * s, (x + 22) * s, (y - 95) * s, (x + 20) * s, (y - 55) * s); 
	    if (selectedPaintbrush === 1) {
	        fill(selectedColor,transparency);
	        quad((x - 20) * s, (y - 80) * s, (x - 22) * s, (y - 95) * s, (x + 22) * s, (y - 95) * s, (x + 20) * s, (y - 80) * s);
	    }
	};

	var drawPaintbrush2 = function(x, y, s) {
	    fill(71, 134, 237);
	    quad((x - 13) * s, y * s, (x + 13) * s, y * s, (x + 7) * s, (y + 235) * s, (x - 7) * s, (y + 235) * s);
	    fill(168, 168, 168);
	    rect((x - 13) * s, (y - 55) * s, 26 * s, 55 * s);
	    fill(184, 119, 55);
	    quad((x - 13) * s, (y - 55) * s, (x - 16) * s, (y - 85) * s, (x + 16) * s, (y - 85) * s, (x + 13) * s, (y - 55) * s);
	    if (selectedPaintbrush === 2) {
	    	fill(selectedColor,transparency);
	        quad((x - 14) * s, (y - 75) * s, (x - 16) * s, (y - 85) * s, (x + 16) * s, (y - 85) * s, (x + 14) * s, (y - 75) * s);
	    }
	};

	var drawPaintbrush3 = function(x, y, s) {
	    fill(71, 134, 237);
	    quad((x - 10) * s, y * s, (x + 10) * s, y * s, (x + 4) * s, (y + 235) * s, (x - 6) * s, (y + 235) * s);
	    fill(168, 168, 168);
	    rect((x - 10) * s, (y - 55) * s, 20 * s, 55 * s);
	    fill(184, 119, 55);
	    quad((x - 10) * s, (y - 55) * s, (x - 11) * s, (y - 75) * s, (x + 11) * s, (y - 75) * s, (x + 10) * s, (y - 55) * s);
	    if (selectedPaintbrush === 3) {
	    	fill(selectedColor,transparency);
	        quad((x - 10) * s, (y - 70) * s, (x - 11) * s, (y - 75) * s, (x + 11) * s, (y - 75) * s, (x + 10) * s, (y - 70) * s);
	    }
	};

	var drawPaintbrush4 = function(x, y, s) {
	    fill(71, 134, 237);
	    quad((x - 8) * s, y * s, (x + 8) * s, y * s, (x + 4) * s, (y + 235) * s, (x - 4) * s, (y + 235) * s);
	    fill(168, 168, 168);
	    rect((x - 8) * s, (y - 55) * s, 16 * s, 55 * s);
	    fill(184, 119, 55);
	    quad((x - 8) * s, (y - 55) * s, (x - 7) * s, (y - 75) * s, (x + 7) * s, (y - 75) * s, (x + 8) * s, (y - 55) * s);
	    if (selectedPaintbrush === 4) {
	    	fill(selectedColor,transparency);
	        quad((x - 8) * s, (y - 70) * s, (x - 7) * s, (y - 75) * s, (x + 7) * s, (y - 75) * s, (x + 8) * s, (y - 70) * s);
	    }
	};

	var drawPaintbrush5 = function(x, y, s) {
	    fill(71, 134, 237);
	    quad((x - 6) * s, y * s, (x + 6) * s, y * s, (x + 3) * s, (y + 235) * s, (x - 3) * s, (y + 235) * s);
	    fill(168, 168, 168);
	    rect((x - 6) * s, (y - 55) * s, 12 * s, 55 * s);
	    fill(184, 119, 55);
	    quad((x - 6) * s, (y - 55) * s, (x - 4) * s, (y - 75) * s, (x + 4) * s, (y - 75) * s, (x + 6) * s, (y - 55) * s);
	    if (selectedPaintbrush === 5) {
	    	fill(selectedColor,transparency);
	        quad((x - 5) * s, (y - 70) * s, (x - 4) * s, (y - 75) * s, (x + 4) * s, (y - 75) * s, (x + 5) * s, (y - 70) * s);
	    }
	};

	var drawPencil = function(x, y, s) {
	    fill(227, 211, 174);
	    triangle((x - 15) * s, (y + 52) * s, x * s, y * s, (x + 15) * s, (y + 52) * s); 
	    fill(89, 89, 89);
	    triangle((x - 5) * s, (y + 18) * s, x * s, y * s, (x + 5) * s, (y + 18) * s); 
	    fill(255, 225, 0);
	    rect((x - 15) * s, (y + 50) * s, 30 * s, 212 * s);
	    triangle((x - 15) * s, (y + 51) * s, (x - 7) * s, (y + 42) * s, (x + 6) * s, (y + 51) * s);
	    triangle((x - 2) * s, (y + 51) * s, (x + 8) * s, (y + 42) * s, (x + 11) * s, (y + 51) * s);
	    fill(186, 186, 186);
	    rect((x - 15) * s, (y + 261) * s, 30 * s, 25 * s);
	    fill(255, 171, 171);
	    rect((x - 15) *s, (y + 286) * s, 30 * s, 30 * s);
	};
	
	var width = p.width;//canvas width
	var height = p.height;//canvas height
	p.setup = function() {
		size(500, 500);//size of the canvas
		width = 500;
		height = 500;
		noFill();
		noStroke();
		background(255, 200, 176); //pick a color
	};


	p.draw = function() {
		keyCode = p.keyCode;
		mouseX = p.mouseX;
		mouseY = p.mouseY;
		pmouseX = p.pmouseX;
		pmouseY = p.pmouseY;
		
		//Put code here
		background(255, 200, 176);
	    noStroke();
	    //table
	    fill(199, 138, 77);
	    quad(0, 255, 500, 280, 500, 500, 0, 500);
	    //canvas
	    fill(247, 247, 247);
	    quad(210, 60, 220, 50, 455, 70, 445, 80);
	    fill(207, 207, 207);
	    quad(455, 70, 445, 80, 435, 375, 445, 365);
	    fill(240, 240, 240);
	    quad(210, 60, 445, 80, 435, 375, 200, 345);
	    //cup
	    fill(34, 104, 179);
	    ellipse(95, 199, 130, 70);
	    //paintbrushes
	    if (selectedPaintbrush !== 1) {
	        drawPaintbrush1(82, 297, 0.7);
	    }	    
	    if (selectedPaintbrush !== 2) {
	        drawPaintbrush2(122, 301, 0.7);
	    }	    
	    if (selectedPaintbrush !== 3) {
	        drawPaintbrush3(153, 280, 0.7);
	    }	    
	    if (selectedPaintbrush !== 4) {
	        drawPaintbrush4(181, 291, 0.7);
	    }
	    if (selectedPaintbrush !== 5) {
	        drawPaintbrush5(203, 297, 0.7);
	    }
	    if (!colorPickerOpen) {
		    if (mouseIsClicked && mouseX > 42 && mouseX < 70 && mouseY > 140 && mouseY < 220) {
		        selectedPaintbrush = 1;
		    }
		    if (mouseIsClicked && mouseX > 70 && mouseX < 97 && mouseY > 152 && mouseY < 220) {
		        selectedPaintbrush = 2;
		    }
		    if (mouseIsClicked && mouseX > 100 && mouseX < 115 && mouseY > 152 && mouseY < 220) {
		        selectedPaintbrush = 3;
		    }
		    if (mouseIsClicked && mouseX > 120 && mouseX < 130 && mouseY > 152 && mouseY < 220) {
		        selectedPaintbrush = 4;
		    }
		    if (mouseIsClicked && mouseX > 135 && mouseX < 145 && mouseY > 152 && mouseY < 220) {
		        selectedPaintbrush = 5;
		    }
		    if (mouseIsClicked && mouseX > 40 && mouseX < 160 && mouseY > 220 && mouseY < 390) {
		        selectedPaintbrush = 0;
		    }
		    if (mouseIsClicked && mouseX > 160 && mouseX < 350 && mouseY > 370 && mouseY < 395) {
		        selectedPaintbrush = 6;
		    }
		    if (mouseIsClicked && mouseY < -.628*mouseX + 510.95 && mouseY > -.292*mouseX + 447.75 && mouseY < 2.286*mouseX + 432.286 && mouseY > 2*mouseX + 214) {
				colorPickerOpen = true;
				currentR = red(selectedColor);
				currentG = green(selectedColor);
				currentB = blue(selectedColor);
				rSlider = currentR*0.6667+115;
				gSlider = currentG*0.6667+115;
				bSlider = currentB*0.6667+115;
				sliding = false;
				saved = false;
				savedColorOpen = false;
				selectedPaintbrush = 0;
			}
		    if (mouseIsClicked && sq(mouseX-218)/5625 + sq(mouseY-440)/1600 <= 1 && selectedPaintbrush < 6) {
		    	transparency -= 51;
		    	if (transparency < 0) {
		    		transparency = 0;
		    	}
		    	//println("Watered down");
		    }
		    if (mouseIsClicked && mouseY > 460 && mouseY < 500 && mouseX < 250 && mouseY > -.667*mouseX + 553.33) {
		    	transparency = 255;
		    }
	    }
	    /*if (selectedPaintbrush !== 7 && developer) {
	        pushMatrix();
	        rotate(-2);
	        drawEraser(307, 701, 0.6);
	        popMatrix();
	    }*/
	    //more cup
	    /*stroke(70, 150, 212);
	    strokeWeight(30);
	    noFill();
	    arc(95, 204, 161, 70, 0, 180);
	    noStroke();
	    fill(70, 150, 212);
	    quad(32, 240, 50, 400, 140, 400, 160, 240);
	    fill(52, 135, 199);
	    triangle(140, 400, 149, 315, 110, 400);
	    fill(73, 157, 222);
	    ellipse(62, 262, 22, 30);*/
	    stroke(70, 150, 212);
	    strokeWeight(30);
	    noFill();
	    arc(95, 204, 161, 70, 0, 180);
	    noStroke();
	    fill(70, 150, 212);
	    quad(32, 240, 50, 400, 140, 400, 160, 240);
	    arc(95,400,90,40,0,180);
	    fill(52, 135, 199);
	    triangle(140, 400, 154, 280, 95, 400);
	    arc(95,400,90,40,0,103);
	    fill(73, 157, 222);
	    ellipse(62, 262, 22, 30);
	    //wall
	    fill(255, 200, 176);
	    quad(160, 192, 202, 179, 175, 265, 157, 264);
	    quad(0, 185, 27, 179, 34, 257, 0, 220);
	    if (mouseIsClicked && mouseX > 312 && mouseX < 342 && mouseY > 464 && mouseY < 490 && selectedPaintbrush < 6 && selectedPaintbrush) {
	        selectedColor = color(199, 46, 46);
	    }
	    if (mouseIsClicked && mouseX > 323 && mouseX < 353 && mouseY > 425 && mouseY < 451 && selectedPaintbrush < 6 && selectedPaintbrush) {
	        selectedColor = color(240, 111, 19);
	    }
	    if (mouseIsClicked && mouseX > 365 && mouseX < 395 && mouseY > 406 && mouseY < 438 && selectedPaintbrush < 6 && selectedPaintbrush) {
	        selectedColor = color(240, 207, 19);
	    }
	    if (mouseIsClicked && mouseX > 415 && mouseX < 435 && mouseY > 403 && mouseY < 435 && selectedPaintbrush < 6 && selectedPaintbrush) {
	        selectedColor = color(64, 161, 11);
	    }
	    if (mouseIsClicked && mouseX > 456 && mouseX < 476 && mouseY > 416 && mouseY < 448 && selectedPaintbrush < 6 && selectedPaintbrush) {
	        selectedColor = color(76, 121, 224);
	    }
	    if (mouseIsClicked && mouseX > 463 && mouseX < 483 && mouseY > 451 && mouseY < 483 && selectedPaintbrush < 6 && selectedPaintbrush) {
	        selectedColor = color(156, 77, 240);
	    }	   
	    if (mouseIsClicked && mouseX > 428 && mouseX < 458 && mouseY > 468 && mouseY < 495 && selectedPaintbrush < 6 && selectedPaintbrush) {
	        selectedColor = color(242, 123, 197);
	    }	    
	    if (mouseIsClicked && mouseX > 385 && mouseX < 415 && mouseY > 470 && mouseY < 496 && selectedPaintbrush < 6 && selectedPaintbrush) {
	        selectedColor = color(125, 64, 21);
	    }	    
	    if (mouseIsClicked && mouseX > 406 && mouseX < 436 && mouseY > 438 && mouseY < 464 && selectedPaintbrush < 6 && selectedPaintbrush) {
	        selectedColor = color(20, 20, 20);
	    }	    
	    if (mouseIsClicked && mouseX > 356 && mouseX < 386 && mouseY > 443 && mouseY < 469 && selectedPaintbrush < 6 && selectedPaintbrush) {
	        selectedColor = color(255, 255, 255);
	    }	    
	    if (startingOut === 1) {
	        fill(0, 0, 0);
	        textFont(myFont, 17);
	        text("Click on the brushes\n   to use them", 13, 44);
	        if (selectedPaintbrush && selectedPaintbrush < 6) {
	            startingOut++;
	        }
	    } else if (startingOut === 2) {
	        fill(0, 0, 0);
	        textFont(myFont, 17);
	        text("Use the palette\nto change colors", 23, 84);//138, 450);
	        if (selectedColor !== color(199, 46, 46)) {
	            startingOut++;
	        }
	    } else if (startingOut === 3) {
	        fill(0, 0, 0);
	        textFont(myFont, 17);
	        text("Right click to paint \nthe entire canvas", 23, 84);//90, 433);
	        if (mouseIsClicked && p.mouseButton === RIGHT) {
	            startingOut++;
	        }
	    } else if (startingOut === 4) {
	        fill(0, 0, 0);
	        textFont(myFont, 17);
	        text("Click on the pencil \n  to pick it up. \nRight click to use \n   the eraser", 11,34);//90, 433);
	        if (mouseIsClicked && p.mouseButton === RIGHT && selectedPaintbrush === 6) {
	            startingOut++;
	        }
	    } else if (startingOut === 5) {
	    	fill(0, 0, 0);
	        textFont(myFont, 17);
	        text("Click the tube of \npaint to get more \n     colors.", 23, 54);//0, 433);
	        if (colorPickerOpen) {
	            startingOut++;
	        }
	    } else if (startingOut === 9) {
	    	fill(0, 0, 0);
	        textFont(myFont, 13);
	        text("Click the bowl of water\nto reduce the opacity \n    of the paint.\nClick the paper towel\nto reset to fully opaque.", 13, 22);//0, 433);
	        if (transparency < 255) {
	            startingOut++;
	        }
	    }
	    startIndex = 0;
	    noFill();
		for (var i = 0; i < paintingLetGoPoints.length; i++) {
			if (paintingXs[startIndex] !== "background") {
				noFill();
				stroke(paintingCs[startIndex],paintingTs[startIndex]);
				strokeWeight(paintingSs[startIndex]);
				beginShape();
				curveVertex(paintingXs[startIndex],paintingYs[startIndex]);
				for (var j = startIndex; j <= paintingLetGoPoints[i]; j++) {
					curveVertex(paintingXs[j],paintingYs[j]);
				}
				curveVertex(paintingXs[paintingLetGoPoints[i]],paintingYs[paintingLetGoPoints[i]]);
				endShape();
				startIndex = paintingLetGoPoints[i]+1;
			} else {
				noStroke();
				fill(paintingCs[startIndex],paintingTs[startIndex]);
	            quad(210, 60, 445, 80, 435, 375, 200, 345);
	            startIndex++;
	            noFill();
			}
		}
		stroke(paintingCs[startIndex],paintingTs[startIndex]);
		strokeWeight(paintingSs[startIndex]);
		beginShape();
		curveVertex(paintingXs[startIndex],paintingYs[startIndex]);
		for (var i = startIndex; i < paintingXs.length; i++) {
			curveVertex(paintingXs[i],paintingYs[i]);
		}
		curveVertex(paintingXs[paintingXs.length-1],paintingYs[paintingXs.length-1]);
		endShape();
		noStroke();
	    /*for (var i = 0; i < paintingXs.length; i++) {
	        if (paintingXs[i] !== "background") {
	            stroke(paintingCs[i],paintingTs[i]);
	            strokeWeight(paintingSs[i]);
	            line(paintingX2s[i], paintingY2s[i], paintingXs[i], paintingYs[i]);
	            noStroke();
	        } else {
	            fill(paintingCs[i],paintingTs[i]);
	            quad(210, 60, 445, 80, 435, 375, 200, 345);
	        }
	    }*/
	    if (!colorPickerOpen && mouseIsPressed && mouseY < -29.5*mouseX + 13207.5 && mouseY > -28.5*mouseX + 6045 && mouseY > 0.0851*mouseX + 42.1 && mouseY < 0.128*mouseX + 319.468 && pmouseY < -29.5*pmouseX + 13207.5 && pmouseY > -28.5*pmouseX + 6045 && pmouseY > 0.0851*pmouseX + 42.1 && pmouseY < 0.128*pmouseX + 319.468 && p.mouseButton === RIGHT && selectedPaintbrush === 6) {
	        erasing = true;
	        //paintingX2s.push(mouseX);
	        //paintingY2s.push(mouseY);
	        paintingXs.push(pmouseX);
	        paintingYs.push(pmouseY);
	        paintingCs.push(color(240, 240, 240));
	        paintingSs.push(21);
	    }
	    fill(199, 138, 77);
	    quad(200,345,435,375,460,410,180,385);
	    quad(180,385,200,345,204,266,180,265);
	    quad(460,410,435,376,443,279,470,280);
	    fill(255, 200, 176);
	    quad(204,266,180,265,180,0,212,0);
	    quad(210,59,455,79,455,0,210,0);
	    quad(443,279,470,280,470,0,459,0);
	    fill(255,0,0);
	  //canvas
	    fill(247, 247, 247);
	    quad(210, 60, 220, 50, 455, 70, 445, 80);
	    fill(207, 207, 207);
	    quad(455, 70, 445, 80, 435, 375, 445, 365);
	  //palette
	    fill(230, 187, 138);
	    ellipse(410, 469, 250, 150);
	    fill(199, 46, 46);//red
	    ellipse(327, 477, 30, 26);
	    ellipse(309, 477, 12, 10);
	    ellipse(339, 464, 14, 14);
	    fill(240, 111, 19);//orange
	    ellipse(338, 438, 30, 26);
	    ellipse(322, 443, 12, 10);
	    ellipse(339, 425, 14, 14);
	    fill(240, 207, 19);//yellow
	    ellipse(380, 419, 30, 26);
	    ellipse(368, 428, 12, 10);
	    ellipse(385, 409, 14, 14);
	    fill(64, 161, 11);//green
	    ellipse(430, 416, 30, 26);
	    ellipse(425, 428, 12, 10);
	    ellipse(441, 410, 14, 14);
	    fill(76, 121, 224);//blue
	    ellipse(471, 429, 30, 26);
	    ellipse(464, 441, 12, 10);
	    ellipse(462, 437, 14, 14);
	    fill(156, 77, 240);//purple
	    ellipse(478, 464, 30, 26);
	    ellipse(488, 477, 12, 10);
	    ellipse(489, 455, 14, 14);
	    fill(242, 123, 197);//pink
	    ellipse(443, 481, 30, 26);
	    ellipse(457, 477, 12, 10);
	    ellipse(445, 470, 14, 14);
	    fill(125, 64, 21);//brown
	    ellipse(400, 483, 30, 26);
	    ellipse(386, 477, 12, 10);
	    ellipse(385, 485, 14, 14);
	    fill(20, 20, 20);//black
	    ellipse(421, 451, 30, 26);
	    ellipse(433, 458, 12, 10);
	    ellipse(434, 447, 14, 14);
	    fill(255, 255, 255);//white
	    ellipse(371, 456, 30, 26);
	    ellipse(357, 463, 12, 10);
	    ellipse(381, 447, 14, 14);
	    fill(255, 156, 194);
	    stroke(255, 102, 161);
	    strokeWeight(8);
	    rect(415, 14, 70, 40, 5);
	    fill(255, 102, 161);
	    textSize(20);
	    text("Undo", 428, 41);
	    noStroke();
	    pushMatrix();
	    translate(90,420);
	    rotate(65);
	    drawPaintTube(0,0,0.4)
	    popMatrix();
	    //paper towel
	    fill(230,230,225);
	    quad(80,500,250,500,250,460,140,460);
	    //bowl of water
	    fill(70, 150, 212);
	    arc(218,425,140,120,0,180);
	    fill(52, 135, 199);
	    arc(218,425,140,120,0,103);
	    fill(34, 104, 179);
	    ellipse(218,425,140,50);
	    fill(156, 196, 240);
	    arc(218,425,140,50,35,145);
	    ellipse(218,435,100,30);
	    pushMatrix();
	    translate(266,435);
	    rotate(20);
	    ellipse(0,0,20,10);
	    popMatrix();
	    pushMatrix();
	    translate(170,435);
	    rotate(-20);
	    ellipse(0,0,20,10);
	    popMatrix();
	    if (colorPickerOpen) {
	    	fill(180,180,180,150);
	    	rect(0,0,500,500);
	    	cursor(ARROW);
	    	drawColorPicker(55,60,1.2);
	    	if (startingOut === 6) {
		    	fill(0, 0, 0);
		        textFont(myFont, 17);
		        text("Use the sliders to control the red, green,\n      and blue values of the color.", 68, 354);//0, 433);
		    } else if (startingOut === 7) {
		    	fill(0, 0, 0);
		        textFont(myFont, 17);
		        text("   To save a color in one of the four slots,\n             press the save icon.\nClick on the boxes to retrieve your saved colors.", 48, 354);//0, 433);
		    } else if (startingOut === 8) {
		    	fill(0, 0, 0);
		        textFont(myFont, 17);
		        text("     If you run out of room for new colors,\n   you can delete a saved color by clicking on\n			      its box and then the trash icon.", 52, 354);//0, 433);
		    }
	    } else {
		    if (selectedPaintbrush !== 6) {
		        pushMatrix();
		        rotate(-83);
		        drawPencil(-640, 364, 0.55);
		        popMatrix();
		    }
		    if (selectedPaintbrush === 1) {
		        pushMatrix();
		        translate(mouseX, mouseY);
		        rotate(-95);
		        drawPaintbrush1(0, 90, 0.7);
		        popMatrix();
		        cursor("none");
		    } else if (selectedPaintbrush === 2) {
		        pushMatrix();
		        translate(mouseX, mouseY);
		        rotate(-95);
		        drawPaintbrush2(0, 80, 0.7);
		        popMatrix();
		        cursor("none");
		    } else if (selectedPaintbrush === 3) {
		        pushMatrix();
		        translate(mouseX, mouseY);
		        rotate(-95);
		        drawPaintbrush3(0, 70, 0.7);
		        popMatrix();
		        cursor("none");
		    } else if (selectedPaintbrush === 4) {
		        pushMatrix();
		        translate(mouseX, mouseY);
		        rotate(-95);
		        drawPaintbrush4(0, 70, 0.7);
		        popMatrix();
		        cursor("none");
		    } else if (selectedPaintbrush === 5) {
		        pushMatrix();
		        translate(mouseX, mouseY);
		        rotate(-95);
		        drawPaintbrush5(0, 70, 0.7);
		        popMatrix();
		        cursor("none");
		    } else if (selectedPaintbrush === 6) {
		        if (!erasing) {
		            pushMatrix();
		            translate(mouseX, mouseY);
		            rotate(-83);
		            drawPencil(-4, -1, 0.6);
		            popMatrix();
		            cursor("none");
		        } else {
		            pushMatrix();
		            translate(mouseX, mouseY);
		            rotate(83);
		            drawPencil(4, -300, 0.6);
		            popMatrix();
		            cursor("none");
		        }
		    } else {
		        cursor(ARROW);
		    }
		    if (selectedPaintbrush && mouseIsPressed && mouseY < -29.5*mouseX + 13207.5 && mouseY > -28.5*mouseX + 6045 && mouseY > 0.0851*mouseX + 42.1 && mouseY < 0.128*mouseX + 319.468 && p.mouseButton === LEFT && pmouseY < -29.5*pmouseX + 13207.5 && pmouseY > -28.5*pmouseX + 6045 && pmouseY > 0.0851*pmouseX + 42.1 && pmouseY < 0.128*pmouseX + 319.468) {
		        cp = true;
		    	//paintingX2s.push(mouseX);
		        //paintingY2s.push(mouseY);
		        paintingXs.push(pmouseX);
			    paintingYs.push(pmouseY);
		        if (selectedPaintbrush === 6) {
		            paintingCs.push(color(89, 89, 89));
		        } else {
		            paintingCs.push(selectedColor);
		            paintingTs.push(transparency);
		        }
		        if (selectedPaintbrush === 1) {
		            paintingSs.push(43);
		        } else if (selectedPaintbrush === 2) {
		            paintingSs.push(31);
		        } else if (selectedPaintbrush === 3) {
		            paintingSs.push(21);
		        } else if (selectedPaintbrush === 4) {
		            paintingSs.push(16);
		        } else if (selectedPaintbrush === 5) {
		            paintingSs.push(11);
		        } else if (selectedPaintbrush === 6) {
		            paintingSs.push(7);
		        } else {
		            paintingSs.push(0);
		        }
		    } else if (selectedPaintbrush && mouseIsClicked && mouseY < -29.5*mouseX + 13207.5 && mouseY > -28.5*mouseX + 6045 && mouseY > 0.0851*mouseX + 42.1 && mouseY < 0.128*mouseX + 319.468 && pmouseY < -29.5*pmouseX + 13207.5 && pmouseY > -28.5*pmouseX + 6045 && pmouseY > 0.0851*pmouseX + 42.1 && pmouseY < 0.128*pmouseX + 319.468 && p.mouseButton === RIGHT && selectedPaintbrush < 6) {
		        paintingXs.push("background");
		        paintingYs.push("background");
		        //paintingX2s.push("background");
		        //paintingY2s.push("background");
		        paintingCs.push(selectedColor);
		        paintingTs.push(transparency);
		        paintingSs.push(0);
		        cp = false;
		        paintingLetGoPoints.push(paintingXs.length - 2);
		    }
		    if (mouseY < -29.5*mouseX + 13207.5 && mouseY > -28.5*mouseX + 6045 && mouseY > 0.0851*mouseX + 42.1 && mouseY < 0.128*mouseX + 319.468 && pmouseY < -29.5*pmouseX + 13207.5 && pmouseY > -28.5*pmouseX + 6045 && pmouseY > 0.0851*pmouseX + 42.1 && pmouseY < 0.128*pmouseX + 319.468) {
		        if (mouseIsClicked) {
		        	paintingLetGoPoints.push(paintingXs.length - 1);
		        	cp = false;
		        }
		    } else if (cp) {
		    	paintingLetGoPoints.push(paintingXs.length - 1);
		    	cp = false;
		    }
		    if (mouseIsClicked && mouseX > 415 && mouseX < 485 && mouseY > 14 && mouseY < 54) {
		        if (paintingLetGoPoints.length !== 1) {
		            paintingXs.splice(paintingLetGoPoints[paintingLetGoPoints.length - 2] + 1, paintingLetGoPoints[paintingLetGoPoints.length - 1] - paintingLetGoPoints[paintingLetGoPoints.length - 2]);
		            //paintingX2s.splice(paintingLetGoPoints[paintingLetGoPoints.length - 2] + 1, paintingLetGoPoints[paintingLetGoPoints.length - 1] - paintingLetGoPoints[paintingLetGoPoints.length - 2]);
		            paintingYs.splice(paintingLetGoPoints[paintingLetGoPoints.length - 2] + 1, paintingLetGoPoints[paintingLetGoPoints.length - 1] - paintingLetGoPoints[paintingLetGoPoints.length - 2]);
		            //paintingY2s.splice(paintingLetGoPoints[paintingLetGoPoints.length - 2] + 1, paintingLetGoPoints[paintingLetGoPoints.length - 1] - paintingLetGoPoints[paintingLetGoPoints.length - 2]);
		            paintingCs.splice(paintingLetGoPoints[paintingLetGoPoints.length - 2] + 1, paintingLetGoPoints[paintingLetGoPoints.length - 1] - paintingLetGoPoints[paintingLetGoPoints.length - 2]);
		            paintingTs.splice(paintingLetGoPoints[paintingLetGoPoints.length - 2] + 1, paintingLetGoPoints[paintingLetGoPoints.length - 1] - paintingLetGoPoints[paintingLetGoPoints.length - 2]);
		            paintingSs.splice(paintingLetGoPoints[paintingLetGoPoints.length - 2] + 1, paintingLetGoPoints[paintingLetGoPoints.length - 1] - paintingLetGoPoints[paintingLetGoPoints.length - 2]);
		        } else {
		            paintingXs.splice(0, paintingXs.length);
		            paintingYs.splice(0, paintingYs.length);
		            //paintingX2s.splice(0, paintingX2s.length);
		            //paintingY2s.splice(0, paintingY2s.length);
		            paintingCs.splice(0, paintingCs.length);
		            paintingTs.splice(0, paintingTs.length);
		            paintingSs.splice(0, paintingSs.length);
		        }
		        paintingLetGoPoints.splice(paintingLetGoPoints.length - 1, 1);
		    }
	    }
	    erasing = false;
		
		keyIsReleased = false;
		mouseIsClicked = false;
		//println(mouseX+" "+mouseY);
	};  

	
}
