import { Button, Container, Typography } from '@mui/material'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React from 'react'

import {
  StyledContainerLogin,
  StyledContainerSignupOne,
  StyledContainerSignupThree,
  StyledContainerTwo,
} from '@/components/styledComponents/StyledContainer'
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
    <StyledContainerLogin>
      <Container sx={{ height: '3.5rem' }}></Container>
      <StyledContainerSignupOne>
        <Typography variant="h1">반갑습니다 {userName}님 🙌 </Typography>
        <Typography variant="body1">MARC에서 해양동물들을 둘러보세요!</Typography>
      </StyledContainerSignupOne>
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

export default KakaoSignUpPage5
