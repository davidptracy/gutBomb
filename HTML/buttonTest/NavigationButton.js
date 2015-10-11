/* 
The Navigation Button Class
Requires p5.js > p5js.org
*/

function NavigationButton(_origin, _active, _direction){

	this.origin = _origin;
	this.active = _active;
	this.radius = 75;
	this.direction = _direction;

}

NavigationButton.prototype.display = function(){
	
	colorMode(HSB);

	if (!this.active) fill(201,0,86);
	else fill(180, 204, 100);

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
			line(0,0,-15, 15)
		pop();
	pop();	

}

NavigationButton.prototype.getButtonLocation = function(){

	return this.origin;

}