import React, { useState } from 'react'
import './style.css'

import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser, clearUser } from "../../slices/userSlice";

import { auth, db } from "../../firebase";
import { fetchSignInMethodsForEmail, sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import Input from '../input/Input';
import Button from '../button/Button';

import { toast } from "react-toastify";

function SignIn() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [flag, setFlag] = useState(true);

    const [email, setEmail] = useState("");
    const [emailFp, setEmailFp] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSignIn = async (e) => {
        e.preventDefault();
        // console.log("Button Clicked")

        setLoading(true);

        try{
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            // console.log("user",user);

            // add user in database in firestore
            const userDoc = await getDoc(doc(db, "users", user.uid))
            const userData = userDoc.data();

            // seting user in redux 
            dispatch(setUser({ 
                name: userData.name,// as name is not stored in user
                email: userData.email,
                uid: userData.uid,
            }))

            // console.log('Signed In Successfully!!');
            toast.success("Signed In Successfully!!")

            navigate('/profile');
        }
        catch(error){
            // console.log('Invalid Credential!!');
            toast.error('Invalid Credential!!')
        }
        finally{
            setLoading(false)
        }
    }

    const handleForgotPass = async () => {
        setLoading(true);
        if(emailFp){
            try {
                const signInMethods = await fetchSignInMethodsForEmail(auth, emailFp);
                console.log(signInMethods);
                if(true){
                    await sendPasswordResetEmail(auth, emailFp);
                    toast.success("Password Reset Email Sent Successfully!");
                    setEmailFp('');
                    setFlag(true)
                }
                else{
                    toast.error('This Email Is Not Registered!');
                }
            } catch (error) {
                toast.error(error.message);
            }
            finally{
                setLoading(false)
            }
        }
        else{
            toast.error('Enter Email to Reset Password!')
            setLoading(false)
        }
    }

    return (
        <>
            {
                flag ? (
                    <form className='sign-in' onSubmit={handleSignIn}>
                        <div className="form-wrapper">
                            <h1>Sign In</h1>
                            <Input
                                type="email"
                                placeholder="Email"
                                state={email}
                                setState={setEmail}
                                required={true}
                            />
                            <Input
                                type="password"
                                placeholder="Password"
                                state={password}
                                setState={setPassword}
                                required={true}
                            />

                            <p onClick={() => setFlag(false)}>Forgot Password? Click Here To Reset.</p>

                            <Button
                                type='submit'
                                onClick={() => {}}
                                disabled={loading}
                                text={ loading ? 'Loading...' : "Sign In" }
                            />
                        </div>
                    </form>
                ) : (
                    <div className='sign-in'>
                        <div className="form-wrapper">
                            <h1>Reset Password</h1>
                            <Input
                                type="email"
                                placeholder="Email"
                                state={emailFp}
                                setState={setEmailFp}
                            />

                            <Button
                                type='submit'
                                onClick={handleForgotPass}
                                disabled={loading}
                                text={ loading ? 'Loading...' : "Reset Password" }
                            />
                        </div>
                    </div>
                )
            }
        </>
    )
}

export default SignIn