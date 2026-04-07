import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { AuthContext } from '../context/authContext';
import { getChatHistoryService, getProfileService } from '../api/apiService';

const ChatScreen = () => {
    const { userToken } = useContext(AuthContext);
    const [mensaje, setMensaje] = useState('');
    const [mensajes, setMensajes] = useState([]);
    const [miPerfil, setMiPerfil] = useState(null);
    const [cargando, setCargando] = useState(true);
    const ws = useRef(null);
    const flatListRef = useRef(null);

    useEffect(() => {
        const iniciarChat = async () => {
            try {
                // 1. Obtener perfil para saber mi nombre
                const perfil = await getProfileService(userToken);
                setMiPerfil(perfil);

                // 2. Cargar historial de Firestore (vía Django REST)
                const historial = await getChatHistoryService(userToken);
                setMensajes(historial);

                // 3. Conectar al WebSocket de Django Channels
                // IMPORTANTE: Cambia la IP por tu IP de Linux Mint (ej: 10.253.179.215)
                ws.current = new WebSocket(`ws://192.168.1.13:8000/ws/chat/`);

                ws.current.onmessage = (e) => {
                    const nuevoMensaje = JSON.parse(e.data);
                    // Agregamos el nuevo mensaje al final de la lista
                    setMensajes((prev) => [...prev, nuevoMensaje]);
                };

                setCargando(false);
            } catch (error) {
                console.error("Error iniciando chat:", error);
                setCargando(false);
            }
        };

        iniciarChat();

        // Limpieza: cerramos el socket al salir de la pantalla
        return () => {
            if (ws.current) ws.current.close();
        };
    }, []);

    const enviarMensaje = () => {
        if (mensaje.trim() && ws.current && miPerfil) {
            // Fallback: Si no hay uid, usamos el email (así garantizamos que se envíe algo)
            const identificador = miPerfil.uid || miPerfil.email || 'Instructor_Aprendiz';

            ws.current.send(JSON.stringify({
                'mensaje': mensaje,
                'uid_usuario': identificador 
            }));
            setMensaje(''); 
        }
    };

    if (cargando) return <ActivityIndicator size="large" color="#39A900" style={{flex: 1}} />;

    return (
        <KeyboardAvoidingView 
            style={styles.container} 
            // 1. Damos un comportamiento específico para Android ('height' suele funcionar mejor)
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            
            // 2. En Android, el offset suele ser menor o 0 porque el OS ayuda nativamente
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 80} 
        >
            <FlatList
                ref={flatListRef}
                data={mensajes}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
                keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
                renderItem={({ item }) => {
                    // Ahora comparamos el usuario que llega del mensaje con nuestro identificador
                    const miIdentificador = miPerfil?.uid || miPerfil?.email;
                    const esMio = item.usuario === miIdentificador;
                    
                    return (
                        <View style={[styles.burbuja, esMio ? styles.burbujaMia : styles.burbujaOtro]}>
                            {!esMio && <Text style={styles.nombreUsuario}>{item.usuario}</Text>}
                            <Text style={esMio ? styles.textoMio : styles.textoOtro}>{item.mensaje}</Text>
                        </View>
                    );
                }}
            />
            
            <View style={styles.inputContainer}>
                <TextInput 
                    style={styles.input} 
                    value={mensaje} 
                    onChangeText={setMensaje} 
                    placeholder="Escribe un mensaje para la ficha..."
                    placeholderTextColor="#999"
                />
                <TouchableOpacity style={styles.botonEnviar} onPress={enviarMensaje}>
                    <Text style={styles.textoBoton}>Enviar</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#E5DDD5' }, // Color tipo WhatsApp
    burbuja: { maxWidth: '80%', padding: 12, borderRadius: 15, marginVertical: 5, marginHorizontal: 15 },
    burbujaMia: { alignSelf: 'flex-end', backgroundColor: '#DCF8C6', borderBottomRightRadius: 0 }, // Verde claro
    burbujaOtro: { alignSelf: 'flex-start', backgroundColor: '#FFFFFF', borderBottomLeftRadius: 0 }, // Blanco
    nombreUsuario: { fontWeight: 'bold', color: '#39A900', marginBottom: 2, fontSize: 12 },
    textoMio: { color: '#333' },
    textoOtro: { color: '#333' },
    inputContainer: { flexDirection: 'row', padding: 10, backgroundColor: '#fff', alignItems: 'center' },
    input: { flex: 1, backgroundColor: '#f0f0f0', borderRadius: 25, paddingHorizontal: 15, paddingVertical: 10, marginRight: 10, color: '#333' },
    botonEnviar: { backgroundColor: '#39A900', borderRadius: 25, paddingVertical: 10, paddingHorizontal: 20 },
    textoBoton: { color: '#fff', fontWeight: 'bold' }
});

export default ChatScreen;