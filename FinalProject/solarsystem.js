// Variables
let sunImg, planetImgs = {};
let planets = [];
let moon;
let stars = [];
let sunRotation = 0;
let camX = 0;
let camY = 0;
let zoom = 1;
let targetZoom = 1;
let targetCamX = 0;
let targetCamY = 0;
let focusedObject = null;
let cameraReset = true;
let trail = [];
let trailLength = 10;
let trailAlpha = 100;

// Pre Load Images + Music
function preload() {
  sunImg = loadImage("assets/sun.png");
  let names = ["mercury", "venus", "earth", "mars", "jupiter", "saturn", "uranus", "neptune", "moon"];
  for (let name of names) {
    planetImgs[name] = loadImage(`assets/${name}.png`);
  }
}

// Setup
function setup() {
  createCanvas(1400, 1400);
  imageMode(CENTER);
  let audio = document.getElementById('spaceAudio');
  audio.play();

  let centerX = width / 2;
  let centerY = height / 2;

  // Generate random stars
  for (let i = 0; i < 1000; i++) {
    stars.push({
      x: random(width),  // Random X position
      y: random(height), // Random Y position
      size: random(1, 3)  // Random size for each star
    })}

  // Add Planets
  planets.push(new Planet("Mercury", planetImgs["mercury"], 80, 20, 0.02, 0.02, centerX, centerY));
  planets.push(new Planet("Venus", planetImgs["venus"], 120, 28, 0.015, 0.018, centerX, centerY));
  planets.push(new Planet("Earth", planetImgs["earth"], 180, 32, 0.01, 0.02, centerX, centerY));
  planets.push(new Planet("Mars", planetImgs["mars"], 250, 28, 0.008, 0.018, centerX, centerY));
  planets.push(new Planet("Jupiter", planetImgs["jupiter"], 330, 60, 0.006, 0.015, centerX, centerY));
  planets.push(new Planet("Saturn", planetImgs["saturn"], 400, 54, 0.004, 0.013, centerX, centerY));
  planets.push(new Planet("Uranus", planetImgs["uranus"], 475, 44, 0.003, 0.012, centerX, centerY));
  planets.push(new Planet("Neptune", planetImgs["neptune"], 575, 44, 0.002, 0.011, centerX, centerY));

  // Moon orbiting Earth
  let earth = planets[2];
  moon = new Moon("The Moon", planetImgs["moon"], 30, 16, 0.05, earth);
}

function draw() {

    // Void
  background(0);
  fill(0);
  noStroke();
  drawStars();
  updateCamera();
  push();
  translate(width / 2, height / 2);
  scale(zoom);
  translate(-camX, -camY);

    // Sun
    push();
    translate(width / 2, height / 2);
    rotate(sunRotation);
    image(sunImg, 0, 0, 120, 120);
    pop();
  
  let sunX = width / 2;
  let sunY = height / 2;
  let sunHovered = dist(mouseX, mouseY, sunX, sunY) < 60;
  
  if (sunHovered) {
    // Tooltip
    let name = "The Sun";
    let pad = 8;
    textSize(14);
    let tw = textWidth(name);
    let bw = tw + pad * 2;
    let bh = 14 + pad * 2;
  
    fill(0, 180);
    stroke(255, 200);
    strokeWeight(1);
    rectMode(CENTER);
    rect(sunX, sunY - 80, bw, bh, 6);
  
    noStroke();
    fill(255);
    textAlign(CENTER, CENTER);
    text(name, sunX, sunY - 80);
  }

  // Planets
  for (let planet of planets) {
    planet.update();
    planet.display();
  }

  // Moon
  moon.update();
  moon.display();

  // Mouse Trail
  trail.push({x: mouseX, y: mouseY});
  if (trail.length > trailLength) {
    trail.shift();  // Remove the oldest trail point
  }

  // Draw the trail
  for (let i = 0; i < trail.length; i++) {
    let alpha = map(i, 0, trail.length, trailAlpha, 0);  // Fade trail points
    fill(255, 255, 255, alpha);
    noStroke();
    ellipse(trail[i].x, trail[i].y, 5, 5);  // Draw each point in the trail
  }

  // Rotate sun if not hovered
  if (dist(mouseX, mouseY, width / 2, height / 2) > 50) {
    sunRotation += 0.002;
  }

// Pause Earth if the Moon is hovered or clicked
let earth = planets[2];
if (moon.isMouseOver() || moon.paused) {
  earth.paused = true;
}
}

// Planet Properties
class Planet {
  constructor(name, img, orbitRadius, size, speed, rotationSpeed, centerX, centerY) {
    this.name = name;
    this.img = img;
    this.orbitRadius = orbitRadius;
    this.size = size;
    this.speed = speed;
    this.rotationSpeed = rotationSpeed;
    this.centerX = centerX;
    this.centerY = centerY;
    this.angle = random(TWO_PI);
    this.rotationAngle = 0;
    this.x = 0;
    this.y = 0;
    this.rockingAmplitude = 0.05;  // Max Wiggle
    this.rockingSpeed = 0.025;     // Speed of the Wiggle
    this.rockingOffset = random(1000);  // Random starting for each wiggle so not in sync
    this.paused = false;  // Pause Orbiting
  }

  isMouseOver() {
    return dist(mouseX, mouseY, this.x, this.y) < this.size / 2;
  }

