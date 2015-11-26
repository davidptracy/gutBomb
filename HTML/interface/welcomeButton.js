/* 
The main button class 
Requires p5.js > p5js.org
*/

//this is the constructor
function WelcomeButton( _origin, _width, _height, _text, _mainColor){
	this.origin 			= createVector(_origin.x, _origin.y);
	this.width 				= _width;
	this.height 			= _height;
	this.margin 			= _height*.125;
	this.text 				= _text;
	this.mainColor 			= _mainColor;
	this.selected 			= false;

}

WelcomeButton.prototype.display = function(){
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

			push();
				translate((this.width/2)-(this.margin/2), (this.height/2)-(this.margin/2));
				fill(0);
				textFont(museoSans500);
				textSize(48);
				textAlign(CENTER, CENTER);
				text(this.text,0,0);
			pop();


		pop();

	} else {
		push();

			translate(this.origin.x+this.margin, this.origin.y+this.margin);
			colorMode(HSB);
			fill(this.mainColor[0], this.mainColor[1], this.mainColor[2]);
			noStroke();
			rect(0, 0, (this.width-this.margin), (this.height-this.margin) );
		
			push();
			translate((this.width/2)-(this.margin/2), (this.height/2)-(this.margin/2));
			fill(0);
			textSize(48);
			textFont(museoSans700);
			textAlign(CENTER, CENTER);
			text(this.text,0,0);
			pop();

		pop();
	}
}
