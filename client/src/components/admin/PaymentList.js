import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import {
    Table,
    TableBody,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from '@mui/material';

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

const PaymentList = () => {
    const [payments, setPayments] = useState([]);
    const API_BASE = process.env.REACT_APP_API_URL;
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };
    useEffect(() => {
        fetchPayments();
    }, [currentPage]);
    const limit = 15;

    const fetchPayments = async () => {
        try {
            const response = await axios.get(`${API_BASE}/getAllPayments`,{
                params: {
                  page: currentPage,
                  limit: limit,
                }
              });
            setPayments(response.data.formattedPayments);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Error fetching payments:', error);
        }
    };

    return (
        <main className="main-container">
            <div className='list-payments'>
                {/* <h3>List of Payments</h3> */}
            </div>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>ID</StyledTableCell>
                            <StyledTableCell>User Email</StyledTableCell>
                            <StyledTableCell>Amount</StyledTableCell>
                            <StyledTableCell>Currency</StyledTableCell>
                            <StyledTableCell>Status</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {payments.length > 0 ? (
                            payments.map((payment, index) => (
                                <StyledTableRow key={payment._id}>
                                    <StyledTableCell>{index + 1 + (currentPage - 1) * limit}</StyledTableCell>
                                    <StyledTableCell>{payment.email}</StyledTableCell>
                                    <StyledTableCell>${(payment.amount)*100}</StyledTableCell>
                                    <StyledTableCell>{payment.currency}</StyledTableCell>
                                    <StyledTableCell>
                                        <span className={`badge ${getStatusClass(payment.status)}`}>
                                            {payment.status}
                                        </span>
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))
                        ) : (
                            <StyledTableRow>
                                <StyledTableCell colSpan={5} className="text-center">
                                    No Payments Available
                                </StyledTableCell>
                            </StyledTableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
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

// Helper function for status styling
const getStatusClass = (status) => {
    switch (status) {
        case "successful": return "bg-success text-white";
        case "pending": return "bg-warning text-dark";
        case "failed": return "bg-danger text-white";
        default: return "bg-secondary text-white";
    }
};

export default PaymentList;
