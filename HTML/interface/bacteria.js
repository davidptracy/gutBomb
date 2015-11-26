
var img;
function GOL() {
  img = loadImage("smoke_blur.png");  
  this.w = windowWidth/90;
  this.columns = Math.floor(windowWidth/this.w);
  this.rows = Math.floor(windowHeight/this.w);
  this.board = new Array(this.columns);
  for (var i = 0; i < this.columns; i++) {
    this.board[i] = new Array(this.rows);
  } 

  this.init = function() {
    for (var i =0;i < this.columns;i++) {
      for (var j =0;j < this.rows;j++) {
        if( Math.floor(random(10)) > 7){
          this.board[i][j] = 1;
        }else{
          this.board[i][j] = 0;
        }
      }
    }
  }
  this.init();

  this.generate = function() {

    var next = new Array(this.columns);
    for (var i = 0; i < this.columns; i++) {
      next[i] = new Array(this.rows);
    }

    for (var x = 0; x < this.columns; x++) {
      for (var y = 0; y < this.rows; y++) {
        var neighbors = 0;
        for (var i = -1; i <= 1; i++) {
          for (var j = -1; j <= 1; j++) {
            neighbors += this.board[(x+i+this.columns)%this.columns][(y+j+this.rows)%this.rows];
          }
        }
        neighbors -= this.board[x][y];

        if      (neighbors <  2) next[x][y] = 0;           // Loneliness
        else if (neighbors >  3) next[x][y] = 0;           // Overpopulation
        else if ((this.board[x][y] == 1) && (neighbors == 3)) next[x][y] = 1;   
        else if ((this.board[x][y] == 0) && (neighbors == 3)) next[x][y] = 1;           // Reproduction
        else if ((this.board[x][y] == 1) && (neighbors == 2)) next[x][y] = 1;           // Reproduction

        else                                            next[x][y] = this.board[x][y];  // Stasis
      }
    }

    this.board = next;
  }

  this.display = function() {
    for ( var i = 0; i < this.columns;i++) {
      for ( var j = 0; j < this.rows;j++) {
        if ((this.board[i][j] == 1)){
            tint(127,0,0, 127);             
            image(img,i*this.w, j*this.w, this.w+windowWidth/35, this.w+windowWidth/35);
        }
      }
    }
  }
}

