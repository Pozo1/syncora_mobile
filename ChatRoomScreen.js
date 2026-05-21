import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TextInput, TouchableOpacity, 
  FlatList, KeyboardAvoidingView, Platform, Image 
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../services/supabaseClient';

export default function ChatRoomScreen({ route, navigation }) {
  const { profile } = route.params;
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [myId, setMyId] = useState(null);

  useEffect(() => {
    setupChat();
  }, []);

  const setupChat = async () => {
    const id = await AsyncStorage.getItem('spotify_id');
    setMyId(id);
    fetchMessages(id);

    const interval = setInterval(() => fetchMessages(id), 3000);
    return () => clearInterval(interval);
  };

  const fetchMessages = async (userId) => {
    if (!userId) return;
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${userId},receiver_id.eq.${profile.spotify_id}),and(sender_id.eq.${profile.spotify_id},receiver_id.eq.${userId})`)
      .order('created_at', { ascending: true });

    if (data) setMessages(data);
  };

  const sendMessage = async () => {
    if (!inputText.trim() || !myId) return;
    const textToSend = inputText.trim();
    setInputText(''); 

    const newMessage = { 
      id: Date.now().toString(), 
      sender_id: myId, 
      receiver_id: profile.spotify_id, 
      content: textToSend, 
      created_at: new Date().toISOString() 
    };
    setMessages(prev => [...prev, newMessage]);

    await supabase.from('messages').insert([{ 
      sender_id: myId, 
      receiver_id: profile.spotify_id, 
      content: textToSend 
    }]);
  };

  const renderMessage = ({ item }) => {
    const isMe = item.sender_id === myId;
    return (
      <View style={[styles.messageWrapper, isMe ? styles.messageWrapperMe : styles.messageWrapperThem]}>
        <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleThem]}>
          <Text style={[styles.messageText, isMe ? styles.textMe : styles.textThem]}>
            {item.content}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <LinearGradient colors={['#0a0a0a', '#000']} style={StyleSheet.absoluteFillObject} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        
        <View style={styles.headerProfile}>
          <Image source={{ uri: profile.displayPhoto }} style={[styles.avatar, profile.isSyncra && styles.avatarSyncra]} />
          <View style={styles.headerInfo}>
            <Text style={styles.headerName} numberOfLines={1}>{profile.name}</Text>
            {/* Tratamento perfeito para evitar o erro do <Text> */}
            {profile.isSyncra ? (
              <View style={styles.syncraBadge}>
                <MaterialCommunityIcons name="waveform" size={12} color="#000" />
                <Text style={styles.syncraBadgeText}>SYNKY MATCH</Text>
              </View>
            ) : null}
          </View>
        </View>
      </View>

      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.chatArea}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.inputArea}>
        <TextInput
          style={styles.input}
          placeholder="Digite sua mensagem..."
          placeholderTextColor="#666"
          value={inputText}
          onChangeText={setInputText}
          multiline
        />
        <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
          <Ionicons name="send" size={20} color="#000" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingBottom: 15, backgroundColor: '#050505', borderBottomWidth: 1, borderBottomColor: '#111' },
  backBtn: { marginRight: 15, padding: 5 },
  headerProfile: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  avatar: { width: 45, height: 45, borderRadius: 22.5, borderWidth: 1, borderColor: '#333', marginRight: 12 },
  avatarSyncra: { borderColor: '#1DB954', borderWidth: 2 },
  headerInfo: { flex: 1, justifyContent: 'center' },
  headerName: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  syncraBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1DB954', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 5, alignSelf: 'flex-start', marginTop: 3 },
  syncraBadgeText: { color: '#000', fontSize: 9, fontWeight: '900', marginLeft: 4, letterSpacing: 1 },
  chatArea: { padding: 20, paddingBottom: 30 },
  messageWrapper: { width: '100%', marginBottom: 15 },
  messageWrapperMe: { alignItems: 'flex-end' },
  messageWrapperThem: { alignItems: 'flex-start' },
  bubble: { maxWidth: '80%', padding: 15, borderRadius: 20 },
  bubbleMe: { backgroundColor: '#1DB954', borderBottomRightRadius: 5 },
  bubbleThem: { backgroundColor: '#1a1a1a', borderBottomLeftRadius: 5, borderWidth: 1, borderColor: '#222' },
  messageText: { fontSize: 15, lineHeight: 22 },
  textMe: { color: '#000', fontWeight: '600' },
  textThem: { color: '#eee' },
  inputArea: { flexDirection: 'row', alignItems: 'flex-end', padding: 15, paddingBottom: Platform.OS === 'ios' ? 35 : 15, backgroundColor: '#0a0a0a', borderTopWidth: 1, borderTopColor: '#111' },
  input: { flex: 1, backgroundColor: '#111', color: '#fff', paddingHorizontal: 20, paddingVertical: 15, borderRadius: 25, fontSize: 15, maxHeight: 100, borderWidth: 1, borderColor: '#222' },
  sendBtn: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#1DB954', justifyContent: 'center', alignItems: 'center', marginLeft: 10 }
});