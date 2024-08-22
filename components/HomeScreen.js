import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, Image, DrawerLayoutAndroid, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TabsNavigator from './TabsNavigator'; 
import { useFocusEffect } from '@react-navigation/native';

const HomeScreen = ({ navigation }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const drawer = React.useRef(null);

  const openDrawer = () => {
    drawer.current.openDrawer();
  };

  const closeDrawer = () => {
    drawer.current.closeDrawer();
  };

  const fetchUserDetails = async () => {
    setLoading(true);
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        setUserDetails(user);
        setError(null);
      } else {
        setError('User data is not available.');
      }
    } catch (error) {
      setError('Error fetching user details.');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserDetails();
    }, [])
  );

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('userEmail');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <DrawerLayoutAndroid
      ref={drawer}
      drawerWidth={300}
      drawerPosition="left"
      renderNavigationView={() => (
        <View style={styles.drawerContent}>
          <View>
          <Image
              source={{ uri: 'https://amanda.capraworks.com/assets/logo.png' }}
              style={styles.logo}
            />
          </View>

          <TouchableOpacity onPress={() => navigation.navigate('MyProfileScreen', { userId: userDetails?.id })} style={styles.iconnav}>
            <Icon name="user" size={18} color="#000" style={styles.iconnavin} />
            <Text style={styles.iconnavtext}>My Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('ChatsListScreen', { userId: userDetails?.id })} style={styles.iconnav}>
            <Icon name="wechat" size={18} color="#000" style={styles.iconnavin} />
            <Text style={styles.iconnavtext}>Chats</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('FriendRequestsScreen', { userId: userDetails?.id })} style={styles.iconnav}>
            <Icon name="user-plus" size={18} color="#000" style={styles.iconnavin} />
            <Text style={styles.iconnavtext}>Manage Friend Request</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('ProfileScreen', { userId: userDetails?.id })} style={styles.iconnav}>
            <Icon name="edit" size={18} color="#000" style={styles.iconnavin} />
            <Text style={styles.iconnavtext}>Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleLogout} style={styles.iconnav}>
            <Icon name="power-off" size={18} color="#000" style={styles.iconnavin} />
            <Text style={styles.iconnavtext}>Log Out</Text>
          </TouchableOpacity>
        </View>
      )}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerContainer}>

          <TouchableOpacity onPress={openDrawer} style={styles.mainIconContainer}>
          <Image
          source={{ uri: `https://amanda.capraworks.com/api/${userDetails.user_image}` }}
          style={styles.profileImage}
        />
          </TouchableOpacity>
        </View>

        <View style={styles.flexContainer}>
          <View style={styles.profileInnerText}>
            <Text style={styles.profileText}><Text style={styles.profileTextBold}>Hi </Text>{userDetails?.username},</Text>
            <Text style={styles.profileSmallText}>Welcome Back</Text>
            <Text style={styles.profileHeading}>Race-ready Connections: Matching Crew with Boats, and Boat with crew</Text>
          </View>
        </View>

       
        <TouchableOpacity onPress={() => navigation.navigate('CreateEventScreen')} style={styles.createEventButton}>
          <Text style={styles.createEventButtonText}>Create Event</Text>
        </TouchableOpacity>

        <View style={styles.flexSearch}>
        <Icon name="search" size={18} color="#000" style={styles.iconsearch} />
        <TextInput
        style={styles.searchBar}
        placeholder="Search chats..."
      />
      <Icon name="filter" size={18} color="#000" style={styles.iconsearch} />
        </View>

        <View style={styles.TabsNavigator}><TabsNavigator /></View>
          

       
      </ScrollView>
    </DrawerLayoutAndroid>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 18,
  },
  drawerContent: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  TabsNavigator: {
    marginTop:32,
  },
  flexSearch: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#FBFBFB',
    paddingHorizontal:18,
    borderRadius:7,
    marginTop:20,
  },
  iconsearch: {
    width:26,
  },
  searchBar: {
    width:'80%',
  },
  mainIconContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    position: 'absolute',
    zIndex: 2,
    right: 0,
    backgroundColor: '#000',
    padding: 2,
    borderRadius: 50,
    margin:10,
  },  
  profileImage: {
    width:40,
    height:40,
    borderRadius: 50,
    objectFit: 'cover',
  },
  iconNotification: {
    color: '#fff',
    fontSize: 22,
    fontWeight:300,
  },
  flexContainer: {
    flexDirection: 'row',
  },
  profileInnerText: {
    justifyContent: 'center',
  },
  profileText: {
    fontSize: 16,
    color: '#333',
    textTransform: 'capitalize',
  },
  profileTextBold: {
    fontWeight: 'bold',
  },
  profileSmallText: {
    fontSize: 24,
    color: '#1D1852',
  },
  profileHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1D1852',
    marginTop: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconnav: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 10,
    maxHeight: 32,
    alignItems: 'center',
    
  },
  iconnavin: {
    width: 26,
    color:'#1D1852',
  },
  iconnavtext: {
    fontFamily: 'Nunito-Bold',
    fontSize: 18,
    color: '#000',
    textTransform: 'capitalize',
  },
  createEventButton: {
    maxWidth: 100,
    backgroundColor: '#1D1852',
    padding:7,
    borderRadius:4,
    marginBottom: 12,
    marginTop:20,
  },
  createEventButtonText: {
    color: '#fff',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 40,
    alignSelf:'center',
  },
});

export default HomeScreen;
