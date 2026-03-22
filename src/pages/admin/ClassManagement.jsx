import React, { useState, useEffect} from 'react';
import api from '../../api/axios';
import {Save, Users, BookOpen, Clock} from 'lucide-react';

const ClassManagement = () => {
    // Dữ liệu danh mục
    const [levels, setLevels] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [homeroomTeachers, setHomeroomTeachers] = useState([]);
    const [englishTeachers, setEnglishTeachers] = useState([]);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [totalSessions, setTotalSessions] = useState(20);
    const [students, setStudents] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);

    // Dữ liệu Form
    const [formData, setFormData] = useState({
        className: '', levelId: '', maxStudent: 1, 
        homeroomTeacherId: '', statusId: '', note: ''
    });
    
    // Dữ liệu xếp lịch GV Tiếng Anh
    const [selectedEnglishTeacher, setSelectedEnglishTeacher] = useState('');
    const [selectedSlots, setSelectedSlots] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Lấy Level và Status
        api.get('/admin/classes/form-data').then(res => {
            setLevels(res.data.levels);
            setStatuses(res.data.statuses);
            if (res.data.statuses.length > 0) {
                setFormData(prev => ({...prev, statusId: res.data.statuses[0].id})); // Default status đầu tiên
            }
        });

        // Lấy danh sách Users và lọc ra GV Chủ nhiệm & GV Tiếng Anh
        api.get('/admin/users').then(res => {
            const users = res.data;
            setHomeroomTeachers(users.filter(u => u.role?.name?.includes('TEACHER_HOMEROOM')));
            setEnglishTeachers(users.filter(u => u.role?.name?.includes('TEACHER_ENGLISH')));
            setStudents(users.filter(u => u.role?.name?.includes('STUDENT')));
        });
    }, []);

    // Lấy lịch rảnh khi chọn GV Tiếng Anh
    useEffect(() => {
        if (selectedEnglishTeacher) {
            api.get(`/admin/teacher-availability/${selectedEnglishTeacher}`).then(res => {
                setAvailableSlots(res.data.filter(slot => slot.status === 'ACTIVE'));
                setSelectedSlots([]);
            });
        } else {
            setAvailableSlots([]);
        }
    }, [selectedEnglishTeacher]);

    const handleCreateClass = async (e) => {
        e.preventDefault();
        if (!formData.levelId || !formData.statusId) {
            alert("Vui lòng chọn Cấp độ và Trạng thái!"); return;
        }
        if (!selectedEnglishTeacher || selectedSlots.length === 0 || !startDate || !totalSessions) {
            alert("Vui lòng nhập đủ thông tin Ngày bắt đầu, Số buổi và chọn lịch Giáo viên!"); return;
        }
        try {
            setLoading(true);
            await api.post('/admin/classes/create', { 
                ...formData,
                mainEnglishTeacherId: selectedEnglishTeacher, // Chuyển GV Tiếng Anh vào đây
                startDate: startDate,
                totalSessions: totalSessions, 
                slotIds: selectedSlots,
                studentIds: selectedStudents // Gửi kèm danh sách học sinh
            });
            alert(`Tạo lớp học và sinh tự động ${totalSessions} buổi học thành công!`);
            // Có thể reset form hoặc chuyển trang tại đây
        } catch (err) {
            alert(err.response?.data?.message || "Lỗi khi tạo lớp");
        } finally {
            setLoading(false);
        }
    };
    return (
        <div style={{ padding: '20px' }}>
            <h2 style={{ color: '#333', marginBottom: '20px' }}>Tạo Lớp Học Mới</h2>
            
            <form onSubmit={handleCreateClass} style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                
                {/* CỘT 1: THÔNG TIN LỚP HỌC (Bảng classes) */}
                <div style={{ flex: 1, background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                        <BookOpen size={18}/> Thông tin chung
                    </h3>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Tên lớp học (*)</label>
                        <input type="text" style={styles.input} required placeholder="VD: IELTS 6.5 - Lớp tối"
                               value={formData.className} onChange={e => setFormData({...formData, className: e.target.value})} />
                    </div>

                    <div style={{ display: 'flex', gap: '15px' }}>
                        <div style={{ ...styles.formGroup, flex: 1 }}>
                            <label style={styles.label}>Cấp độ (*)</label>
                            <select style={styles.input} required value={formData.levelId} onChange={e => setFormData({...formData, levelId: e.target.value})}>
                                <option value="">-- Chọn --</option>
                                {levels.map(l => <option key={l.id} value={l.id}>{l.nameLevel}</option>)}
                            </select>
                        </div>
                        <div style={{ ...styles.formGroup, flex: 1 }}>
                            <label style={styles.label}>Sĩ số tối đa</label>
                            <input type="number" style={styles.input} min="1" max="50" required
                                   value={formData.maxStudent} onChange={e => setFormData({...formData, maxStudent: e.target.value})} />
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '15px' }}>
                        <div style={{ ...styles.formGroup, flex: 1 }}>
                            <label style={styles.label}>Trạng thái (*)</label>
                            <select style={styles.input} required value={formData.statusId} onChange={e => setFormData({...formData, statusId: e.target.value})}>
                                {statuses.map(s => <option key={s.id} value={s.id}>{s.nameClassStatus}</option>)}
                            </select>
                        </div>
                        <div style={{ ...styles.formGroup, flex: 1 }}>
                            <label style={styles.label}>Giáo viên Chủ nhiệm</label>
                            <select style={styles.input} value={formData.homeroomTeacherId} onChange={e => setFormData({...formData, homeroomTeacherId: e.target.value})}>
                                <option value="">-- Bỏ trống nếu chưa có --</option>
                                {homeroomTeachers.map(t => <option key={t.id} value={t.id}>{t.username}</option>)}
                            </select>
                        </div>
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Ghi chú</label>
                        <textarea style={{...styles.input, resize: 'none'}} rows="3" placeholder="Ghi chú thêm về lớp học..."
                                  value={formData.note} onChange={e => setFormData({...formData, note: e.target.value})} />
                    </div>
                    <div style={{ flex: 1, background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', minWidth: '300px' }}>
                    <h3 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                        <span><Users size={18} style={{ verticalAlign: 'middle' }}/> Danh sách Học sinh</span>
                        
                        {/* Hiển thị cảnh báo nếu chọn lố sĩ số */}
                        <span style={{ fontSize: '14px', color: selectedStudents.length > formData.maxStudent ? '#dc3545' : '#28a745' }}>
                            Đã chọn: {selectedStudents.length} / {formData.maxStudent}
                        </span>
                    </h3>

                    <div style={{ maxHeight: '350px', overflowY: 'auto', marginTop: '15px' }}>
                        {students.length === 0 ? (
                            <p style={{ color: '#888', fontSize: '14px' }}>Chưa có tài khoản học sinh nào trong hệ thống.</p>
                        ) : (
                            students.map(student => (
                                <label key={student.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', borderBottom: '1px solid #f0f0f0', cursor: 'pointer', background: selectedStudents.includes(student.id) ? '#f0f8ff' : 'transparent' }}>
                                    <input 
                                        type="checkbox" 
                                        checked={selectedStudents.includes(student.id)}
                                        onChange={(e) => {
                                            if (e.target.checked) setSelectedStudents([...selectedStudents, student.id]);
                                            else setSelectedStudents(selectedStudents.filter(id => id !== student.id));
                                        }}
                                    />
                                    <div>
                                        <strong>{student.username}</strong>
                                        <div style={{ fontSize: '12px', color: '#666' }}>{student.email || 'Chưa cập nhật email'}</div>
                                    </div>
                                </label>
                            ))
                        )}
                    </div>
                </div>
                </div>

                {/* CỘT 2: XẾP LỊCH GIÁO VIÊN TIẾNG ANH (Bảng class_sessions) */}
                <div style={{ flex: 1, background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                        <Clock size={18}/> Xếp lịch GV Tiếng Anh
                    </h3>
                    <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                        <div style={{ flex: 1 }}>
                            <label style={styles.label}>Ngày khai giảng (*)</label>
                            <input type="date" style={styles.input} required
                                   value={startDate} onChange={e => setStartDate(e.target.value)} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={styles.label}>Tổng số buổi (*)</label>
                            <input type="number" style={styles.input} min="1" max="100" required
                                   value={totalSessions} onChange={e => setTotalSessions(e.target.value)} />
                        </div>
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Chọn Giáo viên Tiếng Anh để xem lịch rảnh</label>
                        <select style={styles.input} value={selectedEnglishTeacher} onChange={e => setSelectedEnglishTeacher(e.target.value)}>
                            <option value="">-- Chọn GV Tiếng Anh --</option>
                            {englishTeachers.map(t => <option key={t.id} value={t.id}>{t.username}</option>)}
                        </select>
                    </div>

                    {selectedEnglishTeacher && (
                        <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '6px', marginTop: '15px' }}>
                            <label style={styles.label}>Các khung giờ đang rảnh của giáo viên này:</label>
                            {availableSlots.length === 0 ? (
                                <p style={{ color: '#dc3545', fontSize: '14px' }}>Giáo viên này chưa đăng ký lịch rảnh nào!</p>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                                    {availableSlots.map(slot => (
                                        <label key={slot.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', background: 'white', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}>
                                            <input 
                                                type="checkbox" 
                                                checked={selectedSlots.includes(slot.id)}
                                                onChange={(e) => {
                                                    if(e.target.checked) setSelectedSlots([...selectedSlots, slot.id]);
                                                    else setSelectedSlots(selectedSlots.filter(id => id !== slot.id));
                                                }}
                                            />
                                            <strong>{slot.dayOfWeek}</strong> | {slot.startTime.substring(0,5)} - {slot.endTime.substring(0,5)}
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', marginTop: '20px', fontSize: '16px' }}>
                        <Save size={18} style={{ verticalAlign: 'middle', marginRight: '5px' }} /> 
                        {loading ? 'Đang xử lý...' : `Lưu Lớp & Tạo ${totalSessions || 0} Buổi học`}
                    </button>
                </div>

            </form>
        </div>
    );
};
const styles = {
    formGroup: { marginBottom: '15px' },
    label: { display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555', fontSize: '14px' },
    input: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }
};

export default ClassManagement;