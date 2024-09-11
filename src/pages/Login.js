import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { login } from '../slices/authSlice';

const LoginContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background-color: #f5f5f5;
`;

const LoginForm = styled(Form)`
    background-color: #ffffff;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
`;

const Title = styled.h2`
    text-align: center;
    margin-bottom: 1.5rem;
`;

const InputField = styled(Field)`
    width: 100%;
    padding: 0.5rem;
    margin-bottom: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
`;

const ErrorText = styled.div`
    color: red;
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
`;

const SubmitButton = styled.button`
    width: 100%;
    padding: 0.75rem;
    background-color: #0070f3;
    color: #ffffff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
        background-color: #0051a2;
    }
`;

const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().required('Required')
});

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loginError, setLoginError] = useState(null);

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            await dispatch(login(values)).unwrap();
            navigate('/');
        } catch (error) {
            setLoginError('Invalid email or password');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <LoginContainer>
            <LoginForm>
                <Title>Login</Title>
                <Formik
                    initialValues={{ email: '', password: '' }}
                    validationSchema={LoginSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting }) => (
                        <>
                            <InputField type="email" name="email" placeholder="Email" />
                            <ErrorMessage name="email" component={ErrorText} />

                            <InputField type="password" name="password" placeholder="Password" />
                            <ErrorMessage name="password" component={ErrorText} />

                            {loginError && <ErrorText>{loginError}</ErrorText>}

                            <SubmitButton type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Logging in...' : 'Login'}
                            </SubmitButton>
                        </>
                    )}
                </Formik>
            </LoginForm>
        </LoginContainer>
    );
};

export default Login;
