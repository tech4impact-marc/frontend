import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import { Button, Container, Divider, IconButton, Typography } from '@mui/material'
import axios from 'axios'
import { useRouter } from 'next/router'
import React from 'react'

import refreshAccessToken from '@/pages/api/refreshAccessToken'
import { store } from '@/redux/store'

export default function SettingPage() {
  const router = useRouter()

  const handleBack = () => {
    router.back()
  }

  const handleLogOut = async () => {
    const isLogOut = window.confirm('로그아웃 하시겠습니까?')
    if (isLogOut) {
      try {
        const jwtToken = await refreshAccessToken()
        console.log(jwtToken)
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_IP_ADDRESS}/auth/logout`,
          null,
          {
            headers: {
              Authorization: `Bearer ${jwtToken.accessToken}`,
            },
            withCredentials: true,
          }
        )
        if (response.status !== 200) {
          throw new Error('Network response was not ok')
        }
        // 로그아웃 성공 시 처리

        store.dispatch({ type: 'SET_TOKENS', payload: {} })
        store.dispatch({ type: 'SET_USER', payload: {} })
        store.dispatch({ type: 'SET_ACCESSTOKEN_EXPIRESAT', payload: 0 })
        store.dispatch({ type: 'SET_REFRESHTOKEN_EXPIRESAT', payload: 0 })

        console.log('로그아웃 성공', response)
        alert('로그아웃 되었습니다.')
        router.push('/')
      } catch (error) {
        // 오류 처리
        console.error('로그아웃 중 오류가 발생했습니다.', error)
      }
    } else {
      alert('로그아웃 취소')
    }
  }
  const handleUnregister = async () => {
    const isUnregister = window.confirm('회원탈퇴 하시겠습니까?')
    if (isUnregister) {
      const confirmUnregister = window.confirm('진짤루?')
      if (confirmUnregister) {
        try {
          const jwtToken = await refreshAccessToken()
          console.log(jwtToken)
          console.log(jwtToken.accessToken)
          const response = await axios.delete(
            `${process.env.NEXT_PUBLIC_IP_ADDRESS}/auth/users/self`,
            {
              headers: {
                Authorization: `Bearer ${jwtToken.accessToken}`,
              },
              withCredentials: true,
            }
          )
          if (response.status !== 200) {
            throw new Error('Network response was not ok')
          }
          // 회원탈퇴 성공 시 처리
          store.dispatch({ type: 'SET_TOKENS', payload: {} })
          store.dispatch({ type: 'SET_USER', payload: {} })
          store.dispatch({ type: 'SET_ACCESSTOKEN_EXPIRESAT', payload: 0 })
          store.dispatch({ type: 'SET_REFRESHTOKEN_EXPIRESAT', payload: 0 })

          console.log('회원탈퇴 성공', response)
          alert('회원 탈퇴 되었습니다.')
          router.push('/')
        } catch (error) {
          // 오류 처리
          console.error('회원탈퇴 중 오류가 발생했습니다.', error)
        }
      } else {
        alert('회원탈퇴 취소')
      }
    } else {
      alert('회원탈퇴 취소')
    }
  }

  const handleLogOut2 = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_IP_ADDRESS}/auth/kakao/logout`
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
      <Container sx={{ padding: '16px', gap: '8px' }}>
        <Typography variant="h1">설정</Typography>
      </Container>
      <Container
        sx={{
          justifyContent: 'flex-start',
          alignItems: 'center',
          alignSelf: 'stretch',
          height: '100%',
        }}
      >
        <Divider sx={{ width: '140%' }} />
        <Button
          onClick={handleLogOut}
          sx={{ width: '100%', color: 'black', justifyContent: 'flex-start' }}
        >
          로그아웃
        </Button>
        <Divider sx={{ width: '100%' }} />
        <Button
          onClick={handleUnregister}
          sx={{ width: '100%', color: 'grey', justifyContent: 'flex-start' }}
        >
          회원탈퇴
        </Button>
        <Divider sx={{ width: '100%' }} />
        <Button
          onClick={handleLogOut2}
          sx={{ width: '100%', color: 'grey', justifyContent: 'flex-start' }}
        >
          로그아웃2
        </Button>
        <Divider sx={{ width: '100%' }} />
      </Container>
    </Container>
  )
}
