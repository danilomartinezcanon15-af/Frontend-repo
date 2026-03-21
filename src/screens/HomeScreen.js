import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { AuthContext } from '../context/authContext';
import { getProfileService } from '../api/apiService';

const HomeScreen = ({ navigation }) => {
    const { logout, userToken } = useContext(AuthContext);
    const [perfil, setPerfil] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPerfil = async () => {
            try {
                const data = await getProfileService(userToken);
                setPerfil(data);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        fetchPerfil();
    }, []);

    if (loading) return <ActivityIndicator size="large" color="#39A900" style={{flex:1}} />;

    return (
        <View style={styles.container}>
            {/* CABECERA DEL DASHBOARD */}
            <View style={styles.profileCard}>
                <Image 
                    source={{ uri: perfil?.foto_url || 'https://via.placeholder.com/150' }} 
                    style={styles.avatar} 
                />
                <View style={styles.info}>
                    <Text style={styles.name}>{perfil?.nombre || 'Usuario ADSO'}</Text>
                    <Text style={styles.role}>{perfil?.rol?.toUpperCase()}</Text>
                </View>
            </View>

            {/* MENÚ DE ACCIONES */}
            <View style={styles.grid}>
                <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Tasks')}>
                    <Text style={styles.icon}>📋</Text>
                    <Text style={styles.menuText}>Mis Tareas</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('ProfileImage')}>
                    <Text style={styles.icon}>📸</Text>
                    <Text style={styles.menuText}>Cambiar Foto</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
                <Text style={styles.logoutText}>Cerrar Sesión</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa', padding: 20, paddingTop: 60 },
    profileCard: { 
        flexDirection: 'row', 
        backgroundColor: '#fff', 
        padding: 20, 
        borderRadius: 20, 
        alignItems: 'center',
        elevation: 5,
        marginBottom: 30
    },
    avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#eee' },
    info: { marginLeft: 20 },
    name: { fontSize: 20, fontWeight: 'bold', color: '#333' },
    role: { fontSize: 14, color: '#39A900', fontWeight: '600', marginTop: 4 },
    grid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
    menuItem: { 
        backgroundColor: '#fff', 
        width: '48%', 
        padding: 25, 
        borderRadius: 15, 
        alignItems: 'center',
        elevation: 3
    },
    icon: { fontSize: 32, marginBottom: 10 },
    menuText: { fontWeight: '600', color: '#444' },
    logoutBtn: { marginTop: 'auto', padding: 15, alignItems: 'center' },
    logoutText: { color: '#FF4444', fontWeight: 'bold' }
});

export default HomeScreen;