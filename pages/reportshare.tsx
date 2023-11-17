import { Button, Container, Typography } from '@mui/material'
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
    <Container
      sx={{
        alignItems: 'flex-start',
        height: 'calc(90vh - 56px)',
        maxWidth: '100%',
        padding: '0px',
      }}
    >
      <Container id="1" sx={{ padding: '16px', gap: '10px', maxWidth: '100%' }}>
        <Typography style={{ whiteSpace: 'pre-line' }} variant="h1">
          {animalType}를{'\n'}도와주셔서 감사합니다!
        </Typography>
        <Typography variant="body1">
          {userName}님 덕분에 {animalType}가 행복해요{'\n'}
        </Typography>
      </Container>

      <Container
        id="2"
        sx={{
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'stretch',
          padding: '16px',
          height: '100%',
          maxWidth: '100%',
        }}
      >
        <Container
          sx={{
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #76BFFF 10%, #6278FE 90%)',
            padding: '16px 16px 40px 16px',
            width: '280px',
            gap: '8px',
            borderRadius: '20px',
          }}
        >
          <Image src={drawer} alt="testimg" width="248" />
          <Typography variant="body1" color={theme.palette.primary.light} sx={{ marginTop: '8px' }}>
            초보 탐험가
          </Typography>
          <Typography variant="h1" color={theme.palette.primary.light}>
            {userName}
          </Typography>
        </Container>
      </Container>

      {isComponentVisible && (
        <SNSSharingComponent
          isOpen={isModalOpen}
          onClose={handleModalClose}
          imageUrl={imgSrc}
          isMobile={isMobile}
        />
      )}
      <Container
        id="3"
        sx={{
          padding: '16px 16px 48px 16px',
          gap: '16px',
          justifyContent: 'center',
          flexDirection: 'row',
          maxWidth: '100%',
        }}
      >
        <Button onClick={handleButtonClick} variant="contained" color="primary">
          <Typography variant="body1">공유하기</Typography>
        </Button>
        <Button href="/" variant="contained" color="primary">
          <Typography variant="body1">완료</Typography>
        </Button>
      </Container>
    </Container>
  )
}
