import { styled } from '@mui/material/styles';

export const FormContainer = styled('form')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  maxWidth: 400,
  margin: '0 auto',
  padding: theme.spacing(3),
  backgroundColor: '#f9f9f9',
  borderRadius: theme.spacing(1),
  boxShadow: '0 0 10px rgba(0,0,0,0.1)',
}));