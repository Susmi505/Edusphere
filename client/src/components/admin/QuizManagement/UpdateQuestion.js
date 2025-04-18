import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { TextField, Button, Box, Typography, Paper, Select, MenuItem, FormControl, IconButton,FormHelperText } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";

const UpdateQuestion = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([]);
  const [answer, setAnswer] = useState("");
  const [mark, setMark] = useState("");
  const navigate = useNavigate();
  const location = useLocation(); 
  const [errors, setErrors] = useState({}); // State for error messages
  const API_BASE = process.env.REACT_APP_API_URL;


  useEffect(() => {
    axios.get(`${API_BASE}/getCourses`)
      .then(response => setCourses(response.data.courses))
      .catch(error => console.error("Error fetching courses:", error));
  }, []);

  useEffect(() => {
    const questionId = location.state?.id; 
    axios.get(`${API_BASE}/details/questions/${questionId}`)
      .then(response => {
        const { courseID, question, options, answer, mark } = response.data;
        setSelectedCourse(courseID._id);
        setQuestion(question);
        setOptions(options);
        setAnswer(answer);
        setMark(mark);
      })
      .catch(error => console.error("Error fetching question details:", error));
  }, [location.state]);

  const handleOptionChange = (index, field, value) => {
    const updatedOptions = [...options];
    updatedOptions[index][field] = value;
    setOptions(updatedOptions);
  };

  const addOption = () => {
    if (options.length < 4) {
      setOptions([...options, { label: "", value: String.fromCharCode(65 + options.length) }]);
    }
  };
  const validateForm = () => {
    const newErrors = {};

    if (!selectedCourse) newErrors.selectedCourse = "Course selection is required.";
    if (!question.trim()) newErrors.question = "Question cannot be empty.";
    
    if (options.length < 2) {
      newErrors.options = "At least two options are required.";
    } else {
      options.forEach((option, index) => {
        if (!option.label.trim()) {
          newErrors[`option_${index}`] = `Option ${index + 1} cannot be empty.`;
        }
      });
    }

    if (!answer) newErrors.answer = "Please select a correct answer.";
    if (!mark || isNaN(mark) || Number(mark) <= 0) newErrors.mark = "Marks must be a positive number.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return; 
    const updatedQuestion = {
      courseID: selectedCourse,
      question,
      options,
      answer,
      mark: Number(mark),
    };

    try {
      await axios.put(`${API_BASE}/questions/${location.state?.id}`, updatedQuestion);
      navigate("/admin/Questions");
    } catch (error) {
      console.error("Error updating question:", error);
    }
  };

  return (
    <main className="main-container">
      <Paper elevation={3} sx={{ padding: 3, margin: "auto" }}>
        <div className="list-quiz">
          <h3>Update Quiz Question</h3>
        </div>
        <form onSubmit={handleSubmit}>
          <Box marginBottom={2}>
            <FormControl fullWidth sx={{ width: "50%" }} variant="outlined" size="small"  error={!!errors.selectedCourse}>
              <Typography variant="body1" sx={{ color: "#0F3460", marginBottom: "8px", fontSize: "18px" }}>Select Course:</Typography>
              <Select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} >
                {courses.map(course => (
                  <MenuItem key={course._id} value={course._id}>{course.title}</MenuItem>
                ))}
              </Select>
              {errors.selectedCourse && <FormHelperText>{errors.selectedCourse}</FormHelperText>}
            </FormControl>
          </Box>

          <Box marginBottom={2}>
            <Typography variant="body1" sx={{ color: "#0F3460", marginBottom: "8px", fontSize: "18px" }}>Question:</Typography>
            <TextField sx={{ width: "50%" }} variant="outlined" size="small" value={question} onChange={(e) => setQuestion(e.target.value)} error={!!errors.question}
              helperText={errors.question} />
          </Box>

          <div>
            <Typography variant="body1" sx={{ color: "#0F3460", marginBottom: "8px", fontSize: "18px" }}>Options:</Typography>
            {options.map((option, index) => (
              <Box key={index} marginBottom={1} display="flex" alignItems="center">
                <TextField
                  sx={{ width: "50%" }}
                  variant="outlined"
                  size="small"
                  value={option.label}
                  onChange={(e) => handleOptionChange(index, "label", e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  error={!!errors[`option_${index}`]}
                  helperText={errors[`option_${index}`]}
                />
              </Box>
            ))}
                        {errors.options && <FormHelperText error>{errors.options}</FormHelperText>}
            {options.length < 4 && (
              <IconButton onClick={addOption} color="primary">
                <AddCircleIcon />
              </IconButton>
            )}
          </div>

          <Box marginBottom={2}>
            <Typography variant="body1" sx={{ color: "#0F3460", marginBottom: "8px", fontSize: "18px" }}>Answer:</Typography>
            <FormControl sx={{ width: "50%" }} variant="outlined" size="small">
              <Select value={answer} onChange={(e) => setAnswer(e.target.value)}>
                {options.map((option, index) => (
                  <MenuItem key={index} value={option.value}>{option.label || `Option ${index + 1}`}</MenuItem>
                ))}
              </Select>
              {errors.answer && <FormHelperText>{errors.answer}</FormHelperText>}
            </FormControl>
          </Box>

          <Box marginBottom={2}>
            <Typography variant="body1" sx={{ color: "#0F3460", marginBottom: "8px", fontSize: "18px" }}>Marks:</Typography>
            <TextField sx={{ width: "50%" }} variant="outlined" size="small" value={mark} onChange={(e) => setMark(e.target.value)}  error={!!errors.mark}
              helperText={errors.mark} type="number" />
          </Box>

          <Box display="flex" gap={2} marginTop={2}>
            <Button type="submit" variant="contained">Update Quiz</Button>
            <Button variant="outlined" sx={{ border: "1px solid #0F3460", color: "#0F3460" }} onClick={() => navigate("/admin/Questions")}>Cancel</Button>
          </Box>
        </form>
      </Paper>
    </main>
  );
};

export default UpdateQuestion;
