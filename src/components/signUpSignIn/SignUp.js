import React, { useState } from 'react'
import './style.css'

import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser, clearUser } from "../../slices/userSlice";

import { auth, db, storage } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { addDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useAuthState } from "react-firebase-hooks/auth";

import Input from '../input/Input';
import Button from '../button/Button';
import FileInput from '../input/FileInput';

import { toast } from "react-toastify";

function SignUp() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [fullname, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [profileImage, setProfileImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSignUp = async (e) => {
        e.preventDefault();
        console.log("Button Clicked")
        
        setLoading(true);

        // create the user in firebase
        if(password === confirmPassword && password.length >= 6){
            try{
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                const ProfileImageRef = ref(storage, `users/${user.uid}/${Date.now()}`);
                await uploadBytes(ProfileImageRef, profileImage);
                const profileImageUrl = await getDownloadURL(ProfileImageRef);

                const newUserData = {
                    name: fullname,
                    email: user.email,
                    uid: user.uid,
                    profileImage: profileImageUrl
                }

                // add user in database in firestore
                await setDoc(doc(db, "users", user.uid), newUserData)

                // seting user in redux 
                dispatch(setUser(newUserData))

                toast.success("Successfully Signed Up!")

                navigate('/profile');
            }
            catch(error){
                toast.error(error.message)
            }
            finally{
                setLoading(false);
            }
        }
        else{
            setLoading(false);
            if(password !== confirmPassword){
                toast.error("Confirm Password not matched!")
            }
            else if(password < 6){
                toast.error("Password can't be less than 6!")
            }
        }
    }

    return (
        <form className='sign-up' onSubmit={handleSignUp}>
            <div className="form-wrapper">
                <h1>Sign Up</h1>
                <Input
                    type="text"
                    placeholder="Full Name"
                    state={fullname}
                    setState={setFullName}
                    required={true}
                />
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
                <Input
                    type="password"
                    placeholder="Confirm Password"
                    state={confirmPassword}
                    setState={setConfirmPassword}
                    required={true}
                />
                <FileInput
                    id="profile-image"
                    onFileSelected={setProfileImage}
                    file={profileImage}
                    accept={"image/*"}
                    text={'Profile Picture'}
                    required={true}
                />

                <Button
                    type='submit'
                    onClick={() => {}}
                    disabled={loading}
                    text={ loading ? 'Loading...' : "Sign Up" }
                />
            </div>
        </form>
    )
}

export default SignUp