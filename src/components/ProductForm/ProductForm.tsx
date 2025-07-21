import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
} from '@mui/material';
import { FormContainer } from './ProductForm.styles';
import { api } from '../../services/api';
import { Product } from '../../types/Product';

interface Props {
    onProductCreated: () => void;
    productToEdit?: Product;
}

export const ProductForm: React.FC<Props> = ({ onProductCreated, productToEdit }) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState<number | ''>('');
    const [sku, setSku] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (productToEdit) {
            setName(productToEdit.name);
            setPrice(productToEdit.price);
            setSku(productToEdit.sku);
        } else {
            setName('');
            setPrice('');
            setSku('');
        }
    }, [productToEdit]);

    const validate = () => {
        if (!name.trim()) return 'Name is required.';
        if (!sku.trim()) return 'SKU is required.';
        if (price === '' || price <= 0) return 'Price must be greater than 0.';
        return '';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            if (productToEdit?.id) {
                await api.put(`/products/${productToEdit.id}`, {
                    name,
                    price,
                    sku,
                });
            } else {
                await api.post('/products', {
                    name,
                    price,
                    sku,
                });
            }

            onProductCreated();
            setError('');
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Something went wrong');
        }
    };

    return (
        <FormContainer onSubmit={handleSubmit}>
            <TextField
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                required
                margin="dense"
            />
            <TextField
                label="Price"
                type="number"
                inputProps={{ step: '0.01', min: '0' }}
                value={price}
                onChange={(e) => {
                    const value = e.target.value;
                    setPrice(value === '' ? '' : parseFloat(value));
                }}
                fullWidth
                required
                margin="dense"
            />
            <TextField
                label="SKU"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                fullWidth
                required
                margin="dense"
            />

            {error && (
                <Typography color="error" variant="body2" mt={1}>
                    {error}
                </Typography>
            )}

            <Box mt={2} display="flex" justifyContent="flex-end">
                <Button type="submit" variant="contained" color="primary">
                    {productToEdit ? 'Update' : 'Create'}
                </Button>
            </Box>
        </FormContainer>
    );
};
