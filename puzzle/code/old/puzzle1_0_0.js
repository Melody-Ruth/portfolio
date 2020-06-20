//Created by Melody Ruth. Licensed under Attribution-NonCommercial-ShareAlike 3.0 Unported (CC BY-NC-SA 3.0)

//Image split into r*c movable pieces that "click" together. When you have finished the puzzle, celebratory text displays on the screen.

function startSketch(){
	var sketch = function(p) {
		var counter = 0;
		var mouseIsReleased = false;
		var puzzleImage;
		var newOne = false;
		var numPieces = 6;//3x2
		var r = 2;
		var c = 3;
		var pieceW;
		var pieceH;
		var margin = 6;
		
		var won = false;
		
		var pieceImages = [];
		var pieces = [];
		var groups = [];
		var nextGroup = 0;
		var testImage;
		var currentlyMoving = -1;
		var currentlyMovingGroup = -2;
		var foundOne = false;
		var foundGroup = false;
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
			piece.groupIndex = -1;
			piece.movedTimer = 0;
			if (index % c != 0) {
				piece.leftIndex = index-1;
			} else {
				piece.leftIndex = -1;
			}
			/*if (index % c != c-1) {
				piece.rightIndex = index+1;
			} else {
				piece.rightIndex = -1;
			}*/
			if (index >= c) {
				piece.topIndex = index-c;
			} else {
				piece.topIndex = -1;
			}
			/*if (index < r*(c-1)) {
				piece.bottomIndex = index+c;
			} else {
				piece.bottomIndex = -1;
			}*/
			piece.leftDone = false;
			//piece.rightDone = false;
			piece.topDone = false;
			//piece.bottomDone = false;
			piece.drawIt = function() {
				p.image(pieceImages[this.index],this.x,this.y);
				//console.log(this.x,this.y);
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
			//p.text(newOne,50,50);
			
			//p.image(puzzleImage,300,300);
			/*for (var i = 0; i < pieceImages.length; i++) {
				//p.image(pieceImages[i], 10+(i%c)*(pieceW+10),20+Math.floor(i/c)*(pieceH+10));
			}*/
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
