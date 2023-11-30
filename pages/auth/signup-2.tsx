import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import {
  Button,
  Container,
  FormControl,
  FormHelperText,
  IconButton,
  Input,
  InputLabel,
  Typography,
} from '@mui/material'
import { useRouter } from 'next/router'
import React, { useState } from 'react'

import {
  StyledContainerLogin,
  StyledContainerSignupOne,
  StyledContainerSignupThree,
  StyledContainerSignupTwo,
  StyledContainerTwo,
} from '@/components/styledComponents/StyledContainer'
import { store } from '@/redux/store'
import instance from '@/util/axios_interceptor'

export default function KakaoSignUpPage2() {
  const router = useRouter()
  const [nickname, setNickname] = useState('')
  const [isDuplicate, setIsDuplicate] = useState(false)

  const handleBack = () => {
    router.push('/auth/signup-1')
  }

  const handleNext = async () => {
    try {
      const response = await instance.get(`/users/exist`, {
        params: { nickname: nickname },
      })

      if (response.data.exist) {
        setIsDuplicate(true)
      } else {
        store.dispatch({ type: 'SIGNUP_SET_USERNAME', payload: nickname })
        router.push('/auth/signup-3')
      }
    } catch (error) {
      console.log('에러 발생: ', error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (nickname !== e.target.value) {
      setIsDuplicate(false)
    }
    setNickname(e.target.value)
  }

  const isNextButtonDisabled = () => {
    return nickname.length === 0 || nickname.length > 8
  }

  return (
    <StyledContainerLogin>
      <StyledContainerSignupOne>
        <IconButton onClick={handleBack} sx={{ color: 'black' }}>
          <ArrowBackIosNewIcon />
        </IconButton>
      </StyledContainerSignupOne>
      <StyledContainerSignupTwo>
        <Typography variant="h1">이름을 알려주세요</Typography>
        <Typography variant="body1">MARC에서 사용하실 닉네임을 알려주세요</Typography>
      </StyledContainerSignupTwo>
      <Container
        sx={{
          alignItems: 'flex-start',
          alignSelf: 'stretch',
          height: '100%',
        }}
      >
        <FormControl variant="standard">
          <InputLabel htmlFor="component-helper">닉네임</InputLabel>
          <Input
            id="component-helper"
            type="text"
            placeholder="입력해주세요"
            onChange={handleInputChange}
            autoFocus
            error={isDuplicate}
          />
          {isDuplicate ? (
            <FormHelperText id="component-helper-text" error>
              중복된 이름입니다.
            </FormHelperText>
          ) : (
            <FormHelperText id="component-helper-text">
              탐험가님을 8글자 이내로 표현해주세요!
            </FormHelperText>
          )}
        </FormControl>
      </Container>
      <StyledContainerSignupThree>
        <StyledContainerTwo>
          <Button
            onClick={handleNext}
            variant="contained"
            color="primary"
            disabled={isNextButtonDisabled()}
          >
            <Typography variant="body1">다음</Typography>
          </Button>
        </StyledContainerTwo>
      </StyledContainerSignupThree>
    </StyledContainerLogin>
  )
}
