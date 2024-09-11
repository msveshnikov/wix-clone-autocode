import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { fetchCollaborators, addCollaborator, removeCollaborator } from '../slices/websiteSlice';

const CollaborationContainer = styled.div`
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
`;

const CollaboratorList = styled.ul`
    list-style-type: none;
    padding: 0;
`;

const CollaboratorItem = styled.li`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #eee;
`;

const Button = styled.button`
    padding: 5px 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 3px;
    cursor: pointer;

    &:hover {
        background-color: #0056b3;
    }
`;

const Input = styled.input`
    padding: 5px;
    margin-right: 10px;
`;

const Collaboration = () => {
    const dispatch = useDispatch();
    const collaborators = useSelector((state) => state.website.collaborators);
    const [newCollaborator, setNewCollaborator] = useState('');

    useEffect(() => {
        dispatch(fetchCollaborators());
    }, [dispatch]);

    const handleAddCollaborator = () => {
        if (newCollaborator.trim()) {
            dispatch(addCollaborator(newCollaborator.trim()));
            setNewCollaborator('');
        }
    };

    const handleRemoveCollaborator = (collaboratorId) => {
        dispatch(removeCollaborator(collaboratorId));
    };

    return (
        <CollaborationContainer>
            <h1>Collaboration</h1>
            <div>
                <Input
                    type="email"
                    placeholder="Enter collaborator's email"
                    value={newCollaborator}
                    onChange={(e) => setNewCollaborator(e.target.value)}
                />
                <Button onClick={handleAddCollaborator}>Add Collaborator</Button>
            </div>
            <CollaboratorList>
                {collaborators.map((collaborator) => (
                    <CollaboratorItem key={collaborator.id}>
                        <span>{collaborator.email}</span>
                        <Button onClick={() => handleRemoveCollaborator(collaborator.id)}>
                            Remove
                        </Button>
                    </CollaboratorItem>
                ))}
            </CollaboratorList>
        </CollaborationContainer>
    );
};

export default Collaboration;
