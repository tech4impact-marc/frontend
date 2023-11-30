import { Container, Typography } from '@mui/material'
import Head from 'next/head'
import Image from 'next/image'

import { StyledButtonLarge } from '@/components/styledComponents/StyledButton'
import { StyledContainerTwo } from '@/components/styledComponents/StyledContainer'

export default function Home() {
  const handleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_IP_ADDRESS}/auth/kakao`
  }

  const handleForm = () => {
    window.location.href = '/form'
  }

  return (
    <Container
      sx={{
        position: 'absolute',
        width: '100vw',
        height: '100vh',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: 'white',
      }}
    >
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container
        sx={{
          alignItems: 'flex-start',
          height: 'calc(90vh - 3.5rem)',
          maxWidth: '100%',
          padding: '0',
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
            justifyContent: 'center',
            alignItems: 'center',
            height: '7.5rem',
            padding: '1rem 1rem 2.5rem 1rem',
            gap: '1rem',
          }}
        >
          <StyledContainerTwo>
            <StyledButtonLarge
              variant="contained"
              onClick={handleForm}
              sx={{
                background: '#F4F5F6',
                '&:hover': {
                  background: '#F4F5F6',
                },
              }}
              disableElevation
              disableRipple
            >
              <Typography variant="button" color="#000000D9">
                비회원으로 시작하기
              </Typography>
            </StyledButtonLarge>
          </StyledContainerTwo>
          <StyledContainerTwo>
            <StyledButtonLarge
              onClick={handleLogin}
              startIcon={
                <Image
                  src="https://marc-data.s3.ap-northeast-2.amazonaws.com/kakao.svg"
                  alt="kakao"
                  width={18}
                  height={18}
                  priority={true}
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
    </Container>
  )
}
