import React from 'react'
import './style.css'
import { RWebShare } from 'react-web-share'
import { FaShareAlt } from "react-icons/fa";

function WebShare({ text, url, title }) {
    return (
        <div className='web-share'>
            <RWebShare
                data={{
                    text: text,
                    url: url,
                    title: title,
                }}
                onClick={() => console.log("shared successfully!")}
            >
                <FaShareAlt />
            </RWebShare>
        </div>
    )
}

export default WebShare