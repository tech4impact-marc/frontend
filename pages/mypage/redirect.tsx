import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

import { store } from '@/redux/store'
import instance from '@/util/axios_interceptor'

import refreshAccessToken from '../api/refreshAccessToken'

export default function MyPageRedirectPage() {
  const router = useRouter()

  useEffect(() => {
    refreshAccessToken()
    const state = store.getState()
    if (Object.keys(state.tokens).length !== 0) {
      const accessToken = state.tokens.accessToken
      instance
        .get(`/auth/users/self/info`)
        .then((response) => {
          store.dispatch({ type: 'SET_USER', payload: response.data })
          router.push('/mypage')
        })
        .catch((error) => {
          console.error('Error occured:', error)
        })
    } else {
      console.log('jwtToken is not available.')
      router.push('/auth/login')
    }
  }, [])

  return <>Redirecting.. 로그인 되어있을 시 마이페이지로, 아닐 시 로그인 페이지로 이동합니다.</>
}
