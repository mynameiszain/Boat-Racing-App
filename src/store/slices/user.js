import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  user: null,
};

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserData(state, action) {
      state.user = action.payload;
    },
  },
});

// Reducer
export default slice.reducer;
const actions = slice.actions;

export const setUser = data => dispatch => {
  dispatch(actions.setUserData(data));
};
