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
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1rem',
    padding: '1rem',
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
    padding: '1rem',
  },
  orderInfoH3: {
    margin: '0 0 0.5rem 0',
    fontSize: '1.1rem',
    color: '#333',
  },
  orderInfoP: {
    margin: '0.25rem 0',
    fontSize: '0.9rem',
    color: '#666',
  },
  '@media (max-width: 600px)': {
    orderContainer: {
      gridTemplateColumns: '1fr',
    },
  },
};
function OrderServe() {
    const [orders, setOrders] = useState([]);
  
    useEffect(() => {
      fetchPartiallyServedOrders();
    }, []);
  
    const fetchPartiallyServedOrders = async () => {
      try {
        const response = await fetch('http://localhost:3333/getpartiallyservedorders');
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        } else {
          console.error('Failed to fetch partially served orders');
        }
      } catch (error) {
        console.error('Error fetching partially served orders:', error);
      }
    };
  
    return (
      <div style={styles.orderPage}>
        <Navbarow />
        <h2 style={{ textAlign: 'center', margin: '20px 0' }}>รายการออเดอร์ที่มีอาหารพร้อมเสิร์ฟ</h2>
        {orders.length === 0 ? (
          <p style={{ textAlign: 'center' }}>ไม่มีรายการออเดอร์ที่มีอาหารพร้อมเสิร์ฟ</p>
        ) : (
          <div style={styles.orderContainer}>
            {orders.map((order) => (
              <Link to={`/servedetail/${order.Order_id}`} key={order.Order_id} style={styles.orderItem}>
                <div style={styles.orderInfo}>
                  <h3 style={styles.orderInfoH3}>เลขออเดอร์: {order.Order_id}</h3>
                  <p style={styles.orderInfoP}>โต๊ะที่: {order.Table_id}</p>
                  <p style={styles.orderInfoP}>เวลาสั่ง: {new Date(order.Order_datetime).toLocaleString()}</p>
                  <p style={styles.orderInfoP}>สถานะ: มีอาหารพร้อมเสิร์ฟบางส่วน</p>
                  <p style={styles.orderInfoP}>รายการพร้อมเสิร์ฟ: {order.served_items}/{order.total_items}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }
  
  export default OrderServe;