import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

import refreshAccessToken from '@/pages/api/refreshAccessToken'
import { store } from '@/redux/store'
import instance from '@/util/axios_interceptor'

export default function KakaoLogoutRedirectPage() {
  const router = useRouter()

  useEffect(() => {
    async function logout() {
      try {
        const jwtToken = await refreshAccessToken()
        console.log(jwtToken)
        const response = await instance.post(`/auth/logout`)
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
    }

    logout()
  }, [])

  return (
    <>
      Redirecting.. You will move to <b>main page</b> soon.
    </>
  )
}
