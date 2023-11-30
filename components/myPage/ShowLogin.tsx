import { Container, Typography } from '@mui/material'
import Image from 'next/image'
import React from 'react'

import { StyledButtonLarge } from '@/components/styledComponents/StyledButton'
import { StyledContainerTwo } from '@/components/styledComponents/StyledContainer'

export default function ShowLogin() {
  const [openSetting, setOpenSetting] = React.useState(false)
  const handleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_IP_ADDRESS}/auth/kakao`
  }

  const handleSettingClick = () => {
    setOpenSetting(true)
  }

  const handleSettingExit = () => {
    setOpenSetting(false)
  }

  return (
    <>
      <Container
        sx={{
          alignItems: 'flex-start',
          height: 'calc(60vh - 3.5rem)',
          maxWidth: '100%',
          padding: '0px',
        }}
      >
        <Container
          sx={{
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'stretch',
            padding: '1rem',
            height: '100%',
            maxWidth: '100%',
          }}
        >
          <Image
            src={'https://marc-data.s3.ap-northeast-2.amazonaws.com/marc_logo.webp'}
            alt="logo"
            width={108}
            height={108}
          />
        </Container>
        <Container
          sx={{
            justifyContent: 'flex-end',
            alignItems: 'center',
            height: '7.5rem',
            padding: '1rem 1rem 2.5rem 1rem',
            gap: '2rem',
          }}
        >
          <Typography variant="body2" color="#223047">
            마이페이지를 사용하려면 로그인이 필요합니다.
          </Typography>

          <StyledContainerTwo>
            <StyledButtonLarge
              onClick={handleLogin}
              startIcon={
                <Image
                  src="https://marc-data.s3.ap-northeast-2.amazonaws.com/kakao.svg"
                  alt="kakao"
                  width={18}
                  height={18}
                />
              }
              sx={{
                background: '#FEE500',
                '&:hover': {
                  background: '#FEE500',
                },
              }}
              disableElevation
            >
              <Typography variant="button" color="#000000D9">
                카카오 로그인
              </Typography>
            </StyledButtonLarge>
          </StyledContainerTwo>
        </Container>
      </Container>
    </>
  )
}
