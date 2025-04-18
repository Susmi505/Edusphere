const mongoose = require("mongoose");

const OptionsSchema = new mongoose.Schema({
    label: { type: String, required: true }, // "Option A", "Option B"
    value: { type: String, required: true }  // Answer key
});

const QuestionsModel = new mongoose.Schema({
    courseID: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    question: { type: String, required: true },
    options: { 
        type: [OptionsSchema], 
        required: true, 
        default: [],
        validate: [arrayLimit, 'At least 2 options are required']
    },
    mark: { type: Number, required: true, min: 1 }, // Prevent negative marks
    answer: { type: String, required: true }
});

// Ensure at least 2 options are present
function arrayLimit(val) {
    return val.length >= 2;
}

module.exports = mongoose.model("Question", QuestionsModel);
