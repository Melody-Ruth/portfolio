var onProjectButton = false;
var onDropDown = false;

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
	document.location = 'contactMe/code/contactMe.htm';
}

function onProjectsHover() {
	onProjectButton = true;
}

function onDropdownHover() {
	onDropDown = true;
}

function onProjectsNotHover() {
	onProjectButton = false;
}

function onDropdownNotHover() {
	onDropDown = false;
}

function mouseMoved() {
	if (!onDropDown && !onProjectButton) {
		var projects = document.getElementById("ProjectsButton");
		projects.style.backgroundColor = "#edd0f5";
		projects.style.color = "#c790d6";
		var dropdownContent = document.getElementById("dropdownContent");
		dropdownContent.style.display = "none";
	} else {
		var projects = document.getElementById("ProjectsButton");
		projects.style.backgroundColor = "#dfb7eb";
		projects.style.color = "#c172d6";
		var dropdownContent = document.getElementById("dropdownContent");
		dropdownContent.style.display = "block";
	}
}

function onCaveHover() {
	var cave = document.getElementById("CaveButton");
	cave.style.backgroundColor = "#dfb7eb";
	cave.style.color = "#c172d6";
}

function onCaveNotHover() {
	var cave = document.getElementById("CaveButton");
	cave.style.backgroundColor = "#edd0f5";
	cave.style.color = "#c790d6";
}

function caveClicked() {
	document.location = 'cave_flood/code/cave.htm';
}

function onStarHover() {
	var star = document.getElementById("StarButton");
	star.style.backgroundColor = "#dfb7eb";
	star.style.color = "#c172d6";
}

function onStarNotHover() {
	var star = document.getElementById("StarButton");
	star.style.backgroundColor = "#edd0f5";
	star.style.color = "#c790d6";
}

function starClicked() {
	document.location = 'star_wars/code/star.htm';
}