import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import { Button, Container, IconButton, Typography } from '@mui/material'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React from 'react'

import {
  StyledContainerLogin,
  StyledContainerSignupOne,
  StyledContainerSignupThree,
  StyledContainerSignupTwo,
  StyledContainerTwo,
} from '@/components/styledComponents/StyledContainer'
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
    store.dispatch({ type: 'SIGNUP_SET_USERPROFILE', payload: userData.profile })
    router.push('/auth/signup-2')
  }

  return (
    <StyledContainerLogin>
      <StyledContainerSignupOne>
        <IconButton onClick={handleBack} sx={{ color: 'black' }}>
          <ArrowBackIosNewIcon />
        </IconButton>
      </StyledContainerSignupOne>
      <StyledContainerSignupTwo>
        <Typography variant="h1">시작해볼까요?</Typography>
        <Typography variant="body1">야생동물들의 지도를 직접 만들어보세요</Typography>
      </StyledContainerSignupTwo>
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
      <StyledContainerSignupThree>
        <StyledContainerTwo>
          <Button onClick={handleNext} variant="contained" color="primary">
            <Typography variant="body1">시작하기</Typography>
          </Button>
        </StyledContainerTwo>
      </StyledContainerSignupThree>
    </StyledContainerLogin>
  )
}
