import { Elysia } from "elysia";

console.log("Hello via Bun!");

type Player = {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  onGround: boolean;
  input: { left: boolean; right: boolean; jump: boolean };
  hasKey: boolean;
  atDoor: boolean;
};

const COLORS = ["#e74c3c", "#3498db", "#2ecc71", "#f1c40f"];
const players = new Map<string, Player>();
const wsByPlayer = new Map<string, any>();
const hosts = new Set<any>();

const level = {
  width: 800,
  height: 450,
  groundY: 400,
  key: { x: 700, y: 360, taken: false },
  door: { x: 50, y: 350, width: 40, height: 50 },
};
let winner = false;

function broadcastState() {
  const state = {
    type: "state",
    players: Array.from(players.values()).map((p) => ({
      id: p.id,
      x: p.x,
      y: p.y,
      color: p.color,
      hasKey: p.hasKey,
    })),
    key: level.key,
    won: winner,
  };
  const msg = JSON.stringify(state);
  for (const h of hosts) h.send(msg);
  for (const p of wsByPlayer.values()) p.send(msg);
}

new Elysia()
  .ws("/ws", {
    open(ws) {
      const isHost = ws.data?.query?.role === "host";
      if (isHost) {
        hosts.add(ws);
        console.log("🖥️ Host conectado");
        return;
      }
      if (players.size >= 4) {
        ws.send(JSON.stringify({ type: "full" }));
        ws.close();
        return;
      }
      const index = players.size;
      const player: Player = {
        id: ws.id,
        x: 60 + index * 50,
        y: 300,
        vx: 0,
        vy: 0,
        color: COLORS[index] ?? "#888888",
        onGround: true,
        input: { left: false, right: false, jump: false },
        hasKey: false,
        atDoor: false,
      };
      players.set(ws.id, player);
      wsByPlayer.set(ws.id, ws);
      ws.send(
        JSON.stringify({ type: "assigned", color: player.color, id: ws.id }),
      );
      console.log(`🟢 Jugador conectado: ${ws.id} (${player.color})`);
    },
    message(ws, message) {
      console.log(ws.data);
      const player = players.get(ws.id);
      if (!player) return;
      try {
        const data = JSON.parse(message as string);
        if (data.type === "input") {
          const isDown = data.state === "down";

          if (data.key === "left") player.input.left = isDown;
          if (data.key === "right") player.input.right = isDown;

          // El salto solo se activa si el estado cambia a "down"
          if (data.key === "jump" && isDown && player.onGround) {
            player.vy = JUMP_FORCE;
            player.onGround = false;
          }
        }
      } catch {}
    },
    close(ws) {
      hosts.delete(ws);
      players.delete(ws.id);
      wsByPlayer.delete(ws.id);
      console.log(`🔴 Desconectado: ${ws.id}`);
    },
  })
  .listen({ hostname: "0.0.0.0", port: 3000 });

console.log("Estoy escuchando en 0.0.0.0:3000");

const GRAVITY = 1200,
  MOVE_SPEED = 200,
  JUMP_FORCE = -500,
  TICK = 1000 / 30;

setInterval(() => {
  const dt = TICK / 1000;
  for (const p of players.values()) {
    // 1. Calcular velocidad horizontal basada en el estado continuo
    p.vx = 0;
    if (p.input.left) p.vx = -MOVE_SPEED;
    if (p.input.right) p.vx = MOVE_SPEED;

    // 2. Aplicar gravedad y físicas (YA NO LIMPIAMOS JUMP AQUÍ, se procesa en el mensaje)
    p.vy += GRAVITY * dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;

    // 3. Colisión con el suelo
    if (p.y >= level.groundY) {
      p.y = level.groundY;
      p.vy = 0;
      p.onGround = true;
    }

    // Límites de la pantalla
    p.x = Math.max(20, Math.min(level.width - 20, p.x));

    // Lógica de llaves y puertas...
    if (
      !level.key.taken &&
      Math.abs(p.x - level.key.x) < 25 &&
      Math.abs(p.y - level.key.y) < 25
    ) {
      level.key.taken = true;
      p.hasKey = true;
    }
    if (
      p.hasKey &&
      p.x < level.door.x + level.door.width &&
      p.y > level.door.y - level.door.height
    ) {
      p.atDoor = true;
    }
  }

  if (players.size === 4 && Array.from(players.values()).every((p) => p.atDoor))
    winner = true;
  broadcastState();
}, TICK);
