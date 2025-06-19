import { configureStore } from '@reduxjs/toolkit';
import recipeReducer from './slices/recipeSlice';
import authReducer from './slices/authSlice';

const store = configureStore({
  reducer: {
    recipe: recipeReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;