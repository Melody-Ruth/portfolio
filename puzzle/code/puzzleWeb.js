//Created by Melody Ruth. Licensed under Attribution-NonCommercial-ShareAlike 3.0 Unported (CC BY-NC-SA 3.0)

var testingSource;

var testNumber = 5;

var windowWidth, windowHeight;

var bgColor = '#0282c2';

var savedPuzzle;

var imageTooLarge;

function setUp() {
	var imageInput = document.getElementById("toPuzzle");
	if (imageInput && imageInput.value) {
		handleImageUpload();
	}
	windowWidth = window.innerWidth;
	windowHeight = window.innerHeight;
	
	var rowsInput = document.getElementById("inputRows");
	rowsInput.defaultValue = 3;
	rowsInput.max = 16;
	rowsInput.min = 1;
	if (rowsInput && rowsInput.value) {
		r = rowsInput.value;
	}
	
	var columnsInput = document.getElementById("inputColumns");
	columnsInput.defaultValue = 4;
	columnsInput.max = 16;
	columnsInput.min = 1;
	if (columnsInput && columnsInput.value) {
		c = columnsInput.value;
	}
	
	var colorInput = document.getElementById("bgColor");
	colorInput.defaultValue = '#0282c2';
	bgColor = colorInput.value;
};

function handleSizeInput() {
	var rowsInput = document.getElementById("inputRows");
	r = rowsInput.value;
	var columnsInput = document.getElementById("inputColumns");
	c = columnsInput.value;
};

function bgButton() {
	var colorInput = document.getElementById("bgColor");
	bgColor = colorInput.value;
}

function handleResize() {
	windowWidth = window.innerWidth;
	windowHeight = window.innerHeight;
};

function handleImageUpload() {
	var readImage = document.getElementById("toPuzzle").files[0];
	
	var reader = new FileReader();
	
	reader.onload = function(e) {
      //document.getElementById("display-image").src = e.target.result;
		//testImage = new Image();
		//testImage.src = e.target.result;
		document.getElementById("display-image").src = e.target.result;
		testingSource = document.getElementById("display-image").src;
		document.getElementById("display-image").style.display = 'none';
    }

	reader.readAsDataURL(readImage);
	
	//doStipple(readImage);
}

var settingUp = false;

function loadPuzzle() {
	if (savedPuzzle == "true") {
		settingUp = true;
		startSketch(true);
	} else {
		alert("You don't have a saved puzzle to load");
	}
}

function setStored() {
	savedPuzzle = "true";
	var d = new Date();
	d.setTime(d.getTime() + (90*24*60*60*1000));
	var expires = "expires="+ d.toUTCString();
	document.cookie = "savedPuzzle=true; expires="+expires/*Sat, 25 July 2020 09:55:00 PST*/+"; sameSite=Strict; path=/";
}

function setBGColor() {
	var colorInput = document.getElementById("bgColor");
	colorInput.value = bgColor;
}

function setUpPuzzle() {
	var rowsInput = document.getElementById("inputRows");
	r = rowsInput.value;
	var columnsInput = document.getElementById("inputColumns");
	c = columnsInput.value;
	
	var imageInput = document.getElementById("toPuzzle");
	if (imageInput && imageInput.value && r > 0 && r < 17 && c > 0 && c < 17) {
		settingUp = true;
		startSketch(false);
	}
	if (!imageInput.value) {
		alert("Please choose an image");
	} else if (r <= 0 || r >= 17) {
		alert("Please choose a valid number (between 1 and 16) for the number of rows");
	} else if (c <= 0 || c >= 17) {
		alert("Please choose a valid number (between 1 and 16) for the number of columns");
	}
}