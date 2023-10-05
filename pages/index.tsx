import { Box, Container, Typography } from '@mui/material'
import { Inter } from 'next/font/google'
import Image from 'next/image'

import marcPic from '../public/marc.png'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <Container sx={{ background: 'linear-gradient(to bottom, #b3d1c6, #46747c)', width: 'auto', height: '100vh' }}>
      <Box 
        sx={{
          padding: 4,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Image
          src={marcPic}
          alt="Logo of MARC"
          width={200}
          height={200}
        />
        <Typography sx={{ margin: 5 }}variant="h2" color='primary.light' gutterBottom>
          해양동물생태보전연구소
        </Typography>
      </Box>
    </Container>
  )
}
