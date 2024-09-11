import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts, addProduct, updateProduct, deleteProduct } from '../slices/ecommerceSlice';
import styled from 'styled-components';

const EcommerceContainer = styled.div`
    padding: 20px;
`;

const ProductList = styled.ul`
    list-style-type: none;
    padding: 0;
`;

const ProductItem = styled.li`
    border: 1px solid #ddd;
    margin-bottom: 10px;
    padding: 10px;
`;

const ProductForm = styled.form`
    display: flex;
    flex-direction: column;
    max-width: 300px;
    margin-top: 20px;
`;

const FormInput = styled.input`
    margin-bottom: 10px;
    padding: 5px;
`;

const FormButton = styled.button`
    padding: 5px 10px;
    background-color: #007bff;
    color: white;
    border: none;
    cursor: pointer;
`;

const Ecommerce = () => {
    const dispatch = useDispatch();
    const { products, loading, error } = useSelector((state) => state.ecommerce);
    const [newProduct, setNewProduct] = useState({ name: '', price: '', description: '' });

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    const handleInputChange = (e) => {
        setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(addProduct(newProduct));
        setNewProduct({ name: '', price: '', description: '' });
    };

    const handleUpdate = (id, updatedProduct) => {
        dispatch(updateProduct({ id, product: updatedProduct }));
    };

    const handleDelete = (id) => {
        dispatch(deleteProduct(id));
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <EcommerceContainer>
            <h1>E-commerce Management</h1>
            <ProductList>
                {products.map((product) => (
                    <ProductItem key={product.id}>
                        <h3>{product.name}</h3>
                        <p>Price: ${product.price}</p>
                        <p>{product.description}</p>
                        <FormButton
                            onClick={() =>
                                handleUpdate(product.id, { ...product, price: product.price + 1 })
                            }
                        >
                            Increase Price
                        </FormButton>
                        <FormButton onClick={() => handleDelete(product.id)}>Delete</FormButton>
                    </ProductItem>
                ))}
            </ProductList>
            <ProductForm onSubmit={handleSubmit}>
                <h2>Add New Product</h2>
                <FormInput
                    type="text"
                    name="name"
                    value={newProduct.name}
                    onChange={handleInputChange}
                    placeholder="Product Name"
                    required
                />
                <FormInput
                    type="number"
                    name="price"
                    value={newProduct.price}
                    onChange={handleInputChange}
                    placeholder="Price"
                    required
                />
                <FormInput
                    type="text"
                    name="description"
                    value={newProduct.description}
                    onChange={handleInputChange}
                    placeholder="Description"
                    required
                />
                <FormButton type="submit">Add Product</FormButton>
            </ProductForm>
        </EcommerceContainer>
    );
};

export default Ecommerce;
