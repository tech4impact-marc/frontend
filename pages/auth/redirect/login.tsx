import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

import { store } from '@/redux/store'
import instance from '@/util/axios_interceptor'

export default function KakaoLoginRedirectPage() {
  const router = useRouter()
  const state = store.getState()

  useEffect(() => {
    instance
      .post(`/auth/kakao/login/done`, state.loginState, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      })
      .then((response) => {
        if (response.status !== 200) {
          throw new Error('Network response was not ok')
        }
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
