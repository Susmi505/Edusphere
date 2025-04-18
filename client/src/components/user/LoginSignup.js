import React, { useEffect, useState } from 'react';
import '../../index.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Modal } from "react-bootstrap";
import Forgotpassword from './Forgotpassword';
import { BsEye, BsEyeSlash } from 'react-icons/bs';

export default function LoginSignup({ show, handleClose, setModalShow }) {
    const navigate = useNavigate();
    const [activeLogin, setActiveLogin] = useState(true);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmpassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [errors, setErrors] = useState({});
    const [showForgotModal, setShowForgotModal] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showCPassword, setShowCPassword] = useState(false);
    const [showLPassword, setShowLPassword] = useState(false);
    const API_BASE = process.env.REACT_APP_API_URL;

    function SwitchContent() {
        setActiveLogin(!activeLogin);
        setMessage("");
        setErrors({});
        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setShowCPassword(false)
        setShowPassword(false)
        setShowLPassword(false)
    }

    const isValidEmail = (email) => {
        return /\S+@\S+\.\S+/.test(email);
    };

    const validateForm = () => {
        let errors = {};
        if (!firstName.trim()) errors.firstName = "First name is required";
        if (!lastName.trim()) errors.lastName = "Last name is required";
        if (!email.trim()) errors.email = "Email is required";
        else if (!isValidEmail(email)) errors.email = "Invalid email format";

        if (!password) errors.password = "Password is required";
        else if (password.length < 6) errors.password = "Password must be at least 6 characters";

        if (!confirmpassword) errors.confirmpassword = "Confirm password is required";
        else if (password !== confirmpassword) errors.confirmpassword = "Passwords must match";

        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const response = await axios.post(`${API_BASE}/register`, { firstName, lastName, email, password });
                setMessage(response.data.message);
                if (response.status === 201) {
                    setFirstName("");
                    setLastName("");
                    setEmail("");
                    setPassword("");
                    setConfirmPassword("");
                    setActiveLogin(true);
                }
            } catch (error) {
                setMessage(error.response?.data?.message || "An error occurred");
            }
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            setErrors({
                email: !email ? "Email is required" : "",
                password: !password ? "Password is required" : ""
            });
            return;
        }
        try {
            const response = await axios.post(`${API_BASE}/login`, { email, password });
            if (response.data.message === "Success") {
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("role", response.data?.user?.role);

                handleClose();
                if (response.data.user.role === "Admin") {
                    navigate("/admin");
                } else {
                    navigate("/");
                }
            } else {
                setErrors({ general: response.data.message });
            }
        } catch (error) {
            setErrors({ general: error.response?.data?.message || "Something went wrong. Please try again later." });
        }
    };

    const handleForgotpassword = () => {
        handleClose();
        setShowForgotModal(true);
        setMessage("");
    };

    useEffect(() => {
        if (!show) {
            setFirstName("");
            setLastName("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            setMessage("");
            setActiveLogin(true);
            setErrors({});
        }
    }, [show]);

    return (
        <>
            <Modal show={show} onHide={handleClose} centered dialogClassName="custom-modal">
                <Modal.Body>
                    <div className={`content justify-content-center align-items-center d-flex shadow-lg ${activeLogin ? "" : "active"}`} id="content">
                        {/*---------------------------- SIGNUP form ---------------------------------------*/}
                        {/* Show Signup Form for Desktop and Tablet */}
                        <div className={`col-md-6 login-box ${activeLogin ? "d-none d-md-block" : ""}`}>
                            <form onSubmit={handleSignup}>
                                <div className='header-text mb-4'>
                                    <h1>Signup</h1>
                                </div>
                                {message && <p className={`${message === "Account created successfully" ? "text-success" : "text-danger"}`}>{message}</p>}
                                <div className='input-group mb-3'>
                                    <input type='text'
                                        placeholder='Enter Your Firstname'
                                        name='firstname'
                                        id='firstname'
                                        className='form-control bg-light'
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                    />
                                    {errors.firstName && <p className="text-danger small m-0 w-100">{errors.firstName}</p>}
                                </div>
                                <div className='input-group mb-3'>
                                    <input type='text'
                                        placeholder='Enter Your Lastname'
                                        name='lastname'
                                        id='lastname'
                                        className='form-control bg-light'
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                    />
                                    {errors.lastName && <p className="text-danger small m-0 w-100">{errors.lastName}</p>}
                                </div>
                                <div className='input-group mb-3'>
                                    <input type='email'
                                        placeholder='Enter Your Email'
                                        name="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className='form-control bg-light'
                                    />
                                    {errors.email && <p className="text-danger small m-0 w-100">{errors.email}</p>}
                                </div>
                                <div className='input-group mb-3'>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder='Enter Your Password'
                                        name="password"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className='form-control bg-light'
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
                                    {errors.password && <p className="text-danger small m-0 w-100">{errors.password}</p>}
                                </div>
                                <div className='input-group mb-3'>
                                    <input 
                                        type={showCPassword ? 'text' : 'password'}
                                        placeholder='Confirm Password'
                                        id='confirmpassword'
                                        name="confirmpassword"
                                        value={confirmpassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className='form-control bg-light'
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
                                    {errors.confirmpassword && <p className="text-danger small m-0 w-100">{errors.confirmpassword}</p>}
                                </div>
                                <div className='input-group mb-3 justify-content-center'>
                                    <input className='butn fs-6 custombtn' type='submit' value="Register" />
                                </div>
                                {/* Mobile only link to Login */}
                                <div className="text-center mt-2 d-block d-md-none">
                                    <p className="small">
                                        Already have an account? <span onClick={SwitchContent} className="mobileview" style={{ cursor: 'pointer' }}>Login</span>
                                    </p>
                                </div>
                            </form>
                        </div>

                        {/*---------------------------- Login form ---------------------------------------*/}
                        {/* Show Login Form for Desktop and Tablet, and Mobile initially */}
                        <div className={`col-md-6 login-box ${!activeLogin ? "d-none d-md-block" : ""}`}>
                            <form onSubmit={handleLogin}>
                                <div className='header-text mb-4'>
                                    <h1>Login</h1>
                                </div>
                                {errors.general && <p className="text-danger small w-100">{errors.general}</p>}

                                <div className='input-group mb-3'>
                                    <input type='email'
                                        name="email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        placeholder='Enter Your Email' className='form-control bg-light' />
                                    {errors.email && <p className="text-danger small m-0 w-100">{errors.email}</p>}
                                </div>
                                <div className='input-group mb-3'>
                                    <input 
                                       type={showLPassword ? 'text' : 'password'}    
                                        name="password"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        placeholder='Enter Your Password' className='form-control bg-light' />
                                        <span
                                        onClick={() => setShowLPassword(!showLPassword)}
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
                                        {showLPassword ? <BsEye />  :<BsEyeSlash /> }</span>
                                    {errors.password && <p className="text-danger small m-0 w-100">{errors.password}</p>}
                                </div>
                                <div className='input-group justify-content-end'>
                                    <div className='forgot'>
                                        <p onClick={handleForgotpassword} className='link-custom'>Forgot Password?</p>
                                    </div>
                                </div>
                                <div className='input-group mb-3 justify-content-center'>
                                    <input className='butn fs-6 custombtn' value="Login" type='submit' />
                                </div>
                                {/* Mobile only link to Signup */}
                                <div className="text-center mt-2 d-block d-md-none">
                                    <p className="small">
                                        Don’t have an account? <span onClick={SwitchContent} className="mobileview" style={{ cursor: 'pointer' }}>Signup</span>
                                    </p>
                                </div>
                            </form>
                        </div>

                        {/* --------------------switch panel--------------------------- */}
                        <div className='switch-content d-none d-md-block'>
                            <div className='switch'>
                                <div className='switch-panel switch-left'>
                                    <h1>Hello, Again</h1>
                                    <p>We are happy to see you back</p>
                                    <button className='hidden btn w-50 fs-6' id='login' onClick={SwitchContent}>Login</button>
                                </div>
                                <div className='switch-panel switch-right'>
                                    <h1>Welcome</h1>
                                    <p>Join our platform</p>
                                    <button className='hidden btn w-50 fs-6' id='signup' onClick={SwitchContent}>Signup</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
            <Forgotpassword
                show={showForgotModal}
                handleClose={() => setShowForgotModal(false)}
                setModalShow={setModalShow}
            />
        </>
    );
}  

