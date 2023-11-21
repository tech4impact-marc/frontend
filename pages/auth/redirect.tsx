import axios from 'axios'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

import { store } from '@/redux/store'

export default function KakaoLoginRedirectPage() {
  const router = useRouter()

  useEffect(() => {
    axios
      .post(
        'http://localhost:3000/auth/kakao/login/done',
        {},
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
        store.dispatch({ type: 'SET_TOKENS', payload: response.data })
        store.dispatch({
          type: 'SET_ACCESSTOKEN_EXPIRESAT',
          payload: Date.now() + response.data.expiresIn * 1000,
        })
        store.dispatch({
          type: 'SET_REFRESHTOKEN_EXPIRESAT',
          payload: Date.now() + response.data.refreshTokenExpiresIn * 1000,
        })

        router.push('/')
      })
      .catch((error) => {
        console.error('Error occured:', error)
      })
  }, [])

  return (
    <>
      Redirecting.. You will move to <b>main page</b> soon.
    </>
  )
}
