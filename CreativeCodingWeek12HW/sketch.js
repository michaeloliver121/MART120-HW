//Player Starting Position
var x = 400;
var y = 400;

// Obstacles
var obs1_x = 200, obs1_y = 300, obs1_r = 50; // First obstacle
var obs2_x = 500, obs2_y = 500, obs2_r = 30; // Second obstacle

var obs1_speedX = 2, obs1_speedY = 2; // First obstacle speed
var obs2_speedX = 3, obs2_speedY = 1; // Second obstacle speed

// Non-moving obstacle position
var obs3_x = -100, obs3_y = -100;

// "Exit" position and size
var exit_x = 750, exit_y = 750, exit_width = 50, exit_height = 50;

// End of Variables -- breathing room

function setup() 
{
  createCanvas(800, 800);
}

function draw() {
  background(0);
  drawBorder();
  drawPlayer();
  movePlayer();
  drawStaticObject();
  drawMovingObject();
  moveObjects();
  obs1Wrap();
  obs2Wrap();
  drawExit();
  youWin();
}

//Start of Function Breakdowns

function drawBorder(){
  noFill();
  stroke(100, 150, 100);
  strokeWeight(20);
  rect(0, 0, width, height);
  noStroke(); // Reset stroke after drawing
}

function drawPlayer() {
  fill(255, 255, 255);
  circle(x, y, 50);
}

function movePlayer(){
  if (keyIsDown(68)) x += 5;
  if (keyIsDown(65)) x -= 5;
  if (keyIsDown(83)) y += 5;
  if (keyIsDown(87)) y -= 5;
}

function drawStaticObject(){
    fill(200, 200, 0); // Yellow
    circle(obs3_x, obs3_y, 50);
}

function mousePressed(){
    obs3_x = mouseX;
    obs3_y = mouseY;
}

function drawMovingObject(){
  fill(255, 0, 0);  // Red 
  circle(obs1_x, obs1_y, obs1_r * 2);
  
  fill(0, 0, 255);  // Blue
  circle(obs2_x, obs2_y, obs2_r * 2);
}

function moveObjects(){
  obs1_x += obs1_speedX;
  obs1_y += obs1_speedY;
  
  obs2_x += obs2_speedX;
  obs2_y += obs2_speedY;
}

function obs1Wrap(){
  if (obs1_x > width) {
    obs1_x = 0; // Wrap around to the left side
  } else if (obs1_x < 0) {
    obs1_x = width; // Wrap around to the right side
  }

  if (obs1_y > height) {
    obs1_y = 0; // Wrap around to the top
  } else if (obs1_y < 0) {
    obs1_y = height; // Wrap around to the bottom
  }
}

function obs2Wrap(){
  if (obs2_x > width) {
    obs2_x = 0; // Wrap around to the left side
  } else if (obs2_x < 0) {
    obs2_x = width; // Wrap around to the right side
  }

  if (obs2_y > height) {
    obs2_y = 0; // Wrap around to the top
  } else if (obs2_y < 0) {
    obs2_y = height; // Wrap around to the bottom
  }
}

function drawExit(){
  fill(0, 255, 0);  // Green
  rect(exit_x, exit_y, exit_width, exit_height);
}

function youWin(){
  if (x > exit_x && x < exit_x + exit_width && y > exit_y && y < exit_y + exit_height)   {
    fill(255); // Text Color
    textSize(32);
    textAlign(CENTER, CENTER);
    text("You Win!", width / 2, height / 2);
  }
}