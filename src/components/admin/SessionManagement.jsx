import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Calendar, Clock, BookOpen, AlertCircle, UserPlus, CheckCircle } from 'lucide-react';

const SessionManagement = () => {
    const [orphanedSessions, setOrphanedSessions] = useState([]);
    const [englishTeachers, setEnglishTeachers] = useState([]);
    
    // State lưu giáo viên được chọn cho từng dòng { sessionId: teacherId }
    const [selectedTeachers, setSelectedTeachers] = useState({}); 
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchOrphanedSessions();
        fetchTeachers();
    }, []);

    const fetchOrphanedSessions = async () => {
        try {
            setLoading(true);
            const res = await api.get('/admin/sessions/orphaned');
            setOrphanedSessions(res.data);
        } catch (error) {
            console.error('Lỗi lấy buổi học trống:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTeachers = async () => {
        try {
            // Tận dụng lại API lấy user đã viết trước đó
            const res = await api.get('/admin/users'); 
            const teachers = res.data.filter(u => u.role?.name?.includes('TEACHER_ENGLISH'));
            setEnglishTeachers(teachers);
        } catch (error) {
            console.error('Lỗi lấy danh sách giáo viên:', error);
        }
    };

    const handleSelectChange = (sessionId, teacherId) => {
        setSelectedTeachers(prev => ({
            ...prev,
            [sessionId]: teacherId
        }));
    };

    const handleAssignTeacher = async (sessionId) => {
        const teacherId = selectedTeachers[sessionId];
        if (!teacherId) {
            alert("Vui lòng chọn một giáo viên để gán!");
            return;
        }

        try {
            await api.post(`/admin/sessions/${sessionId}/assign-teacher`, { teacherId });
            alert("Đã gán giáo viên dạy thay thành công!");
            fetchOrphanedSessions(); // Refresh lại danh sách sẽ tự động làm biến mất buổi học này
        } catch (err) {
            alert(err.response?.data?.message || "Lỗi khi gán giáo viên!");
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
    };

    return (
        <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <Calendar size={24} color="#dc3545" />
                <h2 style={{ margin: 0, color: '#333' }}>Quản Lý Ca Học Trống Giáo Viên</h2>
            </div>

            <p style={{ color: '#666', marginBottom: '20px' }}>
                Danh sách các ca học bị khuyết giáo viên (do Admin duyệt cho nghỉ hoặc lý do khác). Vui lòng gán người dạy thay để đảm bảo tiến độ lớp học.
            </p>

            {loading ? (
                <p>Đang tải dữ liệu...</p>
            ) : orphanedSessions.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', background: '#f8f9fa', borderRadius: '8px', color: '#888' }}>
                    <CheckCircle size={40} color="#28a745" style={{ marginBottom: '10px' }} />
                    <p>Tuyệt vời! Không có ca học nào bị trống giáo viên.</p>
                </div>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #eee' }}>
                    <thead style={{ backgroundColor: '#f9fafb' }}>
                        <tr>
                            <th style={styles.th}>Lớp học</th>
                            <th style={styles.th}>Ngày học</th>
                            <th style={styles.th}>Thời gian</th>
                            <th style={styles.th}>Gán giáo viên dạy thay</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orphanedSessions.map(session => (
                            <tr key={session.id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={styles.td}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold', color: '#007bff' }}>
                                        <BookOpen size={16} /> {session.classEntity?.className}
                                    </div>
                                </td>
                                <td style={styles.td}>
                                    <strong>{formatDate(session.sessionDate)}</strong>
                                </td>
                                <td style={styles.td}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#555' }}>
                                        <Clock size={14} /> {session.startTime?.substring(0, 5)} - {session.endTime?.substring(0, 5)}
                                    </div>
                                </td>
                                <td style={styles.td}>
                                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                        <select 
                                            style={styles.select}
                                            value={selectedTeachers[session.id] || ""}
                                            onChange={(e) => handleSelectChange(session.id, e.target.value)}
                                        >
                                            <option value="">-- Chọn GV Tiếng Anh --</option>
                                            {englishTeachers.map(t => (
                                                <option key={t.id} value={t.id}>{t.username}</option>
                                            ))}
                                        </select>
                                        <button 
                                            onClick={() => handleAssignTeacher(session.id)}
                                            style={styles.assignBtn}
                                        >
                                            <UserPlus size={14} /> Gán
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

const styles = {
    th: { padding: '15px', textAlign: 'left', color: '#555', borderBottom: '1px solid #eee' },
    td: { padding: '15px', verticalAlign: 'middle' },
    select: { padding: '8px', borderRadius: '4px', border: '1px solid #ccc', minWidth: '200px' },
    assignBtn: { display: 'flex', alignItems: 'center', gap: '5px', background: '#007bff', color: 'white', padding: '8px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }
};

export default SessionManagement;