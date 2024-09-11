import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { logout } from '../slices/authSlice';

const HeaderContainer = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background-color: #f8f9fa;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Logo = styled(Link)`
    font-size: 1.5rem;
    font-weight: bold;
    color: #333;
    text-decoration: none;
`;

const Nav = styled.nav`
    display: flex;
    gap: 1rem;
`;

const NavLink = styled(Link)`
    color: #333;
    text-decoration: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    transition: background-color 0.2s;

    &:hover {
        background-color: #e9ecef;
    }
`;

const Button = styled.button`
    background-color: #007bff;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
        background-color: #0056b3;
    }
`;

const Header = () => {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <HeaderContainer>
            <Logo to="/">WiX Clone</Logo>
            <Nav>
                <NavLink to="/templates">Templates</NavLink>
                <NavLink to="/builder">Builder</NavLink>
                {isAuthenticated && (
                    <>
                        <NavLink to="/ecommerce">E-commerce</NavLink>
                        <NavLink to="/seo-tools">SEO Tools</NavLink>
                        <NavLink to="/collaboration">Collaboration</NavLink>
                        <NavLink to="/version-control">Version Control</NavLink>
                        <NavLink to="/user-account">Account</NavLink>
                        <Button onClick={handleLogout}>Logout</Button>
                    </>
                )}
                {!isAuthenticated && (
                    <>
                        <NavLink to="/login">Login</NavLink>
                        <NavLink to="/register">Register</NavLink>
                    </>
                )}
            </Nav>
        </HeaderContainer>
    );
};

export default Header;
