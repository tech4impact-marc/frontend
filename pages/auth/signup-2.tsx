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
import axios from 'axios'
import { useRouter } from 'next/router'
import React, { useState } from 'react'

import { store } from '@/redux/store'

export default function KakaoSignUpPage2() {
  const router = useRouter()
  const [nickname, setNickname] = useState('')
  const [isDuplicate, setIsDuplicate] = useState(false)

  const handleBack = () => {
    router.push('/auth/signup-1')
  }

  const handleNext = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_IP_ADDRESS}/users/exist`, {
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
        <Typography variant="h1">이름을 알려주세요</Typography>
        <Typography variant="body1">MARC에서 사용하실 닉네임을 알려주세요</Typography>
      </Container>
      <Container
        sx={{
          justifyContent: 'center',
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
      <Container sx={{ padding: '16px 16px 48px 16px', alignItems: 'center' }}>
        <Button
          onClick={handleNext}
          variant="contained"
          color="primary"
          disabled={isNextButtonDisabled()}
        >
          <Typography variant="body1">다음</Typography>
        </Button>
      </Container>
    </Container>
  )
}
