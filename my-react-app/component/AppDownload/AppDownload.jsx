import React from 'react'
import './AppDownload.css'
import { assets } from '../../src/assets/assets'

const AppDownload = () => {
  return (
    <div className='app-download' id='app-download'>
        <p> For Better Experience Download <br /> Tomato apps</p>
        <div className="app-download-platform">
            <img src={assets.play_store} alt=''/>
            <img src={assets.app_store} alt=''/>
        </div>

    </div>
  )
}

export default AppDownload