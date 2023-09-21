import React, { useContext, useEffect, useState } from 'react'
import userContext from '../../userContext';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from '../../firebaseInit';
import './Order.css';
// import { order } from '../../data';

export default function Order() {
  const navigate = useNavigate();
  const { user } = useContext(userContext);
  const [order, setOrder] = useState([]);
  const [userAuth] = useAuthState(auth);

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
