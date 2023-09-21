import React from 'react';
import './ItemCard.css'

export default function ItemCard({product, addToCart}) {

  return (
        <div  className="productContainer">
            <div className="productImg">
                <img src={product.src} alt="product" />
            </div>
            <div className="productDetail">
                <div className="productName">
                    <p>{product.name}</p>
                </div>
                <div className="productPrice">
                    <p>&#8377; {product.price} </p>

                </div>
                
                <button onClick={() => addToCart(product)} className="productBtn">Add To Cart</button>
            </div>
        </div>
  )
}
