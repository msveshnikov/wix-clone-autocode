import { createSlice } from '@reduxjs/toolkit';

const templateSlice = createSlice({
    name: 'template',
    initialState: {
        templates: [],
        selectedTemplate: null,
        loading: false,
        error: null
    },
    reducers: {
        setTemplates: (state, action) => {
            state.templates = action.payload;
        },
        setSelectedTemplate: (state, action) => {
            state.selectedTemplate = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        addTemplate: (state, action) => {
            state.templates.push(action.payload);
        },
        updateTemplate: (state, action) => {
            const index = state.templates.findIndex((t) => t.id === action.payload.id);
            if (index !== -1) {
                state.templates[index] = action.payload;
            }
        },
        deleteTemplate: (state, action) => {
            state.templates = state.templates.filter((t) => t.id !== action.payload);
        }
    }
});

export const {
    setTemplates,
    setSelectedTemplate,
    setLoading,
    setError,
    addTemplate,
    updateTemplate,
    deleteTemplate
} = templateSlice.actions;

export const fetchTemplates = () => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        const response = await fetch('/api/templates');
        const data = await response.json();
        dispatch(setTemplates(data));
    } catch (error) {
        dispatch(setError(error.message));
    } finally {
        dispatch(setLoading(false));
    }
};

export const selectTemplate = (templateId) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        const response = await fetch(`/api/templates/${templateId}`);
        const data = await response.json();
        dispatch(setSelectedTemplate(data));
    } catch (error) {
        dispatch(setError(error.message));
    } finally {
        dispatch(setLoading(false));
    }
};

export default templateSlice.reducer;
