import { IncomingMessage, ServerResponse } from 'node:http';
import { usuarios } from "../handler.ts"

const handleUser = (user_id: number, request : IncomingMessage, response : ServerResponse<IncomingMessage>) => {
    const { method } = request

    
    if (!usuarios) {
        response.writeHead(404, {'Content-Type': 'aplication/json'})
        response.end(JSON.stringify({message:"Pagina no encontrada"}))
    }

    const user_idx = usuarios.findIndex(u => u.id_usuario === user_id)
    
    if (user_idx === -1){
        response.writeHead(404, {'Content-Type': 'aplication/json'})
        response.end(JSON.stringify({message:"Pagina no encontrada"}))
        return
    }

    if (method == "GET"){
        response.writeHead(200, {'Content-Type': 'aplication/json'})
        response.end(JSON.stringify(usuarios[user_idx]))
    }

    if (method == "PUT"){
        let body = "";
        request.on("data", chunk => {
            body += chunk.toString()
        })

        request.on("end", () => {
            response.writeHead(201, {'Content-Type': 'aplication/json'})
            const data = JSON.parse(body);
            usuarios[user_idx]!.nombre = data.nombre
            
            response.end(JSON.stringify(usuarios[user_idx]))
        })
        
    }

    if (method == "DELETE"){
        response.writeHead(204, {'Content-Type': 'aplication/json'})
        usuarios.splice(user_id-1)
        response.end()
    }
}

export default { handleUser }