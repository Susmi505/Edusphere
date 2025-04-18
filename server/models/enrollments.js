const mongoose = require("mongoose");
const Course = require("../models/courses");


const EnrollmentsModel = new mongoose.Schema({
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'user', default: null },
    courseID: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', default: null },
    paymentID: { type: mongoose.Schema.Types.ObjectId, ref: 'payment', default: null },
    enrollmentDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model("enrollments", EnrollmentsModel);