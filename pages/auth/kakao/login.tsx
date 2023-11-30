import axios from 'axios'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

export default function KakaoLoginPREPage() {
  const router = useRouter()

  useEffect(() => {
    async function loginPre() {
      const urlParams = new URLSearchParams(window.location.search)
      console.log(urlParams)
      const myParam = urlParams.get('code')
      console.log(myParam)
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_IP_ADDRESS}/auth/login`, {
          params: { code: myParam },
        })
        if (response.status !== 200) {
          throw new Error('Network response was not ok')
        }

        if (response.data.loginstate === 'SIGNUP') {
          router.push('/auth/signup-1')
        } else if (response.data.loginstate === 'LOGIN') {
          router.push('/auth/redirect/login')
        }
      } catch (error) {
        console.error('오류가 발생했습니다.', error)
      }
    }

    loginPre()
  }, [])

  return (
    <>
      Redirecting.. You will move to <b>main page</b> soon.
    </>
  )
}
