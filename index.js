const express = require('express');
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.get('/',function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

app.use('/',express.static(__dirname));

/* Server */
// Movement keys
const W = 87;
const A = 65;
const S = 83;
const D = 68;

// The data
let data = {players:{}} ;

let width = 1200;
let height = 600;

io.sockets.on("connection", socket => {

  // New player connected
  console.log("player connected");

  // Create new player
  data.players[socket.id] = {
    pos:{x:Math.random() * ((width-30) - 30 +1) + 30, y:Math.random() * ((height-30) - 30 +1) + 30},
    vel:{xv:0, yv:0},
    mass:1,
    size:30,
    color:{r:Math.random()*255, g:Math.random()*255, b:Math.random()*255}
  };
    io.emit('update', data);
console.log(data);

  socket.on("disconnect", () => {
    // Player  disconnected
    console.log("player disconnected");
    // Delete player
    delete data.players[socket.id];
  });

setInterval(function(){
    if (socket.id in data.players){
        let p = data.players[socket.id]
        let p2;
        let dot;
        let rad;
        for(let playerID of Object.keys(data.players)) {
            
            if (playerID !== socket.id){
                p2 = data.players[playerID];
                rad = Math.sqrt((p.pos.x - p2.pos.x)**2 + (p.pos.y - p2.pos.y)**2)
                if (rad <= 60){

        // Get the the player from the player's id
    
    dot = ((p.vel.xv - p2.vel.xv) * (p.pos.x - p2.pos.x)) + ((p.vel.yv - p2.vel.yv) * (p.pos.y - p2.pos.y))
    let temp1 = ((dot / rad**2)*(p2.pos.x-p.pos.x));
    let temp2 = ((dot / rad**2)*(p2.pos.y-p.pos.y));
    p2.vel.xv = ((dot / rad**2)*(p.pos.x-p2.pos.x));
    p2.vel.yv = ((dot / rad**2)*(p.pos.y-p2.pos.y));
    p.vel.xv = temp1;
    p.vel.yv = temp2;
                }
            
            }

        }
      


        
         p.vel.yv *= 0.99;
        p.vel.xv *= 0.99;
        p.pos.y += p.vel.yv;
        p.pos.x += p.vel.xv;
    
    if (p.pos.x > width - p.size) {
            p.pos.x = width - p.size-1;
        p.vel.xv *= -1
        }
        if(p.pos.x < p.size) {
            p.pos.x = p.size;
            p.vel.xv *= -1
        }
        if(p.pos.y > height - p.size) {
            p.pos.y = height - p.size-1;
            p.vel.yv *= -1
        }
        if(p.pos.y < p.size) {
            p.pos.y = p.size;
            p.vel.yv *= -1
    }
      
    }
    
            socket.emit('update', data);
            }, 0005);
    
  // Movement event
  socket.on("move", key => {
    // Get the current player
    let player = data.players[socket.id];
    // Check which movement key was pressed, and move accordingly
    if(key == W) {
        player.vel.yv -= 0.05;
    }
    if(key == A) {
        player.vel.xv -= 0.05;
    }
    if(key == S) {
        player.vel.yv += 0.05;
    }
    if(key == D) {
        player.vel.xv += 0.05;
    }
    

    // Check if player is touching the boundry, if so stop them from moving past it
    if (player.pos.x > width - player.size) {
        player.pos.x = width - player.size;
    }
    if(player.pos.x < 0) {
        player.pos.x = 0;
    }
    if(player.pos.y > height - player.size) {
        player.pos.y = height - player.size;
    }
    if(player.pos.y < 0) {
        player.pos.y = 0;
    }
  });
});



http.listen(process.env.PORT);
