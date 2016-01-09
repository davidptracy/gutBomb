/* 
The Navigation Button Class
Requires p5.js > p5js.org
*/

function NavigationButton(_origin, _active, _direction){

	this.origin = _origin;
	this.active = _active;
	this.radius = 100;
	this.direction = _direction;
	this.submitActive = false;

}

NavigationButton.prototype.display = function(_color){
	
	// IF WE'RE ON THE FINAL QUESTION
	if (this.submitActive){

		colorMode(HSB);

		if (!this.active){

			fill(201,0,86);

			push();
				noStroke();
				translate(this.origin.x, this.origin.y);

				// scale(Math.sin(millis()/200)/4 + 1 );

				ellipse(0,0,this.radius,this.radius);

				if (this.direction < 0){
					rotate(PI);
				}

				push();
					
					translate(10,-7.5);
					stroke(0,0,100);
					strokeCap(ROUND);
					strokeWeight(10);
					line(0,0,-15, 15);
					line(-15,15,-22.5, 7.5);

				pop();
			pop();
		} else {			
			fill(81, 204, 100);
			push();
				noStroke();
				translate(this.origin.x, this.origin.y);

				scale(Math.sin(millis()/200)/6 + 1 );

				ellipse(0,0,this.radius,this.radius);

				if (this.direction < 0){
					rotate(PI);
				}

				push();					
					translate(10,-7.5);
					stroke(0,0,100);
					strokeCap(ROUND);
					strokeWeight(10);
					line(0,0,-15, 15);
					line(-15,15,-22.5, 7.5);
				pop();
			pop();
		}

	// IF WE'RE NOT ON THE FINAL QUESTION

	} else {

		colorMode(HSB);

		if (!this.active){

			fill(201,0,86);
			push();
				noStroke();
				translate(this.origin.x, this.origin.y);
				ellipse(0,0,this.radius,this.radius);

				if (this.direction < 0){
					rotate(PI);
				} 
				push();
					translate(7.5,0);
					stroke(0,0,100);
					strokeCap(ROUND);
					strokeWeight(10);
					line(-15, -15, 0, 0);
					line(0,0,-15, 15);
				pop();
			pop();			
		} 
		else{

			fill(_color[0], _color[1], _color[2]);
			push();
				noStroke();
				translate(this.origin.x, this.origin.y);

				if (this.direction < 0){
					rotate(PI);
				}  else {
					scale(Math.sin(millis()/200)/6 + 1 );
				}

				ellipse(0,0,this.radius,this.radius);
				
				push();
					translate(7.5,0);
					stroke(0,0,100);
					strokeCap(ROUND);
					strokeWeight(10);
					line(-15, -15, 0, 0);
					line(0,0,-15, 15);
				pop();
			pop();	

		} 
	}

}

NavigationButton.prototype.getButtonLocation = function(){

	return this.origin;

}