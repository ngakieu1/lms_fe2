import React, { useEffect, useState } from 'react';
import { BookOpen, Clock, BarChart } from 'lucide-react';
import api from '../api/axios';

const StudentDashboard = ({ onLogout }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [debugData, setDebugData] = useState(null); // To see raw backend response
  const [error, setError] = useState(null);

  useEffect(() => {
    // 1. Fetch Data
    api.get('/student/dashboard')
      .then(res => {
        console.log("BACKEND RESPONSE:", res.data); 
        setDebugData(res.data);
        
        // 2. Safety Check: Is it an array?
        if (Array.isArray(res.data)) {
          setCourses(res.data);
        } else if (res.data && Array.isArray(res.data.courses)) {
          // Sometimes backends return { courses: [...] }
          setCourses(res.data.courses);
        } else {
          console.error("Data format mismatch! Expected array, got:", typeof res.data);
          setError("Data format error: Backend did not return a list.");
        }
      })
      .catch(err => {
        console.error("API Error:", err);
        setError("Failed to load data. Is backend running?");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{padding: '2rem'}}>Loading Dashboard...</div>;

  return (
    <div style={styles.page}>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <h1 style={{margin: 0, fontSize: '1.2rem'}}>My LMS</h1>
        <button onClick={onLogout} style={styles.logout}>Logout</button>
      </nav>

      {/* Main Content */}
      <main style={styles.main}>
        
        {/* Error Message Display */}
        {error && (
            <div style={{padding: '1rem', backgroundColor: '#ffebee', color: '#c62828', marginBottom: '1rem', borderRadius: '4px'}}>
                ⚠️ {error}
            </div>
        )}

        <h2>Welcome back!</h2>
        
        {/* Stats Row */}
        <div style={styles.statsContainer}>
          <div style={styles.statCard}><BookOpen size={20}/> <span>3 Active Courses</span></div>
          <div style={styles.statCard}><Clock size={20}/> <span>5 Pending Tasks</span></div>
          <div style={styles.statCard}><BarChart size={20}/> <span>85% GPA</span></div>
        </div>

        {/* Course List */}
        <h3>My Courses</h3>
        <div style={styles.grid}>
          {courses.length > 0 ? (
            courses.map((course, index) => (
              <div key={course.id || index} style={styles.courseCard}>
                <h4>{course.title || "No Title"}</h4>
                <p>Progress: {course.progress || 0}%</p>
                <div style={styles.progressBarTrack}>
                   <div style={{...styles.progressBarFill, width: `${course.progress || 0}%`}}></div>
                </div>
                <small style={{display:'block', marginTop:'10px'}}>Due: {course.due || "N/A"}</small>
              </div>
            ))
          ) : (
             <p>No courses found. (List is empty)</p>
          )}
        </div>

        {/* --- DEBUG BOX: REMOVE THIS AFTER FIXING --- */}
        <div style={{marginTop: '50px', padding: '20px', background: '#333', color: '#0f0', borderRadius: '8px', fontFamily: 'monospace'}}>
            <h4>🔧 Debug Info</h4>
            <p><strong>Raw Data from Backend:</strong></p>
            <pre>{JSON.stringify(debugData, null, 2)}</pre>
        </div>

      </main>
    </div>
  );
};

const styles = {
  page: { fontFamily: 'sans-serif', minHeight: '100vh', backgroundColor: '#f8f9fa' },
  navbar: { display: 'flex', justifyContent: 'space-between', padding: '1rem 2rem', backgroundColor: '#2d3436', color: 'white', alignItems: 'center' },
  logout: { background: 'transparent', border: '1px solid white', color: 'white', padding: '5px 15px', borderRadius: '4px', cursor: 'pointer' },
  main: { maxWidth: '1000px', margin: '2rem auto', padding: '0 1rem' },
  statsContainer: { display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' },
  statCard: { flex: '1 1 200px', padding: '1.5rem', background: 'white', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', display: 'flex', gap: '10px', alignItems: 'center' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' },
  courseCard: { padding: '1.5rem', background: 'white', borderRadius: '8px', border: '1px solid #eee' },
  progressBarTrack: { height: '6px', backgroundColor: '#eee', marginTop: '10px', borderRadius: '3px', overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#00b894' }
};

export default StudentDashboard;