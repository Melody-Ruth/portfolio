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
	document.location = '../../index.htm';
}

function onContactHover() {
	var contact = document.getElementById("ContactButton");
	contact.style.backgroundColor = "#b1f0b2";
	contact.style.color = "#54ab54";
}

function onContactNotHover() {
	var contact = document.getElementById("ContactButton");
	contact.style.backgroundColor = "#d4ffd4";
	contact.style.color = "#67c267";
}

function contactClicked() {
	document.location = 'contactMe.htm';
}