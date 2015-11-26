/* 
The Exit Menu Class
Requires p5.js > p5js.org
*/

// the constructor
function ExitMenu(_origin){

	this.origin = _origin;
	this.on = false;
	this.buttonHeight = 50;
	this.buttonLocations = new Array();

	this.buttonLoc1 = createVector();
	this.buttonLoc2 = createVector();

	this.buttonLocations.push(this.buttonLoc1);
	this.buttonLocations.push(this.buttonLoc2);

	this.buttonWidth = 500;
	this.buttonHeight = 50;
}

ExitMenu.prototype.display  = function(){

	var width = 500;
	var height = 300;

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
				fill(0,0,0,.25);
				rect(-width/2, -height/2, width, height, 0);

			pop();

			// main dialog box
			fill(0,0,100);
			rect(-width/2, -height/2, width, height, 0);

			
			// YES AND NO BUTTONS
			fill(201, 69, 100);
			push();				
				translate(-width*.35, 50);
				rect(0,0,width*.25, 50);

				push();
					translate(this.buttonWidth/2, this.buttonHeight/2);
					fill(0);
					textSize(24);
					textFont(museoSans100);
					textAlign(CENTER, CENTER);
					text("YES",0,0);	
				pop();

			pop();

			push();
				translate(width*.35-this.buttonWidth, 50);
				rect(0,0,width*.25, 50);
				push();
					translate(this.buttonWidth/2, this.buttonHeight/2);
					fill(0);
					textSize(24);
					textFont(museoSans100);
					textAlign(CENTER, CENTER);
					text("NO",0,0);	
				pop();

			pop();

			push();
				translate(0, -75);
				fill(0);
				textSize(36);
				textFont(museoSans100);
				textAlign(CENTER, CENTER);
				text("Are you sure you \n want to quit?",0,0);
			pop();

		pop();

		this.buttonLocations[0].x = this.origin.x-width*.35;
		this.buttonLocations[0].y = this.origin.y+50;
		this.buttonLocations[1].x = this.origin.x+width*.35;
		this.buttonLocations[1].y = this.origin.y+50;
	}

}


ExitMenu.prototype.getButtonLocations = function(){

	return this.buttonLocations;

}