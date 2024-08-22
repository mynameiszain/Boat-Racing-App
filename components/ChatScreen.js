import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { getMessages, sendMessage } from './api';
import Icon from 'react-native-vector-icons/FontAwesome';

import { DrawerActions } from '@react-navigation/native';

const ChatScreen = ({ route, navigation }) => {
  const handleGoBack = () => {
    navigation.goBack();
  };
  const { senderId, receiverId, receiverName } = route.params || {};

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  const fetchMessages = async () => {
    try {
      const data = await getMessages(senderId, receiverId);
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(() => {
      fetchMessages();
    }, 5000);

    return () => clearInterval(interval);
  }, [senderId, receiverId]);

  const handleSend = async () => {
    try {
      if (!senderId || !receiverId || !message) {
        throw new Error('Missing parameters');
      }

      await sendMessage(senderId, receiverId, message);
      setMessage('');
      fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error.message || error);
    }
  };

  const renderItem = ({ item }) => {
    const isSentByCurrentUser = Number(item.sender_id) === Number(senderId);

    return (
      <View
        style={[
          styles.messageContainer,
          isSentByCurrentUser ? styles.sentMessageContainer : styles.receivedMessageContainer
        ]}
      >
        <View style={[
          styles.messageBox,
          isSentByCurrentUser ? styles.sentMessageBox : styles.receivedMessageBox
        ]}>
          <Text style={[styles.messageitem]}>{item.message}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
          <View style={styles.headerContainer}>
          <TouchableOpacity style={styles.mainIconContainerr} onPress={handleGoBack}>
            <Icon name="chevron-left" size={24} color="#fff" style={styles.GoBack} />        
          </TouchableOpacity>

          <TouchableOpacity style={styles.headText} onPress={handleGoBack}>

            <Text style={styles.headTexti}>{receiverName}</Text>        
          </TouchableOpacity>
          </View>


      <FlatList
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.messagesList}
      />
      <View style={styles.parent}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Type your message"
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Image
            source={{ uri: `https://cdn-icons-png.flaticon.com/512/5909/5909056.png` }}
            style={styles.sendButtonT}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between',    
    backgroundColor: '#fff',
  },
  headerContainer: {
    marginBottom: 80,
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
  },  headText:{
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
    textTransform: 'capitalize',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 10,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  receiverName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    textTransform: 'capitalize',
  },
  messagesList: {
    flexGrow: 1,
  },
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 5,
  },
  sentMessageContainer: {
    alignSelf: 'flex-end',
    
  },
  receivedMessageContainer: {
    alignSelf: 'flex-start',
  },
  messageBox: {
    padding: 10,
    borderRadius: 10,
    maxWidth: '70%',
  },
  messageitem: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  parent: {
   flexDirection: 'row',
   alignItems: 'center',
   justifyContent: 'space-between',
   maxWidth: '100%',
   height: 42,
   
  
  },
  input: {
  
    padding: 10,
    color: '#1D1852',
    borderRadius: 4,
    height: 42,
    
  },
  sendButton: {
    // backgroundColor: '#1D1852',
    // justifyContent: 'center',
    // alignItems: 'center',
    // borderRadius: 4,

  },
  sendButtonT: {
  // color:'#fff',
  // fontWeight: 'bold',
  // fontSize: 16,
  // textAlign: 'center', 
  // padding: 12,
  // borderRadius: 4,
  width: 36,
  height: 36,
  },
});

export default ChatScreen;
