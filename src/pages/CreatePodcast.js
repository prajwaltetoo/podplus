import React, { useEffect, useState } from 'react'
import Header from '../components/header/Header'
import Button from '../components/button/Button'
import Input from '../components/input/Input'
import FileInput from '../components/input/FileInput';
import { toast } from 'react-toastify';
import { db, storage } from '../firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { addDoc, collection } from 'firebase/firestore';
import { useDispatch, useSelector } from 'react-redux';
import { setPodcasts } from '../slices/podcastSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import MultiSelect from '../components/multiSelect/MultiSelect';

function CreatePodcast({setFlag}) {
    const user = useSelector(state => state.user.user);
    const podcasts = useSelector(state => state.podcasts.podcasts);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [options, setOptions] = useState([
        'News',
        'Comedy',
        'Technology',
        'Sports',
        'Business',
        'Health',
        'Crime'
    ]);
    const [bannerImage, setBannerImage] = useState(null);
    const [displayImage, setDisplayImage] = useState(null);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setFlag(false);
    }, [location])

    const handleCreatePodcast = async () => {
        if(title && desc && bannerImage && displayImage && selectedOptions.length){
            setLoading(true);
            try{
                const displayImageRef = ref(storage, `podcasts/${user.uid}/${Date.now()}`);
                await uploadBytes(displayImageRef, displayImage);
                const displayImageUrl = await getDownloadURL(displayImageRef);
        
                const bannerImageRef = ref(storage, `podcasts/${user.uid}/${Date.now()}`);
                await uploadBytes(bannerImageRef, bannerImage);
                const bannerImageUrl = await getDownloadURL(bannerImageRef);
        
                const newPodcastData = {
                    title,
                    description: desc,
                    bannerImage: bannerImageUrl,
                    displayImage: displayImageUrl,
                    genres: selectedOptions,
                    createBy: user
                }
        
                const docRef = await addDoc(collection(db, "podcasts"), newPodcastData);
                

                dispatch(setPodcasts([...podcasts, {...newPodcastData, id: docRef.id}]))
            
                setTitle('');
                setDesc('');
                setBannerImage(null);
                setDisplayImage(null);
    
                toast.success('New Podcast Created!!')
                navigate(`/podcast/${docRef.id}`)
            }
            catch(error){
                toast.error(error.message);
            }
            finally{
                setLoading(false);
            }
        }
        else{
            toast.error('Please Fill All The Details First!!')
        }
    }

    return (
        <div className='create-podcast'>
            <Header />

            <div className="form-container">
                <div className='create-podcast-form'>
                    <div className="form-wrapper">
                        <h1>Create New Podcast</h1>
                        <Input
                            type="text"
                            placeholder="Podcast Title"
                            state={title}
                            setState={setTitle}
                        />
                        <Input
                            type="text"
                            placeholder="Podcast Description"
                            state={desc}
                            setState={setDesc}
                        />
                        <MultiSelect
                            options={options}
                            setOptions={setOptions}
                            selectedOptions={selectedOptions}
                            setSelectedOptions={setSelectedOptions}
                            text={'Select Genres'}
                        />
                        <FileInput
                            id="banner-image"
                            onFileSelected={setBannerImage}
                            file={bannerImage}
                            accept={"image/*"}
                            text={'Banner'}
                        />
                        <FileInput
                            id="display-image"
                            onFileSelected={setDisplayImage}
                            file={displayImage}
                            accept={"image/*"}
                            text={'Display'}
                        />

                        <Button
                            type='submit'
                            onClick={handleCreatePodcast}
                            disabled={loading}
                            text={ loading ? 'Loading...' : "Create" }
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreatePodcast