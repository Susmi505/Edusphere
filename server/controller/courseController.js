const Course = require("../models/courses");
const multer = require("multer");
const path = require("path");
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
require("dotenv").config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const mongoose = require('mongoose');

// Set up Cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "Images", // Folder in Cloudinary
    allowed_formats: ["jpg", "png", "jpeg"],
    public_id: (req, file) => Date.now() + "-" + file.originalname,
  },
});

// Set up Cloudinary storage for video uploads
const videoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "Videos",
    resource_type: "video",
    allowed_formats: ["mp4", "avi", "mov"],
    public_id: (req, file) => Date.now() + "-" + file.originalname,
  },
});

// File Filter (Only accept images)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only images are allowed."), false);
  }
};

// Initialize Multer Middleware
const uploads = multer({ storage, fileFilter });
const videoUpload = multer({ storage: videoStorage });


// Get all courses
exports.getCourses = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; 
    const skip = (page - 1) * limit;
    const courses = await Course.find().populate("categoryID").skip(skip).limit(limit); // Populate category details
    // Count total courses for pagination
      const totalCourses = await Course.countDocuments();
    res.status(200).json({courses,
      currentPage: page,
      totalPages: Math.ceil(totalCourses / limit)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single course by ID
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate("categoryID");
    if (!course) return res.status(404).json({ message: "Course not found" });

    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add Course
exports.addCourse = async (req, res) => {
  try {
    const { title, shortDescription, longDescription, categoryID, duration, price, courseImage, heading } = req.body;
    const videos = req.body.videos || []; // Handle multiple video URLs

    // Validate required fields
    if (!title || !shortDescription || !longDescription || !categoryID || !duration || !price) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    if (price < 0) {
      return res.status(400).json({ message: "Price should be greater than zero!" });
    }


    const newCourse = new Course({
      title,
      shortDescription,
      longDescription,
      categoryID,
      courseImage,
      duration,
      price,
      heading,
      videos,
    });

    await newCourse.save();

    res.status(201).json({ message: "Course added successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Update Course
exports.updateCourse = async (req, res) => {
  try {
    const { title, shortDescription, heading, longDescription, categoryID, duration, price } = req.body;
    const courseImage = req.body.courseImage ? req.body.courseImage : req.body.existingImage;
    const videos = req.body.videos ? req.body.videos : req.body.existingVideos;

    // Validate required fields
    if (!title || !shortDescription || !heading || !longDescription || !categoryID || !duration || !price) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      { title, shortDescription, heading, longDescription, categoryID, courseImage, duration, price, videos },
      { new: true }
    );

    if (!updatedCourse) return res.status(404).json({ message: "Course not found" });

    res.status(200).json({ message: "Course updated successfully!", updatedCourse });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Delete Course
exports.deleteCourse = async (req, res) => {
  try {
    const deletedCourse = await Course.findByIdAndDelete(req.params.id);
    if (!deletedCourse) return res.status(404).json({ message: "Course not found" });

    res.status(200).json({ message: "Course deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Course list for coursepage with filter
exports.courseListfilter = async (req, res) => {
  try {

    const { categoryID, page = 1, limit = 6 } = req.query;

    let query = {};
    if (categoryID && categoryID !== "All") {
      query.categoryID = new mongoose.Types.ObjectId(categoryID);
    } else {
      // Ensure categoryId is not null if 'All' is selected
      query.categoryID = { $ne: null };
    }

    const totalCourses = await Course.countDocuments(query); // Total count of filtered courses
    const totalPages = Math.ceil(totalCourses / limit); // Calculate total pages

    const courses = await Course.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      courses,
      totalPages: Math.ceil(totalCourses / limit),
      currentPage: parseInt(page),
    });

  } catch (error) {
    res.status(500).json({ message: "Error fetching courses", error });
  }
};

// Fetching course details by ID
exports.courseDetailsById = async (req, res) => {
  const courseId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    return res.status(400).json({ error: "Invalid course ID format" });
  }

  try {
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.json(course);
  } catch (error) {
    console.error("Error fetching course details:", error);
    res.status(500).json({ error: "Server error" });
  }
}

exports.uploads = uploads;