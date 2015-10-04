var origin, width, height, margin, selected;

var button;
var Button;

var buttons = new Array();


function setup() {
	// uncomment this line to make the canvas the full size of the window
	createCanvas(windowWidth, windowHeight);
	origin = createVector(200,200);
	width = 400;
	height = 200;
	margin = height*.25;
	selected = false;

	button 	= new Button(origin, width, height, "100%", [100, 204, 100]);
	button2	= new Button(origin.add(width+margin, 0), width, height, "None", [100, 204, 100]);
	buttons.push(button);
	buttons.push(button2);	


}

function draw() {
	background(255);
	button.display();
	button2.display();		
}

function mousePressed(){

	for (var i = 0; i < buttons.length; i++) {
		if (mouseX > buttons[i].origin.x && mouseX < buttons[i].origin.x+buttons[i].width){
			if (mouseY > buttons[i].origin.y && mouseY < buttons[i].origin.y+buttons[i].height){
				buttons[i].selected = !buttons[i].selected;
			}
		}
	};


}