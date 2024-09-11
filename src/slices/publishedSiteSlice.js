import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchPublishedSite = createAsyncThunk(
  'publishedSite/fetchPublishedSite',
  async (siteId, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/published-sites/${siteId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch published site');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  publishedSites: [],
  currentPublishedSite: null,
  isLoading: false,
  error: null,
};

const publishedSiteSlice = createSlice({
  name: 'publishedSite',
  initialState,
  reducers: {
    setPublishedSites: (state, action) => {
      state.publishedSites = action.payload;
    },
    setCurrentPublishedSite: (state, action) => {
      state.currentPublishedSite = action.payload;
    },
    addPublishedSite: (state, action) => {
      state.publishedSites.push(action.payload);
    },
    updatePublishedSite: (state, action) => {
      const index = state.publishedSites.findIndex((site) => site.id === action.payload.id);
      if (index !== -1) {
        state.publishedSites[index] = action.payload;
      }
    },
    deletePublishedSite: (state, action) => {
      state.publishedSites = state.publishedSites.filter(
        (site) => site.id !== action.payload
      );
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPublishedSite.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPublishedSite.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentPublishedSite = action.payload;
      })
      .addCase(fetchPublishedSite.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setPublishedSites,
  setCurrentPublishedSite,
  addPublishedSite,
  updatePublishedSite,
  deletePublishedSite,
  setLoading,
  setError,
} = publishedSiteSlice.actions;

export default publishedSiteSlice.reducer;