import React, { useState, useEffect } from 'react';
import {
  TextField,
  MenuItem,
  Button,
  Container,
  Grid,
  IconButton,
  Box,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, Link } from 'react-router-dom';
function MenuForm() {
  const [formData, setFormData] = useState({
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

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch data for dropdowns
    const fetchData = async () => {
      try {
        const [soupRes, sizeRes, meatRes, noodleTypeRes] = await Promise.all([
          fetch('http://localhost:3333/soups'),
          fetch('http://localhost:3333/sizes'),
          fetch('http://localhost:3333/meats'),
          fetch('http://localhost:3333/noodletypes')
        ]);

        const soupData = await soupRes.json();
        const sizeData = await sizeRes.json();
        const meatData = await meatRes.json();
        const noodleTypeData = await noodleTypeRes.json();

        setSoups(soupData);
        setSizes(sizeData);
        setMeats(meatData);
        setNoodleTypes(noodleTypeData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

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

  const generateMenuName = () => {
    const noodleType = noodleTypes.find(type => type.Noodle_type === formData.noodleTypeId)?.Noodle_type_name || '';
    const soup = soups.find(soup => soup.Soup_id === formData.soupId)?.Soup_name || '';
    const meat = meats.find(meat => meat.Meat_id === formData.meatId)?.Meat_name || '';
    const size = sizes.find(size => size.Size_id === formData.sizeId)?.Size_name || '';

    return `${noodleType} ${soup} ${meat} ${size}`.trim();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const menuName = generateMenuName();
    const formDataToSend = new FormData();
    formDataToSend.append('Noodle_menu_name', menuName);
    formDataToSend.append('Noodle_menu_price', formData.price);
    formDataToSend.append('Soup_id', formData.soupId);
    formDataToSend.append('Size_id', formData.sizeId);
    formDataToSend.append('Meat_id', formData.meatId);
    formDataToSend.append('Noodle_type_id', formData.noodleTypeId);
    formDataToSend.append('Noodle_menu_picture', formData.image);
  
    try {
      const response = await fetch('http://localhost:3333/addnoodlemenu', {
        method: 'POST',
        body: formDataToSend
      });
  
      const data = await response.json();
  
      if (response.status === 409) {
        alert('เมนูนี้มีอยู่แล้ว กรุณาตรวจสอบข้อมูลอีกครั้ง');
      } else if (response.ok) {
        if (data.status === 'ok') {
          alert('เพิ่มเมนูสำเร็จ');
          navigate('/menupage');
          setFormData({
            price: '',
            soupId: '',
            sizeId: '',
            meatId: '',
            noodleTypeId: '',
            image: null
          });
          setPreviewImage(null);
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 2 }}>
        <IconButton onClick={() => navigate(-1)} aria-label="back">
          <ArrowBackIcon />
        </IconButton>
        <Link to="/addex" style={{ textDecoration: 'none' }}>
          <Button variant="contained" color="primary">
            เพิ่มรายการส่วนประกอบก๋วยเตี๋ยว
          </Button>
        </Link>
      </Box>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* ราคา */}
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

          {/* ประเภทซุป */}
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

          {/* ไซส์ */}
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="ไซส์"
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

          {/* ชนิดเส้น */}
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="ชนิดเส้น"
              name="noodleTypeId"
              value={formData.noodleTypeId}
              onChange={handleChange}
              fullWidth
              required
            >
              {noodleTypes.map((type) => (
                <MenuItem key={type.Noodle_type} value={type.Noodle_type_id}>
                  {type.Noodle_type_name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* ชนิดเนื้อ */}
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="ชนิดเนื้อ"
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
              <Box mt={2}>
                <img
                  src={previewImage}
                  alt="Preview"
                  style={{ maxWidth: '100%', maxHeight: '200px' }}
                />
              </Box>
            )}
          </Grid>

          {/* ปุ่มเพิ่มเมนู */}
          <Grid item xs={12}>
            <Box mt={2}>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                เพิ่มก๋วยเตี๋ยว
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}

export default MenuForm;