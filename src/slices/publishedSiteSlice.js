import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    publishedSites: [],
    currentPublishedSite: null,
    isLoading: false,
    error: null
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
        }
    }
});

export const {
    setPublishedSites,
    setCurrentPublishedSite,
    addPublishedSite,
    updatePublishedSite,
    deletePublishedSite,
    setLoading,
    setError
} = publishedSiteSlice.actions;

export default publishedSiteSlice.reducer;
