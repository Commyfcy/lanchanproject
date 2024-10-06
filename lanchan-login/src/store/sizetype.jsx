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

function Size() {
    const [sizeData, setSizeData] = useState({ size: '' });
    const [sizes, setSizes] = useState([]);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchSizeTypes();
    }, []);

    const fetchSizeTypes = async () => {
        try {
            const response = await fetch('http://localhost:3333/sizes');
            const data = await response.json();
            setSizes(data);
        } catch (error) {
            console.error('Error fetching size data:', error);
        }
    };

    const handleSizeChange = (e) => {
        const { name, value } = e.target;
        setSizeData({ ...sizeData, [name]: value });
    };

    const handleSubmitSize = async (e) => {
        e.preventDefault();
        if (!sizeData.size) {
            alert('กรุณาพิมพ์ขนาด');
            return;
        }
        try {
            const response = await fetch('http://localhost:3333/addsize', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ size: sizeData.size })
            });
    
            const data = await response.json();
            if (response.status === 409) {
                alert('ขนาดนี้มีอยู่แล้ว กรุณาพิมพ์ขนาดใหม่');
            } else if (response.ok) {
                if (data.status === 'ok') {
                    alert('เพิ่มขนาดสำเร็จ');
                    setSizeData({ size: '' });
                    fetchSizeTypes();
                } else {
                    alert('เกิดข้อผิดพลาดในการเพิ่มขนาด: ' + data.message);
                }
            } else {
                throw new Error('Network response was not ok.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('เกิดข้อผิดพลาดในการเพิ่มขนาด');
        }
    };

    const handleDeleteClick = (item) => {
        setItemToDelete(item);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!itemToDelete) return;

        try {
            const response = await fetch(`http://localhost:3333/deletesize/${itemToDelete.Size_id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert('ลบไซส์สำเร็จ');
                fetchSizeTypes();
            } else {
                throw new Error('Network response was not ok.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('เกิดข้อผิดพลาดในการลบชนิดไซส์');
        }

        setDeleteDialogOpen(false);
        setItemToDelete(null);
    };

    return (
        <Container maxWidth="md">
            <IconButton onClick={() => navigate(-1)}>
                <ArrowBackIcon />
            </IconButton>

            <Typography variant="h5" gutterBottom>เพิ่มประเภทไซส์</Typography>
            <form onSubmit={handleSubmitSize}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            label="เพิ่มประเภทไซส์"
                            name="size"
                            value={sizeData.size}
                            onChange={handleSizeChange}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            เพิ่มประเภทไซส์
                        </Button>
                    </Grid>
                </Grid>
            </form>

            <Typography variant="h6" gutterBottom style={{ marginTop: '20px' }}>
                ประเภทไซส์ที่มีอยู่
            </Typography>
            <List>
                {sizes.map((type) => (
                    <ListItem key={type.Size_id}>
                        <ListItemText primary={type.Size_name} />
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
                        คุณแน่ใจหรือไม่ที่จะลบ {itemToDelete?.Size_name}?
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

export default Size;