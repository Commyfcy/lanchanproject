import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton, Typography, Box } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import Noodlelogo from '../assets/images/noodles.png';
import Souplogo from '../assets/images/soup.png';
import Meatlogo from '../assets/images/meat.png';
import Sizelogo from '../assets/images/size.png';

const styles = {
    container: {
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '50vh',
    },
    menuButtonsContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '5rem',
        padding: '3rem',
        justifyContent: 'center',
        alignContent: 'center',
        flex: 1,
    },
    menuButton: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderRadius: '1rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        padding: '2rem',
        transition: 'box-shadow 0.3s ease, transform 0.3s ease',
        cursor: 'pointer',
        width: '100%',
        aspectRatio: '1 / 1',
        '&:hover': {
            boxShadow: '0 10px 15px rgba(0, 0, 0, 0.2)',
            transform: 'translateY(-5px)',
        },
    },
    menuButtonIcon: {
        width: '5rem',
        height: '5rem',
        marginBottom: '1.5rem',
    },
    menuButtonLabel: {
        color: '#4a5568',
        fontSize: '1.5rem',
        textAlign: 'center',
        fontWeight: 'bold',
    },
};

const MenuButton = ({ icon, label, path }) => {
    const navigate = useNavigate();

    return (
        <Box
            onClick={() => navigate(path)}
            sx={styles.menuButton}
        >
            <img src={icon} alt={label} style={styles.menuButtonIcon} />
            <div style={styles.menuButtonLabel}>{label}</div>
        </Box>
    );
};

const MenuButtons = () => {
    return (
        <Box sx={styles.menuButtonsContainer}>
            <MenuButton icon={Noodlelogo} label="เส้น" path="/noodle" />
            <MenuButton icon={Meatlogo} label="เนื้อ" path="/meat" />
            <MenuButton icon={Sizelogo} label="ไซส์" path="/size" />
            <MenuButton icon={Souplogo} label="ซุป" path="/soup" />
        </Box>
    );
};

function Listex() {
    const navigate = useNavigate();

    return (

        <Box sx={styles.container}>
            <IconButton
                onClick={() => navigate(-1)}
                sx={{ alignSelf: 'flex-start', marginBottom: '2rem' }}
            >
                <ArrowBackIcon />


            </IconButton>
            <div>    <h1 style={{ textAlign: 'center', margin: '20px 0' }}>เพิ่มรายการส่วนประกอบก๋วยเตี๋ยว</h1> </div>

            <MenuButtons />
        </Box>




    );
}

export default Listex;