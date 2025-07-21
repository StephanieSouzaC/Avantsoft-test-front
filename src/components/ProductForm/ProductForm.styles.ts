import { styled } from '@mui/material/styles';

export const FormContainer = styled('form')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  maxWidth: 420,
  margin: '0 auto',
  padding: theme.spacing(3),
  backgroundColor: '#fff',
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1.5),
    maxWidth: '100%',
  },
}));