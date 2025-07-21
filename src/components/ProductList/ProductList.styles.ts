import { styled } from '@mui/material/styles';

export const ListContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  padding: theme.spacing(3),
  maxWidth: 600,
  margin: '0 auto',
}));
