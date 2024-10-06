import React, { useState } from "react";
import styled from "styled-components";
import { Accessibility } from "./accessibility-ow";
import { MenuToggle } from "./menuToggle-ow";

const NavLinksContainer = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
`;

const LinksWrapper = styled.ul`
  margin: 0;
  padding: 20px 0; // เพิ่มพื้นที่ว่างด้านบนและล่าง
  display: flex;
  height: 100vh;
  width: 80%; // เพิ่มความกว้างของเมนู
  list-style: none;
  background-color: #fff;
  flex-direction: column;
  position: fixed;
  top: 60px;
  left: ${({ isOpen }) => (isOpen ? "0" : "-100%")};
  transition: left 0.3s ease-in-out;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  overflow-y: auto;
`;

const LinkItem = styled.li`
  width: 100%;
  padding: 0;
  margin-bottom: 5px; // เพิ่มระยะห่างระหว่างรายการ
`;

const Link = styled.a`
  text-decoration: none;
  color: #333; // สีเข้มขึ้นเล็กน้อยเพื่อความชัดเจน
  font-size: 18px; // เพิ่มขนาดตัวอักษร
  font-weight: 700;
  display: block;
  width: 100%;
  padding: 15px 25px; // เพิ่มพื้นที่คลิกและระยะห่างจากขอบ
  transition: all 0.3s ease;

  &:hover, &:focus {
    background-color: #f0f0f0;
    padding-left: 30px; // เลื่อนข้อความเล็กน้อยเมื่อ hover
  }

  &:active {
    background-color: #e0e0e0;
  }
`;

const Marginer = styled.div`
  height: 3em; // เพิ่มพื้นที่ว่างก่อน Accessibility
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${({ isOpen }) => (isOpen ? "block" : "none")};
  z-index: 999;
`;

const AccessibilityWrapper = styled.div`
  padding: 0 25px; // ให้สอดคล้องกับ padding ของ Link
`;

export function MobileNavLinks(props) {
  const [isOpen, setOpen] = useState(false);

  return (
    <NavLinksContainer>
      <MenuToggle isOpen={isOpen} toggle={() => setOpen(!isOpen)} />
      <Overlay isOpen={isOpen} onClick={() => setOpen(false)} />
      <LinksWrapper isOpen={isOpen}>
        <LinkItem><Link href="#">หน้าหลัก</Link></LinkItem>
        <LinkItem><Link href="./history">ประวัติออเดอร์</Link></LinkItem>
        <LinkItem><Link href="checkbin">ชำระเงิน</Link></LinkItem>
        <LinkItem><Link href="./order">ดูรายการอาหารที่สั่ง</Link></LinkItem>
        <LinkItem><Link href="/serve">ดูรายการอาหารที่ทำเสร็จแล้ว</Link></LinkItem>
        <LinkItem><Link href="./dashborad/Dashboard">รายงาน</Link></LinkItem>
        <LinkItem><Link href="./menupage">รายการอาหาร</Link></LinkItem>
        <LinkItem><Link href="#">Association</Link></LinkItem>
        <LinkItem><Link href="./employee">พนักงาน</Link></LinkItem>
        <LinkItem><Link href="/table">โต๊ะ</Link></LinkItem>
        <Marginer />
        <AccessibilityWrapper>
          <Accessibility />
        </AccessibilityWrapper>
      </LinksWrapper>
    </NavLinksContainer>
  );
}