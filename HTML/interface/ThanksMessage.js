/* 
The Exit Menu Class
Requires p5.js > p5js.org
*/

// the constructor
function ThanksMessage(_origin){
	this.origin = _origin;
	this.on = false;
	this.json;

	this.imageCorrect 	= loadImage("/images/correct.png");
	this.imageIncorrect = loadImage("/images/incorrect.png");
}

ThanksMessage.prototype.display  = function(){

	var width = 750;
	var height = 700;
	var fontSize = 18;

	this.buttonWidth = width*.25;

	if (this.on){

		colorMode(HSB);
		noStroke();
		fill(255,0,90,.5);
		//the rect to mask out the screen
		rect(0,0, windowWidth, windowHeight);
		
		push();
			translate(this.origin.x, this.origin.y);
			colorMode(HSB);

			// shadow
			push();
				translate(12.5, 12.5);
				fill(0,0,86);
				rect(-width/2, -height/2, width, height);

			pop();

			fill(0,0,100);
			rect(-width/2, -height/2, width, height);

			//start of text
			translate(0,-295);

			push();
				
				fill(0);
				textSize(36);
				textFont(museoSans500);
				textAlign(CENTER, CENTER);
				text("Thank you for your time!",0,0);
			pop();

			//Review of answers
			push();
				fill(0);
				// translate(-width/2+50,75);
				translate(0,75);
				textSize(24);
				textFont(museoSans100);
				textAlign(CENTER, CENTER);
				text("Your Responses:",0,0);
			pop();

			//The Answers
			//if this.json is defined ...
			if (typeof this.json !== 'undefined') {
			    for (var i = 0; i < this.json.length; i++) {
					push();
						fill(0);
						translate(-width/2+50,125+60*i);
						textSize(fontSize);
						textFont(museoSans500);
						textAlign(LEFT, CENTER);
						text(this.json[i].question.question,0,0);

						//if it's an objective type question ...
						//compare the responses array to the correct answers array
						if ( this.json[i].question.descriptor == "objective" ){

							console.log("YOUR ANSWER ARRAY:     " + this.json[i].responses);
							console.log("CORRECT ANSWER ARRAY: " + this.json[i].question.correctAnswer);
							
							//if the user answered the question correctly, put a check mark next to the question
							push();
								translate(-35,0);

								// if (compareArrays(this.json[i].responses, ))

								if (this.json[i].responses.equals(this.json[i].question.correctAnswer)){										
									image(this.imageCorrect,0,0,25,25);
								} else {
									image(this.imageIncorrect,0,0,25,25);
								}
							pop();

							push();
								translate(0,25);
								var tempAnswers = "";
								tempAnswerLength = 0;
								var answerCount = 0;
								push();
									for (var j = 0; j < this.json[i].responses.length; j++){

										// go through the responses one by one

										tempAnswers = this.json[i].question.answers[j];
										tempAnswers = tempAnswers.replace(/\s*\(.*?\)\s*/g, '');

										// if question.correctAnswer is 0, then color it red
										if (this.json[i].question.correctAnswer[j] == 0){
											fill(0,100,60);	
											stroke(0,100,60);										
										} else {
											fill(130, 100, 60);
											stroke(130, 100, 60);
										}

										if (j > 0){
											translate(tempAnswerLength + 15, 0);
										};
										

										if (this.json[i].responses[j] == 1){
											push();		
												textFont(museoSans500);
												translate(0,fontSize/2);
												strokeWeight(3);
												line(0,0,textWidth(tempAnswers),0);
												noStroke();
											pop();
										} else {
											textFont(museoSans100);
										}

										// noStroke();
										text(tempAnswers,0,0);
										tempAnswerLength = textWidth(tempAnswers);
									};
								pop();
							pop();
						} 

						//if it's a subjective type question just list the responses
						else {							
							push();

								// if its the last question ... the map question
								if(i == this.json.length - 1){
									translate(0,25);
									tempAnswers = countrySelected;
									textFont(museoSans100);
									text(tempAnswers,0,0);		
								}

								else {
									translate(0,25);							
									//loop through responses use those as index for selected answers
									var tempAnswers = "";
									var answerCount = 0;
									for (var j = 0; j < this.json[i].responses.length; j++) {
										// console.log(this.json[i].responses[j]);
										//if a 1 is present then that was a selected answers								
										if(this.json[i].responses[j] == 1){
											if(answerCount > 0){
												tempAnswers = tempAnswers.concat(" , ");
												tempAnswers = tempAnswers.concat(this.json[i].question.answers[j]);										
											} else {
												tempAnswers = tempAnswers.concat(this.json[i].question.answers[j]);
												answerCount ++;
											}								
										}
									};
									textFont(museoSans100);
									text(tempAnswers,0,0);									
								}

							pop();
						}



					pop();
				};
			}

		pop();
	}
}

ThanksMessage.prototype.update  = function(_json){

	this.json = _json;
	// console.log(this.json[0].question.question);

	for (var i = 0; i < this.json.length; i++) {
		console.log(this.json[i].question.question);
		// console.log("CORRECT: " + this.json[i].question.correctAnswer);
		// console.log(this.json[i].responses);
	};

}

Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time 
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;       
        }           
        else if (this[i] != array[i]) { 
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;   
        }           
    }       
    return true;
}

