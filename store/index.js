// redux toolkit will be implemented here
// Libs
import {configureStore} from '@reduxjs/toolkit';

// Slices
import homeReducer from './slices/homeSlice';

// App store
export const store = configureStore({
  reducer: {
    home: homeReducer,
  },
});
