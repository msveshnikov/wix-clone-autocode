import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentWebsite: null,
    websites: [],
    templates: [],
    collaborators: [],
    versions: [],
    publishedSites: [],
    domains: []
};

const websiteSlice = createSlice({
    name: 'website',
    initialState,
    reducers: {
        setCurrentWebsite: (state, action) => {
            state.currentWebsite = action.payload;
        },
        setWebsites: (state, action) => {
            state.websites = action.payload;
        },
        addWebsite: (state, action) => {
            state.websites.push(action.payload);
        },
        updateWebsite: (state, action) => {
            const index = state.websites.findIndex((w) => w.id === action.payload.id);
            if (index !== -1) {
                state.websites[index] = action.payload;
            }
        },
        deleteWebsite: (state, action) => {
            state.websites = state.websites.filter((w) => w.id !== action.payload);
        },
        setTemplates: (state, action) => {
            state.templates = action.payload;
        },
        addCollaborator: (state, action) => {
            state.collaborators.push(action.payload);
        },
        removeCollaborator: (state, action) => {
            state.collaborators = state.collaborators.filter((c) => c.id !== action.payload);
        },
        addVersion: (state, action) => {
            state.versions.push(action.payload);
        },
        setVersions: (state, action) => {
            state.versions = action.payload;
        },
        publishSite: (state, action) => {
            state.publishedSites.push(action.payload);
        },
        unpublishSite: (state, action) => {
            state.publishedSites = state.publishedSites.filter((s) => s.id !== action.payload);
        },
        addDomain: (state, action) => {
            state.domains.push(action.payload);
        },
        removeDomain: (state, action) => {
            state.domains = state.domains.filter((d) => d.id !== action.payload);
        }
    }
});

export const {
    setCurrentWebsite,
    setWebsites,
    addWebsite,
    updateWebsite,
    deleteWebsite,
    setTemplates,
    addCollaborator,
    removeCollaborator,
    addVersion,
    setVersions,
    publishSite,
    unpublishSite,
    addDomain,
    removeDomain
} = websiteSlice.actions;

export default websiteSlice.reducer;
