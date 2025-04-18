import { useState } from 'react';
import test_1 from "../../Assets/images/test-1.png";
import test_2 from "../../Assets/images/test-2.png";
import test_3 from "../../Assets/images/test-3.png";
import test_4 from "../../Assets/images/test-4.png";

const testimonials = [
  {
    image: test_1,
    text: "The courses are well-structured and easy to follow. Highly recommended!",
    name: "Mason D. Logan",
    title: "Marketing Manager"
  },
  {
    image: test_2,
    text: "Loved the hands-on projects and real-world examples. Great learning experience!",
    name: "Isabella E. Olivia",
    title: "UX Designer"
  },
  {
    image: test_3,
    text: "Excellent platform with well-curated content. It really boosted my skills!",
    name: "David R. Connor",
    title: "Data Analyst"
  },
  {
    image: test_4,
    text: "Interactive learning and great support. Loved it!",
    name: "Sophia S. Grace",
    title: "Frontend Developer"
  }
];

const TestimonialSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const visibleCount = 3;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - visibleCount : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + visibleCount >= testimonials.length ? 0 : prev + 1));
  };

  const visibleTestimonials = testimonials.slice(currentIndex, currentIndex + visibleCount);

  return (
    <section className="testimonial-section">
      <div className="testimonial-container">
        <h2 className="testimonial-heading">What Our Students Say</h2>
        <p className="testimonial-subtitle">
          Real feedback from learners who transformed their careers.
        </p>

        <div className="testimonial-slider-wrapper">
          <button className="arrow left" onClick={handlePrev}>&#10094;</button>

          <div className="testimonial-slider">
            {visibleTestimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <img src={testimonial.image} alt={testimonial.name} />
                <p className="testimonial-text">“{testimonial.text}”</p>
                <h4 className="testimonial-name">{testimonial.name}</h4>
                <p className="testimonial-title">{testimonial.title}</p>
              </div>
            ))}
          </div>

          <button className="arrow right" onClick={handleNext}>&#10095;</button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
