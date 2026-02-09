import React from 'react';
import {Shield, Server, UserPlus} from 'lucide-react';

const AdminDashboard = ({ onLogout }) => {
    return(
        <div>
            {/* Admin Navbar - Different color */}
            <nav className="navbar" style={{backgroundColor: '#2d3436'}}>
                <span className="nav-brand">Admin Console</span>
                <button onClick={onLogout} className="logout-btn">Logout</button>
            </nav>
            <main className="dashboard-main">
                <h2>System Overview</h2>
                <div className="stats-container">
                    <div className="stat-card"><Shield size={24} color='#c0392b'/><span>System Status: Healthy</span></div>
                    <div className="stat-card"><Server size={24} color='#2980b9'/><span>DB Load: 12%</span></div>
                    <div className="stat-card"><Shield size={24} color='#f39c12'/><span>User Requests: 5</span></div>
                </div>
                <div style={{marginTop: '2rem'}}>
                    <h3>Quick Actions</h3>
                    <div style={{display: 'flex', gap: '1rem', marginTop: '1rem'}}>
                        <button className="btn-primary" style={{backgroundColor: '#27ae60'}}>Add New User</button>
                        <button className="btn-primary" style={{backgroundColor: '#e74c3c'}}>View Audit Logs</button>
                    </div>
                </div>
            </main>
        </div>
    )
}
export default AdminDashboard;