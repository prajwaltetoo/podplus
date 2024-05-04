import React from 'react'
import './style.css'

function FallbackUi({text, style}) {
    return (
        <div className='fallback-ui' style={style}>
            <p>{text}</p>
        </div>
    )
}

export default FallbackUi