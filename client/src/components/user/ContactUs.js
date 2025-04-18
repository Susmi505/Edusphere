import React, { useState } from 'react';
import '../../home.css';
import Header from './Header';
import Footer from './Footer';
import axios from 'axios';

import address_icon from "../../Assets/images/address_icon.png";
import email_icon from "../../Assets/images/email_icon.png";
import phone_icon from "../../Assets/images/phone_icon.png";

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const API_BASE = process.env.REACT_APP_API_URL;

    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_BASE}/send-email`, formData);
            //alert(response.data.message);
            setMessage('Your message has been sent successfully!');

            // Clear the form fields after successful email sending
            setFormData({
                name: '',
                email: '',
                subject: '',
                message: ''
            });

        } catch (error) {
            //alert('Failed to send email.');
            setMessage('Failed to send email. Please try again later.');
            console.error(error);
        }
    };

    return (
        <>
            <Header />

           
                <div className="contact-us-banner-bg">
                    <div className="contact-page-banner-text">
                        <p className="contact-page-subtitle">WE’RE HERE TO HELP</p>
                        <h1 className="contact-page-title">GET IN<br />TOUCH<br />WITH US</h1>
                    </div>
                </div>
            

            <section className="contact-us-section">
                <div className="contact-info-container">
                    <div className="contact-info-box">
                        <img src={address_icon} alt="sample image" className='contact-info-box-image-icon' />
                        <h3>Address</h3>
                        <p>62 A Churchill St<br />Waterloo, CA 94107</p>
                    </div>
                    <div className="contact-info-box">
                        <img src={email_icon} alt="sample image" className='contact-info-box-image-icon' />
                        <h3>Email</h3>
                        <p>info@edusphere.com</p>
                    </div>
                    <div className="contact-info-box">
                        <img src={phone_icon} alt="sample image" className='contact-info-box-image-icon' />
                        <h3>Phone</h3>
                        <p>+1 (123) 456-7890</p>
                    </div>
                </div>

                <div className="contact-us-container">
                    {/* Left Column: Contact Form */}
                    <div className="contact-form">
                        <h2>Contact Us</h2>
                        <form onSubmit={handleSubmit}>
                            {/* <form> */}
                            <input
                                type="text"
                                name="name"
                                placeholder="Your Name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Your Email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="text"
                                name="subject"
                                placeholder="Subject"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                            />
                            <textarea
                                name="message"
                                placeholder="Your Message"
                                rows="5"
                                value={formData.message}
                                onChange={handleChange}
                                required
                            ></textarea>
                            <button type="submit">Send Message</button>
                            <div className='email-success-message'>{message && <p>{message}</p>}</div>
                        </form>
                    </div>

                    {/* Right Column: Google Map */}
                    <div className="contact-map">
                        <iframe
                            title="Google Map"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.0199940954345!2d-122.41941508468168!3d37.77492977975959!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80858064df2f1f6f%3A0x2a7b4cfd3c8101f8!2sSan%20Francisco%2C%20CA%2C%20USA!5e0!3m2!1sen!2sin!4v1695837972993!5m2!1sen!2sin"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
};

export default ContactUs;
