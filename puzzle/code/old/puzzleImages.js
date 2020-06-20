//Created by Melody Ruth. Licensed under Attribution-NonCommercial-ShareAlike 3.0 Unported (CC BY-NC-SA 3.0)

function startSketch(){
	var sketch = function(p) {
		var counter = 0;
		var mouseIsReleased = false;
		var puzzleImage;
		var puzzleImage2;
		var newOne = false;
		var numPieces = 6;//3x2
		var r = 3;
		var c = 3;
		var imageW;
		var imageH;
		var pieceW;
		var pieceH;
		var margin = 6;
		var beginningTime = 25;
		
		var won = false;
		
		var pieceImages = [];
		var pieces = [];
		var groups = [];
		var goesDown = [];
		var goesRight = [];
		var nextGroup = 0;
		var testImage;
		var currentlyMoving = -1;
		var currentlyMovingGroup = -2;
		var foundOne = false;
		var foundGroup = false;
		var canvasWidth;
		var canvasHeight;
		
		var pieceImageTallW;
		var pieceImageTallH;
		var pieceImageWideW;
		var pieceImageWideH;
		
		var testing3;
		
		p.preload = function() {
			puzzleImage = p.loadImage(testingSource);
			
			bottomIn = p.loadImage("graphics/piece_bottom_in.png");
			bottomOut = p.loadImage("graphics/piece_bottom_out.png");
			bottomFlat = p.loadImage("graphics/piece_bottom_flat.png");
			leftIn = p.loadImage("graphics/piece_left_in.png");
			leftOut = p.loadImage("graphics/piece_left_out.png");
			leftFlat = p.loadImage("graphics/piece_left_flat.png");
			rightIn = p.loadImage("graphics/piece_right_in.png");
			rightOut = p.loadImage("graphics/piece_right_out.png");
			rightFlat = p.loadImage("graphics/piece_right_flat.png");
			topIn = p.loadImage("graphics/piece_top_in.png");
			topOut = p.loadImage("graphics/piece_top_out.png");
			topFlat = p.loadImage("graphics/piece_top_flat.png");
			
			testing3 = p.loadImage("graphics/testing3.png");
		}
		
		var newPiece = function(x,y,index) {
			var piece = {};
			piece.x = canvasWidth/2;
			piece.y = canvasHeight/2;
			piece.index = index;
			piece.groupIndex = -1;
			piece.moving = false;
			piece.groupIndex = -1;
			piece.movedTimer = 0;
			piece.xSpeed = (x-canvasWidth/2)/beginningTime;
			//console.log(piece.x-canvasWidth/2);
			piece.ySpeed = (y-canvasHeight/2)/beginningTime;
			if (index % c != 0) {
				piece.leftIndex = index-1;
			} else {
				piece.leftIndex = -1;
			}
			if (index >= c) {
				piece.topIndex = index-c;
			} else {
				piece.topIndex = -1;
			}
			piece.leftDone = false;
			//piece.rightDone = false;
			piece.topDone = false;
			//piece.bottomDone = false;
			piece.drawIt = function() {
				p.image(pieceImages[this.index],this.x,this.y);
				//console.log(this.x,this.y);
			};
			piece.beginningMoveIt = function() {
				this.x += this.xSpeed;
				this.y += this.ySpeed;
			};
			piece.checkMoving = function() {
				if ((currentlyMoving == -1 || currentlyMoving == this.index || currentlyMovingGroup == this.groupIndex) && p.mouseIsPressed && p.pmouseX > this.x && p.pmouseX < this.x+pieceW && p.pmouseY > this.y && p.pmouseY < this.y+pieceH) {
					this.moving = true;
					currentlyMoving = this.index;
					foundOne = true;
					if (this.groupIndex > -1) {
						groups[this.groupIndex].setInMotion();
					}
					this.movedTimer = 0;
				} else {
					/*this.moving = false;
					if (this.groupIndex > -1) {
						groups[this.groupIndex].stopMotion();
					}
					this.movedTimer++;*/
				}
			};
			piece.moveIt = function() {
				if (this.moving) {
					this.x += p.mouseX-p.pmouseX;
					this.y += p.mouseY-p.pmouseY;
				}
			};
			piece.checkNeighbors = function() {
				if (!this.moving && this.movedTimer < 3) {
					if (!this.leftDone && this.leftIndex != -1 && !pieces[this.leftIndex].moving && pieces[this.leftIndex].x+pieceW < this.x+margin && pieces[this.leftIndex].x+pieceW > this.x-margin && pieces[this.leftIndex].y < this.y+margin && pieces[this.leftIndex].y > this.y-margin) {
						if (this.groupIndex != -1 && pieces[this.leftIndex].groupIndex == -1) {//We're part of a group. New piece isn't.
							var xShift = pieces[this.leftIndex].x+pieceW-this.x;
							var yShift = pieces[this.leftIndex].y-this.y;
							for (var i = 0; i < groups[this.groupIndex].indices.length; i++) {
								pieces[groups[this.groupIndex].indices[i]].x += xShift;
								pieces[groups[this.groupIndex].indices[i]].y += yShift;
							}
							groups[this.groupIndex].indices[groups[this.groupIndex].indices.length] = this.leftIndex;
							pieces[this.leftIndex].groupIndex = this.groupIndex;
						} else if (this.groupIndex == -1 && pieces[this.leftIndex].groupIndex != -1) {//We're not part of a group. New piece is.
							groups[pieces[this.leftIndex].groupIndex].indices[groups[pieces[this.leftIndex].groupIndex].indices.length] = this.index;
							this.groupIndex = pieces[this.leftIndex].groupIndex;
							this.x = pieces[this.leftIndex].x+pieceW;
							this.y = pieces[this.leftIndex].y;
						} else if (this.groupIndex != -1 && pieces[this.leftIndex].groupIndex != -1) {//We're both part of groups. Merge!
							var xShift = pieces[this.leftIndex].x+pieceW-this.x;
							var yShift = pieces[this.leftIndex].y-this.y;
							for (var i = 0; i < groups[this.groupIndex].indices.length; i++) {
								pieces[groups[this.groupIndex].indices[i]].x += xShift;
								pieces[groups[this.groupIndex].indices[i]].y += yShift;
							}
							groups[this.groupIndex].merge(pieces[this.leftIndex].groupIndex);
						} else if (this.groupIndex == -1 && pieces[this.leftIndex].groupIndex == -1) {//Neither of us are in a group.
							groups[nextGroup] = newGroup(nextGroup, [this.index, this.leftIndex]);
							this.groupIndex = nextGroup;
							pieces[this.leftIndex].groupIndex = nextGroup;
							//console.log(groups[nextGroup]);
							nextGroup++;
							this.x = pieces[this.leftIndex].x+pieceW;
							this.y = pieces[this.leftIndex].y;
						}
						this.leftDone = true;
					}
					
					if (!this.topDone && this.topIndex != -1 && !pieces[this.topIndex].moving && pieces[this.topIndex].x < this.x+margin && pieces[this.topIndex].x > this.x-margin && pieces[this.topIndex].y+pieceH < this.y+margin && pieces[this.topIndex].y+pieceH > this.y-margin) {
						if (this.groupIndex != -1 && pieces[this.topIndex].groupIndex == -1) {//We're part of a group. New piece isn't.
							var xShift = pieces[this.topIndex].x-this.x;
							var yShift = pieces[this.topIndex].y+pieceH-this.y;
							for (var i = 0; i < groups[this.groupIndex].indices.length; i++) {
								pieces[groups[this.groupIndex].indices[i]].x += xShift;
								pieces[groups[this.groupIndex].indices[i]].y += yShift;
							}
							groups[this.groupIndex].indices[groups[this.groupIndex].indices.length] = this.topIndex;
							pieces[this.topIndex].groupIndex = this.groupIndex;
						} else if (this.groupIndex == -1 && pieces[this.topIndex].groupIndex != -1) {//We're not part of a group. New piece is.
							groups[pieces[this.topIndex].groupIndex].indices[groups[pieces[this.topIndex].groupIndex].indices.length] = this.index;
							this.groupIndex = pieces[this.topIndex].groupIndex;
							this.x = pieces[this.topIndex].x;
							this.y = pieces[this.topIndex].y+pieceH;
						} else if (this.groupIndex != -1 && pieces[this.topIndex].groupIndex != -1) {//We're both part of groups. Merge!
							var xShift = pieces[this.topIndex].x-this.x;
							var yShift = pieces[this.topIndex].y+pieceH-this.y;
							for (var i = 0; i < groups[this.groupIndex].indices.length; i++) {
								pieces[groups[this.groupIndex].indices[i]].x += xShift;
								pieces[groups[this.groupIndex].indices[i]].y += yShift;
							}
							groups[this.groupIndex].merge(pieces[this.topIndex].groupIndex);
						} else if (this.groupIndex == -1 && pieces[this.topIndex].groupIndex == -1) {//Neither of us are in a group.
							groups[nextGroup] = newGroup(nextGroup, [this.index, this.topIndex]);
							this.groupIndex = nextGroup;
							pieces[this.topIndex].groupIndex = nextGroup;
							//console.log(groups[nextGroup]);
							nextGroup++;
							this.x = pieces[this.topIndex].x;
							this.y = pieces[this.topIndex].y+pieceH;
						}
						this.topDone = true;
					}
					
					if (this.leftIndex > -1 && this.groupIndex != -1 && pieces[this.leftIndex].groupIndex == this.groupIndex) {
						this.leftDone = true;
					}
					if (this.topIndex > -1 && this.groupIndex != -1 && pieces[this.topIndex].groupIndex == this.groupIndex) {
						this.topDone = true;
					}
				}
				if (this.groupIndex != -1 && groups[this.groupIndex].indices.length == r*c) {
					won=true;
				}
				
			};
			return piece;
		};
		
		var newGroup = function(index, groupPieces) {
			var group = {};
			group.indices = groupPieces;
			group.index = index;
			group.setInMotion = function() {
				for (var j = 0; j < this.indices.length; j++) {
					pieces[this.indices[j]].moving = true;
				}
				foundGroup = true;
				currentlyMovingGroup = this.index;
			}
			group.stopMotion = function() {
				for (var j = 0; j < this.indices.length; j++) {
					pieces[this.indices[j]].moving = false;
				}
			}
			group.merge = function(toAbsorb) {
				var tempLength = groups[toAbsorb].indices.length;
				for (var j = 0; j < tempLength; j++) {
					if (pieces[groups[toAbsorb].indices[j]].groupIndex != this.index) {
						this.indices[this.indices.length] = groups[toAbsorb].indices[j];
						pieces[groups[toAbsorb].indices[j]].groupIndex = this.index;
					}
				}
			}
			return group;
		};
		
		p.setup = function() {
			p.angleMode(p.DEGREES);
			canvasWidth = 800;
			canvasWidth = Math.round(windowWidth*0.6);
			canvasHeight = Math.round(windowHeight*0.8);
			canvasHeight = 600;
			var testCanvas = p.createCanvas(canvasWidth,canvasHeight);
			testCanvas.parent('canvas1');
			p.noFill();
			p.noStroke();
			p.background(2, 130, 194); //pick a color
			
			//var sizeScale = 1;
			/*if (canvasWidth*0.8/puzzleImage.width < 1) {
				sizeScale = canvasWidth*0.8/puzzleImage.width;
			}
			var sizeScale = canvasWidth*0.8/puzzleImage.width;*/
			var sizeScale = Math.min(1,canvasWidth*0.8/puzzleImage.width,canvasHeight*0.8/puzzleImage.height);
			imageW = Math.round(puzzleImage.width*sizeScale);
			imageH = Math.round(puzzleImage.height*sizeScale);
			puzzleImage.resize(imageW,imageH);
			
			//console.log(testingSource);
			pieceW = Math.round(puzzleImage.width/c);
			pieceH = Math.round(puzzleImage.height/r);
			//console.log(pieceH);
			
			pieceImageWideW = Math.round(pieceW*5/3);
			//console.log(pieceImageWideW);
			//console.log(pieceW);
			pieceImageWideH = Math.round(pieceH*2/3);
			
			bottomIn.resize(pieceImageWideW,pieceImageWideH);
			//console.log(bottomIn.width);
			bottomOut.resize(pieceImageWideW,pieceImageWideH);
			bottomFlat.resize(pieceImageWideW,pieceImageWideH);
			topIn.resize(pieceImageWideW,pieceImageWideH);
			topOut.resize(pieceImageWideW,pieceImageWideH);
			topFlat.resize(pieceImageWideW,pieceImageWideH);
			testing3.resize(pieceImageWideW,pieceImageWideH);
			
			pieceImageTallW = Math.round(pieceW*2/3);
			pieceImageTallH = Math.round(pieceH*5/3);
			
			leftIn.resize(pieceImageTallW,pieceImageTallH);
			leftOut.resize(pieceImageTallW,pieceImageTallH);
			leftFlat.resize(pieceImageTallW,pieceImageTallH);
			rightIn.resize(pieceImageTallW,pieceImageTallH);
			rightOut.resize(pieceImageTallW,pieceImageTallH);
			rightFlat.resize(pieceImageTallW,pieceImageTallH);
			
			
			puzzleImage2 = p.createImage(imageW+pieceImageTallW,imageH+pieceImageWideH);
			puzzleImage2.loadPixels();
			for (var i = 0; i < puzzleImage2.pixels.length; i+=4) {
				puzzleImage2.pixels[i] = 255;
				puzzleImage2.pixels[i+1] = 255;
				puzzleImage2.pixels[i+2] = 255;
				puzzleImage2.pixels[i+3] = 255;
			}
			puzzleImage2.updatePixels();
			puzzleImage2.copy(puzzleImage,0,0,imageW,imageH,pieceImageTallW/2,pieceImageWideH/2,imageW,imageH);
			
			//Make puzzle pieces
			
			for (var i = 0; i < r*c; i++) {
				pieceImages[i] = p.createImage(pieceImageWideW,pieceImageTallH);
				pieceImages[i].copy(puzzleImage2,(i%c)*pieceW,Math.floor(i/c)*pieceH,pieceImageWideW,pieceImageTallH,0,0,pieceImageWideW,pieceImageTallH);
				//pieceImages[i].mask(bottomIn);
				//Top:
				if (i < c) {//top piece
					pieceImages[i].loadPixels();
					topFlat.loadPixels();
					var toDo = pieceImages[i].pixels.length*2/5;
					for (var j = 0; j < toDo; j+=4) {
						pieceImages[i].pixels[j+3] = topFlat.pixels[j+3];
					}
					topFlat.updatePixels();
					pieceImages[i].updatePixels();
				} else if (goesDown[i-c]){//always in for now
					pieceImages[i].loadPixels();
					topIn.loadPixels();
					var toDo = pieceImages[i].pixels.length*2/5;
					for (var j = 0; j < toDo; j+=4) {
						pieceImages[i].pixels[j+3] = topIn.pixels[j+3];
					}
					topIn.updatePixels();
					pieceImages[i].updatePixels();
				} else {
					pieceImages[i].loadPixels();
					topOut.loadPixels();
					var toDo = pieceImages[i].pixels.length*2/5;
					for (var j = 0; j < toDo; j+=4) {
						pieceImages[i].pixels[j+3] = topOut.pixels[j+3];
					}
					topOut.updatePixels();
					pieceImages[i].updatePixels();
				}
				//Bottom:
				if (i >= (r-1)*c) {//bottom piece
					pieceImages[i].loadPixels();
					bottomFlat.loadPixels();
					var toDo = 4 * (pieceImages[i].width) * (Math.round(pieceImages[i].height*3/5));
					for (var j = toDo; j < pieceImages[i].pixels.length; j+=4) {
						pieceImages[i].pixels[j+3] = bottomFlat.pixels[j-toDo+3];
					}
					//console.log(bottomFlat.pixels[43]);
					bottomFlat.updatePixels();
					pieceImages[i].updatePixels();
					goesDown[i] = false;
				} else if (Math.random() > 0.5) {//stick out
					pieceImages[i].loadPixels();
					bottomOut.loadPixels();
					var toDo = 4 * (pieceImages[i].width) * (Math.round(pieceImages[i].height*3/5));
					for (var j = toDo; j < pieceImages[i].pixels.length; j+=4) {
						pieceImages[i].pixels[j+3] = bottomOut.pixels[j-toDo+3];
					}
					bottomOut.updatePixels();
					pieceImages[i].updatePixels();
					goesDown[i] = true;
				} else {//go in
					pieceImages[i].loadPixels();
					bottomIn.loadPixels();
					var toDo = 4 * (pieceImages[i].width) * (Math.round(pieceImages[i].height*3/5));
					for (var j = toDo; j < pieceImages[i].pixels.length; j+=4) {
						pieceImages[i].pixels[j+3] = bottomIn.pixels[j-toDo+3];
					}
					bottomIn.updatePixels();
					pieceImages[i].updatePixels();
					goesDown[i] = false;
				}
				//Left:
				if ((i%c) == 0) {//side piece
					pieceImages[i].loadPixels();
					leftFlat.loadPixels();
					var tempHeight = pieceImages[i].height;
					var tempWidth = Math.round(pieceImages[i].width*2/5);
					var tempWidth2 = pieceImages[i].width;
					var othercount = 0;
					for (var j = 0; j < tempHeight; j++) {
						for (var k = 0; k < tempWidth; k++) {
							pieceImages[i].pixels[4*(j*tempWidth2+k)+3] = leftFlat.pixels[othercount+3];
							othercount+=4;
						}
					}
					leftFlat.updatePixels();
					pieceImages[i].updatePixels();
				} else if (!goesRight[i-1]){
					pieceImages[i].loadPixels();
					leftOut.loadPixels();
					var tempHeight = pieceImages[i].height;
					var tempWidth = Math.round(pieceImages[i].width*2/5);
					var tempWidth2 = pieceImages[i].width;
					var othercount = 0;
					for (var j = 0; j < tempHeight; j++) {
						for (var k = 0; k < tempWidth; k++) {
							pieceImages[i].pixels[4*(j*tempWidth2+k)+3] = leftOut.pixels[othercount+3];
							othercount+=4;
						}
					}
					leftOut.updatePixels();
					pieceImages[i].updatePixels();
				} else {
					pieceImages[i].loadPixels();
					leftIn.loadPixels();
					var tempHeight = pieceImages[i].height;
					var tempWidth = Math.round(pieceImages[i].width*2/5);
					var tempWidth2 = pieceImages[i].width;
					var othercount = 0;
					for (var j = 0; j < tempHeight; j++) {
						for (var k = 0; k < tempWidth; k++) {
							pieceImages[i].pixels[4*(j*tempWidth2+k)+3] = leftIn.pixels[othercount+3];
							othercount+=4;
						}
					}
					leftIn.updatePixels();
					pieceImages[i].updatePixels();
				}
				//Right
				if (((i+1)%c) == 0) {//side piece
					pieceImages[i].loadPixels();
					rightFlat.loadPixels();
					var tempHeight = pieceImages[i].height;
					var tempWidth = Math.round(pieceImages[i].width*3/5);
					var tempWidth2 = pieceImages[i].width;
					var othercount = 0;
					for (var j = 0; j < tempHeight; j++) {
						for (var k = tempWidth; k < tempWidth2; k++) {
							pieceImages[i].pixels[4*(j*tempWidth2+k)+3] = rightFlat.pixels[othercount+3];
							othercount+=4;
						}
					}
					rightFlat.updatePixels();
					pieceImages[i].updatePixels();
					goesRight[i] = false;
				} else if (Math.random(0,0.5)){//go right
					pieceImages[i].loadPixels();
					rightOut.loadPixels();
					var tempHeight = pieceImages[i].height;
					var tempWidth = Math.round(pieceImages[i].width*3/5);
					var tempWidth2 = pieceImages[i].width;
					var othercount = 0;
					for (var j = 0; j < tempHeight; j++) {
						for (var k = tempWidth; k < tempWidth2; k++) {
							pieceImages[i].pixels[4*(j*tempWidth2+k)+3] = rightOut.pixels[othercount+3];
							othercount+=4;
						}
					}
					rightOut.updatePixels();
					pieceImages[i].updatePixels();
					goesRight[i] = true;
				} else {
					pieceImages[i].loadPixels();
					rightIn.loadPixels();
					var tempHeight = pieceImages[i].height;
					var tempWidth = Math.round(pieceImages[i].width*3/5);
					var tempWidth2 = pieceImages[i].width;
					var othercount = 0;
					for (var j = 0; j < tempHeight; j++) {
						for (var k = tempWidth; k < tempWidth2; k++) {
							pieceImages[i].pixels[4*(j*tempWidth2+k)+3] = rightIn.pixels[othercount+3];
							othercount+=4;
						}
					}
					rightIn.updatePixels();
					pieceImages[i].updatePixels();
					goesRight[i] = false;
				}
			}
			
			for (var i = 0; i < r*c; i++) {
				pieces[i] = newPiece(p.random(0,canvasWidth-pieceW),p.random(0,canvasHeight-pieceH),i);
				//console.log(pieceW);
			}
		};
		
		p.mouseReleased = function() {
			mouseIsReleased = true;
		}
		
		p.draw = function() {
			p.background(2,130,194);
			p.fill(255);
			if (won) {
				//console.log("Yes!");
				p.text("Congratulations! You finished the puzzle!", canvasWidth/2,canvasHeight/2);
			}
			/*if (counter < beginningTime) {
				for (var i = pieces.length-1; i >= 0; i--) {
					pieces[i].drawIt();
					pieces[i].beginningMoveIt();
				}
			} else {
				for (var i = pieces.length-1; i >= 0; i--) {
					pieces[i].drawIt();
				}
				foundOne = false;
				foundGroup = false;
				for (var i = 0; i < pieces.length; i++) {
					pieces[i].checkMoving();
				}
				if (!foundOne) {
					currentlyMoving = -1;
					for (var i = 0; i < pieces.length; i++) {
						pieces[i].moving = false;
						pieces[i].movingTimer++;
					}
				}
				if (!foundGroup) {
					currentlyMovingGroup = -2;
				}
				//console.log(pieces[0].moving+" "+pieces[1].moving);
				for (var i = 0; i < pieces.length; i++) {
					pieces[i].moveIt();
				}
				for (var i = 0; i < pieces.length; i++) {
					pieces[i].checkNeighbors();
				}
			}*/
			
			for (var i = 0; i < pieceImages.length; i++) {
				p.image(pieceImages[i], 10+(i%c)*(pieceW+120),20+Math.floor(i/c)*(pieceH+120));
			}
			
			//p.image(testing3,10,20);
			
			//p.image(puzzleImage2, canvasWidth/2,canvasHeight/2);
			
			//p.image(bottomIn, 20+pieceW-pieceImageWideW/5, 20+pieceH-pieceImageWideH/2);
			//p.image(rightIn, 20+2*pieceW-pieceImageTallW/2, 20-pieceImageTallH/5);
			//console.log(pieceImageWideH*3/2);
			//p.image(bottomFlat,10,20+pieceImageWideH*3/2);
			
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
			mouseIsReleased = false;
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
