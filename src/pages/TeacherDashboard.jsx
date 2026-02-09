import React from 'react';
import {Users, FileText, CheckCircle} from 'lucide-react';

const TeacherDashboard = ({ onLogout }) => {
    return (
        <div>
            {/* Teacher Navbar - Different color */}
            <nav className="navbar" style={{backgroundColor: '#4834d4'}}>
                <span className="nav-brand">Instructor Panel</span>
                <button onClick={onLogout} className="logout-btn">Logout</button>
            </nav>
            <main className="dashboard-main">
                <h2>Classroom Management</h2>
                <div className="stats-container">
                    <div className="stat-card"><Users size={24} color="#4834d4"/> <span>10 Students</span></div>
                    <div className="stat-card"><FileText size={24} color="#eb4d4b"/> <span>5 Pending Grades</span></div>
                    <div className="stat-card"><CheckCircle size={24} color="#6ab04c"/> <span>3 Courses Active</span></div>
                </div>
                <h3>Recent Submissions</h3>
                <div className="course-grid">
                    <div className="course-card">
                        <h4>Lâm An</h4>
                        <p>Assignment: Starters 1</p>
                        <button className="btn-primary" style={{marginTop:'10px', fontSize:'0.8rem'}}>Grade Now</button>
                    </div>
                    <div className="course-card">
                        <h4>Chí Thắng</h4>
                        <p>Assignment: Flyers 1</p>
                        <button className="btn-primary" style={{marginTop:'10px', fontSize:'0.8rem'}}>Grade Now</button>
                    </div>
                </div>
            </main>
        </div>
    )
}
export default TeacherDashboard;