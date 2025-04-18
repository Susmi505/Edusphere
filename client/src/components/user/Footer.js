import React from "react";
import { useSpring, animated } from "@react-spring/web";
import "../../index.css";
import logoimage from "../../Assets/images/Edu_Logo.png";
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const animationProps = useSpring({
    opacity: 1,
    transform: "translateY(0px)",
    from: { opacity: 0, transform: "translateY(20px)" },
    config: { tension: 170, friction: 26 },
  });

  const navigate = useNavigate();

  const handleContactClick = () => {
    navigate('/contactUs');
  };

  return (
    <>

      <nav className="navbar navbar-expand-lg navbar-light bg-light"></nav>
      <div className="footer">
      <animated.div style={animationProps} className="floating-box">
        <p className="text-lg font-medium">Let’s talk about the courses</p>
        <button className="contact-btn" onClick={handleContactClick}>Contact us</button>
        
      </animated.div>
        <div className="footer-container text-center">
          <div className="row">
            <div className="col-md-6 col-lg-5 col-12 footer-1">
              <h3>
                <img src={logoimage} className="navbar-brand" alt="Logo" />
               
                <span
                  style={{
                    color: "#0f3460",
                    fontWeight: "bold",
                    fontFamily: "RobotoThin",
                  }}
                >
                  Edu
                </span>
                <span
                  style={{
                    color: "#f7c221",
                    fontWeight: "bold",
                    fontFamily: "RobotoThin",
                  }}
                >
                  Sphere
                </span>
              
              </h3>
              <p>
              EduSphere, a modern Learning Management System designed to make education accessible, engaging, and efficient.
              </p>
              <div className="social-icons">
                <i className="fa-brands fa-facebook"></i>
                <i className="fa-brands fa-twitter"></i>
                <i className="fa-brands fa-instagram"></i>
                <i className="fa-brands fa-linkedin-in"></i>
              </div>
            </div>

            <div className="col-md-6 col-lg-3 col-12 footer-2">
              <h4>Quick Links</h4>
              <ul>
                <li className="nav-item">
                  <a className="" href="/">
                    Home
                  </a>
                </li>
                <li className="nav-item">
                  <a className="" href="/courses">
                    Courses
                  </a>
                </li>
                <li className="nav-item">
                  <a className="" href="/contactUs">
                    Contact Us
                  </a>
                </li>
                <li className="nav-item">
                  <a className="" href="/aboutUs">
                    About Us
                  </a>
                </li>
              </ul>
            </div>
            <div className="col-md-6 col-lg-4 col-12 footer-3">
              <h4>Contact Info</h4>
              <p>
                <i className="fa-solid fa-phone-volume"></i>1234567890
              </p>
              <p>
                <i className="fa-solid fa-envelope"></i>edusphere@gmail.com
              </p>
              <p>
                <i className="fa-solid fa-location-dot"></i>62A Churchill street,Waterloo, Ontario
              </p>
            </div>
          </div>
        </div>
        <div className="copyright">
          <p>@copyright Group4</p>
        </div>
      </div>
    </>
  );
};

export default Footer;
