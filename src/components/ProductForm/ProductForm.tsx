import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { FormContainer } from './ProductForm.styles';
import { api } from '../../services/api';
import { Product } from '../../types/Product';

interface Props {
  onProductCreated: (product: Product) => void;
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
    }
  }, [productToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !sku.trim() || !price || price <= 0) {
      setError('Please fill all fields correctly.');
      return;
    }

    try {
      if (productToEdit?.id) {
        const response = await api.put<Product>(`/products/${productToEdit.id}`, {
          name,
          price,
          sku,
        });

        onProductCreated(response.data);
      } else {
        const response = await api.post<Product>('/products', {
          name,
          price,
          sku,
        });

        onProductCreated(response.data);
        setName('');
        setPrice('');
        setSku('');
      }

      setError('');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <Typography variant="h6">
        {productToEdit ? 'Edit Product' : 'Add Product'}
      </Typography>
      <TextField
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        required
      />
      <TextField
        label="Price"
        type="number"
        value={price}
        onChange={(e) => setPrice(parseFloat(e.target.value))}
        fullWidth
        required
      />
      <TextField
        label="SKU"
        value={sku}
        onChange={(e) => setSku(e.target.value)}
        fullWidth
        required
      />
      {error && (
        <Typography color="error" variant="body2">
          {error}
        </Typography>
      )}
      <Box mt={2}>
        <Button type="submit" variant="contained" color="primary">
          {productToEdit ? 'Update' : 'Create'}
        </Button>
      </Box>
    </FormContainer>
  );
};