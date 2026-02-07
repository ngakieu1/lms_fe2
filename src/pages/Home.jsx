import React from 'react';
import { BookOpen, Clock, BarChart } from 'lucide-react';

const Home = () => {
  const courses = [
    { id: 1, title: 'Intro to Computer Science', progress: 75, due: '2 days' },
    { id: 2, title: 'Data Structures & Algorithms', progress: 30, due: '5 days' },
    { id: 3, title: 'Web Development Bootcamp', progress: 10, due: 'Tomorrow' },
  ];

  return (
    <div style={styles.page}>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <h1>My LMS Dashboard</h1>
        <button onClick={() => window.location.reload()} style={styles.logout}>Logout</button>
      </nav>

      {/* Main Content */}
      <main style={styles.main}>
        <h2>Welcome back!</h2>
        
        {/* Stats Row */}
        <div style={styles.statsContainer}>
          <div style={styles.statCard}><BookOpen size={20}/> <span>3 Active Courses</span></div>
          <div style={styles.statCard}><Clock size={20}/> <span>5 Pending Tasks</span></div>
          <div style={styles.statCard}><BarChart size={20}/> <span>85% Average Score</span></div>
        </div>

        {/* Course List */}
        <h3>My Courses</h3>
        <div style={styles.grid}>
          {courses.map(course => (
            <div key={course.id} style={styles.courseCard}>
              <h4>{course.title}</h4>
              <p>Progress: {course.progress}%</p>
              <div style={{...styles.progressBar, width: `${course.progress}%`}}></div>
              <small>Due: {course.due}</small>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

const styles = {
  page: { fontFamily: 'Arial, sans-serif', minHeight: '100vh', backgroundColor: '#f8f9fa' },
  navbar: { display: 'flex', justifyContent: 'space-between', padding: '1rem 2rem', backgroundColor: '#2d3436', color: 'white' },
  logout: { background: 'transparent', border: '1px solid white', color: 'white', padding: '5px 15px', borderRadius: '4px', cursor: 'pointer' },
  main: { maxWidth: '1000px', margin: '2rem auto', padding: '0 1rem' },
  statsContainer: { display: 'flex', gap: '1rem', marginBottom: '2rem' },
  statCard: { flex: 1, padding: '1.5rem', background: 'white', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', display: 'flex', gap: '10px', alignItems: 'center' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' },
  courseCard: { padding: '1.5rem', background: 'white', borderRadius: '8px', border: '1px solid #eee' },
  progressBar: { height: '6px', backgroundColor: '#00b894', marginTop: '10px', borderRadius: '3px' }
};

export default Home;