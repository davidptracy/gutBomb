/* TO DO
slider bar
*/

var jsonObject = {"question":{"id":"1","type":"multiple","question":"Which of the following are considered microbes?","answers":["mite","E. coli","Ebola","fruit fly","cockroach"],"image":["images/01/Ecoli.jpg","images/01/Ecoli.jpg","images/01/Ecoli.jpg","images/01/Ecoli.jpg","images/01/Ecoli.jpg"]},"responses":[],"length":17};
var created;
var origin, width, height, margin, selected, requiredAnswers, hue;
var currentQuestion;
var currentQuestionId;
var totalQuestions;
var exitMenu;
var navBar;
var backButton;
var forwardButton;
var thankYou;
var buttons = new Array();
var selectedAnswers = new Array();
var lastButtonSelected;
var idleTime;
var countdown;
var map;
var countrySelected;
var gol;
var lastAnswerArray = new Array();

function setup() {
	createCanvas(windowWidth, windowHeight);
	created = true;
	hue = 0;
	setupButtons();
	navBar = new NavigationBar();
	backButton = new NavigationButton(createVector(50, windowHeight/2), true, -1);
	forwardButton = new NavigationButton(createVector(windowWidth-50, windowHeight/2 ), false, 1);
	exitMenu = new ExitMenu(createVector(windowWidth/2, windowHeight*.35));
	thankYou = new ThanksMessage(createVector(windowWidth/2, windowHeight*.35));
	currentQuestionId = parseInt(jsonObject.question.id);
	totalQuestions  = parseInt(jsonObject.length);
	idleTime = 0;
	countdown = true;
  	gol = new GOL();

	map = document.getElementById("vmap");
	map.style.visibility = "hidden";


}

function draw() {
	background(255);
	gol.generate();

	push();
		// translate(windowWidth/8, windowWidth/8);
    	gol.display();
    pop();

	displayQuestion();
	for (var i = 0; i < buttons.length; i++) {
		buttons[i].display();
	};

	navBar.update(totalQuestions, currentQuestionId);	
	navBar.display();
	if (currentQuestionId > 1){
		backButton.display(hue);		
	}

	if (currentQuestionId == totalQuestions){		
		map.style.visibility = "visible";
		forwardButton.submitActive = true;
		forwardButton.display();
	} else {
		forwardButton.submitActive = false;
		forwardButton.display(hue);
	}
	
	exitMenu.display();
	thankYou.display();
	checkAnswerCount();


	if (thankYou.on){
		if (idleTime > 5){
			idleTime = 0;
			submitAnswers('/reset');
			setTimeout(window.open("http://localhost:4000/", "_self"), 5);
		}
	}
}

