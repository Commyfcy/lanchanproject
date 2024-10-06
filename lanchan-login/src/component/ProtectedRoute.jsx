import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const location = useLocation();
  const role = localStorage.getItem('role'); // เปลี่ยนเป็น 'role'

  const redirectPath = (role) => { // ฟังก์ชัน redirectPath
    switch (role) {
      case 'owner':
        return '/ownerpage';
      case 'manager':
        return '/firstpage'; // admin ก็เข้า ownerpage
      default:
        return '/App.js';
    }
  };

  if (!role) {
    return <Navigate to="/App.js" state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.includes(role)) { // ตรวจสอบ allowedRoles (ถ้ามี)
    return children;
  } else {
    return <Navigate to={redirectPath(role)} replace />;
  }
};

export default ProtectedRoute;
