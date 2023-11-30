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

      function setCookie(name: any, value: any, days?: any) {
        var expires = ''
        if (days) {
          var date = new Date()
          date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
          expires = '; expires=' + date.toUTCString()
        }
        document.cookie = name + '=' + (value || '') + expires + '; path=/'
      }
      function getCookie(name: any) {
        var nameEQ = name + '='
        var ca = document.cookie.split(';')
        for (var i = 0; i < ca.length; i++) {
          var c = ca[i]
          while (c.charAt(0) == ' ') c = c.substring(1, c.length)
          if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length)
        }
        return null
      }

      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_IP_ADDRESS}/auth/kakao/login`, {
          params: { code: myParam },
          withCredentials: true,
        })
        // const setCookieHeader = response?.headers?.get('Set-Cookie');
        // console.log(setCookieHeader);
        const sessionCookie = getCookie('sessioncookie')
        setCookie('sessioncookie', sessionCookie)
        // console.log(response.headers.getSetCookie());

        if (response.status !== 200) {
          throw new Error('Network response was not ok')
        }

        if (response.data.loginState === 'SIGNUP') {
          router.push('/auth/signup-1')
        } else if (response.data.loginState === 'LOGIN') {
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
