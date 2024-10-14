import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Image, FlatList, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';

const CreateGroupScreen = () => {
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [groupImage, setGroupImage] = useState(null);
  const [userGroups, setUserGroups] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  // Fetch user ID from AsyncStorage
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          setUserId(user.id);
        } else {
          Alert.alert('Error', 'Unable to retrieve user data.');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch user data.');
      }
    };

    fetchUserId();
  }, []);

  // Fetch user groups
  useEffect(() => {
    const fetchUserGroups = async () => {
      if (userId) {
        try {
          setLoading(true);
          const response = await axios.get(`https://amanda.capraworks.com/api/get_user_groups.php?user_id=${userId}`);
          console.log('API Response:', response.data);
  
          if (response.data.success) {
            setUserGroups(response.data.groups);
          } else {
            console.log('API Error:', response.data.message);
            Alert.alert('Error', response.data.message || 'Unable to fetch groups.');
          }
        } catch (error) {
          console.error('API Request Error:', error);
          Alert.alert('Error', 'Failed to load groups. Please try again.');
        } finally {
          setLoading(false);
        }
      }
    };
  
    fetchUserGroups();
  }, [userId]);

  // Handle group creation
// Handle group creation
const handleCreateGroup = async () => {
  // Check if all required fields are provided
  if (!userId || !groupName || !groupDescription) {
    Alert.alert('Error', 'Please provide all required details.');
    return;
  }

  // Create FormData for sending group details and image to the API
  const formData = new FormData();
  formData.append('group_name', groupName); // Group name
  formData.append('group_description', groupDescription); // Group description
  formData.append('admin_id', userId); // Admin ID (from AsyncStorage)

  // Check if groupImage is selected and append to FormData
  if (groupImage) {
    formData.append('image', { // Changed 'group_image' to 'image'
      uri: groupImage.uri,
      type: groupImage.type,
      name: groupImage.fileName,
    });
  }

  // API call to create the group
  try {
    setLoading(true);
    
    const response = await axios.post('https://amanda.capraworks.com/api/create_group.php', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Handle response from API
    if (response.data.success) {
      Alert.alert('Success', 'Group created successfully!');
      navigation.navigate('AddUsersScreen', { groupId: response.data.group_id }); // Navigate to add users screen
    } else {
      Alert.alert('Error', response.data.message);
    }
  } catch (error) {
    Alert.alert('Error', 'Failed to create group. Please try again.');
  } finally {
    setLoading(false);
  }
};


  // Handle image selection
  const selectImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        Alert.alert('Error', response.errorMessage);
      } else if (response.assets) {
        setGroupImage(response.assets[0]);
      }
    });
  };

  // Handle group item press
  const handleGroupPress = (group) => {
    navigation.navigate('GroupChatScreen', { groupId: group.id, groupName: group.name });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Create New Group</Text>

      <TextInput
        style={styles.input}
        value={groupName}
        onChangeText={setGroupName}
        placeholder="Enter group name"
        placeholderTextColor="#999"
      />

      <TextInput
        style={styles.input}
        value={groupDescription}
        onChangeText={setGroupDescription}
        placeholder="Enter group description"
        placeholderTextColor="#999"
      />

      <TouchableOpacity style={styles.imagePicker} onPress={selectImage}>
        <Text style={styles.imagePickerText}>Select Group Image</Text>
      </TouchableOpacity>

      {groupImage && <Image source={{ uri: groupImage.uri }} style={styles.imagePreview} />}

      <TouchableOpacity style={styles.createButton} onPress={handleCreateGroup}>
        <Text style={styles.createButtonText}>Create Group</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#007AFF" />}

      <Text style={styles.subTitle}>Your Groups</Text>
      {userGroups.length === 0 && !loading ? (
        <Text style={styles.noGroupsText}>No groups available</Text>
      ) : (
        <FlatList
          data={userGroups}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.groupItem} onPress={() => handleGroupPress(item)}>
              {item.image_url ? (
                <Image source={{ uri: `https://amanda.capraworks.com/api/${item.image_url}` }} style={styles.groupImage} />
              ) : (
                <View style={styles.groupImagePlaceholder} />
              )}
              <Text style={styles.groupName}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  imagePicker: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  imagePickerText: {
    color: '#fff',
    textAlign: 'center',
  },
  imagePreview: {
    width: 100,
    height: 100,
    marginTop: 10,
    borderRadius: 8,
  },
  createButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 20,
  },
  createButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#000',
  },
  noGroupsText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
  },
  groupItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 7,
    marginBottom: 7,
  },
  groupImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  groupImagePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e0e0e0',
    marginRight: 10,
  },
  groupName: {
    fontSize: 16,
    color: '#333',
  },
});

export default CreateGroupScreen;
