import React, {useState, useEffect} from 'react';
import api from '../../api/axios';
import {Plus, Trash2, Clock, CheckCircle, AlertCircle, Info} from 'lucide-react';

const DAYS_OF_WEEK = [
    { key: 'MONDAY', label: 'Thứ 2' },
    { key: 'TUESDAY', label: 'Thứ 3' },
    { key: 'WEDNESDAY', label: 'Thứ 4' },
    { key: 'THURSDAY', label: 'Thứ 5' },
    { key: 'FRIDAY', label: 'Thứ 6' },
    { key: 'SATURDAY', label: 'Thứ 7' },
    { key: 'SUNDAY', label: 'Chủ nhật' },
];
const TeacherAvailabilityLogic = () => {
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(false);
    //state cho form them moi
    const [newSlot, setNewSlot] = useState({
        dayOfWeek: 'MONDAY',
        startTime: '09:00',
        endTime: '11:00',
    });
    //state cho Modal huy Slot
    const [cancelModal, setCancelModal] = useState({ isOpen: false, slotId: null, reason: ''});
    useEffect(() => {
        fetchSlots();
    }, []);
    const fetchSlots = async () => {
        try {
            const res = await api.get('/teacher/availability');
            setSlots(res.data);
        } catch (err) {
            console.error("Lỗi lấy danh sách slot:", err);
        }
    };
    //goi API them slot moi
    const handleAddSlot = async (e) => {
        e.preventDefault();
        if (newSlot.startTime >= newSlot.endTime){
            alert("Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc");
            return;
        }
        try {
            setLoading(true);
            await api.post('/teacher/availability/add', newSlot);
            alert("Đăng ký khung giờ thành công!");
            fetchSlots();
        } catch (err){
            alert(err.response?.data?.message || "Có lỗi xảy ra khi thêm slot!");
        } finally {
            setLoading(false);
        }
    };
    //xu ly click nut huy
    const handleCancelClick = async (slotId) => {
        if (!window.confirm("Bạn có chắc chắn muốn huỷ khung giờ này không?")) return;
        try {
            await api.post(`/teacher/availability/cancel/${slotId}`, {});
            alert ("Huỷ slot thành công (Slot chưa có lớp học).");
            fetchSlots();
        } catch (err) {
            if (err.response?.status === 400 && err.response.data.message.includes('lý do')){
                setCancelModal({ isOpen: true, slotId: slotId, reason: '' });
            } else {
                alert(err.response?.data?.message || "Lỗi khi huỷ slot!");
            }
        }
    };
    // xac nhan huy kem ly do (gui cho Admin)
    const submitCancelWithReason = async () => {
        if (!cancelModal.reason.trim()){
            alert("Vui lòng nhập lý do huỷ!");
            return;
        }
        try {
            setLoading(true);
            await api.post(`/teacher/availability/cancel/${cancelModal.slotId}`, { reason: cancelModal.reason });
            alert("Đã gửi yêu cầu huỷ lịch cho Admin phê duyệt.");
            setCancelModal({ isOpen: false, slotId: null, reason: '' });
            fetchSlots();
        } catch (err) {
            alert(err.response?.data?.message || "Lỗi gửi yêu cầu!");
        } finally {
            setLoading(false);
        }
    };
    const renderStatus = (status) =>{
        switch (status) {
            case 'ACTIVE': 
              return <span style={{...styles.badge, background: '#d4edda', color: '#155724'}}><CheckCircle size={14}/> Đang hoạt động</span>;
          case 'PENDING_CANCEL': 
              return <span style={{...styles.badge, background: '#fff3cd', color: '#856404'}}><Clock size={14}/> Chờ duyệt huỷ</span>;
          case 'INACTIVE': 
              return <span style={{...styles.badge, background: '#f8d7da', color: '#721c24'}}><AlertCircle size={14}/> Đã huỷ</span>;
          default: return null;
        }
    };
    return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '20px', color: '#333' }}>Đăng Ký & Quản Lý Lịch Rảnh</h2>

      <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
        
        {/* ================= PHẦN 1: FORM ĐĂNG KÝ BỔ SUNG ================= */}
        <div style={{ flex: 1, background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <h3><Plus size={18} style={{ verticalAlign: 'middle' }}/> Thêm Khung Giờ Mới</h3>
            <p style={{ color: '#666', fontSize: '14px', marginBottom: '15px' }}>
                Khung giờ đăng ký không được trùng lặp với các khung giờ đã có.
            </p>
            
            <form onSubmit={handleAddSlot} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                    <label style={styles.label}>Chọn Thứ:</label>
                    <select 
                        style={styles.input}
                        value={newSlot.dayOfWeek}
                        onChange={(e) => setNewSlot({...newSlot, dayOfWeek: e.target.value})}
                    >
                        {DAYS_OF_WEEK.map(d => <option key={d.key} value={d.key}>{d.label}</option>)}
                    </select>
                </div>
                
                <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ flex: 1 }}>
                        <label style={styles.label}>Giờ bắt đầu:</label>
                        <input type="time" style={styles.input} required
                            value={newSlot.startTime} onChange={(e) => setNewSlot({...newSlot, startTime: e.target.value})} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={styles.label}>Giờ kết thúc:</label>
                        <input type="time" style={styles.input} required
                            value={newSlot.endTime} onChange={(e) => setNewSlot({...newSlot, endTime: e.target.value})} />
                    </div>
                </div>

                <button type="submit" disabled={loading} style={styles.primaryBtn}>
                    {loading ? 'Đang xử lý...' : 'Đăng ký Slot'}
                </button>
            </form>
        </div>

        {/* ================= PHẦN 2: DANH SÁCH SLOT ĐÃ ĐĂNG KÝ ================= */}
        <div style={{ flex: 2, background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <h3><Clock size={18} style={{ verticalAlign: 'middle' }}/> Danh Sách Khung Giờ Của Tôi</h3>
            
            {slots.length === 0 ? (
                <p style={{ color: '#888', fontStyle: 'italic', marginTop: '20px' }}>Bạn chưa đăng ký khung giờ rảnh nào.</p>
            ) : (
                <div style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {slots.map(slot => (
                        <div key={slot.id} style={{ border: '1px solid #eee', padding: '15px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h4 style={{ margin: '0 0 5px 0', color: '#007bff' }}>
                                    {DAYS_OF_WEEK.find(d => d.key === slot.dayOfWeek)?.label}
                                </h4>
                                <p style={{ margin: 0, fontWeight: 'bold', fontSize: '16px' }}>
                                    {slot.startTime.substring(0,5)} - {slot.endTime.substring(0,5)}
                                </p>
                                {slot.cancelReason && (
                                    <p style={{ margin: '5px 0 0 0', fontSize: '13px', color: '#e67e22' }}>
                                        <Info size={12} /> Lý do huỷ: {slot.cancelReason}
                                    </p>
                                )}
                            </div>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                                {renderStatus(slot.status)}
                                
                                {/* Chỉ hiện nút Huỷ nếu slot đang ACTIVE */}
                                {slot.status === 'ACTIVE' && (
                                    <button 
                                        onClick={() => handleCancelClick(slot.id)}
                                        style={styles.dangerBtn}
                                    >
                                        <Trash2 size={14} /> Huỷ Slot
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
      </div>

      {/* ================= MODAL NHẬP LÝ DO HUỶ ================= */}
      {cancelModal.isOpen && (
          <div style={styles.modalOverlay}>
              <div style={styles.modalContent}>
                  <h3 style={{ marginTop: 0, color: '#d32f2f' }}>Yêu Cầu Lý Do Huỷ Lịch</h3>
                  <p style={{ fontSize: '14px', color: '#555' }}>
                      Khung giờ này <strong>đã có lớp học được xếp</strong>. Bạn không thể huỷ trực tiếp mà phải gửi yêu cầu kèm lý do để Admin phê duyệt.
                  </p>
                  
                  <textarea 
                      rows="4"
                      placeholder="Nhập lý do xin huỷ (VD: Có việc gia đình đột xuất, ốm...)"
                      style={{...styles.input, width: '100%', resize: 'none', marginTop: '10px'}}
                      value={cancelModal.reason}
                      onChange={(e) => setCancelModal({...cancelModal, reason: e.target.value})}
                  />
                  
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                      <button onClick={() => setCancelModal({ isOpen: false, slotId: null, reason: '' })} style={{ padding: '8px 15px', border: '1px solid #ccc', background: '#fff', cursor: 'pointer', borderRadius: '4px' }}>
                          Quay lại
                      </button>
                      <button onClick={submitCancelWithReason} disabled={loading} style={{ padding: '8px 15px', background: '#d32f2f', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>
                          Gửi yêu cầu
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};
const styles = {
    label: { display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold', color: '#444' },
    input: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' },
    primaryBtn: { background: '#007bff', color: 'white', padding: '10px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', width: '100%' },
    dangerBtn: { background: 'transparent', color: '#dc3545', border: '1px solid #dc3545', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px' },
    badge: { padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' },
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
    modalContent: { background: '#fff', padding: '25px', borderRadius: '8px', width: '400px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }
};
export default TeacherAvailabilityLogic;