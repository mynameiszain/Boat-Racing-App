import React from 'react';

import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useSelector} from 'react-redux';
import HomeScreen from '../../components/HomeScreen';
import MyProfileScreen from '../../components/MyProfileScreen';
import TabsNavigator from '../../components/TabsNavigator';
import ProfileScreen from '../../components/ProfileScreen';
import FriendRequestScreen from '../../components/FriendRequestsScreen';
import UserDetailScreen from '../../components/UserDetail';
import CreateEventScreen from '../../components/CreateEventScreen';
import ChatListScreen from '../../components/ChatsListScreen';
import ChatScreen from '../../components/ChatScreen';
import CreateGroupScreen from '../../components/CreateGroupScreen';
import GroupChatScreen from '../../components/GroupChatScreen';
import EventDetailsScreen from '../../components/EventDetailsScreen';
import UserSelectionScreen from '../../components/UserSelectionScreen';
import AddUsersScreen from '../../components/AddUsersScreen';
import LoginScreen from '../../components/LoginScreen';
import Signup from '../../components/SignupScreen';

const Stack = createNativeStackNavigator();

const Route = () => {
  const {user} = useSelector(state => state.auth);
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          <>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen name="TabsNavigator" component={TabsNavigator} />
            <Stack.Screen
              name="MyProfileScreen"
              component={MyProfileScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="ProfileScreen"
              component={ProfileScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="FriendRequestsScreen"
              component={FriendRequestScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="UserDetail"
              component={UserDetailScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="CreateEventScreen"
              component={CreateEventScreen}
            />
            <Stack.Screen
              name="ChatsListScreen"
              component={ChatListScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="ChatScreen"
              component={ChatScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="CreateGroupScreen"
              component={CreateGroupScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="GroupChatScreen"
              component={GroupChatScreen}
              options={{headerShown: false}}
            />
            
            <Stack.Screen
              name="EventDetailsScreen"
              component={EventDetailsScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="UserSelectionScreen"
              component={UserSelectionScreen}
              options={{headerShown: false}}
            />
              <Stack.Screen
              name="AddUsersScreen"
              component={AddUsersScreen}
              options={{headerShown: false}}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Signup"
              component={Signup}
              options={{headerShown: false}}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Route;
