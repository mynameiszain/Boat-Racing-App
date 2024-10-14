import React, { useState, useEffect, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, TextInput, Button, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, ScrollView, Keyboard } from 'react-native';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GroupChatScreen = () => {
  const navigation = useNavigation();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false); // State for dropdown visibility
  const [members, setMembers] = useState([]);
  const route = useRoute();
  const { groupId, groupName } = route.params; // Extract groupName from route.params
  

  // Fetch user ID from AsyncStorage
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          setUserId(user.id);
        } else {
          console.log('Unable to retrieve user data.');
        }
      } catch (error) {
        console.log('Failed to fetch user data.');
      }
    };

    fetchUserId();
  }, []);


  const handleCreateEvent = () => {
    // Navigate to CreateEventScreen and pass group members and admin
    if (userId && members.length > 0) {
      // Navigate to CreateEventScreen and pass group members and admin
      navigation.navigate('CreateEventScreen', {
        groupId,
        adminId: userId,
        members, // Ensure this contains all members including the admin
      });
    } else {
      console.log('Admin ID or members are not available.');
    }
  };

  // Fetch messages for the group
  const fetchMessages = useCallback(async () => {
    if (groupId) {
      try {
        setLoading(true);
        const response = await axios.get('https://amanda.capraworks.com/api/get_group_messages.php', {
          params: {
            group_id: groupId,
          }
        });

        // Log the complete response for debugging
        console.log('Response:', response.data);

        if (response.data.status === 'success') {
          setMessages(response.data.messages);
        } else {
          console.log('Error fetching messages:', response.data.message || 'Unknown error');
        }
      } catch (error) {
        console.log('Error fetching messages:', error.message || error);
      } finally {
        setLoading(false);
      }
    }
  }, [groupId]);

  // Fetch group members
  const fetchMembers = useCallback(async () => {
    if (groupId) {
      try {
        setLoading(true);
        const response = await axios.get('https://amanda.capraworks.com/api/get_group_members.php', {
          params: {
            group_id: groupId,
          }
        });

        // Log the complete response for debugging
        console.log('Members Response:', response.data);

        if (response.data.success) {
          setMembers(response.data.members);
        } else {
          console.log('Error fetching members:', response.data.message || 'Unknown error');
        }
      } catch (error) {
        console.log('Error fetching members:', error.message || error);
      } finally {
        setLoading(false);
      }
    }
  }, [groupId]);

  useEffect(() => {
    fetchMessages();
    fetchMembers();
  }, [fetchMessages, fetchMembers]);

  // Handle sending a new message
  const handleSendMessage = async () => {
    if (!newMessage.trim()) {
      return;
    }

    if (!userId) {
      console.log('User ID is not available.');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('https://amanda.capraworks.com/api/send_group_message.php', {
        sender_id: userId,
        group_id: groupId,
        message: newMessage,
      });

      if (response.data.status === 'success') {
        setNewMessage('');
        fetchMessages();
        Keyboard.dismiss();
      } else {
        console.log('Error sending message:', response.data.message);
      }
    } catch (error) {
      console.log('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle dropdown visibility
  const toggleDropdown = () => {
    setDropdownVisible(prevState => !prevState);
  };

  // Dropdown menu component
  const DropdownMenu = () => {
    if (!dropdownVisible) return null;

    return (
      <View style={styles.dropdownMenu}>
        <TouchableOpacity onPress={handleCreateEvent} style={styles.dropdownItem}>
          <Text>Create Event</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Display the group name and dropdown menu */}
      <View style={styles.header}>
        <Text style={styles.groupName}>{groupName}</Text>
        <TouchableOpacity onPress={toggleDropdown} style={styles.dropdownButton}>
          <Text style={styles.dropdownButtonText}>⋮</Text>
        </TouchableOpacity>
        <DropdownMenu />
      </View>

      {/* Group Members */}
      <View style={styles.membersContainer}>
        <Text style={styles.headingmemberName}>Group Members:</Text>
        {members.map(member => (
          <Text key={member.id} style={styles.memberName}>{member.username},</Text>
        ))}
      </View>

      {/* Messages */}
      <ScrollView contentContainerStyle={styles.messagesContainer}>
        {loading && <ActivityIndicator size="large" color="#007AFF" />}
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.messageItem}>
              <Text style={styles.messageUser}>{item.username}</Text>
              <Text style={styles.messageText}>{item.message}</Text>
            </View>
          )}
        />
      </ScrollView>

      {/* Input for sending a message */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    overflow: 'visible', // Ensure overflow is visible for dropdown
  },
  header: {
    padding: 10,
    backgroundColor: '#e9e9e9',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 1, // Ensure header has a lower zIndex than the dropdown
  },
  dropdownMenu: {
    position: 'absolute',
    right: 10,
    top: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 5,
    zIndex: 1000, // Higher zIndex to ensure it displays on top
    overflow: 'visible', // Allow dropdown to overflow the bounds of the container
  },
  groupName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1D1852',
  },
  dropdownButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 8,
  },
  dropdownButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  membersContainer: {
    padding: 10,
    backgroundColor: '#e9e9e9',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  headingmemberName: {
    fontWeight: 'bold',
    color: '#1D1852',
    marginRight: 12,
  },
  memberName: {
    fontSize: 12,
    textTransform: 'capitalize',
    marginBottom: 5,
    color: '#000',
    paddingHorizontal: 2,
    fontWeight: 'bold',
  },
  messagesContainer: {
    flexGrow: 1,
    padding: 20,
  },
  messageItem: {
    marginBottom: 10,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
  },
  messageUser: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    borderColor: '#333',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 8,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default GroupChatScreen;
