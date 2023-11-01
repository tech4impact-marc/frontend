import axios from 'axios'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

export default function KakaoLoginRedirectPage() {
  const router = useRouter()
  useEffect(() => {
    const postData = {}
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
        const receivedToken = JSON.stringify(response.data)
        //json을 stringify해서 세션스토리지에 저장

        sessionStorage.setItem('jwtToken', receivedToken)
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
