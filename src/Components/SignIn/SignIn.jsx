import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
// import { doc, onSnapshot } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from '../../firebaseInit';
import userContext from "../../userContext";
import "./SignIn.css"

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const SignIn = () => {
    const { setUser} = useContext(userContext);
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userAuth] = useAuthState(auth);

    useEffect(() => {
        
        if (userAuth) navigate("/");
    }, [userAuth]);

    const handleLogin = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                setUser(user.uid);
                toast.success("Login successfully");

                navigate("/")
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
                    <Link className='signupLink' to='/signup'><p>Go for SignUp</p></Link>
                </form>
            </div>
        </>
    );
}


export default SignIn;