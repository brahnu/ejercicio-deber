import http, { IncomingMessage, Server, ServerResponse } from "node:http";

import type { OutgoingHttpHeaders } from "node:http";
import type { ListenOptions } from "node:net";

const opciones: ListenOptions = {
  port: 3000,
  host: "::",
};

let id_usuario = 1;
type Usuario = {
  id_usuario: number;
  nombre: string;
};

const usuarios: Usuario[] = [];

const parseBody = (request: IncomingMessage): Promise<any> => {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk.toString();
    });
    request.on("end", () => {
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error("JSON inválido"));
      }
    });
  });
};

const miHandler = async (
  request: IncomingMessage,
  response: ServerResponse<IncomingMessage>
) => {
  const { method, url } = request;
  response.setHeader("Content-Type", "application/json");

  if (method === "GET" && url === "/usuarios") {
    response.writeHead(200);
    response.end(JSON.stringify(usuarios));
    return;
  }

  if (method === "POST" && url === "/usuarios") {
    try {
      const nuevoUsuario = await parseBody(request);
      nuevoUsuario.id_usuario = id_usuario++;
      usuarios.push(nuevoUsuario);

      response.writeHead(201);
      response.end(JSON.stringify(nuevoUsuario));
    } catch {
      response.writeHead(400);
      response.end(JSON.stringify({ error: "JSON inválido" }));
    }
    return;
  }
  ////////
  //////// Aqui va la parte de matias, get, post con id, put y delete /////
  ////////
  response.writeHead(404);
  response.end(JSON.stringify({ error: "Not Found" }));
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
