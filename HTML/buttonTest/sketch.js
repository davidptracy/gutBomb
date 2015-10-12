var jsonObject = 
{"id":"2",
"type":"1",
"question":"What percentage of the total number of cells in your body are microbes?",
"answers":["None","10-50%","50-100%","All of them"], 
"images":["images/Ecoli.jpg", "images/Ecoli.jpg", "images/Ecoli.jpg", "images/Ecoli.jpg"]}

var origin, width, height, margin, selected, requiredAnswers, hue;

var currentQuestion;

var exitMenu;

var navBar;

var backButton;
var forwardButton;

var buttons = new Array();

function setup() {
	createCanvas(windowWidth, windowHeight);

	hue = 0;

	//temp value


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
				}
			}
		};

		var exitButtonLocation = navBar.getButtonLocation();
		if (dist(mouseX, mouseY, exitButtonLocation.x, exitButtonLocation.y) < 75/2) exitMenu.on = !exitMenu.on;
		
		var fwdButtonLocation = forwardButton.getButtonLocation();
		if (forwardButton.active){
			if (dist(mouseX, mouseY, fwdButtonLocation.x, fwdButtonLocation.y) < 75/2) {
				console.log("forward button clicked");
				clearButtons();
				jsonObject = 
					{"id":"1",
					"type":"3",
					"question":"Which of the following are considered microbes?",
					"answers":["mite","E. coli","Ebola","fruit fly","cockroach"],
					"images":["images/Ecoli.jpg", "images/Ecoli.jpg", "images/Ecoli.jpg", "images/Ecoli.jpg"]};
				requiredAnswers = jsonObject.type;
				currentQuestion = jsonObject.question;
				hue += 36;
				console.log("Hue: "+hue);
				if (hue >= 360) hue = 0;
				setupButtons();
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

	if (jsonObject.answers.length > 4){
		height = windowHeight*.15;
	} else {
		height = windowHeight*.25;
	}

	requiredAnswers = jsonObject.type;
	currentQuestion = jsonObject.question;
	origin = createVector(windowWidth*.2, 200);
	width = windowWidth*.3;
	margin = height*.25;
	images = jsonObject.images;

	for (var i = 0; i < jsonObject.answers.length; i++) {

		var button = new Button(origin, width, height, jsonObject.answers[i], [hue, 204, 100], images[i]);
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

function submitAnswers() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
     document.getElementById("demo").innerHTML = xhttp.responseText;
    }
  }

  //submit
  xhttp.open("GET", "ajax_info.txt", true);
  xhttp.send();

}


// =================================================================
// ======================= JSON PARSING ============================
// =================================================================

// var response;
// var question 		= response.id;
// var numberOfAnswers	= 2;
// var question 		= response.question;
// var answers 		= response.answers;
// var images			= response.images;

// pull answers from response.answers array
// pull images from response.images array 