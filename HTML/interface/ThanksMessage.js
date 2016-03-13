/* 
The Exit Menu Class
Requires p5.js > p5js.org
*/

// the constructor
function ThanksMessage(_origin){
	this.origin = _origin;
	this.on = false;
	this.json;
}

ThanksMessage.prototype.display  = function(){

	var width = 750;
	var height = 600;

	this.buttonWidth = width*.25;

	if (this.on){

		colorMode(HSB);
		noStroke();
		fill(255,0,90,.5);
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

			translate(0,-225);

			push();
				// translate(0, 0);
				fill(0);
				textSize(36);
				textFont(museoSans100);
				textAlign(CENTER, CENTER);
				text("Thank you for your time!",0,0);
			pop();

			//Review of answers
			push();
				fill(0);
				// translate(-width/2+50,75);
				translate(0,75);
				textSize(18);
				textFont(museoSans500);
				textAlign(CENTER, CENTER);
				text("Your Responses:",0,0);
			pop();

			//The Answers
			//if this.json is defined ...
			if (typeof this.json !== 'undefined') {
			    for (var i = 0; i < this.json.length; i++) {
					push();
						fill(0);
						translate(-width/2+50,125+50*i);
						textSize(18);
						textFont(museoSans500);
						textAlign(LEFT, CENTER);
						text(this.json[i].question.question,0,0);

						//if it's an objective type question ...
						//compare the responses array to the correct answers array

						// console.log(this.json[i].question.descriptor);


						if ( this.json[i].question.descriptor == "objective" ){

							// console.log("YOUR ANSWER ARRAY:     " + this.json[i].responses);
							// console.log("CORRECT ANSWER ARRAY: " + this.json[i].question.correctAnswer);

							push();
								translate(0,25);
								var tempAnswers = "";
								tempAnswerLength = 0;
								var answerCount = 0;

								push();

									for (var j = 0; j < this.json[i].responses.length; j++){
										
										if (this.json[i].responses[j] == this.json[i].question.correctAnswer[j]){
											console.log("YOUR ANSWER:    " + this.json[i].responses[j]);
											console.log("CORRECT ANSWER: " + this.json[i].question.correctAnswer[j]);
											
											fill(130,100,60);
											tempAnswers = this.json[i].question.answers[j];
											tempAnswers = tempAnswers.replace(/\s*\(.*?\)\s*/g, '');
											if (j > 0){
												translate(tempAnswerLength + 15, 0);
											};
									
											textFont(museoSans500);
											text(tempAnswers,0,0);
											tempAnswerLength = textWidth(tempAnswers);
											
										}
										else {
											fill(0,100,60);
											tempAnswers = this.json[i].question.answers[j];
											tempAnswers = tempAnswers.replace(/\s*\(.*?\)\s*/g, '');
											console.log("INCORRECT ANSWER!");
											translate(tempAnswerLength + 15, 0);
											textFont(museoSans100);
											text(tempAnswers,0,0);
											tempAnswerLength = textWidth(tempAnswers);
										}
									};

								pop();

								// textFont(museoSans100);
								// text(tempAnswers,0,0);
							pop();
						} 

						//if it's a subjective type question just list the responses
						else {							
							push();
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