import { useContext, useEffect, useState } from "react";
import userContext from "../../userContext";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from '../../firebaseInit';
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
import './Home.css';
import ItemCard from "../ItemCard/ItemCard";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const CATEGORIES = [
    "men's clothing",
    "women's clothing",
    "jewelery",
    "electronics",
];


const Home = () => {
    const { user, setUser, setCartProducts, cartProducts } = useContext(userContext);
    const [productList, setProductList] = useState([]);
    const [searchItems, setSearchItem] = useState([]);
    const [priceRange, setPriceRange] = useState(50000);
    const [filterTags, setFilterTags] = useState([])




    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const uid = user.uid;
                setUser(uid);
                
            } else {
                setUser(null);
            }
        });
    }, [user,setUser]);

    useEffect(() => {
        async function getProducts() {
            onSnapshot(collection(db, "productList"), (snapShot) => {

                const products = snapShot.docs.map((document) => {
                    return {
                        id: document.id,
                        ...document.data(),
                    };
                });

                setProductList([...products]);

            });
        }

        getProducts();
    }, []);

    useEffect(()=>{
        const filteredProducts = productList.filter((product)=>{
            return filterTags.includes(product.category)
        })
        setSearchItem([...filteredProducts]);

    },[filterTags]);

    useEffect(()=>{
     
        const filteredProducts = productList.filter((product)=>{
            return product.price <= priceRange;
        })
        setSearchItem([...filteredProducts]);
    },[priceRange])
    


    const addToCart = async (product) => {

        const index = cartProducts.findIndex(cartProduct => cartProduct.id === product.id);
        if (index === -1) {
            setCartProducts([...cartProducts, { ...product, quantity: 1 }]);
            await updateDoc(doc(db, "users", user), {
                cart: [...cartProducts, { ...product, quantity: 1 }],

            });
            toast.success("Product Added Successfully");
        }
        else {
            cartProducts[index].quantity++;
            setCartProducts(cartProducts);
            await updateDoc(doc(db, "users", user), {
                cart: cartProducts,
                
            });
            toast.success("Product Count Increases");


        }

    }

    const handleSearch = (e) => {
        let input = e.target.value;
        if (!input) {
            setSearchItem(productList);
            return;
        }

        let resultArray = productList.filter((product) => product.name.includes(input.charAt(0).toUpperCase() + input.slice(1)));
        if (e.target.value && resultArray.length === 0) {
            resultArray = [false];
            setSearchItem(resultArray);
            return;
        }
        setSearchItem(resultArray);

    }


    const handleFilterChange = (event) => {
        if (event.target.checked) {
            setFilterTags([...filterTags, event.target.value])
        } else {
            setFilterTags(
                filterTags.filter((filterTag) => filterTag !== event.target.value)
            )
        }
            
    }

    const filterByPrice = (e)=>{
        setPriceRange(e.target.value);
    }

 

    return (
        <>
            <div className="HomePage">
                <aside className="filterSidebar">
                    <h2>Filter</h2>
                    <form>
                        <label htmlFor="price">price : {priceRange}</label>
                        <h2>Category</h2>
                        <input type="range" name="price" id="price" className='priceInput' min="100" max="100000" step="10" value={priceRange} onChange={filterByPrice}/>
                        <div className="category">

                            {CATEGORIES.map(category => (
                                <div key={category}>
                                    <label>
                                        <input
                                            onChange={handleFilterChange}
                                            type="checkbox"
                                            value={category} />
                                        {category}
                                    </label>
                                </div>
                            ))}


                        </div>
                    </form>
                </aside>

                <form className="homePageForm" >
                    <input type="search"
                        placeholder="Search By Name"
                        className="search"
                        onChange={handleSearch}
                    />
                </form>

                <div className="productList">
                    {searchItems.length === 0 ?
                        productList.map((product) =>
                            <ItemCard product={product} addToCart={addToCart} key={product.id} />
                        ) :
                        searchItems[0] === false ? <h2>No item found...</h2> :
                            searchItems.map((product) =>
                                <ItemCard product={product} addToCart={addToCart} key={product.id} />
                            )}

                </div>

            </div>
        </>
    )
}

export default Home;