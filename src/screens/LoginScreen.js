import React, {useState, useContext} from "react";
import {View, TextInput, Button, StyleSheet, Text, ActivityIndicator, Alert} from 'react-native';
import { AuthContext } from "../context/authContext";
import { loginService } from "../api/apiService";

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const {login} = useContext(AuthContext);

    const handleLogin = async () => {
        if (!email || !password) return Alert.alert("Error", "Completa todos los campos");

        setLoading(true);
        try {
            const data = await loginService(email, password);
            login(data.token); // Guardar el token en un estado global
        } catch (e) {
            Alert.alert("Error de login", e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                ADSO Gestor de Tareas
            </Text>
            <TextInput 
            style={styles.input}
            placeholder="Correo Electronico"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            />
            <TextInput
            style={styles.input}
            placeholder="Contrasena"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            />
            {loading ? (
                <ActivityIndicator size="large" color="#39A900"/>
            ) : (
                <Button title="Ingresar" onPress={handleLogin} color="#39A900" />
            )}
        </View>
    );
};

const styles = StyleSheet.create ({
    container: {flex: 1, justifyContent: "center", padding: 20},
    title: {fontSize: 28, fontWeight: "bold", textAlign: 'center', marginBottom: 30, color: '#39A900'},
    input: {borderBottomWidth: 1, borderColor: "#ccc", marginBottom: 20, padding: 10}
});

export default LoginScreen;