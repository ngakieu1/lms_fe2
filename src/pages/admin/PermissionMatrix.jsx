import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

const PermissionMatrix = () => {
  const [roles, setRoles] = useState([]);
  const [groupedPermissions, setGroupedPermissions] = useState({});
  const [matrix, setMatrix] = useState({}); // Lưu trạng thái checkbox: { roleId_permId: true/false }
  const [loading, setLoading] = useState(true);

  // 1. Load dữ liệu
  useEffect(() => {
    const fetchMatrix = async () => {
    try {
      const res = await api.get('/admin/roles/permission-matrix');
      setRoles(res.data.roles);
      setGroupedPermissions(res.data.groupedPermissions);
      
      // Khởi tạo state cho các ô checkbox từ dữ liệu backend
      const initialMatrix = {};
      res.data.roles.forEach(role => {
        role.permissions.forEach(perm => {
            initialMatrix[`${role.id}_${perm.id}`] = true;
        });
      });
      setMatrix(initialMatrix);
      setLoading(false);
    } catch (err) {
      console.error("Lỗi tải phân quyền", err);
    }
  };
    fetchMatrix();
  }, []);

  // 2. Xử lý khi tick vào checkbox
  const handleCheck = (roleId, permId) => {
    const key = `${roleId}_${permId}`;
    setMatrix(prev => ({
      ...prev,
      [key]: !prev[key] // Đảo ngược trạng thái (Checked <-> Unchecked)
    }));
  };

  // 3. Lưu lại (Gửi từng Role lên Server)
  const handleSave = async () => {
    try {
      // Duyệt qua từng Role để gom các quyền đã tick
      for (const role of roles) {
        const selectedPermIds = [];
        
        // Tìm tất cả permission ID được tick cho role này
        Object.keys(matrix).forEach(key => {
            const [rId, pId] = key.split('_');
            if (rId == role.id && matrix[key] === true) {
                selectedPermIds.push(parseInt(pId));
            }
        });

        // Gọi API update cho từng role
        await api.post(`/admin/roles/${role.id}/permissions`, selectedPermIds);
      }
      alert("Cập nhật phân quyền thành công!");
    } catch (err) {
      alert("Lỗi khi lưu dữ liệu!", err);
    }
  };

  if (loading) return <div>Đang tải bảng phân quyền...</div>;

  return (
    <div style={{ padding: '20px', background: '#f5f6fa' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Phân quyền hệ thống</h2>
        <button onClick={handleSave} className="btn-save">Cập nhật</button>
      </div>

      <div className="matrix-container">
        <table className="matrix-table">
          <thead>
            <tr>
              <th className="feature-col">Tính năng</th>
              {roles.map(role => (
                <th key={role.id} className="role-col">{role.displayName}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.keys(groupedPermissions).map(moduleName => (
              <React.Fragment key={moduleName}>
                {/* Dòng Tiêu đề Nhóm (VD: Quản lý học liệu) */}
                <tr className="group-header">
                  <td colSpan={roles.length + 1}>{moduleName}</td>
                </tr>

                {/* Các dòng quyền con (Xem, Thêm, Sửa...) */}
                {groupedPermissions[moduleName].map(perm => (
                  <tr key={perm.id}>
                    <td className="perm-name">{perm.description}</td>
                    {roles.map(role => (
                      <td key={role.id} className="checkbox-cell">
                        <input
                          type="checkbox"
                          checked={!!matrix[`${role.id}_${perm.id}`]}
                          onChange={() => handleCheck(role.id, perm.id)}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* CSS Styles Embed */}
      <style>{`
        .btn-save { background: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-weight: bold; }
        .matrix-container { background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); overflow-x: auto; }
        .matrix-table { width: 100%; border-collapse: collapse; min-width: 800px; }
        .matrix-table th, .matrix-table td { padding: 12px 15px; border: 1px solid #eee; text-align: center; }
        .feature-col { text-align: left; background: #f8f9fa; width: 200px; font-weight: bold; }
        .role-col { background: #f8f9fa; color: #333; font-weight: bold; }
        .group-header td { background: #e9ecef; font-weight: bold; text-align: left; color: #495057; padding-left: 20px; }
        .perm-name { text-align: left !important; color: #555; }
        .checkbox-cell input { transform: scale(1.3); cursor: pointer; }
      `}</style>
    </div>
  );
};

export default PermissionMatrix;