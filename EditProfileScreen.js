import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, Text, View, TextInput, TouchableOpacity, 
  ScrollView, Image, KeyboardAvoidingView, Platform, 
  Alert, ActivityIndicator, Dimensions 
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

export default function EditProfileScreen({ navigation }) {
  const [photos, setPhotos] = useState([null, null, null, null, null, null]);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [anthem, setAnthem] = useState(''); 
  const [gender, setGender] = useState('');
  const [interestedIn, setInterestedIn] = useState('');
  const [selectedInterests, setSelectedInterests] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      const spotifyId = await AsyncStorage.getItem('spotify_id');
      if (!spotifyId) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('spotify_id', spotifyId)
        .single();

      if (error) throw error;

      if (data) {
        setName(data.name || '');
        setBio(data.bio || '');
        setAnthem(data.anthem || '');
        setGender(data.gender || '');
        setInterestedIn(data.interested_in || '');
        setSelectedInterests(data.interests || []);

        // Mapeia as fotos salvas nas posições corretas do grid
        const loadedPhotos = [null, null, null, null, null, null];
        if (Array.isArray(data.photos)) {
          data.photos.forEach((url, index) => {
            if (index < 6) loadedPhotos[index] = url;
          });
        }
        setPhotos(loadedPhotos);
      }
    } catch (error) {
      console.error("Erro ao carregar perfil:", error.message);
      Alert.alert("Erro", "Não foi possível carregar os dados do seu perfil.");
    } finally {
      setLoading(false);
    }
  };

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
        base64: result.assets[0].base64,
        isNew: true
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
      const fileName = `${Date.now()}_edit_${index}.jpg`;

      const { data, error } = await supabase.storage
        .from('profile_photos')
        .upload(fileName, decode(photoItem.base64), {
          contentType: 'image/jpeg'
        });

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage
        .from('profile_photos')
        .getPublicUrl(fileName);

      return publicUrlData.publicUrl;
    } catch (error) {
      console.error("Erro no upload da foto editada:", error);
      return null;
    }
  };

  const handleSave = async () => {
    if (!photos[0] || !bio || !gender || !interestedIn || selectedInterests.length === 0) {
      Alert.alert("Campos Obrigatórios", "A sua foto principal, bio e interesses não podem ficar vazios.");
      return;
    }

    setIsSaving(true);
    const spotifyId = await AsyncStorage.getItem('spotify_id');
    const finalPhotoUrls = [];

    try {
      for (let i = 0; i < photos.length; i++) {
        const item = photos[i];
        if (item) {
          if (typeof item === 'string') {
            // Foto antiga que já é uma URL estável
            finalPhotoUrls.push(item);
          } else if (item.isNew) {
            // Foto nova que precisa de upload para o Storage
            const url = await uploadImage(item, i);
            if (url) finalPhotoUrls.push(url);
          }
        }
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          bio,
          anthem,
          gender,
          interested_in: interestedIn,
          interests: selectedInterests,
          photos: finalPhotoUrls,
        })
        .eq('spotify_id', spotifyId);

      if (error) throw error;

      Alert.alert("Sucesso", "Vibe atualizada com sucesso no radar!", [
        { text: "OK", onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error("Erro ao salvar alterações:", error.message);
      Alert.alert("Erro", "Não foi possível salvar suas atualizações.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingCenter}>
        <ActivityIndicator size="large" color="#1DB954" />
        <Text style={styles.loadingText}>Carregando sua vibe...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <LinearGradient colors={['#000', '#0a0a0a']} style={StyleSheet.absoluteFillObject} />
      
      {/* HEADER DE COMPONENTE */}
      <View style={styles.headerTop}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>EDITAR VIBE</Text>
        <TouchableOpacity style={styles.saveHeaderBtn} onPress={handleSave}>
          <Ionicons name="checkmark-done" size={24} color="#1DB954" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>Sua Estética</Text>
          <Text style={styles.sectionHint}>A 1ª foto é o seu cartão de visitas</Text>
        </View>

        <View style={styles.photoGrid}>
          {photos.map((photoItem, index) => {
            const imageUri = photoItem ? (typeof photoItem === 'string' ? photoItem : photoItem.uri) : null;
            return (
              <View key={index} style={[styles.photoSlotContainer, index === 0 && styles.mainPhotoSlot]}>
                {imageUri ? (
                  <>
                    <Image source={{ uri: imageUri }} style={styles.photo} />
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
            );
          })}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>Identidade de Conta</Text>
          <View style={styles.lockBadge}>
            <Ionicons name="shield-checkmark" size={12} color="#1DB954" />
            <Text style={styles.lockBadgeText}>VERIFICADO</Text>
          </View>
        </View>
        <View style={styles.disabledInputContainer}>
          <TextInput 
            style={styles.inputSingleBoxDisabled} 
            value={name} 
            editable={false} 
          />
          <Ionicons name="lock-closed" size={18} color="#444" style={styles.lockIconInside} />
        </View>
        <Text style={styles.infoFieldHint}>O nome da conta é trancado após a validação facial de segurança.</Text>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>Trilha Sonora Fixada (Anthem)</Text>
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
          <Text style={styles.sectionLabel}>Interesses ({selectedInterests.length}/7)</Text>
        </View>
        <View style={styles.tagsContainer}>
          {AVAILABLE_INTERESTS.map((item) => (
            <TouchableOpacity key={item} style={[styles.tag, selectedInterests.includes(item) && styles.tagActive]} onPress={() => toggleInterest(item)}>
              <Text style={[styles.tagText, selectedInterests.includes(item) && styles.tagTextActive]}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.sectionHeader}><Text style={styles.sectionLabel}>Biografia descritiva</Text></View>
        <TextInput 
          style={styles.inputMulti} 
          placeholder="Fale um pouco sobre a sua vibe..." 
          placeholderTextColor="#444" 
          multiline 
          numberOfLines={4} 
          value={bio} 
          onChangeText={setBio} 
        />

        <View style={styles.sectionHeader}><Text style={styles.sectionLabel}>Gênero:</Text></View>
        <View style={styles.pillContainer}>
            {['Homem', 'Mulher', 'Não-Binário', 'Outro'].map((item) => (
              <TouchableOpacity key={item} style={[styles.pill, gender === item && styles.pillActive]} onPress={() => setGender(item)}>
                <Text style={[styles.pillText, gender === item && styles.pillTextActive]}>{item}</Text>
              </TouchableOpacity>
            ))}
        </View>

        <View style={styles.sectionHeader}><Text style={styles.sectionLabel}>Procurando por:</Text></View>
        <View style={styles.pillContainer}>
            {['Mulheres', 'Homens', 'Todos'].map((item) => (
              <TouchableOpacity key={item} style={[styles.pill, interestedIn === item && styles.pillActive]} onPress={() => setInterestedIn(item)}>
                <Text style={[styles.pillText, interestedIn === item && styles.pillTextActive]}>{item}</Text>
              </TouchableOpacity>
            ))}
        </View>

        <TouchableOpacity style={styles.continueBtn} onPress={handleSave} disabled={isSaving}>
          <Text style={styles.continueBtnText}>SALVAR ALTERAÇÕES</Text>
          <Ionicons name="save" size={20} color="#000" style={{ marginLeft: 10 }} />
        </TouchableOpacity>
      </ScrollView>

      {/* OVERLAY DE SALVAMENTO */}
      {isSaving && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color="#1DB954" />
            <Text style={styles.savingText}>Atualizando sua frequência...</Text>
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  loadingCenter: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#aaa', marginTop: 15, fontSize: 16, fontWeight: 'bold' },
  
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#111', backgroundColor: '#050505' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#111', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#222' },
  saveHeaderBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#111', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#222' },
  headerTitle: { color: '#fff', fontSize: 16, fontWeight: '900', letterSpacing: 2 },

  scrollContainer: { padding: 25, flexGrow: 1, paddingBottom: 60 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 25, marginBottom: 15 },
  sectionLabel: { color: '#1DB954', fontSize: 13, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1.5 },
  sectionHint: { color: '#555', fontSize: 11, fontWeight: 'bold' },
  
  photoGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 10 },
  photoSlotContainer: { width: '31%', aspectRatio: 3/4, marginBottom: 12, position: 'relative' },
  mainPhotoSlot: { width: '65%', aspectRatio: 3/4 }, 
  emptySlot: { flex: 1, backgroundColor: '#111', borderRadius: 15, borderWidth: 1, borderColor: '#333', borderStyle: 'dashed', overflow: 'hidden' },
  mainEmptySlot: { borderStyle: 'solid', borderColor: 'rgba(29,185,84,0.5)', borderWidth: 2 },
  gradientSlot: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  photo: { flex: 1, borderRadius: 15, resizeMode: 'cover', borderWidth: 1, borderColor: '#333' },
  removePhotoBtn: { position: 'absolute', bottom: -5, right: -5, backgroundColor: '#ff3b30', width: 26, height: 26, borderRadius: 13, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#000', zIndex: 10 },
  
  disabledInputContainer: { position: 'relative', width: '100%', justifyContent: 'center' },
  inputSingleBoxDisabled: { backgroundColor: '#0a0a0a', color: '#555', padding: 20, borderRadius: 15, fontSize: 16, borderWidth: 1, borderColor: '#1a1a1a', fontWeight: 'bold', width: '100%' },
  lockIconInside: { position: 'absolute', right: 20 },
  lockBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(29, 185, 84, 0.1)', paddingHorizontal: 6, paddingVertical: 3, borderRadius: 5 },
  lockBadgeText: { color: '#1DB954', fontSize: 9, fontWeight: '900', marginLeft: 4, letterSpacing: 0.5 },
  infoFieldHint: { color: '#444', fontSize: 11, marginTop: 6, paddingHorizontal: 5 },

  premiumAnthemContainer: { flexDirection: 'row', backgroundColor: '#111', padding: 20, borderRadius: 15, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(29, 185, 84, 0.4)' },
  inputSingle: { color: '#fff', fontSize: 16, flex: 1, fontWeight: 'bold' },
  inputMulti: { backgroundColor: '#111', color: '#fff', padding: 20, borderRadius: 15, fontSize: 15, height: 110, textAlignVertical: 'top', borderWidth: 1, borderColor: '#333', lineHeight: 22 },
  
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  tag: { paddingVertical: 10, paddingHorizontal: 15, backgroundColor: '#111', borderRadius: 25, borderWidth: 1, borderColor: '#333' },
  tagActive: { backgroundColor: 'rgba(29,185,84,0.15)', borderColor: '#1DB954' },
  tagText: { color: '#777', fontSize: 13, fontWeight: 'bold' },
  tagTextActive: { color: '#1DB954' },
  
  pillContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  pill: { flex: 1, minWidth: '40%', paddingVertical: 15, alignItems: 'center', backgroundColor: '#111', borderRadius: 15, borderWidth: 1, borderColor: '#333' },
  pillActive: { backgroundColor: '#1DB954', borderColor: '#1DB954' },
  pillText: { color: '#777', fontSize: 14, fontWeight: 'bold' },
  pillTextActive: { color: '#000', fontWeight: '900' },
  
  continueBtn: { flexDirection: 'row', backgroundColor: '#1DB954', paddingVertical: 20, borderRadius: 35, justifyContent: 'center', alignItems: 'center', marginTop: 40, shadowColor: '#1DB954', shadowOpacity: 0.2, shadowRadius: 10, elevation: 5 },
  continueBtnText: { color: '#000', fontSize: 16, fontWeight: '900', letterSpacing: 1 },

  loadingOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center', zIndex: 999 },
  loadingBox: { alignItems: 'center', padding: 30, backgroundColor: '#111', borderRadius: 20, borderWidth: 1, borderColor: '#333' },
  savingText: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginTop: 15 }
});