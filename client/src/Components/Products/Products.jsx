import React from 'react'
import '../../App.css'
import Sidebar from '../Dashboard/SideBarSection/Sidebar'
import Body4 from '../Dashboard/BodySection/Body4'



const Products = () => {
    return (
        <div className="dashboard flex">
            <div className="dashboardContainer flex">
                <Sidebar/>
                <Body4/>
            </div>
        </div>
    )
}

export default Products
