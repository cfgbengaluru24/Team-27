import React from 'react'
import '../../App.css'
import Sidebar from '../Dashboard/SideBarSection/Sidebar'
import Body3 from '../Dashboard/BodySection/Body3'

const Explore = () => {
    return (
        <div className="dashboard flex">
            <div className="dashboardContainer flex">
                <Sidebar/>
                <Body3/>
            </div>
        </div>
    )
}

export default Explore
