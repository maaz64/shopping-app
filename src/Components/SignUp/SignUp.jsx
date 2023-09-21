import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from "react-firebase-hooks/auth";
import {  createUserWithEmailAndPassword  } from 'firebase/auth';
import {auth,db} from '../../firebaseInit';
import { doc, setDoc } from "firebase/firestore";
import './SignUp.css';

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignUp = ()=>{

    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('');
    const [userAuth] = useAuthState(auth);


    useEffect(() => {
        
        if (userAuth) navigate("/");
    }, [userAuth]);
 
    const handleSubmit = async (e) => {
        try {
          e.preventDefault()
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;
        //   console.log(user);
          navigate('/signin');
          toast.success("Sign Up Successfull");
          
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
            <form className="SignupForm" onSubmit={handleSubmit}>
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