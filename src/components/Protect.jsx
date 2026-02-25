import React from 'react';

const Protect = ({ requiredPermission, children }) => {
  const userRole = localStorage.getItem('userRole') || '';
  
  // 1. ĐẶC QUYỀN CỦA ADMIN: Nếu là Admin, bỏ qua mọi kiểm tra và hiển thị luôn!
  if (userRole.startsWith('ADMIN')) {
    return children;
  }

  // 2. KIỂM TRA QUYỀN BÌNH THƯỜNG (Dành cho Giáo viên, Học sinh...)
  const savedPermissions = localStorage.getItem('permissions');
  const userPermissions = savedPermissions ? JSON.parse(savedPermissions) : [];

  if (userPermissions.includes(requiredPermission)) {
    return children;
  }

  return null; 
};

export default Protect;