import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TouchableOpacity, 
  Image, ActivityIndicator, Platform 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../services/supabaseClient';

export default function ChatListScreen({ navigation }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    setLoading(true);
    const myId = await AsyncStorage.getItem('spotify_id');
    
    const { data: myLikes } = await supabase
      .from('swipes')
      .select('*')
      .eq('swiper_id', myId)
      .eq('action', 'like');

    const { data: likedMe } = await supabase
      .from('swipes')
      .select('*')
      .eq('swiped_id', myId)
      .eq('action', 'like');

    if (!myLikes || !likedMe) {
      setLoading(false);
      return;
    }

    const mutualMatches = [];
    for (const myLike of myLikes) {
      const match = likedMe.find(them => them.swiper_id === myLike.swiped_id);
      if (match) {
        // 🔥 BLINDAGEM ANTI-BUG: Força o JavaScript a ler 'false' corretamente
        const isMyLikeSyncra = myLike.is_syncra_match === true || myLike.is_syncra_match === 'true';
        const isThemLikeSyncra = match.is_syncra_match === true || match.is_syncra_match === 'true';

        mutualMatches.push({
          targetId: match.swiper_id,
          isSyncra: isMyLikeSyncra || isThemLikeSyncra
        });
      }
    }

    if (mutualMatches.length === 0) {
      setLoading(false);
      return;
    }

    const targetIds = mutualMatches.map(m => m.targetId);
    const { data: profilesData } = await supabase
      .from('profiles')
      .select('*')
      .in('spotify_id', targetIds);

    if (profilesData) {
      const finalMatches = profilesData.map(prof => {
        const matchInfo = mutualMatches.find(m => m.targetId === prof.spotify_id);
        
        let safePhoto = 'https://images.unsplash.com/photo-1614680376593-902f74a0d40e?q=80&w=800&auto=format&fit=crop';
        if (Array.isArray(prof.photos) && prof.photos.length > 0) safePhoto = prof.photos[0];
        else if (typeof prof.photos === 'string') {
          try { 
            const parsed = JSON.parse(prof.photos); 
            if (parsed.length > 0) safePhoto = parsed[0]; 
          } catch (e) { safePhoto = prof.photos; }
        }

        return { ...prof, displayPhoto: safePhoto, isSyncra: matchInfo.isSyncra };
      });

      finalMatches.sort((a, b) => (b.isSyncra === a.isSyncra) ? 0 : b.isSyncra ? 1 : -1);
      setMatches(finalMatches);
    }
    setLoading(false);
  };

  const renderMatchItem = ({ item }) => {
    return (
      <TouchableOpacity 
        style={[styles.matchCard, item.isSyncra && styles.matchCardSyncra]} 
        onPress={() => navigation.navigate('ChatRoom', { profile: item })}
        activeOpacity={0.8}
      >
        <View style={styles.avatarContainer}>
          <Image source={{ uri: item.displayPhoto }} style={[styles.avatar, item.isSyncra && styles.avatarSyncra]} />
          {/* Troca do && por operador ternário seguro */}
          {item.isSyncra ? (
            <View style={styles.syncraBadge}>
              <MaterialCommunityIcons name="waveform" size={12} color="#000" />
            </View>
          ) : null}
        </View>

        <View style={styles.chatInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.matchName} numberOfLines={1}>{item.name}</Text>
            {item.isSyncra ? <Text style={styles.syncraTag}>SYNKY</Text> : null}
          </View>
          
          <Text style={[styles.lastMessage, item.isSyncra && styles.lastMessageSyncra]} numberOfLines={1}>
            {item.isSyncra 
              ? "Vocês se conectaram na mesma frequência!" 
              : "Nova sintonia. Envie uma mensagem!"}
          </Text>
        </View>

        <Ionicons name="chevron-forward" size={20} color="#444" />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0a0a0a', '#000']} style={StyleSheet.absoluteFillObject} />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>SINTONIAS</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#1DB954" />
        </View>
      ) : matches.length === 0 ? (
        <View style={styles.centerContainer}>
          <FontAwesome5 name="ghost" size={50} color="#222" style={{ marginBottom: 20 }} />
          <Text style={styles.emptyTitle}>Nenhuma Sintonia Ainda</Text>
          <Text style={styles.emptySubtitle}>Volte para o radar e continue descobrindo novas vibes.</Text>
        </View>
      ) : (
        <FlatList
          data={matches}
          keyExtractor={(item) => item.spotify_id}
          renderItem={renderMatchItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: '#111' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#111', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#222' },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '900', letterSpacing: 2 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  emptyTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  emptySubtitle: { color: '#666', fontSize: 14, textAlign: 'center', lineHeight: 22 },
  listContainer: { padding: 20, paddingBottom: 50 },
  matchCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#111', padding: 15, borderRadius: 20, marginBottom: 15, borderWidth: 1, borderColor: '#222' },
  matchCardSyncra: { borderColor: 'rgba(29, 185, 84, 0.4)', backgroundColor: '#0a140d' },
  avatarContainer: { position: 'relative', marginRight: 15 },
  avatar: { width: 65, height: 65, borderRadius: 32.5, borderWidth: 2, borderColor: '#333' },
  avatarSyncra: { borderColor: '#1DB954', borderWidth: 3 },
  syncraBadge: { position: 'absolute', bottom: -2, right: -2, backgroundColor: '#1DB954', width: 22, height: 22, borderRadius: 11, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#000' },
  chatInfo: { flex: 1, justifyContent: 'center' },
  nameRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  matchName: { color: '#fff', fontSize: 17, fontWeight: 'bold', marginRight: 8 },
  syncraTag: { color: '#1DB954', fontSize: 10, fontWeight: '900', letterSpacing: 1, backgroundColor: 'rgba(29, 185, 84, 0.1)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 5, overflow: 'hidden' },
  lastMessage: { color: '#666', fontSize: 13, fontWeight: '500' },
  lastMessageSyncra: { color: '#aaa', fontWeight: 'bold' }
});