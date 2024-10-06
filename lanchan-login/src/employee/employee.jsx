import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbarow } from "../owner/Navbarowcomponent/navbarow/index-ow"
import Button from '@mui/material/Button';
//import Grid from '@mui/material/Grid'; 
import DeleteIcon from '@mui/icons-material/Delete';

const styles = {
  employeeListPage: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  menuContainer: {
    flex: 1,
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1rem',
    padding: '1rem',
    marginTop: '20px',
  },
  menuItem: {
    display: 'flex',
    backgroundColor: 'white',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    textDecoration: 'none',
    color: 'inherit',
    position: 'relative',
  },
  menuInfo: {
    flex: 1,
    padding: '0.5rem',
  },
  menuInfoH3: {
    margin: 0,
    fontSize: '1rem',
  },
  menuInfoP: {
    margin: '0.5rem 0 0',
    fontWeight: 'bold',
  },
};

function AddEmployee() {
  return (
    <div style={{ display: "flex", justifyContent: 'flex-end', padding: '10px' }}>
      <Button variant="contained">เพิ่มพนักงาน</Button>
    </div>
  );
}

function DeleteEmployee({onDelete}) {
  return (
    <div style={{ position: 'absolute', bottom: '10px', right: '10px' }}>
      <Button variant="outlined" startIcon={<DeleteIcon />} onClick={onDelete}>ลบพนักงาน</Button>
    </div>
  );
}

function EmployeeList() {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch('http://localhost:3333/getem');
      if (response.ok) {
        const data = await response.json();
        setEmployees(data);
      } else {
        console.error('Failed to fetch employees');
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleDelete = async (employeeId) => {
    const isConfirmed = window.confirm('คุณแน่ใจหรือไม่ที่จะลบพนักงานคนนี้?');
    if (isConfirmed) {
      try {
        const response = await fetch(`http://localhost:3333/deleteemployee/${employeeId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setEmployees(employees.filter(item => item.R_id !== employeeId));
          alert('ลบพนักงานสำเร็จ');
        } else {
          alert('เกิดข้อผิดพลาดในการลบพนักงาน');
        }
      } catch (error) {
        console.error('Error deleting employee:', error);
        alert('เกิดข้อผิดพลาดในการลบพนักงาน');
      }
    }
  };

  return (
    <div style={styles.employeeListPage}>
      <Navbarow />
      <Link to="/addem">
        <AddEmployee />
      </Link>
      
      <div style={styles.menuContainer}>
        {employees.map((employee) => (
          <div key={employee.R_id} style={styles.menuItem}>
            <Link to={`/employeedetail/${employee.R_id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', width: '100%' }}>
              <div style={styles.menuInfo}>
                <h3 style={styles.menuInfoH3}>{employee.R_username}</h3>
                <p style={styles.menuInfoP}>ตำแหน่ง: {employee.R_Name}</p>
                <p>อีเมล: {employee.email}</p>
                <p>เบอร์โทร: {employee.R_Tel}</p>
                <p>รหัสประจำตัว: {employee.R_id}</p>
              </div>
            </Link>
            <DeleteEmployee onDelete={() => handleDelete(employee.R_id)} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default EmployeeList;