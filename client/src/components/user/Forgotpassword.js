import React, { useState, useEffect } from 'react';
import '../../index.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Modal } from "react-bootstrap";
import { BsEye, BsEyeSlash } from 'react-icons/bs';

const Forgotpassword = ({ show, handleClose, setModalShow }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cpassword, setCpassword] = useState('');
  const [activeLogin, setActiveLogin] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);
  const API_BASE = process.env.REACT_APP_API_URL;

  function SwitchContent() {
    setActiveLogin(!activeLogin);
    setErrorMessage('');
    setEmail('');
  }

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (password !== cpassword) {
      setErrorMessage("Passwords don't match");
      return;
    } else if (!password.trim() || password.length < 6) {
      setErrorMessage("Password must be at least 6 characters");
      return;
    }
    try {
      const result = await axios.post(`${API_BASE}/resetpassword`, { email, password });
      if (result.status === 200) {
        setErrorMessage(result.data.message);
        navigate('/');
      }
    } catch (error) {
      setErrorMessage(error.response?.data.message || "Something went wrong. Please try again.");
    }
  };

  const handleCheckEmail = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMessage("Email is required!");
      return;
    }
    try {
      const result = await axios.post(`${API_BASE}/getEmail`, { email });
      if (result.data === "Success") {
        setActiveLogin(false); // Show password reset form
        setErrorMessage("");
      } else {
        setErrorMessage(result.data); // Show error message from server
      }
    } catch (error) {
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  const handleBacktologin = () => {
    handleClose();
    setModalShow(true);
    setActiveLogin(true);
    setErrorMessage("");
    setEmail('');
    setShowCPassword(false)
    setShowPassword(false)
  };

  useEffect(() => {
    if (!show) {
      setEmail("");
      setPassword("");
      setCpassword('');
      setActiveLogin(true);
      setErrorMessage('');
      setShowCPassword(false)
      setShowPassword(false)
    }
  }, [show]);

  return (
    <>
      <Modal show={show} onHide={handleClose} centered dialogClassName="custom-modal">
        <Modal.Body>
          <div className={`content justify-content-center align-items-center d-flex shadow-lg ${activeLogin ? "" : "active"}`} id="content">
            <div className="col-md-6 d-flex justify-content-center">
            <form onSubmit={handleUpdatePassword} className={`reset-form ${!activeLogin ? "active" : ""}`}>
                <div className="header-text mb-4">
                  <h1>Reset Password</h1>
                </div>
                <div className="input-group mb-3">
                  <input type="email"
                    name="email"
                    id="email"
                    readOnly
                    value={email}
                    placeholder="Email id"
                    className="form-control bg-light"
                  />
                </div>
                <div className="input-group mb-3">
                  <input 
                  type={showPassword ? 'text' : 'password'}
                    name="password"
                    id="password"
                    onChange={e => setPassword(e.target.value)}
                    placeholder="New password"
                    className="form-control bg-light"
                  />
                   <span
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        top: '50%',
                        zIndex:100,
                        right: '10px',
                        transform: 'translateY(-50%)',
                        cursor: 'pointer',
                        color: '#666',
                        fontSize: '1.2rem'
                      }}
                    >
                      {showPassword ? <BsEye />  :<BsEyeSlash /> }
                    </span>
                </div>
                <div className="input-group mb-3">
                  <input type={showCPassword ? 'text' : 'password'}
                    id="cpassword"
                    name="cpassword"
                    onChange={e => setCpassword(e.target.value)}
                    placeholder="Confirm password"
                    className="form-control bg-light"
                  />
                   <span
                      onClick={() => setShowCPassword(!showCPassword)}
                      style={{
                        position: 'absolute',
                        top: '50%',
                        zIndex:100,
                        right: '10px',
                        transform: 'translateY(-50%)',
                        cursor: 'pointer',
                        color: '#666',
                        fontSize: '1.2rem'
                      }}
                    >
                      {showCPassword ? <BsEye />  :<BsEyeSlash /> }</span>
                </div>
                {errorMessage && <div className="text-danger mb-3">{errorMessage}</div>}
                <div className="input-group justify-content-end">
                  <div className="forgot">
                    <a className="hidden fs-6 pe-auto link-custom" onClick={SwitchContent}>Find another email?</a>
                  </div>
                </div>
                <div className="input-group justify-content-end d-md-none mt-2">
    <span onClick={handleBacktologin} className="link-custom fs-6">Back to Login?</span>
  </div>
                <div className="input-group mb-3 justify-content-center">
                  <input className="butn border-white text-white fs-6 custombtn" value="Reset Password" type="submit" />
                </div>
              </form>
            </div>
            <div className="col-md-6 login-box">
            <form onSubmit={handleCheckEmail} className={`email-form ${!activeLogin ? "d-none" : ""}`}>

                <div className="header-text mb-4">
                  <h1>Find your email</h1>
                </div>
                <div className="input-group mb-3">
                  <input type="email"
                    name="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Enter Your Email"
                    className="form-control bg-light"
                  />
                </div>
                {errorMessage && <div className="text-danger mb-3">{errorMessage}</div>}
                <div className="input-group justify-content-end">
                  <div className="forgot">
                    <span onClick={handleBacktologin} className="link-custom">Back to Login?</span>
                  </div>
                </div>
                <div className="input-group mb-3 justify-content-center">
                  <input className="butn fs-6 custombtn" value="Find Email" type="submit" />
                </div>
              </form>
            </div>

            {/* Switch Panel */}
            <div className="switch-content">
              <div className="switch">
                <div className="switch-panel switch-left">
                  <h1>Hello, Again</h1>
                  <p>We are happy to see you back</p>
                  <span className="hidden btn border-white text-white w-50 fs-6" id="signup" onClick={handleBacktologin}>Back to Login?</span>
                </div>
                <div className="switch-panel switch-right">
                  <h1>Welcome</h1>
                  <p>Join our platform</p>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Forgotpassword;
