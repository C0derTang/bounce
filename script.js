const socket = io();

/* Setup */
let canvas = document.getElementById('myCanvas');
let ctx = canvas.getContext('2d');

/* Update & Events */
// Create the movement keys
const W = 87;
const A = 65;
const S = 83;
const D = 68;

let up = 0;
let down = 0;
let left = 0;
let right = 0;

// Get the update from the server
socket.on("update", data => {
    p = data.players[socket.id];
    
    if (up == 1){
            socket.emit('move', W, p)
        }
        if (left == 1){
            socket.emit('move', A, p)
        }
        if (down == 1){
            socket.emit('move', S, p)
        }
        if (right == 1){
            socket.emit('move', D, p)
        }
  ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
  ctx.lineWidth = "25";
    ctx.stroke();
  ctx.closePath()
    // Draw each player
  for(let playerID of Object.keys(data.players)) {
    // Get the the player from the player's id
    let player = data.players[playerID];

    // Draw the player
      ctx.beginPath();
    ctx.arc(player.pos.x, player.pos.y, player.size, 0, Math.PI*2);
    ctx.fillStyle = `rgb(
        ${player.color.r},
        ${player.color.g},
        ${player.color.b})`;
    ctx.fill();
    ctx.lineWidth = "5";
    ctx.stroke();
    ctx.closePath();

  }
});

//receive input to move player
document.addEventListener('keydown', function (event) {
  if (event.key === 'w') {
      up = 1;
  }
  if (event.key === 'a') {
      left = 1;
  }
  if (event.key === 's') {
      down = 1;
  }
  if (event.key === 'd') {
      right = 1;
  }
});

document.addEventListener('keyup', function (event) {
  if (event.key === 'w') {
      up = 0;
  }
  if (event.key === 'a') {
      left = 0;
  }
  if (event.key === 's') {
      down = 0;
  }
  if (event.key === 'd') {
      right = 0;
  }
});

