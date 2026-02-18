import React, {useState} from 'react';
import {Link, useLocation} from 'react-router-dom';
import {
    BookOpen, Calendar, Users, FileText, Settings,
    ChevronDown, ChevronRight, LogOut
} from 'lucide-react';
import logo from '../../assets/login-image.png';

const menuItems = [
    {
        title: 'Vận hành',
        icon: <Settings size={20}/>,
        children:[
            {title: 'Quản lý Lớp học', path: '/admin/classes', icon: <BookOpen size={18} />},
            { title: 'Quản lý buổi học', path: '/admin/sessions', icon: <Calendar size={18} /> },
        ],
    },
    {
        title: 'Gia sư',
        icon: <Users size={20} />,
        children: [
      { title: 'Hồ sơ gia sư', path: '/admin/tutors', icon: <FileText size={18} /> },
      // Add more items here
    ],
    },
    {
    title: 'Hệ thống',
    icon: <Settings size={20} />,
    children: [
      { title: 'Quản lý Nhóm Quyền', path: '/admin/roles', icon: <Users size={18} /> },
      { title: 'Ma trận Phân Quyền', path: '/admin/roles/permission-matrix', icon: <Settings size={18} /> },
    ],
  },
];
const Sidebar = ({isCollapsed, onLogout}) => {
    const [openSubMenu, setOpenSubMenu] = useState(null);
    const location = useLocation();
    const toggleSubMenu = (index) => {
        setOpenSubMenu(openSubMenu === index ? null : index);
    };
    const isActive = (path) => location.pathname === path;
    return(
        <div style={{
            width: isCollapsed ? '64px' : '250px',
            height: '100vh',
            backgroundColor: '#fff',
            borderRight: '1px solid #e0e0e0',
            transition: 'width 0.3s ease',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
        }}>
            {/*Logo area*/}
            <div style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: isCollapsed ? 'center' : 'flex-start' }}>
                <img src={logo} alt="KSC Logo" style={{ width: '32px', height: '32px', objectFit:'contain', marginRight: isCollapsed ? '0': '10px' }} />
                {!isCollapsed && (<span style={{ fontWeight: 'bold', fontSize: '18px' }}>KSC</span>)}
            </div>
            {/*Menu items*/}
            <div style={{ flex: 1 }}>
                {menuItems.map((item, index) => (
                <div key={index}>
                    <div 
                    onClick={() => toggleSubMenu(index)}
                    style={{
                        padding: '12px 20px',
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                        justifyContent: isCollapsed ? 'center' : 'space-between',
                        color: '#333',
                    }}
                    >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        {item.icon}
                        {!isCollapsed && <span style={{ marginLeft: '10px' }}>{item.title}</span>}
                    </div>
                    {!isCollapsed && (
                        openSubMenu === index ? <ChevronDown size={16} /> : <ChevronRight size={16} />
                    )}
                    </div>
                    {!isCollapsed && openSubMenu === index && (
                    <div style={{ backgroundColor: '#f9f9f9' }}>
                        {item.children.map((child, childIndex) => (
                        <Link 
                            key={childIndex} 
                            to={child.path} 
                            style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '10px 20px 10px 50px',
                            textDecoration: 'none',
                            color: isActive(child.path) ? '#007bff' : '#555',
                            backgroundColor: isActive(child.path) ? '#e6f7ff' : 'transparent',
                            }}
                        >
                            {child.icon}
                            <span style={{ marginLeft: '10px' }}>{child.title}</span>
                        </Link>
                        ))}
                    </div>
                    )}
                </div>
                ))}
            </div>
            {/*Logout Button*/}
            <div style={{ padding: '20px', borderTop: '1px solid #e0e0e0' }}>
                <button
                onClick={onLogout}
                style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: isCollapsed ? 'center' : 'flex-start',
                    padding: '10px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: '#e74c3c',
                    cursor: 'pointer',
                }}
                >
                <LogOut size={20} />
                {!isCollapsed && <span style={{ marginLeft: '10px' }}>Log out</span>}
                </button>
            </div>
            </div>
    );
};
export default Sidebar;