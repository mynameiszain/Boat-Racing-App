import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  DrawerLayoutAndroid,
  ScrollView,
  Button,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {DrawerActions} from '@react-navigation/native';
import {setUser} from '../src/store/slices/user';
import {useDispatch} from 'react-redux';

const FriendRequestScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const handleGoBack = () => {
    navigation.goBack();
  };
  const [userDetails, setUserDetails] = useState(null);
  const [friendRequests, setFriendRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  // const receiverId = 29;
  const [receiverId, setReceiverId] = useState(null);

  const drawer = React.useRef(null);

  const openDrawer = () => {
    drawer.current.openDrawer();
  };

  const closeDrawer = () => {
    drawer.current.closeDrawer();
  };

  const fetchReceiverId = async () => {
    try {
      const user = await AsyncStorage.getItem('user');
      if (user) {
        const parsedUser = JSON.parse(user);
        setReceiverId(parsedUser.id);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to retrieve user information.');
    }
  };

  // Fetch Friend Requests
  const fetchFriendRequests = async () => {
    try {
      if (receiverId) {
        const response = await fetch(
          `https://amanda.capraworks.com/api/accept_friend_request.php?receiver_id=${receiverId}`,
        );
        const data = await response.json();
        setFriendRequests(data);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch friend requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReceiverId();
  }, []);

  // Handle Accept/Reject Action
  const handleAction = async (requestId, action) => {
    try {
      const formData = new FormData();
      formData.append('request_id', requestId);
      formData.append('action', action);

      const response = await fetch(
        'https://amanda.capraworks.com/api/accept_friend_request.php',
        {
          method: 'POST',
          body: formData,
        },
      );
      const result = await response.json();

      if (response.ok) {
        Alert.alert('Success', result.message);
        // Remove the processed request from the list
        setFriendRequests(prevRequests =>
          prevRequests.filter(request => request.id !== requestId),
        );
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to process the request.');
    }
  };

  useEffect(() => {
    fetchFriendRequests();
  }, [receiverId]);

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

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
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
              source={{uri: 'https://amanda.capraworks.com/assets/logo.png'}}
              style={styles.logo}
            />
          </View>

          <TouchableOpacity
            onPress={() =>
              navigation.navigate('MyProfileScreen', {userId: userDetails?.id})
            }
            style={styles.iconnav}>
            <Icon name="user" size={18} color="#000" style={styles.iconnavin} />
            <Text style={styles.iconnavtext}>My Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              navigation.navigate('ChatsListScreen', {userId: userDetails?.id})
            }
            style={styles.iconnav}>
            <Icon
              name="wechat"
              size={18}
              color="#000"
              style={styles.iconnavin}
            />
            <Text style={styles.iconnavtext}>Chats</Text>
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

          <TouchableOpacity
            onPress={() =>
              navigation.navigate('ProfileScreen', {userId: userDetails?.id})
            }
            style={styles.iconnav}>
            <Icon name="edit" size={18} color="#000" style={styles.iconnavin} />
            <Text style={styles.iconnavtext}>Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleLogout} style={styles.iconnav}>
            <Icon
              name="power-off"
              size={18}
              color="#000"
              style={styles.iconnavin}
            />
            <Text style={styles.iconnavtext}>Log Out</Text>
          </TouchableOpacity>
        </View>
      )}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.mainIconContainerr}
            onPress={handleGoBack}>
            <Icon
              name="chevron-left"
              size={24}
              color="#fff"
              style={styles.GoBack}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.headText} onPress={handleGoBack}>
            <Text style={styles.headTexti}>Friend Request</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={openDrawer}
            style={styles.mainIconContainer}>
            <Image
              source={{
                uri: `https://icons.iconarchive.com/icons/dtafalonso/android-lollipop/512/Settings-icon.png`,
              }}
              style={styles.profileImagee}
            />
          </TouchableOpacity>
        </View>

        <View style={{flex: 1, padding: 16, marginTop: 100}}>
          <Text style={{fontSize: 24, marginBottom: 16, color: '#1D1852'}}>
            Friend Requests
          </Text>
          <FlatList
            data={friendRequests}
            keyExtractor={item => item.id.toString()}
            renderItem={({item}) => (
              <View
                style={{
                  marginBottom: 16,
                  padding: 16,
                  backgroundColor: '#f9f9f9',
                  borderRadius: 8,
                }}>
                <Text
                  style={{
                    fontSize: 18,
                    textTransform: 'capitalize',
                    color: '#1D1852',
                  }}>
                  {item.sender_name}
                </Text>
                <View style={{flexDirection: 'row', marginTop: 8}}>
                  <Button
                    title="Accept"
                    onPress={() => handleAction(item.id, 'accept')}
                    color="#1D1852"
                  />
                  <View style={{width: 10, backgroundColor: 'white'}} />
                  <Button
                    title="Reject"
                    onPress={() => handleAction(item.id, 'reject')}
                    style={styles.reject}
                    color="red"
                  />
                </View>
              </View>
            )}
            ListEmptyComponent={
              <Text style={{color: '#1D1852'}}>No friend requests found.</Text>
            }
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
  headText: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    position: 'absolute',
    zIndex: 2,
    minWidth: '100%',
    marginTop: 23,
    left: 0,
    right: 0,
  },
  headTexti: {
    color: '#1D1852',
    fontSize: 24,
    alignSelf: 'center',
    fontWeight: 'bold',
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
    margin: 14,
    width: 50,
    height: 50,
    backgroundColor: '#1D1852',
    shadowOpacity: 0,
    shadowColor: '#ffffff00',
  },
  GoBack: {},
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
  accept: {
    backgroundColor: '#1D1852',
    color: '#fff',
  },
  reject: {},
});

export default FriendRequestScreen;
