import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Pages
import Home from './pages/Home';
import CourseListing from './pages/CourseListing';
import CourseDetail from './pages/CourseDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Signup from './pages/Signup';
import UserDashboard from './pages/UserDashboard';
import CoursePlayer from './pages/CoursePlayer';
import InstructorProfile from './pages/InstructorProfile';
import About from './pages/About';
import UserCourseTest from './components/UserDashboardUI/UserCourseTest';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminCourses from './pages/AdminCourses';
import AdminAddCourse from './pages/AdminAddCourse';
import AdminEditCourse from './pages/AdminEditCourse';
import AdminStudents from './pages/AdminStudents';
import AdminLiveClasses from './pages/AdminLiveClasses';
import AdminEditLiveClass from './pages/AdminEditLiveClass';
import AdminCategories from './pages/AdminCategories';
import AdminCertificate from './pages/AdminCertificate';
import AdminTestimonal from './pages/AdminTestimonal';

// Auth Guard Helpers
import { isAuthenticated, isAdmin } from './services/authService';
import Contact from './pages/Contact';
import Checkout from './pages/Checkout';

// Cart
import { CartProvider } from './context/CartContext';
import ScrollToTop from './components/animation_style/ScrollToTop';
import HelpCircle from './components/layout/HelpCircle';
import Faq from './components/HomePageComponent/Faq';


//Instructor
import InstructorDashboard from './pages/InstructorDashboard';
import InstructorAddCourse from './components/InstructorDashboard/InstructorAddCourse';
import InstructorEditCourse from './components/InstructorDashboard/InstructorEditCourse';
import AdminInstructors from './pages/AdminInstructor';
import AdminInstructorDetail from './pages/AdminInstructorDetail';

const ProtectedRoute = ({ children, requireAdmin }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  if (requireAdmin && !isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

export default function App() {
  return (
    
    <CartProvider>
      <ScrollToTop />
      
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/courses" element={<CourseListing />} />
      <Route path="/course/:slug" element={<CourseDetail />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/instructor/:id" element={<InstructorProfile />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/checkout/:courseId" element={<Checkout />} />
      <Route path='/checkout' element={<Checkout />} />

      {/* User Dashboard Routes */}
      <Route 
        path="/dashboard" 
        element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} 
      />
      <Route 
        path="/dashboard/course/:slug" 
        element={<ProtectedRoute><CoursePlayer /></ProtectedRoute>} 
      />
      <Route
        path="/course/:slug/test"
        element={<ProtectedRoute><UserCourseTest /></ProtectedRoute>}
      />

      {/* Admin Routes */}
      <Route 
        path="/admin" 
        element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>} 
      />
      <Route 
        path="/admin/courses" 
        element={<ProtectedRoute requireAdmin><AdminCourses /></ProtectedRoute>} 
      />
      <Route 
        path="/admin/courses/new" 
        element={<ProtectedRoute requireAdmin><AdminAddCourse /></ProtectedRoute>} 
      />
      <Route 
        path="/admin/courses/edit/:id" 
        element={<ProtectedRoute requireAdmin><AdminEditCourse /></ProtectedRoute>} 
      />
      <Route 
        path="/admin/students" 
        element={<ProtectedRoute requireAdmin><AdminStudents /></ProtectedRoute>} 
      />
      <Route 
        path="/admin/live-classes" 
        element={<ProtectedRoute requireAdmin><AdminLiveClasses /></ProtectedRoute>} 
      />
      <Route
      path="/admin/certificate"
      element={<ProtectedRoute requireAdmin><AdminCertificate/></ProtectedRoute>}
      />
      <Route 
        path="/admin/live-classes/edit/:id" 
        element={<ProtectedRoute requireAdmin><AdminEditLiveClass /></ProtectedRoute>} 
      />
      <Route
      path="/admin/instructor"
      element={<ProtectedRoute requireAdmin><AdminInstructors /></ProtectedRoute>}
      />
      <Route 
      path="/admin/instructors/:id"
      element={<ProtectedRoute requireAdmin><AdminInstructorDetail /></ProtectedRoute>}
      />
      <Route 
        path="/admin/categories" 
        element={<ProtectedRoute requireAdmin><AdminCategories /></ProtectedRoute>} 
      />
      <Route
       path="/admin/testimonal"
       element={<ProtectedRoute requireAdmin><AdminTestimonal/></ProtectedRoute>}
       />

       {/* Instructor Routes */}
       <Route
       path='/instructordashboard'
       element={<ProtectedRoute><InstructorDashboard /></ProtectedRoute>}
       />
       <Route path="/instructor/courses/new" element={<ProtectedRoute><InstructorAddCourse /></ProtectedRoute>} />
       <Route path="/instructor/courses/edit/:id" element={<ProtectedRoute><InstructorEditCourse /></ProtectedRoute>} />
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    <HelpCircle />
    </CartProvider>
  );
}