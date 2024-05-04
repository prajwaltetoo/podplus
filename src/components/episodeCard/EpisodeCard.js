import React, { useState } from 'react'
import './style.css'
import PlayButton from '../button/PlayButton';
import { FaPlay, FaPause } from "react-icons/fa"

function EpisodeCard({ episode, index, playingEpisode, setPlayingEpisode, isPlaying, setIsPlaying }) {


    const handlePlay = () => {
        setPlayingEpisode(playingEpisode===episode && isPlaying ? null : episode)
        if(playingEpisode===episode){
            if(isPlaying){
                setPlayingEpisode(null);
                setIsPlaying(false);
            }
            else{
                setIsPlaying(true);
            }
        }
        else{
            setPlayingEpisode(episode);
            setIsPlaying(true);
        }
    }

    return (
        <div className={`episode-card`} style={{border:`2px solid ${episode===playingEpisode?'var(--white)':'transparent'}`}}>
            <h3 className="episode-title">{index+1}. {episode.title}</h3>
            <p className="episode-description">{episode.description}</p>
            <PlayButton
                text={episode === playingEpisode && isPlaying ? (<><FaPause style={{paddingLeft: '.05rem'}} /></>) : (<><FaPlay style={{paddingLeft: '.2rem'}} /></>)}
                onClick={handlePlay}
            />
        </div>
    )
}

export default EpisodeCard