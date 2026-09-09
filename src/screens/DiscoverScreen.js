import React, { useState, useEffect, useRef } from 'react';
import { 
  View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, 
  Dimensions, Image, Modal, ScrollView, TouchableWithoutFeedback, Platform, Animated, Easing
} from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ConfettiView from 'react-native-confetti';
import * as Haptics from 'expo-haptics'; // 🔥 Importação do Haptics
import { supabase } from '../services/supabaseClient';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width * 0.92;
const CARD_HEIGHT = height * 0.68; 

const CardItem = ({ card, openDetails }) => {
  if (!card) return null;

  const [photoIndex, setPhotoIndex] = useState(0);
  
  let safePhotos = [];
  if (Array.isArray(card.photos) && card.photos.length > 0) {
    safePhotos = card.photos;
  } else if (typeof card.photos === 'string') {
    try { safePhotos = JSON.parse(card.photos); } catch (e) { safePhotos = []; }
  }

  const fallbackImage = 'https://images.unsplash.com/photo-1614680376593-902f74a0d40e?q=80&w=800&auto=format&fit=crop';
  const photos = safePhotos.length > 0 ? safePhotos : [fallbackImage];

  const handlePress = (evt) => {
    const x = evt.nativeEvent.locationX;
    if (x < CARD_WIDTH * 0.4) {
      setPhotoIndex(prev => Math.max(0, prev - 1));
    } else {
      setPhotoIndex(prev => Math.min(photos.length - 1, prev + 1));
    }
  };

  const trackName = card.current_track || card.anthem || "Buscando conexão...";
  const artistName = card.current_artist || "Perfil Offline";
  const isPlaying = card.is_playing || false;

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View style={styles.card}>
        <Image source={{ uri: photos[photoIndex] }} style={styles.cardImage} />
        
        <LinearGradient colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.4)', '#000']} locations={[0, 0.4, 1]} style={styles.cardGradient}>
          {photos.length > 1 && (
            <View style={styles.indicatorContainer}>
              {photos.map((_, i) => (
                <View key={i} style={[styles.indicator, i === photoIndex && styles.indicatorActive]} />
              ))}
            </View>
          )}

          <View style={styles.cardContentBox}>
            <View style={styles.headerInfo}>
              <Text style={styles.cardName} numberOfLines={1}>{card.name}</Text>
              <TouchableOpacity style={styles.infoBtn} onPress={() => openDetails(card)}>
                <Ionicons name="information" size={22} color="#000" />
              </TouchableOpacity>
            </View>

            <View style={[styles.spotifyPlayer, isPlaying && styles.spotifyPlayerActive]}>
              <View style={styles.spotifyIconBox}>
                <FontAwesome5 name="spotify" size={26} color="#1DB954" />
              </View>
              <View style={styles.spotifyTrackInfo}>
                <Text style={styles.nowPlayingLabel}>{isPlaying ? "SINTONIA AO VIVO" : "RADAR PAUSADO"}</Text>
                <Text style={styles.trackName} numberOfLines={1}>{trackName}</Text>
                <Text style={styles.artistName} numberOfLines={1}>{artistName}</Text>
              </View>
              {isPlaying ? (
                <MaterialCommunityIcons name="waveform" size={30} color="#1DB954" />
              ) : (
                <Ionicons name="pause-circle" size={28} color="#555" />
              )}
            </View>
          </View>
        </LinearGradient>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default function DiscoverScreen({ navigation }) {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allSwiped, setAllSwiped] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  
  const [myLiveTrack, setMyLiveTrack] = useState({ isPlaying: false, title: "Buscando...", artist: "" });
  const [matchData, setMatchData] = useState(null);
  
  const swiperRef = useRef(null);
  const confettiRef = useRef(null); 
  
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const matchModalScale = useRef(new Animated.Value(0)).current;
  const syncraBgPulse = useRef(new Animated.Value(1)).current;
  const waveformScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    fetchProfiles();
    syncMySpotifyToDatabase();
    const interval = setInterval(syncMySpotifyToDatabase, 5000);
    
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.8, duration: 1500, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1500, useNativeDriver: true })
      ])
    ).start();

    return () => clearInterval(interval);
  }, []);

  const fetchProfiles = async () => {
    const myId = await AsyncStorage.getItem('spotify_id');
    
    const { data: mySwipes } = await supabase
      .from('swipes')
      .select('swiped_id')
      .eq('swiper_id', myId);

    const swipedIds = mySwipes ? mySwipes.map(s => s.swiped_id) : [];

    let query = supabase
      .from('profiles')
      .select('*')
      .not('name', 'is', null)
      .neq('spotify_id', myId)
      .order('created_at', { ascending: false });

    if (swipedIds.length > 0) {
      query = query.not('spotify_id', 'in', `(${swipedIds.map(id => `"${id}"`).join(',')})`);
    }

    const { data, error } = await query;

    if (!error && data) {
      setProfiles(data);
      if (data.length === 0) setAllSwiped(true);
    }
    setLoading(false);
  };

  const syncMySpotifyToDatabase = async () => {
    try {
      const token = await AsyncStorage.getItem('spotify_token');
      const myId = await AsyncStorage.getItem('spotify_id');
      if (!token || !myId) return;

      const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
        headers: { Authorization: `Bearer ${token}` }
      });

      let trackData = { current_track: "Pausado", current_artist: "", is_playing: false };

      if (response.status === 200) {
        const data = await response.json();
        if (data && data.item) {
          trackData = { 
            current_track: data.item.name, 
            current_artist: data.item.artists.map(a => a.name).join(', '), 
            is_playing: data.is_playing 
          };
          setMyLiveTrack({ isPlaying: data.is_playing, title: data.item.name, artist: trackData.current_artist });
        }
      } else {
        setMyLiveTrack({ isPlaying: false, title: "Nenhuma música tocando", artist: "Abra o Spotify" });
      }

      await supabase.from('profiles').update(trackData).eq('spotify_id', myId);
    } catch (error) { 
      console.log("Erro de sincronização:", error); 
    }
  };

  const openDetails = (profile) => {
    setSelectedProfile(profile);
    setModalVisible(true);
  };

  const triggerMatchOverlay = (profile, type) => {
    setMatchData({ profile, type });
    
    Animated.spring(matchModalScale, {
      toValue: 1, 
      friction: 6, 
      tension: 40, 
      useNativeDriver: true
    }).start();

    // 🔥 GATILHO FÍSICO (HAPTICS) 🔥
    if (type === 'syncra') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      setTimeout(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success), 200);

      Animated.loop(
        Animated.sequence([
          Animated.timing(syncraBgPulse, { toValue: 1.3, duration: 600, easing: Easing.linear, useNativeDriver: true }),
          Animated.timing(syncraBgPulse, { toValue: 1, duration: 600, easing: Easing.linear, useNativeDriver: true })
        ])
      ).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(waveformScale, { toValue: 1.5, duration: 400, useNativeDriver: true }),
          Animated.timing(waveformScale, { toValue: 1, duration: 400, useNativeDriver: true })
        ])
      ).start();
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      confettiRef.current?.startConfetti();
    }
  };

  const closeMatchOverlay = () => {
    Animated.timing(matchModalScale, { 
      toValue: 0, 
      duration: 250, 
      useNativeDriver: true 
    }).start(() => {
      setMatchData(null);
      syncraBgPulse.setValue(1);
      waveformScale.setValue(1);
    });
  };

  const handleSwipeLeft = async (index) => { 
    const swipedId = profiles[index]?.spotify_id;
    const myId = await AsyncStorage.getItem('spotify_id');
    if (myId && swipedId) {
      await supabase.rpc('handle_swipe_matchmaking', {
        param_swiper_id: myId, 
        param_swiped_id: swipedId, 
        param_action: 'nope', 
        param_my_current_track: null, 
        param_my_is_playing: false
      });
    }
  };

  const handleSwipeRight = async (index) => { 
    const targetProfile = profiles[index];
    const swipedId = targetProfile?.spotify_id;
    const myId = await AsyncStorage.getItem('spotify_id');
    
    if (myId && swipedId) {
      const { data, error } = await supabase.rpc('handle_swipe_matchmaking', {
        param_swiper_id: myId,
        param_swiped_id: swipedId,
        param_action: 'like',
        param_my_current_track: myLiveTrack.title,
        param_my_is_playing: myLiveTrack.isPlaying
      });

      if (error) {
        console.error("❌ ERRO NO BACKEND:", error.message);
        return;
      }

      const verdict = data ? data[0] : null; 

      if (verdict) {
        const myTrack = myLiveTrack.title ? myLiveTrack.title.trim().toLowerCase() : "";
        const theirTrack = targetProfile.current_track ? targetProfile.current_track.trim().toLowerCase() : "";
        const isPlayingSame = myLiveTrack.isPlaying && targetProfile.is_playing;
        
        const isFrontendSynky = (myTrack !== "" && myTrack === theirTrack && isPlayingSame);
        const isBackendSynky = verdict.match_status === 'syncra_match' || verdict.is_syncra_match === true;

        if (isFrontendSynky || isBackendSynky) {
          triggerMatchOverlay(targetProfile, 'syncra');
          
          if (isFrontendSynky && !isBackendSynky) {
            await supabase.from('swipes').update({ is_syncra_match: true }).eq('swiper_id', myId).eq('swiped_id', swipedId);
          }
        } else if (verdict.match_status === 'normal_match' || verdict.match_status === 'match' || verdict.is_match) {
          triggerMatchOverlay(targetProfile, 'normal');
        }
      }
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0a0a0a', '#000']} style={StyleSheet.absoluteFillObject} />
      <ConfettiView ref={confettiRef} confettiCount={100} bsSize={0.5} colors={['#fff', '#aaa', '#1DB954']} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.navIcon} onPress={() => navigation.navigate('EditProfile')}>
          <Ionicons name="person" size={24} color="#aaa" />
        </TouchableOpacity>
        <View style={styles.logoBox}>
          <FontAwesome5 name="wave-square" size={22} color="#1DB954" />
          <Text style={styles.headerLogoText}>SYNCORA</Text>
        </View>
        <TouchableOpacity style={styles.navIcon} onPress={() => navigation.navigate('ChatList')}>
          <Ionicons name="chatbubbles" size={26} color="#aaa" />
          <View style={styles.chatBadge} />
        </TouchableOpacity>
      </View>

      <View style={styles.myTrackBanner}>
        <FontAwesome5 name="spotify" size={14} color={myLiveTrack.isPlaying ? "#1DB954" : "#555"} style={{ marginRight: 8 }} />
        <Text style={styles.myTrackLabel}>SUA VIBE: </Text>
        <Text style={styles.myTrackText} numberOfLines={1}>
          {myLiveTrack.isPlaying ? `${myLiveTrack.title} • ${myLiveTrack.artist}` : "Nenhuma música tocando"}
        </Text>
        {myLiveTrack.isPlaying && <View style={styles.liveIndicatorDot} />}
      </View>

      <View style={styles.deckWrapper}>
        {loading ? ( 
          <ActivityIndicator size="large" color="#1DB954" /> 
        ) : profiles.length > 0 && !allSwiped ? (
          <View style={styles.swiperLimits}>
            <Swiper 
              ref={swiperRef} 
              cards={profiles} 
              renderCard={(card) => <CardItem card={card} openDetails={openDetails} />} 
              onSwipedAll={() => setAllSwiped(true)} 
              stackSize={3} 
              cardIndex={0} 
              backgroundColor={'transparent'} 
              cardVerticalMargin={0} 
              cardHorizontalMargin={0} 
              showSecondCard={true} 
              disableBottomSwipe={true} 
              disableTopSwipe={true} 
              onSwipedLeft={handleSwipeLeft} 
              onSwipedRight={handleSwipeRight} 
              animateOverlayLabelsOpacity 
              overlayLabels={{ 
                left: { title: 'NOPE', style: { label: styles.nopeLabel, wrapper: styles.nopeWrapper } }, 
                right: { title: 'SYNKY', style: { label: styles.synkyLabel, wrapper: styles.synkyWrapper } } 
              }} 
            />
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Animated.View style={[styles.radarPulse, { transform: [{ scale: pulseAnim }], opacity: pulseAnim.interpolate({ inputRange: [1, 1.8], outputRange: [0.6, 0] }) }]} />
            <View style={styles.radarCore}>
              <FontAwesome5 name="satellite-dish" size={50} color="#1DB954" />
            </View>
            <Text style={styles.emptyTextTitle}>Buscando Sintonias...</Text>
            <View style={styles.emptySpotifyBox}>
               <FontAwesome5 name="spotify" size={20} color={myLiveTrack.isPlaying ? "#1DB954" : "#555"} style={{marginRight: 10}} />
               <Text style={styles.emptyTextSub} numberOfLines={1}>
                 {myLiveTrack.isPlaying ? `Radar ativo em: ${myLiveTrack.title}` : "Dê play no Spotify"}
               </Text>
            </View>
          </View>
        )}
      </View>

      {!allSwiped && !loading && (
        <View style={styles.bottomControls}>
          <TouchableOpacity style={[styles.actionBtn, styles.btnDislike]} onPress={() => swiperRef.current?.swipeLeft()}>
            <Ionicons name="close" size={38} color="#ff3b30" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.btnLike]} onPress={() => swiperRef.current?.swipeRight()}>
            <Ionicons name="heart" size={38} color="#1DB954" />
          </TouchableOpacity>
        </View>
      )}

      {matchData && (
        <Modal visible={true} transparent={true} animationType="fade">
          <View style={styles.matchOverlayContainer}>
            <LinearGradient 
              colors={matchData.type === 'syncra' ? ['#010f03', '#000', '#000'] : ['#080808', '#000']} 
              style={StyleSheet.absoluteFillObject} 
            />
            
            {matchData.type === 'syncra' && (
              <Animated.View style={[styles.syncraNeonRing, { transform: [{ scale: syncraBgPulse }] }]} />
            )}

            <Animated.View style={[styles.matchContentBox, { transform: [{ scale: matchModalScale }] }]}>
              
              {matchData.type === 'syncra' ? (
                <View style={styles.matchHeader}>
                  <Animated.View style={{ transform: [{ scale: waveformScale }], marginBottom: 15 }}>
                    <MaterialCommunityIcons name="waveform" size={80} color="#1DB954" />
                  </Animated.View>
                  <Text style={styles.syncraTitle}>SYNKY MATCH!</Text>
                  <Text style={styles.syncraSubtitle}>VOCÊS ESTÃO NA MESMA FREQUÊNCIA AGORA</Text>
                  <View style={styles.syncraTrackBadge}>
                     <Text style={styles.syncraTrackText}>{myLiveTrack.title} — {myLiveTrack.artist}</Text>
                  </View>
                </View>
              ) : (
                <View style={styles.matchHeader}>
                  <Text style={styles.normalMatchTitle}>SINTONIA!</Text>
                  <Text style={styles.normalMatchSubtitle}>Você e {matchData.profile.name} se curtiram mutuamente.</Text>
                </View>
              )}

              <View style={styles.matchAvatarWrapper}>
                 <Image 
                   source={{ uri: Array.isArray(matchData.profile.photos) ? matchData.profile.photos[0] : matchData.profile.photos }} 
                   style={[styles.matchAvatar, matchData.type === 'syncra' && styles.matchAvatarSyncra]} 
                 />
                 <LinearGradient 
                   colors={['rgba(255,255,255,0)', matchData.type === 'syncra' ? '#1DB954' : '#ff3b30']} 
                   style={styles.matchAvatarHalo} 
                 />
              </View>

              <View style={styles.matchActionsBox}>
                <TouchableOpacity 
                  style={[styles.matchBtnPrimary, matchData.type === 'syncra' && styles.matchBtnSyncra]} 
                  onPress={() => { closeMatchOverlay(); navigation.navigate('ChatList'); }}
                >
                  <Text style={styles.matchBtnPrimaryText}>MANDAR MENSAGEM</Text>
                  <Ionicons name="send" size={16} color="#000" style={{ marginLeft: 8 }} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.matchBtnSecondary} onPress={closeMatchOverlay}>
                  <Text style={styles.matchBtnSecondaryText}>CONTINUAR NO RADAR</Text>
                </TouchableOpacity>
              </View>

            </Animated.View>
          </View>
        </Modal>
      )}

      <Modal visible={modalVisible} animationType="slide" transparent={true} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeModalBtn} onPress={() => setModalVisible(false)}>
              <View style={styles.dragHandle} />
            </TouchableOpacity>

            {selectedProfile && (
              <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
                <Image 
                  source={{ uri: (Array.isArray(selectedProfile.photos) && selectedProfile.photos.length > 0) ? selectedProfile.photos[0] : 'https://images.unsplash.com/photo-1614680376593-902f74a0d40e?q=80&w=800&auto=format&fit=crop' }} 
                  style={styles.modalHeaderImage} 
                />
                <View style={styles.modalBody}>
                  <Text style={styles.modalName}>{selectedProfile.name}</Text>
                  
                  <Text style={styles.sectionTitle}>Música Atual</Text>
                  <View style={styles.modalAnthem}>
                    <FontAwesome5 name="spotify" size={28} color="#1DB954" style={{marginRight: 15}} />
                    <View style={{flex: 1}}>
                      <Text style={styles.modalTrackName} numberOfLines={1}>
                        {selectedProfile.current_track || selectedProfile.anthem || "Nenhuma música"}
                      </Text>
                      <Text style={styles.modalArtistName}>
                        {selectedProfile.current_artist || "Perfil Offline"}
                      </Text>
                    </View>
                    {selectedProfile.is_playing ? (
                      <MaterialCommunityIcons name="waveform" size={24} color="#1DB954" />
                    ) : (
                      <Ionicons name="pause-circle" size={24} color="#555" />
                    )}
                  </View>

                  <Text style={styles.sectionTitle}>Sobre a Vibe</Text>
                  <Text style={styles.modalBio}>{selectedProfile.bio || "Sem descrição disponível."}</Text>

                  <Text style={styles.sectionTitle}>Interesses Mútuos</Text>
                  <View style={styles.tagsContainer}>
                    {selectedProfile.interests && selectedProfile.interests.map((interest, idx) => (
                      <View key={idx} style={styles.tag}><Text style={styles.tagText}>{interest}</Text></View>
                    ))}
                  </View>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 25, paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingBottom: 10, zIndex: 10 },
  navIcon: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#111', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#222' },
  chatBadge: { position: 'absolute', top: 12, right: 12, width: 10, height: 10, borderRadius: 5, backgroundColor: '#1DB954', borderWidth: 2, borderColor: '#111' },
  logoBox: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerLogoText: { color: '#fff', fontSize: 22, fontWeight: '900', letterSpacing: 2 },
  
  myTrackBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#111', paddingVertical: 10, paddingHorizontal: 18, borderRadius: 20, marginHorizontal: 25, marginBottom: 8, borderWidth: 1, borderColor: '#222', justifyContent: 'center' },
  myTrackLabel: { color: '#1DB954', fontSize: 11, fontWeight: '900', letterSpacing: 1 },
  myTrackText: { color: '#eee', fontSize: 12, fontWeight: 'bold', flexShrink: 1 },
  liveIndicatorDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#1DB954', marginLeft: 8, shadowColor: '#1DB954', shadowRadius: 4, shadowOpacity: 0.8 },

  deckWrapper: { flex: 1, justifyContent: 'center', alignItems: 'center', zIndex: 5 },
  swiperLimits: { width: CARD_WIDTH, height: CARD_HEIGHT },
  card: { width: CARD_WIDTH, height: CARD_HEIGHT, borderRadius: 24, backgroundColor: '#111', overflow: 'hidden', elevation: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.8, shadowRadius: 20, borderWidth: 1, borderColor: '#222' },
  cardImage: { ...StyleSheet.absoluteFillObject, resizeMode: 'cover' },
  cardGradient: { flex: 1, justifyContent: 'space-between', padding: 20 },
  indicatorContainer: { flexDirection: 'row', gap: 5, marginTop: 5 },
  indicator: { flex: 1, height: 4, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 2 },
  indicatorActive: { backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.5, shadowRadius: 2 },
  cardContentBox: { width: '100%' },
  headerInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 15 },
  cardName: { color: '#fff', fontSize: 42, fontWeight: '900', textShadowColor: '#000', textShadowOffset: {width: 0, height: 2}, textShadowRadius: 10, flex: 1, paddingRight: 10 },
  infoBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', marginBottom: 5 },
  spotifyPlayer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(10, 10, 10, 0.9)', padding: 15, borderRadius: 20, borderWidth: 1, borderColor: '#333' },
  spotifyPlayerActive: { borderColor: 'rgba(29, 185, 84, 0.5)', shadowColor: '#1DB954', shadowOpacity: 0.2, shadowRadius: 10, elevation: 5 },
  spotifyIconBox: { marginRight: 15 },
  spotifyTrackInfo: { flex: 1 },
  nowPlayingLabel: { color: '#1DB954', fontSize: 10, fontWeight: '900', letterSpacing: 1.5, marginBottom: 2 },
  trackName: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  artistName: { color: '#aaa', fontSize: 13, marginTop: 2 },
  
  bottomControls: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingBottom: Platform.OS === 'ios' ? 45 : 30, paddingTop: 15, gap: 50, zIndex: 10 },
  actionBtn: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', backgroundColor: '#111', shadowColor: '#000', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.8, shadowRadius: 15, elevation: 15 },
  btnDislike: { borderWidth: 2, borderColor: 'rgba(255, 59, 48, 0.4)' },
  btnLike: { borderWidth: 2, borderColor: 'rgba(29, 185, 84, 0.4)' },
  nopeLabel: { backgroundColor: 'transparent', borderColor: '#ff3b30', borderWidth: 5, color: '#ff3b30', fontSize: 38, fontWeight: '900', borderRadius: 15, padding: 8 },
  nopeWrapper: { flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'flex-start', marginTop: 40, marginLeft: -40 },
  synkyLabel: { backgroundColor: 'transparent', borderColor: '#1DB954', borderWidth: 5, color: '#1DB954', fontSize: 38, fontWeight: '900', borderRadius: 15, padding: 8 },
  synkyWrapper: { flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', marginTop: 40, marginLeft: 40 },
  
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 30 },
  radarPulse: { position: 'absolute', width: 150, height: 150, borderRadius: 75, backgroundColor: 'rgba(29, 185, 84, 0.2)' },
  radarCore: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#111', borderWidth: 2, borderColor: '#1DB954', justifyContent: 'center', alignItems: 'center', marginBottom: 30 },
  emptyTextTitle: { color: '#fff', fontSize: 26, fontWeight: 'bold', marginBottom: 15 },
  emptySpotifyBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#111', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 20, borderWidth: 1, borderColor: '#333' },
  emptyTextSub: { color: '#aaa', fontSize: 13, fontWeight: 'bold', flexShrink: 1 },

  matchOverlayContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 25, zIndex: 100 },
  syncraNeonRing: { position: 'absolute', width: width * 2, height: width * 2, borderRadius: width, backgroundColor: 'rgba(29,185,84,0.05)', borderWidth: 5, borderColor: '#1DB954', shadowColor: '#1DB954', shadowRadius: 50, shadowOpacity: 1, elevation: 30 },
  matchContentBox: { width: '100%', alignItems: 'center', zIndex: 110 },
  matchHeader: { alignItems: 'center', marginBottom: 40 },
  
  normalMatchTitle: { color: '#fff', fontSize: 56, fontWeight: '900', fontStyle: 'italic', textShadowColor: '#ff3b30', textShadowOffset: {width: 0, height: 4}, textShadowRadius: 15, letterSpacing: -1 },
  normalMatchSubtitle: { color: '#aaa', fontSize: 18, marginTop: 15, textAlign: 'center', lineHeight: 26 },
  
  syncraTitle: { color: '#1DB954', fontSize: 58, fontWeight: '900', fontStyle: 'italic', textAlign: 'center', textShadowColor: '#1DB954', textShadowOffset: {width: 0, height: 0}, textShadowRadius: 25, letterSpacing: -1 },
  syncraSubtitle: { color: '#fff', fontSize: 13, fontWeight: '900', letterSpacing: 2, marginTop: 12, textAlign: 'center' },
  syncraTrackBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#111', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 30, marginTop: 25, borderWidth: 1, borderColor: '#333' },
  syncraTrackText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

  matchAvatarWrapper: { justifyContent: 'center', alignItems: 'center', marginBottom: 50, position: 'relative' },
  matchAvatar: { width: 170, height: 170, borderRadius: 85, borderWidth: 4, borderColor: '#fff', zIndex: 120 },
  matchAvatarSyncra: { borderColor: '#1DB954', borderWidth: 6 },
  matchAvatarHalo: { position: 'absolute', width: 220, height: 220, borderRadius: 110, zIndex: 115, opacity: 0.6, transform: [{ scale: 1.1 }] },

  matchActionsBox: { width: '100%', alignItems: 'center' },
  matchBtnPrimary: { flexDirection: 'row', backgroundColor: '#fff', width: '100%', paddingVertical: 20, borderRadius: 35, justifyContent: 'center', alignItems: 'center', marginBottom: 18, shadowColor: '#000', shadowOffset: {width: 0, height: 5}, shadowOpacity: 0.3, shadowRadius: 10, elevation: 10 },
  matchBtnSyncra: { backgroundColor: '#1DB954', shadowColor: '#1DB954', shadowOpacity: 0.6, shadowRadius: 20, elevation: 15 },
  matchBtnPrimaryText: { color: '#000', fontSize: 17, fontWeight: '900', letterSpacing: 1 },
  matchBtnSecondary: { paddingVertical: 15, width: '100%', alignItems: 'center' },
  matchBtnSecondaryText: { color: '#888', fontSize: 15, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1.5 },

  modalContainer: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.7)' },
  modalContent: { height: '88%', backgroundColor: '#0a0a0a', borderTopLeftRadius: 35, borderTopRightRadius: 35, overflow: 'hidden', borderWidth: 1, borderColor: '#222' },
  closeModalBtn: { alignItems: 'center', paddingVertical: 15, width: '100%', position: 'absolute', top: 0, zIndex: 100 },
  dragHandle: { width: 50, height: 6, backgroundColor: 'rgba(255,255,255,0.4)', borderRadius: 3 },
  modalHeaderImage: { width: '100%', height: height * 0.45, resizeMode: 'cover' },
  modalBody: { padding: 30 },
  modalName: { color: '#fff', fontSize: 42, fontWeight: '900', marginBottom: 30 },
  sectionTitle: { color: '#444', fontSize: 13, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 15 },
  modalAnthem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#111', padding: 20, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(29, 185, 84, 0.3)', marginBottom: 30 },
  modalTrackName: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  modalArtistName: { color: '#888', fontSize: 14, marginTop: 3 },
  modalBio: { color: '#ccc', fontSize: 16, lineHeight: 26, marginBottom: 35 },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 40 },
  tag: { backgroundColor: '#1a1a1a', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 30, borderWidth: 1, borderColor: '#333' },
  tagText: { color: '#fff', fontSize: 14, fontWeight: '700' }
});