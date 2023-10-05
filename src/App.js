// importing required hooks
import { useState} from 'react';

// importing router
import { createBrowserRouter, RouterProvider, createRoutesFromElements, Route } from 'react-router-dom';

// importing components
import Home from './Components/Home/Home';
import Navbar from './Components/Navbar/Navbar';
import SignIn from './Components/SignIn/SignIn';
import SignUp from './Components/SignUp/SignUp';
import Cart from './Components/Cart/Cart';
import Order from './Components/Order/Order';

// importing userContext 
import userContext from './userContext';

// importing react toast

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [user, setUser] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [cartProducts, setCartProducts] = useState([]);
  const [order,setOrder] = useState([]);

  // creting routes for app
  const routes = createRoutesFromElements(
    <Route path="/" element={<Navbar/>}>
      <Route index element={<Home/>}/>
      <Route path='signin' element={<SignIn/>}/>
      <Route path='signup' element={<SignUp/>}/>
      <Route path= 'mycart' element={<Cart/>}/>
      <Route path= 'myorder' element={<Order/>}/>
    </Route>
  );
  const router = createBrowserRouter(routes);

  return (
    <>
    {/* component for notification */}
    <ToastContainer/>

    {/* providing value to the userContext */}
    <userContext.Provider value={{user,setUser, cartProducts,setCartProducts, totalPrice,setTotalPrice, order,setOrder}}>

      {/* providing routes to the app */}
    <RouterProvider router={router}/>
    </userContext.Provider>
    </>
  );
}

// exporting the app;
export default App;
