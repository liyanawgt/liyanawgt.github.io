const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game objects
const pacMan = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: Math.min(canvas.width, canvas.height) * 0.05,
  dx: 0,
  dy: 0,
  speed: 1.5, // Adjusted for smoother and slower movement
};

const numGhosts = 4; // Number of ghosts
const ghosts = [];
const mcspicyImage = new Image();
mcspicyImage.src = "mcspicy.png";

const pellets = [];
const numPellets = 5;
const pelletSize = Math.min(canvas.width, canvas.height) * 0.02;

// Initialize ghosts
for (let i = 0; i < numGhosts; i++) {
  ghosts.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    dx: Math.random() < 0.5 ? 2 : -2,
    dy: Math.random() < 0.5 ? 2 : -2,
    range: 100, // Movement range
    startX: Math.random() * canvas.width,
    startY: Math.random() * canvas.height,
  });
}

// Initialize pellets
for (let i = 0; i < numPellets; i++) {
  pellets.push({
    x: Math.random() * (canvas.width - pelletSize),
    y: Math.random() * (canvas.height - pelletSize),
  });
}

// Handle keyboard input
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") {
    pacMan.dy = -pacMan.speed;
    pacMan.dx = 0;
  } else if (e.key === "ArrowDown") {
    pacMan.dy = pacMan.speed;
    pacMan.dx = 0;
  } else if (e.key === "ArrowLeft") {
    pacMan.dx = -pacMan.speed;
    pacMan.dy = 0;
  } else if (e.key === "ArrowRight") {
    pacMan.dx = pacMan.speed;
    pacMan.dy = 0;
  }
});

// Update game objects
function update() {
  // Update Pac-Man's position
  pacMan.x += pacMan.dx;
  pacMan.y += pacMan.dy;

  // Keep Pac-Man within bounds
  if (pacMan.x < 0) pacMan.x = 0;
  if (pacMan.y < 0) pacMan.y = 0;
  if (pacMan.x > canvas.width - pacMan.size) pacMan.x = canvas.width - pacMan.size;
  if (pacMan.y > canvas.height - pacMan.size) pacMan.y = canvas.height - pacMan.size;

  // Update ghost positions
  ghosts.forEach((ghost) => {
    ghost.x += ghost.dx;
    ghost.y += ghost.dy;

    // Reverse direction when hitting range limits
    if (ghost.x > ghost.startX + ghost.range || ghost.x < ghost.startX - ghost.range) {
      ghost.dx *= -1;
    }
    if (ghost.y > ghost.startY + ghost.range || ghost.y < ghost.startY - ghost.range) {
      ghost.dy *= -1;
    }

    // Prevent stuck ghosts
    if (ghost.dx === 0) ghost.dx = Math.random() < 0.5 ? 2 : -2;
    if (ghost.dy === 0) ghost.dy = Math.random() < 0.5 ? 2 : -2;
  });

  // Check for pellet collisions
  pellets.forEach((pellet, index) => {
    if (
      pacMan.x < pellet.x + pelletSize &&
      pacMan.x + pacMan.size > pellet.x &&
      pacMan.y < pellet.y + pelletSize &&
      pacMan.y + pacMan.size > pellet.y
    ) {
      pellets.splice(index, 1); // Remove pellet
    }
  });

  // Check for game over (collision with ghosts)
  ghosts.forEach((ghost) => {
    if (
      pacMan.x < ghost.x + pacMan.size &&
      pacMan.x + pacMan.size > ghost.x &&
      pacMan.y < ghost.y + pacMan.size &&
      pacMan.y + pacMan.size > ghost.y
    ) {
      alert("Game Over!");
      document.location.reload();
    }
  });
}

// Draw game objects
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw Pac-Man
  ctx.beginPath();
  ctx.arc(
    pacMan.x + pacMan.size / 2,
    pacMan.y + pacMan.size / 2,
    pacMan.size / 2,
    0.2 * Math.PI,
    1.8 * Math.PI
  );
  ctx.lineTo(pacMan.x + pacMan.size / 2, pacMan.y + pacMan.size / 2);
  ctx.fillStyle = "yellow";
  ctx.fill();
  ctx.closePath();

  // Draw ghosts
  const ghostSize = Math.min(canvas.width, canvas.height) * 0.08; // Scale size dynamically
  ghosts.forEach((ghost) => {
    ctx.drawImage(mcspicyImage, ghost.x - ghostSize / 2, ghost.y - ghostSize / 2, ghostSize, ghostSize);
  });

  // Draw pellets
  pellets.forEach((pellet) => {
    ctx.beginPath();
    ctx.arc(pellet.x + pelletSize / 2, pellet.y + pelletSize / 2, pelletSize / 2, 0, 2 * Math.PI);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.closePath();
  });
}

// Main game loop
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// Start the game loop
mcspicyImage.onload = () => {
  gameLoop();
};
