import { createTheme, responsiveFontSizes } from '@mui/material/styles'

// 임시로 설정. 추후 수정 필요
let theme = createTheme({
  palette: {
    primary: {
      main: '#2D9AFF',
      light: '#ffffff',
      dark: '#115293',
      contrastText: '#fff', //button text white instead of black
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      'Apple SD Gothic Neo',
      'Pretendard Variable',
      'Pretendard',
      'Roboto',
      'Noto Sans KR',
      'Segoe UI',
      'Malgun Gothic',
      'Apple Color Emoji',
      'Segoe UI Emoji',
      'Segoe UI Symbol',
      'sans-serif',
    ].join(','),
    button: {
      fontSize: '1rem',
      fontWeight: 700,
    },
    h1: {
      fontSize: '2rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.17rem',
      fontWeight: 700,
    },
    h4: {
      fontSize: '1rem',
      fontWeight: 700,
    },
    h5: {
      fontSize: '0.83rem',
      fontWeight: 700,
    },
    h6: {
      fontSize: '0.67rem',
      fontWeight: 700,
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
    },
    subtitle1: {
      fontSize: '0.75rem',
      fontWeight: 400,
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
    },
  },
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          display: 'flex',
          flexDirection: 'column',
          maxWidth: '400px',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '0.75rem',
          height: '3.5rem',
          width: '22.375rem',
          '&.Mui-disabled': {
            background: '#6eb9ff',
          },
        },
      },
    },
  },
})

theme = responsiveFontSizes(theme)
export default theme
