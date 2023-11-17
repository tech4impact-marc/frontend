import { Box, Button, Typography } from '@mui/material'
import Image from 'next/image'
import { useState } from 'react'
import { isMobile } from 'react-device-detect'

import SNSSharingComponent from '@/components/SNSSharingComponent'
import drawer from '@/public/drawer.png'

import theme from '../styles/theme'

export default function ReportShare() {
  const [isComponentVisible, setComponentVisibility] = useState(false)
  const [isModalOpen, setModalOpen] = useState(false)

  const handleButtonClick = () => {
    setComponentVisibility(true)
    setModalOpen(true)
  }

  const handleModalClose = () => {
    setModalOpen(false)
  }

  const imgSrc = 'drawer.png' // Image to be shared

  const animalType = '남방큰돌고래'
  const userName = '미남강현'
  return (
    <div>
      <Typography
        style={{ whiteSpace: 'pre-line' }}
        variant="h1"
        sx={{
          marginTop: '20px',
          marginLeft: '10px',
        }}
      >
        {animalType}를{'\n'}도와주셔서 감사합니다!
      </Typography>
      <Typography
        variant="body1"
        sx={{
          marginTop: '8px',
          marginLeft: '10px',
          marginBottom: '30px',
        }}
      >
        {userName}님 덕분에 {animalType}가 행복해요{'\n'}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #76BFFF 10%, #6278FE 90%)',
          padding: '20px', // 내부 여백
          margin: '0 auto',
          maxWidth: '280px',
          borderRadius: 3,
        }}
      >
        <Image src={drawer} alt="testimg" width="250" />
        <Typography variant="body1" color={theme.palette.primary.light} sx={{ marginTop: '15px' }}>
          초보 탐험가
        </Typography>
        <Typography
          variant="h1"
          color={theme.palette.primary.light}
          sx={{ marginTop: '5px', marginBottom: '20px' }}
        >
          {userName}
        </Typography>
      </Box>
      {isComponentVisible && (
        <SNSSharingComponent
          isOpen={isModalOpen}
          onClose={handleModalClose}
          imageUrl={imgSrc}
          isMobile={isMobile}
        />
      )}
      <Box
        sx={{
          display: 'flex',
          gap: '20px',
          justifyContent: 'center',
          marginTop: '24px',
          marginX: '10px',
        }}
      >
        <Button onClick={handleButtonClick} variant="contained" color="primary">
          <Typography variant="body1">공유하기</Typography>
        </Button>
        <Button href="/" variant="contained" color="primary">
          <Typography variant="body1">완료</Typography>
        </Button>
      </Box>
    </div>
  )
}
