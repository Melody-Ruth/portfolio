var testingSource;

var testNumber = 5;

function setUp() {
	var imageInput = document.getElementById("toPuzzle");
	if (imageInput && imageInput.value) {
		handleImageUpload();
	}
};

//var imageW, imageH;

function handleImageUpload() {
	var readImage = document.getElementById("toPuzzle").files[0];
	
	var reader = new FileReader();
	
	reader.onload = function(e) {
      //document.getElementById("display-image").src = e.target.result;
		//testImage = new Image();
		//testImage.src = e.target.result;
		//forSize = document.getElementById("display-image");
		document.getElementById("display-image").src = e.target.result;
		testingSource = document.getElementById("display-image").src;
		document.getElementById("display-image").style.display = 'none';
		
		//imageW = forSize.width;
		//imageH = forSize.height;
		//console.log(readImage.width);
    }

	

	reader.readAsDataURL(readImage);
	
	//doStipple(readImage);
}

var settingUp = false;

function setUpPuzzle() {
	var imageInput = document.getElementById("toPuzzle");
	if (imageInput && imageInput.value) {
		settingUp = true;
		startSketch();
	}
}
/*
function showStipple() {
	document.getElementById("result-image").style.display="inline";
	document.getElementById("result-image2").style.display="inline";
}

function doStipple(srcImage) {
	handleImageUpload();
	var testingImage = document.getElementById("display-image");
	//var testingImage = srcImage;
	testingImage.onload = function(){
		var testCanvas = document.getElementById('testingCanvas');
		if (this.width > mainWidth) {
			testCanvas.height = mainWidth*this.height/this.width;
			testCanvas.width = mainWidth;
		} else {
			testCanvas.width = this.width;
			testCanvas.height = this.height;
		}
		testCanvas.getContext('2d').drawImage(this, 0, 0, testCanvas.width, testCanvas.height);
		var newCanvas = document.getElementById('newCanvas');
		newCanvas.width = testCanvas.width;
		newCanvas.height = testCanvas.height;
		var temp = testCanvas.getContext('2d');
		var temp2 = newCanvas.getContext('2d');
		console.log(testCanvas.width);
		var pixelData = temp.getImageData(0, 0, testCanvas.width, testCanvas.height);
		//var pixelData2 = temp.getImageData(0, 0, 100, 100);
		//var alphaData = pixelData2.data[3];
		//console.log(alphaData);
		temp2.putImageData(pixelData, 0, 0);
		//temp2.putImageData(pixelData2, 200, 200);
		
		var max = 0; 
        var min = 765;
        
        //find light and dark
		for (i = 0; i < pixelData.data.length; i += 4) {
			var r = pixelData.data[i]; 
            var g = pixelData.data[i+1]; 
            var b = pixelData.data[i+2];
			if (r+g+b > max) {
            	max = r+g+b;
            }
            
            if (r+g+b < min) {
            	min = r+g+b;
            }
		}
		
		//console.log(min);
		//console.log(max);
		
		for (i = 0; i < pixelData.data.length; i += 4) {
			//imgData.data[i] = 255-imgData.data[i];
			var r = pixelData.data[i]; 
            var g = pixelData.data[i+1]; 
            var b = pixelData.data[i+2];
			var brightness = r+g+b;
            brightness = (brightness-min)/(max-min);
            var probability = Math.pow(1-brightness, 1.6);
			//console.log(probability);
			
			if (Math.random() < probability) {
				pixelData.data[i] = 0;
				pixelData.data[i + 1] = 0;
				pixelData.data[i + 2] = 0;
			} else {
				pixelData.data[i] = 255;
				pixelData.data[i + 1] = 255;
				pixelData.data[i + 2] = 255;
			}
		}
		temp2.putImageData(pixelData,0,0);
		
		//document.getElementbyId('testCanvas').style.display = 'none';
		
		var resultImageUrl = testCanvas.toDataURL("image/png");
		document.getElementById('result-image').src = resultImageUrl;
		var resultImageUrl2 = newCanvas.toDataURL("image/png");
		document.getElementById('result-image2').src = resultImageUrl2;
		document.getElementById("testingCanvas").style.display="none";
		document.getElementById("result-image").style.display="none";
		document.getElementById("result-image2").style.display="none";
		console.log("Done!");
		
		showStipple();
	}
}*/