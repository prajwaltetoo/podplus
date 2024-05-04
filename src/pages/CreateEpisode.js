import React, { useEffect, useState } from 'react'
import Header from '../components/header/Header'
import FileInput from '../components/input/FileInput';
import Input from '../components/input/Input';
import Button from '../components/button/Button';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { addDoc, collection, doc, getDoc } from 'firebase/firestore';
import { auth, db, storage } from '../firebase';
import { toast } from 'react-toastify';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import Loader from '../components/loader/Loader';
import FallbackUi from '../components/fallbackUi/FallbackUi';

function CreateEpisode({setFlag}) {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [podcast, setPodcast] = useState(null);

    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [audio, setAudio] = useState(null);

    const [loading, setLoading] = useState(false);
    const [dataLoading, setDataLoading] = useState(false);

    useEffect(() => {
        setFlag(false);
    }, [location])

    const handleCreateEpisode = async (e) => {
        e.preventDefault();
        setLoading(true);
        if(title && desc && audio && id){
            try{
                const audioRef= ref(storage, `/podcast-audio/${auth.currentUser.uid}/${Date.now()}`);

                await uploadBytes(audioRef,audio);

                const downloadedUrl = await getDownloadURL(audioRef);

                const episodeData ={
                    title:title,
                    description:desc,
                    audio:downloadedUrl,
                }

                await addDoc(collection(db, 'podcasts', id, "episodes"), episodeData);
                
                toast.success('Episode Created Successfully!')

                setTitle('');
                setDesc('');
                setAudio(null);

                navigate(`/podcast/${id}`)
            }
            catch(error){
                toast.error(error.message);
            }
            finally{
                setLoading(false);
            }
        }
        else{
            toast.error("Please Fill All The Details!")
            setLoading(false);
        }
    }

    useEffect(() => {
        const getPodcast = async () => {
            setDataLoading(true);
            if(id) {
                try{
                    const podcastDoc = await getDoc(doc(db, "podcasts", id))
                    const podcastData = podcastDoc.data();
                    
                    setPodcast(podcastData);
                }
                catch(error){
                    setPodcast(null);
                }
                finally{
                    setDataLoading(false);
                }
            }
            else{
                setPodcast(null);
                setDataLoading(false);
            }
        }

        getPodcast();
    }, [id])


    if(dataLoading) {
        return <Loader />
    }

    if(!podcast){
        return <FallbackUi text={'This Is Not A Valid Address!!'} />
    }

    if(podcast?.createBy.uid !== auth.currentUser.uid){
        return <FallbackUi text={"You Can't Have Access To This Page!!"} />
    }

    return (
        <div className='create-episode'>
            <Header />
            <div className="form-container">
                <form className='create-episode-form' onSubmit={handleCreateEpisode}>
                    <div className="form-wrapper">
                        <h1>Create New Episode</h1>
                        <Input
                            type="text"
                            placeholder="Episode Title"
                            state={title}
                            setState={setTitle}
                        />
                        <Input
                            type="text"
                            placeholder="Episode Description"
                            state={desc}
                            setState={setDesc}
                        />
                        <FileInput
                            id="audio-input"
                            onFileSelected={setAudio}
                            file={audio}
                            accept={"audio/*"}
                            text={'Audio'}
                        />

                        <Button
                            type='submit'
                            onClick={() => {}}
                            disabled={loading}
                            text={ loading ? 'Loading...' : "Create" }
                        />
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateEpisode