import React, { useState } from "react";
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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from 'react-router-dom';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#0F3460",
    color: "#ffffff",
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

const CustomTable = ({ courses, setCourses }) => {
  const navigate = useNavigate(); 
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const API_BASE = process.env.REACT_APP_API_URL;

  const handleEdit = (id) => {
    navigate(`/admin/updateCourse/${id}`);
  };

  const handleDelete = async () => {
    try {
      await axios.post(`${API_BASE}/deleteCourse/${selectedCourseId}`);
      setCourses((prevCourses) =>
        prevCourses.filter((course) => course._id !== selectedCourseId)
      );
      setOpenDialog(false); // Close the dialog
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  const openDeleteDialog = (courseId) => {
    setSelectedCourseId(courseId);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };
  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Title</StyledTableCell>
              <StyledTableCell>Description</StyledTableCell>
              <StyledTableCell>Heading</StyledTableCell>
              <StyledTableCell>Duration</StyledTableCell>
              <StyledTableCell>Price</StyledTableCell>
              <StyledTableCell>Image</StyledTableCell>
              <StyledTableCell>Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {courses.length > 0 ? (
              courses.map((course) => (
                <StyledTableRow key={course._id}>
                  <StyledTableCell>{course.title}</StyledTableCell>
                  {/* Display short description */}
                  <StyledTableCell>{course.shortDescription}</StyledTableCell>
                  {/* Display long description with HTML rendering */}
                  <StyledTableCell>{course.heading}</StyledTableCell>
                  <StyledTableCell>{course.duration}</StyledTableCell>
                  <StyledTableCell>{course.price}</StyledTableCell>
                  <StyledTableCell>
                    <img
                      src={course.courseImage}
                      alt={course.title}
                      style={{ width: "50px", height: "50px", borderRadius: "5px" }}
                    />
                  </StyledTableCell>
                  <StyledTableCell>
                    <IconButton color="primary" onClick={() => handleEdit(course._id)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => openDeleteDialog(course._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </StyledTableCell>
                </StyledTableRow>
              ))
            ) : (
              <StyledTableRow>
                <StyledTableCell colSpan={7}>No courses available</StyledTableCell>
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
        <DialogContent>
          Are you sure you want to delete this course?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">Cancel</Button>
          <Button onClick={handleDelete} color="warning" autoFocus>Confirm</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CustomTable;
