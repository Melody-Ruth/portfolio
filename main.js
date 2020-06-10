var onProjectButton = false;
var onDropDown = false;

function onHomeHover() {
	var home = document.getElementById("HomeButton");
	home.style.backgroundColor = getComputedStyle(document.body).getPropertyValue('--blue2');
	home.style.color = getComputedStyle(document.body).getPropertyValue('--blue4');
}

function onHomeNotHover() {
	var home = document.getElementById("HomeButton");
	home.style.backgroundColor = getComputedStyle(document.body).getPropertyValue('--blue1');
	home.style.color = getComputedStyle(document.body).getPropertyValue('--blue3');
}

function homeClicked() {
	document.location = 'index.htm';
}

function onContactHover() {
	var contact = document.getElementById("ContactButton");
	contact.style.backgroundColor = getComputedStyle(document.body).getPropertyValue('--green2');
	contact.style.color = getComputedStyle(document.body).getPropertyValue('--green4');
}

function onContactNotHover() {
	var contact = document.getElementById("ContactButton");
	contact.style.backgroundColor =  getComputedStyle(document.body).getPropertyValue('--green1');
	contact.style.color =  getComputedStyle(document.body).getPropertyValue('--green3');
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
		projects.style.backgroundColor = getComputedStyle(document.body).getPropertyValue('--purple1');
		projects.style.color = getComputedStyle(document.body).getPropertyValue('--purple3');
		var dropdownContent = document.getElementById("dropdownContent");
		dropdownContent.style.display = "none";
	} else {
		var projects = document.getElementById("ProjectsButton");
		projects.style.backgroundColor = getComputedStyle(document.body).getPropertyValue('--purple2');
		projects.style.color = getComputedStyle(document.body).getPropertyValue('--purple4');
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

function onArcheryHover() {
	var archery = document.getElementById("ArcheryButton");
	archery.style.backgroundColor = "#dfb7eb";
	archery.style.color = "#c172d6";
}

function onArcheryNotHover() {
	var archery = document.getElementById("ArcheryButton");
	archery.style.backgroundColor = "#edd0f5";
	archery.style.color = "#c790d6";
}

function archeryClicked() {
	document.location = 'archery/code/archery.htm';
}

function onArtHover() {
	var art = document.getElementById("ArtButton");
	art.style.backgroundColor = "#dfb7eb";
	art.style.color = "#c172d6";
}

function onArtNotHover() {
	var art = document.getElementById("ArtButton");
	art.style.backgroundColor = "#edd0f5";
	art.style.color = "#c790d6";
}

function artClicked() {
	document.location = 'art_studio/code/Art_Studio.htm';
}
