import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import Login from './pages/Login'
import StudentDashboard from './pages/StudentDashboard'
import TeacherDashboard from './pages/TeacherDashboard'
import AdminDashboard from './pages/AdminDashboard'

const PrivateRoute = ({ user, children, allowedRole }) => {
  if (!user.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // If a role is required and the user doesn't have it
  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
function App() {
  const [user, setUser] = useState({
    isAuthenticated: false,
    role: null
  });

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={<Login setAuth={setUser} />} 
        />
        {/* ADMIN ROUTE*/}
        <Route 
          path="/admin" 
          element={<PrivateRoute user={user} allowedRole="ADMIN"><AdminDashboard/></PrivateRoute>} 
        />
        {/* TEACHER ROUTE */}
        <Route 
          path="/teacher"
          element={
            <PrivateRoute user={user} allowedRole="TEACHER">
              <TeacherDashboard />
            </PrivateRoute>
          } 
        />

        {/* STUDENT ROUTE */}
        <Route 
          path="/student" 
          element={
            <PrivateRoute user={user} allowedRole="STUDENT">
              <StudentDashboard />
            </PrivateRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