function mousePressed(){

	if (!exitMenu.on){

		idleTime = 0;

		for (var i = 0; i < buttons.length; i++) {
			if (mouseX > buttons[i].origin.x && mouseX < buttons[i].origin.x+buttons[i].width){
				if (mouseY > buttons[i].origin.y && mouseY < buttons[i].origin.y+buttons[i].height){
					buttons[i].selected = !buttons[i].selected;
					if (buttons[i].selected){
						if (forwardButton.active && requiredAnswers !== 'multiple'){
							if (lastAnswerArray[currentQuestionId-1] && clickCount == 0){
								clickCount ++;
								console.log(clickCount);
								console.log('we have stored content!');
								console.log(lastAnswerArray[currentQuestionId-1]);
								buttons[lastAnswerArray[currentQuestionId-1]].selected = false;
							} else {
								buttons[lastButtonSelected].selected = false;
							}							
						}
						lastButtonSelected = i;
						console.log("Last Button Selected = " + lastButtonSelected);
					}
				}
			}
		};

		var exitButtonLocation = navBar.getButtonLocation();
		if (dist(mouseX, mouseY, exitButtonLocation.x, exitButtonLocation.y) < 75/2) exitMenu.on = !exitMenu.on;
		
		var fwdButtonLocation = forwardButton.getButtonLocation();
		if (forwardButton.active){
			if (dist(mouseX, mouseY, fwdButtonLocation.x, fwdButtonLocation.y) < 75/2) {
				
				if (currentQuestionId == totalQuestions){
					//display thank you message for 5 seconds
					thankYou.on = true;
					checkAnswers(submitAnswers);
					// setTimeout(submitAnswers('/reset'), 10000);
					// setTimeout(window.open("http://localhost:4000/", "_self"), 10100);
				}

				if (lastAnswerArray[currentQuestionId-1]){
					lastAnswerArray[currentQuestionId-1] = lastButtonSelected;
				} else {
					lastAnswerArray.push(lastButtonSelected);
				}
				
				checkAnswers(submitAnswers);
				clearButtons();
				hue += 36;

				console.log("Hue: "+hue);

				if (hue > 200 && hue < 260){
					hue = 288;
				}

				if (hue >= 360) hue = 0;
			}
		}

		var backButtonLocation = backButton.getButtonLocation();
		if (dist(mouseX, mouseY, backButtonLocation.x, backButtonLocation.y) < 75/2){
			if (currentQuestionId > 1){
				console.log("back button clicked");
				submitAnswers('http://localhost:4000/back');
				clearButtons();
				hue -= 36;						
			}
		} 



	} else {

		var exitButtonLocations = exitMenu.getButtonLocations();

		//stuff to do for YES cancel
		if (mouseX > exitButtonLocations[0].x && mouseX < exitButtonLocations[0].x + exitMenu.buttonWidth){
			if(mouseY > exitButtonLocations[0].y && mouseY < exitButtonLocations[0].y + exitMenu.buttonHeight){
				console.log("Cancel the Survey");
				submitAnswers('/reset');
				setTimeout(window.open("http://localhost:4000/", "_self"), 5);
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


var checkAnswers = function(callback){

	/// slider identifier answer = 11 ??

	var answerString = "";

	if (currentQuestionId == totalQuestions){
		answerString = countrySelected;
		console.log(countrySelected);
		callback("http://localhost:4000/next?a1="+escape(answerString));	
	} else {
		// loop through all of the selected buttons
		for (var i = 0; i < buttons.length; i++) {
			if (buttons[i].selected){

				if (answerString.length == 0){
					// if there hasn't been anything added to the answer string, add it
					answerString = "?a"+[i+1]+"=1";
				} else {
					// if the answer string already has some content, include and ampersand first
					answerString+="&a"+[i+1]+"=1";
				}						
			}else{
				if (answerString.length == 0){
					// if there hasn't been anything added to the answer string, add it
					answerString = "?a"+[i+1]+"=0";
				} else {
					// if the answer string already has some content, include and ampersand first
					answerString+="&a"+[i+1]+"=0";
				}			
			}
		};

		// console.log("http://localhost:4000/next"+answerString);
		callback("http://localhost:4000/next"+answerString);
	    gol.init();

	}

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
		textSize(32);
		textAlign(CENTER, CENTER);
		rectMode(CENTER);
		text(currentQuestion,0,0, windowWidth*.85, 75);	
		
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


// =================================================================
// ====================== ANSWER BUTTONS ===========================
// =================================================================


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

		var button = new Button(origin, width, height, jsonObject.question.answers[i], [hue, 204, 100], images[i]);
		buttons.push(button);		

		origin.x += width + margin;

		if (origin.x > windowWidth*.6) {
			origin.x = windowWidth*.2;
			origin.y += height+margin;
		} 
	};

	checkSelected();
}

function checkSelected(){

	for (var i = 0; i < jsonObject.responses.length; i++) {
		var response = jsonObject.responses[i];
		if (response == '1'){
			buttons[i].selected = true;
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

    	currentQuestionId = parseInt(jsonObject.question.id); 

    	clickCount = 0;   	
    	
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


// Initial request to start survey
setTimeout(function(){
	if (created){
		console.log("sending AJAX request for new survey");
		submitAnswers("/new");
	}
	created = false;
}, 25);


// =================================================================
// ======================== IDLE TIMER =============================
// =================================================================

/*		After 30 seconds, if there hasn't been any activity
*/

setInterval(timerIncrement, 1000);	

function timerIncrement(){

	if (countdown){
		if (idleTime < 30){
			idleTime ++;
			console.log(idleTime);		
		} 	else  {
			//reset the page
			idleTime = 0;
			submitAnswers('/reset');
			setTimeout(window.open("http://localhost:4000/", "_self"), 5);
		}		
	}
}


// =================================================================
// ======================== SUBMIT TIMER ===========================
// =================================================================

if (thankYou.on){
	submitAnswers('/reset');
	setTimeout(window.open("http://localhost:4000/", "_self"), 5000);
}


