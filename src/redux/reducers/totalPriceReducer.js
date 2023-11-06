import { createSlice } from "@reduxjs/toolkit";

// initialising the state
const initialState = {totalPrice:0}

// creating total price slice
const priceSlice = createSlice({
    name:"total price",
    initialState,
    reducers:{
        setTotalPrice:(state,action)=>{
            state.totalPrice = action.payload;
        }

    },

})

// exporting the reducer
export const totalPriceReducer = priceSlice.reducer;

// exporting the actions
export const {setTotalPrice} = priceSlice.actions;

// creating and exporting the total price selector
export const totalPriceSelector = (state)=>(state.totalPriceReducer);