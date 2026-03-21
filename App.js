import React, { useContext } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { AuthProvider, AuthContext } from './src/context/authContext';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import TaskScreen from './src/screens/TaskScreen';
import ProfileImageScreen from './src/screens/ProfileImageScreen';

const Stack = createStackNavigator();

const RootNavigation = () => {
    const { isLoading, userToken } = useContext(AuthContext);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#39A900" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#39A900' }, headerTintColor: '#fff' }}>
                {userToken == null ? (
                    // RUTAS PÚBLICAS: Si no hay token, solo puede ver el Login
                    <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                ) : (
                    // RUTAS PRIVADAS: Si hay token, tiene acceso al sistema
                    <>
                        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Inicio - App Tareas' }} />
                        <Stack.Screen name="Tasks" component={TaskScreen} options={{ title: 'Gestión de Tareas' }} />
                        <Stack.Screen name="ProfileImage" component={ProfileImageScreen} options={{ title: 'Cambiar Imagen de Perfil' }} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default function App() {
    return (
        <AuthProvider>
            <RootNavigation />
        </AuthProvider>
    );
}