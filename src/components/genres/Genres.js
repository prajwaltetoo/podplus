import React from 'react'
import './style.css'

function Genres({ genres }) {
    return (
        <div className='genres'>
            {genres.map((genre, index) => (
                <div className="genre" key={index}>{genre}</div>
            ))}
        </div>
    )
}

export default Genres