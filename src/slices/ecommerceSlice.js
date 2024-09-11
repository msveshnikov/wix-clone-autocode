import { createSlice } from '@reduxjs/toolkit';

const ecommerceSlice = createSlice({
    name: 'ecommerce',
    initialState: {
        products: [],
        cart: [],
        orders: [],
        categories: [],
        currentProduct: null,
        loading: false,
        error: null
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
        setCurrentProduct: (state, action) => {
            state.currentProduct = action.payload;
        },
        addToCart: (state, action) => {
            const existingItem = state.cart.find((item) => item.id === action.payload.id);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                state.cart.push({ ...action.payload, quantity: 1 });
            }
        },
        removeFromCart: (state, action) => {
            state.cart = state.cart.filter((item) => item.id !== action.payload);
        },
        updateCartItemQuantity: (state, action) => {
            const { id, quantity } = action.payload;
            const item = state.cart.find((item) => item.id === id);
            if (item) {
                item.quantity = quantity;
            }
        },
        clearCart: (state) => {
            state.cart = [];
        },
        addOrder: (state, action) => {
            state.orders.push(action.payload);
        },
        setOrders: (state, action) => {
            state.orders = action.payload;
        },
        setCategories: (state, action) => {
            state.categories = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        }
    }
});

export const {
    setProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    setCurrentProduct,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    addOrder,
    setOrders,
    setCategories,
    setLoading,
    setError
} = ecommerceSlice.actions;

export default ecommerceSlice.reducer;
