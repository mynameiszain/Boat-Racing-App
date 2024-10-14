import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, FlatList, Dimensions, TextInput } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

// First tab route content for Upcoming Events
const FirstRoute = ({ userId }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation(); // Access navigation

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.post('https://amanda.capraworks.com/api/upcoming_events.php', { user_id: userId });
        console.log('API response:', response.data); // Log the API response

        // Check if invitations exist in the response and filter based on status
        const acceptedInvitations = response.data.invitations ? response.data.invitations.filter(event => event.status === 'accepted') : [];
        setEvents(acceptedInvitations);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [userId]);

  const renderEventItem = ({ item }) => (
    <TouchableOpacity
      style={styles.innerEventCont}
      onPress={() => navigation.navigate('EventDetailsScreen', { event: item })} // Pass event data to EventDetails
    >
      <Text style={styles.innerEventContt}>{item.event_name || 'Event Name'}</Text>
      <Text style={styles.innerEventConttt}>{item.event_date || 'Event Date'} | {item.event_time || 'Event Time'}</Text>
      <Text style={styles.innerEventConttt}>
      <MaterialCommunityIcons
              name="crown"
              size={18}
              color="#1D1852"
              style={styles.crown}
            /> {item.event_type || 'Owner'}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, styles.firstRoute]}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        events.length > 0 ? (
          <FlatList
            data={events}
            keyExtractor={(item) => item.event_id?.toString() || Math.random().toString()}
            renderItem={renderEventItem}
          />
        ) : (
          <Text style={styles.firstRouteText}>No Upcoming Events</Text>
        )
      )}
    </View>
  );
};

// Second tab route content for Invites
const SecondRoute = ({ userId }) => {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!userId) {
      console.error('User ID is not available');
      setLoading(false);
      return;
    }

    const fetchInvitations = async () => {
      try {
        const response = await axios.post('https://amanda.capraworks.com/api/event_invitations.php', { user_id: userId });
        console.log('API response:', response.data); // Log the API response
        setInvitations(response.data.invitations || []); // Access 'invitations' from the response
      } catch (error) {
        console.error('Error fetching invitations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvitations();
  }, [userId]);

  const renderInvitationItem = ({ item }) => (
    <TouchableOpacity
      style={styles.innerEventCont}
      onPress={() => navigation.navigate('EventDetailsScreen', { event: item })} // Pass event data to EventDetails
    >
      <Text style={styles.innerEventContt}>{item.event_name || 'Event Name'}</Text>
      <Text style={styles.innerEventConttt}>{item.event_date || 'Event Date'} | {item.event_time || 'Event Time'}</Text>
      <Text style={styles.innerEventConttt}>
      <MaterialCommunityIcons
              name="crown"
              size={18}
              color="#1D1852"
              style={styles.crown}
            /> {item.event_type || 'Owner'}</Text>
    </TouchableOpacity>
  );

  const filteredInvitations = invitations.filter(invitation => 
    invitation.event_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={[styles.container, styles.secondRoute]}>
      <View style={styles.SearchParent}>
        <MaterialCommunityIcons
                name="cloud-search"
                size={18}
                color="#1D1852"
                style={styles.crown}
              />
        <TextInput
          style={styles.searchInput}
          placeholder="Search invites..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        filteredInvitations.length > 0 ? (
          <FlatList
            data={filteredInvitations}
            keyExtractor={(item) => item.event_id.toString()}
            renderItem={renderInvitationItem}
          />
        ) : (
          <Text style={styles.secondRouteText}>No Invites Yet</Text>
        )
      )}
    </View>
  );
};

// TabsNavigator component
const TabsNavigator = ({ userId }) => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'first', title: 'Upcoming Events' },
    { key: 'second', title: 'Invites' },
  ]);

  const renderScene = SceneMap({
    first: () => <FirstRoute userId={userId} />,
    second: () => <SecondRoute userId={userId} />,
  });

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{ height: 0 }} // Hides the indicator line
      style={styles.tabBar}
      renderLabel={({ route, focused }) => (
        <Text
          style={[
            styles.tabBarLabel,
            {
              backgroundColor: focused ? '#1D1852' : '#fff',
              color: focused ? '#fff' : '#000',
              fontFamily: focused ? 'Nunito-Regular' : 'Nunito-Regular',
              fontWeight: focused ? '500': '900',
              fontSize:16,
              paddingVertical: 16,
              width: 150,
              padding:7,
              textAlign: 'center',
              borderRadius: 7,
              fontFamily: 'Nunito-Regular',
              fontWeight: '700',
              elevation: 0, // Removes shadow on Android
              shadowOpacity: 0, // Removes shadow on iOS
            },
          ]}
        >
          {route.title}
        </Text>
      )}
    />
  );

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      renderTabBar={renderTabBar}
      initialLayout={{ width: Dimensions.get('window').width }} // Dynamically set the layout width
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 7,
  },
  firstRoute: {
    backgroundColor: '#fff',
  },
  secondRoute: {
    backgroundColor: '#fff',
  },
  innerEventCont: {
    backgroundColor: '#f2f2f2',
    borderRadius: 7,
    padding: 20,
  },
  innerEventContt: {
    color: '#1D1852',
    fontFamily: 'Nunito-Regular',
    fontWeight: '800',
    fontSize: 22,
  },
  innerEventConttt: {
    fontFamily: 'Nunito-Regular',
    fontWeight: '500',
    fontSize: 18,
    color: '#000',
    marginVertical: 2,
  },
  tabBar: {
    backgroundColor: '#fff',
    elevation: 0,
  },
  tabBarLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  SearchParent: {
    width:'100%',
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#f2f2f2',
    justifyContent: 'flex-start',
    alignContent: 'center',
    alignItems: 'center',
    paddingHorizontal:18,
    marginBottom:20,
    borderRadius: 7,
  },
  searchInput:{
    fontFamily: 'Nunito-Regular',
    fontWeight: '500',
    fontSize: 16,
    paddingLeft: 12,
  },
});

export default TabsNavigator;
