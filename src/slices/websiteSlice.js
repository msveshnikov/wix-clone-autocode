import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchCollaborators = createAsyncThunk(
    'website/fetchCollaborators',
    async (websiteId) => {
        const response = await axios.get(`/api/websites/${websiteId}/collaborators`);
        return response.data;
    }
);

export const fetchVersions = createAsyncThunk('website/fetchVersions', async (websiteId) => {
    const response = await axios.get(`/api/websites/${websiteId}/versions`);
    return response.data;
});

export const createVersion = createAsyncThunk(
    'website/createVersion',
    async ({ websiteId, versionData }) => {
        const response = await axios.post(`/api/websites/${websiteId}/versions`, versionData);
        return response.data;
    }
);

export const restoreVersion = createAsyncThunk(
    'website/restoreVersion',
    async ({ websiteId, versionId }) => {
        const response = await axios.post(
            `/api/websites/${websiteId}/versions/${versionId}/restore`
        );
        return response.data;
    }
);

export const updateSEO = createAsyncThunk('website/updateSEO', async ({ websiteId, seoData }) => {
    const response = await axios.put(`/api/websites/${websiteId}/seo`, seoData);
    return response.data;
});

const initialState = {
    currentWebsite: null,
    websites: [],
    templates: [],
    collaborators: [],
    versions: [],
    publishedSites: [],
    domains: [],
    loading: false,
    error: null
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
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCollaborators.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCollaborators.fulfilled, (state, action) => {
                state.loading = false;
                state.collaborators = action.payload;
            })
            .addCase(fetchCollaborators.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(fetchVersions.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchVersions.fulfilled, (state, action) => {
                state.loading = false;
                state.versions = action.payload;
            })
            .addCase(fetchVersions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(createVersion.fulfilled, (state, action) => {
                state.versions.push(action.payload);
            })
            .addCase(restoreVersion.fulfilled, (state, action) => {
                state.currentWebsite = action.payload;
            })
            .addCase(updateSEO.fulfilled, (state, action) => {
                const index = state.websites.findIndex((w) => w.id === action.payload.id);
                if (index !== -1) {
                    state.websites[index] = action.payload;
                }
                if (state.currentWebsite && state.currentWebsite.id === action.payload.id) {
                    state.currentWebsite = action.payload;
                }
            });
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
