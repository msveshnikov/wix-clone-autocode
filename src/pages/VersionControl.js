import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchVersions, createVersion, restoreVersion } from '../slices/websiteSlice';
import styled from 'styled-components';

const VersionControlContainer = styled.div`
    padding: 20px;
`;

const VersionList = styled.ul`
    list-style-type: none;
    padding: 0;
`;

const VersionItem = styled.li`
    margin-bottom: 10px;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
`;

const Button = styled.button`
    margin-right: 10px;
    padding: 5px 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
        background-color: #0056b3;
    }
`;

const VersionControl = () => {
    const dispatch = useDispatch();
    const { versions, currentVersion } = useSelector((state) => state.website);
    const [selectedVersion, setSelectedVersion] = useState(null);

    useEffect(() => {
        dispatch(fetchVersions());
    }, [dispatch]);

    const handleCreateVersion = () => {
        dispatch(createVersion());
    };

    const handleRestoreVersion = () => {
        if (selectedVersion) {
            dispatch(restoreVersion(selectedVersion));
        }
    };

    return (
        <VersionControlContainer>
            <h1>Version Control</h1>
            <Button onClick={handleCreateVersion}>Create New Version</Button>
            <Button onClick={handleRestoreVersion} disabled={!selectedVersion}>
                Restore Selected Version
            </Button>
            <h2>Version History</h2>
            <VersionList>
                {versions.map((version) => (
                    <VersionItem key={version.id}>
                        <input
                            type="radio"
                            id={version.id}
                            name="version"
                            checked={selectedVersion === version.id}
                            onChange={() => setSelectedVersion(version.id)}
                        />
                        <label htmlFor={version.id}>
                            Version {version.id} - {new Date(version.createdAt).toLocaleString()}
                            {version.id === currentVersion && ' (Current)'}
                        </label>
                    </VersionItem>
                ))}
            </VersionList>
        </VersionControlContainer>
    );
};

export default VersionControl;
