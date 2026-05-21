import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Alert, ActivityIndicator, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function KycScreen({ navigation }) {
  const [documentImage, setDocumentImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const openGallery = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Permissão Requerida", "Precisamos de acesso à galeria para selecionar a foto do documento.");
      return;
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });
    
    if (!result.canceled) {
      setDocumentImage(result.assets[0].uri);
    }
  };

  const openCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Permissão Requerida", "Precisamos de acesso à câmera para tirar a foto do documento.");
      return;
    }
    
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.7,
    });
    
    if (!result.canceled) {
      setDocumentImage(result.assets[0].uri);
    }
  };

  const handleAdvance = () => {
    if (!documentImage) {
      Alert.alert("Verificação Obrigatória", "Por favor, envie a foto do seu RG ou CNH para validar sua maioridade e ativar o radar.");
      return;
    }

    setIsProcessing(true);

    // Simula uma análise inteligente de OCR de 1.5 segundos para dar o tom premium ao app
    setTimeout(() => {
      setIsProcessing(false);
      navigation.navigate('ProfileSetup');
    }, 1500);
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0a0a0a', '#000']} style={StyleSheet.absoluteFillObject} />
      
      <View style={styles.header}>
        <FontAwesome5 name="id-card" size={45} color="#1DB954" style={styles.iconHeader} />
        <Text style={styles.title}>VERIFICAÇÃO DE <Text style={styles.highlight}>SEGURANÇA</Text></Text>
        <Text style={styles.subtitle}>O Syncora é uma comunidade exclusiva para maiores de 18 anos. Envie uma foto legível do seu documento (RG ou CNH).</Text>
      </View>

      <View style={styles.contentCenter}>
        {documentImage ? (
          <View style={styles.previewContainer}>
            <Image source={{ uri: documentImage }} style={styles.previewImage} />
            <TouchableOpacity style={styles.retakeBtn} onPress={() => setDocumentImage(null)}>
              <Ionicons name="trash" size={18} color="#fff" />
              <Text style={styles.retakeBtnText}>Substituir Foto</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.uploadBox}>
            <Ionicons name="cloud-upload-outline" size={50} color="#333" style={{ marginBottom: 15 }} />
            <Text style={styles.uploadBoxText}>Nenhum documento selecionado</Text>
            
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.iconBtn} onPress={openCamera}>
                <Ionicons name="camera" size={20} color="#1DB954" style={{ marginRight: 8 }} />
                <Text style={styles.iconBtnText}>Câmera</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.iconBtn} onPress={openGallery}>
                <Ionicons name="image" size={20} color="#1DB954" style={{ marginRight: 8 }} />
                <Text style={styles.iconBtnText}>Galeria</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      <View style={styles.actionContainer}>
        <TouchableOpacity 
          style={[styles.mainBtn, !documentImage && styles.mainBtnDisabled]} 
          onPress={handleAdvance}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator color="#000" size="small" />
          ) : (
            <>
              <Text style={styles.mainBtnText}>CONTINUAR CADASTRO</Text>
              <Ionicons name="arrow-forward" size={18} color="#000" style={{ marginLeft: 8 }} />
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', justifyContent: 'space-between', paddingHorizontal: 25, paddingVertical: Platform.OS === 'ios' ? 60 : 40 },
  header: { alignItems: 'center', marginTop: 20 },
  iconHeader: { marginBottom: 15, shadowColor: '#1DB954', shadowOpacity: 0.3, shadowRadius: 10, elevation: 5 },
  title: { color: '#fff', fontSize: 26, fontWeight: '900', letterSpacing: 1, textAlign: 'center' },
  highlight: { color: '#1DB954' },
  subtitle: { color: '#666', fontSize: 14, textAlign: 'center', marginTop: 15, lineHeight: 22, paddingHorizontal: 10 },
  
  contentCenter: { flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%' },
  uploadBox: { width: '100%', backgroundColor: '#111', padding: 35, borderRadius: 20, alignItems: 'center', borderWidth: 1, borderColor: '#222' },
  uploadBoxText: { color: '#444', fontSize: 14, fontWeight: 'bold', marginBottom: 25 },
  
  buttonRow: { flexDirection: 'row', justifyContent: 'center', gap: 15, width: '100%' },
  iconBtn: { flex: 1, flexDirection: 'row', backgroundColor: '#000', paddingVertical: 14, borderRadius: 12, borderWidth: 1, borderColor: '#333', alignItems: 'center', justifyContent: 'center' },
  iconBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  
  previewContainer: { width: '100%', alignItems: 'center' },
  previewImage: { width: '100%', height: 220, borderRadius: 20, borderWidth: 1, borderColor: '#1DB954', resizeMode: 'cover' },
  retakeBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1a1a1a', paddingVertical: 10, paddingHorizontal: 18, borderRadius: 20, marginTop: 15, borderWidth: 1, borderColor: '#333' },
  retakeBtnText: { color: '#fff', fontSize: 13, fontWeight: 'bold', marginLeft: 8 },
  
  actionContainer: { width: '100%', alignItems: 'center', marginBottom: 10 },
  mainBtn: { flexDirection: 'row', backgroundColor: '#1DB954', paddingVertical: 20, borderRadius: 35, alignItems: 'center', width: '100%', justifyContent: 'center', shadowColor: '#1DB954', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 8 },
  mainBtnDisabled: { backgroundColor: '#111', borderWidth: 1, borderColor: '#222', opacity: 0.6 },
  mainBtnText: { color: '#000', fontWeight: '900', fontSize: 16, letterSpacing: 1 }
});