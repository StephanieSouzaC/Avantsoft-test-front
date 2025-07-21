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
    Stack,
} from '@mui/material';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
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
            <Box mb={3} sx={{ background: '#f7faff', borderRadius: 3, p: { xs: 2, sm: 3 }, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1.5px solid #e3e8f0' }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: '#2563eb', display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Inventory2OutlinedIcon sx={{ mr: 1, fontSize: 28 }} /> Registered Products
                </Typography>

                <Box display="flex" alignItems="center" gap={1} mb={2} flexWrap="wrap">
                    <TextField
                        label="Search by ID"
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                        size="small"
                        sx={{ minWidth: 180, background: '#fff', borderRadius: 1 }}
                    />
                    <Button variant="outlined" onClick={handleSearch} sx={{ fontWeight: 600, textTransform: 'none' }} startIcon={<SearchIcon />}>
                        Search
                    </Button>
                    <Button
                        variant="outlined"
                        color="inherit"
                        onClick={() => {
                            setSearchId('');
                            setFilteredProduct(null);
                            setSearchError('');
                        }}
                        sx={{ fontWeight: 600, textTransform: 'none' }}
                        startIcon={<ClearIcon />}
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
                    sx={{ mt: 2, fontWeight: 700, fontSize: 16, borderRadius: 2, px: 3, py: 1.2, boxShadow: '0 2px 8px rgba(37,99,235,0.08)' }}
                    startIcon={<AddIcon />}
                >
                    Create Product
                </Button>
            </Box>

            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 700, color: '#2563eb', display: 'flex', alignItems: 'center', mb: 2 }}>
                <ListAltOutlinedIcon sx={{ mr: 1, fontSize: 28 }} /> Product List
            </Typography>

            <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }} gap={3}>
                {productsToShow.map((product) => (
                    <Card key={product.id} variant="outlined" sx={{ borderRadius: 3, boxShadow: '0 2px 12px rgba(37,99,235,0.06)', border: '1.5px solid #e3e8f0', p: 1 }}>
                        <CardContent>
                            <Stack spacing={1.2}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: 18, color: '#222' }}>
                                    <strong>Name:</strong> <span style={{ color: '#2563eb' }}>{product.name}</span>
                                </Typography>
                                <Typography sx={{ fontWeight: 500, color: '#2563eb', fontSize: 16 }}>
                                    <strong>Price:</strong> ${product.price.toFixed(2)}
                                </Typography>
                                <Typography sx={{ fontSize: 15 }}>
                                    <strong>SKU:</strong> {product.sku}
                                </Typography>
                                <Typography sx={{ fontSize: 15, color: '#e11d48' }}>
                                    <strong>Missing Letter:</strong> {product.missingLetter || <span style={{ color: '#888' }}>-</span>}
                                </Typography>
                            </Stack>
                            <Box mt={2} display="flex" gap={1}>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    size="small"
                                    onClick={() => {
                                        setProductToEdit(product);
                                        setIsFormOpen(true);
                                    }}
                                    sx={{ fontWeight: 600, borderRadius: 2, textTransform: 'none', px: 2 }}
                                    startIcon={<EditOutlinedIcon />}
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    size="small"
                                    onClick={() => setDeleteId(product.id)}
                                    sx={{ fontWeight: 600, borderRadius: 2, textTransform: 'none', px: 2 }}
                                    startIcon={<DeleteOutlineOutlinedIcon />}
                                >
                                    Delete
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                ))}
            </Box>

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
