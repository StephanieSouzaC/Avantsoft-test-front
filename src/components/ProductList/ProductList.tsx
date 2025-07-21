import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from '@mui/material';
import { ListContainer } from './ProductList.styles';
import { api } from '../../services/api';
import { Product } from '../../types/Product';
import { ProductForm } from '../ProductForm/ProductForm';

export const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProduct, setFilteredProduct] = useState<Product | null>(null);
  const [productToEdit, setProductToEdit] = useState<Product | undefined>();
  const [searchId, setSearchId] = useState('');

  const fetchProducts = async () => {
    try {
      const response = await api.get<Product[]>('/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      if (filteredProduct?.id === id) setFilteredProduct(null);
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchId.trim()) return;
    try {
      const response = await api.get<Product>(`/products/${searchId}`);
      setFilteredProduct(response.data);
    } catch (error) {
      console.error('Product not found.');
      setFilteredProduct(null);
    }
  };

  const handleProductCreated = (newProduct: Product) => {
    setProductToEdit(undefined);
    fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const productsToShow = filteredProduct ? [filteredProduct] : products;

  return (
    <ListContainer>
      <Typography variant="h5">Products</Typography>

      <Box mb={2}>
        <TextField
          label="Search by ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          size="small"
        />
        <Button
          onClick={handleSearch}
          variant="outlined"
          style={{ marginLeft: 8 }}
        >
          Search
        </Button>
        <Button
          onClick={() => {
            setFilteredProduct(null);
            setSearchId('');
          }}
          variant="text"
          style={{ marginLeft: 8 }}
        >
          Clear
        </Button>
      </Box>

      <ProductForm
        onProductCreated={handleProductCreated}
        productToEdit={productToEdit}
      />

      <Box mt={4}>
        {productsToShow.map((product) => (
          <Card key={product.id} variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="subtitle1">
                <strong>Name:</strong> {product.name}
              </Typography>
              <Typography>
                <strong>Price:</strong> ${product.price.toFixed(2)}
              </Typography>
              <Typography>
                <strong>SKU:</strong> {product.sku}
              </Typography>
              <Typography>
                <strong>Missing Letter:</strong> {product.missingLetter}
              </Typography>
              <Box mt={1}>
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  onClick={() => setProductToEdit(product)}
                  sx={{ mr: 1 }}
                >
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => handleDelete(product.id)}
                >
                  Delete
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </ListContainer>
  );
};
