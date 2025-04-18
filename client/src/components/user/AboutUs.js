import React from 'react';
import '../../home.css';
import Header from './Header';
import Footer from './Footer';

import team_member1 from "../../Assets/images/Susmi.jpeg";
import team_member2 from "../../Assets/images/Rajni.jpeg";
import team_member3 from "../../Assets/images/Aparna.jpeg";

const AboutUs = () => {
    return (
        <>
            <Header />

            <section>
                <div className="about-us-banner-bg">
                    <div className="contact-page-banner-text">
                        <p className="contact-page-subtitle">DISCOVER OUR STORY</p>
                        <h1 className="contact-page-title">WHO<br />WE ARE</h1>
                    </div>
                </div>
            </section>

            <section className="about-us-section container">
                <div className="about-us-info-container">
                    <div className='about-us-title-image'>
                        <p className='about-us-subtitle mt-5'>Driven by Passion</p>
                        <h2 className="about-us-title">About Us</h2>
                    </div>
                    <p className='about-us-heading-desc mt-3'>We are a forward-thinking platform designed to help individuals advance their careers and build new skills. Our courses are crafted by industry experts with years of experience, ensuring that learners gain the knowledge and practical skills they need to succeed in their chosen fields.</p>
                </div>

                <div className="team-info-container mt-5">
                    <h2>Meet Our Team</h2>
                    <div className="team-members">
                        <div className="team-member">
                            <img src={team_member1} alt="Team Member 1" />
                            <h3>Susmi Rani</h3>
                            <p>Product Owner</p>
                            <p>Susmi is the visionary behind our platform. With a passion for education and technology, she is committed to building an inclusive learning environment.</p>
                        </div>
                        <div className="team-member">
                            <img src={team_member2} alt="Team Member 2" />
                            <h3>Rajni Rajni</h3>
                            <p>Team Member</p>
                            <p>Rajni oversees the technical side of the platform, ensuring it remains fast, reliable, and scalable to meet the needs of our growing community.</p>
                        </div>
                        <div className="team-member">
                            <img src={team_member3} alt="Team Member 3" />
                            <h3>Aparna Girija Ashokan</h3>
                            <p>Team Member</p>
                            <p>Aparna leads the design and development of our courses, ensuring that all content is relevant and up-to-date with the latest industry trends.</p>
                        </div>
                    </div>
                </div>

            </section>

            <Footer />
        </>
    );
};

export default AboutUs;
