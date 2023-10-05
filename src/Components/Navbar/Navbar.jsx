// importing firebase database methods
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";
import { auth } from '../../firebaseInit';

// importing react router dom 
import { Link, Outlet,  useNavigate } from 'react-router-dom';

// importing Navbar styling
import './Navbar.css';

// importing react toast
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Navbar = () => {

   // use this to navigate to diffrent pages and components
   const navigate = useNavigate();

   // to check whether user is authorised or not
   const [userAuth] = useAuthState(auth);

   // function to handle logout
   const handleLogout = () => {
      signOut(auth).then(() => {
         navigate("/");
         toast.success("Logged Out!!!");
      }).catch((error) => {
         
         toast.error(error.code);
      });
   }



   return (
      <>
         <nav className="navbar">
            <div className='navbar-container'>
               <Link to="/" className='title'>Busy Buy</Link>
               <ul className='nav-menu'>
                  <li className="nav-item">
                     <Link to="/" className='nav-link'>
                        <img className="img-style" src="https://cdn-icons-png.flaticon.com/128/609/609803.png" alt="Home" />
                        <span>Home</span></Link>
                  </li>
                  {/* if user is authorised then we will show the cart and order page to the user */}
                  {userAuth ? <>
                     <li>
                        <Link to='myorder' className='nav-link'>
                           <img className="img-style" src="https://cdn-icons-png.flaticon.com/128/3502/3502601.png" alt="Order" />
                           <span>My Orders</span></Link>
                     </li>
                     <li>
                        <Link to='mycart' className='nav-link'>
                           <img className="img-style" src="https://cdn-icons-png.flaticon.com/128/726/726496.png" alt="Cart" />
                           <span>Cart</span></Link>
                     </li></> : null}
                  <li>
                     {/* conditional rendering of logout or signin option in navbar */}
                     {userAuth ? <Link className="nav-link" onClick={handleLogout}>
                        <img className="img-style" src="https://cdn-icons-png.flaticon.com/128/1828/1828490.png" alt="Logout" />
                        <span>Log out</span>
                     </Link>
                        :
                        <Link to="/signin" className='nav-link'>
                           <img className="img-style" src="https://cdn-icons-png.flaticon.com/128/3596/3596089.png" alt="Signin" />
                           <span>Sign In</span>
                        </Link>}
                  </li>
               </ul>

            </div>
         </nav>
         <Outlet />
      </>
   )
}

export default Navbar;