import React, { useState } from 'react';
import { View, Text, TextInput, Button, Switch, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { createEvent } from './api'; // This function will handle the API request to save the event

const CreateEventScreen = () => {
    const [eventName, setEventName] = useState('');
    const [eventType, setEventType] = useState('');
    const [eventDate, setEventDate] = useState(new Date());
    const [eventTime, setEventTime] = useState(new Date());
    const [boatCallLocation, setBoatCallLocation] = useState('');
    const [crewMembersSeeking, setCrewMembersSeeking] = useState(0);
    const [mealsProvided, setMealsProvided] = useState(false);
    const [attireRequirements, setAttireRequirements] = useState('');
    const [additionalDetails, setAdditionalDetails] = useState('');
    const [regattaPublic, setRegattaPublic] = useState(false);

    const handleCreateEvent = async () => {
        const eventData = {
            event_name: eventName,
            event_type: eventType,
            event_date: eventDate.toISOString().split('T')[0],
            event_time: eventTime.toTimeString().split(' ')[0],
            boat_call_location: boatCallLocation,
            crew_members_seeking: crewMembersSeeking,
            meals_provided: mealsProvided,
            attire_requirements: attireRequirements,
            additional_details: additionalDetails,
            regatta_public: regattaPublic
        };

        const response = await createEvent(eventData);
        if (response.success) {
            // Handle successful event creation (e.g., navigate back to the events list)
        } else {
            // Handle errors
        }
    };

    return (
        <View>
            <Text>Name of Event</Text>
            <TextInput value={eventName} onChangeText={setEventName} />

            <Text>Event Type</Text>
            <TextInput value={eventType} onChangeText={setEventType} />

            {/* <Text>Select Date</Text>
            <DateTimePicker value={eventDate} mode="date" onChange={(event, selectedDate) => setEventDate(selectedDate || eventDate)} />

            <Text>Select Time</Text>
            <DateTimePicker value={eventTime} mode="time" onChange={(event, selectedTime) => setEventTime(selectedTime || eventTime)} /> */}

            <Text>Boat Call Location</Text>
            <TextInput value={boatCallLocation} onChangeText={setBoatCallLocation} />

            <Text>Crew Members Seeking</Text>
            <TextInput value={crewMembersSeeking.toString()} onChangeText={(text) => setCrewMembersSeeking(parseInt(text))} keyboardType="numeric" />

            <Text>Meals Provided</Text>
            <Switch value={mealsProvided} onValueChange={setMealsProvided} />

            <Text>Attire Requirements</Text>
            <TextInput value={attireRequirements} onChangeText={setAttireRequirements} />

            <Text>Additional Details</Text>
            <TextInput value={additionalDetails} onChangeText={setAdditionalDetails} multiline />

            <Text>Regatta Will Be public or private</Text>
            <Switch value={regattaPublic} onValueChange={setRegattaPublic} />

            <TouchableOpacity onPress={handleCreateEvent}>
                <Text>Create Event</Text>
            </TouchableOpacity>
        </View>
    );
};

export default CreateEventScreen;
