import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { BookOpen, Users, CalendarDays, AlertCircle, X } from 'lucide-react'; 

const TeacherClassList = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // STATE QUẢN LÝ POPUP FORM
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedClass, setSelectedClass] = useState(null);
    const [leaveForm, setLeaveForm] = useState({ reason: '', proofUrl: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchMyClasses();
    }, []);

    const fetchMyClasses = async () => {
        try {
            setLoading(true);
            const res = await api.get('/teacher/classes');
            setClasses(res.data);
        } catch (error) {
            console.error('Lỗi lấy danh sách lớp của GV:', error);
        } finally {
            setLoading(false);
        }
    };

    // 1. HÀM MỞ POPUP
    const openLeaveModal = (cls) => {
        setSelectedClass(cls);
        setLeaveForm({ reason: '', proofUrl: '' }); // Reset form
        setIsModalOpen(true);
    };

    // 2. HÀM GỬI FORM LÊN BACKEND
    const handleSubmitLeaveRequest = async (e) => {
        e.preventDefault();
        if (!leaveForm.reason.trim()) {
            alert("Lý do xin nghỉ không được để trống!");
            return;
        }

        try {
            setIsSubmitting(true);
            // Gửi cục JSON { reason, proofUrl } lên API
            await api.post(`/teacher/classes/${selectedClass.id}/leave-request`, leaveForm);
            
            alert("Đã gửi đơn xin nghỉ lớp thành công!");
            setIsModalOpen(false); // Đóng popup
            fetchMyClasses(); // Tải lại danh sách
        } catch (error) {
            console.error("Lỗi khi xin nghỉ lớp:", error);
            alert("Có lỗi xảy ra, không thể gửi yêu cầu.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const getScheduleDays = (sessions) => {
        if (!sessions || sessions.length === 0) return "Chưa có lịch";
        const daysMap = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
        const uniqueDays = [...new Set(sessions.map(s => {
            const dateObj = new Date(s.sessionDate);
            return daysMap[dateObj.getDay()];
        }))];
        return uniqueDays.sort().join(', '); 
    };

    return (
        <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '8px', minHeight: '80vh' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <BookOpen size={28} color="#007bff" />
                <h2 style={{ margin: 0, color: '#333' }}>Toàn Bộ Lớp Học Của Tôi</h2>
            </div>

            {loading ? <p>Đang tải dữ liệu...</p> : (
                <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #eee' }}>
                    <thead style={{ backgroundColor: '#f9fafb' }}>
                        <tr>
                            <th style={styles.th}>Tên Lớp Học</th>
                            <th style={styles.th}>Lịch học</th>
                            <th style={styles.th}>Sĩ số</th>
                            <th style={styles.th}>Trạng thái</th>
                            <th style={styles.th}>Thao tác</th> 
                        </tr>
                    </thead>
                    <tbody>
                        {classes.map((cls) => (
                            <tr key={cls.id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={styles.td}>
                                    <span onClick={() => navigate(`/teacher/classes/${cls.id}`)} style={{ color: '#007bff', fontWeight: 'bold', cursor: 'pointer' }}>
                                        {cls.className}
                                    </span>
                                </td>
                                <td style={styles.td}>{getScheduleDays(cls.sessions)}</td>
                                <td style={styles.td}>{cls.students ? cls.students.length : 0} / {cls.maxStudent}</td>
                                <td style={styles.td}>{cls.statusClass?.statusName || 'N/A'}</td>
                                
                                <td style={styles.td}>
                                    {cls.statusClass?.statusName !== 'Done' && (
                                        <button 
                                            // GỌI HÀM MỞ POPUP THAY VÌ CONFIRM
                                            onClick={() => openLeaveModal(cls)}
                                            style={styles.btnLeave}
                                        >
                                            <AlertCircle size={14} /> Xin nghỉ lớp
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* ==========================================
                 GIAO DIỆN POPUP MODAL (FORM ĐIỀN ĐƠN)
                ========================================== */}
            {isModalOpen && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContent}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ margin: 0, color: '#d32f2f', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <AlertCircle /> Đơn Xin Rút Khỏi Lớp
                            </h3>
                            <X size={20} style={{ cursor: 'pointer', color: '#888' }} onClick={() => setIsModalOpen(false)} />
                        </div>

                        <p style={{ fontSize: '14px', color: '#555', marginBottom: '20px' }}>
                            Bạn đang làm đơn xin rút khỏi lớp <strong>{selectedClass?.className}</strong>. Vui lòng cung cấp đầy đủ thông tin để Điều Phối xét duyệt.
                        </p>

                        <form onSubmit={handleSubmitLeaveRequest}>
                            {/* Ô nhập Lý do */}
                            <div style={{ marginBottom: '15px' }}>
                                <label style={styles.label}>Lý do xin nghỉ (*)</label>
                                <textarea 
                                    rows="4" 
                                    required
                                    placeholder="Ví dụ: Bận việc gia đình, chuyển công tác..."
                                    value={leaveForm.reason}
                                    onChange={(e) => setLeaveForm({...leaveForm, reason: e.target.value})}
                                    style={styles.input}
                                />
                            </div>

                            {/* Ô nhập Minh chứng */}
                            <div style={{ marginBottom: '25px' }}>
                                <label style={styles.label}>Link Minh chứng (Tùy chọn)</label>
                                <input 
                                    type="text" 
                                    placeholder="Dán link ảnh chụp màn hình, bệnh án, hoặc Google Drive..."
                                    value={leaveForm.proofUrl}
                                    onChange={(e) => setLeaveForm({...leaveForm, proofUrl: e.target.value})}
                                    style={styles.input}
                                />
                                <span style={{ fontSize: '12px', color: '#888' }}>* Cung cấp minh chứng sẽ giúp đơn của bạn được duyệt nhanh hơn.</span>
                            </div>

                            {/* Nút hành động */}
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                <button type="button" onClick={() => setIsModalOpen(false)} style={styles.btnCancel}>Hủy</button>
                                <button type="submit" disabled={isSubmitting} style={styles.btnSubmit}>
                                    {isSubmitting ? 'Đang gửi...' : 'Gửi Đơn Xin Nghỉ'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    th: { padding: '15px', textAlign: 'left', color: '#555', borderBottom: '1px solid #eee' },
    td: { padding: '15px', verticalAlign: 'middle' },
    btnLeave: { padding: '6px 12px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold' },
    
    // CSS cho Modal Popup
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
    modalContent: { backgroundColor: '#fff', padding: '30px', borderRadius: '12px', width: '90%', maxWidth: '500px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' },
    label: { display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#333', fontSize: '14px' },
    input: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box', outline: 'none' },
    btnCancel: { padding: '10px 20px', backgroundColor: '#f1f3f5', color: '#333', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
    btnSubmit: { padding: '10px 20px', backgroundColor: '#d32f2f', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }
};

export default TeacherClassList;