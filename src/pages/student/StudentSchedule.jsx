import React, {useState, useEffect} from "react";
import api from "../../api/axios";
import { Calendar, Clock, BookOpen, User } from 'lucide-react';

const StudentSchedule = () => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchMySchedule = async () => {
            try {
                setLoading(true);
                const res = await api.get('/student/schedule/my-sessions');
                setSessions(res.data);
            } catch (err) {
                console.error("Lỗi lấy thời khóa biểu:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchMySchedule();
    }, []);

    const formatDate = (dateString) => {
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
    };

    return (
        <div style={{ padding: '20px', background: '#fff', borderRadius: '8px' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Calendar size={24} color="#28a745" /> Thời Khóa Biểu Của Tôi
            </h2>
            
            {loading ? <p>Đang tải dữ liệu...</p> : sessions.length === 0 ? (
                <p style={{ color: '#888' }}>Bạn chưa có lịch học nào. Vui lòng liên hệ Admin để được xếp lớp.</p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                    <thead style={{ backgroundColor: '#f9fafb' }}>
                        <tr>
                            <th style={styles.th}>Ngày học</th>
                            <th style={styles.th}>Thời gian</th>
                            <th style={styles.th}>Lớp học</th>
                            <th style={styles.th}>Giáo viên</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sessions.map(session => (
                            <tr key={session.id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={styles.td}><strong>{formatDate(session.sessionDate)}</strong></td>
                                <td style={styles.td}>
                                    <Clock size={14} style={{ marginRight: '5px' }} />
                                    {session.startTime.substring(0,5)} - {session.endTime.substring(0,5)}
                                </td>
                                <td style={styles.td}>
                                    <BookOpen size={14} style={{ marginRight: '5px' }} />
                                    <span style={{ color: '#007bff', fontWeight: 'bold' }}>{session.classEntity?.className}</span>
                                </td>
                                <td style={styles.td}>
                                    <User size={14} style={{ marginRight: '5px' }} />
                                    {session.teacher?.username}
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
    th: { padding: '15px', textAlign: 'left', borderBottom: '1px solid #eee' },
    td: { padding: '15px' }
};

export default StudentSchedule;