import React, {useState} from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import {ChevronLeft} from 'lucide-react';
import { Outlet } from 'react-router-dom';

const AdminLayout = ({onLogout}) =>{
    const [isCollapsed, setIsCollapsed] = useState(false);
    return (
        <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f4f6f9' }}>
            <Sidebar isCollapsed={isCollapsed} onLogout={onLogout} />
            {/*Collapse Button*/}
            <button
               onClick={() => setIsCollapsed(!isCollapsed)}
                style={{
                position: 'absolute',
                top: '20px',
                left: isCollapsed ? '50px' : '235px',
                width: '24px',
                height: '24px',
                backgroundColor: '#fff',
                border: '1px solid #e0e0e0',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'left 0.3s ease',
                zIndex: 10,
                }}>
                    <ChevronLeft size={16} style={{ transform: isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }} />
                </button>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <TopBar />
                    <main style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                    <Outlet />
                    </main>
                </div>
                </div>
    );
}
export default AdminLayout;