import React, { useState, useEffect } from 'react';
import { Navbarow } from "../owner/Navbarowcomponent/navbarow/index-ow";
import {
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';

const styles = {
  orderPage: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    width: '100%',
  },
  orderContainer: {
    width: '95%',
    maxWidth: '1200px',
    margin: '20px auto',
  },
  orderItem: {
    marginBottom: '20px',
    padding: '20px',
  },
  orderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  menuItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 0',
  },
  menuImage: {
    width: '50px',
    height: '50px',
    objectFit: 'cover',
    marginRight: '10px',
  },
};

function OrderDisplay() {
  const [orders, setOrders] = useState([]);
  const [noodleMenu, setNoodleMenu] = useState([]);
  const [otherMenu, setOtherMenu] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [updatingItemId, setUpdatingItemId] = useState(null);

  useEffect(() => {
    fetchOrders();
    fetchMenus();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:3333/getpreparingorders');
      if (response.ok) {
        const data = await response.json();
        const ordersWithDetails = await Promise.all(data.map(async (order) => {
          const detailsResponse = await fetch(`http://localhost:3333/getorderdetail/${order.Order_id}`);
          const details = await detailsResponse.json();
          return { ...order, details: details.filter(item => item.Order_detail_status === "พร้อมเสิร์ฟ") };
        }));
        setOrders(ordersWithDetails);
      } else {
        console.error('Failed to fetch preparing orders');
      }
    } catch (error) {
      console.error('Error fetching preparing orders:', error);
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

  const handleUpdateStatus = (itemId) => {
    setUpdatingItemId(itemId);
    setOpenDialog(true);
  };

  const confirmUpdate = async () => {
    try {
      const response = await fetch(`http://localhost:3333/updateorderstatus/${updatingItemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'พร้อมเสิร์ฟ' }),
      });

      if (response.ok) {
        setOrders(prevOrders => 
          prevOrders.map(order => ({
            ...order,
            details: order.details.filter(item => item.Order_detail_id !== updatingItemId)
          })).filter(order => order.details.length > 0)
        );
        setOpenDialog(false);
      } else {
        throw new Error('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  return (
    <div style={styles.orderPage}>
      <Navbarow />
      <Container style={styles.orderContainer}>
        <Typography variant="h4" align="center" gutterBottom>
          รายการออเดอร์ที่กำลังจัดเตรียม
        </Typography>
        {orders.length === 0 ? (
          <Typography variant="h6" align="center">
            ไม่มีรายการออเดอร์ที่กำลังจัดเตรียม
          </Typography>
        ) : (
          orders.map((order) => (
            <Paper key={order.Order_id} style={styles.orderItem}>
              <div style={styles.orderHeader}>
                <Typography variant="h6">เลขออเดอร์: {order.Order_id}</Typography>
                <Typography>โต๊ะที่: {order.Table_id}</Typography>
              </div>
              <Typography>เวลาสั่ง: {new Date(order.Order_datetime).toLocaleString()}</Typography>
              <List>
                {order.details.map((item) => {
                  const itemDetails = getItemDetails(item);
                  return itemDetails ? (
                    <ListItem key={item.Order_detail_id} style={styles.menuItem}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                       
                        <ListItemText
                          primary={itemDetails.name}
                          secondary={
                            <>
                              จำนวน: {item.Order_detail_quantity}, ราคา: {itemDetails.price} บาท
                              {item.Order_detail_additional && (
                                <><br />เพิ่มเติม: {item.Order_detail_additional}</>
                              )}
                              <br />
                              รับกลับบ้าน: {item.Order_detail_takehome ? 'ใช่' : 'ไม่'}
                            </>
                          }
                        />
                      </div>
                      <Button
                        variant="outlined"
                        onClick={() => handleUpdateStatus(item.Order_detail_id)}
                      >
                        อัปเดตสถานะ
                      </Button>
                    </ListItem>
                  ) : null;
                })}
              </List>
            </Paper>
          ))
        )}
      </Container>
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"ยืนยันการอัปเดตสถานะ"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            คุณต้องการอัปเดตสถานะเป็น "พร้อมเสิร์ฟ" ใช่หรือไม่?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            ยกเลิก
          </Button>
          <Button onClick={confirmUpdate} color="primary" autoFocus>
            ยืนยัน
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default OrderDisplay;