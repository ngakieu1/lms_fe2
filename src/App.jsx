import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import Login from './pages/Login'
import StudentDashboard from './pages/StudentDashboard'
import TeacherDashboard from './pages/TeacherDashboard'
import AdminDashboard from './pages/AdminDashboard'
import ForgotPassword from './pages/ForgotPassword'
import PermissionMatrix from './pages/admin/PermissionMatrix';
import RoleManagement from './pages/admin/RoleManagement';
import AdminLayout from './components/admin/AdminLayout';
import UserManagement from './pages/admin/UserManagement';
import MaterialManagement from './pages/admin/MaterialManagement';
import TeacherAvailabilityLogic from './pages/teacher/TeacherAvailabilityLogic';
import AdminApproval from './pages/admin/AdminApproval';
import ClassManagement from './pages/admin/ClassManagement';
import TeacherSchedule from './pages/teacher/TeacherSchedule';
import StudentSchedule from './pages/student/StudentSchedule';
import SessionManagement from './components/admin/SessionManagement';
import UnifiedClassDetail from './pages/shared/UnifiedClassDetail';
import AdminClassList from './pages/admin/AdminClassList';
import StudentClassList from './pages/student/StudentClassList';
import TeacherClassList from './pages/teacher/TeacherClassList';

const PrivateRoute = ({ user, children, allowedRole }) => {
  if (!user.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // If a role is required and the user doesn't have it
  if (allowedRole && user.role && !user.role.startsWith(allowedRole)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
function App() {
  const [user, setUser] = useState(() => {
    const savedToken = localStorage.getItem('accessToken');
    const savedRole = localStorage.getItem('userRole');
    return {
      isAuthenticated: !!savedToken,
      role: savedRole || null,
    };
  });
  const handleLogout = async () => {
    // 1. Get the token from storage
    const refreshToken = localStorage.getItem('refreshToken');
    
    // 2. Call Backend (if token exists)
    if (refreshToken) {
      try {
        await fetch('/aims_test/api/auth/logout', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json' 
          },
          
          body: JSON.stringify({ 
            refreshToken: refreshToken 
          }), 
        });
      } catch (error) {
        console.error("Logout failed on server, cleaning up client anyway.", error);
      }
    }

    // 3. Always clean up Frontend (Client-side logout)
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userRole'); // Optional, if you stored it
    
    // 4. Reset State (Triggers redirect to Login)
    setUser({ isAuthenticated: false, role: null });
  };
return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={<Login setAuth={setUser} />} 
        />
        <Route 
          path="/forgot-password" 
          element={<ForgotPassword />} 
        />
        {/* ADMIN ROUTE*/}
        <Route
          path="/admin"
          element={
            <PrivateRoute user={user} allowedRole="ADMIN">
              <AdminLayout onLogout={handleLogout} />
            </PrivateRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="roles" element={<RoleManagement />} />
          <Route path="roles/permission-matrix" element={<PermissionMatrix />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="materials" element={<MaterialManagement />} />
          <Route path="approvals" element={<AdminApproval />} />
          <Route path="sessions" element={<SessionManagement />} />
          {/* <Route path="teacher-availability" element={<AdminTeacherAvailability />} /> */}
          <Route path="classes" element={<AdminClassList />} />
          <Route path="classes/create" element={<ClassManagement />} />
          <Route path="classes/:id" element={<UnifiedClassDetail />} />
        </Route>
        {/* TEACHER ROUTE */}
        <Route 
          path="/teacher"
          element={
            <PrivateRoute user={user} allowedRole="TEACHER">
              <AdminLayout onLogout={handleLogout} />
            </PrivateRoute>
          } 
        >
          <Route index element={<TeacherDashboard />} />
          <Route path="materials" element={<MaterialManagement />} />
          <Route path="availability" element={<TeacherAvailabilityLogic />} />
          <Route path="my-schedule" element={<TeacherSchedule />} />
          <Route path="classes" element={<TeacherClassList />} />
          <Route path="classes/:id" element={<UnifiedClassDetail />} />
        </Route>

        {/* STUDENT ROUTE */}
        <Route 
          path="/student" 
          element={
            <PrivateRoute user={user} allowedRole="STUDENT">
              <AdminLayout onLogout={handleLogout} /> 
            </PrivateRoute>
          } 
        >
          <Route index element={<StudentDashboard />} />
          <Route path="my-schedule" element={<StudentSchedule />} />
          <Route path="classes" element={<StudentClassList />} />
          <Route path="classes/:id" element={<UnifiedClassDetail />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
