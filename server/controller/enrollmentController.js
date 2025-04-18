const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const Enrollment = require("../models/enrollments");
const mongoose = require("mongoose");
//const Course = require('../models/courses');


// To enroll a student for a course
exports.enrollCourse = async (req, res) => {
  const userId = req.body.userID;
  const { courseId, paymentId, price } = req.body;
  try {
    // Check if the enrollment already exists
    const existingEnrollment = await Enrollment.findOne({
      userID: userId,
      courseID: courseId,
    });
    if (existingEnrollment) {
      return res
        .status(400)
        .json({ message: "User is already enrolled in this course" });
    }

    // Conditionally set paymentID to null if the price is 0 or paymentId is not provided
    // let paymentObjectId = null;
    if (price > 0 && paymentId) {
      paymentObjectId = paymentId;
    }

    // Create a new enrollment
    const enrollment = await Enrollment.create({
      userID: new mongoose.Types.ObjectId(userId),
      courseID: new mongoose.Types.ObjectId(courseId),
      paymentID: paymentId,
    });

    if (enrollment) {
      return res
        .status(200)
        .json({ message: "Enrollment successful", enrolled: true });
    } else {
      return res
        .status(400)
        .json({ message: "Enrollment failed", enrolled: false });
    }
  } catch (error) {
    console.error("Enrollment error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Check if a user is enrolled in a course
exports.checkEnrollment = async (req, res) => {
  const { courseId, userId } = req.params;

  try {
    const enrollment = await Enrollment.findOne({
      courseID: new mongoose.Types.ObjectId(courseId),
      userID: new mongoose.Types.ObjectId(userId),
    });

    if (enrollment) {
      return res
        .status(200)
        .json({ message: "User is already enrolled", enrolled: true });
    } else {
      return res
        .status(200)
        .json({ message: "User is not enrolled", enrolled: false });
    }
  } catch (error) {
    console.error("Error checking enrollment status:", error);
    return res
      .status(500)
      .json({ message: "Server error while checking enrollment" });
  }
};
// Get enrollments by user ID
exports.getEnrollmentsByUser = async (req, res) => {
  const { userId } = req.params; // Check if userId is a valid ObjectId

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    // Find enrollments for the given userId and populate the 'courseID' field
    const enrollments = await Enrollment.find({ userID: userId })
      .populate({
        path: "courseID",
        select: "title", // Ensure you also select _id
        model: "Course",
      })
      .exec(); 

      const enrolledCourses = enrollments.map(enrollment => {
        if (enrollment?.courseID?._id) {
            return {
                _id: enrollment.courseID._id,
                title: enrollment.courseID.title
            };
        }
        return null;
    }).filter(course => course !== null);
    

    res.status(200).json(enrolledCourses);
  } catch (error) {
    console.error("Error fetching enrollments:", error); // IMPORTANT:  Send the error message back to the client.  This will help with debugging on the React side.
    res
      .status(500)
      .json({
        message: "Server error while fetching enrollments: " + error.message,
      });
  }
};
exports.getEnrollmentSummary = async (req, res) => {
  const { interval = 'day' } = req.query;

  const validIntervals = ['day', 'week', 'month'];
  if (!validIntervals.includes(interval)) {
    return res.status(400).json({ message: 'Invalid interval' });
  }

  const unitMap = {
    day: 'day',
    week: 'week',
    month: 'month',
  };

  try {
    const summary = await Enrollment.aggregate([
      {
        $group: {
          _id: {
            $dateTrunc: {
              date: "$enrollmentDate",
              unit: unitMap[interval],
            },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const formatted = summary.map((entry) => ({
      date: entry._id.toISOString().split('T')[0],
      count: entry.count,
    }));

    res.json(formatted);
  } catch (error) {
    console.error("Error aggregating enrollments:", error);
    res.status(500).json({ message: "Server error" });
  }
};