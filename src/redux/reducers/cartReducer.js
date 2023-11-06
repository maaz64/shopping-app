import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from '../../firebaseInit';
import { doc, getDoc } from "firebase/firestore";
import { setTotalPrice } from "./totalPriceReducer";


// initialising the state
const initialState = {
    cartProducts:[],
}

// creating async thunk to get cart data.
export const getCartDataAsync = createAsyncThunk("getCartData",async(user,thunkAPI)=>{

    const docRef = doc(db, "users", user);
    const docSnap = await getDoc(docRef);
    const products = docSnap.data().cart;
    thunkAPI.dispatch(setCartProducts(products));
    const price = products.reduce((accumulator, product) => {
        return accumulator + (product.price * product.quantity);
      }, 0)
    thunkAPI.dispatch(setTotalPrice(price));
});

// creating cart slice
const cartSlice = createSlice({
    name:'cart',
    initialState,
    reducers:{
        addProductToCart:(state,action)=>{
            state.cartProducts.push(action.payload);
        },
        setCartProducts:(state,action)=>{
            state.cartProducts = [...action.payload]
        },
        setCartProductsQuantityInc:(state,action)=>{
            const index = action.payload;
            ++state.cartProducts[index].quantity;
        },
        setCartProductsQuantityDec:(state,action)=>{
            const index = action.payload;
            state.cartProducts[index].quantity -=1;
        },
        removeCartProduct:(state,action)=>{
            const index = action.payload;
            state.cartProducts.splice(index,1);
        },
        resetCartProducts:(state,action)=>{
            state.cartProducts = [];
        },
    }
});


// exporting the reducer
export const cartReducer = cartSlice.reducer;

// exporting the actions
export const {
addProductToCart,
setCartProducts, 
setCartProductsQuantityInc, 
setCartProductsQuantityDec,
removeCartProduct,
resetCartProducts}= cartSlice.actions;

// creating and exporting the cart selector
export const cartSelector = (state)=>(state.cartReducer);