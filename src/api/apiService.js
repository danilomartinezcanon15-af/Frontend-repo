import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "http://192.168.1.13:8000/api";

export const loginService = async (email, password) => {
    try {
        const response = await fetch(`${BASE_URL}/auth/login/`, {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email, password}),
        });

        const data = await response.json(); 

        if(!response.ok){
            throw new Error(data.error || 'Error al iniciar sesion');
        }

        return data;
    } catch (error){
        throw error;
    }
};

export const taskApiService = {
    // Listar (get)
    getAll: (token) => fetch(`${BASE_URL}/tareas/`, {
        headers: {
            'Authorization' : `Bearer ${token}`
        }
    }).then(res => res.json()),

    // Crear
    create: (token, data) => fetch(`${BASE_URL}/tareas/`, {
        method: 'POST',
        headers: {
            'Authorization' : `Bearer ${token}`,
            'Content-Type':'application/json'
        },
        body: JSON.stringify(data)
    }).then(res => res.json()),

    // Editar
    update: (token, id, data) => fetch(`${BASE_URL}/tareas/${id}/`, {
        method : 'PUT',
        headers: {
            'Authorization' : `Bearer ${token}`,
            'Content-Type':'application/json'
        },
        body: JSON.stringify(data)
    }).then(res => res.json()),

    // Eliminar
    delete: (token, id) => fetch(`${BASE_URL}/tareas/${id}/`, {
        method: 'DELETE',
        headers: {
            'Authorization' : `Bearer ${token}`
        }
    })
};

export const getProfileService = async (token) => {
    const response = await fetch(`${BASE_URL}/perfil/`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error("Error al obtener perfil");
    return await response.json();
};

export const uploadProfileImageService = async (token, imageUri) => {
    try {
        // 1. Crear el objeto FormData
        const formData = new FormData();

        // 2. Preparar el archivo de imagen para la subida
        // 'imageUri' es la ruta local en el celular (ej: 'file:///...')
        // Extraemos el nombre del archivo de la ruta
        const filename = imageUri.split('/').pop();
        
        // Inferimos el tipo Mime (ej: 'image/jpeg')
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image`;

        // 3. Añadir el archivo al FormData (clave: 'imagen' debe coincidir con Django)
        formData.append('imagen', {
            uri: imageUri,
            name: filename, // Nombre que tendrá en el backend
            type: type, // Tipo de archivo (crucial para multipart/form-data)
        });

        // 4. Realizar la petición POST
        const response = await fetch(`${BASE_URL}/perfil/foto/`, {
            method: 'POST',
            body: formData, // FormData establece automáticamente las cabeceras multipart
            headers: {
                'Authorization': `Bearer ${token}`,
                // 'Content-Type': 'multipart/form-data' <-- NO lo pongas manualmente, fetch lo hace.
            },
        });

        if (!response.ok) throw new Error('Error al subir la imagen');
        
        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const getChatHistoryService = async (token) => {
    try {
        const response = await fetch(`${BASE_URL}/chat/historial/`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Error cargando historial de chat');
        return await response.json();
    } catch (error) {
        throw error;
    }
};