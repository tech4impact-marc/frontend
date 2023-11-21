import { Button, Container, Typography } from '@mui/material'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React from 'react'

import signup_complete from '@/public/signup_complete.png'
import { store } from '@/redux/store'

const KakaoSignUpPage5 = () => {
  const router = useRouter()
  const state = store.getState()
  const userName = state.signupUserInfo.userName

  const handleNext = () => {
    store.dispatch({ type: 'SIGNUP_SET_USERNAME', payload: '' })
    store.dispatch({ type: 'SIGNUP_SET_USEREMAIL', payload: '' })
    store.dispatch({ type: 'SIGNUP_SET_USERPROFILEIMAGE', payload: '' })
    router.push('/')
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
      <Container sx={{ height: '56px' }}></Container>
      <Container sx={{ height: '120px', padding: '16px', gap: '8px', alignItems: 'center' }}>
        <Typography variant="h1">반갑습니다 {userName}님 🙌 </Typography>
        <Typography variant="body1">MARC에서 해양동물들을 둘러보세요!</Typography>
      </Container>
      <Container
        sx={{
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'stretch',
          height: '100%',
        }}
      >
        <Image src={signup_complete} alt="complete" width="178" />
      </Container>
      <Container sx={{ padding: '16px 16px 48px 16px', alignItems: 'center' }}>
        <Button onClick={handleNext} variant="contained" color="primary">
          시작하기
        </Button>
      </Container>
    </Container>
  )
}

export default KakaoSignUpPage5
