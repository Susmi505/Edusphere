import React from 'react'
import Header from './Header'
import Footer from './Footer'
import '../../home.css';
import CourseList from './CourseList';
import TestimonialSection from './Testimonials';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';

import course_icon from "../../Assets/images/course-icon.png"
import quiz_icon from "../../Assets/images/quiz-icon.png"
import certificate_icon from "../../Assets/images/certificate-icon.png"

import about_img from "../../Assets/images/about-img-3.png"

import courses_icon from "../../Assets/images/courses-icon.png"
import categories_icon from "../../Assets/images/categories-icon.png"
import users_icon from "../../Assets/images/users-icon.png"


import Main from '././Main'

const Home = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const API_BASE = process.env.REACT_APP_API_URL;

  // For accordian in why choose us section
  const toggleAccordion = (e) => {
    const button = e.currentTarget;
    const answer = button.nextElementSibling;
    const isOpen = button.classList.contains("active");

    document.querySelectorAll(".faq-question").forEach((btn) => {
      btn.classList.remove("active");
      btn.nextElementSibling.style.maxHeight = null;
    });

    if (!isOpen) {
      button.classList.add("active");
      answer.style.maxHeight = answer.scrollHeight + "px";
    }
  };


  // Fetching no. of courses, categories and users
  const [stats, setStats] = useState({
    courses: 0,
    users: 0,
    categories: 0,
  });

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/getCourses`)
        .then((res) => res.json())
        .catch((err) => {
          console.error("Error fetching courses:", err);
          return { count: 0 };
        }),
      fetch(`${API_BASE}/getUsers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => res.json())
        .catch((err) => {
          console.error("Error fetching users:", err);
          return { count: 0 };
        }),
      fetch(`${API_BASE}/getCategory`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => res.json())
        .catch((err) => {
          console.error("Error fetching categories:", err);
          return { categories: [] };
        }),
    ])
      .then(([courses, users, categories]) => {
        setStats({
          courses: courses?.courses.count ?? (Array.isArray(courses.courses) ? courses?.courses.length : 0),
          users: users?.filteredUsers.count ?? (Array.isArray(users?.filteredUsers) ? users?.filteredUsers.length : 0),
          categories: Array.isArray(categories.categories) ? categories.categories.length : 0,
        });
      })
      .catch((error) => console.error("Error in API requests:", error));
  }, []);


  // Fetch categories from backend
  useEffect(() => {
    fetch(`${API_BASE}/categories`)
      .then(response => (response.json())
      )
      .then(data => {
        if (Array.isArray(data)) {
          setCategories(data); // Set categories only if it's an array
        } else {
          console.error("Unexpected API response format:", data);
          setCategories([]); // Default to an empty array
        }
      })
      .catch(error => {
        console.error("Error fetching categories:", error);
        setCategories([]); // Ensure categories is always an array
      });
  }, []);

  return (
    <>
      <Header />
      <Main />

      {/* Our Services */}
      <section className="text-center services">
        <div className='service-title-image'>
          <p className='service-subtitle mt-5'>Guaranteed Success</p>
          <h2 className="serivce-title">Our Services</h2>
        </div>
        <p className='service-heading-desc mt-3'>We offer flexible learning and expert guidance to help you succeed. Our services ensure practical knowledge and hands-on experience.</p>

        <div className="service-grid">
          <div className="service-card">
            <img src={course_icon} alt="icon for courses"></img>
            <h3 className="service-title mt-3">10+ Courses</h3>
            <p className="service-description">Explore our diverse range of courses, designed to help you to achieve your goals.</p>
          </div>
          <div className="service-card">
            <img src={quiz_icon} alt="icon for quizzes"></img>
            <h3 className="service-title mt-3">Quizzes</h3>
            <p className="service-description">Test your knowledge with quizzes. Reinforce what you've learned in each subject.</p>
          </div>
          <div className="service-card">
            <img src={certificate_icon} alt="icon for certificates"></img>
            <h3 className="service-title mt-3">Certificates</h3>
            <p className="service-description">Earn certificates upon completion. Showcase your skills and enhance your career.</p>
          </div>
        </div>
      </section>

      {/* About our platform */}
      <section className='about-our-platform'>
        <div className='about-our-platform-bg'>

          <div className='about-image'>
            <div className='about-image-border'>
              <img src={about_img} alt="an image of a girl with books"></img>
            </div>
          </div>
          <div className='about-content'>
            <p className='about-content-subtitle'>About Our Platform</p>
            <h2>We empower students with quality learning resources on our innovative platform.</h2>
            <p className='mt-4'>Our team comprises certified professionals specializing in web development, data science, graphic design, and emerging technologies. With extensive industry experience, we provide comprehensive course materials and interactive quizzes to enhance your learning journey.</p>
            <div className='btn-browse-all-course-div'>
            <button className="btn-browse-all-course" onClick={() => navigate("/courses")}>
             Browse All Courses
            </button>
            </div>
          </div>
        </div>
      </section>


      <CourseList
        categories={categories.slice(0, 3)}
        selectedCategory="All"
        limit={3}
        hideCategoryButtons={true}
        hidePagination={true}
        showViewAll={true}
      />



      <TestimonialSection />



      {/* categories  */}
      <section className='category-section text-center'>
        <div className='category-title-image'>
          <p className='category-subtitle mt-5'>Our Features</p>
          <h2 className="category-title">Our Course Categories</h2>
        </div>
        <p className='category-heading-desc mt-3'>Explore a diverse range of categories, each showcasing exciting courses tailored to enhance your skills and knowledge.</p>

        <div className="carousel-container container mt-5">
          <div className="carousel-track">
            {categories?.map((category, index) => (
              <div key={index} className="category-card">
                <div className='category-image'>
                  <img src={category.categoryImage} alt={category.categoryName} className="category-image" />
                </div>

                <div className="category-info">
                  <p className="category-name">
                    <strong>{category.categoryName}</strong>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Why choose Us section  */}
      <section className="why-choose-us">
        <div className="why-choose-us-div">
          <h2 className="section-title">Why Choose Us</h2>
          <p className="section-subtitle">Our platform is trusted by thousands of learners across the globe.</p>
          <div className="stats-grid">
            <div className="stat-box">
              <img src={courses_icon} alt="icon for courses" className="stat-icon" />

              <h3 className="stat-number">{stats.courses}+</h3>
              <p className="stat-label">Courses Offered</p>
            </div>
            <div className="stat-box">
              <img src={categories_icon} alt="icon for categories" className="stat-icon" />
              <h3 className="stat-number">{stats.categories}+</h3>
              <p className="stat-label">Categories</p>
            </div>
            <div className="stat-box">
              <img src={users_icon} alt="icon for users" className="stat-icon" />
              <h3 className="stat-number">{stats.users}+</h3>
              <p className="stat-label">Registered Users</p>
            </div>
          </div>
        </div>
      </section>


      {/* FAQ Section */}
      <section className="faq-section">
        <div className="faq-container">
          {/* <h2 className="faq-title">Frequently Asked Questions</h2> */}

          <div className='faq-title-image'>
          <p className='faq-subtitle mt-5'>Top Questions</p>
          <h2 className="faq-title">Frequently Asked Questions</h2>
        </div>
    

          <div className="faq-item">
            <button className="faq-question" onClick={(e) => toggleAccordion(e)}>
              What courses do you offer?
              <span className="arrow">&#9662;</span>
            </button>
            <div className="faq-answer">
              <p>We offer a wide range of courses in web development, data science, graphic design, and more!</p>
            </div>
          </div>
          <div className="faq-item">
            <button className="faq-question" onClick={(e) => toggleAccordion(e)}>
              Are the courses beginner-friendly?
              <span className="arrow">&#9662;</span>
            </button>
            <div className="faq-answer">
              <p>Yes! Our courses are designed for all levels. You can start as a beginner and gradually advance.</p>
            </div>
          </div>
          <div className="faq-item">
            <button className="faq-question" onClick={(e) => toggleAccordion(e)}>
              Do I get a certificate after completing a quiz?
              <span className="arrow">&#9662;</span>
            </button>
            <div className="faq-answer">
              <p>Yes, you will receive a certificate upon successfully passing the quiz.</p>
            </div>
          </div>
          <div className="faq-item">
            <button className="faq-question" onClick={(e) => toggleAccordion(e)}>
              How can I contact support?
              <span className="arrow">&#9662;</span>
            </button>
            <div className="faq-answer">
              <p>You can reach our support team via the contact form on our website or through email.</p>
            </div>
          </div>
        </div>
      </section>


      <Footer />
    </>
  )
}

export default Home

