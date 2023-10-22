import axios from 'axios'
import { useRouter } from 'next/router'
import React from 'react'

export default function KakaoLoginRedirectPage() {
  const postData = {}
  const router = useRouter()

  axios
    .post('http://localhost:3000/auth/kakao/login/done', postData, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    })
    .then((response) => {
      if (response.status !== 200) {
        throw new Error('Network response was not ok')
      }
      const receivedToken = response.data.token
      console.log('Server Response:', receivedToken)

      sessionStorage.setItem('jwtToken', receivedToken)
      router.push('/main')
    })
    .catch((error) => {
      console.error('Error occured:', error)
    })

  return (
    <>
      Redirecting.. You will move to <b>main page</b> soon.
    </>
  )
}
