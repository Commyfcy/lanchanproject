import React, { useState } from 'react';
import {
  TextField,
  MenuItem,
  Button,
  Container,
  Grid,
 // Typography,
  IconButton,
  Stack
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

function MenuForm() {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    soupType: '',
    image: null
  });

  const [previewImage, setPreviewImage] = useState(null);

  const soupTypes = ['เครื่องดื่ม',  "ของหวาน" ,"อื่นๆ"];

  const navigate = useNavigate();

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
    const formDataToSend = new FormData();
    formDataToSend.append('Menu_name', formData.name);
    formDataToSend.append('Menu_price', formData.price);
    formDataToSend.append('Menu_category', formData.soupType); // ใช้ Menu_category ตามฐานข้อมูล
    formDataToSend.append('Menu_picture', formData.image);

    try {
      const response = await fetch('http://localhost:3333/addmenu', { // เปลี่ยน URL ไปยัง endpoint ของ backend
        method: 'POST',
        body: formDataToSend
      });

      if (response.ok) {
        const data = await response.json();
        if (data.status === 'ok') {
          alert('เพิ่มเมนูสำเร็จ');
          navigate('/menupage');
        } else {
          alert('เกิดข้อผิดพลาดในการเพิ่มเมนู: ' + data.message);
        }
      } else {
        throw new Error('Network response was not ok.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('เกิดข้อผิดพลาดในการเพิ่มเมนู');
    }
  };

  return (
    <Container maxWidth="md">
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* ปุ่มย้อนกลับ */}
          <Grid item xs={12}>
            <IconButton onClick={() => navigate(-1)}>
              <ArrowBackIcon />
            </IconButton>
          </Grid>

          {/* ชื่อเมนูอาหาร */}
          <Grid item xs={12}>
            <TextField
              label="ชื่อเมนูอาหาร"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>

          {/* ราคา และ ประเภทซุป */}
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
              label="ประเภท"
              name="soupType"
              value={formData.soupType}
              onChange={handleChange}
              fullWidth
              required
            >
              {soupTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* อัปโหลดรูปภาพ */}
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
                อัปโหลดรูปภาพ
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

          {/* ปุ่มเพิ่มเมนู */}
          <Grid item xs={12}>
            <Stack direction="row" justifyContent="flex-end">
              <Button type="submit" variant="contained" color="primary">
                เพิ่มเมนู
              </Button>
            </Stack>
          </Grid>
        </Grid>

      </form>

    </Container>
  );
}

export default MenuForm;
