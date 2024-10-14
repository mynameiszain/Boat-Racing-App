import React, { useEffect, useState, useCallback, memo } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  DrawerLayoutAndroid,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import TabsNavigator from './TabsNavigator';
import { useFocusEffect } from '@react-navigation/native';
import { setUser } from '../src/store/slices/user';
import { useDispatch } from 'react-redux';
import axios from 'axios';

// Memoized TabsNavigator to optimize performance
const MemoizedTabsNavigator = memo(TabsNavigator);

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [noResults, setNoResults] = useState(false);
  
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
      dispatch(setUser(null));
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };

  // Debounced search handler
  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setNoResults(false);
      return;
    }

    setIsSearching(true);
    setNoResults(false);

    try {
      const userData = await AsyncStorage.getItem('user');
      const user = JSON.parse(userData);

      const response = await axios.post(
        'https://amanda.capraworks.com/api/search_events.php',
        {
          user_id: user?.id,
          search_query: searchQuery.trim(),
        },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (response.data && response.data.status === 'success' && Array.isArray(response.data.invitations)) {
        setSearchResults(response.data.invitations);
        setNoResults(response.data.invitations.length === 0);
      } else {
        setSearchResults([]);
        setNoResults(true);
      }
    } catch (error) {
      console.error('Error fetching search results:', error.message);
      setSearchResults([]);
      setNoResults(true);
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery]);

  // Debounce functionality
  useEffect(() => {
    const handler = setTimeout(() => {
      handleSearch();
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  useEffect(() => {
    console.log('Search Results:', searchResults);
  }, [searchResults]);

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

          <TouchableOpacity
            onPress={() =>
              navigation.navigate('ChatsListScreen', {userId: userDetails?.id})
            }
            style={styles.iconnav}>
            <MaterialCommunityIcons
              name="chat"
              size={18}
              color="#1D1852"
              style={styles.iconnavin}
            />
            <Text style={styles.iconnavtext}>Chats</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('CreateGroupScreen', {userId: userDetails?.id})
            }
            style={styles.iconnav}>
            <MaterialCommunityIcons
              name="account-group"
              size={18}
              color="#1D1852"
              style={styles.iconnavin}
            />
            <Text style={styles.iconnavtext}>Group Chat</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              navigation.navigate('ProfileScreen', {userId: userDetails?.id})
            }
            style={styles.iconnav}>
            <MaterialCommunityIcons
              name="account-edit"
              size={18}
              color="#1D1852"
              style={styles.iconnavin}
            />
            <Text style={styles.iconnavtext}>Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              navigation.navigate('FriendRequestsScreen', {
                userId: userDetails?.id,
              })
            }
            style={styles.iconnav}>
            <Icon
              name="user-plus"
              size={18}
              color="#000"
              style={styles.iconnavin}
            />
            <Text style={styles.iconnavtext}>Manage Friend Request</Text>
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
            <Image source={{ uri: `https://amanda.capraworks.com/api/${userDetails.user_image}` }} style={styles.profileImage} />
          </TouchableOpacity>
        </View>

        <View style={styles.flexContainer}>
          <View style={styles.profileInnerText}>
            <Text style={styles.profileText}>
              <Text style={styles.profileTextBold}>Hi </Text>
              <Text style={styles.profileText}>
              {userDetails?.username},</Text>
            </Text>
            <Text style={styles.profileSmallText}>Welcome Back!</Text>
            <Text style={styles.profileHeading}>
              Race-ready Connections: Matching Crew with Boats, and Boat with crew
            </Text>
          </View>
        </View>

        <View style={styles.flexSearch}>
          <Icon name="search" size={18} color="#000" style={styles.iconsearch} />
          <TextInput
            style={styles.searchBar}
            placeholder="Search Events"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {/* <Icon name="filter" size={18} color="#000" style={styles.iconsearch} /> */}
        </View>

        {isSearching && <ActivityIndicator size="small" color="#0000ff" />}
        {!isSearching && searchResults.length > 0 && (
<FlatList
  data={searchResults}
  keyExtractor={(item) => (item.id ? item.id.toString() : Math.random().toString())} // Fallback to a random string if id is missing
  renderItem={({ item }) => (


    <TouchableOpacity
      style={styles.innerEventCont}
      onPress={() => navigation.navigate('EventDetailsScreen', { event: item })} 
    >
      <Text style={styles.innerEventContt}>{item.event_name || 'Event Name'}</Text>
      <Text style={styles.innerEventConttt}>{item.event_date || 'Event Date'} | {item.event_time || 'Event Time'}</Text>
      <Text style={styles.innerEventConttt}>      
        <MaterialCommunityIcons
              name="crown"
              size={18}
              color="#1D1852"
              style={styles.crown}
            /> {item.event_type || 'Owner'}</Text>
    </TouchableOpacity>
  )}
/>

        )}
        {!isSearching && noResults && (
          <Text style={styles.noResultsText}>No events found</Text>
        )}

        <View style={styles.TabsNavigator}>
          <MemoizedTabsNavigator userId={userDetails?.id} />
        </View>
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
    backgroundColor: '#f2f2f2',
  },
  TabsNavigator: {
    marginTop: 32,
  },
  flexSearch: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#f2f2f2',
    paddingHorizontal: 14,
    borderRadius: 7,
    marginTop: 20,
  },
  iconsearch: {
    width: 28,
  },
  searchBar: {
    width: '80%',
    fontFamily: 'Nunito-Regular',
    fontWeight: '600',
    fontSize: 18,
    color: '#000',
  },
  mainIconContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    position: 'absolute',
    zIndex: 2,
    right: 0,
    borderRadius: 50,
    margin: 10,
    elevation: 5,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 50,
    objectFit: 'cover',
  },
  iconNotification: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 300,
  },
  flexContainer: {
    flexDirection: 'row',
  },
  profileInnerText: {
    justifyContent: 'center',
  },
  profileText: {
    fontFamily: 'Nunito-Regular',
    fontWeight: '700',
    fontSize: 20,
    color: '#1D1852',
    textTransform: 'capitalize',
  },
  profileTextBold: {
    fontFamily: 'Nunito-ExtraBold',
    fontWeight: '900',
    color: '#1D1852',
    fontSize: 28,
  },
  profileSmallText: {
    fontFamily: 'Nunito-Light',

    fontSize: 24,
    color: '#1D1852',
  },
  profileHeading: {
    fontFamily: 'Nunito-Bold',
    fontSize: 20,
    fontWeight: '700',
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
    color: '#1D1852',
  },
  iconnavtext: {
    fontFamily: 'Nunito-Bold',
    fontSize: 18,
    color: '#000',
    textTransform: 'capitalize',
  },
  noResultsText: {
    fontFamily: 'Nunito-Regular',
    fontWeight: '500',
    fontSize: 18,
    padding:18,
    color:'#1D1852',
    textTransform: 'capitalize',
  },
  createEventButton: {
    maxWidth: 100,
    backgroundColor: '#1D1852',
    padding: 7,
    borderRadius: 4,
    marginBottom: 12,
    marginTop: 20,
  },
  createEventButtonText: {
    color: '#fff',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 40,
    alignSelf: 'center',
  },
  searchResultItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  searchResultText: {
    fontSize: 16,
  },

  
  innerEventCont: {
    backgroundColor: '#f2f2f2',
    borderRadius: 7,
    padding: 20,
    marginTop:20,
  },
  innerEventContt: {
    color: '#1D1852',
    fontFamily: 'Nunito-Regular',
    fontWeight: '800',
    fontSize: 22,
  },
  innerEventConttt: {
    fontFamily: 'Nunito-Regular',
    fontWeight: '500',
    fontSize: 18,
    color: '#000',
    marginVertical: 2,
  },
});

export default HomeScreen;
