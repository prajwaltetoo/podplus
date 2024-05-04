import React, { useState, useRef, useEffect } from "react";
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from "react-icons/fa"
import './style.css'

function AudioPlayer({ episode, displayImage, isPlaying, setIsPlaying }) {
    // const [isPlaying, setIsPlaying] = useState(true);
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState(1);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef();

    const [currentVolume, setCurrentVolume] = useState(1);

    useEffect(() => {
        if(!episode) return
        audioRef.current.play();
        setIsPlaying(true);
    }, [episode])

    useEffect(() => {
        if(!episode) return
        if (isPlaying) {
            audioRef.current.play();
        }
        else {
            audioRef.current.pause();
        }
    }, [isPlaying]);

    useEffect(() => {
        const audio = audioRef.current;
        audio.addEventListener("timeupdate", handleTimeUpdate);
        audio.addEventListener("loadedmetadata", handleLoadedMetadata);
        audio.addEventListener("ended", handleEnded);

        return () => {
            audio.removeEventListener("timeupdate", handleTimeUpdate);
            audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
            audio.removeEventListener("ended", handleEnded);
        };
    }, []);

    useEffect(() => {
        if(volume != 0){
            setCurrentVolume(volume);
        }
        audioRef.current.volume = volume;
        setIsMuted(volume==0)
    }, [volume]);

    
    const toggleMute = () => {
        if(isMuted){
            setIsMuted(false);
            setVolume(currentVolume);
        }
        else{
            setIsMuted(true);
            setVolume(0);
        }
    }

    const handleTimeUpdate = () => {
        setCurrentTime(audioRef.current.currentTime);
    };

    const handleLoadedMetadata = () => {
        setDuration(audioRef.current.duration);
    };

    const handleEnded = () => {
        setCurrentTime(0);
        setIsPlaying(false);
    };

    const handleDurationChange = (e) => {
        const newTime = e.target.value;
        setCurrentTime(newTime);
        audioRef.current.currentTime = newTime;
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

    return (
        <div className='audio-player'>
            <audio ref={audioRef} src={episode.audio} />

            <div className="episode-details">
                <img src={displayImage} className="player-image" />
                <h5 className="episode">
                    <marquee behavior="" direction="" scrollamount="3">
                        {episode.title}
                    </marquee>
                </h5>
            </div>

            <div className="play-controll">
                <button onClick={() => setIsPlaying(!isPlaying)}>
                    {isPlaying ? <FaPause /> : <FaPlay />}
                </button>

                <div className="time-info">
                    <span className="current-time">{formatTime(currentTime)}</span>
                    <input
                        type="range"
                        className="duration-bar"
                        min="0"
                        max={duration}
                        step="0.001"
                        value={currentTime}
                        onChange={handleDurationChange}
                    />
                    <span className="remaining-time">
                        -{formatTime(duration - currentTime)}
                    </span>
                </div>
            </div>

            <div className="volume-controll">
                <button onClick={toggleMute}>
                    {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                </button>

                <input
                    className="sound-bar"
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(e) => setVolume(e.target.value)}
                />
            </div>
        </div>
    )
}

export default AudioPlayer