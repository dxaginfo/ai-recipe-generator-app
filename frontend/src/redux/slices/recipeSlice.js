import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// API URL
const API_URL = '/api/recipes';

// Async thunks
export const generateRecipe = createAsyncThunk(
  'recipe/generate',
  async (recipeData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/generate`, recipeData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to generate recipe');
    }
  }
);

export const saveRecipe = createAsyncThunk(
  'recipe/save',
  async (recipeData, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const config = auth.token ? {
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      } : {};
      
      const response = await axios.post(`${API_URL}/save`, recipeData, config);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to save recipe');
    }
  }
);

export const fetchRecipes = createAsyncThunk(
  'recipe/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL, { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch recipes');
    }
  }
);

export const fetchRecipeById = createAsyncThunk(
  'recipe/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch recipe');
    }
  }
);

export const rateRecipe = createAsyncThunk(
  'recipe/rate',
  async ({ id, rating, comment }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      
      if (!auth.token) {
        return rejectWithValue('Authentication required');
      }
      
      const config = {
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      };
      
      const response = await axios.post(
        `${API_URL}/${id}/rate`,
        { score: rating, comment },
        config
      );
      
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to rate recipe');
    }
  }
);

// Initial state
const initialState = {
  recipes: [],
  currentRecipe: null,
  savedRecipe: null,
  loading: false,
  error: null,
  total: 0,
  page: 1
};

// Create slice
const recipeSlice = createSlice({
  name: 'recipe',
  initialState,
  reducers: {
    clearCurrentRecipe: (state) => {
      state.currentRecipe = null;
    },
    clearSavedRecipe: (state) => {
      state.savedRecipe = null;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    clearRecipeError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Generate Recipe
      .addCase(generateRecipe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateRecipe.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRecipe = action.payload;
      })
      .addCase(generateRecipe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Save Recipe
      .addCase(saveRecipe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveRecipe.fulfilled, (state, action) => {
        state.loading = false;
        state.savedRecipe = action.payload;
        state.recipes.unshift(action.payload); // Add to beginning of list
      })
      .addCase(saveRecipe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Recipes
      .addCase(fetchRecipes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecipes.fulfilled, (state, action) => {
        state.loading = false;
        state.recipes = action.payload.data;
        state.total = action.payload.total;
      })
      .addCase(fetchRecipes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Recipe by ID
      .addCase(fetchRecipeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecipeById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRecipe = action.payload;
      })
      .addCase(fetchRecipeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Rate Recipe
      .addCase(rateRecipe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rateRecipe.fulfilled, (state, action) => {
        state.loading = false;
        
        // Update current recipe rating if it exists
        if (state.currentRecipe) {
          state.currentRecipe.averageRating = action.payload.averageRating;
        }
        
        // Update recipe in the list if it exists
        const index = state.recipes.findIndex(r => r._id === action.meta.arg.id);
        if (index !== -1) {
          state.recipes[index].averageRating = action.payload.averageRating;
        }
      })
      .addCase(rateRecipe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

// Export actions and reducer
export const { 
  clearCurrentRecipe, 
  clearSavedRecipe, 
  setPage,
  clearRecipeError
} = recipeSlice.actions;

export default recipeSlice.reducer;