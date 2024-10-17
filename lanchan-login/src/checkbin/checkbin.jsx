import React, { useState, useEffect } from 'react';
import { Navbarow } from '../owner/Navbarowcomponent/navbarow/index-ow';
import Promtpay  from '../assets/images/promtpay.jpg'
const OrderDisplay = () => {
  const [orders, setOrders] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [updatingItemId, setUpdatingItemId] = useState(null);
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [payingOrderId, setPayingOrderId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);

  const paymentDetails = {
    promptpay: {
      qrCode: Promtpay,
      phoneNumber: "099-999-9999"
    },
    banktransfer: {
      bankName: "ธนาคาร ABC",
      accountNumber: "123-4-56789-0",
      accountName: "บริษัท XYZ จำกัด"
    }
  };
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:3333/getserveoder');
      if (response.ok) {
        const data = await response.json();
        const ordersWithDetails = await Promise.all(data.map(async (order) => {
          const detailsResponse = await fetch(`http://localhost:3333/getorderdetail/${order.Order_id}`);
          const details = await detailsResponse.json();
          return { ...order, details: details.filter(item => item.Order_detail_status === "เสิร์ฟเเล้ว") };
        }));
        setOrders(ordersWithDetails);
      } else {
        console.error('Failed to fetch serving orders');
      }
    } catch (error) {
      console.error('Error fetching serving orders:', error);
    }
  };

  const handleUpdateStatus = (itemId) => {
    setUpdatingItemId(itemId);
    setOpenDialog(true);
    setPaymentMethod(null);
    setShowPaymentDetails(false);
  };

  const confirmUpdate = async () => {
    try {
      const response = await fetch(`http://localhost:3333/updateorderstatus/${updatingItemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: `ชำระเงินแล้ว(${paymentMethod})` }),
      });
  
      if (response.ok) {
        setOrders(prevOrders =>
          prevOrders.map(order => ({
            ...order,
            details: order.details.filter(item => item.Order_detail_id !== updatingItemId)
          })).filter(order => order.details.length > 0)
        );
        setOpenDialog(false);
        alert('อัปเดตสถานะเรียบร้อยแล้ว');
      } else {
        throw new Error('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('เกิดข้อผิดพลาดในการอัปเดตสถานะ');
    }
  };
  const handlePayment = (orderId) => {
    setPayingOrderId(orderId);
    setOpenPaymentDialog(true);
    setPaymentMethod('cash'); 
    setShowPaymentDetails(false);
  };

  const handlePaymentSelection = (method) => {
    setPaymentMethod(method);
    setShowPaymentDetails(true);
  };

  const handleClosePayment = () => {
    setOpenPaymentDialog(false);
    setPaymentMethod(null);
    setPayingOrderId(null);
    setShowPaymentDetails(false);
  };

  const calculateTotalPrice = (details) => {
    return details.reduce((total, item) => total + (item.Order_detail_price * item.Order_detail_quantity), 0);
  };

  const confirmPayment = async () => {
    try {
      // อัปเดตสถานะการชำระเงินของออเดอร์
      const orderResponse = await fetch(`http://localhost:3333/updateorderpayment/${payingOrderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentMethod }),
      });
  
      if (!orderResponse.ok) {
        throw new Error('Failed to update order payment status');
      }
  
      // อัปเดตสถานะของทุกรายการในออเดอร์
      const order = orders.find(o => o.Order_id === payingOrderId);
      if (order) {
        await Promise.all(order.details.map(item => 
          fetch(`http://localhost:3333/updateorderstatus/${item.Order_detail_id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: `ชำระเงินแล้ว(${paymentMethod})` }),
          })
        ));
  
        // อัปเดต state ของ orders
        setOrders(prevOrders => 
          prevOrders.filter(o => o.Order_id !== payingOrderId)
        );
  
        handleClosePayment();
        alert('ชำระเงินเรียบร้อยแล้ว');
      } else {
        throw new Error('Order not found');
      }
    } catch (error) {
      console.error('Error updating payment status:', error);
      alert('เกิดข้อผิดพลาดในการอัปเดตสถานะการชำระเงิน');
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <Navbarow />
      <h1 style={{ textAlign: 'center', marginBottom: '1rem' }}>ชำระเงิน</h1>
      {orders.length === 0 ? (
        <h2 style={{ textAlign: 'center' }}>ไม่มีรายการชำระ</h2>
      ) : (
        orders.map((order) => (
          <div key={order.Order_id} style={{ backgroundColor: 'white', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <h2>เลขออเดอร์: {order.Order_id}</h2>
              <h2>โต๊ะที่: {order.tables_id}</h2>
            </div>
            <p>เวลาสั่ง: {new Date(order.Order_datetime).toLocaleString()}</p>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {order.details.map((item) => (
                <li key={item.Order_detail_id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>
                  <div>
                    <strong>{item.Item_name}</strong>
                    <p>
                      จำนวน: {item.Order_detail_quantity}, ราคา: {item.Order_detail_price * item.Order_detail_quantity} บาท
                      {item.Order_detail_additional && (
                            <>
                            
                          <br /><span >เพิ่มเติม: {item.Order_detail_additional}</span> </>
                          )}
                      <br />
                      รับกลับบ้าน: {item.Order_detail_takehome ? 'ใช่' : 'ไม่'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleUpdateStatus(item.Order_detail_id)}
                    style={{ padding: '0.5rem 1rem', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '0.25rem', cursor: 'pointer' }}
                  >
                    ชำระเงิน
                  </button>
                </li>
              ))}
            </ul>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', borderTop: '2px solid #eee', paddingTop: '1rem' }}>
              <h3>ราคารวมทั้งหมด:</h3>
              <h3>{calculateTotalPrice(order.details).toFixed(2)} บาท</h3>
            </div>
            <button
              onClick={() => handlePayment(order.Order_id)}
              style={{ width: '100%', padding: '0.75rem', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '0.25rem', cursor: 'pointer', marginTop: '1rem' }}
            >
              ชำระรายการทั้งหมด
            </button>
          </div>
        ))
      )}

{openDialog && (
  <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '0.5rem', maxWidth: '400px', width: '100%' }}>
      <h2>เลือกวิธีการชำระเงิน</h2>
      <button 
        onClick={() => handlePaymentSelection('cash')} 
        style={{ display: 'block', width: '100%', padding: '0.5rem', marginBottom: '0.5rem', backgroundColor: paymentMethod === 'cash' ? '#4CAF50' : '#f0f0f0', color: paymentMethod === 'cash' ? 'white' : 'black' }}
      >
        เงินสด
      </button>
      <button 
        onClick={() => handlePaymentSelection('ชำระเงินเเล้ว(promptpay)')} 
        style={{ display: 'block', width: '100%', padding: '0.5rem', marginBottom: '0.5rem', backgroundColor: paymentMethod === 'promptpay' ? '#4CAF50' : '#f0f0f0', color: paymentMethod === 'promptpay' ? 'white' : 'black' }}
      >
        พร้อมเพย์
      </button>
      <button 
        onClick={() => handlePaymentSelection('ชำระเงินเเล้ว(banktransfer)')} 
        style={{ display: 'block', width: '100%', padding: '0.5rem', marginBottom: '0.5rem', backgroundColor: paymentMethod === 'banktransfer' ? '#4CAF50' : '#f0f0f0', color: paymentMethod === 'banktransfer' ? 'white' : 'black' }}
      >
        โอนธนาคาร
      </button>
      
      {showPaymentDetails && (
  <div style={{ marginTop: '1rem', border: '1px solid #ddd', padding: '1rem', borderRadius: '0.25rem' }}>
    {paymentMethod === 'promptpay' ? (
      <>
        <h3>QR Code พร้อมเพย์</h3>
        <img 
          src={paymentDetails.promptpay.qrCode} 
          alt="QR Code" 
          style={{ width: '100%', maxWidth: '200px', display: 'block', margin: '0 auto' }} 
        />
        <p>เบอร์โทรศัพท์: {paymentDetails.promptpay.phoneNumber}</p>
      </>
    ) : paymentMethod === 'banktransfer' ? (
      <>
        <h3>ข้อมูลบัญชีธนาคาร</h3>
        <p>ธนาคาร: {paymentDetails.banktransfer.bankName}</p>
        <p>เลขบัญชี: {paymentDetails.banktransfer.accountNumber}</p>
        <p>ชื่อบัญชี: {paymentDetails.banktransfer.accountName}</p>
      </>
    ) : null}
  </div>
)}
      
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
        <button onClick={() => setOpenDialog(false)} style={{ marginRight: '0.5rem', padding: '0.5rem 1rem' }}>ยกเลิก</button>
        <button 
          onClick={confirmUpdate} 
          style={{ 
            padding: '0.5rem 1rem', 
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none', 
            borderRadius: '0.25rem', 
            cursor: 'pointer'
          }}
        >
          ยืนยันการชำระเงิน
        </button>
      </div>
    </div>
  </div>
)}

{openPaymentDialog && (
  <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '0.5rem', maxWidth: '400px', width: '100%' }}>
      <h2>เลือกวิธีการชำระเงิน</h2>
      <button 
        onClick={() => handlePaymentSelection('cash')} 
        style={{ display: 'block', width: '100%', padding: '0.5rem', marginBottom: '0.5rem', backgroundColor: paymentMethod === 'cash' ? '#2196F3' : '#f0f0f0', color: paymentMethod === 'cash' ? 'white' : 'black' }}
      >
        เงินสด
      </button>
      <button 
        onClick={() => handlePaymentSelection('promptpay')} 
        style={{ display: 'block', width: '100%', padding: '0.5rem', marginBottom: '0.5rem', backgroundColor: paymentMethod === 'promptpay' ? '#2196F3' : '#f0f0f0', color: paymentMethod === 'promptpay' ? 'white' : 'black' }}
      >
        พร้อมเพย์
      </button>
      <button 
        onClick={() => handlePaymentSelection('banktransfer')} 
        style={{ display: 'block', width: '100%', padding: '0.5rem', marginBottom: '0.5rem', backgroundColor: paymentMethod === 'banktransfer' ? '#2196F3' : '#f0f0f0', color: paymentMethod === 'banktransfer' ? 'white' : 'black' }}
      >
        โอนธนาคาร
      </button>
      
      {showPaymentDetails && (
        <div style={{ marginTop: '1rem', border: '1px solid #ddd', padding: '1rem', borderRadius: '0.25rem' }}>
          {paymentMethod === 'promptpay' ? (
            <>
              <h3>QR Code พร้อมเพย์</h3>
              <img src={paymentDetails.promptpay.qrCode} alt="QR Code" style={{ width: '100%', maxWidth: '200px', display: 'block', margin: '0 auto' }} />
              <p>เบอร์โทรศัพท์: {paymentDetails.promptpay.phoneNumber}</p>
            </>
          ) : paymentMethod === 'banktransfer' ? (
            <>
              <h3>ข้อมูลบัญชีธนาคาร</h3>
              <p>ธนาคาร: {paymentDetails.banktransfer.bankName}</p>
              <p>เลขบัญชี: {paymentDetails.banktransfer.accountNumber}</p>
              <p>ชื่อบัญชี: {paymentDetails.banktransfer.accountName}</p>
            </>
          ) : null}
        </div>
      )}
      
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
        <button onClick={handleClosePayment} style={{ marginRight: '0.5rem', padding: '0.5rem 1rem' }}>ยกเลิก</button>
        <button 
          onClick={confirmPayment} 
          style={{ 
            padding: '0.5rem 1rem', 
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none', 
            borderRadius: '0.25rem', 
            cursor: 'pointer'
          }}
        >
          ยืนยันการชำระเงิน
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default OrderDisplay;
