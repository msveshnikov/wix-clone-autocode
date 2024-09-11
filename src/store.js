import { configureStore } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        token: null,
        isAuthenticated: false
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = !!action.payload;
        },
        setToken: (state, action) => {
            state.token = action.payload;
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
        }
    }
});

const websiteSlice = createSlice({
    name: 'website',
    initialState: {
        currentWebsite: null,
        websites: [],
        templates: [],
        publishedSites: []
    },
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
        setPublishedSites: (state, action) => {
            state.publishedSites = action.payload;
        },
        addPublishedSite: (state, action) => {
            state.publishedSites.push(action.payload);
        },
        updatePublishedSite: (state, action) => {
            const index = state.publishedSites.findIndex((s) => s.id === action.payload.id);
            if (index !== -1) {
                state.publishedSites[index] = action.payload;
            }
        },
        deletePublishedSite: (state, action) => {
            state.publishedSites = state.publishedSites.filter((s) => s.id !== action.payload);
        }
    }
});

const builderSlice = createSlice({
    name: 'builder',
    initialState: {
        components: [],
        selectedComponent: null,
        currentVersion: null,
        versions: []
    },
    reducers: {
        addComponent: (state, action) => {
            state.components.push(action.payload);
        },
        updateComponent: (state, action) => {
            const index = state.components.findIndex((c) => c.id === action.payload.id);
            if (index !== -1) {
                state.components[index] = action.payload;
            }
        },
        deleteComponent: (state, action) => {
            state.components = state.components.filter((c) => c.id !== action.payload);
        },
        setSelectedComponent: (state, action) => {
            state.selectedComponent = action.payload;
        },
        setCurrentVersion: (state, action) => {
            state.currentVersion = action.payload;
        },
        addVersion: (state, action) => {
            state.versions.push(action.payload);
        },
        updateVersion: (state, action) => {
            const index = state.versions.findIndex((v) => v.id === action.payload.id);
            if (index !== -1) {
                state.versions[index] = action.payload;
            }
        }
    }
});

const ecommerceSlice = createSlice({
    name: 'ecommerce',
    initialState: {
        products: [],
        cart: [],
        orders: []
    },
    reducers: {
        setProducts: (state, action) => {
            state.products = action.payload;
        },
        addProduct: (state, action) => {
            state.products.push(action.payload);
        },
        updateProduct: (state, action) => {
            const index = state.products.findIndex((p) => p.id === action.payload.id);
            if (index !== -1) {
                state.products[index] = action.payload;
            }
        },
        deleteProduct: (state, action) => {
            state.products = state.products.filter((p) => p.id !== action.payload);
        },
        addToCart: (state, action) => {
            state.cart.push(action.payload);
        },
        removeFromCart: (state, action) => {
            state.cart = state.cart.filter((item) => item.id !== action.payload);
        },
        clearCart: (state) => {
            state.cart = [];
        },
        addOrder: (state, action) => {
            state.orders.push(action.payload);
        },
        updateOrder: (state, action) => {
            const index = state.orders.findIndex((o) => o.id === action.payload.id);
            if (index !== -1) {
                state.orders[index] = action.payload;
            }
        }
    }
});

const seoSlice = createSlice({
    name: 'seo',
    initialState: {
        seoData: null,
        analytics: null
    },
    reducers: {
        setSEOData: (state, action) => {
            state.seoData = action.payload;
        },
        setAnalytics: (state, action) => {
            state.analytics = action.payload;
        }
    }
});

const collaborationSlice = createSlice({
    name: 'collaboration',
    initialState: {
        collaborators: [],
        activeUsers: []
    },
    reducers: {
        setCollaborators: (state, action) => {
            state.collaborators = action.payload;
        },
        addCollaborator: (state, action) => {
            state.collaborators.push(action.payload);
        },
        removeCollaborator: (state, action) => {
            state.collaborators = state.collaborators.filter((c) => c.id !== action.payload);
        },
        setActiveUsers: (state, action) => {
            state.activeUsers = action.payload;
        }
    }
});

export const { setUser, setToken, logout } = authSlice.actions;
export const {
    setCurrentWebsite,
    setWebsites,
    addWebsite,
    updateWebsite,
    deleteWebsite,
    setTemplates,
    setPublishedSites,
    addPublishedSite,
    updatePublishedSite,
    deletePublishedSite
} = websiteSlice.actions;
export const {
    addComponent,
    updateComponent,
    deleteComponent,
    setSelectedComponent,
    setCurrentVersion,
    addVersion,
    updateVersion
} = builderSlice.actions;
export const {
    setProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    addToCart,
    removeFromCart,
    clearCart,
    addOrder,
    updateOrder
} = ecommerceSlice.actions;
export const { setSEOData, setAnalytics } = seoSlice.actions;
export const { setCollaborators, addCollaborator, removeCollaborator, setActiveUsers } =
    collaborationSlice.actions;

const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        website: websiteSlice.reducer,
        builder: builderSlice.reducer,
        ecommerce: ecommerceSlice.reducer,
        seo: seoSlice.reducer,
        collaboration: collaborationSlice.reducer
    }
});

export default store;
