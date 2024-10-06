import React from "react";
import styled from "styled-components";
import { useNavigate } from 'react-router-dom';




const AccessibilityContainer = styled.div`
  display: flex;
  margin-left: 8px;
  align-items: center; 
  height: 100%; 
`;

const Button = styled.button`
  border: 0;
  outline: 0;
  padding: 8px 1em;
  font-size: 13px;
  font-weight: 600;
  border-radius: 20px;
  cursor: pointer;
  transition: all 240ms ease-in-out;
  
  // ลดขนาดปุ่มลงเล็กน้อย
  height: 36px;
  
  &:not(:last-of-type) {
    margin-right: 10px; // เพิ่มระยะห่างระหว่างปุ่ม
  }
`;



const LogoutButton = styled(Button)`
  color: #222;
  background-color: transparent;
  border: 2px solid #00c9ff;

  &:hover {
    color: #fff;
    background-color: #00c9ff;
  }
`;

export function Accessibility(props) {
  const navigate = useNavigate();

  const handleLogout = () => {
    
    localStorage.removeItem('token');
    localStorage.removeItem('role'); 

    navigate('/prelogin');
  };
  return (
    <AccessibilityContainer>

      <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
    </AccessibilityContainer>
  );
}