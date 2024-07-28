import React from 'react'
import '../../App.css'
import Sidebar from '../Dashboard/SideBarSection/Sidebar'
import Body from '../Dashboard/BodySection/Body2'

const Orders = () => {
    return (
        <div className="dashboard flex">
            <div className="dashboardContainer flex">
                <Sidebar/>
                <Body/>
            </div>
        </div>
    )
}

export default Orders
