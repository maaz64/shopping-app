import React from 'react'
import ItemCard from '../ItemCard/ItemCard';
import './ItemList.css'

export default function ItemList({searchItems, addToCart}) {

    const result = searchItems.map((product)=>
        <ItemCard product={product} addToCart={addToCart}/>
    );

    const content = result?.length ? result : <h1 style={{textAlign:'center',}}>No Matching Found</h1> 
  return (
    <div className="productList">
        {content}
    </div>
  )
}
