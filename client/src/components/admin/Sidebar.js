import React from "react";
import { Link } from "react-router-dom";
import {
  BsGrid1X2Fill,
  BsFillArchiveFill,
  BsFillGrid3X3GapFill,
  BsPeopleFill,
  BsListCheck,
  BsMenuButtonWideFill,
  BsFillGearFill,
  BsCreditCard 
} from "react-icons/bs";
import { Navbar } from "react-bootstrap";
import logoimage from "../../Assets/images/Edu_Logo.png";

function Sidebar({ openSidebarToggle, OpenSidebar }) {
  return (
    <aside id="sidebar" className={openSidebarToggle ? "sidebar sidebar-responsive" : "sidebar"}>
      <div className="sidebar-title">
        <div className="sidebar-brand">
          <div className="d-flex align-items-center logo">
            <Navbar.Brand href="/" className="align-items-center">
              <img
                src={logoimage}
                alt="EduSphere Logo"
                style={{ width: "70%", height: "auto", marginLeft: "20px" }}
              />
              <h3 className="mb-0">
                <span style={{ color: "#0f3460", fontWeight: "bold", fontFamily: "RobotoThin", marginLeft: "20px" }}>
                  Edu
                </span>
                <span style={{ color: "#f7c221", fontWeight: "bold", fontFamily: "RobotoThin" }}>
                  Sphere
                </span>
              </h3>
            </Navbar.Brand>
          </div>
        </div>
        {/* Close Sidebar Button */}
        <span className="icon close_icon" onClick={OpenSidebar}>X</span>
      </div>

      <ul className="sidebar-list">
        <li className="sidebar-list-item"><Link to="/admin"><BsGrid1X2Fill className="icon" /> Dashboard</Link></li>
        <li className="sidebar-list-item"><Link to="/admin/Courses"><BsFillArchiveFill className="icon" /> Courses</Link></li>
        <li className="sidebar-list-item"><Link to="/admin/Category"><BsFillGrid3X3GapFill className="icon" /> Category</Link></li>
        <li className="sidebar-list-item"><Link to="/admin/Users"><BsPeopleFill className="icon" /> Users</Link></li>
        <li className="sidebar-list-item"><Link to="/admin/Questions"><BsListCheck className="icon" /> Questions</Link></li>
        {/* <li className="sidebar-list-item"><Link to="/admin/Certificates"><BsMenuButtonWideFill className="icon" /> Certificates</Link></li> */}
        <li className="sidebar-list-item"><Link to="/admin/Payments"><BsCreditCard className="icon" /> Payments</Link></li>
        {/* <li className="sidebar-list-item"><Link to="/admin/Settings"><BsFillGearFill className="icon" /> Settings</Link></li> */}
      </ul>
    </aside>
  );
}

export default Sidebar;
