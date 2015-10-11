/* 
The Navigation Bar Class
Requires p5.js > p5js.org
*/

// the constructor
function NavigationBar(){

	this.questionCount = 1;
	this.barHeight = 100;
	this.origin = createVector(0, windowHeight-this.barHeight);
	this.numberOfQuestions = 10;
	this.circleSpacing = 60;
	this.currentQuestion = 1;
	this.exitButtonOrigin = createVector( 50, windowHeight - this.barHeight*.5 );

}

NavigationBar.prototype.display = function() {
	
	push();
	translate(0, windowHeight);
	colorMode(HSB);
	noStroke();
	fill(0, 0, 86);
	rect(0, 0, windowWidth, -this.barHeight);
	pop();

	this.drawCircles();
	this.drawExitSymbol();

}

NavigationBar.prototype.update = function(_questionId){

	this.currentQuestion = _questionId;

}

NavigationBar.prototype.drawCircles = function(){

	var circleZone = (this.numberOfQuestions + 1) * this.circleSpacing;
	var origin = createVector( (windowWidth - circleZone) / 2 , windowHeight - this.barHeight*.5);
	var counter = 0;

	push();
	colorMode(HSB);
	fill(0, 100, 75);
	noStroke();
	translate(origin.x, origin.y);

	for (var i = this.circleSpacing; i < circleZone; i+=this.circleSpacing) {

		if (counter < this.currentQuestion) fill(201, 69, 100);
		else fill(0,0,100);			
		ellipse(i, 0, 20, 20);
		counter ++;
	}

	pop();

}

NavigationBar.prototype.drawExitSymbol = function(){

	// var origin = createVector( 50, windowHeight - this.barHeight*.5 );
	var lineLength = 35;

	push();

		translate(this.exitButtonOrigin.x, this.exitButtonOrigin.y);
		colorMode(HSB);
		noStroke();
		fill(0,100,100);
		ellipse(0,0, 75, 75);

		stroke(0,0,100);
		strokeCap(ROUND);
		strokeWeight(10);
		line(-lineLength/2, -lineLength/2, lineLength/2, lineLength/2);
		line(-lineLength/2, lineLength/2, lineLength/2, -lineLength/2);

	pop();
}

NavigationBar.prototype.getButtonLocation = function(){

	return this.exitButtonOrigin;

}
