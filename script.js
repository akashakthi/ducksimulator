const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

const duckImage = new Image();
duckImage.src = 'assets/duck.png';

const ducks = [];
const player = { x: 400, y: 300 };

let whistleSound = new Audio('assets/whistle.mp3');

// Create a Duck class
class Duck {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.dx = Math.random() * 2 - 1;
    this.dy = Math.random() * 2 - 1;
    this.size = 20;
  }

  move() {
    this.x += this.dx;
    this.y += this.dy;

    // Boundary check
    if (this.x < 0 || this.x > canvas.width) this.dx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.dy *= -1;
  }

  draw() {
    ctx.drawImage(duckImage, this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
  }
}

// Spawn ducks
for (let i = 0; i < 10; i++) {
  ducks.push(new Duck(Math.random() * canvas.width, Math.random() * canvas.height));
}

// Player interaction
document.getElementById('whistle').addEventListener('click', () => {
  whistleSound.play();
  ducks.forEach(duck => {
    duck.dx = (player.x - duck.x) * 0.01;
    duck.dy = (player.y - duck.y) * 0.01;
  });
});

// Game loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw player
  ctx.fillStyle = 'blue';
  ctx.fillRect(player.x - 10, player.y - 10, 20, 20);

  // Update and draw ducks
  ducks.forEach(duck => {
    duck.move();
    duck.draw();
  });

  requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();
let currentWeather = 'sunny';
let timeOfDay = 0; // Representing time in minutes (0-1440 for a full day)

function updateWeatherAndTime() {
  timeOfDay += 1; // 1 minute per frame

  // Reset the day after 1440 minutes (24 hours)
  if (timeOfDay >= 1440) {
    timeOfDay = 0;
  }

  // Change weather based on time
  if (timeOfDay < 480) {
    currentWeather = 'sunny'; // Morning
  } else if (timeOfDay < 960) {
    currentWeather = 'cloudy'; // Afternoon
  } else {
    currentWeather = 'rainy'; // Night
  }

  // Modify background and duck behavior based on weather
  switch (currentWeather) {
    case 'sunny':
      canvas.style.backgroundColor = '#c2f0c2'; // Light green
      ducks.forEach(duck => (duck.speedModifier = 1));
      break;
    case 'cloudy':
      canvas.style.backgroundColor = '#a0b8c2'; // Greyish blue
      ducks.forEach(duck => (duck.speedModifier = 0.8));
      break;
    case 'rainy':
      canvas.style.backgroundColor = '#657b8c'; // Dark blue
      ducks.forEach(duck => (duck.speedModifier = 0.6));
      break;
  }
}
