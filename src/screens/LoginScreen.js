import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, Alert, ActivityIndicator } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import * as AuthSession from 'expo-auth-session';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../services/supabaseClient';

const CLIENT_ID = '3e3ae82b8e834bc0a68dd4b9c462c268';
const CLIENT_SECRET = '0f2e1d2fec4e489583e484c6a5a84b9e'; 

const discovery = {
  authorizationEndpoint: 'https://accounts.spotify.com/authorize',
  tokenEndpoint: 'https://accounts.spotify.com/api/token',
};

export default function LoginScreen({ navigation }) {
  const [isProcessing, setIsProcessing] = useState(false);

  const redirectUri = AuthSession.makeRedirectUri({ 
    scheme: 'syncora',
    preferLocalhost: false
  });

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: CLIENT_ID,
      scopes: ['user-read-currently-playing', 'user-read-playback-state', 'user-read-private', 'user-read-email'],
      usePKCE: false, 
      redirectUri: redirectUri,
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;
      processSpotifyLogin(code);
    } else if (response?.type === 'error') {
      Alert.alert("Erro de Autenticação", "Não foi possível conectar ao Spotify.");
    }
  }, [response]);

  const processSpotifyLogin = async (code) => {
    setIsProcessing(true);
    try {
      // 1. Troca o código pelo Token
      const tokenResult = await AuthSession.exchangeCodeAsync({
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        code: code,
        redirectUri: redirectUri,
      }, discovery);

      if (!tokenResult.accessToken) throw new Error("Token não retornado");

      const token = tokenResult.accessToken;
      await AsyncStorage.setItem('spotify_token', token);

      // 2. Busca o ID único do usuário no Spotify
      const userRes = await fetch('https://api.spotify.com/v1/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const userData = await userRes.json();
      const spotifyId = userData.id;
      
      await AsyncStorage.setItem('spotify_id', spotifyId);

      // 3. Verifica se o perfil já existe no Supabase
      const { data: existingProfile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('spotify_id', spotifyId)
        .single();

      setIsProcessing(false);

      if (existingProfile) {
        console.log("🔥 CONTA EXISTENTE ENCONTRADA. BEM-VINDO DE VOLTA!");
        navigation.navigate('Discover');
      } else {
        console.log("🌟 NOVA CONTA. INDO PARA CADASTRO.");
        navigation.navigate('KYC');
      }

    } catch (error) {
      setIsProcessing(false);
      console.error("Erro no login:", error);
      Alert.alert("Erro de Conexão", "Falha ao sincronizar com o Spotify.");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      <View style={styles.logoContainer}>
        <FontAwesome5 name="wave-square" size={80} color="#1DB954" />
        <Text style={styles.title}>SYNCORA</Text>
        <Text style={styles.subtitle}>Sua sintonia em tempo real.</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.spotifyButton, isProcessing && { opacity: 0.7 }]} 
          onPress={() => promptAsync()}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator color="#000" />
          ) : (
            <>
              <FontAwesome5 name="spotify" size={24} color="#000" />
              <Text style={styles.buttonText}>Entrar com Spotify</Text>
            </>
          )}
        </TouchableOpacity>
        <Text style={styles.footerText}>Conectando vibrações, não aparências.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', justifyContent: 'space-around', alignItems: 'center' },
  logoContainer: { alignItems: 'center', marginTop: 50 },
  title: { color: '#fff', fontSize: 52, fontWeight: '900', letterSpacing: 4, marginTop: 20 },
  subtitle: { color: '#1DB954', fontSize: 18, marginTop: 10, letterSpacing: 1, fontWeight: '600' },
  buttonContainer: { width: '100%', alignItems: 'center', paddingBottom: 40 },
  spotifyButton: { flexDirection: 'row', backgroundColor: '#1DB954', paddingVertical: 18, paddingHorizontal: 40, borderRadius: 30, alignItems: 'center', justifyContent: 'center', width: '85%', elevation: 5 },
  buttonText: { color: '#000', fontSize: 18, fontWeight: '900', marginLeft: 15, textTransform: 'uppercase', letterSpacing: 1 },
  footerText: { color: '#555', marginTop: 20, fontSize: 12 }
});