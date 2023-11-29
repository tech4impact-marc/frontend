import { Button, Container, Typography } from '@mui/material'
import Head from 'next/head'
import Image from 'next/image'
import { ReactElement } from 'react'

import CommonLayout from '@/components/Layout/CommonLayout'
import kakao_login_medium_wide from '@/public/kakao_login_medium_wide.png'
import marc_logo from '@/public/marc_logo.png'

export default function Home() {
  const handleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_IP_ADDRESS}/auth/kakao`
  }

  const handleForm = () => {
    window.location.href = '/form'
  }

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container
        sx={{
          alignItems: 'flex-start',
          height: 'calc(90vh - 56px)',
          maxWidth: '100%',
          padding: '0px',
        }}
      >
        <Container
          sx={{
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'stretch',
            padding: '16px',
            height: '100%',
            maxWidth: '100%',
          }}
        >
          <Image src={marc_logo} alt="logo" width="108" />
        </Container>
        <Container
          sx={{
            justifyContent: 'center',
            alignItems: 'center',
            height: '120px',
            padding: '16px 16px 40px 16px',
            gap: '16px',
          }}
        >
          <Button variant="contained" onClick={handleForm}>
            <Typography variant="button">비회원으로 시작하기</Typography>
          </Button>
          <Image src={kakao_login_medium_wide} alt="kakao_button" onClick={handleLogin} />
        </Container>
      </Container>
    </>
  )
}

Home.getLayout = (page: ReactElement) => <CommonLayout>{page}</CommonLayout>
