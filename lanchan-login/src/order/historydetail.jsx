import React, { useState, useEffect } from 'react';
import {
    Container,
    IconButton,
    Typography,
    Grid,
    Paper,
    AppBar,
    Toolbar
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from 'react-router-dom';

const styles = {
    historyDetailPage: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100%',
    },
    menuContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1rem',
        padding: '1rem',
        width: '95%',
        maxWidth: '1200px',
        margin: '20px auto',
    },
    menuItem: {
        display: 'flex',
        backgroundColor: 'white',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    menuImage: {
        width: '100px',
        height: '100px',
        objectFit: 'cover',
    },
    menuInfo: {
        flex: 1,
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    menuInfoH3: {
        margin: '0 0 0.5rem 0',
        fontSize: '1.1rem',
    },
    menuInfoP: {
        margin: '0.25rem 0',
        fontSize: '0.9rem',
    },
    appBar: {
        position: 'static',
        backgroundColor: 'white',
        boxShadow: 'none',
    },
    toolbar: {
        paddingLeft: 0,
    },
    title: {
        flexGrow: 1,
        marginLeft: '16px',
    },
};

function HistoryDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [orderDetails, setOrderDetails] = useState([]);
    const [noodleMenu, setNoodleMenu] = useState([]);
    const [otherMenu, setOtherMenu] = useState([]);

    useEffect(() => {
        fetchOrderDetails();
        fetchMenus();
    }, [id]);

    const fetchOrderDetails = async () => {
        try {
            const response = await fetch(`http://localhost:3333/getorderdetail/${id}`);
            if (!response.ok) throw new Error('Failed to fetch order details');
            const data = await response.json();
            setOrderDetails(data);
        } catch (error) {
            console.error('Error fetching order details:', error);
        }
    };

    const fetchMenus = async () => {
        try {
            const [noodleRes, otherRes] = await Promise.all([
                fetch('http://localhost:3333/getnoodlemenu'),
                fetch('http://localhost:3333/getmenu')
            ]);
            const [noodleData, otherData] = await Promise.all([
                noodleRes.json(),
                otherRes.json()
            ]);
            setNoodleMenu(noodleData);
            setOtherMenu(otherData);
        } catch (error) {
            console.error('Error fetching menus:', error);
        }
    };

    const getItemDetails = (item) => {
        if (item.Noodle_menu_id) {
            const noodle = noodleMenu.find(n => n.Noodle_menu_id === item.Noodle_menu_id);
            return noodle ? {
                name: noodle.Noodle_menu_name,
                price: noodle.Noodle_menu_price,
                image: noodle.Noodle_menu_picture
            } : null;
        } else if (item.Menu_id) {
            const other = otherMenu.find(o => o.Menu_id === item.Menu_id);
            return other ? {
                name: other.Menu_name,
                price: other.Menu_price,
                image: other.Menu_picture
            } : null;
        }
        return null;
    };

    return (
        <Container maxWidth="lg" style={styles.historyDetailPage}>
            <AppBar position="static" color="default" style={styles.appBar}>
                <Toolbar style={styles.toolbar}>
                    <IconButton edge="start" color="inherit" onClick={() => navigate(-1)} aria-label="back">
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h6" style={styles.title}>
                        รายละเอียดประวัติออเดอร์
                    </Typography>
                </Toolbar>
            </AppBar>
    
            <div style={styles.menuContainer}>
                {orderDetails.map((item) => {
                    const itemDetails = getItemDetails(item);
                    return itemDetails ? (
                        <Paper key={item.Order_detail_id} style={styles.menuItem}>
                            <img
                                src={`data:image/jpeg;base64,${itemDetails.image}`}
                                alt={itemDetails.name}
                                style={styles.menuImage}
                            />
                            <div style={styles.menuInfo}>
                                <h3 style={styles.menuInfoH3}>{itemDetails.name}</h3>
                                <p style={styles.menuInfoP}>จำนวน: {item.Order_detail_quantity}</p>
                                <p style={styles.menuInfoP}>ราคา: {itemDetails.price} บาท</p>
                                <p style={styles.menuInfoP}>สถานะ: {item.Order_detail_status}</p>
                                {item.Order_detail_additional && (
                                    <p style={styles.menuInfoP}>เพิ่มเติม: {item.Order_detail_additional}</p>
                                )}
                                <p style={styles.menuInfoP}>รับกลับบ้าน: {item.Order_detail_takehome ? 'ใช่' : 'ไม่'}</p>
                            </div>
                        </Paper>
                    ) : null;
                })}
            </div>
        </Container>
    );
}

export default HistoryDetail;
