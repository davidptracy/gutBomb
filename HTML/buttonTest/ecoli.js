/*
Ecoli Particle Class
*/

//constructor
function Ecoli( _origin, _startVelocity ){

	// console.log(_startVelocity);

	this.xSpacing = 10;
	this.waveWidth = 150;
	this.period = 300;
	this.amplitude = 12;
	this.dx = (TWO_PI / this.period);
	this.yValues = new Array(this.waveWidth/this.xSpacing);
	this.theta = 0.0;
	this.radius = 50;
	this.interval = 0;
	this.location = _origin;
	this.velocity = _startVelocity;
	this.scale = random(.25, 1.0);
	this.rotation = random(100);
	this.hue = 0;

	// console.log("eColi created!");

}

Ecoli.prototype.update = function(_hue){
	
	try{

		this.location.add(this.velocity);

		if (this.location.x < -200){
			this.location.x = windowWidth+100;
		} else if (this.location.x > windowWidth+200){
			this.location = 0;
		}

		if (this.location.y < -200){
			this.location.y = windowHeight+100;
		}

		// this.hue = _hue;

	} catch (err) {
		console.log(err);
	}

	

}

Ecoli.prototype.display = function(){

	colorMode(HSB);

	push();
			
		translate(this.location.x, this.location.y);

		rotate(this.velocity.heading()+PI );	

		scale(this.scale);
		
		push();
			translate(0,sin(this.interval)*this.amplitude*2);
			noStroke();
			fill(this.hue,100*this.scale,100);
			ellipse(0,0,this.radius,this.radius);
			rect(0,-this.radius/2, this.radius, this.radius);
			ellipse(this.radius,0,this.radius,this.radius);
		pop();

		push();
			scale(.65);
			translate(0,-10);
			rotate(radians(15));
			this.drawCurve(12.5);
		pop();

		push();
			scale(.65);
			translate(0,-10);
			rotate(radians(15));
			this.drawCurve(25);
		pop();

		push();
			scale(.8);
			translate(0,-10);
			rotate(radians(25));
			this.drawCurve(20);
		pop();

		push();
			scale(.5);
			translate(0,15);
			rotate(radians(-10));
			this.drawCurve(5);
		pop();

		push();
			scale(.75);
			translate(0,15);
			rotate(radians(-25));
			this.drawCurve(25);
		pop();

		push();
			scale(.45);
			translate(25,25);
			rotate(radians(-35));
			this.drawCurve(25);
		pop();

		//curves
		this.drawCurve(25);

		this.interval +=.05*this.velocity.mag()*.75;

	pop();

}

Ecoli.prototype.drawCurve = function(_amplitude){

	push();
		noFill();

		var a = 0.0;
		var inc = TWO_PI/25.0;
		
		stroke(this.hue,100*this.scale,100);
		// stroke(0);
		strokeWeight(5);

		beginShape();

		translate(this.radius,0);
		for (var i = 1; i < 25; i++) {
			curveVertex(i*this.xSpacing, sin(a+this.interval)*_amplitude );
			a += inc;
		};
		endShape();
		
	pop();

}