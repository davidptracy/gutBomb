/* TO DO

slider bar
connect all the pieces

*/

var origin, width, height, margin, selected, requiredAnswers, hue;
var currentQuestion;
var exitMenu;
var navBar;
var welcomeButton;
var backButton;
var forwardButton;
var eColis;

var welcome = "Welcome";
var welcomeCopy = "Why does diversity in nature matter to your health?\n\nShare your thoughts with us!";

function preload(){
	museoSans100 = loadFont('assets/MuseoSans-100.otf');
	museoSans500 = loadFont('assets/MuseoSans-500.otf');
	museoSans700 = loadFont('assets/MuseoSans-700.otf');
	museoSans900 = loadFont('assets/MuseoSans-900.otf');
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	noCursor();
	hue = 201;
	width 	= windowWidth/6;
	// height 	= windowHeight/4;
	height 	= windowHeight/4;
	origin 	= createVector(windowWidth/2-width, windowHeight/2+150);
	welcomeButton = new WelcomeButton(origin, width*2, height, "Start", [hue, 100, 100]);
	navBar = new NavigationBar();
	backButton = new NavigationButton(createVector(50, windowHeight/2), true, -1);
	forwardButton = new NavigationButton(createVector(windowWidth-50, windowHeight/2 ), false, 1);
	exitMenu = new ExitMenu(createVector(windowWidth/2, windowHeight*.35));

	eColis = new Array();

	for (var i = 0; i < 40; i++) {
		eColi = new Ecoli( createVector( random(windowWidth), random(windowHeight) ), createVector(random(-2, -.25), random(-2, -.25)) );
		eColi.setColor([201, 100, 100]);
		eColis.push(eColi);
	};

}

function windowResized(){
	resizeCanvas(windowWidth, windowHeight);
}

function draw() {

	background(255);

	for (var i = 0; i < eColis.length; i++) {
		// var dist = map(eColis[i].location.x, -100, windowWidth + 100, 0, 360);
		// eColis[i].setColor([dist, 100,100]);
		eColis[i].update();
		eColis[i].display();
	};

	colorMode(RGB);
	fill(255,255,255,75);
	rect(0,0, windowWidth, windowHeight);

	welcomeButton.display();



	// WELCOME
	rectMode(CENTER);
	push();
		translate(0,-50);
		fill(255, 255, 255, 200);
		// noStroke();
		stroke(100, 50);
		strokeWeight(.5);
		var centerPoint = createVector( windowWidth/2, (windowHeight/2 - (windowHeight - (windowHeight/2) )/2 ) ); 
		rect( centerPoint.x, centerPoint.y, width*2, 150);
		fill(0);
		textSize(96);
		textFont(museoSans500);
		textAlign(CENTER, TOP);
		text(welcome, centerPoint.x, centerPoint.y-10, 600, 150);
	pop();


	// Instructions for survey
	push();
		translate(0,-35);
		rectMode(CENTER);
		fill(255, 255, 255, 200);
		// noStroke();
		stroke(100, 50);
		strokeWeight(.5);
		var centerPoint = createVector( windowWidth/2, (windowHeight/2)); 
		// var centerPoint = createVector( windowWidth/2, (windowHeight/2 + (windowHeight - (windowHeight/2) )/2 ) ); 
		rect( centerPoint.x, centerPoint.y, width*2, 250);
		fill(0);
		textSize(36);
		textFont(museoSans100);
		textAlign(CENTER, TOP);
		text(welcomeCopy, centerPoint.x, centerPoint.y+20, 600, 250);
	pop();

}

function mousePressed(){

	if (mouseX > welcomeButton.origin.x && mouseX <welcomeButton.origin.x+welcomeButton.width){
		if (mouseY > welcomeButton.origin.y && mouseY < welcomeButton.origin.y+welcomeButton.height){
			console.log("Welcome Button Clicked");
			welcomeButton.selected = true;

			// setTimeout(submitAnswers("http://localhost:4000/survey"), 50);
			setTimeout(window.open("/survey", "_self"), 50);
		}else {
			eColi = new Ecoli( createVector( mouseX, mouseY ), createVector(random(-2, -.25), random(-2, -.25)) );
			eColis.push(eColi);
			eColis.shift();
		}	
	} else {
		eColi = new Ecoli( createVector( mouseX, mouseY ), createVector(random(-2, -.25), random(-2, -.25)) );
		var dist = map(eColi.location.x, -100, windowWidth + 100, 0, 360);
		eColi.setColor([dist,100,100]);
		eColis.push(eColi);
		eColis.shift();
	}	
}


var checkButtons = function(callback){

	var answerString = "";

	// loop through all of the selected buttons
	for (var i = 0; i < buttons.length; i++) {
		if (buttons[i].selected){
			if (answerString.length == 0){
				// if there hasn't been anything added to the answer string, add it
				answerString = "?a"+[i]+"=1";
			} else {
				// if the answer string already has some content, include and ampersand first
				answerString.concat("&a"+[i]+"=1");
			}						
		}
	};

	console.log("http://localhost:4000/next"+answerString);
	callback("http://localhost:4000/next"+answerString);

}


function checkAnswerCount(){

	var answerCount = 0;

	for (var i = 0; i < buttons.length; i++) {
		if (buttons[i].selected) answerCount++;
	};

	if (answerCount == requiredAnswers){
		forwardButton.active = true;
	} else {
		forwardButton.active = false;
	}

}


function clearButtons(){
	for (var i = 0; i < buttons.length; i++) {
		buttons.splice(buttons[i]);
	};
}

// =================================================================
// =================== AJAX CALL TO SERVER =========================
// =================================================================

function submitAnswers(_answerString) {
  var xhttp = new XMLHttpRequest();  

  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
    	console.log (xhttp.responseText);
    }
  }

  //submit
  console.log("Sending: "+_answerString);
  xhttp.open("GET", _answerString, true);
  xhttp.send();

}