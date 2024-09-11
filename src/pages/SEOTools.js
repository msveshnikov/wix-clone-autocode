import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { updateSEO } from '../slices/websiteSlice';

const SEOToolsContainer = styled.div`
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
`;

const Title = styled.h1`
    font-size: 24px;
    margin-bottom: 20px;
`;

const StyledForm = styled(Form)`
    display: flex;
    flex-direction: column;
`;

const FormGroup = styled.div`
    margin-bottom: 20px;
`;

const Label = styled.label`
    font-weight: bold;
    margin-bottom: 5px;
`;

const Input = styled(Field)`
    width: 100%;
    padding: 8px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
`;

const TextArea = styled(Field)`
    width: 100%;
    padding: 8px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
    min-height: 100px;
`;

const Button = styled.button`
    background-color: #0070f3;
    color: white;
    padding: 10px 20px;
    font-size: 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
        background-color: #0051bb;
    }
`;

const ErrorMessage = styled.div`
    color: red;
    font-size: 14px;
    margin-top: 5px;
`;

const SEOSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    keywords: Yup.string().required('Keywords are required')
});

const SEOTools = () => {
    const dispatch = useDispatch();
    const website = useSelector((state) => state.website);
    const [initialValues, setInitialValues] = useState({
        title: '',
        description: '',
        keywords: ''
    });

    useEffect(() => {
        if (website.seo) {
            setInitialValues({
                title: website.seo.title || '',
                description: website.seo.description || '',
                keywords: website.seo.keywords || ''
            });
        }
    }, [website.seo]);

    const handleSubmit = (values, { setSubmitting }) => {
        dispatch(updateSEO(values));
        setSubmitting(false);
    };

    return (
        <SEOToolsContainer>
            <Title>SEO Tools</Title>
            <Formik
                initialValues={initialValues}
                validationSchema={SEOSchema}
                onSubmit={handleSubmit}
                enableReinitialize
            >
                {({ errors, touched, isSubmitting }) => (
                    <StyledForm>
                        <FormGroup>
                            <Label htmlFor="title">Title</Label>
                            <Input type="text" id="title" name="title" />
                            {errors.title && touched.title && (
                                <ErrorMessage>{errors.title}</ErrorMessage>
                            )}
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="description">Description</Label>
                            <TextArea component="textarea" id="description" name="description" />
                            {errors.description && touched.description && (
                                <ErrorMessage>{errors.description}</ErrorMessage>
                            )}
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="keywords">Keywords</Label>
                            <Input type="text" id="keywords" name="keywords" />
                            {errors.keywords && touched.keywords && (
                                <ErrorMessage>{errors.keywords}</ErrorMessage>
                            )}
                        </FormGroup>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Updating...' : 'Update SEO'}
                        </Button>
                    </StyledForm>
                )}
            </Formik>
        </SEOToolsContainer>
    );
};

export default SEOTools;
