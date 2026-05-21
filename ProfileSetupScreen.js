import * as Location from 'expo-location';
import React, { useState } from 'react';
import { 
  StyleSheet, Text, View, TextInput, TouchableOpacity, 
  ScrollView, Image, KeyboardAvoidingView, Platform, 
  Alert, ActivityIndicator, Dimensions, Linking 
} from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { decode } from 'base64-arraybuffer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../services/supabaseClient';

const { width } = Dimensions.get('window');

const AVAILABLE_INTERESTS = [
  "Festivais", "Show ao Vivo", "Fone 24/7", "Colecionador de Vinil", 
  "JDM & Cultura Auto", "Design Mid-Century", "Aperol & Jack", 
  "Café de Especialidade", "Tatuagem", "Gamer", "Praia & Surf", 
  "Rave & After", "Indie Rock", "Sertanejo Universitário", "Hip-Hop / Trap", 
  "Eletrônica", "MPB", "Pop & Charts", "Cinema Cult", 
  "Esportes", "Moda Streetwear", "Astrologia", "Tech & DevOps", 
  "Empreendedorismo"
];

export default function ProfileSetupScreen({ navigation }) {
  const [photos, setPhotos] = useState([null, null, null, null, null, null]);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [anthem, setAnthem] = useState(''); 
  const [gender, setGender] = useState('');
  const [interestedIn, setInterestedIn] = useState('');
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddPhoto = async (index) => {
    const result = await ImagePicker.launchImageLibraryAsync({ 
      allowsEditing: true, 
      aspect: [3, 4], 
      quality: 0.5,
      base64: true 
    });

    if (!result.canceled) {
      const newPhotos = [...photos];
      newPhotos[index] = {
        uri: result.assets[0].uri,
        base64: result.assets[0].base64
      };
      setPhotos(newPhotos);
    }
  };

  const handleRemovePhoto = (index) => {
    const newPhotos = [...photos];
    newPhotos[index] = null;
    setPhotos(newPhotos);
  };

  const toggleInterest = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else if (selectedInterests.length < 7) {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const uploadImage = async (photoItem, index) => {
    try {
      const fileName = `${Date.now()}_${index}.jpg`;
      const { data, error } = await supabase.storage
        .from('profile_photos')
        .upload(fileName, decode(photoItem.base64), { contentType: 'image/jpeg' });
      if (error) throw error;
      const { data: publicUrlData } = supabase.storage.from('profile_photos').getPublicUrl(fileName);
      return publicUrlData.publicUrl;
    } catch (error) {
      console.error("Erro no upload da foto:", error);
      return null;
    }
  };

  const handleFinish = async () => {
    if (!name || !photos[0] || !bio || !gender || !interestedIn || selectedInterests.length === 0) {
      Alert.alert("Atenção", "Preencha sua vibe por completo. Nome, foto e interesses são essenciais.");
      return;
    }

    setIsLoading(true);

    // 🔥 O TRATAMENTO ELEGANTE DE PERMISSÃO 🔥
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setIsLoading(false);
      Alert.alert(
        "Radar Offline", 
        "O algoritmo do Syncora precisa saber sua localização para sintonizar pessoas próximas. Ative o GPS para continuar.",
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Abrir Configurações", onPress: () => Linking.openSettings() }
        ]
      );
      return;
    }

    let location;
    try {
      location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
    } catch (e) {
      Alert.alert("Erro de GPS", "Não conseguimos captar sua localização no momento.");
      setIsLoading(false);
      return;
    }

    const { latitude, longitude } = location.coords;
    const uploadedPhotoUrls = [];

    for (let i = 0; i < photos.length; i++) {
      if (photos[i]) {
        const url = await uploadImage(photos[i], i);
        if (url) uploadedPhotoUrls.push(url);
      }
    }

    if (uploadedPhotoUrls.length === 0) {
      Alert.alert("Falha de Conexão", "Não conseguimos enviar suas fotos. Tente novamente.");
      setIsLoading(false);
      return;
    }

    const spotifyId = await AsyncStorage.getItem('spotify_id');

    const { error } = await supabase
      .from('profiles')
      .insert([{ 
        spotify_id: spotifyId, 
        name,
        bio, 
        anthem, 
        gender, 
        interested_in: interestedIn, 
        interests: selectedInterests,
        photos: uploadedPhotoUrls,
        latitude, 
        longitude 
      }]);

    setIsLoading(false);

    if (error) {
      Alert.alert("Erro no Servidor", error.message);
    } else {
      navigation.navigate('Settings');
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <LinearGradient colors={['#000', '#0a0a0a']} style={StyleSheet.absoluteFillObject} />
      
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <FontAwesome5 name="wave-square" size={32} color="#1DB954" style={{ marginBottom: 10 }} />
          <Text style={styles.title}>CRIE SUA VIBE <Text style={styles.highlight}>UNIQUE.</Text></Text>
          <Text style={styles.subtitle}>Mostre quem você é para o radar.</Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>Sua Estética</Text>
          <Text style={styles.sectionHint}>A 1ª foto é a principal</Text>
        </View>
        <View style={styles.photoGrid}>
          {photos.map((photoItem, index) => (
            <View key={index} style={[styles.photoSlotContainer, index === 0 && styles.mainPhotoSlot]}>
              {photoItem ? (
                <>
                  <Image source={{ uri: photoItem.uri }} style={styles.photo} />
                  <TouchableOpacity style={styles.removePhotoBtn} onPress={() => handleRemovePhoto(index)}>
                    <FontAwesome5 name="times" size={12} color="#fff" />
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity style={[styles.emptySlot, index === 0 && styles.mainEmptySlot]} onPress={() => handleAddPhoto(index)}>
                  <LinearGradient colors={index === 0 ? ['rgba(29,185,84,0.1)', '#121212'] : ['#121212', '#121212']} style={styles.gradientSlot}>
                    <FontAwesome5 name="plus" size={index === 0 ? 30 : 20} color={index === 0 ? "#1DB954" : "#444"} />
                  </LinearGradient>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        <View style={styles.sectionHeader}><Text style={styles.sectionLabel}>Como devemos te chamar?</Text></View>
        <TextInput 
          style={styles.inputSingleBox} 
          placeholder="Seu nome ou apelido" 
          placeholderTextColor="#555" 
          value={name} 
          onChangeText={setName} 
        />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>Sua Trilha Sonora (Anthem)</Text>
          <Text style={styles.sectionHint}>Sincronização ao vivo em breve</Text>
        </View>
        <View style={styles.premiumAnthemContainer}>
          <FontAwesome5 name="spotify" size={24} color="#1DB954" style={{marginRight: 15}} />
          <TextInput 
            style={styles.inputSingle} 
            placeholder="Qual música define seu momento?" 
            placeholderTextColor="#555" 
            value={anthem} 
            onChangeText={setAnthem} 
          />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>Interesses em Comum</Text>
          <Text style={[styles.sectionHint, selectedInterests.length === 7 && {color: '#1DB954'}]}>
            {selectedInterests.length}/7
          </Text>
        </View>
        <View style={styles.tagsContainer}>
          {AVAILABLE_INTERESTS.map((item) => (
            <TouchableOpacity key={item} style={[styles.tag, selectedInterests.includes(item) && styles.tagActive]} onPress={() => toggleInterest(item)}>
              <Text style={[styles.tagText, selectedInterests.includes(item) && styles.tagTextActive]}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.sectionHeader}><Text style={styles.sectionLabel}>A sua Bio</Text></View>
        <TextInput 
          style={styles.inputMulti} 
          placeholder="Ex: Fã de cultura automobilística JDM, mergulhado em design Mid-Century e sempre pronto para um Aperol & Jack de fim de tarde..." 
          placeholderTextColor="#444" 
          multiline 
          numberOfLines={4} 
          value={bio} 
          onChangeText={setBio} 
        />

        <View style={styles.sectionHeader}><Text style={styles.sectionLabel}>Eu me identifico como:</Text></View>
        <View style={styles.pillContainer}>
            {['Homem', 'Mulher', 'Não-Binário', 'Outro'].map((item) => (
              <TouchableOpacity key={item} style={[styles.pill, gender === item && styles.pillActive]} onPress={() => setGender(item)}>
                <Text style={[styles.pillText, gender === item && styles.pillTextActive]}>{item}</Text>
              </TouchableOpacity>
            ))}
        </View>

        <View style={styles.sectionHeader}><Text style={styles.sectionLabel}>Quero encontrar no Radar:</Text></View>
        <View style={styles.pillContainer}>
            {['Mulheres', 'Homens', 'Todos'].map((item) => (
              <TouchableOpacity key={item} style={[styles.pill, interestedIn === item && styles.pillActive]} onPress={() => setInterestedIn(item)}>
                <Text style={[styles.pillText, interestedIn === item && styles.pillTextActive]}>{item}</Text>
              </TouchableOpacity>
            ))}
        </View>

        <TouchableOpacity style={styles.continueBtn} onPress={handleFinish}>
          <Text style={styles.continueBtnText}>ATIVAR PERFIL</Text>
          <Ionicons name="flash" size={20} color="#000" style={{ marginLeft: 10 }} />
        </TouchableOpacity>
      </ScrollView>

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color="#1DB954" style={{ transform: [{ scale: 1.5 }] }} />
            <Text style={styles.loadingText}>Sintonizando sua vibe...</Text>
            <Text style={styles.loadingSubText}>Salvando perfil e processando fotos</Text>
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  scrollContainer: { padding: 25, flexGrow: 1, paddingBottom: 60 },
  header: { marginTop: 40, marginBottom: 30, alignItems: 'center' },
  title: { color: '#fff', fontSize: 32, fontWeight: '900', letterSpacing: -1, textAlign: 'center' },
  highlight: { color: '#1DB954' },
  subtitle: { color: '#888', fontSize: 14, marginTop: 5 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 25, marginBottom: 15 },
  sectionLabel: { color: '#1DB954', fontSize: 14, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1.5 },
  sectionHint: { color: '#555', fontSize: 12, fontWeight: 'bold' },
  photoGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 10 },
  photoSlotContainer: { width: '31%', aspectRatio: 3/4, marginBottom: 12, position: 'relative' },
  mainPhotoSlot: { width: '65%', aspectRatio: 3/4 }, 
  emptySlot: { flex: 1, backgroundColor: '#111', borderRadius: 15, borderWidth: 1, borderColor: '#333', borderStyle: 'dashed', overflow: 'hidden' },
  mainEmptySlot: { borderStyle: 'solid', borderColor: 'rgba(29,185,84,0.5)', borderWidth: 2 },
  gradientSlot: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  photo: { flex: 1, borderRadius: 15, resizeMode: 'cover', borderWidth: 1, borderColor: '#333' },
  removePhotoBtn: { position: 'absolute', bottom: -8, right: -8, backgroundColor: '#ff3b30', width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#000', elevation: 5 },
  premiumAnthemContainer: { flexDirection: 'row', backgroundColor: '#111', padding: 20, borderRadius: 15, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(29, 185, 84, 0.4)', shadowColor: '#1DB954', shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.1, shadowRadius: 10 },
  inputSingleBox: { backgroundColor: '#111', color: '#fff', padding: 20, borderRadius: 15, fontSize: 16, borderWidth: 1, borderColor: '#333' },
  inputSingle: { color: '#fff', fontSize: 16, flex: 1, fontWeight: 'bold' },
  inputMulti: { backgroundColor: '#111', color: '#fff', padding: 20, borderRadius: 15, fontSize: 15, height: 120, textAlignVertical: 'top', borderWidth: 1, borderColor: '#333', lineHeight: 22 },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  tag: { paddingVertical: 10, paddingHorizontal: 16, backgroundColor: '#111', borderRadius: 25, borderWidth: 1, borderColor: '#333' },
  tagActive: { backgroundColor: 'rgba(29,185,84,0.15)', borderColor: '#1DB954' },
  tagText: { color: '#888', fontSize: 13, fontWeight: 'bold' },
  tagTextActive: { color: '#1DB954' },
  pillContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  pill: { flex: 1, minWidth: '40%', paddingVertical: 15, alignItems: 'center', backgroundColor: '#111', borderRadius: 15, borderWidth: 1, borderColor: '#333' },
  pillActive: { backgroundColor: '#1DB954', borderColor: '#1DB954' },
  pillText: { color: '#888', fontSize: 14, fontWeight: 'bold' },
  pillTextActive: { color: '#000', fontWeight: '900' },
  continueBtn: { flexDirection: 'row', backgroundColor: '#1DB954', paddingVertical: 22, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginTop: 40, shadowColor: '#1DB954', shadowOffset: {width: 0, height: 8}, shadowOpacity: 0.4, shadowRadius: 15, elevation: 10 },
  continueBtnText: { color: '#000', fontSize: 18, fontWeight: '900', letterSpacing: 1.5 },
  loadingOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center', zIndex: 999 },
  loadingBox: { alignItems: 'center', padding: 40, backgroundColor: '#111', borderRadius: 20, borderWidth: 1, borderColor: '#333', shadowColor: '#000', shadowOpacity: 0.5, shadowRadius: 20 },
  loadingText: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginTop: 25 },
  loadingSubText: { color: '#888', fontSize: 14, marginTop: 8 }
});