import { createSlice } from "@reduxjs/toolkit";

// initialising the state
const initialState = {
    user:null
}

// creating user slice
const userSlice = createSlice({
    name:'user',
    initialState,
    reducers:{
        setUser:(state,action)=>{
            state.user = action.payload;
        }
    }
});


// exporting the reducer
export const userReducer = userSlice.reducer;

// exporting the actions
export const actions = userSlice.actions;

// creating and exporting the user selector
export const userSelector = (state)=>(state.userReducer);