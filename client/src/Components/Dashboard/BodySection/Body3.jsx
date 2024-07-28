import React from 'react'
import './body.css'
import Top from './TopSection/Top'
import Listing from './ListingSection/Listing'
import Activity from './ActivitySection/Activity'
import Top5 from './TopSection/Top5'
import Listing3 from './ListingSection/Listing3'

const Body3 = () => {
  return (
    <div className='mainContent'>
      <Top5/>
      <Listing3/>

      <div className="bottom flex">
        {/* <Listing />
        <Activity /> */}
      </div>
    </div>
  )
}

export default Body3