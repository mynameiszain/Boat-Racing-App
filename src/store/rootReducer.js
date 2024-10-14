import {combineReducers} from 'redux';
import userReducer from './slices/user';

const rootReducer = combineReducers({
  auth: userReducer,
});

export {rootReducer};
