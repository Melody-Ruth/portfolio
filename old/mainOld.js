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
	var projects = document.getElementById("ProjectsButton");
	projects.style.backgroundColor = "#dfb7eb";
	projects.style.color = "#c172d6";
	var dropdownContent = document.getElementById("dropdownContent");
	dropdownContent.style.display = "block";
	//dropdownContent.style.width = projects.getBoundingClientRect().width;
	//console.log(projects.getBoundingClientRect().width);
	//dropdownContent.style.width = "400px";
	onProjectButton = true;
}

function onDropdownHover() {
	onDropDown = true;
}

function onProjectsNotHover() {
	var projects = document.getElementById("ProjectsButton");
	projects.style.backgroundColor = "#edd0f5";
	projects.style.color = "#c790d6";
	var dropdownContent = document.getElementById("dropdownContent");
	dropdownContent.style.display = "none";
}

function onDropdownNotHover() {
	onDropDown = false;
}

/*function testing() {
	console.log("on");
}*/

/*function testingNot() {
	var projects = document.getElementById("ProjectsButton");
	projects.style.backgroundColor = "#edd0f5";
	projects.style.color = "#c790d6";
	var dropdownContent = document.getElementById("dropdownContent");
	dropdownContent.style.display = "none";
	console.log("out");
}*/

function onCaveHover() {
	
}

function onCaveNotHover() {
	
}

function caveClicked() {
	//document.location = 'contactMe/code/contactMe.htm';
}