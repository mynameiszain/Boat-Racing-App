import {
    configureStore,
    applyMiddleware,
    compose,
    getDefaultMiddleware,
  } from '@reduxjs/toolkit';
  import thunk from 'redux-thunk';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import {persistStore, persistReducer} from 'redux-persist';
  
  import {rootReducer} from './rootReducer';
  
  const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ['auth'],
  };
  
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  
  const persistedReducer = persistReducer(persistConfig, rootReducer);
  
  const STORE = configureStore({
    reducer: persistedReducer,
    devTools: composeEnhancers(applyMiddleware(thunk)),
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({
        serializableCheck: false,
      }).concat(thunk),
  });
  
  const PERSISTOR = persistStore(STORE);
  
  export {STORE, PERSISTOR};
  