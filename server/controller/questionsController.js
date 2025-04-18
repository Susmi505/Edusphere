const Questions = require('../models/questions'); // Adjust path based on your folder structure

// Create a new question
exports.createQuestion = async (req, res) => {
  try {
    const { courseID, question, options, answer, mark } = req.body;

    // Validate options
    if (!Array.isArray(options) || options.length < 2) {
      return res.status(400).json({ error: 'At least 2 options are required' });
    }

    // Create a new question instance
    const newQuestion = new Questions({
      courseID,
      question,
      options,
      answer,
      mark
    });

    // Save to the database
    const savedQuestion = await newQuestion.save();
    res.status(201).json(savedQuestion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while creating question' });
  }
};
// Controller to get all questions, optionally filtered by courseID
exports.getAllQuestions = async (req, res) => {
    try {
      const { page = 1, limit = 10, courseID } = req.body;  // Pagination defaults
      const skip = (page - 1) * limit; // Pagination logic
  
      // Create filter object (empty if no courseID is provided)
      const filter = courseID ? { courseID } : {};
  
      // Fetch questions from the database
      const questions = await Questions.find(filter)
        .skip(skip) // Skip previous questions
        .limit(limit) // Limit number of questions
        .populate('courseID', 'courseName') // Populate the course data (optional)
        .exec();
  
      // Get the total number of questions (for pagination)
      const totalQuestions = await Questions.countDocuments(filter);
      const totalPages = Math.ceil(totalQuestions / limit);
      res.status(200).json({
        questions,
        totalQuestions,
        totalPages
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching questions' });
    }
  };

// Get all questions for a specific course
exports.getQuestionsByCourse = async (req, res) => {
  try {
    const { courseID } = req.params;

    // Find questions by courseID
    const questions = await Questions.find({ courseID }).populate('courseID');
    if (!questions.length) {
      return res.status(404).json({ message: 'No questions found for this course' });
    }

    res.status(200).json(questions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while fetching questions' });
  }
};

// Get a specific question by courseid
exports.getQuestionById = async (req, res) => {
  try {
    const { courseID } = req.params;
    const questions = await Questions.find({ courseID }).populate('courseID');
        if (!questions) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.status(200).json(questions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while fetching question' });
  }
};

//get one question by its id
exports.getQuestionDetails = async (req, res) => {
  try {
    const { id } = req.params; // Use 'id' instead of 'courseID'

    const questions = await Questions.findById(id).populate('courseID'); 
        if (!questions) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.status(200).json(questions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while fetching question' });
  }
};
// Update a question by ID
exports.updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { courseID, question, options, answer,mark } = req.body;

    // Validate options
    if (!Array.isArray(options) || options.length < 2) {
      return res.status(400).json({ error: 'At least 2 options are required' });
    }

    // Find and update the question
    const updatedQuestion = await Questions.findByIdAndUpdate(
      id,
      { courseID, question, options, answer ,mark},
      { new: true }
    );

    if (!updatedQuestion) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.status(200).json(updatedQuestion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while updating question' });
  }
};

// Delete a question by ID
exports.deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the question
    const deletedQuestion = await Questions.findByIdAndDelete(id);
    if (!deletedQuestion) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.status(200).json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while deleting question' });
  }
};
