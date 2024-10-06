import React, { useState, useEffect } from 'react';
import {
    TextField,
    Button,
    Container,
    Grid,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';

function SoupManagement() {
    const [soupData, setSoupData] = useState({ soup: '' });
    const [soups, setSoups] = useState([]);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const navigate = useNavigate();


    useEffect(() => {
        fetchSoups();
    }, []);

    const fetchSoups = async () => {
        try {
            const response = await fetch('http://localhost:3333/soups');
            const data = await response.json();
            setSoups(data);
        } catch (error) {
            console.error('Error fetching soups:', error);
        }
    };

    const handleSoupChange = (e) => {
        const { name, value } = e.target;
        setSoupData({ ...soupData, [name]: value });
    };

    const handleSubmitSoup = async (e) => {
        e.preventDefault();
        if (!soupData.soup) {
            alert('กรุณาพิมพ์ชนิดซุป');
            return;
        }
        try {
            const response = await fetch('http://localhost:3333/addsoup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ soup: soupData.soup })
            });
    
            const data = await response.json();
            if (response.status === 409) {
                alert('ชนิดซุปนี้มีอยู่แล้ว กรุณาพิมพ์ชนิดซุปใหม่');
            } else if (response.ok) {
                if (data.status === 'ok') {
                    alert('เพิ่มซุปสำเร็จ');
                    setSoupData({ soup: '' });
                    fetchSoups();
                } else {
                    alert('เกิดข้อผิดพลาดในการเพิ่มซุป: ' + data.message);
                }
            } else {
                throw new Error('Network response was not ok.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('เกิดข้อผิดพลาดในการเพิ่มซุป');
        }
    };

    const handleDeleteClick = (item) => {
        setItemToDelete(item);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!itemToDelete) return;
    
        try {
            const response = await fetch(`http://localhost:3333/deletesoup/${itemToDelete.Soup_id}`, {
                method: 'DELETE',
            });
    
            if (response.ok) {
                const data = await response.json();
                if (data.status === 'ok') {
                    alert('ลบชนิดซุปสำเร็จ');
                    fetchSoups();
                } else {
                    alert('เกิดข้อผิดพลาดในการลบชนิดเส้น: ' + data.message);
                }
            } else {
                throw new Error('Network response was not ok.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('เกิดข้อผิดพลาดในการลบชนิดเส้น');
        }
    
        setDeleteDialogOpen(false);
        setItemToDelete(null);
    };
    return (
        <Container maxWidth="md">
            <IconButton onClick={() => navigate(-1)}>
                <ArrowBackIcon />
            </IconButton>
            <Typography variant="h5" gutterBottom>เพิ่มประเภทซุป</Typography>
            <form onSubmit={handleSubmitSoup}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            label="เพิ่มประเภทซุป"
                            name="soup"
                            value={soupData.soup}
                            onChange={handleSoupChange}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            เพิ่มประเภทซุป
                        </Button>
                    </Grid>
                </Grid>
            </form>

            <Typography variant="h6" gutterBottom style={{ marginTop: '20px' }}>
                ประเภทซุปที่มีอยู่
            </Typography>
            <List>
                {soups.map((type) => (
                    <ListItem key={type.Soup_id}>
                        <ListItemText primary={type.Soup_name} />
                        <ListItemSecondaryAction>
                            <IconButton
                                edge="end"
                                aria-label="delete"
                                onClick={() => handleDeleteClick(type)}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
            </List>

            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
            >
                <DialogTitle>ยืนยันการลบ</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        คุณแน่ใจหรือไม่ที่จะลบ {itemToDelete?.Soup_name}?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>ยกเลิก</Button>
                    <Button onClick={handleDeleteConfirm} color="error">ลบ</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default SoupManagement;