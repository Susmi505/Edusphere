import React from "react";
import { IoIosArrowRoundForward } from "react-icons/io";
import { motion } from "framer-motion";
import BannerPng from "../../Assets/images/banner-img-icon-1.png";
import { useNavigate } from "react-router-dom";

// Animation Variant
const FadeUp = (delay) => ({
  initial: { opacity: 0, y: 50 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay },
  },
});

const Main = () => {
  const navigate = useNavigate();

  return React.createElement(
    "div",
    { className: "bg-gray-200 overflow-hidden relative mb-15 main-banner" }, 
    React.createElement(
      "div",
      { className: "mx-auto grid grid-cols-1 md:grid-cols-2 min-h-[500px] px-4" }, 

      // Brand Info
      React.createElement(
        "div",
        { 
          className: "flex flex-col justify-center relative z-50", 
          style: { marginLeft: 'auto', marginRight: 'auto' } 
        },
        React.createElement(
          "div",
          { className: "md:text-left space-y-10 lg:max-w-[400px]" },

          // Heading with motion effect
          React.createElement(
            motion.h1,
            {
              variants: FadeUp(0.6),
              initial: "initial",
              animate: "animate",
              className: "text-3xl lg:text-5xl font-bold !leading-snug",
            },
            "Welcome to ",
            React.createElement("span", {
              className: "text-[#ffffff]", // Added the color white to Edusphere text
            }, "Edusphere,"), " find the best courses"
          ),

          // Button with motion effect
          React.createElement(
            motion.div,
            {
              variants: FadeUp(0.8),
              initial: "initial",
              animate: "animate",
              className: "flex justify-center md:justify-start",
            },
            React.createElement(
              "button",
              { 
                className: "primary-btn flex items-center gap-2 group",
                onClick: () => navigate("/aboutUs"),
               },
              "Get Started",
              React.createElement(IoIosArrowRoundForward, {
                className: "text-xl group-hover:translate-x-2 group-hover:-rotate-45 duration-300",
              })
            )
          )
        )
      ),

      // Hero Image
      React.createElement(
        "div",
        { className: "flex justify-center items-center" },
        React.createElement(motion.img, {
          initial: { x: 50, opacity: 0 },
          animate: { x: 0, opacity: 1 },
          transition: { duration: 0.6, delay: 0.4, ease: "easeInOut" },
          src: BannerPng,
          alt: "",
          className: "w-[400px] xl:w-[600px] relative z-10 drop-shadow", // Adjusted image width
        }),

      )
    )
  );
};

export default Main;
