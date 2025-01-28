// Get the canvas and context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Pac-Man's initial properties
const pacMan = {
  x: 100,
  y: 100,
  size: 20,
  speed: 5,
  dx: 0,
  dy: 0,
  startX: 100, // Starting position (for resetting)
  startY: 100,
};

// Define maze walls (x, y, width, height)
const walls = [
  { x: 50, y: 50, width: 500, height: 10 },
  { x: 50, y: 340, width: 500, height: 10 },
  { x: 50, y: 50, width: 10, height: 300 },
  { x: 540, y: 50, width: 10, height: 300 },
  { x: 150, y: 150, width: 100, height: 10 },
  { x: 300, y: 200, width: 10, height: 100 },
];

// Pebbles array
const pebbles = [
  { x: 200, y: 120 },
  { x: 300, y: 150 },
  { x: 100, y: 250 },
  { x: 400, y: 200 },
  { x: 500, y: 300 },
];

// Add touch controls
document.getElementById("up").addEventListener("click", () => {
  pacMan.dx = 0;
  pacMan.dy = -pacMan.speed;
});
document.getElementById("down").addEventListener("click", () => {
  pacMan.dx = 0;
  pacMan.dy = pacMan.speed;
});
document.getElementById("left").addEventListener("click", () => {
  pacMan.dx = -pacMan.speed;
  pacMan.dy = 0;
});
document.getElementById("right").addEventListener("click", () => {
  pacMan.dx = pacMan.speed;
  pacMan.dy = 0;
});

// Reset movement when the button is released
const controlButtons = document.querySelectorAll(".control-btn");
controlButtons.forEach(button => {
  button.addEventListener("mouseup", () => {
    pacMan.dx = 0;
    pacMan.dy = 0;
  });
});

// Load the pebble image
const pebbleImage = new Image();
pebbleImage.src = "mcspicyimage.png"; // Replace with your pebble image path

// Ghosts array
const ghostsImage = new Image();
ghostsImage.src="fireimage.png";
const ghosts = [
  { x: 200, y: 200, size: 20, dx: 2, dy: 0, startX: 200, startY: 200, range: 50 }, // Horizontal movement
  { x: 400, y: 100, size: 20,  dx: 0, dy: 2, startX: 400, startY: 100, range: 50 }, // Vertical movement
];

// Function to draw Pac-Man
function drawPacMan() {
  ctx.beginPath();
  ctx.arc(pacMan.x, pacMan.y, pacMan.size, 0.2 * Math.PI, 1.8 * Math.PI);
  ctx.lineTo(pacMan.x, pacMan.y);
  ctx.fillStyle = "yellow";
  ctx.fill();
  ctx.closePath();
}

// Function to draw walls
function drawWalls() {
  ctx.fillStyle = "yellow";
  walls.forEach((wall) => {
    ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
  });
}

// Function to draw pebbles
function drawPebbles() {
  pebbles.forEach((pebble) => {
    ctx.drawImage(pebbleImage, pebble.x - 27, pebble.y - 27, 54, 54); // Adjust size here
  });
}

// Function to draw ghosts
// Function to draw ghosts using an image
function drawGhosts() {
  ghosts.forEach((ghost) => {
    ctx.drawImage(
      ghostsImage,
      ghost.x - ghost.size, // Adjusting for size
      ghost.y - ghost.size,
      ghost.size * 2, // Width
      ghost.size * 2  // Height
    );
  });
}

// Function to update ghost positions
function updateGhosts() {
  ghosts.forEach((ghost) => {
    ghost.x += ghost.dx;
    ghost.y += ghost.dy;

    // Reverse direction when reaching range limits
    if (ghost.dx !== 0) {
      if (ghost.x > ghost.startX + ghost.range || ghost.x < ghost.startX - ghost.range) {
        ghost.dx *= -1;
      }
    }
    if (ghost.dy !== 0) {
      if (ghost.y > ghost.startY + ghost.range || ghost.y < ghost.startY - ghost.range) {
        ghost.dy *= -1;
      }
    }
  });
}

// Check for collision with walls
function checkWallCollision(newX, newY) {
  return walls.some((wall) => {
    return (
      newX + pacMan.size > wall.x &&
      newX - pacMan.size < wall.x + wall.width &&
      newY + pacMan.size > wall.y &&
      newY - pacMan.size < wall.y + wall.height
    );
  });
}

// Check for collision with pebbles
function checkPebbleCollision() {
  pebbles.forEach((pebble, index) => {
    const dist = Math.sqrt(
      (pacMan.x - pebble.x) ** 2 + (pacMan.y - pebble.y) ** 2
    );
    if (dist < pacMan.size) {
      // Remove pebble from array
      pebbles.splice(index, 1);
    }
  });
}

// Check for collision between Pac-Man and ghosts
function checkGhostCollision() {
  ghosts.forEach((ghost) => {
    const dist = Math.sqrt(
      (pacMan.x - ghost.x) ** 2 + (pacMan.y - ghost.y) ** 2
    );
    if (dist < pacMan.size + ghost.size) {
      // Reset Pac-Man to starting position
      pacMan.x = pacMan.startX;
      pacMan.y = pacMan.startY;
    }
  });
}

// Clear the canvas
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Update Pac-Man's position
function updatePacMan() {
  const newX = pacMan.x + pacMan.dx;
  const newY = pacMan.y + pacMan.dy;

  if (!checkWallCollision(newX, pacMan.y)) {
    pacMan.x = newX;
  }
  if (!checkWallCollision(pacMan.x, newY)) {
    pacMan.y = newY;
  }

  // Check for pebble and ghost collision
  checkPebbleCollision();
  checkGhostCollision();
}

// Keydown event to move Pac-Man
function movePacMan(e) {
  switch (e.key) {
    case "ArrowRight":
      pacMan.dx = pacMan.speed;
      pacMan.dy = 0;
      break;
    case "ArrowLeft":
      pacMan.dx = -pacMan.speed;
      pacMan.dy = 0;
      break;
    case "ArrowUp":
      pacMan.dx = 0;
      pacMan.dy = -pacMan.speed;
      break;
    case "ArrowDown":
      pacMan.dx = 0;
      pacMan.dy = pacMan.speed;
      break;
  }
}

// Keyup event to stop Pac-Man
function stopPacMan(e) {
  if (["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"].includes(e.key)) {
    pacMan.dx = 0;
    pacMan.dy = 0;
  }
}

// Game loop
function gameLoop() {
  clearCanvas();
  drawWalls(); // Draw walls
  drawPebbles(); // Draw pebbles
  drawPacMan(); // Draw Pac-Man
  drawGhosts(); // Draw ghosts
  updatePacMan(); // Update Pac-Man's position
  updateGhosts(); // Update ghost positions
  requestAnimationFrame(gameLoop);
}

// Event listeners for Pac-Man movement
document.addEventListener("keydown", movePacMan);
document.addEventListener("keyup", stopPacMan);

// Start the game
gameLoop();