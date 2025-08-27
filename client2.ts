const url = "http://localhost:3000"

// Secuencia await
await obtenerUsuarios()
await agregarUsuario("Mónica")
await obtenerUsuarios()
await obtenerUsuarioPorId(1)
await modificarUsuario(1, "Marcelo")
await agregarUsuario("Mónica")
await obtenerUsuarios()
await borrarUsuario(2)
await obtenerUsuarios()

async function obtenerUsuarios() {
    try {
        const response = await fetch(url + "/usuarios");
        const usuarios = await response.json();
        console.log("--- Obtener todos los usuarios ---");
        console.log(usuarios);
    } catch (error: any) {
        console.error("Error en obtenerUsuarios:", error);
    }
}

async function agregarUsuario(nombre: string) {
    try {
        const nuevoUsuario = { nombre: nombre };
        const response = await fetch(url + "/usuarios", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevoUsuario)
        });
        const usuarioCreado = await response.json();
        console.log("--- Usuario agregado ---");
        console.log(usuarioCreado);
    } catch (error: any) {
        console.error("Error en agregarUsuario:", error);
    }
}

async function obtenerUsuarioPorId(id: number) {
    try {
        const response = await fetch(`${url}/usuarios/${id}`);
        const usuario = await response.json();
        console.log(`--- Obtener usuario con ID ${id} ---`);
        console.log(usuario);
    } catch (error: any) {
        console.error("Error en obtenerUsuarioPorId:", error);
    }
}

async function modificarUsuario(id: number, nuevoNombre: string) {
    try {
        const usuarioModificado = { nombre: nuevoNombre };
        const response = await fetch(`${url}/usuarios/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(usuarioModificado)
        });
        const usuarioActualizado = await response.json();
        console.log(`--- Usuario con ID ${id} modificado ---`);
        console.log(usuarioActualizado);
    } catch (error: any) {
        console.error("Error en modificarUsuario:", error);
    }
}

async function borrarUsuario(id: number) {
    try {
        const response = await fetch(`${url}/usuarios/${id}`, {
            method: 'DELETE'
        });
        if (response.status === 204) {
             console.log(`--- Usuario con ID ${id} borrado ---`);
        } else {
            console.error(`Error al borrar el usuario. Código de estado: ${response.status}`);
        }
    } catch (error: any) {
        console.error("Error en borrarUsuario:", error);
    }
}

export {};