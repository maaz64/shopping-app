// importing configureStore from redux toolkit
import { configureStore } from "@reduxjs/toolkit";


// importing reducres
import { userReducer } from "./redux/reducers/userReducer";
import { cartReducer } from "./redux/reducers/cartReducer";
import { totalPriceReducer } from "./redux/reducers/totalPriceReducer";
import { orderReducer } from "./redux/reducers/orderReducer";

// creating the store and exporting it 
export const store = configureStore({
  reducer: {
    userReducer,
    cartReducer,
    totalPriceReducer,
    orderReducer,
  },
  
});
