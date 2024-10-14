import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  DrawerLayoutAndroid,
  ScrollView,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Button,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useFocusEffect} from '@react-navigation/native';
import {DrawerActions} from '@react-navigation/native';
import {setUser} from '../src/store/slices/user';
import {useDispatch} from 'react-redux';

const MyProfileScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const handleGoBack = () => {
    navigation.goBack();
  };
  const [userDetails, setUserDetails] = useState(null);
  const [recommendedUsers, setRecommendedUsers] = useState([]);
  const [friends, setFriends] = useState([]);
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
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        setUserDetails(user);
        fetchRecommendedUsers(user.id);
        fetchFriends(user.id);
      } else {
        console.error('User data is not available.');
      }
    } catch (error) {
      console.error('Error fetching user details:', error.message);
      setLoading(false);
    }
  };

  const fetchRecommendedUsers = async userId => {
    try {
      const response = await fetch(
        `https://amanda.capraworks.com/api/recomendedUsers.php?user_id=${userId}`,
      );
      const data = await response.json();
      if (data && data.users && Array.isArray(data.users)) {
        setRecommendedUsers(data.users);
      } else {
        console.warn('Unexpected data format:', data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching recommended users:', error.message);
      setError('Failed to load recommended users');
      setLoading(false);
    }
  };

  const fetchFriends = async userId => {
    try {
      const response = await fetch(
        `https://amanda.capraworks.com/api/get_friends.php?user_id=${userId}`,
      );
      const data = await response.json();
      if (Array.isArray(data)) {
        setFriends(data);
      } else {
        console.warn('Unexpected data format:', data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching friends:', error.message);
      setError('Failed to load friends');
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserDetails();
    }, []),
  );

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('userEmail');
      dispatch(setUser(null));
      // navigation.navigate('Login');
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };

  const renderFriendItem = ({item}) => (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() => navigation.navigate('UserDetail', {userId: item.id})}>
      <Image
        source={{uri: `https://amanda.capraworks.com/api/${item.user_image}`}}
        style={styles.userImage}
      />
      <View style={styles.userTextContainer}>
        <Text style={styles.userName}>{item.username}</Text>
        <Text style={styles.userTitle}>{item.usertitle}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderRecommendedUsers = ({item}) => (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() => navigation.navigate('UserDetail', {userId: item.id})}>
      <Image
        source={{uri: `https://amanda.capraworks.com/api/${item.user_image}`}}
        style={styles.userImage}
      />
      <View style={styles.userTextContainer}>
        <Text style={styles.userName}>{item.username}</Text>
        <Text style={styles.userTitle}>{item.usertitle}</Text>
      </View>
    </TouchableOpacity>
  );

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
      drawerWidth={300}
      drawerPosition="left"
      ref={drawer}
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
          <TouchableOpacity
            style={styles.mainIconContainerr}
            onPress={handleGoBack}>
           <MaterialCommunityIcons
              name="arrow-u-left-top"
              size={32}
              color="#1D1852"
              style={styles.GoBack}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={openDrawer}
            style={styles.mainIconContainer}>
            <Image
              source={{
                uri: `https://amanda.capraworks.com/api/${userDetails.user_image}`,
              }}
              style={styles.profileImagee}
            />
          </TouchableOpacity>
        </View>

        <Image
          source={{
            uri: `https://amanda.capraworks.com/api/${userDetails.cover_image}`,
          }}
          style={styles.coverImage}
        />
        <View style={styles.flexContainer}>
          <View style={styles.profileImageContainer}>
          <Image
            source={{
              uri: `https://amanda.capraworks.com/api/${userDetails.user_image}`,
            }}
            style={styles.profileImage}
          />
          </View>
          <View style={styles.profileInnerText}>
            <Text style={styles.profileText}>{userDetails.username}</Text>
            <Text style={styles.profileSmallText}>{userDetails.usertitle}</Text>
          </View>
        </View>
        <View style={styles.profileInfoContainer}>
          <View style={styles.lineFlex}>
          <MaterialCommunityIcons
              name="email-outline"
              size={18}
              color="#000"
              style={styles.lineIcons}
            />
            <Text style={styles.profileMailInfo}>{userDetails.email}</Text>
          </View>
          <View style={styles.lineFlex}>
          <MaterialCommunityIcons
              name="phone-outline"
              size={18}
              color="#000"
              style={styles.lineIcons}
            />
            <Text style={styles.profileMailInfo}>{userDetails.phone_no}</Text>
          </View>
          <View style={styles.lineFlex}>
          <MaterialCommunityIcons
              name="map-marker-outline"
              size={18}
              color="#000"
              style={styles.lineIcons}
            />
            <Text style={styles.profileMailInfo}>{userDetails.address}</Text>
          </View>
        </View>
        <View style={styles.carouselContainer}>
          <Text style={styles.sectionTitle}>Connection / Followers</Text>
          <FlatList
            data={friends}
            renderItem={renderFriendItem}
            keyExtractor={item => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carouselContentContainer}
          />
        </View>
        <View style={styles.carouselContainer}>
          <Text style={styles.sectionTitle}>Suggestions</Text>
          <FlatList
            data={recommendedUsers}
            renderItem={renderRecommendedUsers}
            keyExtractor={item => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carouselContentContainer}
          />
        </View>
      </ScrollView>
    </DrawerLayoutAndroid>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  drawerContent: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 40,
    alignSelf: 'center',
  },
  mainIconContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    position: 'absolute',
    zIndex: 2,
    right: 0,
    padding: 2,
    borderRadius: 50,
    margin: 10,
    elevation: 3,
  },
  mainIconContainerr: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    position: 'absolute',
    zIndex: 2,
    left: 0,
    top: -4,
    margin: 14,
    width: 50,
    height: 50,
    
  },
  GoBack: { elevation: 5,},

  coverImage: {
    width: '100%',
    height: 220,
    resizeMode: 'cover',
  },
  flexContainer: {
    flexDirection: 'row',
    padding: 10,
  },
  profileImageContainer:{
    width: 100,
    height: 100,
    borderRadius: 50,
    elevation: 5,
    marginTop: '-10%',
    marginRight: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,

  },
  profileInnerText: {
    justifyContent: 'center',
  },
  profileText: {
    fontFamily: 'Nunito-ExtraBold',
    fontWeight: '700',
    fontSize: 22,
    color: '#1D1852',
    textTransform: 'capitalize',
  },
  profileSmallText: {
    fontFamily: 'Nunito-Regular',
    fontWeight: '600',
    fontSize: 14,
    textTransform: 'capitalize',
    color: '#93989E',
  },
  profileInfoContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  profileMailInfo: {
    fontFamily: 'Nunito-Regular',
    fontWeight: '700',
    fontSize: 14,
    color: '#1D1852',
    marginLeft: 9,
  },
  carouselContainer: {
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 20,
    color: '#1D1852',
  },
  userItem: {
    flexDirection: 'column',
    alignItems: 'left',
    marginRight: 20,
    overflow: 'hidden',
    backgroundColor: '#fff',
    padding: 10,
    paddingLeft: 20,
  },
  userImage: {
    width: 90,
    height: 90,
    resizeMode: 'cover',
    borderRadius: 12,
    marginRight: 0,
  },
  userTextContainer: {
    justifyContent: 'left',
    margin: '0%',
    padding: '0%',
  },
  userName: {
    fontFamily: 'Nunito-Bold', // Use the font family name without the file extension
    fontSize: 18,
    color: '#1D1852',
    textTransform: 'capitalize',
    paddingTop: 7,
  },
  userTitle: {
    color: '#93989E',

    fontFamily: 'Nunito-ExtraBold', // Use the font family name without the file extension
    fontSize: 14,
    fontWeight: '900',
    textTransform: 'capitalize',
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
  lineFlex: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 9,
    alignItems: 'center',
  },
  lineIcons: {
    width: 18,
    color: '#1D1852',
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
  },
  iconnavtext: {
    fontFamily: 'Nunito-Bold', // Use the font family name without the file extension
    fontSize: 18,
    color: '#1D1852',
    textTransform: 'capitalize',
  },
  profileImagee: {
    width: 40,
    height: 40,
    borderRadius: 50,
    objectFit: 'cover',
  },
});

export default MyProfileScreen;
