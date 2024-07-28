import React from 'react'
import './body.css'
import Top from './TopSection/Top'

import Activity from './ActivitySection/Activity'
import Listing2 from './ListingSection/Listing2'
import Top4 from './TopSection/Top4'

const Body4 = () => {
  return (
    <div className='mainContent'>
      <Top />
      
      <div className="bottom flex">
        <Listing2/>
        {/* <Activity /> */}
      </div>
    </div>
  )
}

export default Body4