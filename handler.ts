import { IncomingMessage, Server, ServerResponse } from "node:http";

import users_by_id from "./routes/users_by_id.ts";

let id_usuario = 1;
export type Usuario = {
  id_usuario: number;
  nombre: string;
};

export const usuarios: Usuario[] = [];

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


export const miHandler = async (
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

  const match = url!.match(/^\/usuarios\/(\d+)$/)
    if (match) return users_by_id.handleUser(Number(match[1]), request, response)

  response.writeHead(404);
  response.end(JSON.stringify({ error: "Not Found" }));
};