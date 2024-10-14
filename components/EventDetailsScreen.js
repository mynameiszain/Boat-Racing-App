import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { NavigationContainer } from '@react-navigation/native';
import axios from 'axios';
import { ScrollView } from 'react-native-gesture-handler';

const EventDetailsScreen = ({ route }) => {
    const navigation = useNavigation(); 
  const { event } = route.params;
  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleRequestToJoin = async (status) => {
    try {
      const response = await axios.post('https://amanda.capraworks.com/api/update_invitation_status.php', {
        invite_id: event.invite_id, // Ensure you have invite_id in event
        status: status
      });

      if (response.data.status === 'success') {
        Alert.alert('Success', 'Your request has been updated.');
      } else {
        Alert.alert('Error', response.data.message);
      }
    } catch (error) {
      console.error('Error updating invitation status:', error);
      Alert.alert('Error', 'Failed to update request.');
    }
  };

  const handleLeaveEvent = async () => {
    try {
      const response = await axios.post('https://amanda.capraworks.com/api/leave_event.php', {
        invite_id: event.invite_id // Ensure you have invite_id in event
      });

      if (response.data.status === 'success') {
        Alert.alert('Success', 'You have left the event.');
        // Optionally navigate back or update the screen
      } else {
        Alert.alert('Error', response.data.message);
      }
    } catch (error) {
      console.error('Error leaving event:', error);
      Alert.alert('Error', 'Failed to leave the event.');
    }
  };

  const handleSendInvitations = async () => {
    try {
      const response = await axios.post('https://amanda.capraworks.com/api/send_additional_invitations.php', {
        event_id: event.event_id, // Assuming event_id is available in the event object
        user_ids: [123, 456, 789] // Replace this with the actual user IDs to invite
      });

      if (response.data.status === 'success') {
        Alert.alert('Success', 'Invitations have been sent.');
      } else {
        Alert.alert('Error', response.data.message);
      }
    } catch (error) {
      console.error('Error sending invitations:', error);
      Alert.alert('Error', 'Failed to send invitations.');
    }
  };

  return (
<ScrollView style={styles.body}>
<View style={styles.container}>
                <TouchableOpacity
            style={styles.mainIconContainerr}
            onPress={handleGoBack}>
            <MaterialCommunityIcons
              name="close"
              size={32}
              color="#1D1852"
              style={styles.GoBack}
            />
          </TouchableOpacity>
      <Text style={styles.Headingtitle}>Event Details</Text>
      <Text style={styles.title}>{event.event_name}</Text>
      <Text style={styles.detailDate}>{event.event_date} | {event.event_time}</Text>

      {event.status === 'accepted' && (
        
        <View style={styles.containerCu}>
         
          <Text style={[styles.buttonbg]}>
            <Text style={styles.buttonTextbg}>
              <MaterialCommunityIcons
              name="crown"
              size={18}
              color="#fff"
              style={styles.crown}
            />{event.event_type}</Text>
          </Text>
          

          <TouchableOpacity
            style={[styles.button]}
            onPress={handleLeaveEvent}
          >
            <Text style={styles.buttonText}>Leave</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.labeldetail1}>Location:</Text>
      <Text style={styles.detail}>{event.boat_call_location}</Text>
      <Text style={styles.labeldetail}>Description: </Text>
      <Text style={styles.detail}>{event.additional_details}</Text>
      <Text style={styles.detail}>Meal Provided: {event.meal_provided}</Text>
      <Text style={styles.detail}>Attire: {event.attire_requirements}</Text>

      {event.status === 'pending' && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleRequestToJoin('accepted')}
          >
            <Text style={styles.buttonText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.declineButton]}
            onPress={() => handleRequestToJoin('declined')}
          >
            <Text style={styles.buttonText}>Decline</Text>
          </TouchableOpacity>
        </View>
      )}
      {event.status === 'accepted' && (
        <View>
         
         
          <TouchableOpacity
        style={[styles.sendInvitationButton]}
        onPress={() => navigation.navigate('UserSelectionScreen', { event })} 
        >
        <Text style={styles.sendInvitationButtonText}>
          Invite Users <MaterialCommunityIcons
              name="account-multiple-plus"
              size={24}
              color="#fff"
              style={styles.crown1}
            /></Text>
        </TouchableOpacity>
        </View>
      )}

      <Text style={styles.memberDetail}>
      <Text style={styles.labeldetail}>Member List: </Text>
      <Text style={styles.detail}>{event.accepted_members} / {event.crew_members_seeking} Members</Text>
      </Text>
      
      {/* <Text style={styles.labeldetail}>Crew Needed:</Text>
      <Text style={styles.detail}>{event.crew_members_seeking}</Text>
      <Text style={styles.detail}>Members Joined: {event.accepted_members}</Text>
      <Text style={styles.detail}>Remaining Crew: {event.remaining_crew_members}</Text>
      <Text style={styles.detail}>Status: {event.status}</Text> */}
     
  
      

    </View>
