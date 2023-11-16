import { createTheme, responsiveFontSizes } from '@mui/material/styles'

// 임시로 설정. 추후 수정 필요
let theme = createTheme({
  palette: {
    primary: {
      main: '#000000',
      light: '#ffffff',
      dark: '#46747c',
    },
    secondary: {
      main: '#ffffff',
      light: '#000000',
      dark: '#46747c',
    },
  },
  typography: {
    fontFamily: 'Pretendard',
  },
})

theme = responsiveFontSizes(theme)
export default theme
