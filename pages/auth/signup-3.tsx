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

import {
  StyledContainerLogin,
  StyledContainerSignupOne,
  StyledContainerSignupThree,
  StyledContainerSignupTwo,
  StyledContainerTwo,
} from '@/components/styledComponents/StyledContainer'
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

  const handleUserNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setUserName(value)
  }

  const handleDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setDomain(value)
  }

  const handleCustomDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setCustomDomain(value)
  }

  const isNextButtonDisabled = () => {
    return userName.length === 0 || (domain.length === 0 && customDomain.length === 0)
  }

  return (
    <StyledContainerLogin>
      <StyledContainerSignupOne>
        <IconButton onClick={handleBack} sx={{ color: 'black' }}>
          <ArrowBackIosNewIcon />
        </IconButton>
      </StyledContainerSignupOne>
      <StyledContainerSignupTwo>
        <Typography variant="h1">이메일을 알려주세요</Typography>
        <Typography variant="body1">사용하시는 이메일을 입력해주세요</Typography>
      </StyledContainerSignupTwo>
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
        <Typography variant="body1" sx={{ padding: '1.125rem 0 0' }}>
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
              sx={{ padding: '1rem 0 0' }}
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
