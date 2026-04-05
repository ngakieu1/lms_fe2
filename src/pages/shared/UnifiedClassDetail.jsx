import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios'; // Nhớ điều chỉnh đường dẫn import axios của bạn
import { 
    BookOpen, ArrowLeft, Users, FileText, CalendarDays, 
    CheckCircle, Edit, DownloadCloud, Clock, UserCheck 
} from 'lucide-react';
import { useCallback } from 'react';

const UnifiedClassDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [classData, setClassData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('sessions');

    // Phân quyền
    // const userRole = localStorage.getItem('userRole') || ''; 
    const rawRole = localStorage.getItem('userRole') || ''; 
    const userRole = String(rawRole).toUpperCase();
    const isStudent = userRole.includes('STUDENT');
    // const isTeacher = userRole.startsWith('TEACHER');
    const isAdmin = userRole.includes('ADMIN') || userRole.includes('ROLE_ADMIN'); // Bắt cả ROLE_ADMIN cho chắc
    const isEnglishTeacher = userRole.includes('TEACHER_ENGLISH'); // Dành riêng cho GV tiếng Anh
    const isHomeroomTeacher = userRole.includes('TEACHER_HOMEROOM'); // Dành riêng cho GV chủ nhiệm
    const isTeacher = isEnglishTeacher || isHomeroomTeacher;
    // --- STATE ĐỔI TÊN LỚP ---
    const [isEditingName, setIsEditingName] = useState(false);
    const [editClassName, setEditClassName] = useState('');

    // --- STATE ĐỔI GV TIẾNG ANH (Dành cho Admin) ---
    const [isEditingTeacher, setIsEditingTeacher] = useState(false);
    const [selectedTeacherId, setSelectedTeacherId] = useState("");

    // --- STATE SỬA NHẬT KÝ (Dành cho GV) ---
    const [editingSession, setEditingSession] = useState(null);
    const [logData, setLogData] = useState({ content: '', teacherComment: '', homework: '', hrConfirmed: false });


    // Lấy dữ liệu lớp học
    const fetchClassDetail = useCallback(async () => {
        try {
            setLoading(true);
            const res = await api.get(`/shared/class-dashboard/${id}`);
            setClassData(res.data);
        } catch (err) {
            console.error("Lỗi lấy thông tin lớp:", err);
            alert("Không thể tải dữ liệu lớp học!");
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (id) fetchClassDetail();
    }, [id, fetchClassDetail]);

    // HÀM 1: LƯU TÊN LỚP
    const handleSaveClassName = async () => {
        if (!editClassName.trim()) return alert("Tên lớp không được để trống!");
        try {
            await api.put(`/admin/classes/${id}/name`, { className: editClassName });
            alert("Đã cập nhật tên lớp thành công!");
            setIsEditingName(false);
            fetchClassDetail();
        } catch (error) {
            alert(error.response?.data?.message || "Lỗi khi cập nhật tên lớp!");
        }
    }

    // HÀM 2: LƯU GV TIẾNG ANH MỚI
    const handleSaveTeacher = async () => {
        if (!selectedTeacherId) return alert("Vui lòng nhập Mã Giáo viên mới!");
        try {
            await api.post(`/admin/classes/${id}/change-teacher`, { newTeacherId: selectedTeacherId });
            alert("Đã đổi GV Tiếng Anh thành công!");
            setIsEditingTeacher(false);
            fetchClassDetail(); 
        } catch (error) {
            alert(error.response?.data?.message || "Lỗi khi đổi giáo viên!");
        }
    };

    // HÀM 3: MỞ MODAL VÀ LƯU NHẬT KÝ 
    const openEditLog = (session) => {
        setEditingSession(session);
        setLogData({
            content: session.unitContent || '', // Điều chỉnh lại tên trường cho khớp với Backend của bạn
            teacherComment: session.assessmentReport || '',
            homework: session.homeworkNote || '',
            hrConfirmed: session.hrConfirmed || false
        });
    };

    const handleSaveLog = async () => {
        try {
            // Đảm bảo API này có tồn tại ở Backend của bạn (File ClassSessionController)
            await api.put(`/sessions/${editingSession.id}/log`, logData);
            alert("Đã cập nhật nhật ký thành công!");
            setEditingSession(null);
            fetchClassDetail(); 
        } catch (error) {
            alert(error.response?.data?.message || "Lỗi khi cập nhật nhật ký!");
        }
    };

    // Hàm format ngày
    const formatShortDate = (dateString) => {
        if (!dateString) return '';
        const [, month, day] = dateString.split('-');
        return `${day}/${month}`;
    };

    if (loading) return <div style={{ padding: '20px' }}>Đang tải dữ liệu lớp học...</div>;
    if (!classData) return <div style={{ padding: '20px', color: 'red' }}>Không có dữ liệu!</div>;

    const { header, students, materials, sessions } = classData;
    // const { header, students, sessions } = classData;

    return (
        <div style={{ padding: '20px', backgroundColor: '#f4f6f8', minHeight: '100vh', position: 'relative' }}>
            <button onClick={() => navigate(-1)} style={styles.backBtn}>
                <ArrowLeft size={16} /> Quay lại
            </button>

            {/* --- BLOCK 1: HEADER --- */}
            <div style={styles.headerCard}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        {/* Khu vực Tên lớp */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                            <BookOpen size={28} color="#007bff" />
                            {isEditingName ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <input type="text" value={editClassName} onChange={(e) => setEditClassName(e.target.value)} style={{ padding: '6px 10px', fontSize: '20px', fontWeight: 'bold', borderRadius: '4px', border: '1px solid #007bff', outline: 'none' }} autoFocus />
                                    <button onClick={handleSaveClassName} style={{ background: '#28a745', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Lưu</button>
                                    <button onClick={() => setIsEditingName(false)} style={{ background: '#6c757d', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>Hủy</button>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <h2 style={{ margin: 0, color: '#333' }}>{header.className}</h2>
                                    {isAdmin && (
                                        <button onClick={() => { setEditClassName(header.className); setIsEditingName(true); }} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '16px' }} title="Sửa tên lớp">✏️</button>
                                    )}
                                    <span style={styles.tag}>{header.levelName}</span>
                                </div>
                            )}
                        </div>

                        {/* Khu vực Tên Giáo Viên */}
                        <div style={{ color: '#555', display: 'flex', gap: '20px', fontSize: '14px' }}>
                            <span style={{ display: 'flex', alignItems: 'center' }}>
                                <strong>GV Tiếng Anh: </strong> &nbsp;
                                {isEditingTeacher ? (
                                    <span style={{ display: 'flex', gap: '5px' }}>
                                        <input 
                                            type="text" 
                                            placeholder="Nhập Mã GV" 
                                            value={selectedTeacherId} 
                                            onChange={(e) => setSelectedTeacherId(e.target.value)} 
                                            style={{ padding: '4px', width: '150px' }}
                                        />
                                        <button onClick={handleSaveTeacher} style={{ background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Lưu</button>
                                        <button onClick={() => setIsEditingTeacher(false)} style={{ background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Hủy</button>
                                    </span>
                                ) : (
                                    <span>
                                        {header.englishTeacher}
                                        {isAdmin && (
                                            <button onClick={() => setIsEditingTeacher(true)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', paddingLeft: '5px' }} title="Đổi GV Tiếng Anh">✏️</button>
                                        )}
                                    </span>
                                )}
                            </span>
                            <span><strong>GV Chủ nhiệm:</strong> {header.homeroomTeacher}</span>
                        </div>
                    </div>
                    <button style={styles.joinBtn}>Tham gia Lớp học (Meet/ClassIn)</button>
                </div>
            </div>

            {/* --- BLOCK 2 & 3: TABS VÀ TABLE --- */}
            <div style={styles.tabContainer}>
                <button style={activeTab === 'sessions' ? styles.activeTab : styles.tab} onClick={() => setActiveTab('sessions')}><CalendarDays size={18} /> Nhật Ký</button>
                <button style={activeTab === 'materials' ? styles.activeTab : styles.tab} onClick={() => setActiveTab('materials')}><FileText size={18} /> Tài Nguyên</button>
                <button style={activeTab === 'students' ? styles.activeTab : styles.tab} onClick={() => setActiveTab('students')}><Users size={18} /> Học Sinh ({students.length})</button>
            </div>

            <div style={styles.contentCard}>
                {activeTab === 'sessions' && (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={styles.table}>
                            <thead style={styles.thead}>
                                <tr>
                                    <th style={styles.th}>Buổi</th>
                                    <th style={styles.th}>Ngày giờ</th>
                                    <th style={styles.th}>Nội dung (Unit)</th>
                                    <th style={styles.th}>Giáo viên phụ trách</th>
                                    <th style={styles.th}>Nhận xét của GV</th>
                                    <th style={styles.th}>Bài tập (HW)</th>
                                    {!isStudent && <th style={styles.th}>Xác nhận (HR)</th>}
                                    {!isStudent && <th style={styles.th}>Thao tác</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {sessions.map((ses, index) => (
                                    <tr key={ses.id} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={styles.td}><strong>{index + 1}</strong></td>
                                        <td style={styles.td}>
                                            <div style={{ color: '#d32f2f', fontWeight: 'bold' }}>{formatShortDate(ses.date)}</div>
                                            <div style={{ fontSize: '12px', color: '#666' }}><Clock size={12} inline /> {ses.time}</div>
                                        </td>
                                        <td style={styles.td}>{ses.unitContent || '---'}</td>
                                        <td style={styles.td}>
                                            <div style={{ fontWeight: 'bold', color: '#007bff' }}>{ses.teacher?.username || 'N/A'}</div>
                                            <div style={{ fontSize: '12px', color: '#666' }}>Mã GV: {ses.teacher?.id || 'N/A'}</div>
                                        </td>
                                        <td style={{ ...styles.td, maxWidth: '200px' }}>{ses.assessmentReport || '---'}</td>
                                        <td style={styles.td}>{ses.homeworkNote || '---'}</td>
                                        {!isStudent && (
                                            <td style={styles.td}>
                                                {ses.hrConfirmed ? <span style={{ color: '#28a745', fontWeight: 'bold', fontSize: '12px' }}><CheckCircle size={14} inline /> Đã XN</span> : <span style={{ color: '#888', fontSize: '12px' }}>Chưa XN</span>}
                                            </td>
                                        )}
                                        {!isStudent && (
                                            <td style={styles.td}>
                                                <div style={{ display: 'flex', gap: '5px', flexDirection: 'column' }}>
                                                    {/* NÚT MỞ POPUP GHI SỔ */}
                                                    {(isTeacher || isAdmin) && (
                                                        <button onClick={() => openEditLog(ses)} style={styles.actionBtnTeacher} title="Cập nhật nhật ký">
                                                            <Edit size={14} /> Ghi sổ
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
                {/* Tab Material và Students tôi giữ nguyên của bạn để tiết kiệm độ dài, bạn copy phần cũ của bạn đắp vào đây nhé */}
                {/* --- TAB 2: TÀI NGUYÊN HỌC TẬP --- */}
                {activeTab === 'materials' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', padding: '10px' }}>
                        {(!materials || materials.length === 0) ? (
                            <p style={{ color: '#888' }}>Chưa có tài liệu nào được gán cho lớp này.</p>
                        ) : (
                            materials.map(mat => (
                                <div key={mat.id} style={{ background: '#fff', border: '1px solid #e0e0e0', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                                    <FileText size={32} color="#007bff" style={{ marginBottom: '10px' }} />
                                    <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>{mat.title}</h4>
                                    <p style={{ fontSize: '13px', color: '#666', marginBottom: '15px' }}>{mat.description}</p>
                                    <a href={mat.fileUrl} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: '#e9ecef', color: '#333', padding: '6px 12px', borderRadius: '4px', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold' }}>
                                        <DownloadCloud size={16} /> Xem / Tải về
                                    </a>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* --- TAB 3: DANH SÁCH HỌC SINH --- */}
                {activeTab === 'students' && (
                    <div style={{ overflowX: 'auto', padding: '10px' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #eee' }}>
                            <thead style={{ backgroundColor: '#f9fafb' }}>
                                <tr>
                                    <th style={{ padding: '15px', textAlign: 'left', color: '#555', borderBottom: '1px solid #eee' }}>STT</th>
                                    <th style={{ padding: '15px', textAlign: 'left', color: '#555', borderBottom: '1px solid #eee' }}>Tên Học Sinh</th>
                                    <th style={{ padding: '15px', textAlign: 'left', color: '#555', borderBottom: '1px solid #eee' }}>Mã HS / Tài khoản</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(!students || students.length === 0) ? (
                                    <tr><td colSpan="3" style={{ padding: '15px', textAlign: 'center', color: '#888' }}>Lớp học chưa có học sinh.</td></tr>
                                ) : (
                                    students.map((stu, idx) => (
                                        <tr key={stu.id} style={{ borderBottom: '1px solid #eee', backgroundColor: '#fff' }}>
                                            <td style={{ padding: '15px' }}>{idx + 1}</td>
                                            <td style={{ padding: '15px', fontWeight: 'bold', color: '#333' }}>{stu.username}</td>
                                            <td style={{ padding: '15px', color: '#666' }}>{stu.email || 'N/A'}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* --- MODAL SỬA NHẬT KÝ (POPUP) --- */}
            {editingSession && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div style={{ background: 'white', padding: '20px', borderRadius: '8px', width: '500px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                        <h3 style={{ marginTop: 0 }}>Ghi Nhật Ký - Buổi học Ngày {formatShortDate(editingSession.date)}</h3>
                        
                        {/* 🌟 CHỈ ADMIN HOẶC GV CHỦ NHIỆM MỚI THẤY PHẦN NÀY */}
                        {(isAdmin || isHomeroomTeacher) && (
                            <div style={{ padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '8px', marginBottom: '15px', border: '1px solid #e9ecef' }}>
                                <div style={{ marginBottom: '10px' }}>
                                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', color: '#007bff' }}>Nội dung (Unit) - Dành cho GVCN/Admin:</label>
                                    <input type="text" value={logData.content} onChange={(e) => setLogData({...logData, content: e.target.value})} style={{ width: '100%', padding: '8px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }} placeholder="VD: Unit 1 - Lesson 2" />
                                </div>
                                <div>
                                    <label style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold', cursor: 'pointer', color: '#28a745' }}>
                                        <input 
                                            type="checkbox" 
                                            checked={logData.hrConfirmed} 
                                            onChange={(e) => setLogData({...logData, hrConfirmed: e.target.checked})} 
                                            style={{ marginRight: '8px', width: '16px', height: '16px' }} 
                                        />
                                        Xác nhận chăm sóc / Điểm danh (HR)
                                    </label>
                                </div>
                            </div>
                        )}

                        {/* 🌟 CHỈ ADMIN HOẶC GV TIẾNG ANH MỚI THẤY PHẦN NÀY */}
                        {(isAdmin || isEnglishTeacher) && (
                            <div style={{ padding: '10px', backgroundColor: '#fff', borderRadius: '8px', marginBottom: '15px', border: '1px solid #e9ecef' }}>
                                <div style={{ marginBottom: '10px' }}>
                                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', color: '#dc3545' }}>Nhận xét của GV Tiếng Anh:</label>
                                    <textarea rows="3" value={logData.teacherComment} onChange={(e) => setLogData({...logData, teacherComment: e.target.value})} style={{ width: '100%', padding: '8px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }} placeholder="Nhập nhận xét về tình hình học tập..." />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', color: '#dc3545' }}>Bài tập (Homework):</label>
                                    <textarea rows="2" value={logData.homework} onChange={(e) => setLogData({...logData, homework: e.target.value})} style={{ width: '100%', padding: '8px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }} placeholder="Giao bài tập về nhà..." />
                                </div>
                            </div>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                            <button onClick={() => setEditingSession(null)} style={{ padding: '8px 16px', border: '1px solid #ccc', background: '#f8f9fa', borderRadius: '4px', cursor: 'pointer' }}>Hủy</button>
                            <button onClick={handleSaveLog} style={{ padding: '8px 16px', border: 'none', background: '#007bff', color: 'white', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Lưu Nhật Ký</button>
                        </div>
                    </div>
                </div>
            )}
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