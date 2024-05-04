import React, { useEffect, useState } from 'react'
import Header from '../components/header/Header'
import { useSelector } from 'react-redux'
import PodcastCard from '../components/podcastCard/PodcastCard'
import Input from '../components/input/Input'
import FallbackUi from '../components/fallbackUi/FallbackUi'
import MultiSelect from '../components/multiSelect/MultiSelect'
import { useLocation } from 'react-router-dom'

function Podcasts({setFlag}) {
    const podcasts = useSelector(state => state.podcasts.podcasts)
    const [search, setSearch] = useState('')
    const location = useLocation();

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


    const filteredPodcasts = podcasts.filter((podcast) => {
        const titleMatch = podcast.title.toLowerCase().includes(search.trim().toLowerCase());
        const genreMatch = selectedOptions.length === 0 || selectedOptions.some(option => podcast.genres.includes(option));

        return titleMatch && genreMatch;
    });

    useEffect(() => {
        setFlag(false);
    }, [location])

    return (
        <div>
            <Header />
            <div className="podcast-wrapper">
                <h1>Discover Podcasts</h1>
                <div className="filter-box">
                    <Input
                        type="search"
                        placeholder="Search By Title..."
                        state={search}
                        setState={setSearch}
                    />
                    <MultiSelect
                        options={options}
                        setOptions={setOptions}
                        selectedOptions={selectedOptions}
                        setSelectedOptions={setSelectedOptions}
                        text={'Filter By Genres...'}
                    />
                </div>
                <div className="podcast-container">
                    {filteredPodcasts.map(podcast => (
                        <PodcastCard key={podcast.id} podcast={podcast} />
                    ))}
                    {podcasts.length === 0 && <FallbackUi text={'There Is No Podcast!!'} style={{height:'8rem'}} />}
                    {podcasts.length !== 0 && filteredPodcasts.length === 0 && <FallbackUi text={'No Podcast Found!!'} style={{height:'8rem'}} />}
                </div>
            </div>
        </div>
    )
}

export default Podcasts