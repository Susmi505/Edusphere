import React from "react";
import { BsJustify, BsBoxArrowRight } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

function Header({ toggleSidebar }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear any stored authentication data (if using localStorage/sessionStorage)
    localStorage.removeItem("authToken");
    localStorage.clear();
    // Redirect to the Home page
    navigate("/");
  };

  return (
    <header className="header">
      {/* Sidebar Toggle Button */}
      <div className="menu-icon" onClick={toggleSidebar}>
        <BsJustify className="icon" />
      </div>

      <div style={{ flex: 1 }}></div> {/* Spacing div */}

      {/* Logout Button */}
      <div className="header-right">
        <button className="logout-button" onClick={handleLogout}>
          {/* <BsBoxArrowRight className="icon" /> */}
          Sign Out
        </button>
      </div>
    </header>
  );
}

export default Header;
