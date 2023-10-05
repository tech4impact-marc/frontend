import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Toolbar from '@mui/material/Toolbar'
import NextLink from 'next/link'

export default function Navbar() {
  return (
    <Box sx={{ flexGrow: 1, display: 'flex' }}>
      <AppBar position='static'>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Link href="/" component={NextLink} color='primary.light'>
            홈
          </Link>
          <Link href="/mapbox" component={NextLink} color='primary.light'>
            지도
          </Link>
        </Toolbar>
      </AppBar>
    </Box>
  )
}