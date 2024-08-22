import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Image, Alert } from 'react-native';
import { getGroupMessages, sendGroupMessage, addMemberToGroup } from './apii';

const GroupChatScreen = ({ route }) => {
  const { groupId, userId, groupName, groupImage } = route.params || {};

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [newMemberId, setNewMemberId] = useState('');

  const fetchMessages = async () => {
    try {
      const data = await getGroupMessages(groupId);
      setMessages(data);
    } catch (error) {
      console.error('Error fetching group messages:', error);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(() => {
      fetchMessages();
    }, 5000); // Adjust interval as needed

    return () => clearInterval(interval);
  }, [groupId]);

  const handleSend = async () => {
    try {
      if (!groupId || !userId || !message) {
        throw new Error('Missing parameters');
      }

      await sendGroupMessage(groupId, userId, message);
      setMessage('');
      fetchMessages();
    } catch (error) {
      console.error('Error sending group message:', error.message || error);
    }
  };

  const handleAddMember = async () => {
    try {
      if (!groupId || !newMemberId) {
        throw new Error('Missing parameters');
      }

      const response = await addMemberToGroup(groupId, newMemberId);
      Alert.alert('Success', response);
      setNewMemberId('');
      // Optionally, update the UI or refresh the group members list
    } catch (error) {
      console.error('Error adding member:', error.message || error);
    }
  };

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.messageContainer,
        item.sender_id === userId ? styles.sentMessageContainer : styles.receivedMessageContainer
      ]}
    >
      <View
        style={[
          styles.messageBox,
          item.sender_id === userId ? styles.sentMessageBox : styles.receivedMessageBox
        ]}
      >
        <Text style={styles.messageText}>{item.message}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: `https://your-server-url.com/${groupImage}` }}
          style={styles.groupImage}
        />
        <Text style={styles.groupName}>{groupName}</Text>
      </View>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.messagesList}
      />
      <TextInput
        style={styles.input}
        value={message}
        onChangeText={setMessage}
        placeholder="Type your message"
      />
      <Button title="Send" onPress={handleSend} />
      <View style={styles.addMemberContainer}>
        <TextInput
          style={styles.input}
          value={newMemberId}
          onChangeText={setNewMemberId}
          placeholder="Enter user ID to add"
        />
        <Button title="Add Member" onPress={handleAddMember} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 10,
  },
  groupImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  groupName: {
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
  sentMessageBox: {
    backgroundColor: '#dcf8c6',
  },
  receivedMessageBox: {
    backgroundColor: '#ffffff',
  },
  messageText: {
    fontSize: 16,
    color: '#000',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
  },
  addMemberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
});

export default GroupChatScreen;
