import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbarow } from "../owner/Navbarowcomponent/navbarow/index-ow"
import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const styles = {
    Employeelistpage: {
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

    menuImage: {
        width: '100px',
        height: '100px',
        objectFit: 'cover',
    },

    menuInfo: {
        flex: 1,
        padding: '0.5rem',
    },

    menuInfoH3: { // เปลี่ยนชื่อคลาสให้ถูกต้องใน JSX
        margin: 0,
        fontSize: '1rem',
    },

    menuInfoP: { // เปลี่ยนชื่อคลาสให้ถูกต้องใน JSX
        margin: '0.5rem 0 0',
        fontWeight: 'bold',
    },

    cartIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0.5rem',
        fontSize: '1.5rem',
    },

    '@media (max-width: 600px)': {
        menuItem: {
            flexDirection: 'column',
        },
        menuImage: {
            width: '100%',
            height: '150px',
        },
    },
};



function Abbem() {
    return (
        <div style={{ display: "flex", justifyContent: 'flex-end', padding: '10px' }}>
            <Button variant="contained">เพิ่มพนักงาน</Button>
        </div>
    )

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

    return (
        <div style={styles.Employeelistpage}>
            <Navbarow />
            <Link to="/addem">
                <Abbem />
            </Link>


            <div style={styles.menuContainer}>
                {employees.map((item) => (
                    <Link to={`/fooddetail/${item.Menu_id}`} key={item.Menu_id} style={styles.menuItem}>
                        <Card sx={{ minWidth: 275 }}>
                            <CardContent>

                                <Typography variant="body2">
                                    well meaning and kindly.
                                    <br />
                                    {'"a benevolent smile"'}
                                </Typography>
                            </CardContent>

                        </Card>


                    </Link>
                ))}
            </div>

        </div>

    );
}


















export default EmployeeList;