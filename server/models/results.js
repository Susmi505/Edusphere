const mongoose = require("mongoose");

const ResultsModel = new mongoose.Schema({
    quizID: { type: mongoose.Schema.Types.ObjectId, ref: 'quizzes', default: null },
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'users', default: null },
    score: { type: Number, required: true },
    passed: { type: Boolean, required:true },
},
{ timestamps: true });

module.exports = mongoose.model("results", ResultsModel);