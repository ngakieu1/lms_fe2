import React from 'react';
import {Bell, User} from 'lucide-react';

const TopBar = () => {
    const user = {name: 'Admin User', role: 'Admin'}; 
    return (
        <div style={{
            height: '64px',
            backgroundColor: '#fff',
            borderBottom: '1px solid #e0e0e0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            padding: '0 20px',
    }}>
        <Bell size={20} style={{ marginRight: '20px', color: '#555', cursor: 'pointer' }} />
      
        <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <div style={{
            width: '32px',
            height: '32px',
            backgroundColor: '#e0e0e0',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '10px',
            }}>
                <User size={18} color="#555" />
            </div>
            <div>
            <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{user.name}</div>
            <div style={{ fontSize: '12px', color: '#888' }}>{user.role}</div>
            </div>
        </div>
        </div>
    );
};
export default TopBar;