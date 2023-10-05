// importing required hooks
import React, { useContext, useEffect, useState } from 'react'

// importing userContext
import userContext from '../../userContext';

// importing react router dom hooks
import { useNavigate } from 'react-router-dom';

// importing firebase database methods
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from '../../firebaseInit';

// importing styles
import './Order.css';

export default function Order() {

  // using this hook to navigate to diffrent pages
  const navigate = useNavigate();

  // destructuring required props from userContext
  const { user } = useContext(userContext);

  // creating state to store the users order details
  const [order, setOrder] = useState([]);

  // creating user Authorised state
  const [userAuth] = useAuthState(auth);

  // This useEffect will fetch all orders placed by a user if the user is authorised otherwise it will redirect the user to sign in page as the component did mount
  useEffect(() => {
    if (!userAuth) {
      navigate("/signin");
      return;
    }

    const getAllOrders = async () => {
      const docRef = doc(db, "users", user);
      const docSnap = await getDoc(docRef);
      const orders = docSnap.data().order;
      setOrder(orders);

    }
    getAllOrders();
  }, [])


  // this functiom will sum up the total price of a order
  const getTotalPrice = (array) => {

    const totalPriceToPay = array.reduce((accumulator, product) => {
      return accumulator + (product.price * product.quantity);
    }, 0)

    return totalPriceToPay;
  }



  return (
    <>{order.length === 0 ? <h1 style={{ textAlign: "center", color: "#737382" }}>No Order Yet</h1> :
      <div className='order'>
        <h1>Your Orders</h1><hr />
        {order.map((orderDetail, index) =>
          <div key={index} className="order-detail">
            <h2>Order On {orderDetail.date}</h2>

            <table className='order-table'>
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total Price</th>
                </tr>
              </thead>
              <tbody>
                {orderDetail.ord_Prd.map((ord) =>
                  <>
                    <tr key={ord.id}>
                      <td>{ord.name}</td>
                      <td>{ord.price}</td>
                      <td>{ord.quantity}</td>
                      <td>{ord.price * ord.quantity}</td>
                    </tr>
                  </>

                )}
              </tbody>
            </table>
            <div className="total">
              <h4>Total</h4>
              <p> &#8377; {getTotalPrice(orderDetail.ord_Prd)}/-</p>
            </div>
            <hr />
          </div>
        )}
      </div>}
    </>
  )
}
