import React from 'react';
import {Users, FileText, CheckCircle} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Protect from '../components/Protect';

const TeacherDashboard = () => {
    const navigate = useNavigate();
    return (
        <div>
            {/* Teacher Navbar - Different color */}
            <main className="dashboard-main" style={{ padding: '10px' }}>
                <h2>Classroom Management</h2>
                <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                    <Protect requiredPermission="VIEW_DOC">
                        <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', width: '30%', backgroundColor: '#f8f9fa' }}>
                            <h3>Kho Tài Liệu Chung</h3>
                            <p style={{fontSize: '14px', color: '#666'}}>Xem giáo án, bài giảng, và tài liệu từ bộ phận học thuật.</p>
                            <button 
                                onClick={() => navigate('/teacher/materials')} 
                                style={{ background: '#34495e', color: 'white', padding: '8px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' }}>
                                Vào kho tài liệu
                            </button>
                        </div>
                    </Protect>
                </div>
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