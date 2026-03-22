import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Calendar, Clock, BookOpen, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TeacherSchedule = () => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchMySchedule();
    }, []);
    const fetchMySchedule = async () => {
        try{
            setLoading(true);
            const res = await api.get('/teacher/schedule/my-sessions');
            setSessions(res.data);
        } catch (error) {
            console.error('Error fetching schedule:', error);
        } finally {
            setLoading(false);
        }
    };
    const handleRequestLeave = async(sessionId) => {
        if (!window.confirm('Bạn có chắc chắn muốn xin nghỉ buổi học này?')) {
            return;
        }
        try {
            await api.post(`/teacher/schedule/leave-request/${sessionId}`);
            alert("Đã gửi yêu cầu xin nghỉ thành công!");
            fetchMySchedule();
        } catch (error){
            console.error("Lỗi khi xin nghỉ:", error);
            alert("Có lỗi xảy ra, không thể gửi yêu cầu.");
        }
    };

    const formatDate = (dateString) => {
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
    };
    return (
        <div style={{ padding: '20px', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <Calendar size={24} color="#007bff" />
                <h2 style={{ margin: 0, color: '#333' }}>Lịch Dạy Thực Tế Của Tôi</h2>
            </div>
            
            <p style={{ color: '#666', marginBottom: '20px' }}>
                Đây là danh sách các buổi học cụ thể mà bạn đã được Admin phân công.
            </p>

            {loading ? (
                <p>Đang tải dữ liệu...</p>
            ) : sessions.length === 0 ? (
                <p style={{ color: '#888', fontStyle: 'italic' }}>Bạn chưa có lịch dạy nào.</p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #eee' }}>
                    <thead style={{ backgroundColor: '#f9fafb' }}>
                        <tr>
                            <th style={styles.th}>Ngày học</th>
                            <th style={styles.th}>Thời gian</th>
                            <th style={styles.th}>Lớp học</th>
                            <th style={styles.th}>Trạng thái</th>
                            <th style={styles.th}>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sessions.map(session => (
                            <tr key={session.id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={styles.td}>
                                    <strong>{formatDate(session.sessionDate)}</strong>
                                </td>
                                <td style={styles.td}>
                                    <Clock size={14} style={{ verticalAlign: 'middle', marginRight: '5px' }} />
                                    {session.startTime.substring(0,5)} - {session.endTime.substring(0,5)}
                                </td>
                                <td style={styles.td}>
                                    <BookOpen size={14} style={{ verticalAlign: 'middle', marginRight: '5px' }} />
                                    <span style={{ color: '#007bff', fontWeight: 'bold' }}
                                            onClick={() => navigate(`/teacher/classes/${session.classEntity?.id}`)}
                                    >
                                        {session.classEntity?.className || 'N/A'}
                                    </span>
                                </td>
                                <td style={styles.td}>
                                    <span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '12px', background: '#e2e3e5', color: '#383d41', fontWeight: 'bold' }}>
                                        {session.statuss}
                                    </span>
                                </td>
                                <td style={styles.td}>
                                    <button 
                                        onClick={() => handleRequestLeave(session.id)} // 
                                        style={{ padding: '6px 12px', background: session.statuss === 'LEAVE_REQUESTED' ? '#6c757d' : '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                                        disabled={session.statuss === 'LEAVE_REQUESTED'} // Nếu đã xin nghỉ rồi thì mờ nút đi
                                    >
                                        <AlertCircle size={14} /> 
                                        {session.statuss === 'LEAVE_REQUESTED' ? 'Đang chờ duyệt' : 'Xin nghỉ buổi này'}
                                    </button>
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
    td: { padding: '15px' }
};
export default TeacherSchedule;