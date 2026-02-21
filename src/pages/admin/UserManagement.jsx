import React, {useState, useEffect} from 'react';
import api from '../../api/axios';
import {Search, Plus, Download, Edit, Trash2} from 'lucide-react';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({username: '',password: '', fullName: '',phoneNumber: '',email: '', roleId: ''});

    useEffect(() => {
        fetchUsers();
        fetchRoles();
    }, []);
    const fetchUsers = async (search = '') => {
        try {
            setLoading(true);
            const res = await api.get(`/admin/users${search ? `?search=${search}` : ''}`);
            setUsers(res.data);
        } catch (err) {
            console.error(err);
            alert("Lỗi tải danh sách người dùng");
        } finally {
            setLoading(false);
        }
    };
    const fetchRoles = async () =>{
        try{
            const res = await api.get('/admin/roles');
            setRoles(res.data);
        } catch (err) {
            console.error(err);
            alert("Lỗi tải danh sách vai trò");
        }
    };
    const handleSearch = (e) => {
        e.preventDefault();
        fetchUsers(searchQuery);
    };
    const handleExport = async () => {
        try{
            const response = await api.get('/admin/users/export', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'danh_sach_nguoi_dung.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            alert("Lỗi xuất file", err);
        }
    };
    const handleDelete = async(id, name) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa người dùng "${name}" không?`)){
            try {
                await api.delete(`/admin/users/${id}`);
                alert("Xóa người dùng thành công");
                fetchUsers(searchQuery);
            } catch (err) {
                alert(err.response?.data?.message || "Không thể xóa người dùng này!");
            }
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            if (editingUser){
                console.log("Editing user:", editingUser);
                console.log("User ID gửi lên:", editingUser?.id);
                await api.put(`/admin/users/${editingUser.id}`, formData);
                alert("Cập nhật thành công!");
            } else {
                await api.post('/admin/users', formData);
                alert("Thêm người dùng thành công!");
            }
            setIsModalOpen(false);
            fetchUsers(searchQuery);
        } catch (err){
            alert(err.response?.data?.message || "Có lỗi xảy ra!");
        }
    };
    const openModal = (user = null) => {
        if (user) {
            setEditingUser(user);
            setFormData({
                username: user.username,
                password: '', // Không hiển thị pass cũ, nhập mới để đổi
                fullName: user.fullName || '',
                phoneNumber: user.phoneNumber || '',
                email: user.email || '',
                roleId: user.role?.id || ''
            });
        } else {
            setEditingUser(null);
            setFormData({username: '', password: '', fullName: '', phoneNumber: '', email: '', roleId: roles[0]?.id || ''});
        }
        setIsModalOpen(true);
    };

    return (
  <>
    <div
      style={{
        padding: "20px",
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
      }}
    >
      <h2 style={{ marginBottom: "20px", color: "#333" }}>
        Quản lý Tài khoản (Người dùng)
      </h2>

      {/* ===== Toolbar ===== */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        {/* Search */}
        <form
          onSubmit={handleSearch}
          style={{ display: "flex", gap: "10px" }}
        >
          <input
            type="text"
            placeholder="Tìm theo mã, tên..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: "8px 12px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              width: "250px",
            }}
          />
          <button
            type="submit"
            style={primaryButton}
          >
            <Search size={16} /> Tìm
          </button>
        </form>

        {/* Actions */}
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={handleExport}
            style={successButton}
          >
            <Download size={16} /> Xuất CSV
          </button>

          <button
            onClick={() => openModal()}
            style={primaryButton}
          >
            <Plus size={16} /> Thêm mới
          </button>
        </div>
      </div>

      {/* ===== Table ===== */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "10px",
        }}
      >
        <thead
          style={{
            backgroundColor: "#f4f6f9",
            borderBottom: "2px solid #ddd",
          }}
        >
          <tr>
            <th style={thStyle}>STT</th>
            <th style={thStyle}>Tài khoản (Mã)</th>
            <th style={thStyle}>Họ và tên</th>
            <th style={thStyle}>Số điện thoại</th>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Nhóm quyền</th>
            <th style={{ ...thStyle, textAlign: "center" }}>
              Hành động
            </th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>
                Đang tải...
              </td>
            </tr>
          ) : (
            users.map((user, idx) => (
              <tr
                key={user.id}
                style={{ borderBottom: "1px solid #eee" }}
              >
                <td style={tdStyle}>{idx + 1}</td>
                <td style={{ ...tdStyle, fontWeight: "bold" }}>
                  {user.username}
                </td>
                <td style={tdStyle}>{user.fullName}</td>
                <td style={tdStyle}>{user.phoneNumber}</td>
                <td style={tdStyle}>{user.email}</td>
                <td style={tdStyle}>
                  <span style={roleBadge}>
                    {user.role?.displayName || "N/A"}
                  </span>
                </td>
                <td style={{ ...tdStyle, textAlign: "center" }}>
                  <button
                    onClick={() => openModal(user)}
                    style={iconButtonEdit}
                    title="Sửa"
                  >
                    <Edit size={18} />
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(user.id, user.username)
                    }
                    style={iconButtonDelete}
                    title="Xoá"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>

    {/* ===== Modal ===== */}
    {isModalOpen && (
      <div style={modalOverlay}>
        <div style={modalContent}>
          <h3>
            {editingUser
              ? "Cập nhật Người dùng"
              : "Thêm Người dùng mới"}
          </h3>

          <form
            onSubmit={handleSubmit}
            style={formStyle}
          >
            {/* Username */}
            <div>
              <label style={labelStyle}>
                Tài khoản (Username / Mã HS)
              </label>
              <input
                required
                type="text"
                value={formData.username}
                disabled={!!editingUser}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    username: e.target.value,
                  })
                }
                style={inputStyle}
              />
            </div>

            {/* Password */}
            <div>
              <label style={labelStyle}>
                Mật khẩu{" "}
                {editingUser && (
                  <span style={{ fontWeight: "normal", color: "gray" }}>
                    (Bỏ trống nếu không muốn đổi)
                  </span>
                )}
              </label>
              <input
                required={!editingUser}
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    password: e.target.value,
                  })
                }
                style={inputStyle}
              />
            </div>

            {/* Full name */}
            <div>
              <label style={labelStyle}>Họ và tên</label>
              <input
                required
                type="text"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    fullName: e.target.value,
                  })
                }
                style={inputStyle}
              />
            </div>

            {/* Phone */}
            <div>
              <label style={labelStyle}>Số điện thoại</label>
              <input
                type="text"
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    phoneNumber: e.target.value,
                  })
                }
                style={inputStyle}
              />
            </div>
            {/* Email */}
            <div>
              <label style={labelStyle}>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    email: e.target.value,
                  })
                }
                style={inputStyle}
              />
            </div>

            {/* Role */}
            <div>
              <label style={labelStyle}>
                Nhóm quyền (Role)
              </label>
              <select
                required
                value={formData.roleId}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    roleId: e.target.value,
                  })
                }
                style={inputStyle}
              >
                <option value="">
                  -- Chọn nhóm quyền --
                </option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.displayName}
                  </option>
                ))}
              </select>
            </div>

            {/* Buttons */}
            <div style={modalActions}>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                style={secondaryButton}
              >
                Hủy
              </button>

              <button
                type="submit"
                style={primaryButton}
              >
                Lưu lại
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
  </>
);
};
/* ===== Styles ===== */

const thStyle = { padding: "12px", textAlign: "left" };
const tdStyle = { padding: "12px" };

const roleBadge = {
  backgroundColor: "#e6f7ff",
  color: "#0050b3",
  padding: "4px 8px",
  borderRadius: "12px",
  fontSize: "12px",
};

const primaryButton = {
  padding: "8px 16px",
  backgroundColor: "#007bff",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "5px",
};

const successButton = {
  ...primaryButton,
  backgroundColor: "#28a745",
};

const secondaryButton = {
  padding: "8px 16px",
  border: "1px solid #ccc",
  borderRadius: "4px",
  cursor: "pointer",
};

const iconButtonEdit = {
  border: "none",
  background: "none",
  color: "#f39c12",
  cursor: "pointer",
  marginRight: "10px",
};

const iconButtonDelete = {
  border: "none",
  background: "none",
  color: "#e74c3c",
  cursor: "pointer",
};

const modalOverlay = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const modalContent = {
  background: "white",
  padding: "30px",
  borderRadius: "8px",
  width: "500px",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "15px",
  marginTop: "20px",
};

const modalActions = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "10px",
  marginTop: "10px",
};

const labelStyle = {
  display: "block",
  fontWeight: "bold",
  marginBottom: "5px",
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  border: "1px solid #ddd",
  borderRadius: "4px",
  boxSizing: "border-box",
};

export default UserManagement;