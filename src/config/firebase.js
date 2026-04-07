import { initializeApp } from "firebase/app";

//  Auth para React Native
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyAUQXIRRQLl9NxX-Dc32L6y2Bk-ikLPGio",
  authDomain: "evidencia2-ff3c8.firebaseapp.com",
  projectId: "evidencia2-ff3c8",
  storageBucket: "evidencia2-ff3c8.firebasestorage.app",
  messagingSenderId: "153326064178",
  appId: "1:153326064178:web:f0b5be95eca1443281e22b",
};

//  Inicializar app
const app = initializeApp(firebaseConfig);

//  Auth con persistencia (IMPORTANTE)
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

//  Exportar
export { app, auth };
//FIREBASE CONECTOR