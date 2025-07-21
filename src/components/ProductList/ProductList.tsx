import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Typography,
    Snackbar,
    Alert,
} from '@mui/material';
import { ListContainer } from './ProductList.styles';
import { api } from '../../services/api';
import { Product } from '../../types/Product';
import { ProductForm } from '../ProductForm/ProductForm';

export const ProductList: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProduct, setFilteredProduct] = useState<Product | null>(null);
    const [productToEdit, setProductToEdit] = useState<Product | undefined>();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [searchId, setSearchId] = useState('');
    const [searchError, setSearchError] = useState('');
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [snackbarMsg, setSnackbarMsg] = useState('');

    const fetchProducts = async () => {
        try {
            const response = await api.get<Product[]>('/products');
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            await api.delete(`/products/${deleteId}`);
            setProducts((prev) => prev.filter((p) => p.id !== deleteId));
            setSnackbarMsg('Product deleted successfully.');
            setFilteredProduct(null);
        } catch (error) {
            setSnackbarMsg('Error deleting product.');
        } finally {
            setDeleteId(null);
        }
    };

    const handleSearch = async () => {
        if (!searchId.trim()) return;
        try {
            const response = await api.get<Product>(`/products/${searchId}`);
            setFilteredProduct(response.data);
            setSearchError('');
        } catch (error) {
            setSearchError('Product not found.');
            setFilteredProduct(null);
        }
    };

    const handleProductCreated = () => {
        setIsFormOpen(false);
        setProductToEdit(undefined);
        fetchProducts();
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const productsToShow = filteredProduct ? [filteredProduct] : products;

    return (
        <ListContainer>
            <Box mb={3}>
                <Typography variant="h5" gutterBottom>
                    Registered Products
                </Typography>

                <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <TextField
                        label="Search by ID"
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                        size="small"
                    />
                    <Button variant="outlined" onClick={handleSearch}>
                        Search
                    </Button>
                    <Button
                        variant="text"
                        onClick={() => {
                            setSearchId('');
                            setFilteredProduct(null);
                            setSearchError('');
                        }}
                    >
                        Clear
                    </Button>
                </Box>

                {searchError && (
                    <Typography color="error" variant="body2" mb={2}>
                        {searchError}
                    </Typography>
                )}

                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                        setProductToEdit(undefined);
                        setIsFormOpen(true);
                    }}
                >
                    Create Product
                </Button>
            </Box>

            <Typography variant="h5" component="h2" gutterBottom>
                Product List
            </Typography>

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
                                onClick={() => {
                                    setProductToEdit(product);
                                    setIsFormOpen(true);
                                }}
                                sx={{ mr: 1 }}
                            >
                                Edit
                            </Button>
                            <Button
                                variant="outlined"
                                color="error"
                                size="small"
                                onClick={() => setDeleteId(product.id)}
                            >
                                Delete
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            ))}

            <Dialog open={isFormOpen} onClose={() => setIsFormOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>{productToEdit ? 'Edit Product' : 'Create Product'}</DialogTitle>
                <DialogContent>
                    <ProductForm onProductCreated={handleProductCreated} productToEdit={productToEdit} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsFormOpen(false)}>Cancel</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this product?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteId(null)}>Cancel</Button>
                    <Button onClick={handleDelete} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={!!snackbarMsg}
                autoHideDuration={4000}
                onClose={() => setSnackbarMsg('')}
            >
                <Alert severity="info" variant="filled">
                    {snackbarMsg}
                </Alert>
            </Snackbar>
        </ListContainer>
    );
};
