import React, { useState } from "react";
import { Navbar, Nav, Container, Form, Button, Dropdown } from "react-bootstrap";
import "../../index.css";
import logoimage from "../../Assets/images/Edu_Logo.png";
import { useNavigate } from "react-router-dom";
import LoginSignup from "./LoginSignup";

const Header = () => {
  const loggedIn = localStorage.getItem("token");
  const navigate = useNavigate();
  const [modalShow, setModalShow] = useState(false);
  const role = localStorage.getItem("role")
  const handleLogout = () => {
    localStorage.clear();
    navigate(0);
  };

  return (
    <header>
      {/* Contact Info & Login/Signup Section */}
      <div
        className="header-top d-flex justify-content-between align-items-center"
        style={{
          backgroundColor: "#0f3460",
          color: "white",
          padding: "10px 20px",
          marginBottom: "0",
        }}
      >
        <div className="contact-info d-flex align-items-center gap-3">
          <p className="contact-link mb-0">
            <i className="fa-solid fa-phone-volume"></i> 123-456-7890
          </p>
          <p className="contact-link mb-0">
            <i className="fa-solid fa-envelope"></i> edusphere@gmail.com
          </p>
        </div>

        <div className="login_signup d-flex align-items-center gap-3">
          {!loggedIn ? (
            <p className="login-signup-link" onClick={() => setModalShow(true)}>
              <i className="fa-solid fa-sign-in-alt"></i> Login/Signup
            </p>
          ) : (
            <Dropdown>
              <Dropdown.Toggle variant="link" id="user-dropdown" style={{ color: "white", textDecoration: "none" }}>
                <i className="fa-solid fa-user"></i> My Account
              </Dropdown.Toggle>
              <Dropdown.Menu align="end">
                <Dropdown.Item href="/profile">
                  <i className="fa-solid fa-user"></i> Profile
                </Dropdown.Item>
                <Dropdown.Item onClick={handleLogout}>
                  <i className="fa-solid fa-sign-out-alt"></i> Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}
        </div>
      </div>

      {/* Navigation Bar */}
      <Navbar expand="lg" style={{ marginTop: "0", paddingTop: "0" }}>
        <Container fluid className="d-flex align-items-center" style={{ padding: "10px 20px" }}>
          {/* Logo & Name Section */}
          <div className="d-flex align-items-center">
            <Navbar.Brand href="/" className="d-flex align-items-center">
              <img src={logoimage} alt="EduSphere Logo" style={{ width: "100px", height: "auto" }} />
              <h3 className="mb-0">
                <span style={{ color: "#0f3460", fontWeight: "bold", fontFamily: "RobotoThin" }}>Edu</span>
                <span style={{ color: "#f7c221", fontWeight: "bold", fontFamily: "RobotoThin" }}>Sphere</span>
              </h3>
            </Navbar.Brand>

          </div>

          <Navbar.Toggle aria-controls="navbarScroll" className="ms-auto" />
          <Navbar.Collapse id="navbarScroll" className="justify-content-end">
            {/* Navbar Links (Right-Aligned) */}
            <Nav className="ms-auto">
              <Nav.Link href="/" style={{ color: "#0F3460", fontWeight: "bold" }}>Home</Nav.Link>
              {role == "Admin" && <Nav.Link href="/admin" style={{color: "#0F3460", fontWeight: "bold"}}>Dashboard</Nav.Link>}
              <Nav.Link href="/courses" style={{ color: "#0F3460", fontWeight: "bold" }}>Courses</Nav.Link>
              <Nav.Link href="/aboutUs" style={{ color: "#0F3460", fontWeight: "bold" }}>About Us</Nav.Link>
              <Nav.Link href="/contactUs" style={{ color: "#0F3460", fontWeight: "bold" }}>Contact Us</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <LoginSignup show={modalShow} handleClose={() => setModalShow(false)} setModalShow={setModalShow} />
    </header>
  );
};

export default Header;
