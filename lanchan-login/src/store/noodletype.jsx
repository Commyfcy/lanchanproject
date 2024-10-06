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

function Menuex() {
    const [noodleData, setNoodleData] = useState({ noodlename: '' });
    const [noodleTypes, setNoodleTypes] = useState([]);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchNoodleTypes();
    }, []);

    const fetchNoodleTypes = async () => {
        try {
            const response = await fetch('http://localhost:3333/noodletypes');
            const data = await response.json();
            setNoodleTypes(data);
        } catch (error) {
            console.error('Error fetching noodle types:', error);
        }
    };

    const handleNoodleChange = (e) => {
        const { name, value } = e.target;
        setNoodleData({ ...noodleData, [name]: value });
    };

    const handleSubmitNoodle = async (e) => {
        e.preventDefault();
        if (!noodleData.noodlename) {
            alert('กรุณาพิมพ์ชนิดเส้น');
            return;
        }
        try {
            const response = await fetch('http://localhost:3333/addnoodle', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ Noodle_type_name: noodleData.noodlename })
            });
    
            const data = await response.json();
            if (response.status === 409) {
                alert('ชนิดเส้นนี้มีอยู่แล้ว กรุณาพิมพ์ชนิดเส้นใหม่');
            } else if (response.ok) {
                if (data.status === 'ok') {
                    alert('เพิ่มชนิดเส้นสำเร็จ');
                    setNoodleData({ noodlename: '' });
                    fetchNoodleTypes();
                } else {
                    alert('เกิดข้อผิดพลาดในการเพิ่มชนิดเส้น: ' + data.message);
                }
            } else {
                throw new Error('Network response was not ok.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('เกิดข้อผิดพลาดในการเพิ่มชนิดเส้น');
        }
    };

    

    const handleDeleteClick = (item) => {
        setItemToDelete(item);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!itemToDelete) return;
    
        try {
            const response = await fetch(`http://localhost:3333/deletenoodletype/${itemToDelete.Noodle_type_id}`, {
                method: 'DELETE',
            });
    
            if (response.ok) {
                const data = await response.json();
                if (data.status === 'ok') {
                    alert('ลบชนิดเส้นสำเร็จ');
                    fetchNoodleTypes();
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
            
            <Typography variant="h5" gutterBottom>เพิ่มชนิดเส้น</Typography>
            <form onSubmit={handleSubmitNoodle}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            label="พิมพ์ชนิดเส้นใหม่"
                            name="noodlename"
                            value={noodleData.noodlename}
                            onChange={handleNoodleChange}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            เพิ่มชนิดเส้น
                        </Button>
                    </Grid>
                </Grid>
            </form>

            <Typography variant="h6" gutterBottom style={{ marginTop: '20px' }}>
                ชนิดเส้นที่มีอยู่
            </Typography>
            <List>
                {noodleTypes.map((type) => (
                    <ListItem key={type.Noodle_type_id}>
                        <ListItemText primary={type.Noodle_type_name} />
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

export default Menuex;