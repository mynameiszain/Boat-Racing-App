import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, Alert, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker'; // Correct import
import Icon from 'react-native-vector-icons/FontAwesome';

const Signup = ({ navigation }) => {
  const handleGoBack = () => {
    navigation.goBack();
  };
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [cnic, setCnic] = useState('');
  const [address, setAddress] = useState('');
  const [phone_no, setPhoneNo] = useState('');
  const [userImage, setUserImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [usertitle, setUsertitle] = useState('');

  const handleGetStarted = () => {
    navigation.navigate('Login'); 
  };

  const handleSignup = () => {
    console.log('Signing up...');
  
    if (!username || !password || !email || !cnic || !address || !phone_no || !usertitle) {
      Alert.alert('Required Fields', 'Please fill in all required fields.');
      return;
    }
  
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    formData.append('email', email);
    formData.append('cnic', cnic);
    formData.append('address', address);
    formData.append('phone_no', phone_no);
    formData.append('usertitle', usertitle);
  
    // Append images only if they are selected
    if (userImage) {
      formData.append('userImage', {
        uri: userImage.uri,
        type: userImage.type,
        name: userImage.fileName || 'userImage.jpg',
      });
    }
  
    if (coverImage) {
      formData.append('coverImage', {
        uri: coverImage.uri,
        type: coverImage.type,
        name: coverImage.fileName || 'coverImage.jpg',
      });
    }
  
    fetch('https://amanda.capraworks.com/api/signup.php', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('API response:', data);
        if (data.message === 'User registered successfully') {
          Alert.alert('Signup Successful', 'You have successfully signed up!', [
            {
              text: 'OK',
              onPress: () => {
                // Navigate to the login screen
                navigation.navigate('Login');
              },
            },
          ]);
        } else {
          Alert.alert('Signup Failed', data.message);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        Alert.alert('Signup Failed', 'An error occurred while signing up.');
      });
  };

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const pickImage = (imageType) => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };
  
    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        if (imageType === 'userImage') {
          setUserImage(response.assets[0]);
        } else if (imageType === 'coverImage') {
          setCoverImage(response.assets[0]);
        }
      }
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>

      <View style={styles.headerContainer}>

      <TouchableOpacity style={styles.mainIconContainerr} onPress={handleGoBack}>
        <Icon name="chevron-left" size={24} color="#fff" style={styles.GoBack} />        
      </TouchableOpacity>

      <TouchableOpacity style={styles.headText} onPress={handleGoBack}>
       <Text style={styles.headTexti}>Get Register</Text>        
      </TouchableOpacity>

      </View>

      {step === 1 && (
        <View>
          <TextInput
            placeholder="Username"
            onChangeText={(text) => setUsername(text)}
            value={username}
            style={styles.input}
          />
          <TextInput
            placeholder="Email"
            onChangeText={(text) => setEmail(text)}
            value={email}
            style={styles.input}
          />
          <TextInput
            placeholder="Phone Number"
            onChangeText={(text) => setPhoneNo(text)}
            value={phone_no}
            style={styles.input}
          />
          <TextInput
            placeholder="Address"
            onChangeText={(text) => setAddress(text)}
            value={address}
            style={styles.input}
          />
          <TextInput
            placeholder="CNIC"
            onChangeText={(text) => setCnic(text)}
            value={cnic}
            style={styles.input}
          />
          <TextInput
            placeholder="Password"
            secureTextEntry={true}
            onChangeText={(text) => setPassword(text)}
            value={password}
            style={styles.input}
          />
          

          <TouchableOpacity style={styles.button} onPress={handleNextStep}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {step === 2 && (
        <View style={styles.container1}>
          <TextInput
            placeholder="User Title"
            onChangeText={(text) => setUsertitle(text)}
            value={usertitle}
            style={styles.input}
          />
          {userImage && (
            <Image
              source={{ uri: userImage.uri }}
              style={styles.image}
            />
          )}
          <TouchableOpacity style={styles.buttonPI} onPress={() => pickImage('userImage')}>
            <Text style={styles.buttonTextPI}>Pick User Image</Text>
          </TouchableOpacity>
          {coverImage && (
            <Image
              source={{ uri: coverImage.uri }}
              style={styles.image}
            />
          )}
          <TouchableOpacity style={styles.buttonPI} onPress={() => pickImage('coverImage')}>
            <Text style={styles.buttonTextPI}>Pick Cover Image</Text>
          </TouchableOpacity>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.buttontwo]} onPress={handlePrevStep}>
              <Text style={styles.smallbuttonText}>Previous</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.buttontwo]} onPress={handleSignup}>
              <Text style={styles.smallbuttonText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 20,
    paddingBottom: 30,
  },
  headerContainer: {
    marginBottom: 100,
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
  },  
  heading1: {
    color: '#1D1852',
    fontSize: 24,
    fontWeight: 'bold',
    margin: 25,
  },
  input: {
    maxWidth: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 20,
    paddingLeft: 10,
  },
  button: {
    minWidth: '80%',
    height: 50,
    backgroundColor: '#1D1852',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonPI: {
    minWidth: '80%',
    height: 50,
    borderWidth: 2,
    borderColor:'#1D1852',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonTextPI: {
    color: '#1D1852',
    fontSize: 18,
    fontWeight: 'bold',
    
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  buttontwo: {
    minWidth: '40%',
    height: 50,
    backgroundColor: '#1D1852',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  smallbuttonText: {
    color: '#fff',
  },
  container1: {
    maxWidth: '80%',
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
    marginBottom: 20,
  },  
  headText:{
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
  },
});

export default Signup;
