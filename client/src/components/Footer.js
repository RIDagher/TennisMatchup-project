import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <FooterContainer>
      <Section>
        <SectionTitle>About Us</SectionTitle>
        <Description>
          Welcome to TennisMatchup, servicing tennis enthusiasts help find
          tennis partners. Search tennis partners by location and skill level.
          Get in the game and join now - it's FREE.
        </Description>
      </Section>

      <Section>
        <SectionTitle>
          <StyledLink to="/contact">Contact Us</StyledLink>
        </SectionTitle>
      </Section>

      <BottomSection>
        <AppName>TennisMatchup</AppName>
        <Copyright>
          © {new Date().getFullYear()} TennisMatchup. All rights reserved.
        </Copyright>
      </BottomSection>
    </FooterContainer>
  );
};

const FooterContainer = styled.footer`
  background-color: #f8f8f8;
  padding: 20px 30px;
  width: 100%; /* Ensure it takes the full width */
  /* No need for fixed positioning now */
`;

const Section = styled.div`
  width: 100%;
  padding: 10px;
  text-align: center; // Centered the text
`;

const SectionTitle = styled.h2`
  font-size: 20px; // Reduced font size
  margin-bottom: 8px;
  text-transform: uppercase; // Made the text uppercase
`;

const Description = styled.p`
  font-size: 12px;
  max-width: 600px;
  margin: 0 auto; // Centered the description
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  transition: color 0.2s;

  &:hover {
    color: #555;
  }
`;

const BottomSection = styled.div`
  width: 100%;
  padding: 10px; // Reduced padding
  text-align: center; // Centered the text
  border-top: 1px solid #ddd;
  margin-top: 20px;
`;

const AppName = styled.h1`
  font-size: 24px; // Reduced font size
  margin: 8px 0;
`;

const Copyright = styled.p`
  font-size: 12px;
  color: #777;
`;

export default Footer;
