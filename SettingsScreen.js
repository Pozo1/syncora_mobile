import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import Slider from '@react-native-community/slider';
import { LinearGradient } from 'expo-linear-gradient';

export default function SettingsScreen({ navigation }) {
  const [distancia, setDistancia] = useState(20);

  const salvarPreferencias = () => {
    navigation.navigate('Discover', { radius: distancia });
  };

  return (
    <LinearGradient colors={['#000', '#121212']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        
        <View style={styles.header}>
          <Text style={styles.title}>Syncora</Text>
          <Text style={styles.subtitle}>Até onde a sua energia alcança?</Text>
        </View>

        <View style={styles.controlCenter}>
          <Text style={styles.radiusDisplay}>{distancia} km</Text>
          <Text style={styles.label}>Raio de busca local</Text>
          
          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={100}
            step={5}
            value={distancia}
            onValueChange={setDistancia}
            minimumTrackTintColor="#1DB954"
            maximumTrackTintColor="#333"
            thumbTintColor="#fff"
          />
        </View>

        <Text style={styles.helperText}>
          Ajuste conforme a sua disposição. O radar irá filtrar conexões dentro desse limite geográfico.
        </Text>

        <TouchableOpacity style={styles.button} onPress={salvarPreferencias}>
          <Text style={styles.buttonText}>ATIVAR RADAR</Text>
        </TouchableOpacity>

      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, padding: 30, justifyContent: 'space-between' },
  header: { marginTop: 40 },
  title: { color: '#fff', fontSize: 42, fontWeight: '900', letterSpacing: -1 },
  subtitle: { color: '#1DB954', fontSize: 16, marginTop: 10, letterSpacing: 1 },
  controlCenter: { backgroundColor: '#1a1a1a', padding: 30, borderRadius: 30, alignItems: 'center' },
  radiusDisplay: { color: '#fff', fontSize: 60, fontWeight: 'bold' },
  label: { color: '#888', fontSize: 14, marginBottom: 20, textTransform: 'uppercase', letterSpacing: 2 },
  slider: { width: '100%', height: 40 },
  helperText: { color: '#444', textAlign: 'center', fontSize: 14, paddingHorizontal: 20 },
  button: { backgroundColor: '#1DB954', paddingVertical: 20, borderRadius: 15, alignItems: 'center' },
  buttonText: { color: '#000', fontSize: 16, fontWeight: '900', letterSpacing: 2 }
});