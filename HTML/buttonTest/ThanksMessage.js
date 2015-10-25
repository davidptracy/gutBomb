/* 
The Exit Menu Class
Requires p5.js > p5js.org
*/

// the constructor
function ThanksMessage(_origin){
	this.origin = _origin;
	this.on = false;
}

ThanksMessage.prototype.display  = function(){

	var width = 500;
	var height = 200;

	this.buttonWidth = width*.25;

	if (this.on){

		colorMode(HSB);
		noStroke();
		fill(0,0,0,.7);
		rect(0,0, windowWidth, windowHeight);
		
		push();

			translate(this.origin.x, this.origin.y);
			colorMode(HSB);

			// shadow
			push();
				translate(12.5, 12.5);
				fill(0,0,0,.25);
				rect(-width/2, -height/2, width, height, 20);

			pop();

			fill(0,0,86);
			rect(-width/2, -height/2, width, height, 20);

			push();
				// translate(0, 0);
				fill(0);
				textSize(36);
				textAlign(CENTER, CENTER);
				text("Thank you for your time!",0,0);
			pop();

		pop();
	}
}