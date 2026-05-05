const players = {};

const GRAVITY = 0.5;
const FLOOR = 400;

function updateGame() {
  Object.values(players).forEach((p) => {

    if (p.input?.left) p.vx = -3;
    else if (p.input?.right) p.vx = 3;
    else p.vx = 0;

    if (p.input?.jump && p.onGround) {
      p.vy = -10;
      p.onGround = false;
    }

    p.vy += GRAVITY;

    p.x += p.vx;
    p.y += p.vy;

    if (p.y > FLOOR) {
      p.y = FLOOR;
      p.vy = 0;
      p.onGround = true;
    }

    if (p.x < 0) p.x = 0;
    if (p.x > 760) p.x = 760;
  });
}

module.exports = { updateGame, players };