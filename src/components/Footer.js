import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const FooterContainer = styled.footer`
    background-color: #f5f5f5;
    padding: 2rem 0;
    margin-top: 2rem;
`;

const FooterContent = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
`;

const FooterSection = styled.div`
    margin-bottom: 1rem;
`;

const FooterHeading = styled.h3`
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
`;

const FooterLink = styled(Link)`
    display: block;
    color: #333;
    text-decoration: none;
    margin-bottom: 0.25rem;
    &:hover {
        text-decoration: underline;
    }
`;

const Copyright = styled.p`
    text-align: center;
    margin-top: 2rem;
    font-size: 0.9rem;
    color: #666;
`;

const Footer = () => {
    return (
        <FooterContainer>
            <FooterContent>
                <FooterSection>
                    <FooterHeading>Features</FooterHeading>
                    <FooterLink to="/templates">Templates</FooterLink>
                    <FooterLink to="/builder">Website Builder</FooterLink>
                    <FooterLink to="/ecommerce">E-commerce</FooterLink>
                    <FooterLink to="/seo-tools">SEO Tools</FooterLink>
                </FooterSection>
                <FooterSection>
                    <FooterHeading>Company</FooterHeading>
                    <FooterLink to="/about">About Us</FooterLink>
                    <FooterLink to="/careers">Careers</FooterLink>
                    <FooterLink to="/contact">Contact</FooterLink>
                    <FooterLink to="/blog">Blog</FooterLink>
                </FooterSection>
                <FooterSection>
                    <FooterHeading>Support</FooterHeading>
                    <FooterLink to="/help-center">Help Center</FooterLink>
                    <FooterLink to="/faq">FAQ</FooterLink>
                    <FooterLink to="/community">Community</FooterLink>
                    <FooterLink to="/status">System Status</FooterLink>
                </FooterSection>
                <FooterSection>
                    <FooterHeading>Legal</FooterHeading>
                    <FooterLink to="/terms">Terms of Service</FooterLink>
                    <FooterLink to="/privacy">Privacy Policy</FooterLink>
                    <FooterLink to="/cookies">Cookie Policy</FooterLink>
                    <FooterLink to="/gdpr">GDPR</FooterLink>
                </FooterSection>
            </FooterContent>
            <Copyright>© {new Date().getFullYear()} WiX Clone. All rights reserved.</Copyright>
        </FooterContainer>
    );
};

export default Footer;
