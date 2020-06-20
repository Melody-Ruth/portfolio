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
	document.location = '../../index.htm';
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
	document.location = '../../contactMe/code/contactMe.htm';
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

function puzzleClicked() {
	document.location = '../../puzzle/code/puzzle.htm';
}
function caveClicked() {
	document.location = '../../cave_flood/code/cave.htm';
}
function stippleClicked() {
	document.location = '../../stipple/code/stipple.htm';
}
function starClicked() {
	document.location = '../../star_wars/code/star.htm';
}
function archeryClicked() {
	document.location = '../../archery/code/archery.htm';
}
function artClicked() {
	document.location = '../../art_studio/code/Art_Studio.htm';
}
function fishClicked() {
	document.location = '../../fish_collector/code/fishCollector.htm';
}
function gingerbreadClicked() {
	document.location = '../../gingerbread/code/gingerbread.htm';
}
function EoMClicked() {
	document.location = '../../elements_of_magic/code/Elements_of_Magic.htm';
}