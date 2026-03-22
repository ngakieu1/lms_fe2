import React from 'react';
import {Bell, User, Shield, GraduationCap, BookOpen} from 'lucide-react';
//import { useState } from 'react';

// const TopBar = () => {
//     const [user] = useState({name: 'Admin User', role: 'Admin'}); 
//     const roleIcons = {
//         Admin: <Shield size={18} color='#555' />,
//         Student: <GraduationCap size={18} color='#555' />,
//         Teacher: <BookOpen size={18} color='#555' />,
//     };
//     return (
//         <div style={{
//             height: '64px',
//             backgroundColor: '#fff',
//             borderBottom: '1px solid #e0e0e0',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'flex-end',
//             padding: '0 20px',
//     }}>
//         <Bell size={20} style={{ marginRight: '20px', color: '#555', cursor: 'pointer' }} />
      
//         <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
//             <div style={{
//             width: '32px',
//             height: '32px',
//             backgroundColor: '#e0e0e0',
//             borderRadius: '50%',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             marginRight: '10px',
//             }}>
//                 {roleIcons[user.role] || <User size={18} color="#555" />}
//             </div>
//             <div>
//             <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{user.name}</div>
//             <div style={{ fontSize: '12px', color: '#888' }}>{user.role}</div>
//             </div>
//         </div>
//         </div>
//     );
// };
// export default TopBar;
const roleConfig = {
  Admin: {
    color: "#d32f2f",
    bg: "#fdecea",
    icon: <Shield size={18} color="#d32f2f" />,
  },
  Teacher: {
    color: "#1976d2",
    bg: "#e3f2fd",
    icon: <BookOpen size={18} color="#1976d2" />,
  },
  Student: {
    color: "#2e7d32",
    bg: "#e8f5e9",
    icon: <GraduationCap size={18} color="#2e7d32" />,
  },
};

const defaultUser = { name: "Guest", role: "Student" };

const TopBar = ({ user = defaultUser }) => {
  const config = roleConfig[user.role] || {};

  return (
    <div
      style={{
        height: "64px",
        backgroundColor: "#fff",
        borderBottom: `2px solid ${config.color || "#e0e0e0"}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: "0 20px",
      }}
    >
      <Bell
        size={20}
        style={{
          marginRight: "20px",
          color: config.color || "#555",
          cursor: "pointer",
        }}
      />

      <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
        <div
          style={{
            width: "36px",
            height: "36px",
            backgroundColor: config.bg || "#e0e0e0",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginRight: "10px",
          }}
        >
          {config.icon || <User size={18} />}
        </div>

        <div>
          <div
            style={{
              fontWeight: "bold",
              fontSize: "14px",
              color: config.color || "#000",
            }}
          >
            {user.name}
          </div>
          <div style={{ fontSize: "12px", color: "#888" }}>
            {user.role}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;