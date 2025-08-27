import http, { IncomingMessage, Server, ServerResponse } from "node:http";

import type { OutgoingHttpHeaders } from "node:http";
import type { ListenOptions } from "node:net";
import { miHandler } from "./handler.ts";

const opciones: ListenOptions = {
  port: 3000,
  host: "::",
};


const server: Server = http.createServer();
server.on("request", miHandler);

server.listen(opciones);

server.on("request", (req) => {
  const { url, method } = req;
  console.log("Recibimos una request: ", { url, method });
});

server.on("listening", () => {
  console.log(`Servidor escuchando en http://localhost:${opciones.port}`);
});
