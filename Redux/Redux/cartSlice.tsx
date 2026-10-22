import { createSlice } from "@reduxjs/toolkit";

type Product = { id: string | number; price: number };

const cartSlice = createSlice({
  name: "cart",

  initialState: {
    products: [] as Product[],
    totalPrice: 0
  },

  reducers: {
    addProduct: (state, action) => {
      state.products.push(action.payload)
      state.totalPrice += action.payload.price;
    },

    removeProduct: (state, action) => {
      state.products = state.products.filter(
        product => product.id !== action.payload
      );

      state.totalPrice = 0;

      state.products.forEach(product => {
        state.totalPrice += product.price;
      });
    },

    clearCart: (state) => {
      state.products = [];
      state.totalPrice = 0;
    }
  }
});

export const { addProduct, removeProduct, clearCart } = cartSlice.actions;

export default cartSlice.reducer;