import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchTemplates = createAsyncThunk('template/fetchTemplates', async () => {
  const response = await fetch('/api/templates');
  return response.json();
});

export const selectTemplate = createAsyncThunk('template/selectTemplate', async (templateId) => {
  const response = await fetch(`/api/templates/${templateId}`);
  return response.json();
});

const templateSlice = createSlice({
  name: 'template',
  initialState: {
    templates: [],
    selectedTemplate: null,
    loading: false,
    error: null,
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
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTemplates.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTemplates.fulfilled, (state, action) => {
        state.loading = false;
        state.templates = action.payload;
      })
      .addCase(fetchTemplates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(selectTemplate.pending, (state) => {
        state.loading = true;
      })
      .addCase(selectTemplate.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedTemplate = action.payload;
      })
      .addCase(selectTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  setTemplates,
  setSelectedTemplate,
  setLoading,
  setError,
  addTemplate,
  updateTemplate,
  deleteTemplate,
} = templateSlice.actions;

export const selectTemplates = (state) => state.template.templates;
export const selectSelectedTemplate = (state) => state.template.selectedTemplate;
export const selectTemplateLoading = (state) => state.template.loading;
export const selectTemplateError = (state) => state.template.error;

export default templateSlice.reducer;