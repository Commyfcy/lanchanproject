import React, { useState } from 'react';
import { Navbarow } from "../owner/Navbarowcomponent/navbarow/index-ow"

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import styled from '@emotion/styled';

import promptpayImage from '../assets/images/promtpay.jpg';

const StyledDialogContent = styled(DialogContent)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
`;

const StyledImage = styled.img`
  width: 100%;
  height: auto;
  max-height: 80vh;
  object-fit: contain;
`;

function SelecCheck() {
    const [open, setOpen] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState(null);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setPaymentMethod(null);
    };

    const handlePaymentSelection = (method) => {
        setPaymentMethod(method);
    };


    const bankAccountInfo = {
        accountNumber: "123-4xxxxxxx",
        accountName: "xxx88xxxxx",
        bankName: "ธนาคาร xxx"
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '5px' }}>
            <Button variant="contained" style={{ width: '300px' }} onClick={handleClickOpen}>
                เลือกวิธีชำระเงิน
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>เลือกวิธีการชำระเงิน</DialogTitle>
                <DialogContent>
                    <Button onClick={() => handlePaymentSelection('promptpay')}>พร้อมเพย์</Button>
                    <Button onClick={() => handlePaymentSelection('banktransfer')}>โอนธนาคาร</Button>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>ยกเลิก</Button>
                </DialogActions>
            </Dialog>
            {paymentMethod === 'promptpay' && (
                <Dialog
                    open={true}
                    onClose={handleClose}
                    maxWidth="md"
                    fullWidth
                >
                    <StyledDialogContent>
                        <StyledImage src={promptpayImage} alt="PromptPay QR" />
                    </StyledDialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>ปิด</Button>
                    </DialogActions>
                </Dialog>
            )}
            {paymentMethod === 'banktransfer' && (
                <Dialog
                    open={true}
                    onClose={handleClose}
                    maxWidth="sm"
                    fullWidth
                >
                    
                    <DialogContent>
                        <div style={{ textAlign: 'center', padding: '20px' }}>
                            <h3>{bankAccountInfo.bankName}</h3>
                            <p>เลขบัญชี: {bankAccountInfo.accountNumber}</p>
                            <p>ชื่อบัญชี: {bankAccountInfo.accountName}</p>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>ปิด</Button>
                    </DialogActions>
                </Dialog>
            )}
        </div>
    );
}

function Payment() {
    return (
        <div>
            <Navbarow />
            <SelecCheck />
        </div>
    );
}

export default Payment;