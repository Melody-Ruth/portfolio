function onHomeHover() {
	var home = document.getElementById("HomeButton");
	home.style.backgroundColor = "#97ccf7";
	home.style.color = "#005fad";
}

function onHomeNotHover() {
	var home = document.getElementById("HomeButton");
	home.style.backgroundColor = "#c7e6ff";
	home.style.color = "#0275d4";
}

function homeClicked() {
	document.location = 'index.htm';
}