import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { BookOpen } from 'lucide-react';

const StudentClassList = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMyClasses = async () => {
            try {
                setLoading(true);
                // Gọi API lấy lớp của riêng Học sinh này
                const res = await api.get('/student/classes'); 
                setClasses(res.data);
            } catch (error) {
                console.error('Lỗi lấy danh sách lớp:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchMyClasses();
    }, []);

    return (
        <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <BookOpen size={24} color="#007bff" />
                <h2 style={{ margin: 0, color: '#333' }}>Lớp Học Của Tôi</h2>
            </div>

            {loading ? (
                <p>Đang tải dữ liệu...</p>
            ) : classes.length === 0 ? (
                <p style={{ color: '#888', fontStyle: 'italic' }}>Bạn chưa được xếp vào lớp học nào.</p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                    {classes.map((cls) => (
                        <div key={cls.id} style={styles.card}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                {/* 🌟 HYPERLINK DÀNH CHO HỌC SINH */}
                                <h3 
                                    style={styles.className}
                                    onClick={() => navigate(`/student/classes/${cls.id}`)}
                                >
                                    {cls.className}
                                </h3>
                                <span style={styles.tag}>{cls.level?.levelName || 'N/A'}</span>
                            </div>
                            <div style={{ color: '#555', fontSize: '14px', lineHeight: '1.6' }}>
                                <p style={{ margin: 0 }}><strong>GV Tiếng Anh:</strong> {cls.mainEnglishTeacher?.username || 'Đang cập nhật'}</p>
                                <p style={{ margin: 0 }}><strong>GV Chủ nhiệm:</strong> {cls.homeroomTeacher?.username || 'Đang cập nhật'}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const styles = {
    card: { border: '1px solid #e0e0e0', borderRadius: '8px', padding: '20px', backgroundColor: '#fafafa', transition: '0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' },
    className: { margin: 0, color: '#007bff', cursor: 'pointer', textDecoration: 'underline', fontSize: '18px' },
    tag: { padding: '4px 8px', background: '#e2e3e5', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }
};

export default StudentClassList;