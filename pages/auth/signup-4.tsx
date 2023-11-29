import 'react-image-crop/dist/ReactCrop.css'

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import { Avatar, Button, Container, IconButton, Typography } from '@mui/material'
import axios from 'axios'
import { useRouter } from 'next/router'
import React from 'react'

import {
  StyledContainerLogin,
  StyledContainerSignupOne,
  StyledContainerSignupThree,
  StyledContainerSignupTwo,
  StyledContainerTwo,
} from '@/components/styledComponents/StyledContainer'
import { store } from '@/redux/store'

export default function KakaoSignUpPage4() {
  const router = useRouter()
  const state = store.getState()
  const userName = state.signupUserInfo.userName
  const userEmail = state.signupUserInfo.userEmail
  const isDefault = state.signupUserInfo.userProfile.isDefaultImage
  let profileImage
  if (isDefault) {
    profileImage = '/defaultprofile.png'
  } else {
    profileImage = state.signupUserInfo.userProfile.profileImageUrl
  }

  const handleBack = () => {
    router.push('/auth/signup-3')
  }

  const handleSignup = () => {
    axios
      .post(
        `${process.env.NEXT_PUBLIC_IP_ADDRESS}/auth/kakao/signup`,
        { nickname: userName, email: userEmail, profileIsDefaultImage: isDefault },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      )
      .then((response) => {
        if (response.status !== 200) {
          throw new Error('Network response was not ok')
        }
        // 회원가입 성공
        console.log('회원가입이 완료되었습니다.', response)
        console.log(response.data)
        store.dispatch({ type: 'SET_TOKENS', payload: response.data.tokens })
        store.dispatch({ type: 'SET_USER', payload: response.data.user })
        store.dispatch({
          type: 'SET_ACCESSTOKEN_EXPIRESAT',
          payload: Date.now() + response.data.tokens.expiresIn * 1000,
        })
        store.dispatch({
          type: 'SET_REFRESHTOKEN_EXPIRESAT',
          payload: Date.now() + response.data.tokens.refreshTokenExpiresIn * 1000,
        })

        router.push('/auth/signup-5')
      })
      .catch((error) => {
        const errorMessage = error.response?.data?.message
        if (errorMessage === 'nickname already exists') alert('이미 존재하는 닉네임입니다.')
        // 오류 처리
        else console.error('회원가입 중 오류가 발생했습니다.', error)
      })
  }

  return (
    <StyledContainerLogin>
      <StyledContainerSignupOne>
        <IconButton onClick={handleBack} sx={{ color: 'black' }}>
          <ArrowBackIosNewIcon />
        </IconButton>
      </StyledContainerSignupOne>
      <StyledContainerSignupTwo>
        <Typography variant="h1">프로필 이미지를 설정해주세요</Typography>
        <Typography variant="body1">
          {userName}님을 표현할 수 있는 이미지를 설정해주세요.
        </Typography>
      </StyledContainerSignupTwo>
      <Container
        sx={{
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'stretch',
          height: '100%',
        }}
      >
        <Avatar
          alt="Profile Image"
          src={profileImage}
          sx={{ width: '15rem', height: '15rem', borderRadius: '50%', cursor: 'pointer' }}
        />
      </Container>
      <StyledContainerSignupThree>
        <StyledContainerTwo>
          <Button onClick={handleSignup} variant="contained" color="primary">
            <Typography variant="body1">회원가입 완료하기</Typography>
          </Button>
        </StyledContainerTwo>
      </StyledContainerSignupThree>
    </StyledContainerLogin>
  )
}
