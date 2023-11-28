import axios from 'axios'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

import { store } from '@/redux/store'

import refreshAccessToken from '../api/refreshAccessToken'

export default function MyPageRedirectPage() {
  const router = useRouter()

  useEffect(() => {
    refreshAccessToken()
    const state = store.getState()
    if (Object.keys(state.tokens).length !== 0) {
      const accessToken = state.tokens.accessToken
      axios
        .get(`${process.env.NEXT_PUBLIC_IP_ADDRESS}/auth/users/self/info`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        })
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
