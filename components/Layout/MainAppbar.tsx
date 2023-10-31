import HomeIcon from '@mui/icons-material/Home'
import MenuIcon from '@mui/icons-material/Menu'
import { Box, Typography } from '@mui/material'
import AppBar from '@mui/material/AppBar'
import IconButton from '@mui/material/IconButton'
import Toolbar from '@mui/material/Toolbar'
import NextLink from 'next/link'

export default function MainAppbar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar disableGutters>
          <IconButton sx={{ mr: 2, ml: 1 }} size="large">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            MARC
          </Typography>
          <IconButton sx={{ mr: 1 }} component={NextLink} href="/" size="large">
            <HomeIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  )
}
