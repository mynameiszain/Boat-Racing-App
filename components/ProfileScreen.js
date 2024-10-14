import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  TouchableOpacity,
  DrawerLayoutAndroid,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {DrawerActions} from '@react-navigation/native';
import {useDispatch} from 'react-redux';

const ProfileScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const handleGoBack = () => {
    navigation.goBack();
  };
  const [userDetails, setUserDetails] = useState(null);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cnic, setCnic] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [usertitle, setUsertitle] = useState('');
  const [userImage, setUserImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);

  const drawer = React.useRef(null);

  const openDrawer = () => {
    drawer.current.openDrawer();
  };

  const closeDrawer = () => {
    drawer.current.closeDrawer();
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await AsyncStorage.getItem('user');
        if (user !== null) {
          const parsedUser = JSON.parse(user);
          setUser(parsedUser);
          setUsername(parsedUser.username);
          setEmail(parsedUser.email);
          setCnic(parsedUser.cnic);
          setAddress(parsedUser.address);
          setPhoneNo(parsedUser.phone_no);
          setUsertitle(parsedUser.usertitle);
          setUserImage(
            parsedUser.user_image
              ? `https://amanda.capraworks.com/api/${parsedUser.user_image}`
              : null,
          ); // Full URL
          setCoverImage(
            parsedUser.cover_image
              ? `https://amanda.capraworks.com/api/${parsedUser.cover_image}`
              : null,
          ); // Full URL
        }
      } catch (e) {
        console.error('Error retrieving user data:', e.message);
      }
    };

    fetchUser();
  }, []);

  const handleImagePick = type => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 1,
      },
      response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorMessage) {
          console.log('ImagePicker Error: ', response.errorMessage);
        } else {
          const uri = response.assets[0].uri;
          if (type === 'userImage') {
            setUserImage(uri);
          } else if (type === 'coverImage') {
            setCoverImage(uri);
          }
        }
      },
    );
  };

  const handleSubmit = async () => {
    try {
      const user_id = user.id;
      const formData = new FormData();
      formData.append('user_id', user_id);
      formData.append('username', username);
      formData.append('email', email);
      formData.append('password', password); // Ensure you handle password securely
      formData.append('cnic', cnic);
      formData.append('address', address);
      formData.append('phone_no', phoneNo);
      formData.append('usertitle', usertitle);

      if (userImage) {
        const userImageName = userImage.split('/').pop(); // Extract file name
        formData.append('userImage', {
          uri: userImage,
          type: 'image/jpeg',
          name: userImageName,
        });
      }

      if (coverImage) {
        const coverImageName = coverImage.split('/').pop(); // Extract file name
        formData.append('coverImage', {
          uri: coverImage,
          type: 'image/jpeg',
          name: coverImageName,
        });
      }

      const response = await fetch(
        'https://amanda.capraworks.com/api/user.php',
        {
          method: 'POST',
          body: formData,
        },
      );

      const result = await response.json();
      Alert.alert('Profile Update', result.message);
    } catch (e) {
      console.error('Error submitting form:', e.message);
    }
  };

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
      <ScrollView>
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
            <Text style={styles.headTexti}>Edit Profile</Text>
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

        <View style={styles.container}>
          {userImage && (
            <Image source={{uri: userImage}} style={styles.image} />
          )}

          <Text
            onPress={() => handleImagePick('userImage')}
            style={styles.buttonPick}>
            <Text style={styles.buttonPickText}>Pick User Image</Text>
          </Text>

          {coverImage && (
            <Image source={{uri: coverImage}} style={styles.image} />
          )}

          <Text
            onPress={() => handleImagePick('coverImage')}
            style={styles.buttonPick}>
            <Text style={styles.buttonPickText}>Pick Cover Image</Text>
          </Text>

          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            placeholder="Username"
          />
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
          />
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            value={cnic}
            onChangeText={setCnic}
            placeholder="CNIC"
          />
          <TextInput
            style={styles.input}
            value={address}
            onChangeText={setAddress}
            placeholder="Address"
          />
          <TextInput
            style={styles.input}
            value={phoneNo}
            onChangeText={setPhoneNo}
            placeholder="Phone No"
          />
          <TextInput
            style={styles.input}
            value={usertitle}
            onChangeText={setUsertitle}
            placeholder="User Title"
          />

          <Text onPress={handleSubmit} style={styles.buttonPick}>
            <Text style={styles.buttonPickText}>Update Profile</Text>
          </Text>
        </View>
      </ScrollView>
    </DrawerLayoutAndroid>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    marginTop: 80,
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
  input: {
    height: 40,
    borderColor: 'gray',
    borderBottomWidth: 1,
    marginBottom: 16,
  },
  image: {
    width: 130,
    height: 130,
    marginVertical: 10,
    objectFit: 'cover',
    borderRadius: 7,
  },
  // imageButton: {
  //   backgroundColor:'#1D1852',
  //   color:'#fff',
  // },
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
  buttonPick: {
    backgroundColor: '#1D1852',
    padding: 10,
    borderRadius: 4,
    maxWidth: 130,
    marginBottom: 14,
  },
  buttonPickText: {
    color: '#fff',
  },
});

export default ProfileScreen;
