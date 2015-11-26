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
		fill(255,0,90,.5);
		rect(0,0, windowWidth, windowHeight);
		
		push();

			translate(this.origin.x, this.origin.y);
			colorMode(HSB);

			// shadow
			push();
				translate(12.5, 12.5);
				fill(0,0,100);
				rect(-width/2, -height/2, width, height);

			pop();

			fill(0,0,86);
			rect(-width/2, -height/2, width, height);

			push();
				// translate(0, 0);
				fill(0);
				textSize(36);
				textFont(museoSans100);
				textAlign(CENTER, CENTER);
				text("Thank you for your time!",0,0);
			pop();

		pop();
	}
}