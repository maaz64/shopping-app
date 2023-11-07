// importing required hooks
import React, {  useEffect } from 'react'

// importing react router dom hooks
import { useNavigate } from 'react-router-dom';

// importing firebase database methods
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, updateDoc, arrayRemove } from "firebase/firestore";
import { db, auth } from '../../firebaseInit';

// importing styles
import './Cart.css'

// importing react toast
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// using redux toolkit
import { useDispatch, useSelector } from 'react-redux';
import { userSelector } from '../../redux/reducers/userReducer';
import { cartSelector,getCartDataAsync, setCartProductsQuantityInc, setCartProductsQuantityDec, removeCartProduct, resetCartProducts} from '../../redux/reducers/cartReducer';
import { totalPriceSelector, setTotalPrice } from '../../redux/reducers/totalPriceReducer';
import {  orderSelector, setOrder, getOrderDataAsync } from '../../redux/reducers/orderReducer';


export default function Cart() {

  // using this hook to navigate to diffrent pages
  const navigate = useNavigate();
  
  // using this hook to dispatch actions
  const dispatch = useDispatch();

  // destructuring the user from userSelector
  const { user } = useSelector(userSelector);
  const [userAuth] = useAuthState(auth);

  // destructuring the cart from cartSelector
  const { cartProducts } = useSelector(cartSelector);

  // destructuring the totalPrice from totalPriceSelector
  const { totalPrice } = useSelector(totalPriceSelector);

  // destructuring the order from orderSelector
  const { order } = useSelector(orderSelector)

  // This useEffect will check whether the user is logged in or not..if user is not present it will redirect it to signin page
  useEffect(() => {

    if (!userAuth) {
      navigate("/shopping-app/signin");
      return;
    }

    // if user is present then it will fetch the cart products and ordered products from database that logged in user has added.

    dispatch(getCartDataAsync(user));
    dispatch(getOrderDataAsync(user));

  }, []);


  // function to increase the product count that user already added inside the cart
  const handleInc = async (id) => {
    const index = cartProducts.findIndex(cartProduct => cartProduct.id === id);
    dispatch(setTotalPrice(totalPrice + cartProducts[index].price));
    dispatch(setCartProductsQuantityInc(index));
    await updateDoc(doc(db, "users", user), {
      cart: [...cartProducts],
    });

  }
  

  // function to decrease the product count that user already added inside the cart...if the count is zero it will remove the product from the cart
  const handleDec = async (id) => {
    const index = cartProducts.findIndex(cartProduct => cartProduct.id === id);
    dispatch(setTotalPrice(totalPrice - cartProducts[index].price));
    dispatch(setCartProductsQuantityDec(index));
    // console.log(cartProducts[index].quantity);
    
    await updateDoc(doc(db, "users", user), {
      cart: [...cartProducts],
    });
    if (cartProducts[index].quantity === 1 ) {
      handleRemove(id);
      return;
    }
  }


  // function to remove product from the cart 
  const handleRemove = async (id) => {
    const index = cartProducts.findIndex(cartProduct => cartProduct.id === id);
    dispatch(setTotalPrice(totalPrice - (cartProducts[index].quantity * cartProducts[index].price)));
    dispatch(removeCartProduct(index));
    await updateDoc(doc(db, "users", user), {
      cart: arrayRemove(cartProducts[index]),
    });
    toast.success("Product Removed Successfully!!!");
  }

  // function to order the products that are inside the cart
  const handlePurchase = async () => {
    let currentDate = new Date().toJSON().slice(0, 10);
    dispatch(setOrder({ ord_Prd: [...cartProducts], date: currentDate }));
    dispatch(resetCartProducts());

    toast.success("Order Successfull");
    await updateDoc(doc(db, "users", user), {
      cart: [],
      order: [{ ord_Prd: [...cartProducts], date: currentDate }, ...order]
    });

  }

  return (
    <>{cartProducts.length === 0 ? <h1 style={{ textAlign: "center", color: "#737382" }}>Cart is Empty</h1> :
      <div className='cart'>
        <div className="cart-aside">
          <p className="total-price">
            <span>Total Price </span><br /><span>&#8377; {totalPrice}/-</span>
          </p>
          <button className='purchase-btn' onClick={handlePurchase}>Purchase</button>
        </div>
        <div className="cart-productList-container">
          {cartProducts.map((product) =>
            <div key={product.id} className="cart-product-container">
              <div className="cart-productImg">
                <img src={product.src} alt="product" />
              </div>
              <div className="cart-productDetail">
                <div className="cart-productName">
                  <p>{product.name}</p>
                </div>
                <div className="cart-productPrice">
                  <p>&#8377; {product.price}</p>
                  <div className="quantityContainer">
                    <img src="https://cdn-icons-png.flaticon.com/128/1828/1828899.png" alt="dec" onClick={() => handleDec(product.id)} />
                    <span>{product.quantity}</span>
                    <img src="https://cdn-icons-png.flaticon.com/128/1828/1828919.png" alt="inc" onClick={() => handleInc(product.id)} />
                  </div>
                </div>

                <button onClick={() => handleRemove(product.id)} className="remove-productBtn">Remove From Cart</button>
              </div>
            </div>
          )}
        </div>
      </div>}</>
  )
}
