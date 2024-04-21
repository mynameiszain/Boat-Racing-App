import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';


const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  
  const handleGetStarted = () => {
    navigation.navigate('Signup');
  };

  const handleLogin = async () => {
    try {
      const response = await fetch(`https://amanda.capraworks.com/api/login.php?login=1&email=${email}&password=${password}`);
      const data = await response.json();
      
      console.log('API Response:', data); 
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      if (data.message === "Login successful") {
        console.log('Login successful');
        
        navigation.navigate('Signup');
      } else {
        throw new Error('Login failed. Invalid email or password.');
      }
    } catch (error) {
      console.error('Error occurred while logging in:', error.message);

    }
  };
  
  

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://amanda.capraworks.com/assets/logo.png' }}
        style={styles.logo}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={text => setEmail(text)}
        value={email}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={text => setPassword(text)}
        value={password}
        secureTextEntry={true}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
        <Text style={styles.ORText}>OR</Text>
      <TouchableOpacity style={styles.buttonwithoutbackground} onPress={handleGetStarted}>
        <Text style={styles.buttonwithoutbackgroundText}>Create New Account</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  logo:{
    width: 120,
    height:120,
    marginBottom: 25,
  },
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
    color: '#1D1852',
  },
  input: {
    width: '80%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 20,
    paddingLeft: 10,
    color: '#93989E',
  },
  button: {
    width: '80%',
    height: 50,
    backgroundColor: '#1D1852',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonwithoutbackground:{
    width: '80%',
    height: 50,    
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  ORText:{
    color: '#93989E',
    fontSize: 18,
    marginTop: 10,
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
});

export default LoginScreen;