const express = require('express');
const router = express.Router();
const QuizResult = require('../models/quizzes');

// Function to save quiz result
const saveQuizResult = async (req, res) => {
  try {
    const { userId, courseId, totalMarks, receivedMarks, status } = req.body;

    // Basic validation
    if (!userId || !courseId || totalMarks == null || receivedMarks == null) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate status if it's provided
    if (status && !['passed', 'failed', 'pending'].includes(status)) {
      console.warn("Invalid status:", status);  // 3. Debug: Log invalid status
      return res.status(400).json({ error: 'Invalid status' });
    }

    let quiz = await QuizResult.findOne({ userID: userId, courseID: courseId });

    if (quiz) {
      // Check if 5 attempts already made
      if (quiz.attemptCount >= 5) {
        return res.status(201).json({ message: 'Maximum 5 attempts reached. Cannot take quiz again.' });
      }

      // Add new attempt to history
      quiz.attempts.push({
        receivedMarks,
        status,
        date: new Date()
      });

      quiz.attemptCount += 1;
      quiz.totalMarks = totalMarks;
      quiz.receivedMarks = receivedMarks;

      // If any attempt passed, overall is passed
      const hasPassed = quiz.attempts.some(a => a.status === 'passed');
      quiz.status = hasPassed ? 'passed' : 'failed';

      await quiz.save();
      return res.status(200).json({ message: 'Quiz attempt updated', quiz });
    } else {
      // First time taking quiz
      const newQuiz = new QuizResult({
        userID: userId,
        courseID: courseId,
        totalMarks,
        receivedMarks,
        status,
        attemptCount: 1,
        attempts: [{ receivedMarks, status }]
      });

      const saved = await newQuiz.save();
      return res.status(201).json({ message: 'Quiz result created', quiz: saved });
    }
  
  } catch (error) {
    console.error("Error in saveQuizResult:", error); // 6. Debug: General error
    res.status(500).json({ error: 'Server error while creating quiz result' });
  }
};

// Function to get all quiz results
const getQuizResults = async (req, res) => {
  try {
    const quizResults = await QuizResult.find()
      .populate('userId', 'name email')
      .populate('courseID', 'courseName');

    res.status(200).json(quizResults);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while fetching quiz results' });
  }
};

const getQuizAttemptsByUser = async (req, res) => {
  try {
    const { userId, courseId } = req.query; // Get userId and courseId from query parameters

    if (!userId || !courseId) {
      return res.status(400).json({ error: 'userId and courseId are required' });
    }
       const quizResult = await QuizResult.findOne({ userID: userId, courseID: courseId });

       // If no quiz result is found for this user and course
       if (!quizResult) {
         return res.status(201).json({ message: 'No quiz results found for this user and course' });
       }

    // Return the quiz result including all attempts
    res.status(200).json(quizResult);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while fetching quiz results' });
  }
};

// Define routes using the router
router.post('/quiz-results', saveQuizResult);
router.get('/quiz-results', getQuizResults);
router.get('/getusers-quiz-results',getQuizAttemptsByUser);

// Export the router
module.exports = router;
