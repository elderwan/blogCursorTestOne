import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#DFAE75', // 主色调 - 温暖的金棕色
      light: '#E8C49E',
      dark: '#D4A464',
      contrastText: '#6A361E',
    },
    secondary: {
      main: '#6A361E', // 深棕色
      light: '#8B5A3C',
      dark: '#4D2415',
      contrastText: '#F7F7F7',
    },
    background: {
      default: '#F7F7F7', // 浅灰色背景
      paper: '#FFFFFF',
    },
    text: {
      primary: '#6A361E',
      secondary: '#8B5A3C',
    },
    success: {
      main: '#81C784',
    },
    error: {
      main: '#E57373',
    },
    warning: {
      main: '#FFB74D',
    },
    info: {
      main: '#64B5F6',
    },
  },
  typography: {
    fontFamily: '"Noto Sans SC", "Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      color: '#6A361E',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
      color: '#6A361E',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      color: '#6A361E',
    },
    h4: {
      fontWeight: 500,
      fontSize: '1.5rem',
      color: '#6A361E',
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.25rem',
      color: '#6A361E',
    },
    h6: {
      fontWeight: 500,
      fontSize: '1.1rem',
      color: '#6A361E',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      color: '#6A361E',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      color: '#8B5A3C',
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(106, 54, 30, 0.1)',
    '0px 4px 8px rgba(106, 54, 30, 0.15)',
    '0px 6px 12px rgba(106, 54, 30, 0.2)',
    '0px 8px 16px rgba(106, 54, 30, 0.25)',
    '0px 10px 20px rgba(106, 54, 30, 0.3)',
    '0px 12px 24px rgba(106, 54, 30, 0.35)',
    '0px 14px 28px rgba(106, 54, 30, 0.4)',
    '0px 16px 32px rgba(106, 54, 30, 0.45)',
    '0px 18px 36px rgba(106, 54, 30, 0.5)',
    '0px 20px 40px rgba(106, 54, 30, 0.55)',
    '0px 22px 44px rgba(106, 54, 30, 0.6)',
    '0px 24px 48px rgba(106, 54, 30, 0.65)',
    '0px 26px 52px rgba(106, 54, 30, 0.7)',
    '0px 28px 56px rgba(106, 54, 30, 0.75)',
    '0px 30px 60px rgba(106, 54, 30, 0.8)',
    '0px 32px 64px rgba(106, 54, 30, 0.85)',
    '0px 34px 68px rgba(106, 54, 30, 0.9)',
    '0px 36px 72px rgba(106, 54, 30, 0.95)',
    '0px 38px 76px rgba(106, 54, 30, 1)',
    '0px 40px 80px rgba(106, 54, 30, 1)',
    '0px 42px 84px rgba(106, 54, 30, 1)',
    '0px 44px 88px rgba(106, 54, 30, 1)',
    '0px 46px 92px rgba(106, 54, 30, 1)',
    '0px 48px 96px rgba(106, 54, 30, 1)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 500,
          padding: '8px 24px',
        },
        contained: {
          boxShadow: '0px 4px 12px rgba(223, 174, 117, 0.3)',
          '&:hover': {
            boxShadow: '0px 6px 16px rgba(223, 174, 117, 0.4)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 4px 20px rgba(106, 54, 30, 0.1)',
          '&:hover': {
            boxShadow: '0px 8px 30px rgba(106, 54, 30, 0.15)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          fontWeight: 500,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          boxShadow: '0px 2px 12px rgba(106, 54, 30, 0.1)',
        },
      },
    },
  },
});

export default theme;