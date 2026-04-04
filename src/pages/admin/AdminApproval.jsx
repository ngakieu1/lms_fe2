import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { CheckCircle, XCircle, AlertCircle, Clock, User, BookOpen, FileText, Link } from 'lucide-react';

const AdminApproval = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchPendingRequests();
    }, []);

    const fetchPendingRequests = async () => {
        try {
            setLoading(true);
            // Gọi API lấy toàn bộ danh sách Đơn xin nghỉ đang chờ duyệt (PENDING)
            const res = await api.get('/admin/leave-requests/pending');
            setRequests(res.data);
        } catch (error) {
            console.error('Lỗi lấy danh sách yêu cầu:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (requestId) => {
        if (!window.confirm("Phê duyệt yêu cầu này? Admin sẽ cần sắp xếp giáo viên thay thế.")) return;
        try {
            await api.post(`/admin/leave-requests/${requestId}/approve`);
            alert("Đã phê duyệt thành công!");
            fetchPendingRequests();
        } catch (err) {
            alert(err.response?.data?.message || "Lỗi khi phê duyệt!");
        }
    };

    const handleReject = async (requestId) => {
        if (!window.confirm("Từ chối xin nghỉ? Giáo viên sẽ bắt buộc phải tiếp tục giảng dạy.")) return;
        try {
            await api.post(`/admin/leave-requests/${requestId}/reject`);
            alert("Đã từ chối yêu cầu!");
            fetchPendingRequests();
        } catch (err) {
            alert(err.response?.data?.message || "Lỗi khi từ chối!");
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const [year, month, day] = dateString.substring(0, 10).split('-');
        return `${day}/${month}/${year}`;
    };

    return (
        <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <AlertCircle size={28} color="#e67e22" />
                <h2 style={{ margin: 0, color: '#333' }}>Phê Duyệt Đơn Xin Nghỉ</h2>
            </div>

            <p style={{ color: '#666', marginBottom: '20px' }}>
                Danh sách các yêu cầu xin rút khỏi lớp hoặc xin nghỉ buổi dạy từ Giáo viên.
            </p>

            {loading ? (
                <p>Đang tải dữ liệu...</p>
            ) : requests.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', background: '#f8f9fa', borderRadius: '8px', color: '#888' }}>
                    <CheckCircle size={40} color="#28a745" style={{ marginBottom: '10px' }} />
                    <p>Tuyệt vời! Hiện tại không có Đơn xin nghỉ nào cần xử lý.</p>
                </div>
            ) : (
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #eee' }}>
                        <thead style={{ backgroundColor: '#f9fafb' }}>
                            <tr>
                                <th style={styles.th}>Giáo viên</th>
                                <th style={styles.th}>Thông tin xin nghỉ</th>
                                <th style={styles.th}>Lý do & Minh chứng</th>
                                <th style={styles.th}>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map((req) => (
                                <tr key={req.id} style={{ borderBottom: '1px solid #eee' }}>
                                    
                                    <td style={styles.td}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', color: '#007bff', fontSize: '15px' }}>
                                            <User size={16} /> {req.teacher?.username || 'N/A'}
                                        </div>
                                        <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>
                                            Ngày gửi: {formatDate(req.createdAt)}
                                        </div>
                                    </td>
                                    
                                    <td style={styles.td}>
                                        {/* Phân loại nhãn: Nghỉ Lớp hay Nghỉ Buổi */}
                                        <div style={{ display: 'inline-block', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', marginBottom: '8px',
                                            backgroundColor: req.requestType === 'LEAVE_CLASS' ? '#f8d7da' : '#fff3cd',
                                            color: req.requestType === 'LEAVE_CLASS' ? '#721c24' : '#856404'
                                        }}>
                                            {req.requestType === 'LEAVE_CLASS' ? 'Xin rút khỏi lớp' : 'Xin nghỉ buổi học'}
                                        </div>
                                        
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', color: '#333' }}>
                                            <BookOpen size={16} color="#666" /> {req.classEntity?.className}
                                        </div>
                                        
                                        {/* Nếu là nghỉ 1 buổi, hiện thêm giờ học */}
                                        {req.requestType === 'LEAVE_SESSION' && req.sessionDate && (
                                            <div style={{ color: '#555', fontSize: '13px', marginTop: '5px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                <Clock size={14} /> Ngày: {formatDate(req.sessionDate)}
                                            </div>
                                        )}
                                    </td>
                                    
                                    <td style={styles.td}>
                                        <div style={{ display: 'flex', gap: '5px', alignItems: 'flex-start' }}>
                                            <FileText size={16} color="#666" style={{ marginTop: '2px', flexShrink: 0 }} />
                                            <span style={{ fontSize: '14px', color: '#333', lineHeight: '1.5' }}>
                                                {req.reason || <i style={{color: '#999'}}>Không có lý do</i>}
                                            </span>
                                        </div>
                                        
                                        {/* Nút xem minh chứng nếu có link */}
                                        {req.proofUrl && (
                                            <a 
                                                href={req.proofUrl} 
                                                target="_blank" 
                                                rel="noreferrer" 
                                                style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', marginTop: '8px', fontSize: '13px', color: '#007bff', textDecoration: 'none', background: '#f0f7ff', padding: '4px 8px', borderRadius: '4px' }}
                                            >
                                                <Link size={12} /> Xem minh chứng
                                            </a>
                                        )}
                                    </td>
                                    
                                    <td style={styles.td}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <button onClick={() => handleApprove(req.id)} style={styles.approveBtn}>
                                                <CheckCircle size={16} /> Phê duyệt
                                            </button>
                                            <button onClick={() => handleReject(req.id)} style={styles.rejectBtn}>
                                                <XCircle size={16} /> Từ chối
                                            </button>
                                        </div>
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
    td: { padding: '15px', verticalAlign: 'top' },
    approveBtn: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px', background: '#28a745', color: 'white', padding: '8px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', width: '110px' },
    rejectBtn: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px', background: 'white', color: '#dc3545', border: '1px solid #dc3545', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', width: '110px' }
};

export default AdminApproval;