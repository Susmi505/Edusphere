import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import {
    Table,
    TableBody,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import './Quiz.css';


const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#0F3460',
        color: '#ffffff',
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

const ListQuestions = () => {
    const [openDialog, setOpenDialog] = useState(false); // State to control the dialog
    const [questionToDelete, setQuestionToDelete] = useState(null); // Track the question to delete
    const [questions, setQuestions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const API_BASE = process.env.REACT_APP_API_URL;

    const limit = 10;

    useEffect(() => {
        fetchQuestions();
    }, [currentPage]);


    const fetchQuestions = async () => {
        try {
            const response = await axios.post(`${API_BASE}/getallquestions`, {
                page: currentPage,
                limit: limit,
            });
            setQuestions(response.data.questions);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Error fetching questions:', error);
        }
    };

    useEffect(() => {
        axios.get(`${API_BASE}/getCourses`)
          .then(response => setCourses(response.data.courses))
          .catch(error => console.error("Error fetching courses:", error));
      }, []);

    // Handle editing a question
    const handleEdit = (id) => {
        navigate('/admin/UpdateQuestion', { state: { id } }); // Pass id via state
    };

    // Close the confirmation dialog
    const handleDialogClose = () => {
        setOpenDialog(false);
    };

    // Open the confirmation dialog
    const handleDialogOpen = (id) => {
        setQuestionToDelete(id);
        setOpenDialog(true);
    };
    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
      };
    // Handle deleting a question
    const handleDelete = async () => {
        try {
            if (questionToDelete) {
                await axios.post(`${API_BASE}/questions/${questionToDelete}`);
                fetchQuestions(); // Refresh the question list
            }
        } catch (error) {
            console.error('Error deleting question:', error);
        } finally {
            setOpenDialog(false); // Close the dialog after the action is complete
        }
    };

    const handleAddQuiz = () => {
        navigate("/admin/createQuestion"); // Navigate to add course page
    };

    return (
        <main className="main-container">
            <div className='list-quiz'>
                <h3>List of Questions</h3>
                <button onClick={handleAddQuiz}>Add new Question</button>
            </div>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Id</StyledTableCell>
                            <StyledTableCell>Course</StyledTableCell>
                            <StyledTableCell>Question</StyledTableCell>
                            <StyledTableCell>Options</StyledTableCell>
                            <StyledTableCell>Answer</StyledTableCell>
                            <StyledTableCell>Marks</StyledTableCell>
                            <StyledTableCell>Action</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {questions.length > 0 ? (
                            questions.map((question, index) => (
                                <StyledTableRow key={question._id}>
                                    <StyledTableCell>{index + 1 + (currentPage - 1) * limit}</StyledTableCell>
                                    <StyledTableCell>         
                                         {courses.find((c) => c._id === question.courseID._id)?.title || 'Unknown'}
                                    </StyledTableCell>
                                    <StyledTableCell>{question.question}</StyledTableCell>
                                    <StyledTableCell>
                                        {question.options.map((option, i) => (
                                            <div key={i}>
                                               ({option.value}) {option.label} 
                                            </div>
                                        ))}
                                    </StyledTableCell>
                                    <StyledTableCell>{question.answer}</StyledTableCell>
                                    <StyledTableCell>{question.mark}</StyledTableCell>
                                    <StyledTableCell>
                                        <IconButton color="primary" onClick={() => handleEdit(question._id)}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton color="error" onClick={() => handleDialogOpen(question._id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))
                        ) : (
                            <StyledTableRow>
                                <StyledTableCell colSpan={7}>No Questions available</StyledTableCell>
                            </StyledTableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Confirmation Dialog */}
            <Dialog
                open={openDialog}
                onClose={handleDialogClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
                <DialogContent>Are you sure you want to delete this question?</DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDelete} color="warning" autoFocus>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
            <div className="pagination">
                <button 
                    onClick={() => handlePageChange(currentPage - 1)} 
                    disabled={currentPage === 1}
                    style={{
                        backgroundColor: currentPage === 1 ? '#d3d3d3' : '#0c2a47',
                        color: currentPage === 1 ? '#666' : '#fff',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        cursor: currentPage === 1? 'not-allowed' : 'pointer',
                        border: 'none',
                        marginRight: '10px'
                      }}
                >
                    Previous
                </button>
                <span> {currentPage} of {totalPages} </span>
                <button 
                    onClick={() => handlePageChange(currentPage + 1)} 
                    disabled={currentPage === totalPages}
                    style={{
                        backgroundColor: currentPage === totalPages ? '#d3d3d3' : '#0c2a47',
                        color: currentPage === totalPages ? '#666' : '#fff',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        cursor: currentPage === totalPages? 'not-allowed' : 'pointer',
                        border: 'none',
                        marginRight: '10px'
                      }}
                >
                    Next
                </button>
            </div>
        </main>
    );
};

export default ListQuestions;
