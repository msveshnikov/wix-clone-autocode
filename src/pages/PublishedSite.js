import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPublishedSite } from '../slices/publishedSiteSlice';
import styled from 'styled-components';

const PublishedSiteContainer = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
`;

const PublishedSite = () => {
    const { siteId } = useParams();
    const dispatch = useDispatch();
    const { site, loading, error } = useSelector((state) => state.publishedSite);
    const [renderedContent, setRenderedContent] = useState('');

    useEffect(() => {
        dispatch(fetchPublishedSite(siteId));
    }, [dispatch, siteId]);

    useEffect(() => {
        if (site && site.content) {
            setRenderedContent(renderSiteContent(site.content));
        }
    }, [site]);

    const renderSiteContent = (content) => {
        // This is a placeholder function. In a real implementation,
        // you would parse the site content and render it accordingly.
        return <div dangerouslySetInnerHTML={{ __html: content }} />;
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <PublishedSiteContainer>
            <h1>{site.title}</h1>
            {renderedContent}
        </PublishedSiteContainer>
    );
};

export default PublishedSite;
