import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// 1. As importações de todas as telas oficiais (Agora com o EditProfile real!)
import LoginScreen from './src/screens/LoginScreen';
import KycScreen from './src/screens/KycScreen';
import ProfileSetupScreen from './src/screens/ProfileSetupScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import DiscoverScreen from './src/screens/DiscoverScreen';
import ChatListScreen from './src/screens/ChatListScreen';
import ChatRoomScreen from './src/screens/ChatRoomScreen';
import EditProfileScreen from './src/screens/EditProfileScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login" 
        screenOptions={{ 
          headerShown: false, 
          gestureEnabled: false, 
          cardStyle: { backgroundColor: '#000' } 
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="KYC" component={KycScreen} />
        <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Discover" component={DiscoverScreen} />
        
        {/* 2. A rota agora chama o componente real que importamos ali em cima */}
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        
        <Stack.Screen name="ChatList" component={ChatListScreen} />
        <Stack.Screen name="ChatRoom" component={ChatRoomScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}