import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

// Separate styles for each route
const FirstRoute = () => (
  <View style={[styles.container, styles.firstRoute]}>
    <Text style={styles.firstRouteText}>
      <View style={styles.innerEventCont}>
        <Text style={styles.innerEventContt}>
          Regattas 01
        </Text>
        <Text style={styles.innerEventConttt}>
          20- May | 03:00 pm
        </Text>
        <Text style={styles.innerEventConttttt}>
          Owner
        </Text>
      </View>
    </Text>
  </View>
);

const SecondRoute = () => (
  <View style={[styles.container, styles.secondRoute]}>
    <Text style={styles.secondRouteText}>No Invites Yet</Text>
  </View>
);

const TabsNavigator = () => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: 'Upcoming Events' },
    { key: 'second', title: 'Invites' },
  ]);

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{ height: '0' }}
      style={{ 
        backgroundColor: '#ffffff00',
        shadowColor: '#ffffff00',
        }}
      renderLabel={({ route, focused, color }) => (
        <Text
          style={[
            styles.tabBarLabel,
            route.key === 'first' && styles.firstTabLabel,
            route.key === 'second' && styles.secondTabLabel,
            { 
              backgroundColor: focused ? '#1D1852' : '#fff',
              color: focused ? '#fff' : '#000',
              padding:16,
              width: 150,
              textAlign:'center',
              margin:0,
              borderRadius: 7,
             }
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
      initialLayout={{ width: 360 }} // Adjust according to your screen size
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
  },
  firstRoute: {
    backgroundColor: '#fff',
  },
  secondRoute: {
    backgroundColor: '#fff',
  },
  innerEventCont: {
    backgroundColor: '#FBFBFB',
    borderRadius:7,
    padding: 20, // Add padding here
  },
  innerEventContt: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A2433',
    minWidth:200,
  },
  innerEventConttt: {
    fontSize: 18,
    color: '#333',
    marginVertical: 5,
  },
  innerEventContttt: {
    fontSize: 16,
    color: '#333',
  },
  firstRouteText: {
    color: 'black', // Styling specific to text in the first route
    fontSize: 18,
  },
  secondRouteText: {
    color: 'black', // Styling specific to text in the second route
    fontSize: 18,
  },
});

// Exporting the component as default
export default TabsNavigator;
