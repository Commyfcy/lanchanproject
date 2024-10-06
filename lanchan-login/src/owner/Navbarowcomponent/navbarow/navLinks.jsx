import React from "react";
import styled from "styled-components";

const NavLinksContainer = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
`;

const LinksWrapper = styled.ul`
  margin: 0;
  padding: 0;
  display: flex;
  height: 100%;
  list-style: none;
  flex-wrap: wrap: 
  justify-content: center;

`;

const LinkItem = styled.li`
  height: 100%;
  padding: 0 1.1em;
  color: #222;
  font-weight: 500;
  font-size: 14px;
  align-items: center;
  justify-content: center;
  display: flex;
  white-space: flex;
  border-top: 2px solid transparent;
  transition: all 220ms ease-in-out;

  &:hover {
    border-top: 2px solid #2ecc71;
  }
`;

const Link = styled.a`
  text-decoration: none;
  color: inherit;
  font-size: inherit;
`;

export function NavLinks(props) {
  return (
    <NavLinksContainer>
      <LinksWrapper>
        <LinkItem>
          <Link href="#">หน้าหลัก</Link>
        </LinkItem>
        <LinkItem>
          <Link href="./history">ประวัติออเดอร์</Link>
        </LinkItem>
        <LinkItem>
            <Link href="checkbin">ชำระเงิน</Link>
          </LinkItem>
          <LinkItem>
            <Link href="./order">ดูรายการอาหารที่สั่ง</Link>
          </LinkItem>
          <LinkItem>
            <Link href="/serve">ดูรายการอาหารที่ทำเสร็จเเล้ว</Link>
          </LinkItem>
        <LinkItem>
          <Link href="./dashborad/Dashboard">รายงาน</Link>
        </LinkItem>
        <LinkItem>
          <Link href="./menupage">รายการอาหาร</Link>
        </LinkItem>
        <LinkItem>
          <Link href="#">Association</Link>
        </LinkItem>

        <LinkItem>
            <Link href="./employee">โต๊ะ</Link>
          </LinkItem>
      </LinksWrapper>
    </NavLinksContainer>
  );
}
