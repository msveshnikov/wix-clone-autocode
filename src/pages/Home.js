import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

const HomeContainer = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
`;

const Hero = styled.div`
    text-align: center;
    margin-bottom: 3rem;
`;

const Title = styled.h1`
    font-size: 3rem;
    margin-bottom: 1rem;
`;

const Subtitle = styled.p`
    font-size: 1.5rem;
    color: #666;
`;

const FeatureGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
`;

const FeatureCard = styled.div`
    background-color: #f5f5f5;
    border-radius: 8px;
    padding: 1.5rem;
    text-align: center;
`;

const FeatureTitle = styled.h3`
    font-size: 1.2rem;
    margin-bottom: 1rem;
`;

const FeatureDescription = styled.p`
    font-size: 1rem;
    color: #666;
`;

const CTAButton = styled(Link)`
    display: inline-block;
    background-color: #0070f3;
    color: white;
    padding: 0.8rem 1.5rem;
    border-radius: 4px;
    text-decoration: none;
    font-weight: bold;
    margin-top: 2rem;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #0051bb;
    }
`;

const Home = () => {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    const features = [
        {
            title: 'Drag-and-Drop Builder',
            description: 'Create stunning websites with our intuitive drag-and-drop interface.'
        },
        {
            title: 'Responsive Templates',
            description:
                'Choose from a wide range of professionally designed, responsive templates.'
        },
        {
            title: 'E-commerce Integration',
            description: 'Set up your online store with powerful e-commerce tools.'
        },
        {
            title: 'SEO Optimization',
            description: "Improve your website's visibility with built-in SEO tools."
        },
        {
            title: 'Collaboration',
            description: 'Work together in real-time with team collaboration features.'
        },
        {
            title: 'Version Control',
            description: 'Keep track of changes and revert to previous versions easily.'
        }
    ];

    return (
        <HomeContainer>
            <Hero>
                <Title>Welcome to WiX Clone</Title>
                <Subtitle>Build beautiful websites with ease</Subtitle>
                {isAuthenticated ? (
                    <CTAButton to="/builder">Start Building</CTAButton>
                ) : (
                    <CTAButton to="/register">Get Started</CTAButton>
                )}
            </Hero>
            <FeatureGrid>
                {features.map((feature, index) => (
                    <FeatureCard key={index}>
                        <FeatureTitle>{feature.title}</FeatureTitle>
                        <FeatureDescription>{feature.description}</FeatureDescription>
                    </FeatureCard>
                ))}
            </FeatureGrid>
        </HomeContainer>
    );
};

export default Home;
