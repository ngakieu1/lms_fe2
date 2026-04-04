import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { BookOpen, PlusCircle, Search, Users } from 'lucide-react';
const AdminClassList = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        try {
            setLoading(true);
            const res = await api.get('/admin/classes'); 
            setClasses(res.data);
        } catch (error) {
            console.error('Lỗi lấy danh sách lớp của Admin:', error);
        } finally {
            setLoading(false);
        }
    };
    const filteredClasses = classes.filter((cls) => {
        const keyword = searchTerm.toLowerCase();
        const classNameMatch = cls.className?.toLowerCase().includes(keyword);
        const idMatch = cls.id?.toString().includes(keyword);
        const englishTeacherMatch = cls.mainEnglishTeacher?.username?.toLowerCase().includes(keyword);
        const homeroomTeacherMatch = cls.homeroomTeacher?.username?.toLowerCase().includes(keyword);
        return classNameMatch || idMatch || englishTeacherMatch || homeroomTeacherMatch;
    });

    return (
        <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            {/* --- HEADER --- */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <BookOpen size={28} color="#007bff" />
                    <h2 style={{ margin: 0, color: '#333' }}>Quản Lý Lớp Học</h2>
                </div>
                
                {/* Nút Tạo Lớp */}
                <button 
                    onClick={() => navigate('/admin/classes/create')} 
                    style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#28a745', color: 'white', padding: '10px 15px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    <PlusCircle size={18} /> Tạo lớp học mới
                </button>
            </div>
            {/* Search bar */}
            <div style={{ marginBottom: '20px', position: 'relative', maxWidth: '400px' }}>
                <Search size={18} color="#888" style={{ position: 'absolute', left: '12px', top: '10px' }} />
                <input 
                    type="text" 
                    placeholder="Tìm theo Tên lớp, ID, hoặc tên Giáo viên..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: '100%', padding: '10px 10px 10px 38px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px', outline: 'none' }}
                />
            </div>

            {/* --- TABLE --- */}
            {loading ? (
                <p>Đang tải dữ liệu...</p>
            ) : filteredClasses.length === 0 ? (
                // 🌟 Báo lỗi nếu tìm không ra kết quả
                <p style={{ color: '#888', fontStyle: 'italic', textAlign: 'center', padding: '20px' }}>
                    Không tìm thấy lớp học nào khớp với từ khóa "{searchTerm}".
                </p>
            ) :
            (
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #eee' }}>
                        <thead style={{ backgroundColor: '#f9fafb' }}>
                            <tr>
                                <th style={styles.th}>ID</th>
                                <th style={styles.th}>Tên Lớp Học</th>
                                <th style={styles.th}>Giáo Viên</th>
                                <th style={styles.th}>Sĩ số</th>
                                <th style={styles.th}>Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredClasses.map((cls) => (
                                <tr key={cls.id} style={{ borderBottom: '1px solid #eee', transition: '0.2s', backgroundColor: cls.statusClass?.statusName === 'Done' ? '#fcfcfc' : '#fff' }}>
                                    
                                    <td style={styles.td}><strong>#{cls.id}</strong></td>
                                    
                                    <td style={styles.td}>
                                        {/* 🌟 HYPERLINK TRỎ VÀO CHI TIẾT */}
                                        <div 
                                            style={{ color: '#007bff', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' }}
                                            onClick={() => navigate(`/admin/classes/${cls.id}`)}
                                        >
                                            {cls.className}
                                        </div>
                                        <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                                            Cấp độ: {cls.level?.levelName || 'N/A'}
                                        </div>
                                    </td>
                                    
                                    <td style={styles.td}>
                                        <div style={{ fontSize: '13px', lineHeight: '1.6' }}>
                                            <div><strong>TA:</strong> {cls.mainEnglishTeacher?.username || <span style={{color: '#999'}}>Chưa xếp</span>}</div>
                                            <div><strong>CN:</strong> {cls.homeroomTeacher?.username || <span style={{color: '#999'}}>Chưa xếp</span>}</div>
                                        </div>
                                    </td>
                                    
                                    <td style={styles.td}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                            <Users size={14} color="#555" />
                                            {cls.currentStudents} / {cls.maxStudent}
                                        </div>
                                    </td>
                                    
                                    <td style={styles.td}>
                                        <span style={{ 
                                            padding: '5px 10px', 
                                            borderRadius: '12px', 
                                            fontSize: '12px', 
                                            fontWeight: 'bold',
                                            backgroundColor: cls.statusClass?.statusName === 'Ongoing' ? '#d4edda' : (cls.statusClass?.statusName === 'Pending' ? '#fff3cd' : '#e2e3e5'),
                                            color: cls.statusClass?.statusName === 'Ongoing' ? '#155724' : (cls.statusClass?.statusName === 'Pending' ? '#856404' : '#383d41')
                                        }}>
                                            {cls.statusClass?.statusName || 'N/A'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

const styles = {
    th: { padding: '15px', textAlign: 'left', color: '#555', borderBottom: '1px solid #eee', whiteSpace: 'nowrap' },
    td: { padding: '15px', verticalAlign: 'middle' }
};

export default AdminClassList;