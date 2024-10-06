import React from "react";
import { useMediaQuery } from "react-responsive";
import styled from "styled-components";
import { Logo } from "../logo";
import { Accessibility } from "./accessibilityem";
import { NavLinks } from "./navLinks";
import { DeviceSize } from "../responsive";
import { MobileNavLinks } from "./mobileNavLinks-em";

const NavbarContainer = styled.div`
  width: 100%;
  height: 60px;
  box-shadow: 0 1px 3px rgba(15, 15, 15, 0.13);
  display: flex;
  align-items: center;
  padding: 0 1.5em;
  box-sizing: border-box;
  overflow-x:hidden
`;

const LeftSection = styled.div`
  display: flex;
  align-items : center;
`;

const MiddleSection = styled.div`
  display: flex;
  flex: 2;
  height: 100%;
  justify-content: center;
  @media(max-width: 768px){
    display:none
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
`;

export function Navbarem(props) {
  const isMobile = useMediaQuery({ maxWidth: DeviceSize.mobile });

  return (
    <NavbarContainer>
       <LeftSection>
        
        {!isMobile && <NavLinks />}
        {isMobile && <MobileNavLinks />}
      </LeftSection> 
      <MiddleSection></MiddleSection> 
      <RightSection>
        <Logo />
        {!isMobile && <Accessibility />}
      </RightSection>
    </NavbarContainer>
  );
}
