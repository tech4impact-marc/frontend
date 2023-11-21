import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import { Button, Container, IconButton, Typography } from '@mui/material'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React from 'react'

import signup_start from '@/public/signup_start.png'
import { store } from '@/redux/store'

import getSignupUserData from '../api/getSignupUserData'

export default function KakaoSignUpPage1() {
  const router = useRouter()

  const handleBack = () => {
    router.push('/auth/login')
  }

  async function handleNext() {
    const userData = await getSignupUserData()
    store.dispatch({ type: 'SIGNUP_SET_USEREMAIL', payload: userData.email })
    if (!userData.profile.isDefaultImage) {
      store.dispatch({
        type: 'SIGNUP_SET_USERPROFILEIMAGE',
        payload: userData.profile.profileImageUrl,
      })
    }
    router.push('/auth/signup-2')
  }

  return (
    <Container
      sx={{
        alignItems: 'flex-start',
        height: 'calc(90vh - 56px)',
        maxWidth: '100%',
        padding: '0px',
      }}
    >
      <Container sx={{ height: '56px', padding: '16px', alignItems: 'flex-start' }}>
        <IconButton onClick={handleBack} sx={{ color: 'black' }}>
          <ArrowBackIosNewIcon />
        </IconButton>
      </Container>
      <Container sx={{ padding: '16px', height: '120px', gap: '8px' }}>
        <Typography variant="h1">시작해볼까요?</Typography>
        <Typography variant="body1">야생동물들의 지도를 직접 만들어보세요</Typography>
      </Container>
      <Container
        sx={{
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'stretch',
          height: '100%',
        }}
      >
        <Image src={signup_start} alt="start" width="178" />
      </Container>
      <Container sx={{ padding: '16px 16px 48px 16px', alignItems: 'center' }}>
        <Button onClick={handleNext} variant="contained" color="primary">
          <Typography variant="body1">시작하기</Typography>
        </Button>
      </Container>
    </Container>
  )
}
