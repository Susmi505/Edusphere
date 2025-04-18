import React, { useEffect, useState } from 'react';
import '../../home.css';
import { useNavigate } from 'react-router-dom';
import LoginSignup from './LoginSignup';

const CourseList = ({ selectedCategory, setSelectedCategory, categories, limit, hideCategoryButtons, hidePagination, showViewAll }) => {
    const [courses, setCourses] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1); 
    const navigate = useNavigate();  
    const [loginModalShow, setLoginModalShow] = useState(false);
    const API_BASE = process.env.REACT_APP_API_URL;

    const coursesPerPage = 6;

    // Handle 'All' category 
    const selectedCategoryID = selectedCategory === "All"
        ? null
        : categories?.find(cat => cat.categoryName === selectedCategory)?._id || "";

    // Fetch courses from backend
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const categoryParam = selectedCategory === "All"
                    ? `?page=${currentPage}&limit=${coursesPerPage}`  // If All is selected, no category filter
                    : `?categoryID=${selectedCategoryID}&page=${currentPage}&limit=${coursesPerPage}`;


                const response = await fetch(`${API_BASE}/courses${categoryParam}`);

                const data = await response.json();

                if (Array.isArray(data.courses)) {
                    setCourses(data.courses); // Set courses state
                    setTotalPages(data.totalPages); // Set totalPages from API
                    setCurrentPage(data.currentPage); // Set currentPage from API
                } else {
                    console.error("API response is not an array:", data);
                    setCourses([]); // Set an empty array if data is not in the expected format
                }
            } catch (error) {
                console.error("Error fetching courses:", error);
                setCourses([]);
            }
        };

        // // Only fetch if selectedCategoryID is valid or All category is selected
        if (selectedCategory === "All" || selectedCategoryID !== null) {
            fetchCourses();
        }
    }, [selectedCategoryID, selectedCategory, currentPage]);

    // Ensure filtering is based on categoryID, but skip when "All" is selected
    const filteredCourses = selectedCategory === "All"
        ? courses // If 'All' is selected, show all courses
        : courses.filter(course => course.categoryID === selectedCategoryID); // Filter by categoryID


    const totalCourses = filteredCourses.length;
    //const totalPagesCalculated = Math.ceil(totalCourses / coursesPerPage); // Use the totalCourses length to calculate totalPages
    const totalPagesCalculated = totalPages; // Use the value from API

    // Calculate the index of the first and last course based on the current page
    const indexOfFirstCourse = (currentPage - 1) * limit;
    const indexOfLastCourse = Math.min(indexOfFirstCourse + limit, filteredCourses.length);



    // Applying pagination: if limit is provided, only show limited courses
    const displayedCourses = limit
        ? filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse) // Show courses based on pagination
        : filteredCourses.slice(0, limit); // Show limited courses if no pagination is needed

    const handleDetailedView =(id)=>{
        const token = localStorage.getItem('token');
        if (!token) {
            setLoginModalShow(true);
            return;
        }else{
            navigate(`/courses/${id}`)
        }
    }
    return (
        <section className='courses-section'>
            <div>
                {/* Title Section */}
                <div className='courses-title-image'>
                    <p className='courses-subtitle mt-5'>Our Top Classes</p>
                    <h2 className="courses-title">Featured Courses</h2>
                </div>
                <p className="course-title-description mt-2">Explore our wide range of courses designed to help you excel.</p>
                {/* Only show this if the prop is true */}
                {showViewAll && (
                <a href="/courses" className="view-all-link">
                    View all Courses
                </a>
                )}

                {/* Conditionally show category buttons */}
                {!hideCategoryButtons && (
                    <div className="category-buttons mt-4 mb-2">
                        <button
                            className={`category-btn ${selectedCategory === "All" ? "active" : ""}`}
                            onClick={() => {
                                setSelectedCategory("All");
                                setCurrentPage(1);
                            }}
                        >
                            All
                        </button>
                        {categories.map(category => (
                            <button
                                key={category._id}
                                className={`category-btn ${selectedCategory === category.categoryName ? "active" : ""}`}
                                onClick={() => {
                                    setSelectedCategory(category.categoryName);
                                    setCurrentPage(1);
                                }}
                            >
                                {category.categoryName}
                            </button>
                        ))}
                    </div>
                )}

                {/* Courses Section */}
                <div className="courses-grid">
                    {displayedCourses.length > 0 ? (
                        displayedCourses.map(course => (
                            <div key={course._id} className="course-card">
                                {/* <img src={sample_img} alt="sample image" className='course-image' /> */}
                                <img src={course.courseImage} alt={course.title} className="course-image"/>
                                <div className="course-content">
                                    <h3 className="course-title">{course.title}</h3>
                                    <p className="course-description"><div dangerouslySetInnerHTML={{__html: course.description}}/></p>

                                    {/* Duration and Stars */}
                                    <div className="course-duration-rating mt-4">
                                        <p className="course-duration"><strong>Duration:</strong> {course.duration}</p>
                                    </div>

                                    <hr className="divider" />

                                    {/* Price and Button Row */}
                                    <div className="course-price-button">
                                        <p className="course-price">${course.price}</p>
                                        {/* <button className="view-details-btn">View Details</button> */}
                                        <button
                                            className="view-details-btn"
                                            onClick={()=>handleDetailedView(course._id)}  // Navigate to course details
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className='no-course-available-heading'>No courses available for this category.</p>
                    )}
                </div>

                {/* Pagination (Only Show in Course Page) */}
                {!hidePagination && totalPages > 1 && (
                    <div className="pagination mb-5">
                        <button
                            className="pagination-btn"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(currentPage - 1)}
                        >
                            Prev
                        </button>
                        <span className="pagination-info">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            className="pagination-btn"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(currentPage + 1)}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
              {loginModalShow && (
                <LoginSignup show={loginModalShow} handleClose={() => setLoginModalShow(false)} />
            )}
        </section>
    );
};

export default CourseList;

