import {createSlice} from '@reduxjs/toolkit';

//intial state
const homeInit = {
  name: '',
  email: '',
  class_id: '',
  class_name: '',
  role: '',
  student_id: '',
  year: "",
  student_uid: '',
};

// User slice
export const homeSlice = createSlice({
  name: 'home',
  initialState: homeInit,
  reducers: {
    // Set onboarding data
    setCred: (state, action) => {
      const userData = action.payload; // Data retrieved from the backend
      state.name = userData.name;
      state.email = userData.email;
      state.class_id = userData.class_id;
      state.class_name = userData.class_name;
      state.role = userData.role;
      state.student_id = userData.student_id;
      state.year = userData.year;
      state.student_uid = userData.student_uid;
    },
    updateCred: (state, action) => {
      const userData = action.payload; // Data retrieved from the backend
      state.name = userData.name;
      state.email = userData.email;
      state.class_id = userData.class_id;
      state.class_name = userData.class_name;
      state.role = userData.role;
      state.student_id = userData.student_id;
      state.year = userData.year;
      state.student_uid = userData.student_uid;
    },
  },
});

// Actions
export const {setCred, updateCred} = homeSlice.actions;

// Reducer
export default homeSlice.reducer;
