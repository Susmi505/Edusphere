import React,{useState,useEffect} from 'react'
import CustomTable from '../CustomTable'
import axios from "axios";
import './Category.css'
import { useNavigate } from 'react-router-dom';

const ListCategory = () => {
    const [categories, setCategories] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate()
    const API_BASE = process.env.REACT_APP_API_URL;

    const limit = 10;

  useEffect(() => {
    fetchCategories();
  }, [currentPage]);

  const fetchCategories = async () => {
    try {
      const response = await axios.post(`${API_BASE}/getCategory`, {
        page: currentPage,
        limit: limit,
      });
      setCategories(response.data.categories);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
        setCurrentPage(newPage);
    }
};
    const handleAddcategory=()=>{
      navigate("/admin/addCategory");

    }
  return (
    <main className="main-container">
         <div className='list-category'>
            <h3>List of Category</h3>
            <button onClick={handleAddcategory}>Add New Category</button>
        </div>
        <CustomTable categories={categories} setCategories={setCategories} currentPage={currentPage} itemsPerPage={limit} />
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
  )
}

export default ListCategory