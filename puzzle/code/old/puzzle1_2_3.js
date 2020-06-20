//Created by Melody Ruth. Licensed under Attribution-NonCommercial-ShareAlike 3.0 Unported (CC BY-NC-SA 3.0)

//Puzzle pieces can't fully leave canvas. r & c inputted by user (mostly in index.htm and puzzleWeb.js)

function startSketch(){
	var sketch = function(p) {
		var counter = 0;
		var mouseIsReleased = false;
		//var mouseIsHeld = false;
		var notCropped;
		var puzzleImage;
		var puzzleImage2;
		var newOne = false;
		var numPieces = 6;//3x2
		/*var r = 8;
		var c = 10;*/
		var imageW;
		var imageH;
		var pieceW;
		var pieceH;
		var margin = 6;
		var beginningTime = 25;
		
		var won = false;
		
		var pieceImages = [];
		var topOut = [];
		var leftOut = [];
		var rightOut = [];
		var bottomOut = [];
		var pieces = [];
		var groups = [];
		var goesDown = [];
		var downX = [];
		var downType = [];
		var goesRight = [];
		var rightY = [];
		var rightType = [];
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
		var knobW;
		var knobH;
		
		var testing3;
		
		var testSound;
		
		p.preload = function() {
			notCropped = p.loadImage(testingSource);
			
			topOut[0] = p.loadImage("graphics/top_out.png");
			topOut[1] = p.loadImage("graphics/top_out2.png");
			topOut[2] = p.loadImage("graphics/top_out3.png");
			rightOut[0] = p.loadImage("graphics/right_out.png");
			rightOut[1] = p.loadImage("graphics/right_out2.png");
			rightOut[2] = p.loadImage("graphics/right_out3.png");
			leftOut[0] = p.loadImage("graphics/left_out.png");
			leftOut[1] = p.loadImage("graphics/left_out2.png");
			leftOut[2] = p.loadImage("graphics/left_out3.png");
			bottomOut[0] = p.loadImage("graphics/bottom_out.png");
			bottomOut[1] = p.loadImage("graphics/bottom_out2.png");
			bottomOut[2] = p.loadImage("graphics/bottom_out3.png");
			
			testing3 = p.loadImage("graphics/testing3.png");
			
			testSound = p.loadSound("graphics/testing.m4a");
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
				p.image(pieceImages[this.index],this.x-pieceImageTallW/2,this.y-pieceImageWideH/2);
				//console.log(this.x,this.y);
			};
			piece.beginningMoveIt = function() {
				this.x += this.xSpeed;
				this.y += this.ySpeed;
			};
			piece.checkMoving = function() {
				/*if ((currentlyMoving == -1 || currentlyMoving == this.index || currentlyMovingGroup == this.groupIndex) && p.mouseIsPressed && p.pmouseX > this.x && p.pmouseX < this.x+pieceW && p.pmouseY > this.y && p.pmouseY < this.y+pieceH) {
					this.moving = true;
					currentlyMoving = this.index;
					foundOne = true;
					if (this.groupIndex > -1) {
						groups[this.groupIndex].setInMotion();
					}
					this.movedTimer = 0;
				} else */if ((currentlyMoving == -1 || currentlyMoving == this.index || currentlyMovingGroup == this.groupIndex) && 
				p.mouseIsPressed && p.pmouseX > this.x-pieceImageTallW/2 && p.pmouseX < this.x+pieceW+pieceImageTallW/2 && 
				p.pmouseY > this.y-pieceImageWideH/2 && p.pmouseY < this.y+pieceH+pieceImageWideH/2 && pieceImages[this.index].get(p.pmouseX-this.x+Math.round(pieceImageTallW/2),p.pmouseY-this.y+Math.round(pieceImageWideH/2))[3] == 255
				&& p.mouseX > 0 && p.mouseX < canvasWidth && p.mouseY > 0 && p.mouseY < canvasHeight) {
					this.moving = true;
					currentlyMoving = this.index;
					foundOne = true;
					if (this.groupIndex > -1) {
						groups[this.groupIndex].setInMotion();
					}
					this.movedTimer = 0;
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
						testSound.play();
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
						testSound.play();
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
			canvasWidth = Math.round(windowWidth*0.9);
			canvasHeight = Math.round(windowHeight*0.8);
			//canvasHeight = 600;
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
			var sizeScale = Math.min(1,canvasWidth*0.8/notCropped.width,canvasHeight*0.8/notCropped.height);
			imageW = Math.round(notCropped.width*sizeScale);
			imageH = Math.round(notCropped.height*sizeScale);
			notCropped.resize(imageW,imageH);
			var newW = Math.floor(imageW/(c*knobW))*c*knobW;
			var newH = Math.floor(imageH/(r*knobH))*r*knobH;
			newW = Math.floor(imageW/(c*3))*c*3;
			newH = Math.floor(imageH/(r*3))*r*3;
			//newW = Math.floor(newW/knobW)*knobW;
			//newH = Math.floor(newH/knobH)*knobH;
			puzzleImage = p.createImage(newW, newH);
			puzzleImage.copy(notCropped,0,0,newW,newH,0,0,newW,newH);
			
			//console.log(testingSource);
			pieceW = puzzleImage.width/c;
			pieceH = puzzleImage.height/r;
			//console.log(pieceH);
			
			pieceImageWideW = Math.round(pieceW*5/3);
			pieceImageWideH = Math.round(pieceH*2/3);
			pieceImageTallW = Math.round(pieceW*2/3);
			pieceImageTallH = Math.round(pieceH*5/3);
			
			knobW = Math.round(pieceW/3);
			knobH = Math.round(pieceH/3);
			for (var i = 0; i < topOut.length; i++) {
				topOut[i].resize(knobW,knobH);
			}
			for (var i = 0; i < rightOut.length; i++) {
				rightOut[i].resize(knobW,knobH);
			}
			for (var i = 0; i < leftOut.length; i++) {
				leftOut[i].resize(knobW,knobH);
			}
			for (var i = 0; i < bottomOut.length; i++) {
				bottomOut[i].resize(knobW,knobH);
			}
			
			puzzleImage2 = p.createImage(newW+knobW*2,newH+knobH*2);
			puzzleImage2.loadPixels();
			for (var i = 0; i < puzzleImage2.pixels.length; i+=4) {
				puzzleImage2.pixels[i] = 255;
				puzzleImage2.pixels[i+1] = 255;
				puzzleImage2.pixels[i+2] = 255;
				puzzleImage2.pixels[i+3] = 255;
			}
			puzzleImage2.updatePixels();
			puzzleImage2.copy(puzzleImage,0,0,imageW,imageH,knobW,knobH,imageW,imageH);
			
			//Make puzzle pieces
			
			for (var i = 0; i < r*c; i++) {
				pieceImages[i] = p.createImage(pieceImageWideW,pieceImageTallH);
				pieceImages[i].copy(puzzleImage2,(i%c)*pieceW,Math.floor(i/c)*pieceH,pieceImageWideW,pieceImageTallH,0,0,pieceImageWideW,pieceImageTallH);
				//Start with border invisible:
				var tempWidth = pieceImages[i].width;
				var tempHeight = pieceImages[i].height;
				var othercount = 0;
				pieceImages[i].loadPixels();
				for (var j = 0; j < pieceImageTallH; j++) {
					for (var k = 0; k < knobW; k++) {
						pieceImages[i].pixels[4*(j*tempWidth+k)+3] = 0;
					}
				}
				for (var j = 0; j < pieceImageTallH; j++) {
					for (var k = tempWidth-knobW; k < tempWidth; k++) {
						pieceImages[i].pixels[4*(j*tempWidth+k)+3] = 0;
					}
				}
				for (var j = 0; j < knobH; j++) {
					for (var k = knobW; k < tempWidth-knobW; k++) {
						pieceImages[i].pixels[4*(j*tempWidth+k)+3] = 0;
					}
				}
				for (var j = tempHeight-knobH; j < tempHeight; j++) {
					for (var k = knobW; k < tempWidth-knobW; k++) {
						pieceImages[i].pixels[4*(j*tempWidth+k)+3] = 0;
					}
				}
				//Top:
				if (i < c) {
					//It's a top piece. We're done here!
				} else if (goesDown[i-c]) {
					//The one above us goes out, so we need to go in
					othercount = 0;
					bottomOut[downType[i-c]].loadPixels();
					for (var j = knobH; j < knobH*2; j++) {
						for (var k = downX[i-c]; k < downX[i-c]+knobW; k++) {
							pieceImages[i].pixels[4*(j*tempWidth+k)+3] = 255-bottomOut[downType[i-c]].pixels[othercount+3];
							othercount+=4;
						}
					}
					bottomOut[downType[i-c]].updatePixels();
				} else {
					//The one above us goes in, so we need to go out
					othercount = 0;
					topOut[downType[i-c]].loadPixels();
					for (var j = 0; j < knobH; j++) {
						for (var k = downX[i-c]; k < downX[i-c]+knobW; k++) {
							pieceImages[i].pixels[4*(j*tempWidth+k)+3] = topOut[downType[i-c]].pixels[othercount+3];
							othercount+=4;
						}
					}
					topOut[downType[i-c]].updatePixels();
				}
				//Bottom:
				if (i >= (r-1)*c) {
					goesDown[i] = false;
					//It's a bottom piece. We're done here!
				} else if (Math.random() < 0.5) {
					//We're going to go in!
					othercount = 0;
					goesDown[i] = false;
					var maxX = Math.round(knobW*5/2);
					var minX = Math.round(knobW*3/2);
					if (i % c != 0 && goesRight[i-1] && rightY[i-1] > 2*knobH) {
						minX = knobW*2;
					}
					downX[i] = Math.round(p.random(minX,maxX));
					downType[i] = Math.floor(p.random(topOut.length));
					topOut[downType[i]].loadPixels();
					for (var j = tempHeight-knobH*2; j < tempHeight-knobH; j++) {
						for (var k = downX[i]; k < downX[i]+knobW; k++) {
							pieceImages[i].pixels[4*(j*tempWidth+k)+3] = 255-topOut[downType[i]].pixels[othercount+3];
							othercount+=4;
						}
					}
					topOut[downType[i]].updatePixels();
				} else {
					//We're going to go out!
					othercount = 0;
					goesDown[i] = true;
					downX[i] = Math.round(p.random(Math.round(knobW*3/2),Math.round(knobW*5/2)));
					downType[i] = Math.floor(p.random(topOut.length));
					//console.log(downType[i]);
					bottomOut[downType[i]].loadPixels();
					//console.log(downX[i]);
					for (var j = tempHeight-knobH; j < tempHeight; j++) {
						for (var k = downX[i]; k < downX[i]+knobW; k++) {
							pieceImages[i].pixels[4*(j*tempWidth+k)+3] = bottomOut[downType[i]].pixels[othercount+3];
							othercount+=4;
						}
					}
					bottomOut[downType[i]].updatePixels();
				}
				//Left:
				if (i % c == 0) {
					//It's a side piece. We're done here!
				} else if (goesRight[i-1]) {
					//The one to the left of us goes out, so we need to go in
					othercount = 0;
					rightOut[rightType[i-1]].loadPixels();
					for (var j = rightY[i-1]; j < rightY[i-1]+knobH; j++) {
						for (var k = knobW; k < knobW*2; k++) {
							pieceImages[i].pixels[4*(j*tempWidth+k)+3] = 255-rightOut[rightType[i-1]].pixels[othercount+3];
							othercount+=4;
						}
					}
					rightOut[rightType[i-1]].updatePixels();
				} else {
					//The one to the left of us goes in, so we need to go out
					othercount = 0;
					leftOut[rightType[i-1]].loadPixels();
					for (var j = rightY[i-1]; j < rightY[i-1]+knobH; j++) {
						for (var k = 0; k < knobW; k++) {
							pieceImages[i].pixels[4*(j*tempWidth+k)+3] = leftOut[rightType[i-1]].pixels[othercount+3];
							othercount+=4;
						}
					}
					leftOut[rightType[i-1]].updatePixels();
				}
				//Right:
				if ((i+1) % c == 0) {
					goesRight[i] = false;
					//It's a side piece. We're done here!
				} else if (Math.random() < 0.5) {
					//We're going to go in!
					othercount = 0;
					goesRight[i] = false;
					var maxY = Math.round(knobH*5/2);
					var minY = Math.round(knobH*3/2);
					if (i >= c && goesDown[i-c] && downX[i-c] > 2*knobW) {
						minY = knobH*2;
					}
					if (i < (r-1)*c && !goesDown[i] && downX[i] > 2*knobW) {
						maxY = knobH*2;
					}
					rightY[i] = Math.round(p.random(minY,maxY));
					//rightY[i] = Math.round(p.random(Math.round(knobH*3/2),Math.round(knobH*5/2)));
					rightType[i] = Math.floor(p.random(rightOut.length));
					leftOut[rightType[i]].loadPixels();
					for (var j = rightY[i]; j < rightY[i]+knobH; j++) {
						for (var k = tempWidth-knobW*2; k < tempWidth-knobW; k++) {
							pieceImages[i].pixels[4*(j*tempWidth+k)+3] = 255-leftOut[rightType[i]].pixels[othercount+3];
							othercount+=4;
						}
					}
					leftOut[rightType[i]].updatePixels();
				} else {
					//We're going to go out!
					othercount = 0;
					goesRight[i] = true;
					var maxY = Math.round(knobH*5/2);
					var minY = Math.round(knobH*3/2);
					if (i >= c && goesDown[i-c+1] && downX[i-c+1] < 2*knobW) {
						minY = 2*knobH;
					}
					rightY[i] = Math.round(p.random(minY,maxY));
					rightType[i] = Math.floor(p.random(rightOut.length));
					rightOut[rightType[i]].loadPixels();
					for (var j = rightY[i]; j < rightY[i]+knobH; j++) {
						for (var k = tempWidth-knobW; k < tempWidth; k++) {
							pieceImages[i].pixels[4*(j*tempWidth+k)+3] = rightOut[rightType[i]].pixels[othercount+3];
							othercount+=4;
						}
					}
					rightOut[rightType[i]].updatePixels();
				}
				pieceImages[i].updatePixels();
			}
			
			for (var i = 0; i < r*c; i++) {
				pieces[i] = newPiece(p.random(0,canvasWidth-pieceW),p.random(0,canvasHeight-pieceH),i);
				//console.log(pieceW);
			}
		};
		
		p.mouseReleased = function() {
			mouseIsReleased = true;
			mouseIsHeld = false;
			//console.log("done");
		}
		
		/*p.mousePressed = function() {
			if (p.mouseX > 0 && p.mouseX < canvasWidth && p.mouseY > 0 && p.mouseY < canvasHeight) {
				mouseIsHeld = true;
			}
			//mouseIsHeld = true;
			//console.log("hi");
		}*/
		
		p.draw = function() {
			p.background(2,130,194);
			p.fill(255);
			if (won) {
				//console.log("Yes!");
				p.text("Congratulations! You finished the puzzle!", canvasWidth/2,canvasHeight/2);
			}
			/*if (p.mouseX < 0 || p.mouseX > canvasWidth || p.mouseY < 0 || p.mouseY > canvasHeight) {
				mouseIsHeld = false;
			}*/
			if (counter < beginningTime) {
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
			}
			
			/*for (var i = 0; i < pieceImages.length; i++) {
				p.image(pieceImages[i], 10+(i%c)*(pieceW+120),20+Math.floor(i/c)*(pieceH+120));
			}*/
			
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
			//console.log(mouseIsHeld);
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
