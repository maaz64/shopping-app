import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from '../../firebaseInit';
import { doc, getDoc } from "firebase/firestore";

// initialising the state
const initialState = {order:[]}

// creating async thunk to get order data.
export const getOrderDataAsync = createAsyncThunk("getOrderData",async(user,thunkAPI)=>{

    const docRef = doc(db, "users", user);
    const docSnap = await getDoc(docRef);
    thunkAPI.dispatch(getAllOrder(docSnap.data().order));
});

// creating order slice
const orderSlice = createSlice({
    name:"total price",
    initialState,
    reducers:{
        setOrder:(state, action)=>{
            state.order = [action.payload,...state.order];
        },
        getAllOrder:(state,action)=>{
            state.order = [...action.payload]
        }

    }
})


// exporting the reducer
export const orderReducer = orderSlice.reducer;

// exporting the actions
export const {setOrder,getAllOrder} = orderSlice.actions;

// creating and exporting the order selector
export const orderSelector = (state)=>(state.orderReducer);