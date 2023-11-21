import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import {
  Button,
  Container,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import { useRouter } from 'next/router'
import React, { useState } from 'react'

import { store } from '@/redux/store'

export default function KakaoSignUpPage3() {
  const router = useRouter()
  const state = store.getState()
  const parsedUserEmail = state.signupUserInfo.userEmail.split('@')

  const [userName, setUserName] = useState(parsedUserEmail[0])
  const [domain, setDomain] = useState(parsedUserEmail[1])
  const [customDomain, setCustomDomain] = useState('')

  console.log(userName.length, domain.length, customDomain.length)

  const handleBack = () => {
    router.push('/auth/signup-2')
  }

  const handleNext = () => {
    if (domain === '') {
      store.dispatch({ type: 'SIGNUP_SET_USEREMAIL', payload: userName + '@' + customDomain })
    } else {
      store.dispatch({ type: 'SIGNUP_SET_USEREMAIL', payload: userName + '@' + domain })
    }
    router.push('/auth/signup-4')
  }

  const handleUserNameChange = (e) => {
    const { value } = e.target
    setUserName(value)
  }

  const handleDomainChange = (e) => {
    const { value } = e.target
    setDomain(value)
  }

  const handleCustomDomainChange = (e) => {
    const { value } = e.target
    setCustomDomain(value)
  }

  const isNextButtonDisabled = () => {
    return userName.length === 0 || (domain.length === 0 && customDomain.length === 0)
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
        <Typography variant="h1">이메일을 알려주세요</Typography>
        <Typography variant="body1">사용하시는 이메일을 입력해주세요</Typography>
      </Container>
      <Container
        sx={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          alignSelf: 'stretch',
          height: '100%',
        }}
      >
        <TextField
          label="이메일"
          variant="standard"
          style={{ width: '45%' }}
          defaultValue={parsedUserEmail[0]}
          onChange={handleUserNameChange}
        />
        <Typography variant="body1" sx={{ padding: '18px 0px 0px 0px' }}>
          @
        </Typography>
        <FormControl variant="outlined" style={{ width: '45%' }}>
          {domain === '' ? (
            <TextField
              label="직접 입력"
              variant="standard"
              style={{ width: '100%' }}
              onChange={handleCustomDomainChange}
            />
          ) : (
            <Select
              labelId="domain-label"
              defaultValue={parsedUserEmail[1]}
              variant="standard"
              sx={{ padding: '16px 0px 0px 0px' }}
              onChange={handleDomainChange}
            >
              <MenuItem value="">직접입력</MenuItem>
              <MenuItem value="gmail.com">gmail.com</MenuItem>
              <MenuItem value="naver.com">naver.com</MenuItem>
              <MenuItem value="daum.net">daum.net</MenuItem>
              <MenuItem value="kaist.ac.kr">kaist.ac.kr</MenuItem>
            </Select>
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
          다음
        </Button>
      </Container>
    </Container>
  )
}
