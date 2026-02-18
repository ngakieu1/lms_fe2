import React from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import {Shield, Server, UserPlus, Key} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const navigate = useNavigate();
    return(
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
                        <button 
                            onClick={() => navigate('/admin/roles')} 
                            className="btn-primary" 
                            style={{backgroundColor: '#8e44ad', display: 'flex', alignItems: 'center', gap: '8px'}}
                            >
                            <Key size={18} />
                            Quản lý Nhóm Quyền (Roles)
                        </button>
                        <button onClick={() => navigate('/admin/roles/permission-matrix')} className="btn-primary" 
                            style={{backgroundColor: '#8e44ad', display: 'flex', alignItems: 'center', gap: '8px'}}>
                            <Key size={18} />
                            Manage Permissions
                        </button>
                        <button className="btn-primary" style={{backgroundColor: '#27ae60'}}>Add New User</button>
                        <button className="btn-primary" style={{backgroundColor: '#e74c3c'}}>View Audit Logs</button>
                    </div>
                </div>
            </main>
    );
};
export default AdminDashboard;