import AsyncStorage from "@react-native-async-storage/async-storage";

// 1. CAMBIA ESTA IP SIEMPRE QUE CAMBIES DE RED O REINICIES LA PC
const BASE_URL = "http://192.168.1.13:8000/api"; 

export const loginService = async (email, password) => {
    try {
        const response = await fetch(`${BASE_URL}/auth/login/`, { // Asegúrate que en Django esta ruta exista para Firebase
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email, password}),
        });

        const data = await response.json();
        if(!response.ok) throw new Error(data.error || 'Error al iniciar sesión');
        return data;
    } catch (error){
        throw error;
    }
};

export const taskApiService = {
    getAll: (token) => fetch(`${BASE_URL}/tareas/`, {
        headers: { 'Authorization' : `Bearer ${token}` }
    }).then(res => res.json()),

    create: (token, data) => fetch(`${BASE_URL}/tareas/`, {
        method: 'POST',
        headers: {
            'Authorization' : `Bearer ${token}`,
            'Content-Type':'application/json'
        },
        body: JSON.stringify(data)
    }).then(res => res.json()),

    update: (token, id, data) => fetch(`${BASE_URL}/tareas/${id}/`, {
        method : 'PUT',
        headers: {
            'Authorization' : `Bearer ${token}`,
            'Content-Type':'application/json'
        },
        body: JSON.stringify(data)
    }).then(res => res.json()),

    delete: (token, id) => fetch(`${BASE_URL}/tareas/${id}/`, {
        method: 'DELETE',
        headers: { 'Authorization' : `Bearer ${token}` }
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
        const formData = new FormData();
        const filename = imageUri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image/jpeg`;

        formData.append('imagen', { // 'imagen' debe ser igual al nombre en el backend
            uri: imageUri,
            name: filename,
            type: type,
        });

        const response = await fetch(`${BASE_URL}/perfil/foto/`, {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': `Bearer ${token}`,
                // NO poner Content-Type manual aquí, fetch lo hace por el FormData
            },
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Error al subir la imagen');
        return result;
    } catch (error) {
        throw error;
    }
};