</ScrollView>
  );
};

const styles = StyleSheet.create({
  body:{
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    padding: 20,
    flex: 1,    
  },
  Headingtitle: {
    fontFamily: 'Nunito-ExtraBold',
    fontWeight: '700',
    fontSize: 24,
    marginBottom: 10,
    color: '#1D1852',
    textTransform: 'capitalize',
    textAlign: 'center',
  },
  title: {
    fontFamily: 'Nunito-ExtraBold',
    fontWeight: '900',
    fontSize: 28,
    color: '#1D1852',
    textTransform: 'capitalize',
    textAlign: 'left',
    marginTop:26,
  },
  containerCu: {
    display:'flex',
    flexDirection: 'row',
  },
  detailDate:{
    fontFamily: 'Nunito-Regular',
    fontWeight: '900',
    fontSize: 16,
    marginTop:2,
    color: '#000',
  },
  labeldetail1: {
    fontFamily: 'Nunito-ExtraBold',
    fontWeight: '700',
    fontSize: 22,
    color: '#1D1852',
    marginTop:20,
  },
  labeldetail: {
    fontFamily: 'Nunito-ExtraBold',
    fontWeight: '700',
    fontSize: 22,
    color: '#1D1852',
    marginTop:5,
  },
  detail: {
    fontFamily: 'Nunito-Regular',
    fontSize: 16,
    fontWeight: '400',
    color: '#1D1852',
    marginTop:4,
    marginBottom: 15,
  },
  memberDetail: {
    display: 'flex',
    flexDirection: 'row',
    marginTop:12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  declineButton: {
    backgroundColor: '#D9534F',
  },

  sendInvitationButton: {
    backgroundColor: '#007BFF',
    marginTop: 20,
    minHeight: 60,
  },
  button: {
    backgroundColor: '#ffffff00',
    borderWidth: 2,
    borderRadius: 8,
    borderColor: '#000000',
    alignItems: 'center',
    width: 120,
    marginTop:20,
    marginRight:12,
  },
  buttonText: {
    color: '#1D1852',
    fontSize: 16,
    fontFamily: 'Nunito-Regular',
    padding: 4,
  },
  sendInvitationButton:{
    backgroundColor: '#1D1852',
    borderWidth: 2,
    borderRadius: 8,
    borderColor: '#000000',
    alignItems: 'center',
    marginTop:20,
    marginRight:12,
  },
  sendInvitationButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Nunito-Regular',
    paddingVertical: 12,
  },
  
  buttonbg: {
    backgroundColor: '#1D1852',
    borderWidth: 2,
    borderRadius: 8,
    borderColor: '#1D1852',
    alignItems: 'center',
    width: 130,
    paddingTop:4,
    marginTop:20,
    marginRight:12,
    display: 'flex',
    textAlign: 'center',
    alignContent: 'center',
    alignItems: 'middle',
  },
  buttonTextbg: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Nunito-Regular',
    fontWeight: '400',
    textTransform: 'capitalize',
  },
  
  mainIconContainerr: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    position: 'absolute',
    zIndex: 2,
    left: 0,
    paddingLeft: 8,
    paddingTop: 6,
    borderRadius: 50,
    margin: 12,
    width: 50,
    height: 50,
  },
});

export default EventDetailsScreen;
