const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { updateGame, players } = require("./game");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

const MAX_PLAYERS = 4;

io.on("connection", (socket) => {
  console.log("🟢 Conectado:", socket.id);

  if (Object.keys(players).length >= MAX_PLAYERS) {
    socket.emit("full");
    socket.disconnect();
    return;
  }

  players[socket.id] = {
    id: socket.id,
    x: 100 + Math.random() * 200,
    y: 100,
    vx: 0,
    vy: 0,
    width: 40,
    height: 40,
    color: getRandomColor(),
    input: {},
    onGround: false
  };

  socket.emit("joined", players[socket.id]);

  socket.on("input", (data) => {
    if (players[socket.id]) {
      players[socket.id].input = data;
    }
  });

  socket.on("disconnect", () => {
    console.log("🔴 Desconectado:", socket.id);
    delete players[socket.id];
  });
});

// 🎮 GAME LOOP (30 FPS)
setInterval(() => {
  updateGame();
  io.emit("state", players);
}, 1000 / 30);

server.listen(3000, () => {
  console.log("🚀 Server corriendo en puerto 3000");
});

// util
function getRandomColor() {
  const colors = ["red", "blue", "green", "yellow"];
  return colors[Math.floor(Math.random() * colors.length)];
}