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
      fontWeight: 700,
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
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
    },
    subtitle1: {
      fontSize: '0.75rem',
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
          // padding: '0',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          //width, height 추가하면 살짝 고장납니다!
          padding: '0.3rem',
          borderRadius: '0.5rem',
          '&.Mui-disabled': {
            background: '#6eb9ff',
            color: '#fff',
          },
        },
      },
    },
  },
})

theme = responsiveFontSizes(theme)
export default theme
