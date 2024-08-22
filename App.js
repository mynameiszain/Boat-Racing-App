import React, {useEffect, useState} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from './components/SplashScreen';
import LoginScreen from './components/LoginScreen';
import SignupScreen from './components/SignupScreen';
import HomeScreen from './components/HomeScreen';
import TabsNavigator from './components/TabsNavigator';
import MyProfileScreen from './components/MyProfileScreen';
import CreateEventScreen from './components/CreateEventScreen';
import ProfileScreen from './components/ProfileScreen';
import FriendRequestsScreen from './components/FriendRequestsScreen';
import UserDetailScreen from './components/UserDetail'; 
import ChatScreen from './components/ChatScreen';
import ChatsListScreen from './components/ChatsListScreen';
// import GroupChatScreen from './components/GroupChatScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';





const Stack = createNativeStackNavigator();


const App = () => {
  
  return (
    <NavigationContainer>
    <Stack.Navigator >
    <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />      
    <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
    <Stack.Screen name="TabsNavigator" component={TabsNavigator} />
    <Stack.Screen name="MyProfileScreen" component={MyProfileScreen} options={{ headerShown: false }} />
    <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{ headerShown: false }} />
    <Stack.Screen name="FriendRequestsScreen" component={FriendRequestsScreen} options={{ headerShown: false }} />
    <Stack.Screen name="UserDetail" component={UserDetailScreen} options={{ headerShown: false }} />
    <Stack.Screen name="CreateEventScreen" component={CreateEventScreen} />
    <Stack.Screen name="ChatsListScreen" component={ChatsListScreen} options={{ headerShown: false }} />
    <Stack.Screen name="ChatScreen" component={ChatScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
      
  </Stack.Navigator>
  </NavigationContainer>
  );
};

export default App;
