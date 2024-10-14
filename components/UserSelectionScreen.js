import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

const UserSelectionScreen = ({ navigation, route }) => {
    const { event } = route.params; // Event details passed from the previous screen
    const [users, setUsers] = useState([]); // Holds the list of users fetched from the API
    const [selectedUsers, setSelectedUsers] = useState([]); // Holds the IDs of selected users
  
    useEffect(() => {
      // Fetch users to display
      const fetchUsers = async () => {
        try {
          // Post the event_id to fetch users that have not been invited
          const response = await axios.post('https://your-api-url.com/api/get_users_selection.php', {
            event_id: event.event_id,
          });
  
          if (response.data.status === 'success') {
            setUsers(response.data.users); // Set the users to state once fetched
          } else {
            Alert.alert('Error', response.data.message); // Show error message if API call fails
          }
        } catch (error) {
          console.error('Error fetching users:', error);
          Alert.alert('Error', 'Failed to fetch users.'); // Error handling
        }
      };
  
      fetchUsers(); // Trigger the fetch on component mount
    }, [event.event_id]); // Re-run the effect if event_id changes
  
    const toggleSelectUser = (userId) => {
      // Add or remove user from the selectedUsers array
      if (selectedUsers.includes(userId)) {
        setSelectedUsers(selectedUsers.filter((id) => id !== userId)); // Unselect user
      } else {
        setSelectedUsers([...selectedUsers, userId]); // Select user
      }
    };
  
    const handleSendInvitations = async () => {
      if (selectedUsers.length === 0) {
        Alert.alert('Error', 'Please select at least one user.');
        return;
      }
  
      try {
        // Send selected users to the API
        const response = await axios.post('https://amanda.capraworks.com/api/send_additional_invitations.php', {
          event_id: event.event_id,
          user_ids: selectedUsers,
        });
  
        if (response.data.status === 'success') {
          Alert.alert('Success', 'Invitations have been sent.');
          navigation.goBack(); // Go back after invitations are sent
        } else {
          Alert.alert('Error', response.data.message);
        }
      } catch (error) {
        console.error('Error sending invitations:', error);
        Alert.alert('Error', 'Failed to send invitations.');
      }
    };
  
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Select Users to Invite</Text>
        {/* Show list of users */}
        <FlatList
          data={users} // Use the users state to display list of users
          keyExtractor={(item) => item.id.toString()} // Ensure keyExtractor uses a unique key (item.id)
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.userItem,
                selectedUsers.includes(item.id) && styles.selectedUserItem, // Highlight selected users
              ]}
              onPress={() => toggleSelectUser(item.id)} // Toggle selection on press
            >
              <Text style={styles.userText}>{item.username}</Text> {/* Display username */}
            </TouchableOpacity>
          )}
        />
  
        {/* Button to send invitations */}
        <TouchableOpacity
          style={[styles.button, styles.sendButton]}
          onPress={handleSendInvitations}
        >
          <Text style={styles.buttonText}>Send Invitations</Text>
        </TouchableOpacity>
      </View>
    );
  };
  

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  userItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  selectedUserItem: {
    backgroundColor: '#d3d3d3',
  },
  userText: {
    fontSize: 18,
  },
  button: {
    backgroundColor: '#1D1852',
    padding: 15,
    borderRadius: 7,
    alignItems: 'center',
    marginTop: 20,
  },
  sendButton: {
    backgroundColor: '#007BFF',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default UserSelectionScreen;
