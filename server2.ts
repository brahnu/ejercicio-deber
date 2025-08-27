import http, {IncomingMessage, Server, ServerResponse} from 'node:http';
import type {OutgoingHttpHeaders} from 'node:http';
import type {ListenOptions} from 'node:net';

let usuarios=[
    {id: 1, nombre: "Jose"},
    {id :2 , nombre: "Ana"},
]

const opciones : ListenOptions = {
    port: 3000,
    host : "::",
}


const miHandler = (request: IncomingMessage, response: ServerResponse<IncomingMessage>) => {
    const { url, method } = request;
    let statusCode = 200;
    let responseBody: string = '';
    const responseHeaders: OutgoingHttpHeaders = {'Content-type': 'application/json'};

    // 1. Obtener todos los usuarios
    if (url === '/usuarios' && method === 'GET') {
        responseBody = JSON.stringify(usuarios);
    }
     // 5. Obtener un usuario específico por su ID
    else if (url?.startsWith('/usuarios/') && method === 'GET') {
        const id = parseInt(url.split('/')[2]);
        const usuario = usuarios.find(u => u.id === id);
        if (usuario) {
            responseBody = JSON.stringify(usuario);
        } else {
            statusCode = 404;
            responseBody = JSON.stringify({ error: 'Usuario no encontrado' });
        }
    }
     // 2. Agregar usuario
    else if (url === '/usuarios' && method === 'POST') {
        let body = '';
        request.on('data', chunk => {
            body += chunk.toString();
        });
        request.on('end', () => {
            try {
                const nuevoUsuario = JSON.parse(body);
                nuevoUsuario.id = usuarios.length > 0 ? Math.max(...usuarios.map(u => u.id)) + 1 : 1;
                usuarios.push(nuevoUsuario);
                statusCode = 201; // Created
                responseBody = JSON.stringify(nuevoUsuario);
                response.writeHead(statusCode, responseHeaders);
                response.end(responseBody);
            } catch (error) {
                statusCode = 400; // Bad Request
                responseBody = JSON.stringify({ error: 'JSON inválido' });
                response.writeHead(statusCode, responseHeaders);
                response.end(responseBody);
            }
        });
        return;
    }

    // 4. Borrar un usuario por ID
    else if (url?.startsWith('/usuarios/') && method === 'DELETE') {
        const id = parseInt(url.split('/')[2]);
        const indice = usuarios.findIndex(u => u.id === id);
        if (indice !== -1) {
            usuarios.splice(indice, 1);
            statusCode = 204;
        } else {
            statusCode = 404;
            responseBody = JSON.stringify({ error: 'Usuario no encontrado' });
        }
    } // 3. Modificar un usuario por su ID
    else if (url?.startsWith('/usuarios/') && method === 'PUT') {
        let body = '';
        request.on('data', chunk => {
            body += chunk.toString();
        });
        request.on('end', () => {
            try {
                const id = parseInt(url.split('/')[2]);
                const datosActualizados = JSON.parse(body);
                const usuario = usuarios.find(u => u.id === id);
                if (usuario) {
                    Object.assign(usuario, datosActualizados);
                    responseBody = JSON.stringify(usuario);
                    response.writeHead(200, responseHeaders);
                    response.end(responseBody);
                } else {
                    responseBody = JSON.stringify({ error: 'Usuario no encontrado' });
                    response.writeHead(404, responseHeaders);
                    response.end(responseBody);
                }
            } catch (error) {
                responseBody = JSON.stringify({ error: 'JSON inválido' });
                response.writeHead(400, responseHeaders);
                response.end(responseBody);
            }
        });
        return;
    }

    else {
        statusCode = 404;
        responseBody = JSON.stringify({ error: 'Ruta no encontrada' });
    }

    response.writeHead(statusCode, responseHeaders);
    response.end(responseBody);
};

const server: Server = http.createServer();
server.on('request', miHandler);
server.listen(opciones, () => {
  console.log('Servidor escuchando en http://localhost:3000');
});