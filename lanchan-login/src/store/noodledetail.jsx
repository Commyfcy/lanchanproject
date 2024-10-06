import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    TextField,
    MenuItem,
    Button,
    Container,
    Grid,
    IconButton,
    Stack
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';



function MenuForm() {
    const navigate = useNavigate();
    let { id } = useParams();
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        soupId: '',
        sizeId: '',
        meatId: '',
        noodleTypeId: '',
        image: null
    });

    const [previewImage, setPreviewImage] = useState(null);
    const [soups, setSoups] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [meats, setMeats] = useState([]);
    const [noodleTypes, setNoodleTypes] = useState([]);


    useEffect(() => {
        fetchNoodlemenuDetails();
        fetchDropdownData();
    }, [id]);

    useEffect(() => {
        console.log("noodleTypes updated:", noodleTypes);
    }, [noodleTypes]);

    const fetchNoodlemenuDetails = async () => {
        try {
            const response = await fetch(`http://localhost:3333/getnoodlemenu/${id}`);
            if (!response.ok) throw new Error('Failed to fetch noodle menu details');
            const data = await response.json();
            setFormData({
                name: data.Noodle_menu_name,
                price: data.Noodle_menu_price,
                soupId: data.Soup_id,
                sizeId: data.Size_id,
                meatId: data.Meat_id,
                noodleTypeId: data.Noodle_type_id,
            });
            if (data.Noodle_menu_picture) {
                setPreviewImage(`data:image/jpeg;base64,${data.Noodle_menu_picture}`);
            }
        } catch (error) {
            console.error('Error fetching noodle menu details:', error);
        }
    };

    const fetchDropdownData = async () => {
        try {
            const [soupsRes, sizesRes, meatsRes, noodleTypesRes] = await Promise.all([
                fetch('http://localhost:3333/soups'),
                fetch('http://localhost:3333/sizes'),
                fetch('http://localhost:3333/meats'),
                fetch('http://localhost:3333/noodletypes')
            ]);

            if (!soupsRes.ok || !sizesRes.ok || !meatsRes.ok || !noodleTypesRes.ok) {
                throw new Error('Failed to fetch dropdown data');
            }

            const [soupsData, sizesData, meatsData, noodleTypesData] = await Promise.all([
                soupsRes.json(),
                sizesRes.json(),
                meatsRes.json(),
                noodleTypesRes.json()
            ]);

            setSoups(soupsData);
            setSizes(sizesData);
            setMeats(meatsData);
            setNoodleTypes(noodleTypesData);
        } catch (error) {
            console.error('Error fetching dropdown data:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setFormData({ ...formData, image: file });

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewImage(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // สร้าง object ข้อมูลแทนการใช้ FormData
        const updateData = {
            Noodle_menu_name: formData.name,
            Noodle_menu_price: formData.price,
            Soup_id: formData.soupId,
            Size_id: formData.sizeId,
            Meat_id: formData.meatId,
            Noodle_type_id: formData.noodleTypeId
        };

        // ถ้ามีการอัปโหลดรูปภาพใหม่
        if (formData.image instanceof File) {
            const base64Image = await convertToBase64(formData.image);
            updateData.Noodle_menu_picture = base64Image;
        }

        try {
            const response = await fetch(`http://localhost:3333/updatenoodlemenu/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (data.status === 'ok') {
                alert('อัปเดตเมนูก๋วยเตี๋ยวสำเร็จ');
            } else {
                alert('เกิดข้อผิดพลาดในการอัปเดตเมนูก๋วยเตี๋ยว: ' + data.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('เกิดข้อผิดพลาดในการอัปเดตเมนูก๋วยเตี๋ยว: ' + error.message);
        }
    };

    // ฟังก์ชันสำหรับแปลงไฟล์เป็น base64
    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = (error) => reject(error);
        });
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

                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            label="ชื่อเมนูก๋วยเตี๋ยว"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="ราคา"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            fullWidth
                            required
                            type="number"
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            select
                            label="ประเภทซุป"
                            name="soupId"
                            value={formData.soupId}
                            onChange={handleChange}
                            fullWidth
                            required
                        >
                            {soups.map((soup) => (
                                <MenuItem key={soup.Soup_id} value={soup.Soup_id}>
                                    {soup.Soup_name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            select
                            label="ขนาด"
                            name="sizeId"
                            value={formData.sizeId}
                            onChange={handleChange}
                            fullWidth
                            required
                        >
                            {sizes.map((size) => (
                                <MenuItem key={size.Size_id} value={size.Size_id}>
                                    {size.Size_name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            select
                            label="ประเภทเนื้อสัตว์"
                            name="meatId"
                            value={formData.meatId}
                            onChange={handleChange}
                            fullWidth
                            required
                        >
                            {meats.map((meat) => (
                                <MenuItem key={meat.Meat_id} value={meat.Meat_id}>
                                    {meat.Meat_name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            select
                            label="ประเภทเส้น"
                            name="noodleTypeId"
                            value={formData.noodleTypeId || ''}
                            onChange={handleChange}
                            fullWidth
                            required
                        >
                            {noodleTypes.map((type) => (
                                <MenuItem key={type.Noodle_type_id} value={type.Noodle_type_id.toString()}>
                                    {type.Noodle_type_name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    <Grid item xs={12}>
                        <input
                            accept="image/*"
                            type="file"
                            id="image-upload"
                            onChange={handleImageChange}
                            hidden
                        />
                        <label htmlFor="image-upload">
                            <Button variant="contained" component="span">
                                เปลี่ยนรูปภาพ
                            </Button>
                        </label>
                        {previewImage && (
                            <img
                                src={previewImage}
                                alt="Preview"
                                style={{ maxWidth: '100%', marginTop: '10px' }}
                            />
                        )}
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

export default MenuForm;