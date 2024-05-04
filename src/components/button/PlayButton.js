import React from 'react'
import './style.css'

function PlayButton({text, onClick, style}) {
    return (
        <div>
            <button className="play-button" onClick={onClick} style={style}>
                {text}
            </button>                        
        </div>
    )
}

export default PlayButton