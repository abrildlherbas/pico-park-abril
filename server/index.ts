import { Elysia } from "elysia";
console.log("Hello via Bun!");

new Elysia()
  .ws("/ws", {
    message(ws, message) {
      ws.send(message);
      console.log("Mensaje recibido de ", ws.id, ":", message);
    },
  })
  .listen({
    hostname: "0.0.0.0",
    port: 3000,
  });

console.log("Estoy escuchando en 10.56.2.37:3000");
