import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, DrawerLayoutAndroid, ScrollView, TextInput, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getChatList } from './apiii'; // Ensure this path is correct

import { DrawerActions } from '@react-navigation/native';

const ChatListScreen = ({ navigation }) => {
  const handleGoBack = () => {
    navigation.goBack();
  };
  const [chats, setChats] = useState([]);
  const [userDetails, setUserDetails] = useState(null);
  const [filteredChats, setFilteredChats] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
    
  const drawer = React.useRef(null);

  const openDrawer = () => {
    drawer.current.openDrawer();
  };

  const closeDrawer = () => {
    drawer.current.closeDrawer();
  };

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const data = await getChatList();
        if (data.status === 'success') {
          setChats(data.chats);
          setFilteredChats(data.chats); // Initialize filteredChats
        } else {
          console.error('Failed to fetch chat list:', data.message);
        }
      } catch (error) {
        console.error('Error fetching chat list:', error);
      }
    };

    fetchChats();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      const filtered = chats.filter(chat =>
        chat.user1_name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredChats(filtered);
    } else {
      setFilteredChats(chats); // Reset to full list if search query is empty
    }
  };

  const handleChatPress = (chat) => {
    navigation.navigate('ChatScreen', {
      senderId: chat.chat_start,
      receiverId: chat.chat_end,
      receiverName: chat.user1_name, // Adjust based on your needs
      receiverImage: '' // Add logic to fetch or pass receiver image URL if available
    });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.chatItem} onPress={() => handleChatPress(item)}>
      <View style={styles.chatContent}>
      <Icon name="user-circle" size={32} color="#1D1852" style={styles.iconnavin} />
        <Text style={styles.chatName}>{item.user1_name || 'Unknown User'}</Text>
      </View>
    </TouchableOpacity>
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
    <View style={styles.container}>

      <TouchableOpacity style={styles.mainIconContainerr} onPress={handleGoBack}>
        <Icon name="chevron-left" size={24} color="#fff" style={styles.GoBack} />        
      </TouchableOpacity>

      <TouchableOpacity style={styles.headText} onPress={handleGoBack}>
       <Text style={styles.headTexti}>Messages</Text>        
      </TouchableOpacity>

      <TouchableOpacity onPress={openDrawer} style={styles.mainIconContainer}>
        <Image
          source={{ uri: `https://icons.iconarchive.com/icons/dtafalonso/android-lollipop/512/Settings-icon.png` }}
          style={styles.profileImagee}
        />
      </TouchableOpacity>
    

<View style={styles.flexSearch}>
<Icon name="search" size={18} color="#C5C5C5" style={styles.iconsearch} />
  <TextInput
  style={styles.searchInput}
  placeholder="Search chats..."
  value={searchQuery}
  onChangeText={handleSearch}
  />      
</View>

<FlatList
data={filteredChats}
keyExtractor={(item) => `${item.chat_start}-${item.chat_end}`}
renderItem={renderItem}
/>
</View>
    </ScrollView>
    </DrawerLayoutAndroid>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  drawerContent: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  chatItem: {
    padding: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#FBFBFB',
  },
  chatContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImagee: {
    width:40,
    height:40,
    borderRadius: 50,
    objectFit: 'cover',
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
    marginTop: 15,
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
  headText:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    position: 'absolute',
    zIndex: 2,
    minWidth: '100%',
    marginTop: 23,
    left: 0,
    right:0,
  },
  headTexti:{
    color: '#1D1852',
    fontSize: 24,
    alignSelf: 'center',
    fontWeight: 'bold',
  },
  chatName: {
    fontSize: 16,
    textTransform: 'capitalize',
    color: '#000',
  },
  iconnavin: {
    marginRight:12,
  },
  searchInput: {
    color:'#C5C5C5',
    marginLeft:7,
  },
  flexSearch: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#FBFBFB',
    paddingHorizontal:18,
    borderRadius:7,
    marginTop:100,
    marginBottom:20,
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
});

export default ChatListScreen;
