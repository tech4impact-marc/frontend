import { createTheme, responsiveFontSizes } from '@mui/material/styles'

// 임시로 설정. 추후 수정 필요
let theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#ffffff',
      dark: '#115293',
    },
  },
  typography: {
    button: {
      fontSize: '0.8rem',
      fontWeight: 700,
    },
    h1: {
      fontSize: '1.6rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '1.2rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '0.9rem',
      fontWeight: 600,
    },
    body1: {
      fontSize: '0.9rem',
    },
    subtitle1: {
      fontSize: '0.8rem',
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
  },
})

theme = responsiveFontSizes(theme)
export default theme
