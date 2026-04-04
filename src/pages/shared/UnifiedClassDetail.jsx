import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios'; // Nhớ điều chỉnh đường dẫn import axios của bạn
import { 
    BookOpen, ArrowLeft, Users, FileText, CalendarDays, 
    CheckCircle, Edit, DownloadCloud, Clock, UserCheck 
} from 'lucide-react';

const UnifiedClassDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [classData, setClassData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('sessions'); // Mặc định mở tab Nhật ký

    // 🌟 Lấy Quyền (Role) hiện tại từ localStorage (Hoặc Context của bạn)
    // Giả sử bạn lưu role dưới dạng chuỗi: 'ADMIN', 'TEACHER_ENGLISH', 'STUDENT'...
    const userRole = localStorage.getItem('userRole') || ''; 
    const isStudent = userRole.startsWith('STUDENT');
    const isTeacher = userRole.startsWith('TEACHER');
    const isAdmin = !isTeacher && !isStudent; // Giả định nếu không phải Teacher hay Student thì là Admin
    // const isAdmin = userRole.startsWith('ADMIN')

    useEffect(() => {
        const fetchClassDetail = async () => {
            try {
                setLoading(true);
                // Gọi API dùng chung mà chúng ta vừa viết ở Backend
                const res = await api.get(`/shared/class-dashboard/${id}`);
                setClassData(res.data);
            } catch (err) {
                console.error("Lỗi lấy thông tin lớp:", err);
                alert("Không thể tải dữ liệu lớp học!");
            } finally {
                setLoading(false);
            }
        };
        if (id){
            fetchClassDetail();
        }
    }, [id]);

    // Hàm format ngày (VD: 2026-03-20 -> 20/03) để bảng gọn gàng giống Excel
    const formatShortDate = (dateString) => {
        if (!dateString) return '';
        const [, month, day] = dateString.split('-');
        return `${day}/${month}`;
    };

    if (loading) return <div style={{ padding: '20px' }}>Đang tải dữ liệu lớp học...</div>;
    if (!classData) return <div style={{ padding: '20px', color: 'red' }}>Không có dữ liệu!</div>;

    const { header, students, materials, sessions } = classData;

    return (
        <div style={{ padding: '20px', backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
            {/* 🔙 Nút Quay lại */}
            <button onClick={() => navigate(-1)} style={styles.backBtn}>
                <ArrowLeft size={16} /> Quay lại
            </button>

            {/* --- BLOCK 1: HEADER THÔNG TIN CHUNG --- */}
            <div style={styles.headerCard}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                            <BookOpen size={28} color="#007bff" />
                            <h2 style={{ margin: 0, color: '#333' }}>{header.className}</h2>
                            <span style={styles.tag}>{header.levelName}</span>
                        </div>
                        <div style={{ color: '#555', display: 'flex', gap: '20px', fontSize: '14px' }}>
                            <span><strong>GV Tiếng Anh:</strong> {header.englishTeacher}</span>
                            <span><strong>GV Chủ nhiệm:</strong> {header.homeroomTeacher}</span>
                        </div>
                    </div>
                    {/* Nút vào lớp học Online */}
                    <button style={styles.joinBtn}>Tham gia Lớp học (Meet/ClassIn)</button>
                </div>
            </div>

            {/* --- BLOCK 2: KHU VỰC TABS --- */}
            <div style={styles.tabContainer}>
                <button 
                    style={activeTab === 'sessions' ? styles.activeTab : styles.tab} 
                    onClick={() => setActiveTab('sessions')}
                >
                    <CalendarDays size={18} /> Nhật Ký Giảng Dạy
                </button>
                <button 
                    style={activeTab === 'materials' ? styles.activeTab : styles.tab} 
                    onClick={() => setActiveTab('materials')}
                >
                    <FileText size={18} /> Tài Nguyên Học Tập
                </button>
                <button 
                    style={activeTab === 'students' ? styles.activeTab : styles.tab} 
                    onClick={() => setActiveTab('students')}
                >
                    <Users size={18} /> Danh Sách Lớp ({students.length})
                </button>
            </div>

            {/* --- BLOCK 3: NỘI DUNG TAB --- */}
            <div style={styles.contentCard}>
                
                {/* 🏷️ TAB 1: NHẬT KÝ GIẢNG DẠY (BẢNG TRACKER EXCEL) */}
                {activeTab === 'sessions' && (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={styles.table}>
                            <thead style={styles.thead}>
                                <tr>
                                    <th style={styles.th}>Buổi</th>
                                    <th style={styles.th}>Ngày giờ</th>
                                    <th style={styles.th}>Nội dung (Unit)</th>
                                    <th style={styles.th}>Nhận xét của GV</th>
                                    <th style={styles.th}>Bài tập (HW)</th>
                                    {/* Ẩn cột Xác nhận nếu là Học sinh */}
                                    {!isStudent && <th style={styles.th}>Xác nhận (HR)</th>}
                                    {/* Ẩn cột Thao tác nếu là Học sinh */}
                                    {!isStudent && <th style={styles.th}>Thao tác</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {sessions.map((ses, index) => (
                                    <tr key={ses.id} style={{ borderBottom: '1px solid #eee', backgroundColor: ses.status === 'COMPLETED' ? '#f9fff9' : '#fff' }}>
                                        <td style={styles.td}><strong>{index + 1}</strong></td>
                                        <td style={styles.td}>
                                            <div style={{ color: '#d32f2f', fontWeight: 'bold' }}>{formatShortDate(ses.date)}</div>
                                            <div style={{ fontSize: '12px', color: '#666' }}><Clock size={12} inline /> {ses.time}</div>
                                            <div style={{ fontSize: '12px', color: '#007bff' }}>GV: {ses.teacherName}</div>
                                        </td>
                                        <td style={styles.td}>{ses.unitContent || '---'}</td>
                                        <td style={{ ...styles.td, maxWidth: '200px' }}>{ses.assessmentReport || '---'}</td>
                                        <td style={styles.td}>{ses.homeworkNote || '---'}</td>
                                        
                                        {!isStudent && (
                                            <td style={styles.td}>
                                                {ses.hrConfirmed ? 
                                                    <span style={{ color: '#28a745', fontWeight: 'bold', fontSize: '12px' }}><CheckCircle size={14} inline /> Đã XN</span> 
                                                    : <span style={{ color: '#888', fontSize: '12px' }}>Chưa XN</span>
                                                }
                                            </td>
                                        )}

                                        {!isStudent && (
                                            <td style={styles.td}>
                                                <div style={{ display: 'flex', gap: '5px', flexDirection: 'column' }}>
                                                    {isTeacher && (
                                                        <button style={styles.actionBtnTeacher} title="Cập nhật nhật ký">
                                                            <Edit size={14} /> Điền form
                                                        </button>
                                                    )}
                                                    {isAdmin && (
                                                        <button style={styles.actionBtnAdmin} title="Xác nhận chăm sóc">
                                                            <UserCheck size={14} /> Xác nhận
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* 🏷️ TAB 2: TÀI LIỆU LỚP HỌC */}
                {activeTab === 'materials' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                        {materials.length === 0 ? <p>Chưa có tài liệu nào được gán cho lớp này.</p> : null}
                        {materials.map(mat => (
                            <div key={mat.id} style={styles.materialCard}>
                                <FileText size={32} color="#007bff" style={{ marginBottom: '10px' }} />
                                <h4 style={{ margin: '0 0 5px 0' }}>{mat.title}</h4>
                                <p style={{ fontSize: '13px', color: '#666', marginBottom: '15px' }}>{mat.description}</p>
                                <a href={mat.fileUrl} target="_blank" rel="noreferrer" style={styles.downloadBtn}>
                                    <DownloadCloud size={16} /> Xem / Tải về
                                </a>
                            </div>
                        ))}
                    </div>
                )}

                {/* 🏷️ TAB 3: DANH SÁCH HỌC SINH */}
                {activeTab === 'students' && (
                    <table style={styles.table}>
                        <thead style={styles.thead}>
                            <tr>
                                <th style={styles.th}>STT</th>
                                <th style={styles.th}>Tên Học Sinh</th>
                                <th style={styles.th}>Mã HS / Tài khoản</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((stu, idx) => (
                                <tr key={stu.id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={styles.td}>{idx + 1}</td>
                                    <td style={{ ...styles.td, fontWeight: 'bold' }}>{stu.username}</td>
                                    <td style={styles.td}>{stu.email || 'N/A'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

            </div>
        </div>
    );
};

// --- CSS IN JS (Giúp code gọn 1 file, bạn có thể chuyển sang file .css sau) ---
const styles = {
    backBtn: { marginBottom: '15px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', background: 'none', border: 'none', color: '#555', fontWeight: 'bold' },
    headerCard: { background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', marginBottom: '20px' },
    tag: { padding: '5px 10px', background: '#e2e3e5', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' },
    joinBtn: { background: '#28a745', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', height: 'fit-content' },
    
    tabContainer: { display: 'flex', gap: '10px', marginBottom: '20px' },
    tab: { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: '#fff', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer', color: '#555', fontWeight: 'bold', transition: '0.2s' },
    activeTab: { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: '#007bff', border: '1px solid #007bff', borderRadius: '6px', cursor: 'pointer', color: '#fff', fontWeight: 'bold' },
    
    contentCard: { background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
    
    table: { width: '100%', borderCollapse: 'collapse' },
    thead: { backgroundColor: '#f0f2f5' },
    th: { padding: '12px 15px', textAlign: 'left', color: '#333', fontSize: '14px', whiteSpace: 'nowrap' },
    td: { padding: '12px 15px', fontSize: '14px', verticalAlign: 'top' },
    
    materialCard: { border: '1px solid #eee', padding: '15px', borderRadius: '8px', background: '#fcfcfc' },
    downloadBtn: { display: 'flex', alignItems: 'center', gap: '5px', background: '#e8f0fe', color: '#007bff', padding: '8px 12px', borderRadius: '4px', textDecoration: 'none', fontSize: '13px', fontWeight: 'bold', width: 'fit-content' },
    
    actionBtnTeacher: { display: 'flex', alignItems: 'center', gap: '5px', background: '#007bff', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' },
    actionBtnAdmin: { display: 'flex', alignItems: 'center', gap: '5px', background: '#28a745', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }
};

export default UnifiedClassDetail;