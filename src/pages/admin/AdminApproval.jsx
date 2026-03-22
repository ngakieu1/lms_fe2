import React, {useState, useEffect} from 'react';
import api from '../../api/axios';
import {CheckCircle, XCircle, AlertCircle, Clock, User, BookOpen} from 'lucide-react';

const AdminApproval = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchPendingRequests();
    }, []);
    const fetchPendingRequests = async () => {
        try{
            setLoading(true);
            const res = await api.get('/admin/leave-requests/pending');
            setRequests(res.data);
        } catch (error) {
            console.error('Lỗi lấy danh sách yêu cầu:', error);
        } finally {
            setLoading(false);
        }
    };
    const handleApprove = async (sessionId) => {
        if (!window.confirm("Phê duyệt cho giáo viên nghỉ? Buổi học này sẽ bị trống giáo viên.")) return;
        try{
            await api.post(`/admin/leave-requests/approve/${sessionId}`);
            fetchPendingRequests();
        } catch (err) {
            alert(err.response?.data?.message || "Lỗi khi phê duyệt!" );
        }
    };
    const handleReject = async (sessionId) => {
        if (!window.confirm("Từ chối xin nghỉ? Giáo viên sẽ bắt buộc phải dạy buổi này.")) return;
        try{
            await api.post(`/admin/leave-requests/reject/${sessionId}`);
            fetchPendingRequests();
        } catch (err) {
            alert(err.response?.data?.message || "Lỗi khi từ chối!" );
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
        <AlertCircle size={24} color="#e67e22" />
        <h2 style={{ margin: 0, color: '#333' }}>Phê Duyệt Xin Nghỉ / Huỷ Lịch</h2>
      </div>

      <p style={{ color: '#666', marginBottom: '20px' }}>
        Danh sách các khung giờ giáo viên xin huỷ do bị vướng lịch lớp học đang diễn ra.
      </p>

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : requests.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center', background: '#f8f9fa', borderRadius: '8px', color: '#888' }}>
          <CheckCircle size={40} color="#28a745" style={{ marginBottom: '10px' }} />
          <p>Tuyệt vời! Hiện tại không có yêu cầu xin huỷ lịch nào cần xử lý.</p>
        </div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #eee' }}>
          <thead style={{ backgroundColor: '#f9fafb' }}>
            <tr>
              <th style={styles.th}>Giáo viên</th>
              <th style={styles.th}>Lớp học</th>
              <th style={styles.th}>Thời gian biểu</th>
              <th style={styles.th}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={styles.td}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', color: '#007bff' }}>
                    <User size={16} /> {req.teacher.username}
                  </div>
                </td>
                <td style={styles.td}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
                      <BookOpen size={16} color="#666" /> {req.classEntity?.className}
                  </div>
              </td>
              <td style={styles.td}>
                  {/* 🌟 Hiển thị Ngày và Giờ của Session */}
                  <div style={{ fontWeight: 'bold' }}>Ngày: {formatDate(req.sessionDate)}</div>
                  <div style={{ color: '#555', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Clock size={14} /> {req.startTime?.substring(0, 5)} - {req.endTime?.substring(0, 5)}
                  </div>
              </td>
              <td style={styles.td}>
                  <div style={{ display: 'flex', gap: '10px' }}>
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
      )}
    </div>
  );
};
const styles = {
    th: { padding: '15px', textAlign: 'left', color: '#555', borderBottom: '1px solid #eee' },
    td: { padding: '15px', verticalAlign: 'top' },
    approveBtn: { display: 'flex', alignItems: 'center', gap: '5px', background: '#28a745', color: 'white', padding: '8px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
    rejectBtn: { display: 'flex', alignItems: 'center', gap: '5px', background: 'white', color: '#dc3545', border: '1px solid #dc3545', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }
};
export default AdminApproval;