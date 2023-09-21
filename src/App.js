import { useState} from 'react';
import { createBrowserRouter, RouterProvider, createRoutesFromElements, Route } from 'react-router-dom';

import './App.css';

import Home from './Components/Home/Home';
import Navbar from './Components/Navbar/Navbar';
import SignIn from './Components/SignIn/SignIn';
import SignUp from './Components/SignUp/SignUp';
import Cart from './Components/Cart/Cart';
import userContext from './userContext';
import Order from './Components/Order/Order';

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [user, setUser] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [cartProducts, setCartProducts] = useState([]);
  const [order,setOrder] = useState([]);

  const routes = createRoutesFromElements(
    <Route path="/" element={<Navbar/>}>
      <Route index element={<Home/>}/>
      <Route path='signin' element={<SignIn/>}/>
      <Route path='signup' element={<SignUp/>}/>
      <Route path= 'mycart' element={<Cart/>}/>
      <Route path= 'myorder' element={<Order/>}/>
    </Route>
  );

  const router = createBrowserRouter(routes)
  return (
    <>
    <ToastContainer/>
    <userContext.Provider value={{user,setUser, cartProducts,setCartProducts, totalPrice,setTotalPrice, order,setOrder}}>
    <RouterProvider router={router}/>
    </userContext.Provider>
    </>
  );
}

export default App;
