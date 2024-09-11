import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchUser = createAsyncThunk('user/fetchUser', async (userId) => {
    const response = await axios.get(`/api/users/${userId}`);
    return response.data;
});

export const updateUser = createAsyncThunk('user/updateUser', async (userData) => {
    const response = await axios.put(`/api/users/${userData.id}`, userData);
    return response.data;
});

export const deleteUser = createAsyncThunk('user/deleteUser', async (userId) => {
    await axios.delete(`/api/users/${userId}`);
    return userId;
});

const userSlice = createSlice({
    name: 'user',
    initialState: {
        currentUser: null,
        preferences: {
            language: 'en',
            darkMode: false
        },
        collaborators: [],
        notifications: [],
        status: 'idle',
        error: null
    },
    reducers: {
        setUser: (state, action) => {
            state.currentUser = action.payload;
        },
        updateUserPreferences: (state, action) => {
            state.preferences = { ...state.preferences, ...action.payload };
        },
        setCollaborators: (state, action) => {
            state.collaborators = action.payload;
        },
        addCollaborator: (state, action) => {
            state.collaborators.push(action.payload);
        },
        removeCollaborator: (state, action) => {
            state.collaborators = state.collaborators.filter(
                (collaborator) => collaborator.id !== action.payload
            );
        },
        addNotification: (state, action) => {
            state.notifications.push(action.payload);
        },
        removeNotification: (state, action) => {
            state.notifications = state.notifications.filter(
                (notification) => notification.id !== action.payload
            );
        },
        clearNotifications: (state) => {
            state.notifications = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.currentUser = action.payload;
            })
            .addCase(fetchUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.currentUser = action.payload;
            })
            .addCase(deleteUser.fulfilled, (state) => {
                state.currentUser = null;
            });
    }
});

export const {
    setUser,
    updateUserPreferences,
    setCollaborators,
    addCollaborator,
    removeCollaborator,
    addNotification,
    removeNotification,
    clearNotifications
} = userSlice.actions;

export default userSlice.reducer;
