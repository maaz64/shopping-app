// importing required hooks
import React, { useContext, useEffect } from 'react'

// importing react router dom hooks
import { useNavigate } from 'react-router-dom';

// importing userContext
import userContext from '../../userContext';

// importing firebase database methods
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, getDoc,updateDoc } from "firebase/firestore";
import {db,auth} from '../../firebaseInit';

// importing styles
import './Cart.css'

// importing react toast
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export default function Cart() {

    // using this hook to navigate to diffrent pages
    const navigate = useNavigate();

    // destructuring required props from userContext
    const {user,cartProducts,setTotalPrice, totalPrice,setCartProducts, order,setOrder} = useContext(userContext);
    const [userAuth] = useAuthState(auth);

    // This useEffect will check whether the user is logged in or not..if user is not present it will redirect it to signin page
    useEffect(()=>{

      if (!userAuth){
        navigate("/signin");
        return;
      }
        
      // This useEffect will fetch the products from database that logged in user has added in its cart
      const getCartData = async()=>{
         
            const docRef = doc(db, "users", user);
            const docSnap = await getDoc(docRef);
            const productsInCart = docSnap.data().cart;
            setCartProducts(productsInCart);
            setOrder(docSnap.data().order);
            const price = productsInCart.reduce((accumulator,product)=>{
              return accumulator + (product.price * product.quantity);
            },0) 
            setTotalPrice(price);

        }
      getCartData();

    },[]);

    
    // function to increase the product count that user already added inside the cart
    const handleInc = async(id)=>{
      const index = cartProducts.findIndex(cartProduct => cartProduct.id === id);
      cartProducts[index].quantity++;
      setCartProducts(cartProducts);
      setTotalPrice(totalPrice + cartProducts[index].price);
      await updateDoc(doc(db, "users", user), {
        cart: cartProducts,
      });
    }

    // function to decrease the product count that user already added inside the cart...if the count is zero it will remove the product from the cart
    const handleDec = async(id)=>{
      const index = cartProducts.findIndex(cartProduct => cartProduct.id === id);
      setTotalPrice(totalPrice - cartProducts[index].price);
      cartProducts[index].quantity--;
      if(cartProducts[index].quantity === 0)
      {
        cartProducts.splice(index,1);
      }

      setCartProducts(cartProducts);
      await updateDoc(doc(db, "users", user), {
        cart: cartProducts,
      });
    }

    // function to remove the product from the cart
    const handleRemove = async(id)=>{
      const index = cartProducts.findIndex(cartProduct => cartProduct.id === id);
      setTotalPrice(totalPrice - (cartProducts[index].quantity * cartProducts[index].price))
      cartProducts.splice(index,1);
      setCartProducts(cartProducts);
      await updateDoc(doc(db, "users", user), {
        cart: cartProducts,
      });

      toast.success("Product Removed Successfully!!!");
    }

    // function to order the products that are inside the cart
    const handlePurchase  = async()=>{
      let currentDate = new Date().toJSON().slice(0, 10);
      setOrder([{ord_Prd:[...cartProducts], date:currentDate}, ...order]);
      setCartProducts([]);

      toast.success("Order Successfull");
      await updateDoc(doc(db, "users", user), {
        cart: [],
        order:[{ord_Prd:[...cartProducts], date:currentDate},...order]
      });

    }
    
  return (
    <>{cartProducts.length===0?<h1 style={{textAlign:"center",color:"#737382"}}>Cart is Empty</h1>:
    <div className='cart'>
      <div className="cart-aside">
        <p className="total-price">
        <span>Total Price </span><br/><span>&#8377; {totalPrice}/-</span>
        </p>
        <button className='purchase-btn' onClick={handlePurchase}>Purchase</button>
      </div>
      <div className="cart-productList-container">
        {cartProducts.map((product, index)=>
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
                        <img src="https://cdn-icons-png.flaticon.com/128/1828/1828899.png" alt="dec" onClick={()=>handleDec(product.id)}/>
                        <span>{product.quantity}</span>
                        <img src="https://cdn-icons-png.flaticon.com/128/1828/1828919.png" alt="inc" onClick={()=>handleInc(product.id)} />
                    </div>
                    </div>
    
                    <button onClick={()=>handleRemove(product.id)} className="remove-productBtn">Remove From Cart</button>
                </div>
        </div>
        )}
        </div>
    </div>}</>
  )
}
