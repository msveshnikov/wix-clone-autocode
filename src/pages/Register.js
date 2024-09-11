import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../slices/authSlice';
import styled from 'styled-components';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const RegisterContainer = styled.div`
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
`;

const StyledForm = styled(Form)`
    display: flex;
    flex-direction: column;
`;

const StyledField = styled(Field)`
    margin-bottom: 10px;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
`;

const StyledErrorMessage = styled(ErrorMessage)`
    color: red;
    font-size: 0.8em;
    margin-bottom: 10px;
`;

const SubmitButton = styled.button`
    background-color: #4caf50;
    color: white;
    padding: 10px;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
        background-color: #45a049;
    }
`;

const RegisterSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm Password is required')
});

const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            await dispatch(registerUser(values)).unwrap();
            navigate('/login');
        } catch (err) {
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <RegisterContainer>
            <h2>Register</h2>
            <Formik
                initialValues={{ username: '', email: '', password: '', confirmPassword: '' }}
                validationSchema={RegisterSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting }) => (
                    <StyledForm>
                        <StyledField type="text" name="username" placeholder="Username" />
                        <StyledErrorMessage name="username" component="div" />

                        <StyledField type="email" name="email" placeholder="Email" />
                        <StyledErrorMessage name="email" component="div" />

                        <StyledField type="password" name="password" placeholder="Password" />
                        <StyledErrorMessage name="password" component="div" />

                        <StyledField
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                        />
                        <StyledErrorMessage name="confirmPassword" component="div" />

                        {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

                        <SubmitButton type="submit" disabled={isSubmitting}>
                            Register
                        </SubmitButton>
                    </StyledForm>
                )}
            </Formik>
        </RegisterContainer>
    );
};

export default Register;
