import { Box, Container, Typography } from '@mui/material'
import { Inter } from 'next/font/google'
import Image from 'next/image'

import marcPic from '../public/marc.png'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <Container maxWidth="sm">
      <Box 
        sx={{
          my: 4,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          MARC
        </Typography>
        <Image
          src={marcPic}
          alt="Logo of MARC"
        />

      </Box>
    </Container>
  )
}
