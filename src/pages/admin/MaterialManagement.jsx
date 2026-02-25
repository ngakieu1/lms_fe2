import React, {useState, useEffect} from 'react';
import api from '../../api/axios';
import AdminLayout from '../../components/admin/AdminLayout';
import Protect from '../../components/Protect';
import {Search, FileUp, Edit, Trash2, FileText, Video, Image as ImageIcon, ArrowLeft} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MaterialManagement = ({onLogout}) => {
    const userRole = localStorage.getItem('userRole') || '';
    const isAdmin = userRole.startsWith('ADMIN');
    const navigate = useNavigate();

    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMaterial, setEditingMaterial] = useState(null);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [academicLevel, setAcademicLevel] = useState('ALL');
    const [file, setFile] = useState(null);

    const LEVELS = [
        {value: 'ALL', label: 'Tất cả các cấp độ'},
        {value: 'STARTERS 1', label: 'Starters 1'},
        {value: 'STARTERS 2', label: 'Starters 2'},
        {value: 'FLYERS 1 ', label: 'Flyers 1'}
    ];
    useEffect(() => {fetchMaterials();}, []);

    const fetchMaterials = async () => {
        try{
            setLoading(true);
            const res = await api.get('/admin/materials');
            setMaterials(res.data);
        } catch(err) {
            console.error("Lỗi tải danh sách tài liệu", err);
        } finally {
            setLoading(false);
        }
    };
    const getFileIcon = (type) => {
        if (type?.includes('pdf') || type?.includes('word')) return <FileText size={18} color="#e74c3c" />;
        if (type?.includes('video') || type?.includes('mp4')) return <Video size={18} color="#2980b9" />;
        if (type?.includes('image')) return <ImageIcon size={18} color="#27ae60" />;
        return <FileText size={18} color="#7f8c8d" />
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            if (editingMaterial){
            // Cập nhật thông tin (Chỉ gửi JSON)
            await api.put(`/admin/materials/${editingMaterial.id}`, { title, description, academicLevel });
            alert("Cập nhật tài liệu thành công");
            } else {
            // Thêm mới (Upload File -> Bắt buộc dùng FormData)
            if (!file){
                alert("Vui lòng chọn file để tải lên"); return;
            }
            const formData = new FormData();
            formData.append('file', file);
            formData.append('title', title);
            formData.append('description', description);
            formData.append('academicLevel', academicLevel);

            await api.post('/admin/materials', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert("Thêm tài liệu thành công");
            }
            setIsModalOpen(false);
            fetchMaterials();
        } catch (err) {
            alert(err.response?.data?.message || "Lỗi khi lưu tài liệu");
        }
    };
    const handleDelete = async (id, title) => {
        if (window.confirm(`Bạn có chắc muốn xoá tài liệu: ${title}?`)) {
            await api.delete(`/admin/materials/${id}`);
            fetchMaterials();
    }
    };
    const openModal = (mat = null) => {
        if (mat) {
            setEditingMaterial(mat);
            setTitle(mat.title);
            setDescription(mat.description);
            setAcademicLevel(mat.academicLevel);
            setFile(null);
        } else {
            setEditingMaterial(null);
            setTitle(''); setDescription(''); setAcademicLevel('ALL'); setFile(null);
        }
        setIsModalOpen(true);
    };
    // === TÁCH PHẦN NỘI DUNG CHÍNH RA RIÊNG ===
    const pageContent = (
    <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
      <h2 style={{ marginBottom: '20px', color: '#333' }}>Kho Tài Liệu Học</h2>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input type="text" placeholder="Tìm kiếm tài liệu..." style={styles.input} />
          <button style={styles.btnPrimary}><Search size={16} /> Tìm</button>
        </div>
        
        {/* CHỈ NHỮNG AI CÓ QUYỀN 'DOC_UPLOAD' MỚI THẤY NÚT NÀY */}
        <Protect requiredPermission="DOC_UPLOAD">
            <button onClick={() => openModal()} style={styles.btnSuccess}>
              <FileUp size={16} /> Upload Tài Liệu
            </button>
        </Protect>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ backgroundColor: '#f4f6f9', borderBottom: '2px solid #ddd' }}>
          <tr>
            <th style={styles.th}>Loại</th>
            <th style={styles.th}>Tên tài liệu</th>
            <th style={styles.th}>Cấp độ</th>
            <th style={{...styles.th, textAlign: 'center'}}>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {loading ? <tr><td colSpan="4" style={{textAlign: 'center', padding: '20px'}}>Đang tải...</td></tr> : 
           materials.map((mat) => (
            <tr key={mat.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={styles.td}>{getFileIcon(mat.fileType)}</td>
              <td style={{...styles.td, fontWeight: 'bold'}}>
                {/* Tên tài liệu giờ biến thành link để click vào xem/tải về */}
                <a href={mat.fileUrl} target="_blank" rel="noreferrer" style={{color: '#007bff', textDecoration: 'none'}}>
                    {mat.title}
                </a>
              </td>
              <td style={styles.td}>{LEVELS.find(l => l.value === mat.academicLevel)?.label || mat.academicLevel}</td>
              <td style={{...styles.td, textAlign: 'center'}}>
                
                {/* NẾU CÓ QUYỀN DOC_UPLOAD THÌ CHO PHÉP SỬA/XOÁ */}
                <Protect requiredPermission="DOC_UPLOAD">
                    <button onClick={() => openModal(mat)} style={styles.iconBtn}><Edit size={18} color="#f39c12"/></button>
                    <button onClick={() => handleDelete(mat.id, mat.title)} style={styles.iconBtn}><Trash2 size={18} color="#e74c3c"/></button>
                </Protect>
                
                {/* NẾU KHÔNG CÓ QUYỀN (CHỈ XEM), HIỂN THỊ NÚT XEM */}
                {!JSON.parse(localStorage.getItem('permissions') || '[]').includes('DOC_UPLOAD') && (
                    <a href={mat.fileUrl} target="_blank" rel="noreferrer" style={{fontSize: '14px', color: '#27ae60', textDecoration: 'none', fontWeight: 'bold'}}>
                        Xem tài liệu
                    </a>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal Upload ... (Giữ nguyên như cũ) */}
      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3>{editingMaterial ? 'Cập nhật thông tin tài liệu' : 'Upload Tài Liệu Mới'}</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
              
              <div>
                <label style={styles.label}>Tên tài liệu</label>
                <input required type="text" value={title} onChange={e => setTitle(e.target.value)} style={styles.input} />
              </div>

              <div>
                <label style={styles.label}>Mô tả</label>
                <textarea rows="3" value={description} onChange={e => setDescription(e.target.value)} style={styles.input} />
              </div>

              <div>
                <label style={styles.label}>Gán theo cấp độ khóa học</label>
                <select value={academicLevel} onChange={e => setAcademicLevel(e.target.value)} style={styles.input}>
                  {LEVELS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                </select>
              </div>

              {/* Chỉ hiện input chọn file khi Tạo mới */}
              {!editingMaterial && (
                  <div style={{border: '1px dashed #ccc', padding: '20px', borderRadius: '8px', textAlign: 'center', background: '#fafafa'}}>
                    <label style={{display: 'block', fontWeight: 'bold', marginBottom: '10px', color: '#555'}}>Chọn file từ máy tính</label>
                    <input 
                      type="file" 
                      onChange={e => setFile(e.target.files[0])} 
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.mp4,.png,.jpg"
                    />
                  </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={styles.btnSecondary}>Hủy</button>
                <button type="submit" style={styles.btnPrimary}>{editingMaterial ? 'Cập nhật' : 'Bắt đầu Tải lên'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  // === RENDER LAYOUT ĐỘNG TÙY THEO ROLE ===
  if (isAdmin) {
      // Nếu là Admin -> Dùng AdminLayout (Có Sidebar bên trái)
      return pageContent;
  } else {
      // Nếu là Teacher -> Không có Sidebar, tự custom một Navbar đơn giản phía trên
      return (
          <div style={{ background: '#f5f6fa', minHeight: '100vh' }}>
              {/* Navbar cho Teacher */}
              <div style={{ background: '#2c3e50', padding: '15px 30px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <button onClick={() => navigate('/teacher')} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                          <ArrowLeft size={20} style={{marginRight: '5px'}}/> Trở về Dashboard
                      </button>
                      <h2 style={{ margin: 0 }}>Học Liệu Dành Cho Giáo Viên</h2>
                  </div>
                  <button onClick={onLogout} style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer' }}>Đăng xuất</button>
              </div>
              
              {/* Nội dung bảng (bên dưới Navbar) */}
              <div style={{ padding: '30px' }}>
                  {pageContent}
              </div>
          </div>
      );
  }
};
const styles = {
  th: { padding: '12px', textAlign: 'left', color: '#555' }, td: { padding: '12px' },
  label: { display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '14px' },
  input: { padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', width: '100%', boxSizing: 'border-box' },
  btnPrimary: { padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' },
  btnSuccess: { padding: '8px 16px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' },
  btnSecondary: { padding: '8px 16px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  iconBtn: { border: 'none', background: 'none', cursor: 'pointer', margin: '0 5px' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modalContent: { background: 'white', padding: '30px', borderRadius: '8px', width: '500px' }
};
export default MaterialManagement;