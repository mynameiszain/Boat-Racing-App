import React, {useState, useEffect} from 'react';
import {StyleSheet, StatusBar, LogBox, Platform, AppState} from 'react-native';

import {GestureHandlerRootView} from 'react-native-gesture-handler';

import {useDispatch, useSelector} from 'react-redux';
import SplashScreen from './components/SplashScreen';
import Route from './src/route/Route';

const App = () => {
  const [loader, setLoader] = useState(false);

  LogBox.ignoreLogs(['Warning: ...']);
  LogBox.ignoreAllLogs();

  useEffect(() => {
    setTimeout(() => {
      setLoader(true);
    }, 3000);
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar backgroundColor="#282B34" barStyle="light-content" />
      {!loader ? <SplashScreen /> : <Route />}
    </GestureHandlerRootView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F222A',
  },
});
