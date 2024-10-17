import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbarow } from "../owner/Navbarowcomponent/navbarow/index-ow";
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const styles = {


  basketpage: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh', // ใช้ 'vh' ใน JSX
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



  '@media (max-width: 600px)': { // เพิ่ม '@media' สำหรับ responsive design
    menuItem: {
      flexDirection: 'column',
    },
    menuImage: {
      width: '100%',
      height: '150px',
    },
  },
};
function Abbmenu() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '5px' }}>
      <Button variant="contained" style={{ width: '300px' }} >เพิ่มเมนูอื่นๆ</Button>
    </div>
  );
}

function Abbnoodle() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '5px' }}>
      <Button variant="contained" style={{ width: '300px' }}>เพิ่มรายการก๋วยเตี๋ยว</Button>
    </div>
  );
}

function Basket() {
  const [menuItems, setMenuItems] = useState([]);
  const [NoodlemenuItems, setNoodlemenuItems] = useState([]);
  const [soups, setSoups] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [meats, setMeats] = useState([]);
  const [noodleTypes, setNoodleTypes] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const fetchAllData = async () => {
    try {
      const [soupRes, sizeRes, meatRes, noodleTypeRes] = await Promise.all([
        fetch('http://localhost:3333/soups'),
        fetch('http://localhost:3333/sizes'),
        fetch('http://localhost:3333/meats'),
        fetch('http://localhost:3333/noodletypes')
      ]);

      const [soupData, sizeData, meatData, noodleTypeData] = await Promise.all([
        soupRes.json(),
        sizeRes.json(),
        meatRes.json(),
        noodleTypeRes.json()
      ]);

      console.log('Noodle types from API:', noodleTypeData);

      setSoups(soupData);
      setSizes(sizeData);
      setMeats(meatData);
      setNoodleTypes(noodleTypeData);
      console.log('Data fetched successfully:', { soupData, sizeData, meatData, noodleTypeData });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    console.log('noodleTypes updated:', noodleTypes);
  }, [noodleTypes]);

  useEffect(() => {
    fetchNoodleMenuItems();
    fetchAllData();
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await fetch('http://localhost:3333/getmenu');
      if (response.ok) {
        const data = await response.json();
        console.log('Menu items data', data);
        setMenuItems(data);
      } else {
        console.error('Failed to fetch menu items');
      }
    } catch (error) {
      console.error('Error fetching menu items:', error);
    }
  };

  const fetchNoodleMenuItems = async () => {
    try {
      const response = await fetch('http://localhost:3333/getnoodlemenu');
      if (response.ok) {
        const data = await response.json();
        setNoodlemenuItems(data);
      } else {
        console.error('Failed to fetch noodle menu items');
      }
    } catch (error) {
      console.error('Error fetching noodle menu items:', error);
    }
  };

  const getNoodleTypeName = (id) => {
    const noodle = noodleTypes.find(type => type.Noodle_type_id === id);
    return noodle ? noodle.Noodle_type_name : 'ไม่ระบุ';
  };

  const getSoupName = (id) => {
    const soup = soups.find(s => s.Soup_id === id);
    return soup ? soup.Soup_name : 'ไม่ระบุ';
  };

  const getMeatName = (id) => {
    const meat = meats.find(m => m.Meat_id === id);
    return meat ? meat.Meat_name : 'ไม่ระบุ';
  };

  const getSizeName = (id) => {
    const size = sizes.find(s => s.Size_id === id);
    return size ? size.Size_name : 'ไม่ระบุ';
  };

  function getMenuName(Noodle_type_id, soup_id, meat_id, size_id) {
    const noodle_type_name = getNoodleTypeName(Noodle_type_id);
    const soup_name = getSoupName(soup_id);
    const meat_name = getMeatName(meat_id);
    const size_name = getSizeName(size_id);
    console.log('Menu name components:', { noodle_type_name, soup_name, meat_name, size_name });
    
    return `${noodle_type_name} ${soup_name} ${meat_name} (${size_name})`;
  }

  const handleDeleteClick = (item, isNoodleMenu) => {
    setItemToDelete({ ...item, isNoodleMenu });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setItemToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      const endpoint = itemToDelete.isNoodleMenu ? 
        `http://localhost:3333/deletenoodlemenu/${itemToDelete.Noodle_menu_id}` :
        `http://localhost:3333/deletemenu/${itemToDelete.Menu_id}`;

      const response = await fetch(endpoint, {
        method: 'DELETE',
      });

      if (response.ok) {
        if (itemToDelete.isNoodleMenu) {
          setNoodlemenuItems(prevItems => prevItems.filter(item => item.Noodle_menu_id !== itemToDelete.Noodle_menu_id));
        } else {
          setMenuItems(prevItems => prevItems.filter(item => item.Menu_id !== itemToDelete.Menu_id));
        }
        alert('ลบเมนูสำเร็จ');
      } else {
        alert('เกิดข้อผิดพลาดในการลบเมนู');
      }
    } catch (error) {
      console.error('Error deleting menu item:', error);
      alert('เกิดข้อผิดพลาดในการลบเมนู');
    }

    handleCloseDialog();
  };

  if (!Array.isArray(noodleTypes) || noodleTypes.length === 0) {
    return <div>กำลังโหลดข้อมูล...</div>;
  }

  return (
    <div style={styles.basketPage}>
      <Navbarow />
      <Link to="/addmenu"><Abbmenu /> </Link>
      <Link to="/addnoodle"><Abbnoodle /> </Link>

      <div className='listmenu' style={styles.menuContainer}>
        {NoodlemenuItems.map((item) => (
          <div key={`noodle-${item.Noodle_menu_id}`} style={styles.menuItem}>
            <Link to={`/noodledetail/${item.Noodle_menu_id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex' }}>
              <img src={`data:image/jpeg;base64,${item.Noodle_menu_picture}`} alt={item.Noodle_menu_name} style={styles.menuImage} />
              <div style={styles.menuInfo}>
                <h3 style={styles.menuInfoH3}>{getMenuName(item.Noodle_type_id, item.Soup_id, item.Meat_id, item.Size_id)}</h3>
                <p>ราคา: {item.Noodle_menu_price} บาท</p>
              </div>
            </Link>
            <Button 
              variant="outlined" 
              startIcon={<DeleteIcon />} 
              onClick={() => handleDeleteClick(item, true)}
              style={{ position: 'absolute', bottom: '10px', right: '10px' }}
            >
              ลบเมนู
            </Button>
          </div>
        ))}
        {menuItems.map((item) => (
          <div key={`menu-${item.Menu_id}`} style={styles.menuItem}>
            <Link to={`/fooddetail/${item.Menu_id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex' }}>
              <img src={`data:image/jpeg;base64,${item.Menu_picture}`} alt={item.Menu_name} style={styles.menuImage} />
              <div style={styles.menuInfo}>
                <h3 style={styles.menuInfoH3}>{item.Menu_name}</h3> 
                <p>ราคา:{item.Menu_price} บาท</p>
              </div>
            </Link>
            <Button 
              variant="outlined" 
              startIcon={<DeleteIcon />} 
              onClick={() => handleDeleteClick(item, false)}
              style={{ position: 'absolute', bottom: '10px', right: '10px' }}
            >
              ลบเมนู
            </Button>
          </div>
        ))}
      </div>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"ยืนยันการลบเมนู"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            คุณแน่ใจหรือไม่ที่จะลบเมนูนี้?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>ยกเลิก</Button>
          <Button onClick={handleConfirmDelete} autoFocus>
            ยืนยัน
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Basket;