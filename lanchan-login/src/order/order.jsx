import React, { useState, useEffect } from 'react';
import { Navbarow } from "../owner/Navbarowcomponent/navbarow/index-ow";
import {
 
} from '@mui/material';

const styles = {
  orderPage: {
    padding: '1rem',
  },
  orderContainer: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  orderItem: {
    backgroundColor: 'white',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    borderRadius: '0.5rem',
    padding: '1rem',
    marginBottom: '1rem',
  },
  orderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem',
  },
  menuItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.5rem 0',
    borderBottom: '1px solid #eee',
  },
  updateButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '0.25rem',
    cursor: 'pointer',
  },
  dialog: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialogContent: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '0.5rem',
    maxWidth: '400px',
    width: '100%',
  },
  dialogButtons: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '1rem',
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
          return { ...order, details: details.filter(item => item.Order_detail_status === "กำลังจัดเตรียม") };
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
      console.log('Noodle Menu:', noodleData);
      console.log('Other Menu:', otherData);    // เพิ่ม log
    } catch (error) {
      console.error('Error fetching menus:', error);
    }
  };

  const getItemDetails = (item) => {
    if (item.Noodle_menu_id && Array.isArray(noodleMenu)) {
      const noodle = noodleMenu.find(n => n.Noodle_menu_id === item.Noodle_menu_id);
      return noodle ? {
        name: noodle.Noodle_menu_name,
        price: noodle.Noodle_menu_price,
        image: noodle.Noodle_menu_picture
      } : null;
    } else if (item.Menu_id && Array.isArray(otherMenu)) {
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
        body: JSON.stringify({ status: 'เสิร์ฟเเล้ว' }),
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

  if (!Array.isArray(noodleMenu) || !Array.isArray(otherMenu)) {
    return <div>Loading menus...</div>;
  }


  const handleUpdateAllStatus = async (orderId) => {
    try {
      const order = orders.find(o => o.Order_id === orderId);
      if (!order) throw new Error('Order not found');
  
      await Promise.all(order.details.map(item =>
        fetch(`http://localhost:3333/updateorderstatus/${item.Order_detail_id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: 'เสิร์ฟเเล้ว' }),
        })
      ));
  
      // อัปเดต state ของ orders
      setOrders(prevOrders =>
        prevOrders.filter(o => o.Order_id !== orderId)
      );
  
      alert('อัปเดตสถานะทั้งหมดเรียบร้อยแล้ว');
    } catch (error) {
      console.error('Error updating all statuses:', error);
      alert('เกิดข้อผิดพลาดในการอัปเดตสถานะ');
    }
  };

  return (
    <div style={styles.orderPage}>
      <Navbarow />
      <div style={styles.orderContainer}>
        <h1 style={{ textAlign: 'center', marginBottom: '1rem' }}>รายการออเดอร์ที่สั่ง</h1>
        {orders.length === 0 ? (
          <h2 style={{ textAlign: 'center' }}>ไม่มีรายการออเดอร์สั่ง</h2>
        ) : (
          orders.map((order) => (
            <div key={order.Order_id} style={styles.orderItem}>
              <div style={styles.orderHeader}>
                <h2>เลขออเดอร์: {order.Order_id}</h2>
                <h2>โต๊ะที่: {order.tables_id}</h2>
              </div>
              <p>เวลาสั่ง: {new Date(order.Order_datetime).toLocaleString()}</p>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {order.details.map((item) => {
                  const itemDetails = getItemDetails(item);
                  return itemDetails ? (
                    <li key={item.Order_detail_id} style={styles.menuItem}>
                      <div>
                        <h1>{itemDetails.name}</h1>
                        <p>
                          จำนวน: {item.Order_detail_quantity}, ราคา: {itemDetails.price} บาท
                          
                          {item.Order_detail_additional && (
                            <>
                            
                          <br /><span style={{ color: 'red' }}>เพิ่มเติม: {item.Order_detail_additional}</span> </>
                          )}
                          <br />
                          รับกลับบ้าน: {item.Order_detail_takehome ? 'ใช่' : 'ไม่'}
                        </p>
                      </div>
                      <button
                        onClick={() => handleUpdateStatus(item.Order_detail_id)}
                        style={styles.updateButton}
                      >
                        {item.Order_detail_status}
                      </button>
                    </li>
                  ) : null;
                })}
              </ul>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button
                onClick={() => handleUpdateAllStatus(order.Order_id)}
                style={{
                  width: '100%', padding: '0.75rem', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '0.25rem', cursor: 'pointer', marginTop: '1rem'
                }}
              >
                อัปเดตสถานะทั้งหมด
              </button>
            </div>
            </div>
          ))
        )}
      </div>

      {openDialog && (
        <div style={styles.dialog}>
          <div style={styles.dialogContent}>
            <h2>ยืนยันการอัปเดตสถานะ</h2>
            <p>คุณต้องการอัปเดตสถานะเป็น "เสิร์ฟแล้ว" ใช่หรือไม่?</p>
            <div style={styles.dialogButtons}>
              <button onClick={() => setOpenDialog(false)} style={{ marginRight: '0.5rem', padding: '0.5rem 1rem' }}>ยกเลิก</button>
              <button onClick={confirmUpdate} style={{ ...styles.updateButton, padding: '0.5rem 1rem' }}>
                ยืนยัน
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderDisplay;