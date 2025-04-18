import { useState } from 'react';
import '../../admin.css';
import Header from './Header';
import Sidebar from './Sidebar';
import Home from './Home';
import { Routes, Route } from 'react-router-dom';
import ListCategory from './CategoryManagement/ListCategory';
import AddCategory from './CategoryManagement/AddCategory';
import UpdateCategory from './CategoryManagement/UpdateCategory';
import ListCourses from './CourseManagement/ListCourses';
import AddCourse from './CourseManagement/AddCourse';
import UpdateCourse from './CourseManagement/UpdateCourse';
import ListUser from './UserManagement/ListUser';
import AddUser from './UserManagement/AddUser';
import UpdateUser from './UserManagement/UpdateUser';
import CreateQuiz from './QuizManagement/CreateQuiz';
import ListQuestions from './QuizManagement/ListQuestions';
import UpdateQuestion from './QuizManagement/UpdateQuestion';
import Payment from './PaymentList';

function AdminRoutes() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  const toggleSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  return (
    <div className="grid-container">
      <Header toggleSidebar={toggleSidebar} />
      <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={toggleSidebar} />
      
      <Routes>
        <Route path="/" element={<Home />} /> 
        {/* <Route path="home" element={<Home />} />  */}
        <Route path="Courses" element={<ListCourses />} /> {/* Courses page route */}
        <Route path="addCourse" element={<AddCourse />} />
        <Route path="updateCourse/:id" element={<UpdateCourse />} />
        <Route path="Category" element={<ListCategory />} /> 
        <Route path="addCategory" element={<AddCategory />} />
        <Route path="updateCategory" element={<UpdateCategory />} />
        <Route path="Users" element={<ListUser />} />
        <Route path="Adduser" element={<AddUser />} />
        <Route path="updateUser" element={<UpdateUser />}></Route>
        <Route path="createQuestion" element={<CreateQuiz />}></Route>
        <Route path='Questions' element={<ListQuestions />}></Route>
        <Route path='UpdateQuestion' element={<UpdateQuestion />}></Route>
        <Route path="Payments" element={<Payment />}></Route>
        {/* Add more routes as necessary */}
      </Routes>
    </div>
  );
}

export default AdminRoutes;
