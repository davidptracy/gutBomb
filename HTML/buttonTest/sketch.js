/* TO DO

slider bar
connect all the pieces

*/

var jsonObject = {"question":{"id":"1","type":"multiple","question":"Which of the following are considered microbes?","answers":["mite","E. coli","Ebola","fruit fly","cockroach"],"image":["images/01/Ecoli.jpg","images/01/Ecoli.jpg","images/01/Ecoli.jpg","images/01/Ecoli.jpg","images/01/Ecoli.jpg"]},"responses":[],"length":14};


var jsonObject;

var created;

var origin, width, height, margin, selected, requiredAnswers, hue;

var currentQuestion;

var exitMenu;

var navBar;

var backButton;
var forwardButton;

var buttons = new Array();
var selectedAnswers = new Array();

function setup() {
	createCanvas(windowWidth, windowHeight);

	created = true;

	hue = 0;

	setupButtons();

	navBar = new NavigationBar();

	backButton = new NavigationButton(createVector(50, windowHeight/2), true, -1);
	forwardButton = new NavigationButton(createVector(windowWidth-50, windowHeight/2 ), false, 1);

	exitMenu = new ExitMenu(createVector(windowWidth/2, windowHeight*.35));

}

function draw() {
	background(255);

	displayQuestion();

	for (var i = 0; i < buttons.length; i++) {
		buttons[i].display();
	};

	navBar.display();
	backButton.display(hue);
	forwardButton.display(hue);
	exitMenu.display();
	checkAnswerCount();
	// submitButton();

}

function mousePressed(){

	if (!exitMenu.on){

		for (var i = 0; i < buttons.length; i++) {
			if (mouseX > buttons[i].origin.x && mouseX < buttons[i].origin.x+buttons[i].width){
				if (mouseY > buttons[i].origin.y && mouseY < buttons[i].origin.y+buttons[i].height){
					buttons[i].selected = !buttons[i].selected;
					if (buttons[i].selected){

					}
				}
			}
		};

		var exitButtonLocation = navBar.getButtonLocation();
		if (dist(mouseX, mouseY, exitButtonLocation.x, exitButtonLocation.y) < 75/2) exitMenu.on = !exitMenu.on;
		
		var fwdButtonLocation = forwardButton.getButtonLocation();
		if (forwardButton.active){
			if (dist(mouseX, mouseY, fwdButtonLocation.x, fwdButtonLocation.y) < 75/2) {
				// console.log("forward button clicked");

				// var answerString = "";

				// // loop through all of the selected buttons
				// for (var i = 0; i < buttons.length; i++) {
				// 	if (buttons[i].selected){
				// 		if (answerString.length < 1){
				// 			// if there hasn't been anything added to the answer string, add it
				// 			answerString.concat("?a"+[i]+"=1");
				// 			console.log(answerString);
				// 		} else {
				// 			// if the answer string already has some content, include and ampersand first
				// 			answerString.concat("&a"+[i]+"=1");
				// 		}						
				// 	}
				// };

				checkButtons(submitAnswers);

				//answers are formatted like this for now: http://localhost:3000/next?a1=a&a2=c

				// submitAnswer("answerString");
								

				// get the next quest from server


				// jsonObject = 
				// 	{"id":"1",
				// 	"type":"3",
				// 	"question":"Which of the following are considered microbes?",
				// 	"answers":["mite","E. coli","Ebola","fruit fly","cockroach"],
				// 	"images":["images/Ecoli.jpg", "images/Ecoli.jpg", "images/Ecoli.jpg", "images/Ecoli.jpg"]};
				// requiredAnswers = jsonObject.type;
				// currentQuestion = jsonObject.question;

				clearButtons();
				hue += 36;
				// console.log("Hue: "+hue);
				if (hue >= 360) hue = 0;
				// setupButtons();
			}
		}

		var backButtonLocation = backButton.getButtonLocation();
		if (dist(mouseX, mouseY, backButtonLocation.x, backButtonLocation.y) < 75/2) console.log("back button clicked");

	} else {

		var exitButtonLocations = exitMenu.getButtonLocations();

		//stuff to do for YES cancel
		if (mouseX > exitButtonLocations[0].x && mouseX < exitButtonLocations[0].x + exitMenu.buttonWidth){
			if(mouseY > exitButtonLocations[0].y && mouseY < exitButtonLocations[0].y + exitMenu.buttonHeight){
				console.log("Cancel the Survey");
			}
		}

		//stuff to do for NO cancel
		if (mouseX < exitButtonLocations[1].x && mouseX > exitButtonLocations[1].x - exitMenu.buttonWidth){
			if(mouseY > exitButtonLocations[1].y && mouseY < exitButtonLocations[1].y + exitMenu.buttonHeight){
				console.log("Don't Cancel the Survey");
				exitMenu.on = false;
			}
		}
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

	// console.log("http://localhost:4000/next"+answerString);
	callback("http://localhost:4000/next"+answerString);

}


function checkAnswerCount(){

	var answerCount = 0;

	for (var i = 0; i < buttons.length; i++) {
		if (buttons[i].selected) answerCount++;
	};

	if (requiredAnswers == 'multiple'){
		if (answerCount > 0) forwardButton.active = true;
		else forwardButton.active = false;
	} else {
		if (answerCount == requiredAnswers){
			forwardButton.active = true;
		} else {
			forwardButton.active = false;
		}		
	}


}

function displayQuestion(_question){

	push();
		translate(windowWidth/2, 65);
		translate(this.buttonWidth/2, this.buttonHeight/2);
		fill(0);
		textSize(36);
		textAlign(CENTER, CENTER);
		rectMode(CENTER);
		text(currentQuestion,0,0, windowWidth*.6, 75);	
		
		push();
			translate(0,75);
			fill(0);
			textSize(18);
			textAlign(CENTER, CENTER);
			rectMode(CENTER);
			if(requiredAnswers > 1){
				text("[ Select "+requiredAnswers+ " Answers ]",0,0, windowWidth*.6, 100);
			} else {
				text("[ Select "+requiredAnswers+ " Answer ]",0,0, windowWidth*.6, 100);
			}
			
		pop();

	pop();

}

function setupButtons(){


	if (jsonObject.question.answers.length > 4){
		height = windowHeight*.15;
	} else {
		height = windowHeight*.25;
	}

	requiredAnswers = jsonObject.question.type;
	currentQuestion = jsonObject.question.question;
	origin = createVector(windowWidth*.2, 200);
	width = windowWidth*.3;
	margin = height*.25;
	images = jsonObject.question.image;

	var selectedAnswers = new Array(jsonObject.question.answers.length);

	for (var i = 0; i < jsonObject.question.answers.length; i++) {

		// var theImage;

		// loadImage(images[i], function(img){
		// 	theImage = img;
		// 	console.log("loaded");
			
		// });

		var button = new Button(origin, width, height, jsonObject.question.answers[i], [hue, 204, 100], images[i]);
		buttons.push(button);		

		origin.x += width + margin;

		if (origin.x > windowWidth*.6) {
			origin.x = windowWidth*.2;
			origin.y += height+margin;
		} 
	};
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
    	jsonObject = JSON.parse(xhttp.responseText);
    	
    	
    	clearButtons();
    	setTimeout(setupButtons, 25);
    	// setupButtons();
    }
  }

  //submit
  console.log("Sending: "+_answerString);
  xhttp.open("GET", _answerString, true);
  xhttp.send();

}

setTimeout(function(){

	if (created){
		console.log("sending AJAX request for new survey");
		submitAnswers("/new");
	}
	created = false;
}, 25);