  update() {
    // Pause if either zoom-pause is active or the mouse is hovering
    if (!this.paused && !this.isMouseOver()) {
      this.angle += this.speed;
    }
  
    this.rotationAngle += this.rotationSpeed;
  
    this.x = this.centerX + this.orbitRadius * cos(this.angle);
    this.y = this.centerY + this.orbitRadius * sin(this.angle);
  }

  display() {
    stroke(60);
    noFill();
    ellipse(this.centerX, this.centerY, this.orbitRadius * 2);

    push();
    translate(this.x, this.y);

    // Saturn Special Property
    if (this.name.toLowerCase() === "saturn") {
        noFill();
        stroke(100, 90); // rings color
        strokeWeight(4);
        ellipse(0, 0, this.size * 1.2, this.size);
      }

      // Planetary Wiggling for drama
      let rocking = this.rockingAmplitude * sin(this.rockingSpeed * frameCount + this.rockingOffset);
      rotate(rocking);
  
      // Glow and Tooltip Mouse Hover
    if (this.isMouseOver()) {

      // Glow
      noStroke();
      for (let i = 15; i <= 30; i += 5) {
        fill(255, 255, 255, map(i, 15, 30, 40, 10));
        ellipse(0, 0, this.size + i);
      }

      // Tooltips
      let pad = 8, textSizeVal = 14;
      textSize(textSizeVal);
      let tw = textWidth(this.name);
      let bw = tw + pad * 2;
      let bh = textSizeVal + pad * 2;

      fill(0, 180);
      stroke(255, 200);
      strokeWeight(1);
      rectMode(CENTER);
      rect(0, -this.size / 2 - bh / 2 - 10, bw, bh, 6);

      noStroke();
      fill(255);
      textAlign(CENTER, CENTER);
      text(this.name, 0, -this.size / 2 - bh / 2 - 10);
    }

    noStroke();
    image(this.img, 0, 0, this.size, this.size);
    pop();
  }
}

// Seperate Moon Properties
class Moon {
  constructor(name, img, orbitRadius, size, speed, earth) {
    this.name = name;
    this.img = img;
    this.orbitRadius = orbitRadius;
    this.size = size;
    this.speed = speed;
    this.earth = earth;
    this.angle = random(TWO_PI);
    this.x = 0;
    this.y = 0;
    this.paused = false;
  }

  isMouseOver() {
    return dist(mouseX, mouseY, this.x, this.y) < this.size / 2;
  }

  update() {
    // Pause if clicked or hover
    if (!this.paused && !this.isMouseOver()) {
      this.angle += this.speed;
    }
  
    this.x = this.earth.x + this.orbitRadius * cos(this.angle);
    this.y = this.earth.y + this.orbitRadius * sin(this.angle);
  }

  display() {
    stroke(60);
    noFill();
    ellipse(this.earth.x, this.earth.y, this.orbitRadius * 2);

    push();
    translate(this.x, this.y);

    if (this.isMouseOver()) {
      noStroke();
      for (let i = 12; i <= 24; i += 4) {
        fill(255, 255, 255, map(i, 12, 24, 40, 10));
        ellipse(0, 0, this.size + i);
      }

      let pad = 6, textSizeVal = 12;
      textSize(textSizeVal);
      let tw = textWidth(this.name);
      let bw = tw + pad * 2;
      let bh = textSizeVal + pad * 2;

      fill(0, 180);
      stroke(255, 200);
      strokeWeight(1);
      rectMode(CENTER);
      rect(0, -this.size / 2 - bh / 2 - 10, bw, bh, 6);

      noStroke();
      fill(255);
      textAlign(CENTER, CENTER);
      text(this.name, 0, -this.size / 2 - bh / 2 - 10);
    }

    noStroke();
    image(this.img, 0, 0, this.size, this.size);
    pop();
  }
}

function drawStars() {

    noStroke();  // Don't destroy my computer again lol
  
    for (let i = 0; i < stars.length; i++) {
      fill(255, 255, 255, 90);
      ellipse(stars[i].x, stars[i].y, stars[i].size, stars[i].size); // Tiny stars
    }
  }
// Camera Smoothness
  function updateCamera() {
    camX = lerp(camX, targetCamX, 0.1);
    camY = lerp(camY, targetCamY, 0.1);
    zoom = lerp(zoom, targetZoom, 0.1);
  }

  function mousePressed() {
    for (let planet of planets) {
      if (planet.isMouseOver()) {
        targetCamX = planet.x;
        targetCamY = planet.y;
        let zoomFactor = 500 / planet.size;  // Calculate zoom level based on planet size
        targetZoom = constrain(zoomFactor, 15, 50);  // Constrain it between 15x and 50x zoom
        planet.paused = true;
        return;
      }
    }
  
    if (moon.isMouseOver()) {
      targetCamX = moon.x;
      targetCamY = moon.y;
      targetZoom = 10
      moon.paused = true;
      return;
    }

    let sunX = width / 2;
    let sunY = height / 2;
    if (dist(mouseX, mouseY, sunX, sunY) < 60) {
    targetCamX = sunX;
    targetCamY = sunY;
    targetZoom = 6
    return;
    }

  // Click Empty Space = Reset Camera
  targetCamX = width / 2;
  targetCamY = height / 2;
  targetZoom = 1;

  // Resume Planet Orbit After Camera Reset
  for (let planet of planets) {
    planet.paused = false;
  }

  // Resume Moon Orbit
  moon.paused = false;
}
