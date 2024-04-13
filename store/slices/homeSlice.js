import {createSlice} from '@reduxjs/toolkit';

//intial state
const homeInit = {
  username: '',
  password: '',
  firstName: '',
  middleName: '',
  lastName: '',
  email: '',
  phone: '',
  class: '',
  roleNumber: '',
  loggedIn: false,
  dept: '',
  course: '',
};

// User slice
export const homeSlice = createSlice({
  name: 'home',
  initialState: homeInit,
  reducers: {
    // Set onboarding data
    setCred: (state, action) => {
      const userData = action.payload; // Data retrieved from the backend
      state.password = userData.password;
      state.firstName = userData.firstName;
      state.middleName = userData.middleName;
      state.lastName = userData.lastName;
      state.email = userData.email;
      state.phone = userData.phone;
      state.userRole = userData.userRole;
      state.class = userData.class;
      state.roleNumber = userData.roleNumber;
      state.loggedIn = action.payload.loggedIn;
      state.dept = action.payload.dept;
      state.course = action.payload.course;
    },
    updateCred: (state, action) => {
      state.firstName = action.payload.firstName;
      state.middleName = action.payload.middleName;
      state.lastName = action.payload.lastName;
      state.email = action.payload.email;
      state.phone = action.payload.phone;
      state.userRole = action.payload.userData;
      state.class = action.payload.class;
      state.roleNumber = action.payload.roleNumber;
      state.loggedIn = action.payload.loggedIn;
    },
  },
});

// Actions
export const {setCred, updateCred} = homeSlice.actions;

// Reducer
export default homeSlice.reducer;
