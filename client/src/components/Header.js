import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';

const Header = () => {
  const [navOpen, setNavOpen] = useState(false);
  const { isAuthenticated, userDetails, setIsAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <Wrapper>
      <NavBar>
        <Hamburger onClick={() => setNavOpen(!navOpen)}>
          {navOpen ? (
            <FiX size={32} color="#009fdb" />
          ) : (
            <FiMenu size={36} color="#009fdb" />
          )}
        </Hamburger>
      </NavBar>

      {navOpen && (
        <Nav>
          {!isAuthenticated ? (
            <>
              <StyledLink to="/login">Login</StyledLink>
              <StyledLink to="/register">Signup</StyledLink>
            </>
          ) : (
            <>
              <Button onClick={() => navigate('/update-profile')}>
                Update Profile
              </Button>
              <Button onClick={handleLogout}>Logout</Button>
            </>
          )}
          <StyledLink to="/homepage">Homepage</StyledLink>
          <StyledLink to="/playersPage">Players</StyledLink>
          <StyledLink to="/courtsPage">Courts</StyledLink>
          <StyledLink to="/matchBoard">MatchBoard</StyledLink>
        </Nav>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div``;

const Hamburger = styled.button`
  color: #762e90;
  background: none;
  border: none;
  cursor: pointer;
  color: white;
  outline: none;
  position: fixed;
  left: 20px;
  margin-top: 10px;
  z-index: 2000; // Value higher than Nav z-index
`;

const SiteTitle = styled.h1`
  flex: 1;
  text-align: center;
  color: white;
  font-size: 24px;
  margin: 0;
`;

const NavBar = styled.div`
  z-index: 1000;
  position: relative;
`;

const Nav = styled.nav`
  z-index: 10; //

  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 200px;
  background-color: rgba(0, 0, 0, 0.9);
  transform: translateX(0);
  transition: transform 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 60px;
`;

const Button = styled.button`
  width: 100%;
  padding: 7px 10px;

  cursor: pointer;

  &:hover {
    background-color: #555;
  }
`;

const StyledLink = styled(Link)`
  width: 100%;
  text-align: center;
  text-decoration: none;
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  margin-bottom: 20px;

  &:hover {
    background-color: #555;
  }
`;

export default Header;
