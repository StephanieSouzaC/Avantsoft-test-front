import React from 'react';
import { CssBaseline, Container, Typography } from '@mui/material';
import { ProductList } from './components/ProductList/ProductList';

const App: React.FC = () => {
  return (
    <>
      <CssBaseline />
      <Container maxWidth="md">
        <Typography variant="h4" align="center" gutterBottom sx={{ mt: 4 }}>
          Product Management
        </Typography>
        <ProductList />
      </Container>
    </>
  );
};

export default App;

