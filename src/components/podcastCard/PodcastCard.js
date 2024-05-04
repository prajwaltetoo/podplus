import React from 'react'
import { Link } from 'react-router-dom'
import './style.css'
import Genres from '../genres/Genres'

function PodcastCard({podcast}) {
  return (
    <Link to={`/podcast/${podcast.id}`}>
        <div className="podcast-card">
            <div className="display-img-box">
              <img className='display-image' src={podcast.displayImage} alt="" />
              <Genres genres={podcast.genres} />
            </div>
            <div className="details-box">
              <p className="podcast-title">{podcast.title}</p>        
              <p className="create-by">Created By {podcast.createBy.name}</p>        
            </div>
        </div>
    </Link>
  )
}

export default PodcastCard