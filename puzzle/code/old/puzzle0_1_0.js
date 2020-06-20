//Created by Melody Ruth. Licensed under Attribution-NonCommercial-ShareAlike 3.0 Unported (CC BY-NC-SA 3.0)

//Uploaded image gets split into r*c draggable, rectangular pieces.

function startSketch(){
	var sketch = function(p) {
		var counter = 0;
		var puzzleImage;
		var newOne = false;
		var numPieces = 6;//3x2
		var r = 3;
		var c = 5;
		var pieceW;
		var pieceH;
		
		var pieceImages = [];
		var pieces = [];
		var groups = [];
		var testImage;
		var currentlyMoving = -1;
		var currentlyMovingGroup = -1;
		var foundOne = false;
		
		var canvasWidth;
		var canvasHeight;
		
		p.preload = function() {
			puzzleImage = p.loadImage(testingSource);
		}
		
		var newPiece = function(x,y,index) {
			var piece = {};
			piece.x = x;
			piece.y = y;
			piece.index = index;
			piece.groupIndex = -1;
			piece.moving = false;
			piece.drawIt = function() {
				p.image(pieceImages[this.index],this.x,this.y);
				//console.log(this.x,this.y);
			};
			piece.checkMoving = function() {
				if ((currentlyMoving == -1 || currentlyMoving == this.index) && p.mouseIsPressed && p.pmouseX > this.x && p.pmouseX < this.x+pieceW && p.pmouseY > this.y && p.pmouseY < this.y+pieceH) {
					this.moving = true;
					currentlyMoving = this.index;
					foundOne = true;
				} else {
					this.moving = false;
				}
			};
			piece.moveIt = function() {
				if (this.moving) {
					this.x += p.mouseX-p.pmouseX;
					this.y += p.mouseY-p.pmouseY;
				}
			};
			return piece;
		};
		
		p.setup = function() {
			p.angleMode(p.DEGREES);
			var testCanvas = p.createCanvas(800,600);
			canvasWidth = 800;
			canvasHeight = 600;
			testCanvas.parent('canvas1');
			p.noFill();
			p.noStroke();
			p.background(2, 130, 194); //pick a color
			//console.log(testingSource);
			pieceW = Math.round(puzzleImage.width/c);
			pieceH = Math.round(puzzleImage.height/r);
			//console.log(pieceH);
			
			//Make puzzle pieces
			puzzleImage.loadPixels();
			//testImage = p.createImage(pieceW,pieceH);
			//testImage.loadPixels();
			//testImage.copy(puzzleImage,0,0,pieceW,pieceH,0,0,pieceW,pieceH);
			
			for (var i = 0; i < r*c; i++) {
				pieceImages[i] = p.createImage(pieceW,pieceH);
				pieceImages[i].copy(puzzleImage,(i%c)*pieceW,Math.floor(i/c)*pieceH,pieceW,pieceH,0,0,pieceW,pieceH);
			}
			
			for (var i = 0; i < r*c; i++) {
				pieces[i] = newPiece(p.random(0,canvasWidth-pieceW),p.random(0,canvasHeight-pieceH),i);
				//console.log(pieceW);
			}
		};
		
		
		p.draw = function() {
			p.background(2,130,194);
			p.fill(255);
			//p.text(newOne,50,50);
			
			//p.image(puzzleImage,300,300);
			/*for (var i = 0; i < pieceImages.length; i++) {
				//p.image(pieceImages[i], 10+(i%c)*(pieceW+10),20+Math.floor(i/c)*(pieceH+10));
			}*/
			for (var i = pieces.length-1; i >= 0; i--) {
				pieces[i].drawIt();
			}
			foundOne = false;
			for (var i = 0; i < pieces.length; i++) {
				pieces[i].checkMoving();
			}
			if (!foundOne) {
				currentlyMoving = -1;
			}
			for (var i = 0; i < pieces.length; i++) {
				pieces[i].moveIt();
			}
			//p.image(testImage,300,20);
			//console.log(imageW);
			
			if (counter > 0 && settingUp && newOne) {//We are the newly made sketch, and we've already setup
				settingUp = false;
				newOne = false;
			} else if (counter > 0 && settingUp) {//We aren't new anymore, and we're in the middle of setting up, which means time to leave
				settingUp = false;
				p.remove();
			} else if (settingUp) {//We must be the new one, since the counter is 0. There might still be an old one out there, so we can't stop setting up yet
				newOne = true;
			}
			
			if (counter > 0) {
				newOne = false;
			}
			
			counter++;
		};
	};
	var myp5 = new p5(sketch);
}

/*function startSketch() {
	var counter = 0;
	var testImage;
	setup = function() {
		angleMode(DEGREES);
		var testCanvas = createCanvas(800,600);
		testCanvas.parent('canvas1');
		noFill();
		noStroke();
		background(2, 130, 194); //pick a color
		console.log(testingSource);
		testImage = loadImage(testingSource);
	};
	draw = function() {
		background(2,130,194);
		fill(255);
		text(counter,50,50);
		counter++;
		
		image(testImage,200,200,50,50);
	};
}*/
