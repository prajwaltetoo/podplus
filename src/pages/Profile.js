import React, { useEffect, useState } from 'react'
import Button from '../components/button/Button'
import { auth } from '../firebase';
import { useDispatch, useSelector } from 'react-redux';
import { clearUser } from '../slices/userSlice';
import { signOut } from 'firebase/auth';
import Header from '../components/header/Header';
import Loader from '../components/loader/Loader';
import FallbackUi from '../components/fallbackUi/FallbackUi';
import PodcastCard from '../components/podcastCard/PodcastCard';
import UpdateModal from '../components/updateModal/UpdateModal';
import { useLocation } from 'react-router-dom';

function Profile({setFlag}) {
    const user = useSelector(state => state.user.user)
    const podcasts = useSelector(state => state.podcasts.podcasts)
    const dispatch = useDispatch();
    const location = useLocation();

    const [showModal, setShowModal] = useState(false);

    const filteredPodcasts = podcasts.filter((podcast) => podcast.createBy.uid===user?.uid);

    useEffect(() => {
        setFlag(false);
    }, [location])

    const editProfile = () => {
        setShowModal(true);
    }

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            dispatch(clearUser());
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    if(!user) return (<Loader />)

    return (
        <div className='profile'>
            <Header />
            <h1>Your Profile</h1>
            <div className="profile-data">
                <div className="profile-img-box">
                    <img src={user.profileImage} />
                </div>
                <h1>{user.name}</h1>
                <div className="button-box">
                    <Button
                        onClick={editProfile}
                        text={ "Edit Profile" }
                    />
                    <Button
                        onClick={handleSignOut}
                        text={ "Sign Out" }
                    />
                </div>
            </div>
            <div className="podcast-wrapper">
                <h1>Your Podcasts</h1>
                <div className="podcast-container">
                    {filteredPodcasts.map(podcast => (
                        <PodcastCard key={podcast.id} podcast={podcast} />
                    ))}
                    {podcasts.length === 0 && <FallbackUi text={`You Haven't Created Podcast!!`} style={{height:'1rem'}} />}
                </div>
            </div>

            {
                showModal && <UpdateModal setShowModal={setShowModal} user={user} />
            }
        </div>
    )
}

export default Profile