import React from 'react'
import Header from './Header'
import Footer from './Footer'
import '../../home.css';
import CourseList from './CourseList';
import { useEffect, useState } from 'react';

const CoursePage = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const API_BASE = process.env.REACT_APP_API_URL;

  // Fetch categories from backend
  useEffect(() => {
    fetch(`${API_BASE}/categories`)
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCategories(data);
        } else {
          console.error("Unexpected API response format:", data);
          setCategories([]);
        }
      })
      .catch(error => {
        console.error("Error fetching categories:", error);
        setCategories([]);
      });
  }, []);

  return (
    <>
      <Header />
      <section className="course-page-banner-wrapper">
        <div className="course-page-banner-bg">
          <div></div>
          <div className="course-page-banner-text">
            <p className="course-page-subtitle">ELEVATE YOUR SKILLS</p>
            <h1 className="course-page-title">EXPLORE<br />TOP<br />COURSES</h1>
          </div>
        </div>
      </section>

      <CourseList
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
        hideCategoryButtons={false}
        hidePagination={false}
      />
      <Footer />
    </>
  )
}

export default CoursePage