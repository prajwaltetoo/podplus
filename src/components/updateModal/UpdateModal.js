import React, { useEffect, useState } from 'react'
import './style.css'
import Button from '../button/Button'
import Input from '../input/Input'
import { RiImageEditFill } from "react-icons/ri";
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from '../../firebase';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { doc, updateDoc } from 'firebase/firestore';
import { setUser } from '../../slices/userSlice';

function UpdateModal({ setShowModal, user }) {
    const dispatch = useDispatch();
    const [name, setName] = useState(user?.name);
    const [profileImage, setProfileImage] = useState('');
    const [previewImage, setPreviewImage] = useState(user.profileImage)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if(profileImage){
            const path = URL.createObjectURL(profileImage);
            setPreviewImage(path);
        }
    }, [profileImage])

    useEffect(() => {
        document.body.style.overflow = 'hidden'
        return () => document.body.style.overflow = 'auto'
    }, [])

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setProfileImage(e.target.files[0]);
        }
    };

    const handleUpdate = async () => {
        setLoading(true)
        if(name){
            try{
                if(profileImage){
                    const docRef = doc(db, 'users', user.uid);

                    const ProfileImageRef = ref(storage, `users/${user.uid}/${Date.now()}`);
                    await uploadBytes(ProfileImageRef, profileImage);
                    const profileImageUrl = await getDownloadURL(ProfileImageRef);
            
                    const newData = {
                        ...user,
                        name: name,
                        profileImage: profileImageUrl
                    };

                    await updateDoc(docRef, newData);
                    dispatch(setUser(newData))                
                }
                else {
                    const docRef = doc(db, 'users', user.uid);
            
                    const newData = {
                        ...user,
                        name: name
                    };

                    await updateDoc(docRef, newData);
                    dispatch(setUser(newData))
                }
        
        
                toast.success('Profile Updated Successfully!');
                
                setShowModal(false);        
            }
            catch(error){
                toast.error(error.message);
            }
            finally{
                setLoading(false);
            }
        }
        else{
            toast.error('Fill All The Details');
            setLoading(false)
        }
    }

    return (
        <div className='update-modal'>
            <div className="modal-container">
                <h2>Edit Profile</h2>
                <label htmlFor='profile-pic' className='profile-pic'>
                    <img src={previewImage} alt="" />
                    <div className="label-overlay">
                        <RiImageEditFill />
                    </div>
                    <input 
                        type="file"
                        name="profile-pic"
                        id="profile-pic"
                        onChange={handleFileChange}
                        style={{display: 'none'}}
                        accept={'image/*'}
                    />
                </label>
                <div className="button-box">
                    <Input
                        type="text"
                        placeholder="Fullname"
                        state={name}
                        setState={setName}
                    />
                    <Button
                        onClick={handleUpdate}
                        disabled={loading}
                        text={ loading?'Loading...':"Update" }
                    />
                    <Button
                        onClick={() => setShowModal(false)}
                        text={ "Discard" }
                    />
                </div>
            </div>
        </div>
    )
}

export default UpdateModal