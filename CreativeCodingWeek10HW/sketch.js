var headMove;
var headX = 159;
var headY = 156;
var headSize = 115;
var headGrow = 1;

var noseX = 0;
var noseMove;

var eyeMove;
var eyeY = 150;

var mouthX = 135;
var mouthY = 190;
var mouthMoveX;
var mouthMoveY;

var size = 16;
var count = 0
var sizing = 2;

// Colors

var headColor;
var eyeColor;
var noseColor;
var mouthColor;

function setup() {
    createCanvas(400, 400);
  headMove = random (1, 5);
  eyeMove = random (1, 5);
  mouthMoveX = random (1, 3);
  mouthMoveY = random (1, 3);
  noseMove = random (1, 3);
  
  headColor = getRandomColor();
  eyeColor = getRandomColor();
  noseColor = getRandomColor();
  mouthColor = getRandomColor();
  
  }

function getRandomColor() {
  return color(random(255), random(255), random(255));
  
}
  
  function draw() {
    background(220);
    
    // Ears
    rect(95,135,25,40);
    rect(197,135,25,40);
    
    // Head
    fill(headColor);
    circle(headX,headY,headSize);
    headX+=headMove;
    if (headX >= 350 || headX <= 50)
    {
      headMove *= -1;
      headColor = getRandomColor();
    }
    
    headSize += headGrow;
    if (headSize >= 130 || headSize <= 90) {
      headGrow *= -1;
    }
    
    // Nose
    fill(noseColor);
    triangle(150 + noseX, 175, 158 + noseX, 120, 168 + noseX, 175);
    noseX += noseMove;
    if (noseX <= -30 || noseX >= 30) 
    {
      noseMove *= -1;
      noseColor = getRandomColor();
    }
   
    // Eyes
    fill(eyeColor);
    circle(125,eyeY,25);
    circle(193,eyeY,25);
    eyeY += eyeMove;
    if (eyeY <= 10 || eyeY >= 390)
    {
      eyeMove *= -1;
      eyeColor = getRandomColor();
    }
    point(125,150);
    point(193,150);
    
    //Mouth
    stroke(mouthColor);
  line(mouthX, mouthY, mouthX + 48, mouthY); // 48 is width I had originally set
    mouthX += mouthMoveX;
    mouthY += mouthMoveY;
    if (mouthX <= 0 || mouthX + 48 >= width) 
    {
      mouthMoveX *= -1;
      mouthColor - getRandomColor();
    }
    if (mouthY <= 0 || mouthY >= height) 
    {
      mouthMoveY *= -1;
      mouthColor = getRandomColor();
    }
    
    textSize(size);
    size += sizing;
    count++;
    if (count > 5)
    {
      sizing *= -1;
      count = 0;
    }
    text('Michael Oliver',125, 250);

  }