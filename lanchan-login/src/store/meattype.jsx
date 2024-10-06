import React, { useState, useEffect } from 'react';
import {
    TextField,
    Button,
    Container,
    Grid,
    IconButton,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';

function Meat() {
    const [meatData, setMeatData] = useState({ meat: '' });
    const [meats, setMeats] = useState([]);
    const navigate = useNavigate();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    useEffect(() => {
        fetchMeatTypes();
    }, []);

    const fetchMeatTypes = async () => {
        try {
            const response = await fetch('http://localhost:3333/meats');
            const data = await response.json();
            setMeats(data);
        } catch (error) {
            console.error('Error fetching Meats types:', error);
        }
    };

    const handleMeatChange = (e) => {
        const { name, value } = e.target;
        setMeatData({ ...meatData, [name]: value });
    };

    const handleSubmitMeat = async (e) => {
        e.preventDefault();
        if (!meatData.meat) {
            alert('กรุณาพิมพ์ชนิดเนื้อ');
            return;
        }
        try {
            const response = await fetch('http://localhost:3333/addmeat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ meat: meatData.meat })
            });
    
            const data = await response.json();
            if (response.status === 409) {
                alert('ชนิดเนื้อนี้มีอยู่แล้ว กรุณาพิมพ์ชนิดเนื้อใหม่');
            } else if (response.ok) {
                if (data.status === 'ok') {
                    alert('เพิ่มเนื้อสำเร็จ');
                    setMeatData({ meat: '' });
                    fetchMeatTypes();
                } else {
                    alert('เกิดข้อผิดพลาดในการเพิ่มเนื้อ: ' + data.message);
                }
            } else {
                throw new Error('Network response was not ok.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('เกิดข้อผิดพลาดในการเพิ่มเชนิดเนื้อ');
        }
    };

    const handleDeleteClick = (item) => {
        setItemToDelete(item);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!itemToDelete) return;
    
        try {
            const response = await fetch(`http://localhost:3333/deleteMeat/${itemToDelete.Meat_id}`, {
                method: 'DELETE',
            });
    
            if (response.ok) {
                const data = await response.json();
                if (data.status === 'ok') {
                    alert('ลบชนิดเส้นสำเร็จ');
                    fetchMeatTypes();
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

            <Typography variant="h5" gutterBottom>เพิ่มชนิดเนื้อ</Typography>
            <form onSubmit={handleSubmitMeat}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            label="พิมพ์ชนิดเนื้อ"
                            name="meat"
                            value={meatData.meat}
                            onChange={handleMeatChange}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            เพิ่มชนิดเนื้อ
                        </Button>
                    </Grid>
                </Grid>
            </form>

            <Typography variant="h6" gutterBottom style={{ marginTop: '20px' }}>
                ชนิดเนื้อที่มีอยู่
            </Typography>
            <List>
                {meats.map((type) => (
                    <ListItem key={type.Meat_id}>
                        <ListItemText primary={type.Meat_name} />
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
                        คุณแน่ใจหรือไม่ที่จะลบ {itemToDelete?.Noodle_type_name}?
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

export default Meat;