/* 
The main button class 
Requires p5.js > p5js.org
*/

//this is the constructor
function Button( _origin, _width, _height, _text, _mainColor, _image){
	this.origin 			= createVector(_origin.x, _origin.y);
	this.width 				= _width;
	this.height 			= _height;
	this.margin 			= _height*.25;
	this.text 				= _text;
	this.mainColor 			= _mainColor;
	this.selected 			= false;
	this.image 				= _image
	

	if (this.image !== null){
		this.hasImage = false;
	} else { 
		this.hasImage = true;
}

Button.prototype.display = function(){
	if (!this.selected){
		push();
		translate(this.origin.x, this.origin.y);
		colorMode(HSB);
		fill(this.mainColor[0], this.mainColor[1], this.mainColor[2]);
		noStroke();
		rect(0, 0, (this.width-this.margin), (this.height-this.margin) );
		fill(this.mainColor[0], this.mainColor[1], this.mainColor[2]-50);
		
		beginShape();
		vertex(this.width-this.margin, this.height-this.margin);
		vertex(0, this.height-this.margin);
		vertex(this.margin, this.height);
		vertex(this.width, this.height);
		vertex(this.width, this.margin);
		endShape(CLOSE);
		
		fill(this.mainColor[0], this.mainColor[1], this.mainColor[2]-25);
		beginShape();
		vertex(this.width-this.margin, 0);
		vertex(this.width-this.margin, this.height-this.margin);
		vertex(this.width, this.height);
		vertex(this.width, this.margin);
		endShape(CLOSE);

		
		if (!this.hasImage){
			push();
				translate(this.margin, this.margin);
				fill(0);
				textSize(32);
				textAlign(LEFT, TOP);
				text(this.text,0,0);
			pop();
		} else {
			push();
				translate(this.margin*3, this.margin);
				fill(0);
				textSize(32);
				textAlign(LEFT, TOP);
				text(this.text,0,0);
			pop();
		}

		pop();

	} else {
		push();
			translate(this.origin.x+this.margin, this.origin.y+this.margin);
			colorMode(HSB);
			fill(this.mainColor[0], this.mainColor[1], this.mainColor[2]);
			noStroke();
			rect(0, 0, (this.width-this.margin), (this.height-this.margin) );

		
			if (!this.hasImage){
				push();
				translate(this.margin, this.margin);
				fill(0);
				textSize(32);
				textAlign(LEFT, TOP);
				text(this.text,0,0);
				pop();
			} else {
				push();
				translate(this.margin*3, this.margin);
				fill(0);
				textSize(32);
				textAlign(LEFT, TOP);
				text(this.text,0,0);
				pop();
			}

		pop();
	}
}
}