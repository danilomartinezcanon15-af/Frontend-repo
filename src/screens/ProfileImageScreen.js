import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker'; // Librería de Expo
import { AuthContext } from '../context/authContext';
import { uploadProfileImageService } from '../api/apiService';

const ProfileImageScreen = ({ navigation }) => {
    const { userToken } = useContext(AuthContext);
    const [selectedImage, setSelectedImage] = useState(null); // Uri local
    const [uploading, setUploading] = useState(false);

    // FUNCIÓN: Pedir permiso y abrir la galería
    const pickImage = async () => {
        // 1. Solicitar permisos (obligatorio)
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        if (status !== 'granted') {
            Alert.alert("Permisos requeridos", "Necesitamos acceso a tu galería para cambiar la foto.");
            return;
        }

        // 2. Abrir la interfaz de selección
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images, // Solo imágenes
            allowsEditing: true, // Permitir recorte cuadrado
            aspect: [1, 1], // Ratio 1:1 para avatar circular
            quality: 0.8, // Calidad (1 es máxima)
        });

        if (!result.canceled) {
            // Guardamos la uri local para la vista previa
            setSelectedImage(result.assets[0].uri);
        }
    };

    // FUNCIÓN: Llamar a la API para subir la foto
    const handleUpload = async () => {
        if (!selectedImage) return Alert.alert("Error", "Selecciona una imagen primero");

        setUploading(true);
        try {
            await uploadProfileImageService(userToken, selectedImage);
            Alert.alert("¡Éxito!", "Tu foto de perfil se ha actualizado correctamente.");
            navigation.replace('Home'); // .replace evita que el usuario regrese a la pantalla de carga
        } catch (error) {
            // Error detallado para depuración
            Alert.alert("Error de subida", error.message || "No se pudo conectar con el servidor");
            console.error("DEBUG UPLOAD:", error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>📸 Cambiar Foto de Perfil</Text>
            
            {/* VISTA PREVIA (Condicional) */}
            {selectedImage ? (
                <Image source={{ uri: selectedImage }} style={styles.previewImage} />
            ) : (
                <View style={styles.placeholder}>
                    <Text style={styles.placeholderText}>No has seleccionado imagen</Text>
                </View>
            )
            }

            {/* BOTÓN: Seleccionar de Galería */}
            <TouchableOpacity style={styles.selectBtn} onPress={pickImage} disabled={uploading}>
                <Text style={styles.selectText}>Elegir de la galería</Text>
            </TouchableOpacity>

            {/* BOTÓN: Subir a Cloudinary (Condicional) */}
            {selectedImage && (
                <TouchableOpacity style={styles.uploadBtn} onPress={handleUpload} disabled={uploading}>
                    {uploading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.uploadText}>Subir y Guardar</Text>
                    )}
                </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.navigate('Home')} disabled={uploading}>
                <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', padding: 20, paddingTop: 60, alignItems: 'center' },
    title: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 30 },
    previewImage: { width: 200, height: 200, borderRadius: 100, marginBottom: 20 },
    placeholder: { width: 200, height: 200, borderRadius: 100, backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
    placeholderText: { color: '#888', textAlign: 'center' },
    selectBtn: { width: '100%', padding: 15, borderRadius: 10, borderWidth: 2, borderColor: '#39A900', alignItems: 'center', marginBottom: 15 },
    selectText: { color: '#39A900', fontWeight: 'bold' },
    uploadBtn: { width: '100%', padding: 15, borderRadius: 10, backgroundColor: '#39A900', alignItems: 'center' },
    uploadText: { color: '#fff', fontWeight: 'bold' },
    cancelBtn: { marginTop: 'auto', padding: 15 },
    cancelText: { color: '#FF4444' }
});

export default ProfileImageScreen;

//Editor de imagen de perfil