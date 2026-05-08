const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const {
  updateGame,
  players,
  key,
  door
} = require("./game");

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

const MAX_PLAYERS = 4;

// =========================
// CONEXIÓN DE JUGADORES
// =========================

io.on("connection", (socket) => {

  console.log("🟢 Conectado:", socket.id);

  // límite de jugadores
  if (Object.keys(players).length >= MAX_PLAYERS) {

    socket.emit("full");

    socket.disconnect();

    return;
  }

  // crear jugador
  players[socket.id] = {
    id: socket.id,

    x: 100 + Math.random() * 200,
    y: 100,

    vx: 0,
    vy: 0,

    width: 40,
    height: 40,

    color: getRandomColor(),

    onGround: false,

    input: {
      left: false,
      right: false,
      jump: false
    }
  };

  console.log("🎮 Jugadores:", Object.keys(players).length);

  // enviar info al jugador
  socket.emit("joined", players[socket.id]);

  // =========================
  // INPUTS
  // =========================

  socket.on("input", (data) => {

    const player = players[socket.id];

    if (!player) return;

    // merge inputs
    player.input = {
      ...player.input,
      ...data
    };

  });

  // =========================
  // DESCONECTAR
  // =========================

  socket.on("disconnect", () => {

    console.log("🔴 Desconectado:", socket.id);

    delete players[socket.id];

  });

});

// =========================
// GAME LOOP
// =========================

setInterval(() => {

  updateGame();

  io.emit("state", {
    players,
    key,
    door
  });

}, 1000 / 30);

// =========================
// INICIAR SERVER
// =========================

server.listen(3000, () => {

  console.log("🚀 Server corriendo en puerto 3000");

});

// =========================
// UTIL
// =========================

function getRandomColor() {

  const colors = [
    "red",
    "blue",
    "green",
    "yellow"
  ];

  return colors[
    Math.floor(Math.random() * colors.length)
  ];

}