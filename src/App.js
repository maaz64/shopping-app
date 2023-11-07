// importing required hooks
// import { useState} from 'react';

// importing router
import { createBrowserRouter, RouterProvider, createRoutesFromElements, Route } from 'react-router-dom';

// importing components
import Home from './Components/Home/Home';
import Navbar from './Components/Navbar/Navbar';
import SignIn from './Components/SignIn/SignIn';
import SignUp from './Components/SignUp/SignUp';
import Cart from './Components/Cart/Cart';
import Order from './Components/Order/Order';

// importing the provider from react-redux
import { Provider } from 'react-redux';

// importing store
import { store } from './store';

// importing react toast
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function App() {

  // creating routes for app
  const routes = createRoutesFromElements(
    <Route path="/shopping-app" element={<Navbar/>}>
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
      {/* providing routes to the app */}
    <Provider store={store}>
        <RouterProvider router={router}/>
    </Provider>
    </>
  );
}

// exporting the app;
export default App;
