// importing required hooks
import {  useEffect, useState } from 'react';

// importing react router dom hooks
import { Link, useNavigate } from 'react-router-dom';

// importing useSelector provided by react-redux
import {  useDispatch } from 'react-redux';

// importing firebase authentication methods
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useAuthState } from "react-firebase-hooks/auth";

// importing firebase database methods
import { auth } from '../../firebaseInit';

// importing styles
import "./SignIn.css"

// importing react toast
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// importing user actions
import { actions } from '../../redux/reducers/userReducer';


const SignIn = () => {

    // destructuring the actions of user
    const {setUser} = actions;
    const dispatch = useDispatch();

    // using this hook to navigate to diffrent pages
    const navigate = useNavigate();

    // creating state to store the user email and passwords
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // creating user Authorised state
    const [userAuth] = useAuthState(auth);

    useEffect(() => {
        
        if (userAuth) navigate("/shopping-app");
    }, [userAuth]);

    // function to handle the login of user using signInWithEmailAndPassword method proivded by the firebase 
    const handleLogin = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                dispatch(setUser(user.uid));
                toast.success("Login successfully");

                navigate("/shopping-app")
            })
            .catch((error) => {
                toast.error(error.code);
            });

    }

    return (
        <>
            <div className="loginFormContainer">
                <form className="loginForm" onSubmit={handleLogin}>
                    <h2>Sign In</h2>
                    <input type="email" name="email" id="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <input type="password" name="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <button>Sign In</button>
                    <Link className='signupLink' to='/shopping-app/signup'><p>Go for SignUp</p></Link>
                </form>
            </div>
        </>
    );
}


export default SignIn;