import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import {useNavigate} from 'react-router-dom';

const RoleManagement = () => {
    const[roles, setRoles] = useState([]);
    const[loading, setLoading] = useState(true);
    // Modal state
    const[isModalOpen, setIsModalOpen] = useState(false);
    const[editingRole, setEditingRole] = useState(null);
    const[formData, setFormData] = useState({name: '', displayName: ''});
    const navigate = useNavigate();
    //Load roles
    const fetchRoles = async () =>{
        try {
            const res = await api.get('/admin/roles');
            setRoles(res.data);
        } catch (err) {
            console.error(err);
            alert ("Lỗi tải danh sách nhóm quyền");
        } finally {
            setLoading(false);
        } 
    };
    useEffect(() => {
        fetchRoles();
    }, []);
    // handle add/edit form submit 
    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            if (editingRole){
                // edit
                await api.put(`/admin/roles/${editingRole.id}`, formData);
                alert("Cập nhật nhóm quyền thành công");
            } else {
                // add new
                // Lưu ý: Đảm bảo Mã quyền luôn viết HOA và có dấu gạch dưới (VD: TEACHER_ABC) để Backend dễ xử lý
                await api.post('/admin/roles', formData);
                alert("Thêm nhóm quyền thành công");
            }
            setIsModalOpen(false);
            fetchRoles();
        } catch (err) {
            alert(err.response?.data?.message || "Lỗi khi lưu nhóm quyền");
        }
    };
    // handle delete
    const handleDelete = async (id, displayName) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa nhóm quyền "${displayName}" không?`)){
            try {
                await api.delete(`/admin/roles/${id}`);
                alert("Xóa nhóm quyền thành công");
                fetchRoles();
            } catch (err) {
                alert(err.response?.data?.message || "Không thể xóa! Có thể nhóm này đang được sử dụng.");
            }
        }
    };
    //Open Modal helpers
    const openAddModal = () => {
        setEditingRole(null);
        setFormData({name: 'TEACHER_', displayName: ''});
        setIsModalOpen(true);
    };
    const openEditModal = (role) => {
        setEditingRole(role);
        setFormData({name: role.name, displayName: role.displayName});
        setIsModalOpen(true);
    };
    if (loading) return <div style={{padding: '2rem'}}>Đang tải...</div>
    return (
    <div style={{ padding: '20px', background: '#f5f6fa', minHeight: '100vh' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2>Danh sách Nhóm quyền</h2>
        <div style={{display: 'flex', gap: '10px'}}>
            <button onClick={() => navigate('/admin/roles/permission-matrix')} className="btn-secondary">
                Đi tới Ma trận Phân quyền
            </button>
            <button onClick={openAddModal} className="btn-primary">
                + Thêm mới
            </button>
        </div>
      </div>

      {/* Bảng Danh sách Nhóm Quyền */}
      <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f8f9fa' }}>
            <tr>
              <th style={styles.th}>STT</th>
              <th style={styles.th}>Tên nhóm quyền</th>
              <th style={styles.th}>Mã hệ thống (Code)</th>
              <th style={styles.th}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role, index) => (
              <tr key={role.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={styles.td}>{index + 1}</td>
                <td style={styles.td}><strong>{role.displayName}</strong></td>
                <td style={styles.td}><code style={{background: '#eee', padding: '2px 6px', borderRadius: '4px'}}>{role.name}</code></td>
                <td style={styles.td}>
                  <button onClick={() => openEditModal(role)} style={{...styles.actionBtn, background: '#f1c40f', color: '#333'}}>Sửa</button>
                  <button onClick={() => handleDelete(role.id, role.displayName)} style={{...styles.actionBtn, background: '#e74c3c'}}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Thêm/Sửa */}
      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3>{editingRole ? 'Cập nhật Nhóm quyền' : 'Thêm Nhóm quyền mới'}</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
              
              <div>
                <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>Tên hiển thị (VD: Giáo viên Tiếng Anh)</label>
                <input 
                  type="text" 
                  value={formData.displayName} 
                  onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                  required
                  style={styles.input}
                />
              </div>

              <div>
                <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>Mã hệ thống (VD: TEACHER_ENGLISH)</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value.toUpperCase()})} // Force uppercase
                  required
                  style={styles.input}
                  disabled={editingRole && formData.name === 'ADMIN'} // Không cho phép đổi mã của ADMIN gốc
                />
                <small style={{color: '#666'}}>*Bắt đầu bằng TEACHER_ để hệ thống nhận diện là Giáo viên.</small>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{...styles.btn, background: '#ccc', color: '#333'}}>Hủy</button>
                <button type="submit" style={{...styles.btn, background: '#007bff'}}>Lưu lại</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
const styles = {
  th: { padding: '15px', textAlign: 'left', borderBottom: '2px solid #ddd' },
  td: { padding: '15px', textAlign: 'left' },
  actionBtn: { border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', margin: '0 5px', color: 'white', fontWeight: 'bold' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  modalContent: { background: 'white', padding: '30px', borderRadius: '8px', width: '400px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' },
  input: { width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' },
  btn: { padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', color: 'white' }
};
export default RoleManagement;