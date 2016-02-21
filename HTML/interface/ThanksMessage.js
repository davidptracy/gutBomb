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

	var width = 500;
	var height = 500;

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
						translate(-width/2+50,25*i);
						textSize(18);
						textFont(museoSans100);
						textAlign(LEFT, CENTER);
						text(this.json[i].question.question,0,0);
					pop();
				};
			}


			// push();
			// 	fill(0);
			// 	translate(-width/2+50,75);
			// 	textSize(18);
			// 	textFont(museoSans100);
			// 	textAlign(LEFT, CENTER);
			// pop();

		pop();
	}
}

ThanksMessage.prototype.update  = function(_json){

	this.json = _json;
	// console.log(this.json[0].question.question);

	for (var i = 0; i < this.json.length; i++) {
		console.log(this.json[i].question.question);
		console.log(this.json[i].responses);
	};

}