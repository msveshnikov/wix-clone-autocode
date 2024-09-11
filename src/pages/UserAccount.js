import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateUser, deleteUser } from '../slices/userSlice';
import styled from 'styled-components';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const UserAccountContainer = styled.div`
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
`;

const StyledForm = styled(Form)`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const StyledField = styled(Field)`
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
`;

const StyledErrorMessage = styled(ErrorMessage)`
    color: red;
    font-size: 14px;
`;

const Button = styled.button`
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
        background-color: #0056b3;
    }
`;

const DeleteButton = styled(Button)`
    background-color: #dc3545;

    &:hover {
        background-color: #c82333;
    }
`;

const UserAccount = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.currentUser);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        // Fetch user data if not already in the store
        if (!user) {
            // Implement fetching user data from the backend
        }
    }, [user]);

    const handleUpdateUser = async (values) => {
        try {
            await dispatch(updateUser(values)).unwrap();
            setIsEditing(false);
        } catch (error) {
            console.error('Failed to update user:', error);
        }
    };

    const handleDeleteAccount = async () => {
        if (
            window.confirm(
                'Are you sure you want to delete your account? This action cannot be undone.'
            )
        ) {
            try {
                await dispatch(deleteUser()).unwrap();
                // Redirect to home page or login page after successful deletion
            } catch (error) {
                console.error('Failed to delete account:', error);
            }
        }
    };

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        email: Yup.string().email('Invalid email').required('Email is required'),
        password: Yup.string().min(6, 'Password must be at least 6 characters'),
        confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match')
    });

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <UserAccountContainer>
            <h1>User Account</h1>
            {isEditing ? (
                <Formik
                    initialValues={{
                        name: user.name,
                        email: user.email,
                        password: '',
                        confirmPassword: ''
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleUpdateUser}
                >
                    {({ isSubmitting }) => (
                        <StyledForm>
                            <div>
                                <StyledField type="text" name="name" placeholder="Name" />
                                <StyledErrorMessage name="name" component="div" />
                            </div>
                            <div>
                                <StyledField type="email" name="email" placeholder="Email" />
                                <StyledErrorMessage name="email" component="div" />
                            </div>
                            <div>
                                <StyledField
                                    type="password"
                                    name="password"
                                    placeholder="New Password (optional)"
                                />
                                <StyledErrorMessage name="password" component="div" />
                            </div>
                            <div>
                                <StyledField
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Confirm New Password"
                                />
                                <StyledErrorMessage name="confirmPassword" component="div" />
                            </div>
                            <Button type="submit" disabled={isSubmitting}>
                                Save Changes
                            </Button>
                            <Button type="button" onClick={() => setIsEditing(false)}>
                                Cancel
                            </Button>
                        </StyledForm>
                    )}
                </Formik>
            ) : (
                <div>
                    <p>Name: {user.name}</p>
                    <p>Email: {user.email}</p>
                    <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                </div>
            )}
            <DeleteButton onClick={handleDeleteAccount}>Delete Account</DeleteButton>
        </UserAccountContainer>
    );
};

export default UserAccount;
