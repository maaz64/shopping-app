// importing required hooks
import { useEffect, useState } from "react";

// importing styles for the component
import './Home.css';

// importing firebase database methods
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from '../../firebaseInit';
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";

// importing ItemCard component
import ItemCard from "../ItemCard/ItemCard";

// importing react toast
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// importing hooks from react-redux
import { useDispatch, useSelector } from "react-redux";

// importing user selector and user actions
import { userSelector, actions } from "../../redux/reducers/userReducer";

// importing cart selector and cart actions
import { cartSelector, addProductToCart } from "../../redux/reducers/cartReducer";

// creating categories array to further use it to create a list of filter 
const CATEGORIES = [
    "men's clothing",
    "women's clothing",
    "jewelery",
    "electronics",
];


const Home = () => {

    // destructuring the cartProducts from cartSelector
    const { cartProducts } = useSelector(cartSelector)

    // destructuring the user from userSelector
    const { user } = useSelector(userSelector);

    // destructuring user actions
    const { setUser } = actions;

    // using this hook to dispatch actions
    const dispatch = useDispatch();


    // creating state productList to store the products to show on homepage
    const [productList, setProductList] = useState([]);

    // creating state to store filtered products
    const [searchItems, setSearchItem] = useState([]);

    // This state store the price range filter 
    const [priceRange, setPriceRange] = useState(20000);

    // This state stores the checked checkbox input value
    const [filterTags, setFilterTags] = useState([])

    // This useEffect checks the user is logged in or not based on that it will set the user id or null in user state 
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const uid = user.uid;
                dispatch(setUser(uid));

            } else {
                dispatch(setUser(null));
            }
        });
    }, [user]);


    // This useEffect will fetch the product data from database as the component did mount and set it to productList state
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

    // This useEffect will set searchItems whenever the filterTags state changes..filterTags changes whenever user checked or unchecked the checbox input.
    useEffect(() => {

        const filteredProducts = productList.filter((product) => {
            return filterTags.includes(product.category)
        })
        setSearchItem([...filteredProducts]);

    }, [filterTags]);

    // This useEffect will set searchItems whenever the priceRange state changes..
    useEffect(() => {
        let products = productList;
        if (searchItems.length !== 0) {
            products = searchItems;
        }
        const filteredProducts = products.filter((product) => {
            return product.price <= priceRange;
        })
        setSearchItem([...filteredProducts]);
    }, [priceRange])


    // function to add the product inside cart
    const addToCart = async (product) => {

        if (!user) {
            toast.success("Signin first to add products into cart");
            return;

        }

        // finding the index to check if the product is already existed in cart.
        const index = cartProducts.findIndex(cartProduct => cartProduct.id === product.id);

        // if indes is -1 it means product is not inside the cart. Then we add it in the cart with quantity value 1.
        if (index === -1) {
            const updatedCart = { ...product, quantity: 1 };
            dispatch(addProductToCart(updatedCart));
            await updateDoc(doc(db, "users", user), {
                cart: [...cartProducts, { ...product, quantity: 1 }],

            });
            // notification message will show when the product is added in the cart
            toast.success("Product Added Successfully");
        }

        // if index is not -1 it means product is already there then we just increase the quantity of the product
        else {
            toast.success("Product already added in cart");

        }

    }

    // function to handle the search bar
    const handleSearch = (e) => {
        let input = e.target.value;

        let resultArray = productList.filter((product) => product.name.includes(input.charAt(0).toUpperCase() + input.slice(1)));
        if (e.target.value && resultArray.length === 0) {
            resultArray = [false];
            setSearchItem(resultArray);
            return;
        }
        setSearchItem(resultArray);

    }

    // function to store the checked checkbox input value inside filterTags state 
    const handleFilterChange = (event) => {
        if (event.target.checked) {
            setFilterTags([...filterTags, event.target.value])
        } else {
            setFilterTags(
                filterTags.filter((filterTag) => filterTag !== event.target.value)
            )
        }

    }

    // function to set the priceRange
    const filterByPrice = (e) => {
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
                        <input type="range" name="price" id="price" className='priceInput' min="100" max="50000" step="10" value={priceRange} onChange={filterByPrice} />
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