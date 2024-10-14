import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { useRoute, useNavigation } from '@react-navigation/native';

const CreateEventScreen = () => {
  const [eventName, setEventName] = useState('');
  const [eventType, setEventType] = useState('');
  const [boatCallLocation, setBoatCallLocation] = useState('');
  const [crewMembersSeeking, setCrewMembersSeeking] = useState('');
  const [mealProvided, setMealProvided] = useState('');
  const [attireRequirements, setAttireRequirements] = useState('');
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [eventDate, setEventDate] = useState(''); // New state for event date
  const [eventTime, setEventTime] = useState(''); // New state for event time
  const [isPublic, setIsPublic] = useState(false); // Public or private event

  const navigation = useNavigation();
  const route = useRoute();
  const { groupId, adminId, members } = route.params; // Fetching passed members and admin

  // Validate form fields before event creation
  const validateFields = () => {
    if (!eventName.trim()) {
      Alert.alert('Error', 'Event Name is required');
      return false;
    }
    if (!eventType.trim()) {
      Alert.alert('Error', 'Event Type is required');
      return false;
    }
    if (!boatCallLocation.trim()) {
      Alert.alert('Error', 'Boat Call Location is required');
      return false;
    }
    if (!crewMembersSeeking.trim()) {
      Alert.alert('Error', 'Crew Members Seeking is required');
      return false;
    }
    if (!eventDate.trim()) {
      Alert.alert('Error', 'Event Date is required');
      return false;
    }
    if (!eventTime.trim()) {
      Alert.alert('Error', 'Event Time is required');
      return false;
    }
    return true;
  };

  // Handle creating event and notifying members
  const handleCreateEvent = async () => {
    if (!validateFields()) {
      return;
    }
  
    const filteredMembers = members.filter(member => member.id !== adminId);
  
    try {
      console.log('Sending request with data:', {
        group_id: groupId,
        admin_id: adminId,
        event_name: eventName,
        event_type: eventType,
        boat_call_location: boatCallLocation,
        crew_members_seeking: crewMembersSeeking,
        meal_provided: mealProvided,
        attire_requirements: attireRequirements,
        event_date: eventDate,
        event_time: eventTime,
        additional_details: additionalDetails,
        regatta_public: isPublic ? 'Public' : 'Private',
        members: filteredMembers
      });
  
      const response = await axios.post('https://amanda.capraworks.com/api/create_event.php', {
        group_id: groupId,
        admin_id: adminId,
        event_name: eventName,
        event_type: eventType,
        boat_call_location: boatCallLocation,
        crew_members_seeking: crewMembersSeeking,
        meal_provided: mealProvided,
        attire_requirements: attireRequirements,
        event_date: eventDate,
        event_time: eventTime,
        additional_details: additionalDetails,
        regatta_public: isPublic ? 'Public' : 'Private',
        members: filteredMembers
      });
  
      if (response.data.status === 'success') {
        Alert.alert('Success', 'Event created successfully!');
        navigation.goBack();
      } else {
        Alert.alert('Error', response.data.message || 'Failed to create event');
      }
    } catch (error) {
      console.error('Error creating event:', error.response ? error.response.data : error.message);
      Alert.alert('Error', error.response ? error.response.data.message : 'Failed to create event');
    }
  };
  
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Name of Event</Text>
      <TextInput 
        style={styles.input} 
        value={eventName} 
        onChangeText={setEventName} 
        placeholder="Event Name" 
      />

      <Text style={styles.label}>Event Type</Text>
      <TextInput 
        style={styles.input} 
        value={eventType} 
        onChangeText={setEventType} 
        placeholder="Event Typee" 
      />

      <Text style={styles.label}>Boat Call Location</Text>
      <TextInput 
        style={styles.input} 
        value={boatCallLocation} 
        onChangeText={setBoatCallLocation} 
        placeholder="Boat Call Location" 
      />

      <Text style={styles.label}>Crew Members Seeking Other than Group Member</Text>
      <TextInput 
        style={styles.input} 
        value={crewMembersSeeking} 
        onChangeText={setCrewMembersSeeking} 
        placeholder="Crew Members Seeking" 
      />

      <Text style={styles.label}>Meal Provided (Yes or No)</Text>
      <TextInput 
        style={styles.input} 
        value={mealProvided} 
        onChangeText={setMealProvided} 
        placeholder="Meal Provided" 
      />

      <Text style={styles.label}>Attire Requirement</Text>
      <TextInput 
        style={styles.input} 
        value={attireRequirements} 
        onChangeText={setAttireRequirements} 
        placeholder="Attire Requirement" 
      />

      <Text style={styles.label}>Additional Details</Text>
      <TextInput 
        style={styles.input} 
        value={additionalDetails} 
        onChangeText={setAdditionalDetails} 
        placeholder="Additional Details" 
      />

      <Text style={styles.label}>Event Date (YYYY-MM-DD)</Text>
      <TextInput 
        style={styles.input} 
        value={eventDate} 
        onChangeText={setEventDate} 
        placeholder="Event Date" 
      />

      <Text style={styles.label}>Event Time (HH:MM)</Text>
      <TextInput 
        style={styles.input} 
        value={eventTime} 
        onChangeText={setEventTime} 
        placeholder="Event Time" 
      />

      <Text style={styles.label}>Regatta will be (Public or Private)</Text>
      <TextInput 
        style={styles.input} 
        value={isPublic ? 'Public' : 'Private'} 
        onChangeText={(value) => setIsPublic(value.toLowerCase() === 'public')} 
        placeholder="Public or Private" 
      />

      <TouchableOpacity style={styles.createButton} onPress={handleCreateEvent}>
        <Text style={styles.createButtonText}>Create Event</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginVertical: 8,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  createButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default CreateEventScreen;
