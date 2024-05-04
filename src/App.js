import React, { useEffect, useState } from 'react'
import './App.css'
import SignUpSignInPage from './pages/SignUpSignInPage'
import { ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
import { Route, Routes } from 'react-router-dom';
import Profile from './pages/Profile';
import Podcasts from './pages/Podcasts';
import CreatePodcast from './pages/CreatePodcast';
import PodcastDetails from './pages/PodcastDetails';
import CreateEpisode from './pages/CreateEpisode';
import PrivateRoutes from './components/PrivateRoutes';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from './firebase';
import { useDispatch } from 'react-redux';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { setUser } from './slices/userSlice';
import { setPodcasts } from './slices/podcastSlice';
import Welcome from './components/welcomePage/Welcome';

function App() {
    const [user, loading, error] = useAuthState(auth);
    const dispatch = useDispatch();

    const [flag, setFlag] = useState(true);

    // useEffect(() => {
    //     setTimeout(() => {
    //         setFlag(false);
    //     }, 3500)
    // }, [])

    useEffect(() => {
        const fetchUser = async () => {
            if(user && !error){
                // Update user according to the auth
                const userDoc = await getDoc(doc(db, "users", user.uid))
                const userData = userDoc.data();
                dispatch(setUser({
                    name: userData?.name,
                    email: userData?.email,
                    uid: userData?.uid,
                    profileImage: userData?.profileImage
                }))
            }
        }

        fetchUser();

        return fetchUser;
    }, [user])

    useEffect(() => {
        const fetchPodcasts = async () => {
            if(true){
                // Update podcasts according to the auth
                const podcastsCollectionRef = collection(db, "podcasts");
                // console.log(podcastsCollectionRef);
                const podcastsData = await getDocs(podcastsCollectionRef);
                const podcasts = [];
                podcastsData.forEach(doc => {
                    podcasts.push({...doc.data(), id: doc.id});
                });
                dispatch(setPodcasts(podcasts))
            }
        }

        fetchPodcasts();

        return fetchPodcasts;
    }, [])

    return (
        <div className='app'>
            <ToastContainer />
            <Routes>
                <Route path="/" element={<SignUpSignInPage welcomeFlag={flag} setWelcomeFlag={setFlag} />} />
                <Route path="/podcasts" element={<Podcasts setFlag={setFlag} />} />
                <Route path="/podcast/:id" element={<PodcastDetails setFlag={setFlag} />} />
                <Route element={<PrivateRoutes />}>
                    <Route path="/profile" element={<Profile setFlag={setFlag} />} />
                    <Route path="/create-podcast" element={<CreatePodcast setFlag={setFlag} />} />
                    <Route
                        path="/podcast/:id/create-episode"
                        element={<CreateEpisode setFlag={setFlag} />}
                    />
                </Route>
            </Routes>
            {/* {flag && <Welcome setFlag={setFlag} />} */}
        </div>
    )
}

export default App