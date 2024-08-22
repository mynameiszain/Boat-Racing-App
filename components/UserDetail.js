import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, DrawerLayoutAndroid, ActivityIndicator, FlatList, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DrawerActions } from '@react-navigation/native';

const UserDetailScreen = ({ route, navigation }) => {
  const handleGoBack = () => {
    navigation.goBack();
  };
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [userDetail, setUserDetail] = useState(null);
  
  const [recommendedUsers, setRecommendedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRequestSent, setIsRequestSent] = useState(false);
  const [isRequestAccepted, setIsRequestAccepted] = useState(false);
  const [areFriends, setAreFriends] = useState(false); // New state for friend status

  const drawer = React.useRef(null);

  const openDrawer = () => {
    drawer.current.openDrawer();
  };

  const closeDrawer = () => {
    drawer.current.closeDrawer();
  };

  const { userId } = route.params;

  useEffect(() => {
    const fetchLoggedInUserId = async () => {
      try {
        const user = await AsyncStorage.getItem('user');
        if (user) {
          const parsedUser = JSON.parse(user);
          setLoggedInUserId(parsedUser.id);
        }
      } catch (error) {
        console.error('Error retrieving logged-in user ID:', error);
      }
    };

    const checkRequestStatus = async () => {
      if (!loggedInUserId || !userId) return;

      try {
        const response = await fetch(`https://amanda.capraworks.com/api/check_friend_request_status.php?sender_id=${loggedInUserId}&receiver_id=${userId}`);
        const data = await response.json();
        if (data.accepted) {
          setIsRequestAccepted(true);
          setIsRequestSent(true);
          setAreFriends(true); // Both are friends
        } else {
          setIsRequestAccepted(false);
          setAreFriends(false);
        }
      } catch (error) {
        console.error('Error checking request status:', error.message);
      }
    };

    const checkIfRequestSent = async () => {
      if (!loggedInUserId || !userId) return;

      try {
        const response = await fetch(`https://amanda.capraworks.com/api/get_outgoing_requests.php?sender_id=${loggedInUserId}&receiver_id=${userId}`);
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setIsRequestSent(true);
        } else {
          setIsRequestSent(false);
        }
      } catch (error) {
        console.error('Error checking outgoing requests:', error.message);
      }
    };

    const fetchUserDetail = async () => {
      try {
        const response = await fetch(`https://amanda.capraworks.com/api/userDetail.php?user_id=${userId}`);
        const text = await response.text();
        console.log('Received response text for user detail:', text);
        try {
          const data = JSON.parse(text);
          console.log('Parsed user detail data:', data);
          if (data && data.user) {
            setUserDetail(data.user);
          } else {
            console.warn('Unexpected data format:', data);
            setError('Unexpected data format');
          }
        } catch (jsonError) {
          console.error('JSON Parse error:', jsonError);
          setError('Failed to parse JSON response');
        }
      } catch (error) {
        console.error('Error fetching user detail:', error.message);
        setError('Failed to load user details');
      }
    };

    const fetchRecommendedUsers = async () => {
      try {
        const response = await fetch(`https://amanda.capraworks.com/api/recomendedUsers.php?user_id=${userId}`);
        const data = await response.json();
        if (data && data.users && Array.isArray(data.users)) {
          setRecommendedUsers(data.users);
        } else {
          console.warn('Unexpected data format:', data);
        }
      } catch (error) {
        console.error('Error fetching recommended users:', error.message);
        setError('Failed to load recommended users');
      } finally {
        setLoading(false);
      }
    };

    fetchLoggedInUserId().then(() => {
      checkIfRequestSent();
      checkRequestStatus();
    });
    fetchUserDetail();
    fetchRecommendedUsers();
  }, [userId, loggedInUserId]);

  const sendRequest = async () => {
    if (!loggedInUserId || !userDetail?.id) {
      Alert.alert('Error', 'Unable to retrieve user information.');
      return;
    }

    try {
      const response = await fetch(`https://amanda.capraworks.com/api/send_friend_request.php?sender_id=${loggedInUserId}&receiver_id=${userDetail.id}`);
      const text = await response.text();
      try {
        const data = JSON.parse(text);
        if (data.message) {
          Alert.alert('Success', data.message);
          setIsRequestSent(true);
        } else {
          Alert.alert('Error', 'Failed to send request');
        }
      } catch (jsonError) {
        console.error('JSON Parse error:', jsonError);
        Alert.alert('Error', 'Failed to parse JSON response');
      }
    } catch (error) {
      console.error('Error sending request:', error.message);
      Alert.alert('Error', 'Failed to send request');
    }
  };

  const renderRecommendedUsers = ({ item }) => (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() => navigation.navigate('UserDetail', { userId: item.id })}
    >
      <Image
        source={{ uri: `https://amanda.capraworks.com/api/${item.user_image}` }}
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

  if (!userDetail) {
    return (
      <View style={styles.errorContainer}>
        <Text>No user details available</Text>
      </View>
    );
  }

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('userEmail');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };

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

        <TouchableOpacity onPress={() => navigation.navigate('MyProfileScreen', { userId: userDetail?.id })} style={styles.iconnav}>
          <Icon name="user" size={18} color="#000" style={styles.iconnavin} />
          <Text style={styles.iconnavtext}>My Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('ChatsListScreen', { userId: userDetail?.id })} style={styles.iconnav}>
          <Icon name="wechat" size={18} color="#000" style={styles.iconnavin} />
          <Text style={styles.iconnavtext}>Chats</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('FriendRequestsScreen', { userId: userDetail?.id })} style={styles.iconnav}>
          <Icon name="user-plus" size={18} color="#000" style={styles.iconnavin} />
          <Text style={styles.iconnavtext}>Manage Friend Request</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('ProfileScreen', { userId: userDetail?.id })} style={styles.iconnav}>
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
    <ScrollView>
       <View style={styles.headerContainer}>

        <TouchableOpacity style={styles.mainIconContainerr} onPress={handleGoBack}>
          <Icon name="chevron-left" size={24} color="#fff" style={styles.GoBack} />        
        </TouchableOpacity>

        <TouchableOpacity onPress={openDrawer} style={styles.mainIconContainer}>
          <Image
          source={{ uri: `https://icons.iconarchive.com/icons/dtafalonso/android-lollipop/512/Settings-icon.png` }}
          style={styles.profileImagee}
        />
          </TouchableOpacity>
        </View>


      <Image
        source={{ uri: `https://amanda.capraworks.com/api/${userDetail.cover_image}` }}
        style={styles.coverImage}
      />
      <View style={styles.container}>
        <View style={styles.innerfContainer}>
          <Image
            source={{ uri: `https://amanda.capraworks.com/api/${userDetail.user_image}` }}
            style={styles.profileImage}
          />
          <Text style={styles.userNameMain}>{userDetail.username}</Text>
          <Text style={styles.userTitleMain}>{userDetail.usertitle}</Text>

          {!areFriends && (
            <TouchableOpacity
              style={styles.friendreqbutton}
              onPress={sendRequest}
              disabled={isRequestAccepted || isRequestSent}
            >
              {isRequestAccepted || isRequestSent ? (
                <Icon name="check" size={18} color="#fff" style={styles.friendreqIcon} />
              ) : (
                <Icon name="user-plus" size={18} color="#fff" style={styles.friendreqIcon} />
              )}
              <Text style={styles.friendreqText}>
                {isRequestAccepted
                  ? 'Friends'
                  : isRequestSent
                  ? 'Friend Request Sent'
                  : 'Send Friend Request'}
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.chatbutton}
            onPress={() => {
              navigation.navigate('ChatScreen', { 
                senderId: loggedInUserId, 
                receiverId: userDetail.id,
                receiverImage: userDetail.user_image, // Pass the receiver image
                receiverName: userDetail.username // Pass the receiver name
              });
            }}
          >
            <Icon name="wechat" size={18} color="#1D1852" style={styles.friendreqIcon} />
            <Text style={styles.friendreqText}>Chat</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.lineFlex}>
          <Icon name="envelope" size={18} color="#000" style={styles.lineIcons} />
          <Text style={styles.userEmail}>{userDetail.email}</Text>
        </View>

        <View style={styles.lineFlex}>
          <Icon name="phone" size={18} color="#000" style={styles.lineIcons} />
          <Text style={styles.userPhone}>{userDetail.phone_no}</Text>
        </View>
        <View style={styles.lineFlex}>
          <Icon name="map-marker" size={18} color="#000" style={styles.lineIcons} />
          <Text style={styles.userAddress}>{userDetail.address}</Text>
        </View>
      </View>
      <View style={styles.carouselContainer}>
        <Text style={styles.sectionTitle}>Suggestions</Text>
        <FlatList
          data={recommendedUsers}
          renderItem={renderRecommendedUsers}
          keyExtractor={(item) => item.id.toString()}
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
    marginTop: '-20%',
    padding: 20,
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
    alignSelf:'center',
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
    margin:10,
  },  
  mainIconContainerr: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    position: 'absolute',
    zIndex: 2,
    left: 0,
    padding: 12,
    borderRadius: 50,
    margin:14,
    width:50,
    height:50,
    backgroundColor: '#1D1852',
    shadowOpacity: 0,
    shadowColor: '#ffffff00',
  },  
  GoBack: {
  },
  iconnav: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 10,
    maxHeight: 32,
    alignItems: 'center',
  },
  iconnavin: {
    width:26,
  },
  
  iconnavtext: {
    fontFamily: 'Nunito-Bold', // Use the font family name without the file extension
    fontSize: 18,
    color:'#1D1852',
    textTransform: 'capitalize',
  },
  profileImagee: {
    width:40,
    height:40,
    borderRadius: 50,
    objectFit: 'cover',
  },
  innerfContainer: {
    alignSelf: 'center',
    width: '100%',
    alignItems: 'center', // Center items horizontally
    marginBottom: 20,
    margin: 0,
    padding:0,
    marginTop: '-20%',
  },
  coverImage: {
    width: '100%',
    height: 250,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignSelf: 'center',
    marginBottom: 7,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
  },  
  lineFlex: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'bottom', 
    marginBottom: 10,
  },
  lineIcons: {
    width:26,
  },
  userTitleMain: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    fontWeight: '400',
    fontFamily: 'Nunito-Bold',
  },
  userTitle: {
    fontSize: 18,
    textAlign: 'center',
    color: '#666',
  },
  userEmail: {
    fontSize: 16,
    color: '#1D1852',
  },
  userPhone: {
    fontSize: 16,
    color: '#1D1852',
  },
  userAddress: {
    fontSize: 16,
    color: '#1D1852',
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
  carouselContainer: {
    paddingVertical: 20,
    backgroundColor: '#fff',
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
    justifyContent: 'center',
    margin: 0,
    padding: 0,
  },  
  userNameMain: {
    fontFamily: 'Nunito-Bold',
    fontSize: 20,
    fontWeight: '900',
    color: '#1D1852',
    textTransform: 'capitalize',
    paddingTop: 0,
  },
  userName: {
    fontFamily: 'Nunito-Bold',
    fontSize: 18,
    color: '#1D1852',
    textTransform: 'capitalize',
    paddingTop: 7,
  },
  userTitle: {
    color: '#93989E',
    fontFamily: 'Nunito-ExtraBold',
    fontSize: 14,
    fontWeight: '900',
    textTransform: 'capitalize',
  },
  friendreqbutton: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 7,
    backgroundColor: '#1D1852',
  },
  chatbutton: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 7,
    paddingHorizontal: 22,
    borderWidth: 1,
    borderRadius:4,
    backgroundColor: '#000',
    marginTop: 12,
  },
  friendreqIcon: {
    paddingRight: 5,
    color: '#fff',
    fontSize: 18,
  },
  friendreqText: {
    textTransform: 'capitalize',
    color: '#fff',
    fontSize: 14,
  },
});

export default UserDetailScreen;
