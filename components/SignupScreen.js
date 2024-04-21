import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, TouchableOpacity, StyleSheet } from 'react-native';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [cnic, setCnic] = useState('');
  const [address, setAddress] = useState('');

  const handleGetStarted = () => {
    navigation.navigate('Login'); // Navigate to the Login screen
  };

  const handleSignup = () => {
    // Construct the URL
    const apiUrl = 'https://urbanshelters.capraworks.com/api/signup.php';
    const requestBody = {
      username: username,
      password: password,
      email: email,
      cnic: cnic,
      address: address,
    };

    // Perform the API call
    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle response
        if (data.success) {
          Alert.alert('Signup Successful', 'You have successfully signed up!');
          // You can navigate to another screen or perform other actions here
        } else {
          Alert.alert('Signup Failed', data.message);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        Alert.alert('Signup Failed', 'An error occurred while signing up.');
      });
  };

  return (
    <View style={styles.container}>
          <TextInput
        placeholder="Username"
        onChangeText={(text) => setUsername(text)}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry={true}
        onChangeText={(text) => setPassword(text)}
      />
      <TextInput
        placeholder="Email"
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        placeholder="CNIC"
        onChangeText={(text) => setCnic(text)}
      />
      <TextInput
        placeholder="Address"
        onChangeText={(text) => setAddress(text)}
      />
      <Button title="Signup" onPress={handleSignup} />

    <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
      <Text style={styles.buttonText}>Login</Text>
    </TouchableOpacity>
  </View>
);
};

const styles = StyleSheet.create({
container: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#fff',
},
title: {
  fontSize: 24,
  fontWeight: 'bold',
  marginBottom: 20,
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
  backgroundColor: 'blue',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 10,
},
buttonText: {
  color: '#fff',
  fontSize: 18,
  fontWeight: 'bold',
},
});

export default Signup;
