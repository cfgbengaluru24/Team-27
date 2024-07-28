import React from 'react'
import './body.css'
import Top from './TopSection/Top'
import Listing from './ListingSection/Listing'
import Activity from './ActivitySection/Activity'
import Top2 from './TopSection/Top2'

const Body = () => {
  return (
    <div className='mainContent'>
      <Top />
      <Top2 />

      <div className="bottom flex">
        <Listing />
        <Activity />
      </div>
    </div>
  )
}

export default Body