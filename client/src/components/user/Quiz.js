import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Certificate from './Certificate';

function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

const SimpleQuizUI = ({ courseId,  onQuizComplete,userName,course}) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timer, setTimer] = useState(0);
  const [originalTime, setOriginalTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [resultMessage, setResultMessage] = useState(null);
  const [certificateGenerated, setCertificateGenerated] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [userId, setUserId] = useState(null); // Get User ID
  const [attemptCount, setAttemptCount] = useState(0);
  const [quizPassed, setQuizPassed] = useState(false);
  const API_BASE = process.env.REACT_APP_API_URL;

  useEffect(() => {
    // Get the user ID from the token
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserId(decodedToken.userId);
      } catch (error) {
        console.error("Error decoding token:", error);
        setError('Invalid token.');
        setLoading(false);
        return; // Stop further execution
      }
    } else {
      setError('User not logged in.');
      setLoading(false);
      return;
    }

    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE}/questions/${courseId}`);
        if (response.data) {
          setQuestions(response.data);
        } else {
          setError('Invalid data received from server');
        }
      } catch (err) {
        setError('Error fetching questions');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [courseId]);

  useEffect(() => {
    if (questions.length > 0) {
      const timePerQuestion = 60;
      const totalTime = questions.length * timePerQuestion;
      setOriginalTime(totalTime);
      setTimer(totalTime);
    }
  }, [questions]);

  useEffect(() => {
    if (questions.length > 0 && !quizCompleted) {
      setLoading(false);
      const intervalId = setInterval(() => {
        if (!isPaused) {
          setTimer(prevTimer => {
            if (prevTimer <= 0) {
              setQuizCompleted(true);
              clearInterval(intervalId);
              return 0;
            }
            return prevTimer - 1;
          });
        }
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [questions, quizCompleted, isPaused, originalTime]);

  const handleOptionSelect = (questionId, selectedOption) => {
    setUserAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionId]: selectedOption
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    setQuizCompleted(true);
    let correctAnswers = 0;

    questions.forEach(question => {
      if (userAnswers[question._id] === question.answer) {
        correctAnswers++;
      }
    });

    setCorrectAnswersCount(correctAnswers);
    const percentage = (correctAnswers / questions.length) * 100;
    const status = percentage >= 60 ? "passed" : "failed";

    if (status === "passed") {
      // onQuizComplete(true);
      setQuizPassed(true)
    }

    setResultMessage(status === "passed" ? "Congratulations! You passed!" : "Sorry, you failed. Please try again next time.");

    // Prepare data to send
    const quizData = {
      userId: userId,
      courseId: courseId,
      totalMarks: questions.length,
      receivedMarks: correctAnswers,
      status: status
    };

    try {
      const response = await axios.post(`${API_BASE}/quiz-results`, quizData);
      // Check for HTTP status codes outside the 200 range
      if (response.status < 200 || response.status >= 300) {
        throw new Error(`Failed to save quiz results: ${response.status}`);
      }
      const responseData = response.data;  // Capture the response data
      if(responseData){
        setAttemptCount(responseData.quiz?.attempts?.length)
        setQuizCompleted(true);
  
      }
      if (!responseData)
      {
        setError("Empty response from server");
        return;
      }
    } catch (error) {
      console.error("Error saving quiz result:", error);
      setError('Failed to save quiz results. Please try again.');
    }
  };

  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        const response = await axios.get(`${API_BASE}/getusers-quiz-results?userId=${userId}&courseId=${courseId}`);
        if (response.data && response.data.attempts) {
          setAttemptCount(response.data.attempts.length);
        }
      } catch (err) {
        console.error("Failed to fetch attempts", err);
      }
    };
  
    if (userId && courseId) {
      fetchAttempts();
    }
  }, [userId, courseId]);
  const progress = questions.length ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const handleReset = async () => {
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setQuizCompleted(false);
    setError(null);
    setLoading(true);
    setTimer(originalTime);
    setIsPaused(false);
    setResultMessage(null);
    setCertificateGenerated(false);
    setCorrectAnswersCount(0);
    try {
      const response = await axios.get(`${API_BASE}/questions/${courseId}`);

      if (response.data) {
        setQuestions(response.data);
      } else {
        setError("Invalid data");
      }
    } catch (err) {
      setError('Error fetching questions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-gray-500 text-lg">Loading questions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-gray-500 text-lg">No questions available.</p>
      </div>
    );
  }
  if (quizCompleted) {
    return (
      <>
      <div className='flex items-center justify-center p-4 mb-6'>
        <div className="mt-2 text-center space-y-4 w-full max-w-2xl bg-white rounded-xl shadow-lg p-6 space-y-6">
          <p className="text-xl font-semibold">{resultMessage}</p>
          <p className="text-lg">
            You scored {correctAnswersCount} out of {questions.length}.
          </p>
          {attemptCount < 5 ? (
            <button
              onClick={handleReset}
              className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
            >
              Re-try Quiz
            </button>
          ) : (
            <p className="text-red-500">You have reached the maximum number of attempts.</p>
          )}
        </div>
      </div>
      {quizPassed && <Certificate userName={userName} courseName={course.title} quizPassed={quizPassed} />}
      </>
  )}

  const currentQuestion = questions[currentQuestionIndex];
  const userChoice = userAnswers[currentQuestion._id];

  return (
    <>
    <div className=" flex items-center justify-center p-4">
      
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-6 space-y-6">
        <div className="flex justify-between items-center mb-4">
          <p className="text-md text-gray-600">Time Remaining: {formatTime(timer)}</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Question {currentQuestionIndex + 1} of {questions.length}
          </h2>
          <p className="text-gray-700 mb-4">{currentQuestion.question}</p>
          <div className="space-y-3">
            {currentQuestion.options.map((option) => (
              <div
                key={option.value}
                className={cn(
                  "flex items-center space-x-3 p-3 rounded-md transition-all duration-200",
                  "border",
                  userChoice === option.value
                    ? "bg-blue-100 border-blue-300 text-blue-800"
                    : "hover:bg-gray-100 border-gray-200 text-gray-700"
                )}
                onClick={() => handleOptionSelect(currentQuestion._id, option.value)}
              >
                <input
                  type="radio"
                  id={`option-${option.value}`}
                  value={option.value}
                  checked={userChoice === option.value}
                  onChange={() => { }}
                  className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label
                  htmlFor={`option-${option.value}`}
                  className="text-sm"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-width duration-400 ease"
            style={{ width: `${progress}%` }}
            aria-valuenow={progress}
            aria-valuemin="0"
            aria-valuemax="100"
          ></div>
        </div>

        <div className="flex justify-between mt-4">
          {!quizCompleted && 
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className={cn(
              "px-4 py-2 rounded-md transition-colors duration-200 text-sm",
              currentQuestionIndex === 0
                ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            )}
          >
            Previous
          </button>
          }
          {currentQuestionIndex < questions.length - 1 ? (
            <button
              onClick={handleNext}
              disabled={userAnswers[currentQuestion._id] == null}
              className={cn(
                "px-4 py-2 rounded-md text-sm transition-colors duration-200 text-white",
                userAnswers[currentQuestion._id] == null
                  ? "bg-blue-500/50 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              )}
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-4 py-2 rounded-md text-sm bg-green-500 text-white hover:bg-green-600"
            >
              Submit
            </button>
          )}
        </div>

        {quizCompleted && (
          <div className="mt-6 text-center">
            <p className="text-xl font-semibold">{resultMessage}</p>
            <p className="text-lg mt-2">
              You scored {correctAnswersCount} out of {questions.length}.
            </p>
          </div>
        )}

      </div>
    </div>
    {quizPassed && <Certificate userName={userName} courseName={course.title} quizPassed={quizPassed} />}

</>
    



  );
};

export default SimpleQuizUI;

