// importing required hooks
import { useState, useEffect } from 'react';

// importing react router dom hooks
import { useNavigate } from 'react-router-dom';

// importing firebase authentication methods
import { useAuthState } from "react-firebase-hooks/auth";
import {  createUserWithEmailAndPassword  } from 'firebase/auth';

// importing firebase database methods
import {auth,db} from '../../firebaseInit';
import { doc, setDoc } from "firebase/firestore";

// importing style of the component
import './SignUp.css';

// importing react toast
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignUp = ()=>{

    // using this hook to navigate to diffrent pages
    const navigate = useNavigate();


    // creating state to store the user email and passwords
    const [name, setName] = useState('');
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('');
    const [userAuth] = useAuthState(auth);


    useEffect(() => {
        
        if (userAuth) navigate("/");
    }, [userAuth]);
    
    // function to handle the signup of user using createUserWithEmailAndPassword method proivded by the firebase  
    const handleSignUp = async (e) => {
        try {
          e.preventDefault()
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;
          navigate('/signin');
          toast.success("Sign Up Successfull");
        //   console.log(user.uid);
          
          await setDoc(doc(db, "users", user.uid), {
              name,
              email,
              password,
              cart:[],
              order:[],
            });
            
        } 
        catch (error) {
            toast.error(error.code);
        }
     
   
    }


    return(
        <>
        <div className="SignUpFormContainer">
            <form className="SignupForm" onSubmit={handleSignUp}>
                <h2>Sign Up</h2>
                <input type="text" name="name" id="name" placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)} required/>
                <input type="email" name="email" id="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} required/>
                <input type="password" name="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} required/>
                <button>Sign Up</button>
            </form>
        </div>
        </>
        
    )
}

export default SignUp;