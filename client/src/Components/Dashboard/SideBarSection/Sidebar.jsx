import React from 'react'
import './sidebar.css'
import logo from '../../../Assets/logo.png'
import { IoMdSpeedometer } from 'react-icons/io'
import { MdDeliveryDining, MdOutlineExplore, MdOutlinePermContactCalendar } from 'react-icons/md'
import { BsTrophy, BsCreditCard2Front, BsQuestionCircle } from 'react-icons/bs'
import { AiOutlinePieChart } from 'react-icons/ai'
import { BiTrendingUp, BiLogOutCircle } from 'react-icons/bi'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  return (
    <div className='sideBar grid'>

      <div className="logoDiv flex">
        <img src={logo} alt="Logo" />
        <h2>Planti.</h2>
      </div>

      <div className="menuDiv">
        <h3 className="divTitle">
          QUICK MENU
        </h3>
        <ul className="menuLists grid">

          <li className="listItem">
          <NavLink to="/dashboard" className="menuLink flex">
              <IoMdSpeedometer className="icon" />
              <span className="smallText">
                Dashboard
              </span>
            </NavLink>
          </li>

          <li className="listItem">
            <NavLink to="/orders" className="menuLink flex">
              
              <MdDeliveryDining className="icon" />
              <span className="smallText">
                My Orders
              </span>
            </NavLink>
          </li>

          <li className="listItem">
            <NavLink to="/explore" className="menuLink flex">
              <MdOutlineExplore className="icon" />
              <span className="smallText">
                Explore
              </span>
            </NavLink>
          </li>

          <li className="listItem">
            <NavLink to="/products" className="menuLink flex">
              <BsTrophy className="icon" />
              <span className="smallText">
                Products
              </span>
            </NavLink>
          </li>
        </ul>
      </div>


      <div className="sideBarCard">
        <BsQuestionCircle className="icon" />
        <div className="cardContent">
          <div className="circle1"></div>
          <div className="circle2"></div>

          <h3>Help Center</h3>
          <p>Having trouble in Planti, please contact us from for more questions.</p>
          <button className="btn">Go to help center</button>
        </div>
      </div>
    </div>
  )
}

export default Sidebar