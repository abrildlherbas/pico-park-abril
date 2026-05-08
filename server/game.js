const players = {};

// =========================
// CONFIG
// =========================

const GRAVITY = 0.5;

const FLOOR = 400;

// =========================
// LLAVE
// =========================

const key = {
  x: 650,
  y: 360,

  width: 30,
  height: 30,

  taken: false
};

// =========================
// PUERTA
// =========================

const door = {
  x: 720,
  y: 340,

  width: 50,
  height: 60,

  open: false
};

// =========================
// UPDATE GAME
// =========================

function updateGame() {

  Object.values(players).forEach((p) => {

    // movimiento horizontal
    if (p.input?.left) {

      p.vx = -3;

    } else if (p.input?.right) {

      p.vx = 3;

    } else {

      p.vx = 0;

    }

    // salto
    if (p.input?.jump && p.onGround) {

      p.vy = -10;

      p.onGround = false;

    }

    // gravedad
    p.vy += GRAVITY;

    // actualizar posición
    p.x += p.vx;

    p.y += p.vy;

    // piso
    if (p.y > FLOOR) {

      p.y = FLOOR;

      p.vy = 0;

      p.onGround = true;

    }

    // límites
    if (p.x < 0) p.x = 0;

    if (p.x > 760) p.x = 760;

    // =========================
    // COLISIÓN LLAVE
    // =========================

    if (
      p.x < key.x + key.width &&
      p.x + p.width > key.x &&
      p.y < key.y + key.height &&
      p.y + p.height > key.y
    ) {

      key.taken = true;

      door.open = true;

    }

  });

  // =========================
  // VICTORIA
  // =========================

  if (door.open) {

    let playersAtDoor = 0;

    Object.values(players).forEach((p) => {

      if (
        p.x < door.x + door.width &&
        p.x + p.width > door.x &&
        p.y < door.y + door.height &&
        p.y + p.height > door.y
      ) {

        playersAtDoor++;

      }

    });

    if (
      playersAtDoor === Object.keys(players).length &&
      playersAtDoor > 0
    ) {

      console.log("🎉 NIVEL COMPLETADO");

    }

  }

}

// =========================
// EXPORTS
// =========================

module.exports = {
  updateGame,
  players,
  key,
  door
};