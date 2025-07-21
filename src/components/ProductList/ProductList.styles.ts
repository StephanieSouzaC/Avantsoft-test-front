import { styled } from '@mui/material/styles';

export const ListContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  padding: theme.spacing(4),
  maxWidth: 900,
  margin: '32px auto',
  background: '#fff',
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
    maxWidth: '100%',
    margin: theme.spacing(1),
  },
}));
