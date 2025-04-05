// set up canvas
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);

// Get reference to the paragraph element for the counter
const paragraph = document.querySelector("p");

// function to generate random number
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// function to generate random RGB color value
function randomRGB() {
  return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}

// Shape class (Parent class)
class Shape {
  constructor(x, y, velX, velY) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
  }
}

// Ball class (Inherits from Shape)
class Ball extends Shape {
  constructor(x, y, velX, velY, color, size) {
    super(x, y, velX, velY); // Call Shape constructor
    this.color = color;
    this.size = size;
    this.exists = true; // Track if the ball exists (hasn't been eaten)
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  }

  update() {
    // Check horizontal bounds
    if (this.x + this.size >= width) {
      this.velX = -Math.abs(this.velX);
    }
    if (this.x - this.size <= 0) {
      this.velX = Math.abs(this.velX);
    }

    // Check vertical bounds
    if (this.y + this.size >= height) {
      this.velY = -Math.abs(this.velY);
    }
    if (this.y - this.size <= 0) {
      this.velY = Math.abs(this.velY);
    }

    // Update position
    this.x += this.velX;
    this.y += this.velY;
  }

  collisionDetect() {
    for (const ball of balls) {
      // Check if the current ball is not the same ball and if the other ball exists
      if (!(this === ball) && ball.exists) {
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // If collision detected, change colors
        if (distance < this.size + ball.size) {
          ball.color = this.color = randomRGB();
        }
      }
    }
  }
}

// EvilCircle class (Inherits from Shape)
class EvilCircle extends Shape {
  constructor(x, y) {
    super(x, y, 20, 20); // Call Shape constructor with fixed velocity
    this.color = "white";
    this.size = 10;

    // Add keyboard controls
    window.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "a": // left
          this.x -= this.velX;
          break;
        case "d": // right
          this.x += this.velX;
          break;
        case "w": // up
          this.y -= this.velY;
          break;
        case "s": // down
          this.y += this.velY;
          break;
      }
    });
  }

  draw() {
    ctx.beginPath();
    ctx.lineWidth = 3; // Make the outline thicker
    ctx.strokeStyle = this.color; // Use strokeStyle for outline
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.stroke(); // Use stroke() to draw the outline
  }

  checkBounds() {
    // Check horizontal bounds and adjust position if needed
    if (this.x + this.size >= width) {
      this.x = width - this.size;
    }
    if (this.x - this.size <= 0) {
      this.x = this.size;
    }

    // Check vertical bounds and adjust position if needed
    if (this.y + this.size >= height) {
      this.y = height - this.size;
    }
    if (this.y - this.size <= 0) {
      this.y = this.size;
    }
  }

  collisionDetect() {
    for (const ball of balls) {
      // Check if the ball exists
      if (ball.exists) {
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // If collision detected with an existing ball
        if (distance < this.size + ball.size) {
          ball.exists = false; // Set the ball to not exist (eaten)
          count--; // Decrement the counter
          paragraph.textContent = 'Ball count: ' + count; // Update the displayed count
        }
      }
    }
  }
}

// --- Main Program ---

// Array to store ball objects
const balls = [];

// Create and populate the balls array
while (balls.length < 25) {
  const size = random(10, 20);
  const ball = new Ball(
    // Ensure balls are spawned within canvas bounds
    random(0 + size, width - size),
    random(0 + size, height - size),
    random(-7, 7), // Random velocity X
    random(-7, 7), // Random velocity Y
    randomRGB(),   // Random color
    size           // Random size
  );
  balls.push(ball);
}

// Create the EvilCircle instance
const evilCircleInstance = new EvilCircle(random(0, width), random(0, height));

// Initialize the ball counter variable
let count = balls.length;
// Set the initial text content for the counter paragraph
paragraph.textContent = 'Ball count: ' + count;

// Animation loop function
function loop() {
  // Semi-transparent background to create trails
  ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
  ctx.fillRect(0, 0, width, height);

  // Process each ball
  for (const ball of balls) {
    // Only draw, update, and check collisions for existing balls
    if (ball.exists) {
      ball.draw();
      ball.update();
      ball.collisionDetect();
    }
  }

  // Process the evil circle
  evilCircleInstance.draw();
  evilCircleInstance.checkBounds();
  evilCircleInstance.collisionDetect();

  // Request the next frame for smooth animation
  requestAnimationFrame(loop);
}

// Start the animation loop
loop();