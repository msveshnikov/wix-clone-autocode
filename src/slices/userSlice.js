import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'user',
    initialState: {
        currentUser: null,
        preferences: {
            language: 'en',
            darkMode: false
        },
        collaborators: [],
        notifications: []
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
