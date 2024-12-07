import { useState,React } from "react";
import { useNavigate } from "react-router-dom";

const SideBar = () => {
  

  const navigate=useNavigate();

  const handleLogout =() =>{
    localStorage.removeItem("token");
    localStorage.removeItem("userId");

    // Redirect to the login page
    navigate("/");

  };
  
  return (
    <>
      <div className="sidebar">
        <div className="logo-container">
          <img src="src/assets/sidebar-logo.png" alt="logo" className="logo" />
        </div>
        <ul className="menu">
          <li>
            <a href="/Home"><img src="src/assets/icons/house-door-fill.svg" className="icon" />Home</a>
          </li>
          <li>
            <a href="#dashboard"><img src="src/assets/icons/graph-up-arrow.svg" className="icon" />Dashboard</a>
          </li>
          <li>
            <a href="/profile"><img src="src/assets/icons/person-circle.svg" className="icon" />Profile</a>
          </li>
          <li>
            <a href="/settings"><img src="src/assets/icons/gear-fill.svg" className="icon" />Settings</a>
          </li>
          <li>
            <a href="#logout"  onClick={handleLogout}><img src="src/assets/icons/box-arrow-right.svg" className="icon" />Logout</a>
          </li>
        </ul>
      </div>
    </>
  );
};

export default SideBar;
