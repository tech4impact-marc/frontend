import { createTheme, responsiveFontSizes } from '@mui/material/styles'

// 임시로 설정. 추후 수정 필요
let theme = createTheme({
  palette: {
    primary: {
      main: '#b3d1c6',
      light: '#ffffff',
      dark: '#46747c',
    },
  },
})

theme = responsiveFontSizes(theme)
export default theme
