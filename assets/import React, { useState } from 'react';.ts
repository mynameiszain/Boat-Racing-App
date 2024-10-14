import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Image, Picker} from 'react-native';

const Signup = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [cnic, setCnic] = useState('');
  const [address, setAddress] = useState('');

  const [phoneNo, setPhoneNo] = useState('');
  const [userImage, setUserImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [userTitle, setUserTitle] = useState('Mr.'); // Default title

  const handleGetStarted = () => {
    navigation.navigate('Login'); // Navigate to the Login screen
  };

  const handleSignup = () => {
    console.log('Signing up...');

    // Check if any required fields are empty
    if (!username || !password || !email || !cnic || !address || !phoneNo || !userImage || !coverImage || !userTitle) {
      Alert.alert('Required Fields', 'Please fill in all required fields.');
      return;
    }

    // Construct the URL with query parameters
    const apiUrl = `https://amanda.capraworks.com/api/signup.php?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&email=${encodeURIComponent(email)}&cnic=${encodeURIComponent(cnic)}&address=${encodeURIComponent(address)}&phoneNo=${encodeURIComponent(phoneNo)}&userImage=${encodeURIComponent(userImage)}&coverImage=${encodeURIComponent(coverImage)}&userTitle=${encodeURIComponent(userTitle)}`;

    // Make the API call
    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('API response:', data);
        if (data.success) {
          Alert.alert('Signup Successful', 'You have successfully signed up!');
          // Navigate to another screen or perform other actions here
        } else {
          Alert.alert('Signup Failed', data.message);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        Alert.alert('Signup Failed', 'An error occurred while signing up.');
      });
  };

  const handleUserImageSelect = () => {
    // Implement user image selection/upload logic here
    // For example, using react-native-image-picker library
  };

  const handleCoverImageSelect = () => {
    // Implement cover image selection/upload logic here
    // For example, using react-native-image-picker library
  };


  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
            
      <Text style={styles.heading1}>Create a New Account</Text>

      <TextInput
        placeholder="Username"
        onChangeText={(text) => setUsername(text)}
        value={username}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry={true}
        onChangeText={(text) => setPassword(text)}
        value={password}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        onChangeText={(text) => setEmail(text)}
        value={email}
        style={styles.input}
      />
      <TextInput
        placeholder="CNIC"
        onChangeText={(text) => setCnic(text)}
        value={cnic}
        style={styles.input}
      />
      <TextInput
        placeholder="Address"
        onChangeText={(text) => setAddress(text)}
        value={address}
        style={styles.input}
      />
      <TextInput
        placeholder="Phone Number"
        onChangeText={(text) => setPhoneNo(text)}
        value={phoneNo}
        style={styles.input}
      />
      {/* User Image */}
      <TouchableOpacity onPress={handleUserImageSelect}>
        {userImage ? (
          <Image source={{ uri: userImage }} style={styles.image} />
        ) : (
          <Text>Select User Image</Text>
        )}
      </TouchableOpacity>

      {/* Cover Image */}
      <TouchableOpacity onPress={handleCoverImageSelect}>
        {coverImage ? (
          <Image source={{ uri: coverImage }} style={styles.image} />
        ) : (
          <Text>Select Cover Image</Text>
        )}
      </TouchableOpacity>
    
      
      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonwithoutbackground} onPress={handleGetStarted}>
        <Text style={styles.buttonwithoutbackgroundText}>Already have an account</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },  
  heading1: {
    color: '#1D1852',
    fontSize: 24,
    fontWeight: 'bold',
    margin: 25,
  },
  input: {
    width: '80%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 20,
    paddingLeft: 10,
  },
  button: {
    width: '80%',
    height: 50,
    backgroundColor: '#1D1852',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonwithoutbackgroundText: {
    color: '#1D1852',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonwithoutbackground: {
    width: '80%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
});

export default Signup;
