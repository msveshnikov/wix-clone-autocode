import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { updateWebsite } from '../slices/websiteSlice';
import { selectTemplates } from '../slices/templateSlice';
import Header from '../components/Header';
import Footer from '../components/Footer';

const BuilderContainer = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
`;

const BuilderContent = styled.div`
    display: flex;
    flex: 1;
`;

const ComponentLibrary = styled.div`
    width: 250px;
    background-color: #f0f0f0;
    padding: 20px;
    overflow-y: auto;
`;

const Canvas = styled.div`
    flex: 1;
    padding: 20px;
    background-color: #ffffff;
`;

const ComponentItem = styled.div`
    padding: 10px;
    margin-bottom: 10px;
    background-color: #ffffff;
    border: 1px solid #ddd;
    cursor: move;
`;

const CanvasItem = styled.div`
    padding: 10px;
    margin-bottom: 10px;
    background-color: #f9f9f9;
    border: 1px solid #ddd;
`;

const Builder = () => {
    const dispatch = useDispatch();
    const templates = useSelector(selectTemplates);
    const [components, setComponents] = useState([]);
    const [canvasItems, setCanvasItems] = useState([]);

    useEffect(() => {
        if (templates.length > 0) {
            setComponents(templates[0].components);
        }
    }, [templates]);

    const onDragEnd = (result) => {
        if (!result.destination) return;

        const { source, destination } = result;

        if (source.droppableId === 'componentLibrary' && destination.droppableId === 'canvas') {
            const draggedComponent = components[source.index];
            const newCanvasItem = { ...draggedComponent, id: `canvas-${Date.now()}` };
            const newCanvasItems = [...canvasItems];
            newCanvasItems.splice(destination.index, 0, newCanvasItem);
            setCanvasItems(newCanvasItems);
            dispatch(updateWebsite({ components: newCanvasItems }));
        } else if (source.droppableId === 'canvas' && destination.droppableId === 'canvas') {
            const newCanvasItems = Array.from(canvasItems);
            const [reorderedItem] = newCanvasItems.splice(source.index, 1);
            newCanvasItems.splice(destination.index, 0, reorderedItem);
            setCanvasItems(newCanvasItems);
            dispatch(updateWebsite({ components: newCanvasItems }));
        }
    };

    return (
        <BuilderContainer>
            <Header />
            <BuilderContent>
                <DragDropContext onDragEnd={onDragEnd}>
                    <ComponentLibrary>
                        <h2>Components</h2>
                        <Droppable droppableId="componentLibrary" isDropDisabled={true}>
                            {(provided) => (
                                <div {...provided.droppableProps} ref={provided.innerRef}>
                                    {components.map((component, index) => (
                                        <Draggable
                                            key={component.id}
                                            draggableId={component.id}
                                            index={index}
                                        >
                                            {(provided) => (
                                                <ComponentItem
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                >
                                                    {component.type}
                                                </ComponentItem>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </ComponentLibrary>
                    <Canvas>
                        <h2>Website Canvas</h2>
                        <Droppable droppableId="canvas">
                            {(provided) => (
                                <div {...provided.droppableProps} ref={provided.innerRef}>
                                    {canvasItems.map((item, index) => (
                                        <Draggable
                                            key={item.id}
                                            draggableId={item.id}
                                            index={index}
                                        >
                                            {(provided) => (
                                                <CanvasItem
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                >
                                                    {item.type}
                                                </CanvasItem>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </Canvas>
                </DragDropContext>
            </BuilderContent>
            <Footer />
        </BuilderContainer>
    );
};

export default Builder;
