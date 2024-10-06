import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbarow } from "../owner/Navbarowcomponent/navbarow/index-ow";

const styles = {
  orderPage: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    width: '100%',
  },
  orderContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1rem',
    padding: '1rem',
    marginTop: '20px',
    width: '95%',
    maxWidth: '1200px',
    margin: '20px auto',
  },
  orderItem: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    textDecoration: 'none',
    color: 'inherit',
  },
  orderInfo: {
    flex: 1,
    padding: '0.5rem',
  },
  orderInfoH3: {
    margin: 0,
    fontSize: '1rem',
  },
  orderInfoP: {
    margin: '0.5rem 0 0',
    fontSize: '0.9rem',
    color: '#666',
  },
  '@media (max-width: 600px)': {
    orderItem: {
      flexDirection: 'column',
    },
  },
};

function OrderDisplay() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:3333/getpreparingorders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      } else {
        console.error('Failed to fetch preparing orders');
      }
    } catch (error) {
      console.error('Error fetching preparing orders:', error);
    }
  };

  return (
    <div style={styles.orderPage}>
      <Navbarow />
      <h2 style={{ textAlign: 'center', margin: '20px 0' }}>รายการออเดอร์ที่กำลังจัดเตรียม</h2>
      {orders.length === 0 ? (
        <p style={{ textAlign: 'center' }}>ไม่มีรายการออเดอร์ที่กำลังจัดเตรียม</p>
      ) : (
        <div style={styles.orderContainer}>
          {orders.map((order) => (
            <Link to={`/Orderdetail/${order.Order_id}`} key={order.Order_id} style={styles.orderItem}>
              <div style={styles.orderInfo}>
                <h3 style={styles.orderInfoH3}>เลขออเดอร์: {order.Order_id}</h3>
                <p style={styles.orderInfoP}>โต๊ะที่: {order.Table_id}</p>
                <p style={styles.orderInfoP}>เวลาสั่ง: {new Date(order.Order_datetime).toLocaleString()}</p>
                <p style={styles.orderInfoP}>สถานะ: กำลังจัดเตรียม</p>
                <p style={styles.orderInfoP}>จำนวนรายการ: {order.preparing_items}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrderDisplay;