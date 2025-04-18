import './App.css';
import{BrowserRouter, Routes, Route} from 'react-router-dom'
import React, { useState, useEffect } from "react";
import ProtectedRoute from './components/protectedRoute/ProtectedRoute.js';
import LoginSignup from './components/user/LoginSignup';
import Forgotpassword from './components/user/Forgotpassword';
import Home from './components/user/Home'
import CoursePage  from './components/user/CoursePage';
import CustomTable from './components/admin/CustomTable';
import AdminRoutes from './components/admin/AdminRoutes';
import Profile from './components/user/profile';
import CourseDetailsPage from './components/user/CourseDetailsPage';
import ContactUs from './components/user/ContactUs';
import Quiz from './components/user/Quiz';
import AboutUs from './components/user/AboutUs.js';
import ProceedToPay from './components/user/ProceedToPay.js';


function App() {

  return (
    <div className='App'>

    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<LoginSignup/>}></Route>
        <Route path='/forgotpassword' element={<Forgotpassword />}></Route>
        <Route path='/' element={<Home />}></Route>
        <Route path='/tables' element={<ProtectedRoute  element={<CustomTable />} allowedRoles={['Student', 'Admin']}/>}></Route>
        
        <Route path="/courses" element={<CoursePage />}></Route>
        <Route path="/courses/:courseId" element={<ProtectedRoute element={<CourseDetailsPage />} allowedRoles={['Student', 'Admin']}/>}></Route>
        <Route path="/contactUs" element={<ContactUs />}></Route>

        <Route path="/aboutUs" element={<AboutUs />}></Route>
        
        {/* Admin routes */}
        <Route path="/admin/*" element={<ProtectedRoute element={<AdminRoutes />} allowedRoles={['Admin']} />} />
        <Route path="/profile" element={<ProtectedRoute element={<Profile />} allowedRoles={['Student', 'Admin']} />} />
        <Route path="/checkout" element={<ProtectedRoute element={<ProceedToPay />} allowedRoles={['Student', 'Admin']} />} />

        {/* Quiz route */}
        <Route path='/quiz' element={<ProtectedRoute element={<Quiz />} allowedRoles={['Student', 'Admin']} />} />


        </Routes>
      </BrowserRouter>
    </div>
 
  );
}

export default App;

