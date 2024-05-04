import React, { useEffect, useState } from 'react'
import './style.css'
import welcomeBanner from '../../assets/welcome-banner.png'

function Welcome({ setFlag }) {
    const [counter, setCounter] = useState(0);
    const [percent, setPercent] = useState(0);


    useEffect(() => {
        const interval = setInterval(() => {
            setCounter(prev => {
                let next = prev+1;
                if(next>=20) setPercent((next-20)<=100?(next-20):100);
                if(next === 150) setFlag(false);
                return next;
            })
        }, 25)

        return () => clearInterval(interval)
    }, [])

    return (
        <div className='welcome-page'>
            <div className="welcome-container">
                <img src={welcomeBanner} alt="" />
                <h1 className="welcome-msg">
                    Welcome To PodPulse
                </h1>
                <p className="intro">You Can Create, Listen, And Share Podcasts</p>
                <div className="progress">
                    <div className="progress-track">
                        <div className="progress-bar" style={{width: `${percent}%`}}></div>
                        <p className="progress-percent">{percent}%</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Welcome