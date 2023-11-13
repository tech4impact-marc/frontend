import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import { Box, Button, IconButton, Typography } from '@mui/material'
import { Inter } from 'next/font/google'
import Image from 'next/image'
import { useState } from 'react'
import { isMobile } from 'react-device-detect'

import SNSSharingComponent from '@/components/SNSSharingComponent'
import drawer from '@/public/drawer.png'

const inter = Inter({ subsets: ['latin'] })

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
      <IconButton color="primary" sx={{ marginLeft: '10px', marginTop: '10px' }}>
        <ArrowBackIosNewIcon />
      </IconButton>
      <Typography
        variant="h6"
        style={{ whiteSpace: 'pre-line' }}
        sx={{
          fontWeight: 'bold',
          fontSize: '24px',
          marginTop: '20px',
          marginLeft: '10px',
          lineHeight: '1.2',
        }}
      >
        {animalType}를{'\n'}도와주셔서 감사합니다!
      </Typography>
      <Typography
        variant="h6"
        sx={{ fontSize: '16px', marginTop: '8px', marginLeft: '10px', marginBottom: '30px' }}
      >
        {userName}님의 제보는 해양생태계 보존에 큰 힘이 됩니다.{'\n'}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#7B82FE',
          padding: '20px', // 내부 여백
          margin: '0 auto',
          maxWidth: '280px',
          borderRadius: 3,
        }}
      >
        <Image src={drawer} alt="testimg" width="250" />
        <Typography variant="body2" sx={{ marginTop: '15px' }}>
          초보 탐험가
        </Typography>
        <Typography
          variant="body2"
          sx={{ fontColor: 'white', fontWeight: 'bold', fontSize: '24px', marginTop: '5px' }}
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
      <Box sx={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '24px' }}>
        <Button
          onClick={handleButtonClick}
          color="secondary"
          sx={{
            backgroundColor: '#2D9AFF',
            borderRadius: 3,
            width: '30%',
            height: '48px',
            fontSize: '15px',
          }}
        >
          공유하기
        </Button>
        <Button
          href="/"
          color="secondary"
          sx={{
            backgroundColor: '#ABB0BC',
            borderRadius: 3,
            width: '30%',
            height: '48px',
            fontSize: '15px',
          }}
        >
          완료
        </Button>
      </Box>
    </div>
  )
}
