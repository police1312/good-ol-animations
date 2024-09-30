/*
setup
1-Create array of particles 
2-for max number defined by particleCount add a new Particle object at a random point in the canvas to the particles array 
loop
1-For every particle object in particles array apply update+display functions
class
1-Create particle object define all arguments of the object by using: this. (x,y,targetX,targetY, size, speed of interpolation, alpha)
2-Create update function to update position of particle
update
  A-create variables for previous XY position and make it equal to the current XY position
  B-make current XY equal to a lerp function between current X and target X
  C-speed = distance function between XY and previous XY
  D-to map alpha to map speed value to alpha value and remap range using map function
  E-once almost there choose new target(if distance>1 then new random XY)
display
  A-create variable for number of segments for the fading line effect
  B-for i variable > the amount of segements ->i++
  C-create t variable = to i/numSegment to create fractional position along the line so it fades out towards the edges
  D-multiply alpha by 1-t to make alpha decrease with distance 
  E-create weight variable and map it to t so the line thickness also decrease with distance
  !!!
  draw horizontal line
  a-x1 = lerp between x and 0 with t fractional amount to define range of lerp
  b-x2 = do the same but for the other end
  c-use line function to draw line from center to left edge
  d-the the same for other side
*/

let particles = [];
let particleCount = 25;

function setup() {
  createCanvas(400, 400);
  //saveGif('Helix origin3.gif', 20)
  //here to save gif
  for (let i = 0; i < particleCount; i++) {
    // Initialize particles at random positions
    particles.push(new Particle(random(width), random(height)));
  }
}

function draw() {
  // Slightly clear the background to create a trail effect
  background(0, 0, 0, 20);

  // Update and display each particle
  for (let particle of particles) {
    particle.update();
    particle.display();
  }
}

class Particle {
  constructor(x, y) {
    // Initial position of the particle
    this.x = x;
    this.y = y;
    // Target position the particle moves towards
    this.targetX = x;
    this.targetY = y;
    // Size of the particle
    this.size = 5;
    // Speed of interpolation towards the target
    this.lerpSpeed = 0.005;
    // Initial opacity of the particle
    this.alpha = 255;
  }

  update() {
    let previousX = this.x;
    let previousY = this.y;

    // Smoothly interpolate the particle position towards the target position
    this.x = lerp(this.x, this.targetX, this.lerpSpeed);
    this.y = lerp(this.y, this.targetY, this.lerpSpeed);

    // Calculate the speed of the particle
    let speed = dist(this.x, this.y, previousX, previousY);

    // Adjust the alpha value based on the speed
    this.alpha = map(speed, 0, 2, 0, 255); // Adjust the max speed (2) for sensitivity

    // If the particle is close to the target, choose a new target
    if (dist(this.x, this.y, this.targetX, this.targetY) < 1) {
      this.targetX = random(width);
      this.targetY = random(height);
    }
  }

  display() {
    let numSegments = 10; // Number of segments for the fading lines
    
    // Draw lines along the x and y axes with fading effect
    for (let i = 0; i < numSegments; i++) {
      let t = i / numSegments; // Fractional position along the line (0 to 1)
      let alpha = this.alpha * (1 - t); // Line segment alpha value decreases with distance
      let weight = map(t, 0, 1, 2, 0); // Line segment thickness decreases with distance

      stroke(255, 0, 0, alpha); // Set stroke color with calculated alpha
      strokeWeight(weight); // Set stroke weight with calculated weight
      
      // Draw horizontal line segments
      let x1 = lerp(this.x, 0, t); // Start of the line segment
      let x2 = lerp(this.x, width, t); // End of the line segment
      line(this.x, this.y, x1, this.y); // Line segment to the left
      line(this.x, this.y, x2, this.y); // Line segment to the right
      //lerp=(start,stop,amount)
      
      // Draw vertical line segments
      let y1 = lerp(this.y, 0, t); // Start of the line segment
      let y2 = lerp(this.y, height, t); // End of the line segment
      line(this.x, this.y, this.x, y1); // Line segment upwards
      line(this.x, this.y, this.x, y2); // Line segment downwards
    }

    // Draw the particle with fading effect
    noStroke();
    fill(255, 255, 255, 0); // Set fill color with alpha for the particle
    ellipse(this.x, this.y, this.size); // Draw the particle
  }
}
/*
function keyPressed() {
  if (key == 's') {
    saveGif('animation1.gif', 15)
  }
}
*/