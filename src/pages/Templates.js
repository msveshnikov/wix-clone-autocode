import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { fetchTemplates, selectTemplate } from '../slices/templateSlice';

const TemplatesContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    padding: 20px;
`;

const TemplateCard = styled.div`
    width: 300px;
    margin: 20px;
    padding: 15px;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: transform 0.2s;

    &:hover {
        transform: scale(1.05);
    }
`;

const TemplateImage = styled.img`
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 4px;
`;

const TemplateTitle = styled.h3`
    margin-top: 10px;
    font-size: 18px;
`;

const TemplateDescription = styled.p`
    font-size: 14px;
    color: #666;
`;

const Templates = () => {
    const dispatch = useDispatch();
    const templates = useSelector((state) => state.template.templates);
    const loading = useSelector((state) => state.template.loading);
    const error = useSelector((state) => state.template.error);

    useEffect(() => {
        dispatch(fetchTemplates());
    }, [dispatch]);

    const handleTemplateSelect = (templateId) => {
        dispatch(selectTemplate(templateId));
    };

    if (loading) {
        return <div>Loading templates...</div>;
    }

    if (error) {
        return <div>Error loading templates: {error}</div>;
    }

    return (
        <TemplatesContainer>
            {templates.map((template) => (
                <TemplateCard key={template.id} onClick={() => handleTemplateSelect(template.id)}>
                    <TemplateImage src={template.imageUrl} alt={template.name} />
                    <TemplateTitle>{template.name}</TemplateTitle>
                    <TemplateDescription>{template.description}</TemplateDescription>
                </TemplateCard>
            ))}
        </TemplatesContainer>
    );
};

export default Templates;
