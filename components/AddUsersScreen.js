import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

const AddUsersToGroupScreen = ({ route, navigation }) => {
  const { groupId } = route.params; // Access the groupId parameter
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://amanda.capraworks.com/api/get_users.php');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const toggleSelectUser = (userId) => {
    setSelectedUsers((prev) => 
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const handleAddUsers = async () => {
    if (selectedUsers.length === 0) {
      Alert.alert('Warning', 'No users selected');
      return;
    }
  
    try {
      const response = await axios.post('https://amanda.capraworks.com/api/add_users_to_group.php', {
        group_id: groupId,
        user_ids: selectedUsers,
      });
  
      if (response.data.success) {
        Alert.alert('Success', response.data.message);
        navigation.goBack(); // Navigate back to the previous screen
      } else {
        Alert.alert('Error', response.data.message);
      }
    } catch (error) {
      console.error('Error adding users to group:', error);
      Alert.alert('Error', 'An error occurred while adding users. Please try again.');
    }
  };
  
  
  
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Users to Add to Group</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => toggleSelectUser(item.id)} style={styles.userItem}>
            <Text>{item.username}</Text>
            {selectedUsers.includes(item.id) && <Text>✓</Text>}
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity onPress={handleAddUsers} style={styles.button}>
        <Text style={styles.buttonText}>Add Selected Users</Text>
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
    fontSize: 18,
    marginBottom: 10,
  },
  userItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
  },
});

export default AddUsersToGroupScreen;
