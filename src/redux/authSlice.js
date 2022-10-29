import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  name: {},
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    updateUser(state, action) {
      state.name = action.payload;
    },
    clearUser() {
      return initialState;
    },
  },
});

export const {updateUser, clearUser} = authSlice.actions;

export default authSlice.reducer;
