import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
// import { useNavigation } from '@react-navigation/native';

const SplashScreen = () => {
  // const navigation = useNavigation();

  // const handleGetStarted = () => {
  //   navigation.navigate('Login'); // Navigate to the Login screen
  // };

  return (
    <View style={styles.container}>
      <Image
        source={{uri: 'https://amanda.capraworks.com/assets/logo.png'}}
        style={styles.logo}
      />
      <Text style={styles.title}>Sailing Community</Text>
      <Text style={styles.paragraph}>
        We strive to be your trusted mate in the world of sailing. Founded by a
        passionate team of experienced sailors,{' '}
      </Text>

      {/* <TouchableOpacity style={styles.button} 
      onPress={handleGetStarted}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity> */}
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
    marginBottom: 10,
    color: '#1D1852',
  },
  paragraph: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#93989E',
  },
  logo: {
    width: 250,
    height: 250,
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#1D1852',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SplashScreen;
