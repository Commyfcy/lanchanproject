import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import {
    TextField,
    MenuItem,
    Button,
    Container,
    Grid,
    Typography,
    IconButton,
    Stack
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function EmployeeDetail() {
    let { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        R_Tel: '',
        role: ''
    });

    const roles = ['employee', "manager", "owner"];

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await fetch(`http://localhost:3333/getem/${id}`);
            if (response.ok) {
                const data = await response.json();
                console.log("Employee data:", data); // เพื่อตรวจสอบข้อมูลที่ได้รับ
                setFormData({
                    username: data.R_username || '',
                    email: data.email || '',
                    password: data.password || '',
                    R_Tel: data.R_Tel || '',
                    role: data.R_Name || ''
                });
            } else {
                console.error('Failed to fetch employee details');
            }
        } catch (error) {
            console.error('Error fetching employee details:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log("Updating:", name, value); // เพื่อตรวจสอบการอัปเดต
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const dataToSend = {
            R_username: formData.username,
            email: formData.email,
            password: formData.password,
            R_Tel: formData.R_Tel,
            R_Name: formData.role
        };
    
        try {
            const response = await fetch(`http://localhost:3333/updateem/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend)
            });
            if (response.ok) {
                const data = await response.json();
                if (data.status === 'ok') {
                    alert('อัปเดตข้อมูลสำเร็จ');
                } else {
                    alert('เกิดข้อผิดพลาดในการอัปเดต: ' + data.message);
                }
            } else {
                throw new Error('Network response was not ok.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('เกิดข้อผิดพลาดในการอัปเดตข้อมูลพนักงาน');
        }
    };
    return (
        <Container maxWidth="md">
            
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <IconButton onClick={() => navigate(-1)}>
                            <ArrowBackIcon />
                        </IconButton>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="h4">รายละเอียดพนักงาน</Typography>
                    </Grid>

                    <Grid item xs={12} sm={6} >
                    <TextField
                        label="ชื่อพนักงาน"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        fullWidth
                        required
                    />
                    </Grid>
                    <Grid item xs={12} sm={6} >
                    <TextField
                        label="อีเมล"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        fullWidth
                        required
                    />

                    </Grid>
                    <Grid item xs={12} sm={6} >
                    <TextField
                        label="รหัสผ่าน"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        fullWidth
                        required
                    />
                    </Grid>
                    <Grid item xs={12} sm={6} >
                    <TextField
                        label="เบอร์โทร"
                        name="R_Tel"
                        value={formData.R_Tel}
                        onChange={handleChange}
                        fullWidth
                        required
                    />
                    </Grid>
                    <Grid item xs={12} sm={6} >
                    <TextField
                        select
                        label="ตำแหน่ง"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        fullWidth
                        required
                    >
                        {roles.map((type) => (
                            <MenuItem key={type} value={type}>
                                {type}
                            </MenuItem>
                        ))}
                    </TextField>
                    </Grid>
                

                    <Grid item xs={12}>
                        <Stack direction="row" justifyContent="flex-end">
                            <Button type="submit" variant="contained" color="primary">
                                บันทึกการเปลี่ยนแปลง
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>
            </form>
        </Container>
    );

}

export default EmployeeDetail;